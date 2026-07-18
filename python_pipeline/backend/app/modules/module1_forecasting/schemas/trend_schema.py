from dataclasses import dataclass

@dataclass
class Trend:
    """
    Schema representing cash flow velocity trends and growth trajectories.
    """
    trend_type: str  # Daily, Weekly, Monthly, Horizon
    metric_name: str  # e.g., Revenue Growth, Expense Growth, Cash Balance Trend
    percentage_change: float
    growth_rate: float
    direction: str  # Increasing, Decreasing, Stable
