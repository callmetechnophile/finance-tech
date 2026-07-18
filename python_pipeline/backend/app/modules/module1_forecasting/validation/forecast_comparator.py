from dataclasses import dataclass
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse

@dataclass
class ForecastComparison:
    """
    Schema detailing the variance between two consecutive forecast runs.
    """
    status_change: str  # Improved, Worsened, Unchanged
    buffer_difference: float
    ending_balance_difference: float
    details: str

class ForecastComparator:
    """
    Compares the current forecast run against a historical run to identify changes in the SME's liquidity trends.
    """

    def compare_forecasts(self, current: ForecastResponse, previous: ForecastResponse) -> ForecastComparison:
        # Ending balances (90-day close)
        curr_bal = current.summary.horizon_90_day_balance
        prev_bal = previous.summary.horizon_90_day_balance
        
        # Minimum cash buffers
        curr_buf = current.summary.minimum_90_day_buffer
        prev_buf = previous.summary.minimum_90_day_buffer

        bal_diff = curr_bal - prev_bal
        buf_diff = curr_buf - prev_buf

        if bal_diff > 500.0:
            status = "Improved"
            details = f"Liquidity outlook improved. Ending cash balance projected to increase by ${bal_diff:,.2f} compared to prior run."
        elif bal_diff < -500.0:
            status = "Worsened"
            details = f"Liquidity outlook deteriorated. Ending cash balance projected to decrease by ${abs(bal_diff):,.2f} compared to prior run."
        else:
            status = "Unchanged"
            details = "Projected liquidity limits remain consistent with prior run projections."

        return ForecastComparison(
            status_change=status,
            buffer_difference=round(buf_diff, 2),
            ending_balance_difference=round(bal_diff, 2),
            details=details
        )
