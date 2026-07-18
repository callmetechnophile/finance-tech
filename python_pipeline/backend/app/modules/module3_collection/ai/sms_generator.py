import json
import logging
from typing import Dict, Any
from app.modules.module3_collection.ai.gemma_client import GemmaClient
from app.modules.module3_collection.ai.prompt_builder import PromptBuilder

logger = logging.getLogger(__name__)

class SmsGenerator:
    """
    Coordinates SMS reminder text generation with Gemma, enforcing characters limits.
    """

    def __init__(self, client: GemmaClient = None):
        self.client = client or GemmaClient()
        self.builder = PromptBuilder()

    async def generate_sms(self, context: Dict[str, Any], tone: str) -> str:
        prompt = self.builder.build_sms_prompt(context, tone)
        raw_resp = await self.client.generate_response(prompt)

        fallback_msg = f"Reminder: Invoice {context['invoice_id']} is unpaid. Please review outstanding balance and settle. Thank you."

        data = json.loads(raw_resp)
        sms_text = data["sms_body"]
        # Enforce strict 320 char limit
        if len(sms_text) > 320:
            sms_text = sms_text[:317] + "..."
        return sms_text
