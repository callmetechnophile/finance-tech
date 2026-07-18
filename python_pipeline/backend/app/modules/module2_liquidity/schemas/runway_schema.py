from dataclasses import dataclass

@dataclass
class RunwayReport:
    """
    Schema representing cash runway statistics and risk classifications.
    """
    current_runway_days: float
    cash_remaining: float
    daily_burn_rate: float
    runway_level: str  # Healthy, Stable, Monitor, Warning, Critical
    minimum_safe_days: int
    buffer_remaining: float
