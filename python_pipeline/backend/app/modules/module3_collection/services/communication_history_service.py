import uuid
import datetime
from sqlalchemy.orm import Session
from app.database.models import CommunicationLog

class CommunicationHistoryService:
    """
    Manages logging and audit tracking of all Gemma generated messages and tone escalations.
    """

    def log_communication(
        self,
        session: Session,
        invoice_id: str,
        channel: str,
        tone: str,
        content: str,
        gemma_explanation: str,
        email_subject: str = None,
        fallback_used: bool = False
    ) -> CommunicationLog:
        
        log_entry = CommunicationLog(
            id=str(uuid.uuid4()),
            invoice_id=invoice_id,
            channel=channel,
            tone=tone,
            email_subject=email_subject,
            content=content,
            status="SENT",
            gemma_explanation=gemma_explanation,
            fallback_used=fallback_used
        )
        session.add(log_entry)
        session.commit()
        return log_entry
