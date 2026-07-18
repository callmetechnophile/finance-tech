import os
from dataclasses import dataclass

@dataclass(frozen=True)
class CommunicationConfig:
    """
    Configuration holding credential keys and endpoint metadata for Brevo and Twilio services.
    """
    # Brevo Configs
    brevo_api_key: str = os.getenv("BREVO_API_KEY", "")
    brevo_sender_email: str = os.getenv("BREVO_SENDER_EMAIL", "finance@sme.com")
    brevo_sender_name: str = os.getenv("BREVO_SENDER_NAME", "SME Finance Collections")
    
    # Twilio Configs
    twilio_account_sid: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    twilio_auth_token: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    twilio_phone_number: str = os.getenv("TWILIO_PHONE_NUMBER", "")
    twilio_whatsapp_number: str = os.getenv("TWILIO_WHATSAPP_NUMBER", "")

    # General Connection Configs
    timeout_seconds: float = float(os.getenv("COMMUNICATION_TIMEOUT_SECONDS", "15.0"))
    max_retries: int = int(os.getenv("COMMUNICATION_MAX_RETRIES", "3"))

    def is_brevo_configured(self) -> bool:
        return bool(self.brevo_api_key)

    def is_twilio_configured(self) -> bool:
        return bool(self.twilio_account_sid and self.twilio_auth_token)
