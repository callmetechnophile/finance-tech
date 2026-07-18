from dataclasses import dataclass, field
from typing import Dict, Any

@dataclass
class StressScenarioResult:
    """
    Schema representing cash runway and liquidity values after stress testing.
    """
    scenario_name: str
    ending_cash: float
    working_capital: float
    working_capital_ratio: float
    liquidity_score: float
    buffer_days: float
    risk_level: str  # Very Low, Low, Medium, High, Critical
    assumptions_applied: Dict[str, Any] = field(default_factory=dict)
