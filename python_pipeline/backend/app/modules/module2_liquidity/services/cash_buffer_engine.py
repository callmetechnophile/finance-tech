from dataclasses import dataclass
from app.modules.module2_liquidity.utils.liquidity_constants import DEFAULT_SAFETY_BUFFER, DEFAULT_BUFFER_DAYS

@dataclass
class CashBufferReport:
    """
    Data structure detailing cash reserves health, thresholds, and buffer coverage days.
    """
    min_operating_cash: float
    safety_reserve: float
    emergency_buffer: float
    required_buffer_days: int
    remaining_buffer: float
    buffer_utilization: float
    buffer_days_available: float

class CashBufferEngine:
    """
    Evaluates cash reserve positions against operational burn limits to compute coverage runway.
    """

    def calculate_cash_buffer(self, current_cash: float, daily_burn_rate: float) -> CashBufferReport:
        # Minimum operating cash required for the standard buffer period (e.g. 30 days)
        min_operating = daily_burn_rate * DEFAULT_BUFFER_DAYS
        emergency_buffer = min_operating + DEFAULT_SAFETY_BUFFER
        
        remaining = current_cash - emergency_buffer
        
        # Buffer utilization percentage
        if current_cash > 0:
            utilization = (emergency_buffer / current_cash) * 100.0
        else:
            utilization = 100.0
            
        # Buffer days available (runway days)
        if daily_burn_rate > 0:
            days_avail = current_cash / daily_burn_rate
        else:
            days_avail = 999.0 if current_cash > 0 else 0.0

        return CashBufferReport(
            min_operating_cash=round(min_operating, 2),
            safety_reserve=round(DEFAULT_SAFETY_BUFFER, 2),
            emergency_buffer=round(emergency_buffer, 2),
            required_buffer_days=int(DEFAULT_BUFFER_DAYS),
            remaining_buffer=round(remaining, 2),
            buffer_utilization=round(utilization, 2),
            buffer_days_available=round(days_avail, 2)
        )
