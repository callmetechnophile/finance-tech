from dataclasses import dataclass
from typing import Optional

@dataclass
class ForecastInput:
    """
    Data structure for cash flow forecast parameters and runtime overrides.
    """
    manual_balance_override: Optional[float] = None
    moving_average_window: int = 30
    horizon_days: int = 30
