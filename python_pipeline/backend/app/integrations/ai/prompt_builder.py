import json
from typing import Dict, Any, List

class PromptBuilder:
    """
    Constructs JSON-strict prompts for NVIDIA NIM inference, ensuring raw scoring 
    metrics are stripped to protect customer privacy.
    """

    def build_email_prompt(self, context: Dict[str, Any], tone: str) -> str:
        # Strip raw internal scores, only send context + requested tone directive
        payload = {
            "invoice_number": context.get("invoice_id", "Unknown"),
            "amount": context.get("amount", context.get("outstanding_balance", 0.0)),
            "outstanding_balance": context.get("outstanding_balance", 0.0),
            "due_date": context.get("due_date", ""),
            "days_overdue": context.get("days_overdue", 0),
            "customer_name": context.get("customer_name", "Valued Customer")
        }

        return (
            "SYSTEM INSTRUCTION: You are a professional Financial Communications Assistant.\n"
            "Write a personalized payment reminder email based on the provided invoice context.\n"
            "STRICT RULES:\n"
            "1. NEVER expose internal priority scores, default risks, reliability percentages, or system indexes.\n"
            "2. Respond ONLY with a valid JSON object matching the requested schema. Do NOT wrap output in markdown codeblocks (such as ```json).\n"
            "3. Enforce the requested tone: " + tone + ".\n\n"
            "Invoice Details:\n" + json.dumps(payload, indent=2) + "\n\n"
            "EXPECTED SCHEMA:\n"
            "{\n"
            "  \"email_subject\": \"string\",\n"
            "  \"email_body\": \"string\",\n"
            "  \"tone\": \"" + tone + "\",\n"
            "  \"communication_goal\": \"Collect outstanding balance or establish payment dialogue\"\n"
            "}"
        )

    def build_sms_prompt(self, context: Dict[str, Any], tone: str) -> str:
        payload = {
            "invoice_number": context["invoice_id"],
            "outstanding_balance": context["outstanding_balance"],
            "due_date": context["due_date"],
            "customer_name": context["customer_name"]
        }

        return (
            "SYSTEM INSTRUCTION: You are a professional Financial Communications Assistant.\n"
            "Write a concise payment reminder SMS. Keep message text under 320 characters.\n"
            "STRICT RULES:\n"
            "1. NEVER include internal scores, risk margins, or routing details.\n"
            "2. Respond ONLY with a valid JSON object. Do NOT use markdown tags.\n"
            "3. Tone: " + tone + ".\n\n"
            "Context:\n" + json.dumps(payload, indent=2) + "\n\n"
            "EXPECTED SCHEMA:\n"
            "{\n"
            "  \"sms_body\": \"Concise text under 320 characters\"\n"
            "}"
        )

    def build_whatsapp_prompt(self, context: Dict[str, Any], tone: str) -> str:
        payload = {
            "invoice_number": context["invoice_id"],
            "outstanding_balance": context["outstanding_balance"],
            "due_date": context["due_date"],
            "customer_name": context["customer_name"]
        }

        return (
            "SYSTEM INSTRUCTION: You are a professional Financial Communications Assistant.\n"
            "Write a friendly but professional WhatsApp reminder. Include a placeholder [payment_link].\n"
            "STRICT RULES:\n"
            "1. Do NOT include internal priority scores or system logs.\n"
            "2. Respond ONLY with a valid JSON object. No markdown wraps.\n"
            "3. Tone: " + tone + ".\n\n"
            "Context:\n" + json.dumps(payload, indent=2) + "\n\n"
            "EXPECTED SCHEMA:\n"
            "{\n"
            "  \"whatsapp_body\": \"Action-oriented WhatsApp message containing invoice number, amount, due date, and payment link placeholder\"\n"
            "}"
        )

    def build_explanation_prompt(self, invoice_id: str, reason_codes: List[str], details: Dict[str, Any]) -> str:
        payload = {
            "invoice_id": invoice_id,
            "reason_codes": reason_codes,
            "details": {
                "amount": details.get("amount"),
                "days_overdue": details.get("days_overdue"),
                "reminder_count": details.get("reminder_count")
            }
        }

        return (
            "SYSTEM INSTRUCTION: You are an Internal Audit Assistant.\n"
            "Explain clearly why this specific invoice was prioritized for collection.\n"
            "STRICT RULES:\n"
            "1. Use ONLY the provided reason codes to explain the prioritization. Do NOT invent new financial factors.\n"
            "2. Respond ONLY with a valid JSON object. No markdown codeblocks.\n\n"
            "Context:\n" + json.dumps(payload, indent=2) + "\n\n"
            "EXPECTED SCHEMA:\n"
            "{\n"
            "  \"explanation\": \"This invoice has been prioritized because...\"\n"
            "}"
        )
