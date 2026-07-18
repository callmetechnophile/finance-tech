from typing import List, Tuple
from app.modules.module2_liquidity.schemas.recommendation_schema import LiquidityRecommendation
from app.modules.module2_liquidity.schemas.priority_schema import PriorityMatrix

class PriorityEngine:
    """
    Ranks recommendations based on urgency levels and financial impact, generating priority matrices.
    """

    def rank_recommendations(self, recs: List[LiquidityRecommendation]) -> Tuple[List[LiquidityRecommendation], PriorityMatrix]:
        urgency_map = {
            "Critical": 1,
            "High": 2,
            "Medium": 3,
            "Low": 4
        }

        # Sort:
        # 1. Urgency ascending (Critical first).
        # 2. Financial impact descending.
        def sort_key(r: LiquidityRecommendation):
            urgency_val = urgency_map.get(r.urgency, 3)
            return (urgency_val, -r.expected_financial_impact)

        sorted_recs = sorted(recs, key=sort_key)

        # Count frequencies
        crit = sum(1 for r in sorted_recs if r.urgency == "Critical")
        high = sum(1 for r in sorted_recs if r.urgency == "High")
        med = sum(1 for r in sorted_recs if r.urgency == "Medium")
        low = sum(1 for r in sorted_recs if r.urgency == "Low")

        matrix = PriorityMatrix(
            critical_count=crit,
            high_count=high,
            medium_count=med,
            low_count=low,
            ranked_ids=[r.recommendation_id for r in sorted_recs]
        )

        return sorted_recs, matrix
