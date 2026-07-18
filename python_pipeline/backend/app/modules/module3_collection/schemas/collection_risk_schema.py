from dataclasses import dataclass, field
from typing import List

@dataclass
class CollectionRisk:
    """
    Schema representing estimated collection probability and difficulty classifications.
    """
    risk_score: float  # 0 to 100
    risk_level: str  # Critical, High, Medium, Low, Very Low
    collection_probability: float  # percentage probability 0 to 100
    expected_collection_days: int
    contributing_factors: List[str] = field(default_factory=list)
