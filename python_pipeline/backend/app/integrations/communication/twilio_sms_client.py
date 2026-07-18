import httpx
import logging
from typing import Dict, Any
from app.integrations.communication.communication_config import CommunicationConfig

logger = logging.getLogger(__name__)

class TwilioSMSClient:
    """
    HTTP integration adapter for the Twilio SMS REST API.
    """

    def __init__(self, config: CommunicationConfig = None):
        self.config = config or CommunicationConfig()

    async def send_sms(self, to_number: str, body: str) -> Dict[str, Any]:
        """
        Sends SMS via Twilio Messages API.
        """
        if not self.config.is_twilio_configured():
            logger.warning("Twilio SMS is not configured. Running in mock mode.")
            return {
                "sid": f"mock-sms-sid-{to_number}",
                "status": "queued",
                "details": "Mock Twilio SMS successfully dispatched."
            }

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.config.twilio_account_sid}/Messages.json"
        data = {
            "To": to_number,
            "From": self.config.twilio_phone_number,
            "Body": body
        }
        auth = (self.config.twilio_account_sid, self.config.twilio_auth_token)

        try:
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                res = await client.post(url, data=data, auth=auth)
                res.raise_for_status()
                return res.json()
        except Exception as e:
            logger.error(f"Twilio SMS dispatch failed: {str(e)}")
            raise

    async def check_status(self, message_sid: str) -> str:
        """
        Queries status of sent Twilio message.
        """
        if not self.config.is_twilio_configured():
            return "delivered"

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.config.twilio_account_sid}/Messages/{message_sid}.json"
        auth = (self.config.twilio_account_sid, self.config.twilio_auth_token)
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, auth=auth)
                res.raise_for_status()
                return res.json().get("status", "unknown")
        except Exception:
            return "unknown"

    async def validate_number(self, phone_number: str) -> bool:
        # Check standard prefix syntax
        return bool(phone_number and (phone_number.startswith("+") or phone_number.isdigit()))

    async def retry_failed_message(self, phone_number: str, body: str) -> Dict[str, Any]:
        return await self.send_sms(phone_number, body)
