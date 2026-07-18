from dataclasses import dataclass, field
from typing import List
from app.modules.module2_liquidity.schemas.runway_schema import RunwayReport
from app.modules.module2_liquidity.schemas.scenario_schema import StressScenarioResult

@dataclass
class LiquidityScenarioReport:
    """
    Schema representing the complete simulated stress test report.
    """
    base_case: StressScenarioResult
    optimistic_case: StressScenarioResult
    pessimistic_case: StressScenarioResult
    stress_test_results: List[StressScenarioResult] = field(default_factory=list)
    cash_runway: RunwayReport = None
    scenario_rankings: List[StressScenarioResult] = field(default_factory=list)
    highest_risk_scenario: str = ""
    lowest_risk_scenario: str = ""
    overall_resilience_score: float = 0.0
    generated_timestamp: str = ""
