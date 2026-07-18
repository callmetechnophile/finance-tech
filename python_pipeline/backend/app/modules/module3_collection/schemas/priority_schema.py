from dataclasses import dataclass, field
from typing import List

@dataclass
class InvoicePriority:
    """
    Schema representing ranked collection priority metrics for a single invoice.
    """
    priority_score: float  # 0 to 100
    priority_level: str  # Critical, High, Medium, Low
    reason_codes: List[str] = field(default_factory=list)
    ranking_position: int = 0
