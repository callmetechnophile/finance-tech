from app.modules.module2_liquidity.schemas.runway_schema import RunwayReport
from app.modules.module2_liquidity.utils.liquidity_constants import DEFAULT_BUFFER_DAYS

class RunwayEngine:
    """
    Computes remaining runway operating days based on liquid assets and daily burn rates.
    """

    def calculate_runway(self, cash_remaining: float, daily_burn_rate: float) -> RunwayReport:
        # Prevent division by zero
        if daily_burn_rate > 0:
            runway_days = cash_remaining / daily_burn_rate
        else:
            runway_days = 999.0 if cash_remaining > 0 else 0.0

        # Categorize runway level
        if runway_days >= 90.0:
            level = "Healthy"
        elif runway_days >= 60.0:
            level = "Stable"
        elif runway_days >= 30.0:
            level = "Monitor"
        else:
            level = "Critical"

        # Calculate buffer remaining compared to standard required coverage
        safe_cash_needed = daily_burn_rate * DEFAULT_BUFFER_DAYS
        buffer_rem = cash_remaining - safe_cash_needed

        return RunwayReport(
            current_runway_days=round(runway_days, 1),
            cash_remaining=round(cash_remaining, 2),
            daily_burn_rate=round(daily_burn_rate, 2),
            runway_level=level,
            minimum_safe_days=int(DEFAULT_BUFFER_DAYS),
            buffer_remaining=round(buffer_rem, 2)
        )
