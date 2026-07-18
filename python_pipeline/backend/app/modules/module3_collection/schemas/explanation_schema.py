from dataclasses import dataclass, field
from typing import List

@dataclass
class PriorityExplanation:
    """
    Schema explaining why an invoice was prioritized, strictly using deterministic reason codes.
    """
    invoice_id: str
    explanation_text: str
    reason_codes_used: List[str] = field(default_factory=list)
    generated_by: str = "Gemma"
