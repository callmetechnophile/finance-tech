import json
import logging
from typing import Dict, Any, List
from app.integrations.ai.google_ai_client import GoogleAIClient
from app.integrations.ai.prompt_builder import PromptBuilder

logger = logging.getLogger(__name__)

class GemmaService:
    """
    Service defining functions that query Google AI Studio (Gemma 4 model) and return parsed JSON payloads.
    """

    def __init__(self, client: GoogleAIClient = None):
        self.client = client or GoogleAIClient()
        self.prompt_builder = PromptBuilder()

    async def generate_email(self, context: Dict[str, Any], tone: str) -> Dict[str, Any]:
        prompt = self.prompt_builder.build_email_prompt(context, tone)
        raw = await self.client.execute_chat(prompt)
        return self._parse_json(raw)

    async def generate_sms(self, context: Dict[str, Any], tone: str) -> Dict[str, Any]:
        prompt = self.prompt_builder.build_sms_prompt(context, tone)
        raw = await self.client.execute_chat(prompt)
        return self._parse_json(raw)

    async def generate_whatsapp(self, context: Dict[str, Any], tone: str) -> Dict[str, Any]:
        prompt = self.prompt_builder.build_whatsapp_prompt(context, tone)
        raw = await self.client.execute_chat(prompt)
        return self._parse_json(raw)

    async def generate_explanation(self, invoice_id: str, reason_codes: List[str], details: Dict[str, Any]) -> Dict[str, Any]:
        prompt = self.prompt_builder.build_explanation_prompt(invoice_id, reason_codes, details)
        raw = await self.client.execute_chat(prompt)
        return self._parse_json(raw)

    async def generate_internal_summary(self, invoice_id: str, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Helper function summarizing account actions
        prompt = (
            f"Generate a short internal collections action summary for invoice {invoice_id}.\n"
            f"History: {json.dumps(history)}\n\n"
            f"Expected JSON:\n"
            f'{{\n  "summary": "text"\n}}'
        )
        raw = await self.client.execute_chat(prompt)
        return self._parse_json(raw)

    def _parse_json(self, raw: str) -> Dict[str, Any]:
        """
        Cleans and loads JSON strings securely.
        """
        text = raw.strip()
        if text.startswith("```"):
            nl = text.find("\n")
            if nl != -1:
                text = text[nl:].strip()
            if text.endswith("```"):
                text = text[:-3].strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            logger.error(f"Failed to decode Gemma service response JSON: {text}")
            raise
