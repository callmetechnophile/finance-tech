from typing import List
from app.modules.module2_liquidity.schemas.scenario_schema import StressScenarioResult

class RunwayComparator:
    """
    Ranks simulated scenarios based on risk levels and liquidity index scores.
    """

    def rank_scenarios(self, results: List[StressScenarioResult]) -> List[StressScenarioResult]:
        # Risk ordering map (lower value means safer/lower risk)
        risk_map = {
            "Very Low": 1,
            "Low": 2,
            "Medium": 3,
            "High": 4,
            "Critical": 5
        }

        # Sort key: 
        # Primary: risk level ascending (safer first).
        # Secondary: liquidity score descending (higher score is better).
        # Tertiary: buffer days descending (longer runway first).
        def sort_key(r: StressScenarioResult):
            risk_val = risk_map.get(r.risk_level, 3)
            return (risk_val, -r.liquidity_score, -r.buffer_days)

        sorted_results = sorted(results, key=sort_key)
        return sorted_results
