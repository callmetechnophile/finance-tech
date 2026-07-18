from typing import List
from app.modules.module2_liquidity.schemas.recommendation_schema import LiquidityRecommendation

class RecommendationValidator:
    """
    Validates recommendations, filtering out duplicate or conflicting suggestions.
    """

    def validate_recommendations(self, recs: List[LiquidityRecommendation]) -> List[LiquidityRecommendation]:
        validated: List[LiquidityRecommendation] = []
        seen_ids = set()

        # 1. De-duplicate by ID
        for r in recs:
            if r.recommendation_id in seen_ids:
                continue
            seen_ids.add(r.recommendation_id)
            validated.append(r)

        # 2. Check for conflicts
        has_critical_actions = any(x.urgency in ["Critical", "High"] for x in validated)
        has_maintain = any(x.recommendation_id == "REC-MAINTAIN-STRATEGY" for x in validated)
        has_early_pay = any(x.recommendation_id == "REC-EARLY-PAYMENT-DISCOUNTS" for x in validated)

        # Conflict resolution logic:
        # - If there are Critical/High actions, discard "Maintain Current Allocation Strategy" (cannot maintain and do crisis interventions)
        if has_critical_actions and has_maintain:
            validated = [x for x in validated if x.recommendation_id != "REC-MAINTAIN-STRATEGY"]
            
        # - If there are Critical/High actions, discard "Early Payment Discount Negotiations" (cannot pay early if cash is low)
        if has_critical_actions and has_early_pay:
            validated = [x for x in validated if x.recommendation_id != "REC-EARLY-PAYMENT-DISCOUNTS"]

        return validated
