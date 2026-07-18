from dataclasses import dataclass, field
from typing import List

@dataclass
class PriorityMatrix:
    """
    Schema representing counts of recommendations grouped by urgency priorities.
    """
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    ranked_ids: List[str] = field(default_factory=list)
