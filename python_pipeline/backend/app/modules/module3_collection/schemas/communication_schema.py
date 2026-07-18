from dataclasses import dataclass

@dataclass
class CommunicationRecommendation:
    """
    Consolidated communication recommendations generated for a single invoice.
    """
    invoice_id: str
    communication_channel: str  # Email, SMS, WhatsApp
    tone: str  # Friendly, Professional, Firm, Final Notice, Legal Escalation
    email: dict  # email_subject, email_body, tone, communication_goal
    sms: str
    whatsapp: str
    priority_level: str
    requires_manager_approval: bool
    gemma_explanation: str
    generated_timestamp: str
