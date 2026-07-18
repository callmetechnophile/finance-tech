import pytest
import datetime
from unittest.mock import patch
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.database.models import Base, Invoice, Vendor
from app.modules.module4_payments.repositories.vendor_repository import VendorRepository
from app.modules.module4_payments.services.vendor_analytics_service import VendorAnalyticsService
from app.modules.module4_payments.services.bill_intelligence_service import BillIntelligenceService
from app.modules.module4_payments.services.payment_optimization_engine import PaymentOptimizationEngine
from app.modules.module4_payments.services.treasury_service import TreasuryService

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.fixture
def db_session():
    # Setup SQLite memory database
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session = Session(bind=engine)
    
    # Seed mock data
    company_id = "apex-manufacturing-uuid"
    
    # 1. Vendors
    v1 = Vendor(id="v-1", company_id=company_id, vendor_name="Steel Co", tax_id="TAX-1")
    v2 = Vendor(id="v-2", company_id=company_id, vendor_name="Energy Corp", tax_id="TAX-2")
    session.add_all([v1, v2])
    session.commit()

    # 2. Invoices (Bills are Invoices with vendor_id != None)
    # Bill 1: Discount eligible
    b1 = Invoice(
        id="bill-1",
        company_id=company_id,
        vendor_id="v-1",
        invoice_number="INV-S1",
        invoice_date="2026-07-10",
        due_date="2026-07-30",
        payment_terms="2/10 Net 30",
        total_amount=10000.0,
        payment_status="UNPAID",
        category="Raw Materials"
    )
    # Bill 2: Overdue (Penalty active)
    b2 = Invoice(
        id="bill-2",
        company_id=company_id,
        vendor_id="v-2",
        invoice_number="INV-E1",
        invoice_date="2026-06-01",
        due_date="2026-07-01",
        payment_terms="Net 30",
        total_amount=5000.0,
        payment_status="UNPAID",
        category="Utilities"
    )
    # Bill 3: Fully paid
    b3 = Invoice(
        id="bill-3",
        company_id=company_id,
        vendor_id="v-1",
        invoice_number="INV-S2",
        invoice_date="2026-06-15",
        due_date="2026-07-15",
        payment_terms="Net 30",
        total_amount=8000.0,
        payment_status="PAID",
        category="Raw Materials"
    )
    session.add_all([b1, b2, b3])
    session.commit()

    yield session
    session.close()

def test_vendor_analytics(db_session):
    service = VendorAnalyticsService()
    # Check Steel Co spend and dependency metrics
    res = service.calculate_vendor_analytics(db_session, "v-1", today=datetime.date(2026, 7, 15))
    
    assert res.vendor_name == "Steel Co"
    # Outstanding payables = only b1 ($10,000)
    assert res.outstanding_payables == 10000.0
    # Average spend = (b1 + b3) / 2 = (10000 + 8000) / 2 = 9000.0
    assert res.average_spend == 9000.0
    # Total spend across all invoices = 10000 + 5000 + 8000 = 23000
    # Dependency = (18000 / 23000) * 100
    assert res.vendor_dependency > 70.0
    assert res.is_critical is True

def test_bill_intelligence(db_session):
    service = BillIntelligenceService()
    repo = VendorRepository()
    
    bill = repo.get_vendor_bills(db_session, "v-1")[0]
    res = service.analyze_bill(bill, "Steel Co", today=datetime.date(2026, 7, 15))
    
    assert res.invoice_number == "INV-S1"
    # invoice date = 2026-07-10, discount days = 10, deadline = 2026-07-20
    # today = 2026-07-15 is <= 2026-07-20 -> discount eligible!
    assert res.discount_eligible is True
    assert res.discount_savings == 200.0  # 2% of 10000

    overdue_bill = repo.get_vendor_bills(db_session, "v-2")[0]
    res_overdue = service.analyze_bill(overdue_bill, "Energy Corp", today=datetime.date(2026, 7, 15))
    # due date = 2026-07-01, today = 2026-07-15 -> 14 days overdue
    assert res_overdue.days_overdue == 14
    assert res_overdue.penalty_cost > 0.0

def test_payment_optimization_constraints(db_session):
    # Optimize payments under restricted cash buffer constraints
    service = BillIntelligenceService()
    repo = VendorRepository()
    
    unpaid = repo.get_all_unpaid_bills(db_session)
    
    # Correctly map vendor names to prevent assertion errors
    bills = []
    for b in unpaid:
        v_name = "Steel Co" if b.vendor_id == "v-1" else "Energy Corp"
        bills.append(service.analyze_bill(b, v_name, today=datetime.date(2026, 7, 15)))
    
    optimizer = PaymentOptimizationEngine()
    
    # Case A: Ample Cash
    res_ample = optimizer.optimize_schedule(
        current_cash=100000.0,
        minimum_cash_buffer=20000.0,
        max_daily_payments=50000.0,
        bills=bills,
        today=datetime.date(2026, 7, 15)
    )
    # Both bills should be recommended for payout
    pay_now_count = sum(1 for r in res_ample if r.recommendation == "PAY_NOW")
    assert pay_now_count == 2

    # Case B: Cash Buffer Violation (Disbursements restricted)
    # Total bills = 15,000. Starting cash = 25,000. Safety buffer = 15,000.
    # Disbursing all would leave 10,000 cash (< 15,000 buffer).
    # Critical raw materials (Steel Co) should be prioritized; less critical utility (Energy Corp) delayed.
    res_restricted = optimizer.optimize_schedule(
        current_cash=25000.0,
        minimum_cash_buffer=15000.0,
        max_daily_payments=50000.0,
        bills=bills,
        today=datetime.date(2026, 7, 15)
    )
    # Only Steel Co (priority Critical) is recommended as PAY_NOW; Energy Corp delayed.
    pay_now_rec = [r for r in res_restricted if r.recommendation == "PAY_NOW"]
    assert len(pay_now_rec) == 1
    assert pay_now_rec[0].vendor_name == "Steel Co"

@pytest.mark.anyio
async def test_treasury_orchestrator(db_session):
    # Mock AIGateway to prevent live NIM request
    with patch("app.integrations.ai.nim_client.NIMClient.execute_chat") as mock_chat:
        mock_chat.return_value = '{"summary": "Mock explanation"}'
        
        service = TreasuryService()
        res = await service.optimize_treasury(db_session, today=datetime.date(2026, 7, 15))
        
        assert res.starting_cash > 0.0
        assert len(res.payment_queue) == 2
        assert res.gemma_explanation is not None
