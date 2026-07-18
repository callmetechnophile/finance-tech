from dataclasses import dataclass, field
from typing import List

@dataclass
class EscalationState:
    """
    Schema representing deterministic escalation path states.
    """
    escalation_level: str  # Level 1 to Level 6
    escalation_stage: str  # Friendly, Professional, Firm, Phone_Call, Finance_Escalation, Legal_Review
    days_overdue: int
    reminder_count: int
    escalation_triggers: List[str] = field(default_factory=list)
