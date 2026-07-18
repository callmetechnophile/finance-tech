import logging
from typing import Dict, Any, List
from app.integrations.ai.gemma_service import GemmaService
from app.integrations.ai.response_validator import ResponseValidator

logger = logging.getLogger(__name__)

class AIGateway:
    """
    Gateway class for AI inferences, coordinating builders, validators, 
    and retry loops.
    """

    def __init__(self, service: GemmaService = None):
        self.service = service or GemmaService()
        self.validator = ResponseValidator()

    async def generate_email(self, context: Dict[str, Any], tone: str) -> Dict[str, Any]:
        invoice_id = context.get("invoice_id", "Unknown")
        try:
            # Attempt 1
            res = await self.service.generate_email(context, tone)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_email_response(raw_str, invoice_id)
            if valid:
                return res
            logger.warning(f"Email response validation failed: {err}. Retrying once...")
        except Exception as e:
            logger.warning(f"Email prompt error: {str(e)}. Retrying once...")

        # Attempt 2 (Retry)
        try:
            res = await self.service.generate_email(context, tone)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_email_response(raw_str, invoice_id)
            if valid:
                return res
        except Exception as e:
            logger.error(f"Email prompt retry failed: {str(e)}")

        # Fallback Template
        logger.error("Using deterministic email fallback template.")
        return {
            "email_subject": f"Payment Reminder: Invoice {invoice_id}",
            "email_body": f"Dear Customer, we request the outstanding balance of {context.get('outstanding_balance', 0.0)} for invoice {invoice_id} be settled.",
            "tone": tone,
            "communication_goal": "Collect outstanding balance"
        }

    async def generate_sms(self, context: Dict[str, Any], tone: str) -> Dict[str, Any]:
        invoice_id = context.get("invoice_id", "Unknown")
        try:
            res = await self.service.generate_sms(context, tone)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_sms_response(raw_str)
            if valid:
                return res
        except Exception as e:
            logger.warning(f"SMS prompt error: {str(e)}. Retrying once...")

        try:
            res = await self.service.generate_sms(context, tone)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_sms_response(raw_str)
            if valid:
                return res
        except Exception as e:
            logger.error(f"SMS retry failed: {str(e)}")

        return {
            "sms_body": f"Reminder: Invoice {invoice_id} outstanding balance: {context.get('outstanding_balance', 0.0)}. Settle balance."
        }

    async def generate_whatsapp(self, context: Dict[str, Any], tone: str) -> Dict[str, Any]:
        invoice_id = context.get("invoice_id", "Unknown")
        try:
            res = await self.service.generate_whatsapp(context, tone)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_whatsapp_response(raw_str)
            if valid:
                return res
        except Exception as e:
            logger.warning(f"WhatsApp prompt error: {str(e)}. Retrying once...")

        try:
            res = await self.service.generate_whatsapp(context, tone)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_whatsapp_response(raw_str)
            if valid:
                return res
        except Exception as e:
            logger.error(f"WhatsApp retry failed: {str(e)}")

        return {
            "whatsapp_body": f"Hello! Reminder that invoice {invoice_id} is outstanding. Balance: {context.get('outstanding_balance', 0.0)}. Pay here: [payment_link]"
        }

    async def generate_explanation(self, invoice_id: str, reason_codes: List[str], details: Dict[str, Any]) -> Dict[str, Any]:
        try:
            res = await self.service.generate_explanation(invoice_id, reason_codes, details)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_explanation_response(raw_str)
            if valid:
                return res
        except Exception as e:
            logger.warning(f"Explanation prompt error: {str(e)}. Retrying once...")

        try:
            res = await self.service.generate_explanation(invoice_id, reason_codes, details)
            import json
            raw_str = json.dumps(res)
            valid, err = self.validator.validate_explanation_response(raw_str)
            if valid:
                return res
        except Exception as e:
            logger.error(f"Explanation retry failed: {str(e)}")

        return {
            "explanation": f"Invoice {invoice_id} has been prioritized due to reason codes: " + ", ".join(reason_codes)
        }
