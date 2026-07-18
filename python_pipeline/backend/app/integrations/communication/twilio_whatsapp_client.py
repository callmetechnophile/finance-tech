import httpx
import logging
from typing import Dict, Any
from app.integrations.communication.communication_config import CommunicationConfig

logger = logging.getLogger(__name__)

class TwilioWhatsAppClient:
    """
    HTTP integration adapter for the Twilio WhatsApp API wrapper, 
    prepending 'whatsapp:' identifiers to phone arguments.
    """

    def __init__(self, config: CommunicationConfig = None):
        self.config = config or CommunicationConfig()

    async def send_whatsapp(self, to_number: str, body: str) -> Dict[str, Any]:
        """
        Sends WhatsApp message via Twilio Messages API with 'whatsapp:' prefixes.
        """
        # Prefix check
        clean_to = to_number if to_number.startswith("whatsapp:") else f"whatsapp:{to_number}"
        clean_from = self.config.twilio_whatsapp_number
        if clean_from and not clean_from.startswith("whatsapp:"):
            clean_from = f"whatsapp:{clean_from}"

        if not self.config.is_twilio_configured():
            logger.warning("Twilio WhatsApp is not configured. Running in mock mode.")
            return {
                "sid": f"mock-wa-sid-{to_number}",
                "status": "queued",
                "details": "Mock Twilio WhatsApp message successfully dispatched."
            }

        url = f"https://api.twilio.com/2010-04-01/Accounts/{self.config.twilio_account_sid}/Messages.json"
        data = {
            "To": clean_to,
            "From": clean_from,
            "Body": body
        }
        auth = (self.config.twilio_account_sid, self.config.twilio_auth_token)

        try:
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                res = await client.post(url, data=data, auth=auth)
                res.raise_for_status()
                return res.json()
        except Exception as e:
            logger.error(f"Twilio WhatsApp dispatch failed: {str(e)}")
            raise

    async def check_delivery(self, message_sid: str) -> str:
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
        return bool(phone_number and (phone_number.startswith("+") or phone_number.startswith("whatsapp:")))
