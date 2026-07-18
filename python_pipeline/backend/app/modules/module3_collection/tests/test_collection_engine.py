import pytest
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.database.models import Base, Invoice, Customer
from app.modules.module3_collection.services.collection_service import CollectionService

@pytest.fixture
def db_session():
    # Set up in-memory SQLite engine for tests isolation
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session = Session(bind=engine)
    yield session
    session.close()

@pytest.fixture
def service():
    return CollectionService()

def test_new_customer(db_session, service):
    # Customer has only 1 invoice (unpaid, recently created, not overdue yet)
    today = datetime.date(2026, 7, 15)
    
    cust = Customer(id="cust-new", company_id="comp-1", customer_name="New Buyer Inc")
    db_session.add(cust)
    
    inv = Invoice(
        id="inv-1",
        company_id="comp-1",
        invoice_number="INV-NEW",
        invoice_date="2026-07-10",
        due_date="2026-08-10",
        total_amount=5000.0,
        payment_status="UNPAID",
        customer_id="cust-new"
    )
    db_session.add(inv)
    db_session.commit()

    report = service.analyze_invoice_collection(db_session, "INV-NEW", today=today)
    
    assert report is not None
    assert report.customer_profile.customer_reliability_score == 100.0
    assert report.priority_level == "Low"
    assert report.collection_risk.risk_level == "Very Low"
    assert report.collection_probability >= 90.0

def test_reliable_customer(db_session, service):
    # Customer has paid prior invoices on time, current unpaid invoice is not overdue
    today = datetime.date(2026, 7, 15)
    
    cust = Customer(id="cust-rel", company_id="comp-1", customer_name="Reliable Buyer")
    db_session.add(cust)
    
    inv1 = Invoice(
        id="inv-2",
        company_id="comp-1",
        invoice_number="INV-PAID-1",
        invoice_date="2026-06-01",
        due_date="2026-07-01",
        total_amount=3000.0,
        payment_status="PAID",
        customer_id="cust-rel"
    )
    inv2 = Invoice(
        id="inv-3",
        company_id="comp-1",
        invoice_number="INV-UNPAID-2",
        invoice_date="2026-07-10",
        due_date="2026-08-10",
        total_amount=4000.0,
        payment_status="UNPAID",
        customer_id="cust-rel"
    )
    db_session.add_all([inv1, inv2])
    db_session.commit()

    report = service.analyze_invoice_collection(db_session, "INV-UNPAID-2", today=today)
    
    assert report.customer_profile.on_time_payment_percentage == 100.0
    assert report.priority_level == "Low"
    assert report.collection_probability >= 90.0

def test_chronic_late_payer(db_session, service):
    # Customer has paid invoice that was late, current invoice is overdue
    today = datetime.date(2026, 7, 15)
    
    cust = Customer(id="cust-late", company_id="comp-1", customer_name="Late Payer Corp")
    db_session.add(cust)
    
    inv1 = Invoice(
        id="inv-4",
        company_id="comp-1",
        invoice_number="INV-LATE-1",  # "LATE" in number flags payment delay in analytics engine mock
        invoice_date="2026-05-01",
        due_date="2026-06-01",
        total_amount=3000.0,
        payment_status="PAID",
        customer_id="cust-late"
    )
    inv2 = Invoice(
        # Current invoice overdue by 10 days
        id="inv-5",
        company_id="comp-1",
        invoice_number="INV-UNPAID-LATE",
        invoice_date="2026-06-05",
        due_date="2026-07-05",
        total_amount=4000.0,
        payment_status="UNPAID",
        customer_id="cust-late"
    )
    db_session.add_all([inv1, inv2])
    db_session.commit()

    report = service.analyze_invoice_collection(db_session, "INV-UNPAID-LATE", today=today)
    
    assert report.customer_profile.avg_payment_delay > 0.0
    assert report.customer_profile.customer_reliability_score < 100.0
    assert report.collection_probability < 95.0

def test_large_outstanding_invoice(db_session, service):
    # Invoice total is extremely large
    today = datetime.date(2026, 7, 15)
    
    cust = Customer(id="cust-rich", company_id="comp-1", customer_name="Wholesale Buyer")
    db_session.add(cust)
    
    inv = Invoice(
        id="inv-6",
        company_id="comp-1",
        invoice_number="INV-LARGE",
        invoice_date="2026-07-05",
        due_date="2026-07-10",  # Overdue by 5 days
        total_amount=600000.0,  # > 500,000 INR
        payment_status="UNPAID",
        customer_id="cust-rich"
    )
    db_session.add(inv)
    db_session.commit()

    report = service.analyze_invoice_collection(db_session, "INV-LARGE", today=today)
    
    assert "LARGE_OUTSTANDING_BALANCE" in report.reason_codes
    assert report.priority_score > 30.0

def test_high_liquidity_risk_impact(db_session, service):
    today = datetime.date(2026, 7, 15)
    
    cust = Customer(id="cust-liq", company_id="comp-1", customer_name="Liquid Inc")
    db_session.add(cust)
    
    inv = Invoice(
        id="inv-7",
        company_id="comp-1",
        invoice_number="INV-LIQ",
        invoice_date="2026-07-05",
        due_date="2026-07-10",  # Overdue by 5 days
        total_amount=5000.0,
        payment_status="UNPAID",
        customer_id="cust-liq"
    )
    db_session.add(inv)
    db_session.commit()

    # Process with High liquidity risk context
    report = service.analyze_invoice_collection(db_session, "INV-LIQ", liquidity_risk="High", today=today)
    
    assert "LIQUIDITY_DEFICIT_TRIGGER" in report.reason_codes
    assert report.priority_score > 15.0

def test_all_overdue_ranking_positions(db_session, service):
    today = datetime.date(2026, 7, 15)
    
    cust1 = Customer(id="c-1", company_id="comp-1", customer_name="Customer 1")
    cust2 = Customer(id="c-2", company_id="comp-1", customer_name="Customer 2")
    db_session.add_all([cust1, cust2])
    
    # inv1: small amount, not overdue
    inv1 = Invoice(
        id="inv-8",
        company_id="comp-1",
        invoice_number="INV-A",
        invoice_date="2026-07-10",
        due_date="2026-08-10",
        total_amount=500.0,
        payment_status="UNPAID",
        customer_id="c-1"
    )
    # inv2: large amount, overdue by 35 days (Critical priority)
    inv2 = Invoice(
        id="inv-9",
        company_id="comp-1",
        invoice_number="INV-B",
        invoice_date="2026-05-10",
        due_date="2026-06-10",
        total_amount=600000.0,
        payment_status="UNPAID",
        customer_id="c-2"
    )
    db_session.add_all([inv1, inv2])
    db_session.commit()

    reports = service.analyze_all_overdue_collections(db_session, today=today)
    
    # Assert sorted ranking
    assert len(reports) == 2
    assert reports[0].invoice_id == "INV-B"
    assert reports[0].ranking_position == 1
    assert reports[1].invoice_id == "INV-A"
    assert reports[1].ranking_position == 2
