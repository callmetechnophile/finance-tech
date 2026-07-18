import pytest
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.database.models import Base
from app.modules.module3_collection.schemas.invoice_context_schema import InvoiceContext
from app.modules.module3_collection.schemas.customer_profile_schema import CustomerFinancialProfile
from app.modules.module3_collection.schemas.collection_risk_schema import CollectionRisk
from app.modules.module3_collection.schemas.collection_report_schema import CollectionIntelligenceReport
from app.modules.module3_collection.schemas.communication_schema import CommunicationRecommendation
from app.modules.module3_collection.services.workflow_service import WorkflowService

@pytest.fixture
def db_session():
    # Setup test sqlite in-memory database
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session = Session(bind=engine)
    yield session
    session.close()

@pytest.fixture
def service():
    return WorkflowService()

def mock_intelligence_report(
    invoice_id: str = "INV-WF-1",
    amount: float = 5000.0,
    days_overdue: int = 5,
    reminder_count: int = 0,
    reliability_score: float = 90.0,
    payment_status: str = "UNPAID",
    probability: float = 95.0,
    risk_level: str = "Low"
) -> CollectionIntelligenceReport:
    
    context = InvoiceContext(
        invoice_id=invoice_id,
        amount=amount,
        outstanding_balance=0.0 if payment_status == "PAID" else amount,
        invoice_age_days=days_overdue + 30,
        due_date="2026-07-10",
        days_overdue=days_overdue,
        payment_terms="Net 30",
        reminder_count=reminder_count,
        customer_id="cust-1",
        customer_name="Test Customer",
        payment_status=payment_status
    )
    profile = CustomerFinancialProfile(
        avg_payment_delay=0.0,
        late_payment_percentage=0.0,
        on_time_payment_percentage=100.0,
        payment_frequency="High",
        average_invoice_value=amount,
        outstanding_balance=0.0 if payment_status == "PAID" else amount,
        historical_collection_success=100.0,
        collection_response_rate=100.0,
        customer_lifetime_days=365,
        customer_reliability_score=reliability_score
    )
    risk = CollectionRisk(
        risk_score=10.0,
        risk_level=risk_level,
        collection_probability=probability,
        expected_collection_days=10,
        contributing_factors=[]
    )
    return CollectionIntelligenceReport(
        company_id="comp-1",
        generated_timestamp="2026-07-15T00:00:00Z",
        invoice_id=invoice_id,
        customer_profile=profile,
        invoice_context=context,
        priority_score=40.0,
        priority_level="Medium",
        collection_risk=risk,
        collection_probability=probability,
        expected_collection_days=10,
        ranking_position=1,
        reason_codes=[],
        supporting_metrics={"liquidity_risk": "Low"}
    )

def mock_recommendation(invoice_id: str, tone: str = "Friendly") -> CommunicationRecommendation:
    return CommunicationRecommendation(
        invoice_id=invoice_id,
        communication_channel="Email",
        tone=tone,
        email={"email_subject": "Reminder", "email_body": "Please pay", "tone": tone, "communication_goal": "Collect"},
        sms="Please pay invoice",
        whatsapp="Please pay invoice link",
        priority_level="Medium",
        requires_manager_approval=False,
        gemma_explanation="Explanation why prioritized",
        generated_timestamp="2026-07-15T00:00:00Z"
    )

def test_workflow_reminder_scheduling_and_weekends(db_session, service):
    today = datetime.date(2026, 7, 15)  # Wednesday
    report = mock_intelligence_report(days_overdue=5, reminder_count=0)
    rec = mock_recommendation("INV-WF-1", tone="Friendly")
    
    workflow_report = service.process_workflow(db_session, report, rec, today=today)
    
    # First reminder is scheduled today (2026-07-15) which is a Wednesday
    assert workflow_report.reminder_schedule.next_reminder_date == "2026-07-15"
    assert workflow_report.reminder_schedule.remaining_attempts == 4
    assert workflow_report.next_action == "SEND_EMAIL"

    # Test Saturday weekend adjustment
    # If last reminder was sent today (Wednesday), and min_interval = 3 days, next date is Saturday 2026-07-18
    # It must be adjusted to Monday 2026-07-20
    schedule_weekend = service.scheduler.calculate_schedule(
        reminder_count=1,
        last_reminder_date_str="2026-07-15",
        max_attempts=4,
        min_interval_days=3,
        today=today
    )
    assert schedule_weekend.next_reminder_date == "2026-07-20"  # Monday

def test_reminder_limits_escalation(db_session, service):
    today = datetime.date(2026, 7, 15)
    # Reminder count = 4 (Limit reached)
    report = mock_intelligence_report(days_overdue=35, reminder_count=4)
    rec = mock_recommendation("INV-WF-1", tone="Firm")
    
    workflow_report = service.process_workflow(db_session, report, rec, today=today)
    
    assert workflow_report.reminder_schedule.status == "OVERLIMIT"
    assert workflow_report.reminder_schedule.remaining_attempts == 0
    assert workflow_report.next_action == "ESCALATE_MANAGER"
    assert workflow_report.workflow_status == "ESCALATED"

def test_approval_thresholds(db_session, service):
    today = datetime.date(2026, 7, 15)
    
    # Scenario A: Invoice Amount > ₹500,000 INR (e.g. 600,000) -> Manager Approval Required
    report = mock_intelligence_report(amount=600000.0, days_overdue=10)
    rec = mock_recommendation("INV-LARGE", tone="Friendly")
    workflow_report = service.process_workflow(db_session, report, rec, today=today)
    
    assert workflow_report.approval_status.approval_required is True
    assert workflow_report.approval_status.approval_level == "Manager"
    assert workflow_report.workflow_status == "PENDING_APPROVAL"
    assert workflow_report.next_action == "ESCALATE_MANAGER"

    # Scenario B: Final Notice tone -> Finance Manager Approval Required
    report_b = mock_intelligence_report(amount=5000.0, days_overdue=35, reminder_count=2)
    rec_b = mock_recommendation("INV-FINAL", tone="Final Notice")
    workflow_report_b = service.process_workflow(db_session, report_b, rec_b, today=today)
    
    assert workflow_report_b.approval_status.approval_required is True
    assert workflow_report_b.approval_status.approval_level == "Finance Manager"
    assert workflow_report_b.workflow_status == "PENDING_APPROVAL"

def test_escalation_engine_levels(db_session, service):
    today = datetime.date(2026, 7, 15)

    # Overdue > 90 days -> Level 6 (Legal Review)
    report_legal = mock_intelligence_report(days_overdue=95, reminder_count=3)
    rec_legal = mock_recommendation("INV-LEGAL", tone="Friendly")
    workflow_legal = service.process_workflow(db_session, report_legal, rec_legal, today=today)
    
    assert workflow_legal.escalation_level == "Level 6"
    assert workflow_legal.next_action == "LEGAL_REVIEW"
    assert workflow_legal.workflow_status == "ESCALATED"

def test_task_creation_rules(db_session, service):
    today = datetime.date(2026, 7, 15)
    
    # Customer reliability < 40 -> Verify contact info task generated
    report = mock_intelligence_report(days_overdue=25, reminder_count=2, reliability_score=35.0)
    rec = mock_recommendation("INV-TASK", tone="Firm")
    workflow_report = service.process_workflow(db_session, report, rec, today=today)
    
    assert len(workflow_report.generated_tasks) >= 1
    # Check that it contains verify contact details task
    assert any("Verify contact details" in t.title for t in workflow_report.generated_tasks)

def test_dispatcher_queueing(db_session, service):
    today = datetime.date(2026, 7, 15)
    report = mock_intelligence_report(invoice_id="INV-DISPATCH", days_overdue=5, reminder_count=0)
    rec = mock_recommendation("INV-DISPATCH", tone="Friendly")
    
    service.dispatcher.clear_queue()
    workflow_report = service.process_workflow(db_session, report, rec, today=today)
    
    assert workflow_report.dispatch_status == "SUCCESS"
    assert len(service.dispatcher.dispatch_queue) == 1
    assert service.dispatcher.dispatch_queue[0]["invoice_id"] == "INV-DISPATCH"
    assert service.dispatcher.dispatch_queue[0]["type"] == "EMAIL"

def test_invoice_closure_upon_payment(db_session, service):
    today = datetime.date(2026, 7, 15)
    report = mock_intelligence_report(payment_status="PAID")
    rec = mock_recommendation("INV-CLOSED", tone="Friendly")
    
    workflow_report = service.process_workflow(db_session, report, rec, today=today)
    
    assert workflow_report.workflow_status == "CLOSED"
    assert workflow_report.next_action == "CLOSE_CASE"

def test_duplicate_reminder_prevention(db_session, service):
    today = datetime.date(2026, 7, 15)
    report = mock_intelligence_report(days_overdue=10, reminder_count=1)
    rec = mock_recommendation("INV-DUP", tone="Professional")
    
    # Last reminder sent 2 days ago (< 7 days min_interval)
    workflow_report = service.process_workflow(
        db_session, report, rec, last_reminder_date="2026-07-13", today=today
    )
    
    assert workflow_report.reminder_schedule.status == "COOLING_DOWN"
    # Should not queue to dispatcher
    assert workflow_report.dispatch_status == "PENDING"
