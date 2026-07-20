from app.utils.logger import logger
from app.services.twilio_service import twilio_service
from app.services.brevo_service import brevo_service


def process_document_ocr_task(file_name: str, document_id: str):
    """Background task for processing OCR extraction and updating status."""
    logger.info(f"⚙️ Running background OCR extraction task for {file_name} (ID: {document_id})")


def dispatch_collection_reminders_task(customer_name: str, phone: str, email: str, invoice_id: str, amount: float):
    """Background task for sending multi-channel Twilio SMS & Brevo Email collection reminders."""
    logger.info(f"⚙️ Running background outreach task for invoice {invoice_id} (${amount:,.2f})")

    # Dispatch SMS via Twilio
    sms_body = f"FORGE-PATH Reminder: Invoice {invoice_id} for ${amount:,.2f} is overdue. Please remit payment at apex.com/pay"
    twilio_service.send_sms(phone, sms_body)

    # Dispatch Email via Brevo
    email_subject = f"Payment Demand Notice: Invoice {invoice_id} (${amount:,.2f})"
    email_html = f"<h3>Notice of Overdue Payment</h3><p>Dear {customer_name}, Invoice {invoice_id} for ${amount:,.2f} is overdue. Please contact Apex Treasury.</p>"
    brevo_service.send_email(email, email_subject, email_html)
