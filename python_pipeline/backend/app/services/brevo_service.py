import requests
from typing import Dict, Any, List
from app.config import settings
from app.utils.logger import logger


class BrevoService:
    """Brevo Transactional Email Provider."""

    @staticmethod
    def send_email(to_email: str, subject: str, body_html: str) -> Dict[str, Any]:
        """Dispatches transactional emails via Brevo API with graceful fallback."""
        api_key = settings.BREVO_API_KEY

        if api_key and not api_key.startswith("mock"):
            try:
                url = "https://api.brevo.com/v3/smtp/email"
                headers = {
                    "api-key": api_key,
                    "Content-Type": "application/json",
                }
                payload = {
                    "sender": {"name": "FORGE-PATH Treasury", "email": "treasury@apex.com"},
                    "to": [{"email": to_email}],
                    "subject": subject,
                    "htmlContent": body_html,
                }
                res = requests.post(url, json=payload, headers=headers, timeout=5)
                if res.status_code in [200, 201]:
                    logger.info(f"📧 Brevo Email successfully dispatched to {to_email}")
                    return {"success": True, "message_id": res.json().get("messageId")}
            except Exception as e:
                logger.warning(f"Brevo Email API failed, fallback logging: {e}")

        logger.info(f"✉️ [Simulated Email via Brevo] To: {to_email} | Subject: {subject}")
        return {
            "success": True,
            "simulated": True,
            "to": to_email,
            "subject": subject,
            "provider": "Brevo Email",
        }


brevo_service = BrevoService()
