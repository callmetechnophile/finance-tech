from dataclasses import dataclass

@dataclass
class LiquidityRecommendation:
    """
    Schema representing a deterministic action recommendation derived from business rules.
    """
    recommendation_id: str
    title: str
    description: str
    reason: str
    expected_financial_impact: float
    urgency: str  # Critical, High, Medium, Low
    category: str  # e.g., Accounts Receivable, Accounts Payable, Overheads, CapEx
    estimated_benefit: str
    estimated_risk: str
    required_action: str
