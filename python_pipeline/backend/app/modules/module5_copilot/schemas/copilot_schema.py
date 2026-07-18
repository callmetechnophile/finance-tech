from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class CopilotMessage:
    role: str  # user, assistant
    content: str
    timestamp: str

    def model_dump(self):
        return self.__dict__

@dataclass
class CopilotSession:
    session_id: str
    history: List[CopilotMessage] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def model_dump(self):
        return {
            "session_id": self.session_id,
            "history": [msg.model_dump() for msg in self.history],
            "metadata": self.metadata
        }

@dataclass
class CopilotChatResponse:
    response: str
    referenced_metrics: Dict[str, Any] = field(default_factory=dict)
    suggested_questions: List[str] = field(default_factory=list)
    timestamp: str = ""

    def model_dump(self):
        return self.__dict__
