import json
import logging
from typing import Dict, Any
from app.modules.module3_collection.ai.gemma_client import GemmaClient
from app.modules.module3_collection.ai.prompt_builder import PromptBuilder

logger = logging.getLogger(__name__)

class WhatsappGenerator:
    """
    Coordinates WhatsApp reminder message generation with Gemma.
    """

    def __init__(self, client: GemmaClient = None):
        self.client = client or GemmaClient()
        self.builder = PromptBuilder()

    async def generate_whatsapp(self, context: Dict[str, Any], tone: str) -> str:
        prompt = self.builder.build_whatsapp_prompt(context, tone)
        raw_resp = await self.client.generate_response(prompt)

        fallback_msg = (
            f"Hello! Just a reminder that invoice {context['invoice_id']} of "
            f"{context['outstanding_balance']} is due on {context['due_date']}. "
            f"Please make payment here: [payment_link]"
        )

        data = json.loads(raw_resp)
        return data["whatsapp_body"]
