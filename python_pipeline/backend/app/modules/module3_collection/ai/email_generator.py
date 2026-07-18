import json
import logging
from typing import Dict, Any
from app.modules.module3_collection.ai.gemma_client import GemmaClient
from app.modules.module3_collection.ai.prompt_builder import PromptBuilder
from app.modules.module3_collection.schemas.email_schema import EmailCommunication

logger = logging.getLogger(__name__)

class EmailGenerator:
    """
    Coordinates email generation with Gemma, prompting the model and parsing structured schemas.
    """

    def __init__(self, client: GemmaClient = None):
        self.client = client or GemmaClient()
        self.builder = PromptBuilder()

    async def generate_email(
        self,
        context: Dict[str, Any],
        profile: Dict[str, Any],
        tone: str
    ) -> EmailCommunication:
        
        prompt = self.builder.build_email_prompt(context, profile, tone)
        raw_resp = await self.client.generate_response(prompt)

        data = json.loads(raw_resp)
        return EmailCommunication(
            email_subject=data["email_subject"],
            email_body=data["email_body"],
            tone=data.get("tone", tone),
            communication_goal=data.get("communication_goal", "Request payment settlement")
        )
