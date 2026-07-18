import datetime
import json
import logging
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.modules.module5_copilot.services.query_router import QueryRouter
from app.modules.module5_copilot.services.context_builder import ContextBuilder
from app.modules.module5_copilot.services.conversation_manager import ConversationManager
from app.modules.module5_copilot.services.copilot_response_validator import CopilotResponseValidator
from app.modules.module5_copilot.schemas.copilot_schema import CopilotChatResponse
from app.integrations.ai.ai_gateway import AIGateway

logger = logging.getLogger(__name__)

class CopilotService:
    def __init__(self):
        self.router = QueryRouter()
        self.context_builder = ContextBuilder()
        self.conversation_manager = ConversationManager()
        self.validator = CopilotResponseValidator()
        self.ai_gateway = AIGateway()

    async def execute_chat(
        self,
        session: Session,
        session_id: str,
        user_message: str,
        today: datetime.date = None
    ) -> CopilotChatResponse:
        if today is None:
            today = datetime.date.today()

        # 1. Route query to modules
        routed = self.router.route_query(user_message)

        # 2. Build financial context
        context = await self.context_builder.build_context(session, routed, today)

        # Retrieve chat history
        session_obj = self.conversation_manager.get_or_create_session(session_id)
        history_dump = [msg.model_dump() for msg in session_obj.history[-5:]]

        # 3. Prompt Builder (Gemma context injection)
        prompt = (
            "SYSTEM INSTRUCTION: You are FORGE-PATH, a premium AI Financial Copilot for Manufacturing SMEs.\n"
            "Answer the user's financial question using ONLY the provided structured financial context.\n"
            "STRICT RULES:\n"
            "1. Do NOT perform any calculations yourself. Trust and use the provided context numbers as-is.\n"
            "2. Do NOT invent or hallucinate any financial figures not present in the context.\n"
            "3. Format your response clearly in markdown.\n\n"
            f"Context: {json.dumps(context)}\n\n"
            f"History: {json.dumps(history_dump)}\n\n"
            f"User Question: {user_message}\n"
        )

        ai_response_text = ""
        try:
            # 4. Gemma inference via NIM Integration
            # We call the client execute_chat directly
            ai_response_text = await self.ai_gateway.service.client.execute_chat(prompt)
            
            # 5. Response Validation
            valid, err = self.validator.validate_response(ai_response_text, context)
            if not valid:
                logger.warning(f"Copilot validation failed: {err}. Retrying once...")
                # Retry once
                ai_response_text = await self.ai_gateway.service.client.execute_chat(prompt)
                valid, err = self.validator.validate_response(ai_response_text, context)
                if not valid:
                    raise ValueError(f"Second validation failed: {err}")
        except Exception as ex:
            logger.error(f"AI response failed, using deterministic fallback: {str(ex)}")
            # Deterministic fallback summary based on context
            ai_response_text = self._build_deterministic_fallback(context)

        # Update manager state
        self.conversation_manager.add_message(session_id, "user", user_message)
        self.conversation_manager.add_message(session_id, "assistant", ai_response_text)

        suggestions = self.conversation_manager.get_suggested_questions(routed)

        return CopilotChatResponse(
            response=ai_response_text,
            referenced_metrics=context,
            suggested_questions=suggestions,
            timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )

    def _build_deterministic_fallback(self, context: Dict[str, Any]) -> str:
        summary = "Here is your current financial health summary based on live metrics:\n\n"
        metrics = context.get("modules", {})
        
        if "LIQUIDITY" in metrics:
            liq = metrics["LIQUIDITY"]
            summary += f"- **Liquidity Score**: {liq.get('liquidity_score')}/100 with **{liq.get('runway_days')} days** of cash runway.\n"
        if "COLLECTIONS" in metrics:
            coll = metrics["COLLECTIONS"]
            summary += f"- **Outstanding Receivables**: {coll.get('outstanding_invoices_count')} invoices totaling **${coll.get('total_receivables_value'):,.2f}** are pending follow-up.\n"
        if "PAYMENTS" in metrics:
            pay = metrics["PAYMENTS"]
            summary += f"- **Allocated Vendor Payouts**: **${pay.get('allocated_payments_total'):,.2f}** scheduled, saving **${pay.get('savings_potential'):,.2f}** in capture opportunities.\n"
            
        return summary
