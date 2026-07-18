import pytest
import json
import datetime
from unittest.mock import patch, AsyncMock
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.database.models import Base, Invoice, Customer, CommunicationLog
from app.modules.module3_collection.services.collection_service import CollectionService
from app.modules.module3_collection.services.communication_service import CommunicationService
from app.modules.module3_collection.ai.tone_selector import ToneSelector
from app.modules.module3_collection.services.response_validator import ResponseValidator

@pytest.fixture
def db_session():
    # Setup test sqlite in-memory database
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session = Session(bind=engine)
    yield session
    session.close()

@pytest.fixture
def comm_service():
    return CommunicationService()

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.fixture
def collection_service():
    return CollectionService()

@pytest.mark.anyio
async def test_tone_selector():
    selector = ToneSelector()
    # No reminders, low priority -> Friendly
    assert selector.select_tone("Low", 0, "Low") == "Friendly"
    # No reminders, high priority -> Firm
    assert selector.select_tone("High", 0, "Low") == "Firm"
    # 1 reminder -> Professional
    assert selector.select_tone("High", 1, "Medium") == "Professional"
    # 2 reminders -> Firm
    assert selector.select_tone("High", 2, "High") == "Firm"
    # 3 reminders -> Legal Escalation
    assert selector.select_tone("Low", 3, "Low") == "Legal Escalation"
    # Critical risk & 2 reminders -> Final Notice
    assert selector.select_tone("Low", 2, "Critical") == "Final Notice"

@pytest.mark.anyio
async def test_response_validator():
    validator = ResponseValidator()
    
    # Valid email JSON
    raw_email = '{"email_subject": "Reminder", "email_body": "Please pay INV-123", "tone": "Friendly"}'
    valid, err = validator.validate_email_response(raw_email, "INV-123", 5000.0)
    assert valid is True

    # Hallucinated invoice ID
    raw_email_hallucinated = '{"email_subject": "Reminder", "email_body": "Please pay INV-999", "tone": "Friendly"}'
    valid, err = validator.validate_email_response(raw_email_hallucinated, "INV-123", 5000.0)
    assert valid is False
    assert "Hallucinated incorrect invoice ID" in err

    # Valid SMS JSON
    raw_sms = '{"sms_body": "Short reminder"}'
    valid, err = validator.validate_sms_response(raw_sms)
    assert valid is True

    # Too long SMS
    long_sms_text = "x" * 321
    raw_sms_long = json.dumps({"sms_body": long_sms_text})
    valid, err = validator.validate_sms_response(raw_sms_long)
    assert valid is False

@pytest.mark.anyio
@patch("app.modules.module3_collection.ai.gemma_client.GemmaClient.generate_response")
async def test_friendly_and_professional_reminders(mock_generate, db_session, comm_service, collection_service):
    # Setup database record
    today = datetime.date(2026, 7, 15)
    cust = Customer(id="c-friendly", company_id="comp-1", customer_name="Friendly Customer")
    db_session.add(cust)
    
    inv = Invoice(
        id="inv-friendly",
        company_id="comp-1",
        invoice_number="INV-F",
        invoice_date="2026-07-10",
        due_date="2026-08-10",
        total_amount=5000.0,
        payment_status="UNPAID",
        customer_id="c-friendly"
    )
    db_session.add(inv)
    db_session.commit()

    # Mock Gemma responses matching expected schemas
    mock_generate.side_effect = [
        # Email response
        json.dumps({
            "email_subject": "Friendly Reminder: Invoice INV-F",
            "email_body": "Dear Customer, please clear invoice INV-F.",
            "tone": "Friendly",
            "communication_goal": "Establish contact"
        }),
        # SMS response
        json.dumps({"sms_body": "Friendly SMS reminder for INV-F."}),
        # WhatsApp response
        json.dumps({"whatsapp_body": "Friendly WhatsApp for INV-F. Pay here: [payment_link]"}),
        # Explanation response
        json.dumps({"explanation": "Prioritized because it is newly created."})
    ]

    report = collection_service.analyze_invoice_collection(db_session, "INV-F", today=today)
    recommendation = await comm_service.generate_communication_recommendations(db_session, report)

    assert recommendation.tone == "Friendly"
    assert recommendation.requires_manager_approval is False
    assert "INV-F" in recommendation.email["email_subject"]
    assert "Friendly SMS" in recommendation.sms

@pytest.mark.anyio
@patch("app.modules.module3_collection.ai.gemma_client.GemmaClient.generate_response")
async def test_firm_and_final_notice_escalations(mock_generate, db_session, comm_service, collection_service):
    # Setup database record
    today = datetime.date(2026, 7, 15)
    cust = Customer(id="c-escalated", company_id="comp-1", customer_name="Escalated Buyer")
    db_session.add(cust)
    
    # Overdue with 2 reminders already sent
    inv = Invoice(
        id="inv-escalated",
        company_id="comp-1",
        invoice_number="INV-ESC",
        invoice_date="2026-03-10", # Age > 90 days
        due_date="2026-06-10",  # Overdue by 35 days
        total_amount=600000.0,
        payment_status="UNPAID",
        customer_id="c-escalated"
    )
    # Late paid invoice to drop customer reliability below 70
    inv_late = Invoice(
        id="inv-late-paid",
        company_id="comp-1",
        invoice_number="INV-LATE-1",
        invoice_date="2026-05-01",
        due_date="2026-06-01",
        total_amount=3000.0,
        payment_status="PAID",
        customer_id="c-escalated"
    )
    db_session.add_all([inv, inv_late])
    db_session.commit()

    # Stub the repository reminder count helper or mock logs count. 
    # To pass 2 reminders to build_context, we can create mock logs.
    # Currently invoice_repository.get_reminder_logs returns [] so reminder count is 0 in default flow.
    # Let's mock get_reminder_logs to return 2 logs.
    with patch("app.modules.module3_collection.repositories.invoice_repository.InvoiceRepository.get_reminder_logs") as mock_logs:
        mock_logs.return_value = [{"id": 1}, {"id": 2}]

        # Mock responses
        mock_generate.side_effect = [
            json.dumps({
                "email_subject": "FINAL NOTICE: Invoice INV-ESC",
                "email_body": "This is your final notice to clear invoice INV-ESC.",
                "tone": "Final Notice",
                "communication_goal": "Secure final payment"
            }),
            json.dumps({"sms_body": "FINAL NOTICE: Clear outstanding amount for INV-ESC."}),
            json.dumps({"whatsapp_body": "FINAL NOTICE for INV-ESC. Pay: [payment_link]"}),
            json.dumps({"explanation": "Prioritized due to overdue days and low reliability."})
        ]

        report = collection_service.analyze_invoice_collection(db_session, "INV-ESC", liquidity_risk="Critical", today=today)
        # Verify reminder count compiled to 2
        assert report.invoice_context.reminder_count == 2
        
        recommendation = await comm_service.generate_communication_recommendations(db_session, report)
        
        # Verify escalation and manager approval flag
        assert recommendation.tone == "Final Notice"
        assert recommendation.requires_manager_approval is True

@pytest.mark.anyio
@patch("app.modules.module3_collection.ai.gemma_client.GemmaClient.generate_response")
async def test_invalid_json_fallback_behavior(mock_generate, db_session, comm_service, collection_service):
    # Setup database record
    today = datetime.date(2026, 7, 15)
    cust = Customer(id="c-fallback", company_id="comp-1", customer_name="Fallback Buyer")
    db_session.add(cust)
    
    inv = Invoice(
        id="inv-fallback",
        company_id="comp-1",
        invoice_number="INV-FALL",
        invoice_date="2026-07-10",
        due_date="2026-08-10",
        total_amount=5000.0,
        payment_status="UNPAID",
        customer_id="c-fallback"
    )
    db_session.add(inv)
    db_session.commit()

    # All responses from Gemma are malformed JSON
    mock_generate.return_value = "MALFORMED_NON_JSON_RESPONSE"

    report = collection_service.analyze_invoice_collection(db_session, "INV-FALL", today=today)
    recommendation = await comm_service.generate_communication_recommendations(db_session, report)

    # Should fall back to deterministic templates without raising exceptions
    assert recommendation is not None
    assert recommendation.tone == "Friendly"
    assert "Friendly Reminder" in recommendation.email["email_subject"]
    assert "INV-FALL" in recommendation.email["email_body"]
    assert "Reminder:" in recommendation.sms
    
    # Check that database logged the fallback flag
    logs = db_session.query(CommunicationLog).filter(CommunicationLog.invoice_id == "INV-FALL").all()
    assert len(logs) > 0
    assert any(log.fallback_used for log in logs)
