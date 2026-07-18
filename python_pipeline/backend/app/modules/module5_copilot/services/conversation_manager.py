import datetime
from typing import List, Dict, Any
from app.modules.module5_copilot.schemas.copilot_schema import CopilotMessage, CopilotSession

# Persistent in-memory session log
SESSIONS: Dict[str, CopilotSession] = {}

class ConversationManager:
    def get_or_create_session(self, session_id: str) -> CopilotSession:
        if session_id not in SESSIONS:
            welcome = CopilotMessage(
                role="assistant",
                content="Hello! I'm **FORGE-PATH**, your AI Financial Copilot. Ask me anything about your manufacturing SME's financial health.",
                timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
            )
            SESSIONS[session_id] = CopilotSession(
                session_id=session_id,
                history=[welcome]
            )
        return SESSIONS[session_id]

    def add_message(self, session_id: str, role: str, content: str):
        session = self.get_or_create_session(session_id)
        msg = CopilotMessage(
            role=role,
            content=content,
            timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )
        session.history.append(msg)

    def clear_session(self, session_id: str):
        if session_id in SESSIONS:
            del SESSIONS[session_id]

    def get_suggested_questions(self, context_modules: List[str]) -> List[str]:
        suggestions = []
        if "FORECAST" in context_modules:
            suggestions.append("What does my cash flow forecast look like for the next 30 days?")
        if "LIQUIDITY" in context_modules:
            suggestions.append("Why is my liquidity score changing?")
            suggestions.append("How many days of cash runway do I have?")
        if "COLLECTIONS" in context_modules:
            suggestions.append("Which customer invoices should I follow up on immediately?")
        if "PAYMENTS" in context_modules:
            suggestions.append("Which vendor payments can I delay to conserve runway?")
        
        # General defaults
        suggestions.append("Can I afford to purchase another CNC machine?")
        suggestions.append("Summarize today's financial health.")
        
        return list(set(suggestions))[:4]
