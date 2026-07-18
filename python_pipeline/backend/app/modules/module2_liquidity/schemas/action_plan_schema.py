from dataclasses import dataclass, field
from typing import List
from app.modules.module2_liquidity.schemas.recommendation_schema import LiquidityRecommendation

@dataclass
class ActionPlan:
    """
    Chronological framework detailing action lists.
    """
    immediate_actions: List[LiquidityRecommendation] = field(default_factory=list)
    this_week: List[LiquidityRecommendation] = field(default_factory=list)
    this_month: List[LiquidityRecommendation] = field(default_factory=list)
    monitor: List[LiquidityRecommendation] = field(default_factory=list)
    manager_approval_required: List[LiquidityRecommendation] = field(default_factory=list)
    future_opportunities: List[LiquidityRecommendation] = field(default_factory=list)
