import pytest
import datetime
import json
from unittest.mock import patch, MagicMock, AsyncMock
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.database.models import Base
from app.modules.module3_collection.schemas.invoice_context_schema import InvoiceContext
from app.modules.module3_collection.schemas.customer_profile_schema import CustomerFinancialProfile
from app.modules.module3_collection.schemas.collection_risk_schema import CollectionRisk
from app.modules.module3_collection.schemas.collection_report_schema import CollectionIntelligenceReport
from app.modules.module3_collection.schemas.communication_schema import CommunicationRecommendation
from app.integrations.ai.ai_gateway import AIGateway
from app.integrations.communication.communication_gateway import CommunicationGateway
from app.modules.module3_collection.services.workflow_service import WorkflowService

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session = Session(bind=engine)
    yield session
    session.close()

INVOICE_ID = "INV-E2E001"  # No dash-digit suffix to avoid hallucination regex ambiguity

def mock_collection_report() -> CollectionIntelligenceReport:
    context = InvoiceContext(
        invoice_id=INVOICE_ID,
        amount=5000.0,
        outstanding_balance=5000.0,
        invoice_age_days=15,
        due_date="2026-07-10",
        days_overdue=5,
        payment_terms="Net 30",
        reminder_count=0,
        customer_id="cust-e2e",
        customer_name="E2E Corp",
        payment_status="UNPAID"
    )
    profile = CustomerFinancialProfile(
        avg_payment_delay=0.0,
        late_payment_percentage=0.0,
        on_time_payment_percentage=100.0,
        payment_frequency="Medium",
        average_invoice_value=5000.0,
        outstanding_balance=5000.0,
        historical_collection_success=100.0,
        collection_response_rate=100.0,
        customer_lifetime_days=180,
        customer_reliability_score=85.0
    )
    risk = CollectionRisk(
        risk_score=15.0,
        risk_level="Low",
        collection_probability=85.0,
        expected_collection_days=10,
        contributing_factors=[]
    )
    return CollectionIntelligenceReport(
        company_id="comp-e2e",
        generated_timestamp="2026-07-15T00:00:00Z",
        invoice_id=INVOICE_ID,
        customer_profile=profile,
        invoice_context=context,
        priority_score=35.0,
        priority_level="Low",
        collection_risk=risk,
        collection_probability=85.0,
        expected_collection_days=10,
        ranking_position=1,
        reason_codes=[],
        supporting_metrics={"liquidity_risk": "Low"}
    )

@pytest.mark.anyio
async def test_end_to_end_integration_flow(db_session):
    report = mock_collection_report()
    ai_gateway = AIGateway()

    # Wire deterministic mock responses directly onto the client
    call_counter = {"n": 0}
    responses = [
        # Call 1: Email
        json.dumps({
            "email_subject": f"Payment Reminder: Invoice {INVOICE_ID}",
            "email_body": f"Please pay your outstanding invoice {INVOICE_ID}.",
            "tone": "Friendly",
            "communication_goal": "Collect balance"
        }),
        # Call 2: SMS
        json.dumps({"sms_body": f"Reminder: Settle {INVOICE_ID}."}),
        # Call 3: WhatsApp
        json.dumps({"whatsapp_body": f"Reminder: {INVOICE_ID}. Pay: [payment_link]"}),
        # Call 4: Explanation
        json.dumps({"explanation": f"Invoice {INVOICE_ID} prioritized due to 5 days overdue."}),
    ]

    async def mocked_execute_chat(prompt):
        n = call_counter["n"]
        call_counter["n"] += 1
        return responses[n] if n < len(responses) else "{}"

    ai_gateway.service.client.execute_chat = mocked_execute_chat

    context_dict = {
        "invoice_id": report.invoice_context.invoice_id,
        "amount": report.invoice_context.amount,
        "outstanding_balance": report.invoice_context.outstanding_balance,
        "due_date": report.invoice_context.due_date,
        "days_overdue": report.invoice_context.days_overdue,
        "customer_name": report.invoice_context.customer_name
    }

    # 3. AI Gateway (Gemma inference)
    email_data = await ai_gateway.generate_email(context_dict, "Friendly")
    sms_data = await ai_gateway.generate_sms(context_dict, "Friendly")
    wa_data = await ai_gateway.generate_whatsapp(context_dict, "Friendly")
    exp_data = await ai_gateway.generate_explanation(report.invoice_context.invoice_id, [], context_dict)

    # Validate AI outputs before building recommendation
    assert "email_subject" in email_data, f"Email generation failed: {email_data}"
    assert "sms_body" in sms_data, f"SMS generation failed: {sms_data}"
    assert "whatsapp_body" in wa_data, f"WhatsApp generation failed: {wa_data}"
    assert "explanation" in exp_data, f"Explanation generation failed: {exp_data}"

    recommendation = CommunicationRecommendation(
        invoice_id=report.invoice_context.invoice_id,
        communication_channel="Email",
        tone="Friendly",
        email=email_data,
        sms=sms_data["sms_body"],
        whatsapp=wa_data["whatsapp_body"],
        priority_level="Low",
        requires_manager_approval=False,
        gemma_explanation=exp_data["explanation"],
        generated_timestamp="2026-07-15T00:00:00Z"
    )

    # 4. Workflow Engine evaluation
    workflow_service = WorkflowService()
    workflow_report = workflow_service.process_workflow(
        session=db_session,
        report=report,
        recommendation=recommendation,
        today=datetime.date(2026, 7, 15)
    )

    assert workflow_report.workflow_status == "OPEN"
    assert workflow_report.next_action == "SEND_EMAIL"

    # 5. Communication Gateway dispatch — always use EMAIL channel directly
    comm_gateway = CommunicationGateway()
    # Disable sleep for exponential backoff during tests
    comm_gateway.retry_manager.disable_sleep = True

    # Build synchronous mock httpx response
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"messageId": "e2e-mock-msg-id"}

    with patch("httpx.AsyncClient.post", new=AsyncMock(return_value=mock_response)):
        success = await comm_gateway.send_message(
            session=db_session,
            invoice_id=workflow_report.invoice_id,
            channel="EMAIL",  # Route explicitly via EMAIL channel
            recipient="recipient@e2e-test.com",
            subject=recommendation.email["email_subject"],
            body=recommendation.email["email_body"]
        )

    assert success is True

    # Verify delivery log added to audit trail
    from app.database.models import SystemAuditTrail
    audits = db_session.query(SystemAuditTrail).filter(
        SystemAuditTrail.record_id == INVOICE_ID
    ).all()
    assert len(audits) > 0
