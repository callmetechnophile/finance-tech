import pytest
import json
from unittest.mock import patch, AsyncMock
from app.integrations.ai.ai_config import AIConfig
from app.integrations.ai.google_ai_client import GoogleAIClient
from app.integrations.ai.response_validator import ResponseValidator
from app.integrations.ai.ai_gateway import AIGateway

@pytest.fixture
def anyio_backend():
    return "asyncio"

def test_ai_config_defaults():
    config = AIConfig()
    assert config.base_url == "https://generativelanguage.googleapis.com/v1beta"
    assert config.model_name == "gemma-4"
    assert config.is_configured() is False  # Placeholder key in test environment

@pytest.mark.anyio
async def test_google_ai_client_offline_mock():
    client = GoogleAIClient()
    # Should run in mock mode when API key is missing or placeholder
    response = await client.execute_chat("Write email_subject and email_body")
    data = json.loads(response)
    assert "email_subject" in data
    assert "email_body" in data

def test_response_validator_markdown_cleanup():
    validator = ResponseValidator()
    raw = "```json\n{\n  \"email_subject\": \"Reminder\",\n  \"email_body\": \"Body\",\n  \"tone\": \"Friendly\"\n}\n```"
    valid, err = validator.validate_email_response(raw, "INV-123")
    assert valid is True
    assert err == ""

def test_response_validator_hallucination():
    validator = ResponseValidator()
    raw = "{\n  \"email_subject\": \"Reminder for INV-999\",\n  \"email_body\": \"Please pay\",\n  \"tone\": \"Friendly\"\n}"
    valid, err = validator.validate_email_response(raw, "INV-123")
    assert valid is False
    assert "Hallucinated invoice ID" in err

@pytest.mark.anyio
async def test_ai_gateway_validation_retry():
    """
    First call to GemmaService.generate_email returns malformed JSON via GoogleAIClient.
    Second call returns valid JSON. AIGateway must retry and return the valid output.
    """
    gateway = AIGateway()

    # Patch GoogleAIClient.execute_chat on the gateway's internal service client
    call_count = {"n": 0}

    async def mocked_execute_chat(prompt, system_instruction=None):
        call_count["n"] += 1
        if call_count["n"] == 1:
            # First call: return malformed response that fails validation
            return "MALFORMED_NON_JSON"
        else:
            # Second call: valid JSON response
            return json.dumps({
                "email_subject": "Payment Reminder: Invoice INV-A",
                "email_body": "Please pay invoice INV-A outstanding balance.",
                "tone": "Friendly",
                "communication_goal": "Collect balance"
            })

    gateway.service.client.execute_chat = mocked_execute_chat

    context = {
        "invoice_id": "INV-A",
        "outstanding_balance": 1500.0,
        "due_date": "2026-08-01",
        "customer_name": "Test Client"
    }

    res = await gateway.generate_email(context, "Friendly")
    assert res["email_subject"] == "Payment Reminder: Invoice INV-A"
    assert call_count["n"] == 2
