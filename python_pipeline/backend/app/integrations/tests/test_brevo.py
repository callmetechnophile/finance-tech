import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from app.integrations.communication.brevo_client import BrevoEmailClient
from app.integrations.communication.communication_config import CommunicationConfig

@pytest.fixture
def anyio_backend():
    return "asyncio"

def test_brevo_config():
    config = CommunicationConfig()
    assert config.is_brevo_configured() is False
    assert config.brevo_sender_email == "finance@sme.com"

@pytest.mark.anyio
async def test_brevo_client_mock_mode():
    client = BrevoEmailClient()
    res = await client.send_email(
        to_email="test@client.com",
        subject="Invoice Overdue",
        body_html="<p>Please pay</p>"
    )
    assert res["status"] == "SENT"
    assert "mock-email" in res["messageId"]

@pytest.mark.anyio
async def test_brevo_client_api_post():
    # Build a config with a non-empty API key so it bypasses mock mode
    config = CommunicationConfig(brevo_api_key="TEST_API_KEY")
    client = BrevoEmailClient(config)

    # Build a synchronous mock response that behaves like an httpx.Response
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"messageId": "msg-123456"}

    with patch("httpx.AsyncClient.post", new=AsyncMock(return_value=mock_response)):
        res = await client.send_email("client@test.com", "Subject", "<p>Html</p>")

    assert res["messageId"] == "msg-123456"
