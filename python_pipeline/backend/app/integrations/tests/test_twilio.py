import pytest
from unittest.mock import patch, MagicMock, AsyncMock
from app.integrations.communication.twilio_sms_client import TwilioSMSClient
from app.integrations.communication.twilio_whatsapp_client import TwilioWhatsAppClient
from app.integrations.communication.communication_config import CommunicationConfig

@pytest.fixture
def anyio_backend():
    return "asyncio"

def test_twilio_config():
    config = CommunicationConfig()
    assert config.is_twilio_configured() is False

@pytest.mark.anyio
async def test_twilio_sms_mock():
    client = TwilioSMSClient()
    res = await client.send_sms("+1234567890", "Test SMS Body")
    assert res["status"] == "queued"
    assert "mock-sms" in res["sid"]

@pytest.mark.anyio
async def test_twilio_whatsapp_mock():
    client = TwilioWhatsAppClient()
    res = await client.send_whatsapp("+1234567890", "Test WhatsApp Body")
    assert res["status"] == "queued"
    assert "mock-wa" in res["sid"]

@pytest.mark.anyio
async def test_twilio_sms_live_post():
    config = CommunicationConfig(
        twilio_account_sid="TEST_SID",
        twilio_auth_token="TEST_TOKEN",
        twilio_phone_number="+15555555"
    )
    client = TwilioSMSClient(config)

    # Build a synchronous mock response that behaves like an httpx.Response
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"sid": "sms-sid-1234", "status": "queued"}

    with patch("httpx.AsyncClient.post", new=AsyncMock(return_value=mock_response)):
        res = await client.send_sms("+199999", "Body text")

    assert res["sid"] == "sms-sid-1234"

@pytest.mark.anyio
async def test_twilio_whatsapp_live_post():
    config = CommunicationConfig(
        twilio_account_sid="TEST_SID",
        twilio_auth_token="TEST_TOKEN",
        twilio_whatsapp_number="whatsapp:+15555555"
    )
    client = TwilioWhatsAppClient(config)

    # Build a synchronous mock response that behaves like an httpx.Response
    mock_response = MagicMock()
    mock_response.raise_for_status = MagicMock()
    mock_response.json.return_value = {"sid": "wa-sid-1234", "status": "queued"}

    # Use AsyncMock and capture kwargs via call_args after execution
    mock_post_fn = AsyncMock(return_value=mock_response)

    with patch("httpx.AsyncClient.post", new=mock_post_fn):
        res = await client.send_whatsapp("+199999", "Body text")

    assert res["sid"] == "wa-sid-1234"
    # Extract the 'data' kwarg that was passed to client.post(url, data=data, auth=auth)
    _, call_kwargs = mock_post_fn.call_args
    post_data = call_kwargs.get("data", {})
    assert post_data.get("To") == "whatsapp:+199999"
