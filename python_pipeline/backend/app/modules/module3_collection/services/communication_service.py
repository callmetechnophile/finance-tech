import datetime
import logging
from sqlalchemy.orm import Session
from app.modules.module3_collection.schemas.collection_report_schema import CollectionIntelligenceReport
from app.modules.module3_collection.schemas.communication_schema import CommunicationRecommendation
from app.modules.module3_collection.ai.tone_selector import ToneSelector
from app.modules.module3_collection.ai.gemma_client import GemmaClient
from app.modules.module3_collection.ai.email_generator import EmailGenerator
from app.modules.module3_collection.ai.sms_generator import SmsGenerator
from app.modules.module3_collection.ai.whatsapp_generator import WhatsappGenerator
from app.modules.module3_collection.ai.explanation_generator import ExplanationGenerator
from app.modules.module3_collection.services.response_validator import ResponseValidator
from app.modules.module3_collection.services.communication_history_service import CommunicationHistoryService

logger = logging.getLogger(__name__)

class CommunicationService:
    """
    Main orchestration service coordinating message generation channels, 
    running validation loops, and registering communications audit trails.
    """

    def __init__(self):
        self.tone_selector = ToneSelector()
        self.gemma_client = GemmaClient()
        self.email_gen = EmailGenerator(self.gemma_client)
        self.sms_gen = SmsGenerator(self.gemma_client)
        self.whatsapp_gen = WhatsappGenerator(self.gemma_client)
        self.explanation_gen = ExplanationGenerator(self.gemma_client)
        self.validator = ResponseValidator()
        self.history_service = CommunicationHistoryService()

    async def generate_communication_recommendations(
        self,
        session: Session,
        report: CollectionIntelligenceReport
    ) -> CommunicationRecommendation:
        
        # 1. Deterministically select the tone
        invoice_ctx = report.invoice_context
        profile = report.customer_profile
        
        tone = self.tone_selector.select_tone(
            priority_level=report.priority_level,
            reminder_count=invoice_ctx.reminder_count,
            risk_level=report.collection_risk.risk_level
        )

        # Map details for context dict
        context_dict = {
            "invoice_id": invoice_ctx.invoice_id,
            "amount": invoice_ctx.amount,
            "outstanding_balance": invoice_ctx.outstanding_balance,
            "due_date": invoice_ctx.due_date,
            "days_overdue": invoice_ctx.days_overdue,
            "customer_name": invoice_ctx.customer_name,
            "reminder_count": invoice_ctx.reminder_count
        }

        profile_dict = {
            "avg_payment_delay": profile.avg_payment_delay,
            "late_payment_percentage": profile.late_payment_percentage,
            "customer_reliability_score": profile.customer_reliability_score
        }

        # 2. Generate Email with Retry Loop
        email_comm = None
        email_fallback = False
        try:
            email_comm = await self.email_gen.generate_email(context_dict, profile_dict, tone)
            raw_json_email = f'{{"email_subject": "{email_comm.email_subject}", "email_body": "{email_comm.email_body}", "tone": "{email_comm.tone}"}}'
            valid, err = self.validator.validate_email_response(raw_json_email, invoice_ctx.invoice_id, invoice_ctx.outstanding_balance)
        except Exception as e:
            valid, err = False, str(e)

        if not valid:
            logger.warning(f"Email validation failed: {err}. Retrying once...")
            try:
                email_comm = await self.email_gen.generate_email(context_dict, profile_dict, tone)
                raw_json_email = f'{{"email_subject": "{email_comm.email_subject}", "email_body": "{email_comm.email_body}", "tone": "{email_comm.tone}"}}'
                valid, err = self.validator.validate_email_response(raw_json_email, invoice_ctx.invoice_id, invoice_ctx.outstanding_balance)
            except Exception as e:
                valid, err = False, str(e)
            if not valid:
                logger.error(f"Email validation failed again. Using fallback template.")
                email_fallback = True
                email_comm = self._get_email_fallback(invoice_ctx.invoice_id, invoice_ctx.outstanding_balance, invoice_ctx.due_date, tone)

        # 3. Generate SMS with Retry Loop
        sms_text = ""
        sms_fallback = False
        try:
            sms_text = await self.sms_gen.generate_sms(context_dict, tone)
            raw_json_sms = f'{{"sms_body": "{sms_text}"}}'
            valid, err = self.validator.validate_sms_response(raw_json_sms)
        except Exception as e:
            valid, err = False, str(e)

        if not valid:
            try:
                sms_text = await self.sms_gen.generate_sms(context_dict, tone)
                raw_json_sms = f'{{"sms_body": "{sms_text}"}}'
                valid, err = self.validator.validate_sms_response(raw_json_sms)
            except Exception as e:
                valid, err = False, str(e)
            if not valid:
                sms_fallback = True
                sms_text = self._get_sms_fallback(invoice_ctx.invoice_id, invoice_ctx.outstanding_balance, tone)

        # 4. Generate WhatsApp with Retry Loop
        whatsapp_text = ""
        whatsapp_fallback = False
        try:
            whatsapp_text = await self.whatsapp_gen.generate_whatsapp(context_dict, tone)
            raw_json_wa = f'{{"whatsapp_body": "{whatsapp_text}"}}'
            valid, err = self.validator.validate_whatsapp_response(raw_json_wa)
        except Exception as e:
            valid, err = False, str(e)

        if not valid:
            try:
                whatsapp_text = await self.whatsapp_gen.generate_whatsapp(context_dict, tone)
                raw_json_wa = f'{{"whatsapp_body": "{whatsapp_text}"}}'
                valid, err = self.validator.validate_whatsapp_response(raw_json_wa)
            except Exception as e:
                valid, err = False, str(e)
            if not valid:
                whatsapp_fallback = True
                whatsapp_text = self._get_whatsapp_fallback(invoice_ctx.invoice_id, invoice_ctx.outstanding_balance, invoice_ctx.due_date)

        # 5. Generate Explanation with Retry Loop
        explanation_obj = None
        explanation_fallback = False
        try:
            explanation_obj = await self.explanation_gen.generate_explanation(invoice_ctx.invoice_id, report.reason_codes, context_dict)
            raw_json_exp = f'{{"explanation": "{explanation_obj.explanation_text}"}}'
            valid, err = self.validator.validate_explanation_response(raw_json_exp)
        except Exception as e:
            valid, err = False, str(e)

        if not valid:
            try:
                explanation_obj = await self.explanation_gen.generate_explanation(invoice_ctx.invoice_id, report.reason_codes, context_dict)
                raw_json_exp = f'{{"explanation": "{explanation_obj.explanation_text}"}}'
                valid, err = self.validator.validate_explanation_response(raw_json_exp)
            except Exception as e:
                valid, err = False, str(e)
            if not valid:
                explanation_fallback = True
                from app.modules.module3_collection.schemas.explanation_schema import PriorityExplanation
                explanation_obj = PriorityExplanation(
                    invoice_id=invoice_ctx.invoice_id,
                    explanation_text=f"Prioritized due to: " + ", ".join(report.reason_codes),
                    reason_codes_used=report.reason_codes
                )

        # 6. Log generated outputs to history db
        # Combine channel contents for historical audit trails
        self.history_service.log_communication(
            session=session,
            invoice_id=invoice_ctx.invoice_id,
            channel="Email",
            tone=tone,
            email_subject=email_comm.email_subject,
            content=email_comm.email_body,
            gemma_explanation=explanation_obj.explanation_text,
            fallback_used=email_fallback
        )
        self.history_service.log_communication(
            session=session,
            invoice_id=invoice_ctx.invoice_id,
            channel="SMS",
            tone=tone,
            content=sms_text,
            gemma_explanation=explanation_obj.explanation_text,
            fallback_used=sms_fallback
        )
        self.history_service.log_communication(
            session=session,
            invoice_id=invoice_ctx.invoice_id,
            channel="WhatsApp",
            tone=tone,
            content=whatsapp_text,
            gemma_explanation=explanation_obj.explanation_text,
            fallback_used=whatsapp_fallback
        )

        # Requires manager approval logic
        # High escalation channels (Final Notice / Legal) require approval flags
        req_approval = tone in ["Final Notice", "Legal Escalation"]

        # Default recommended communication channel based on tone
        recommended_channel = "Email"
        if tone in ["Friendly", "Professional"]:
            recommended_channel = "Email"
        else:
            recommended_channel = "SMS"

        return CommunicationRecommendation(
            invoice_id=invoice_ctx.invoice_id,
            communication_channel=recommended_channel,
            tone=tone,
            email={
                "email_subject": email_comm.email_subject,
                "email_body": email_comm.email_body,
                "tone": email_comm.tone,
                "communication_goal": email_comm.communication_goal
            },
            sms=sms_text,
            whatsapp=whatsapp_text,
            priority_level=report.priority_level,
            requires_manager_approval=req_approval,
            gemma_explanation=explanation_obj.explanation_text,
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )

    # Deterministic fallback templates
    def _get_email_fallback(self, invoice_id: str, balance: float, due_date: str, tone: str) -> Any:
        from app.modules.module3_collection.schemas.email_schema import EmailCommunication
        
        subjects = {
            "Friendly": f"Friendly Reminder: Invoice {invoice_id}",
            "Professional": f"Outstanding Payment Inquiry: Invoice {invoice_id}",
            "Firm": f"URGENT: Overdue Account Balance for Invoice {invoice_id}",
            "Final Notice": f"FINAL NOTICE: Outstanding Payment for Invoice {invoice_id}",
            "Legal Escalation": f"LEGAL WARNING: Collection Passing for Invoice {invoice_id}"
        }
        
        bodies = {
            "Friendly": f"Dear Customer, this is a friendly reminder that invoice {invoice_id} is unpaid. Please settle the balance of {balance} by {due_date}. Thank you!",
            "Professional": f"Dear Client, please find attached a reminder regarding invoice {invoice_id} for {balance}, which was due on {due_date}. Kindly arrange payment at your earliest convenience.",
            "Firm": f"Dear Customer, this is a firm notice that invoice {invoice_id} for {balance} is now overdue. Please settle this immediately to avoid further action.",
            "Final Notice": f"FINAL NOTICE: Invoice {invoice_id} for {balance} remains unpaid. Please clear this immediately. Failure to pay will result in collection escalation.",
            "Legal Escalation": f"LEGAL WARNING: Your account is overdue. Invoice {invoice_id} has been passed to collections. Arrange immediate settlement."
        }

        subject = subjects.get(tone, f"Payment Reminder: Invoice {invoice_id}")
        body = bodies.get(tone, f"Invoice {invoice_id} of {balance} is unpaid. Please settle.")

        return EmailCommunication(
            email_subject=subject,
            email_body=body,
            tone=tone,
            communication_goal="Collect outstanding invoice balance"
        )

    def _get_sms_fallback(self, invoice_id: str, balance: float, tone: str) -> str:
        if tone in ["Friendly", "Professional"]:
            return f"Reminder: Invoice {invoice_id} is unpaid. Balance: {balance}. Thank you."
        return f"URGENT: Invoice {invoice_id} is overdue. Pay balance {balance} immediately to prevent escalation."

    def _get_whatsapp_fallback(self, invoice_id: str, balance: float, due_date: str) -> str:
        return (
            f"Hello! Just a reminder that invoice {invoice_id} of {balance} was due on {due_date}. "
            f"Please make payment here: [payment_link]"
        )
