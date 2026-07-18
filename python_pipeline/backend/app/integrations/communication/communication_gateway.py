import logging
import datetime
from sqlalchemy.orm import Session
from app.integrations.communication.brevo_client import BrevoEmailClient
from app.integrations.communication.twilio_sms_client import TwilioSMSClient
from app.integrations.communication.twilio_whatsapp_client import TwilioWhatsAppClient
from app.integrations.communication.delivery_tracker import DeliveryTracker
from app.integrations.communication.retry_manager import RetryManager

logger = logging.getLogger(__name__)

class CommunicationGateway:
    """
    Main communication routing orchestrator executing email, SMS, and WhatsApp 
    calls via third-party adapters.
    """

    def __init__(self):
        self.brevo = BrevoEmailClient()
        self.twilio_sms = TwilioSMSClient()
        self.twilio_wa = TwilioWhatsAppClient()
        self.tracker = DeliveryTracker()
        self.retry_manager = RetryManager()

    async def send_message(
        self,
        session: Session,
        invoice_id: str,
        channel: str,  # EMAIL, SMS, WHATSAPP
        recipient: str,
        subject: str,  # only relevant for EMAIL
        body: str
    ) -> bool:
        
        status = "FAILED"
        msg_id = "error"
        err_msg = ""
        
        logger.info(f"Routing {channel} reminder to {recipient} for invoice: {invoice_id}")

        try:
            if channel.upper() == "EMAIL":
                # Execute send email with backoff retry wrapper
                res = await self.retry_manager.execute_with_retry(
                    self.brevo.send_email,
                    to_email=recipient,
                    subject=subject,
                    body_html=f"<p>{body}</p>",
                    body_text=body
                )
                msg_id = res.get("messageId", "unknown-email-id")
                status = res.get("status", "SENT")

            elif channel.upper() == "SMS":
                res = await self.retry_manager.execute_with_retry(
                    self.twilio_sms.send_sms,
                    to_number=recipient,
                    body=body
                )
                msg_id = res.get("sid", "unknown-sms-sid")
                status = "SENT" if res.get("status") in ["queued", "sent", "delivered"] else "FAILED"

            elif channel.upper() == "WHATSAPP":
                res = await self.retry_manager.execute_with_retry(
                    self.twilio_wa.send_whatsapp,
                    to_number=recipient,
                    body=body
                )
                msg_id = res.get("sid", "unknown-wa-sid")
                status = "SENT" if res.get("status") in ["queued", "sent", "delivered"] else "FAILED"
            
            else:
                raise ValueError(f"Unsupported message channel requested: {channel}")
            
            success = status in ["SENT", "DELIVERED", "SUCCESS"]
            
            # Track delivery
            self.tracker.track_delivery(
                session=session,
                invoice_id=invoice_id,
                channel=channel,
                message_id=msg_id,
                status=status,
                retry_count=0,
                provider_response=str(res)
            )
            return success

        except Exception as e:
            err_msg = str(e)
            logger.error(f"Failed to dispatch {channel} message: {err_msg}")
            
            # Track failure
            self.tracker.track_delivery(
                session=session,
                invoice_id=invoice_id,
                channel=channel,
                message_id="failed",
                status="FAILED",
                retry_count=self.retry_manager.max_retries,
                failure_reason=err_msg
            )
            return False
class DummyCommGateway:
    pass
