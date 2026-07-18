import datetime
import uuid
import logging
from sqlalchemy.orm import Session
from app.database.models import SystemAuditTrail

logger = logging.getLogger(__name__)

class DeliveryTracker:
    """
    Logs status updates and provider message identifiers for sent reminders.
    """

    def track_delivery(
        self,
        session: Session,
        invoice_id: str,
        channel: str,
        message_id: str,
        status: str,
        retry_count: int = 0,
        failure_reason: str = None,
        provider_response: str = None
    ):
        timestamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        logger.info(
            f"Tracking Message [{message_id}] | Channel: {channel} | Status: {status} | Retries: {retry_count}"
        )

        try:
            # Write to central system audit trail
            audit_entry = SystemAuditTrail(
                id=str(uuid.uuid4()),
                company_id="apex-manufacturing-uuid",
                user_identifier="INTEGRATION_LAYER",
                change_type=f"Message Dispatched: {channel}",
                target_table="communication_deliveries",
                record_id=invoice_id,
                previous_state="PENDING",
                new_state=f"Status: {status}, MsgID: {message_id}, Retries: {retry_count}, Fail: {failure_reason}"
            )
            session.add(audit_entry)
            session.commit()
        except Exception:
            pass
