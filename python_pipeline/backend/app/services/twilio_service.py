import requests
from typing import Dict, Any
from app.config import settings
from app.utils.logger import logger


class TwilioService:
    """Twilio SMS Communications Provider."""

    @staticmethod
    def send_sms(to_phone: str, message_body: str) -> Dict[str, Any]:
        """Dispatches an SMS message via Twilio REST API with graceful fallback."""
        account_sid = settings.TWILIO_ACCOUNT_SID
        auth_token = settings.TWILIO_AUTH_TOKEN

        if account_sid and auth_token and not account_sid.startswith("mock"):
            try:
                url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
                payload = {
                    "From": "+18005550199",
                    "To": to_phone,
                    "Body": message_body,
                }
                res = requests.post(url, data=payload, auth=(account_sid, auth_token), timeout=5)
                if res.status_code in [200, 201]:
                    logger.info(f"📲 Twilio SMS successfully dispatched to {to_phone}")
                    return {"success": True, "message_sid": res.json().get("sid")}
            except Exception as e:
                logger.warning(f"Twilio SMS API failed, fallback logging: {e}")

        logger.info(f"📱 [Simulated SMS via Twilio] To: {to_phone} | Message: {message_body}")
        return {
            "success": True,
            "simulated": True,
            "to": to_phone,
            "message": message_body,
            "provider": "Twilio SMS",
        }


twilio_service = TwilioService()
