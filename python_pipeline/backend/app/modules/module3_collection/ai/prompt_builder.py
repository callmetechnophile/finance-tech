import json
from typing import Dict, Any, List

class PromptBuilder:
    """
    Constructs structured prompt payloads for Gemma LLM, enforcing JSON outputs, 
    channel goals, and strict rules regarding internal financial metrics security.
    """

    def build_email_prompt(self, context: Dict[str, Any], profile: Dict[str, Any], tone: str) -> str:
        payload = {
            "invoice_number": context["invoice_id"],
            "amount": context["amount"],
            "outstanding_balance": context["outstanding_balance"],
            "due_date": context["due_date"],
            "days_overdue": context["days_overdue"],
            "customer_name": context["customer_name"],
            "tone": tone
        }
        
        system_instruction = (
            "You are a professional Financial Communications Assistant representing the company. "
            "Your task is to write a personalized collection reminder email based on the provided invoice context.\n\n"
            "STRICT RULES:\n"
            "1. NEVER expose internal risk levels, priority levels, priority scores, or reliability percentages to the customer.\n"
            "2. Do NOT mention internal scoring systems or analytics engines.\n"
            "3. Make sure the tone is strictly followed: Friendly, Professional, Firm, Final Notice, or Legal Escalation.\n"
            "4. Respond ONLY with a valid JSON object matching the requested schema. No conversational headers or codeblocks.\n"
        )
        
        user_prompt = (
            f"Generate an email for the following customer invoice:\n"
            f"{json.dumps(payload, indent=2)}\n\n"
            f"Expected JSON Schema:\n"
            f"{{\n"
            f"  \"email_subject\": \"string\",\n"
            f"  \"email_body\": \"string\",\n"
            f"  \"tone\": \"{tone}\",\n"
            f"  \"communication_goal\": \"Collect outstanding balance or establish payment dialogue\"\n"
            f"}}\n"
        )
        return f"{system_instruction}\n{user_prompt}"

    def build_sms_prompt(self, context: Dict[str, Any], tone: str) -> str:
        payload = {
            "invoice_number": context["invoice_id"],
            "outstanding_balance": context["outstanding_balance"],
            "due_date": context["due_date"],
            "days_overdue": context["days_overdue"],
            "customer_name": context["customer_name"],
            "tone": tone
        }

        system_instruction = (
            "You are a professional Financial Communications Assistant.\n"
            "Generate a concise payment reminder SMS. Keep the text under 320 characters.\n\n"
            "STRICT RULES:\n"
            "1. NEVER expose internal scores or metrics.\n"
            "2. Keep the message under 320 characters total.\n"
            "3. Do not include sensitive financial data or payment routing details.\n"
            "4. Return ONLY a valid JSON object containing a single key 'sms_body'. No commentary.\n"
        )

        user_prompt = (
            f"Generate an SMS for the following details:\n"
            f"{json.dumps(payload, indent=2)}\n\n"
            f"Expected JSON Schema:\n"
            f"{{\n"
            f"  \"sms_body\": \"Concise text under 320 characters\"\n"
            f"}}\n"
        )
        return f"{system_instruction}\n{user_prompt}"

    def build_whatsapp_prompt(self, context: Dict[str, Any], tone: str) -> str:
        payload = {
            "invoice_number": context["invoice_id"],
            "outstanding_balance": context["outstanding_balance"],
            "due_date": context["due_date"],
            "customer_name": context["customer_name"],
            "tone": tone
        }

        system_instruction = (
            "You are a professional Financial Communications Assistant.\n"
            "Generate a friendly but professional WhatsApp reminder message. Include placeholders for payment link.\n\n"
            "STRICT RULES:\n"
            "1. Keep it clear, professional and action-oriented.\n"
            "2. Do not include internal priority scores, risk rankings, or system logs.\n"
            "3. Return ONLY a JSON object containing 'whatsapp_body'. No conversational markdown.\n"
        )

        user_prompt = (
            f"Generate a WhatsApp message for:\n"
            f"{json.dumps(payload, indent=2)}\n\n"
            f"Expected JSON Schema:\n"
            f"{{\n"
            f"  \"whatsapp_body\": \"Action-oriented WhatsApp message containing invoice number, amount, due date, and payment link placeholder\"\n"
            f"}}\n"
        )
        return f"{system_instruction}\n{user_prompt}"

    def build_explanation_prompt(self, invoice_id: str, reason_codes: List[str], details: Dict[str, Any]) -> str:
        payload = {
            "invoice_id": invoice_id,
            "reason_codes": reason_codes,
            "details": details
        }

        system_instruction = (
            "You are an Internal Audit and Risk Assistant.\n"
            "Explain clearly why this specific invoice was prioritized for collection.\n\n"
            "STRICT RULES:\n"
            "1. Use ONLY the provided reason codes (e.g., DAYS_OVERDUE_CRITICAL, LARGE_OUTSTANDING_BALANCE, LOW_CUSTOMER_RELIABILITY, LIQUIDITY_DEFICIT_TRIGGER) to construct the explanation.\n"
            "2. NEVER invent financial reasons or add attributes not present in the details.\n"
            "3. Write a single-sentence or double-sentence clear explanation.\n"
            "4. Return ONLY a JSON object matching the schema below. No commentary.\n"
        )

        user_prompt = (
            f"Generate an explanation for:\n"
            f"{json.dumps(payload, indent=2)}\n\n"
            f"Expected JSON Schema:\n"
            f"{{\n"
            f"  \"explanation\": \"This invoice has been prioritized because...\"\n"
            f"}}\n"
        )
        return f"{system_instruction}\n{user_prompt}"
