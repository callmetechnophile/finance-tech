import json
import logging
from typing import List, Dict, Any
from app.modules.module3_collection.ai.gemma_client import GemmaClient
from app.modules.module3_collection.ai.prompt_builder import PromptBuilder
from app.modules.module3_collection.schemas.explanation_schema import PriorityExplanation

logger = logging.getLogger(__name__)

class ExplanationGenerator:
    """
    Coordinates prioritization explanations with Gemma, ensuring strictly documented reason codes.
    """

    def __init__(self, client: GemmaClient = None):
        self.client = client or GemmaClient()
        self.builder = PromptBuilder()

    async def generate_explanation(
        self,
        invoice_id: str,
        reason_codes: List[str],
        details: Dict[str, Any]
    ) -> PriorityExplanation:
        
        prompt = self.builder.build_explanation_prompt(invoice_id, reason_codes, details)
        raw_resp = await self.client.generate_response(prompt)

        # Prepare default fallback explanation using reason codes
        default_explanation = f"Invoice {invoice_id} prioritized due to: " + ", ".join(reason_codes)

        data = json.loads(raw_resp)
        exp_text = data["explanation"]
        return PriorityExplanation(
            invoice_id=invoice_id,
            explanation_text=exp_text,
            reason_codes_used=reason_codes
        )
