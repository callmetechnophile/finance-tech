from dataclasses import dataclass

@dataclass
class WorkingCapital:
    """
    Schema representing Working Capital assets, liabilities, ratios, and health categories.
    """
    current_assets: float
    current_liabilities: float
    net_working_capital: float
    working_capital_ratio: float
    working_capital_health: str  # Excellent, Healthy, Warning, Critical
