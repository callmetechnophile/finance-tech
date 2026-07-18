from dataclasses import dataclass
from typing import List

@dataclass
class BurnRateReport:
    """
    Data structure detailing daily, weekly, and monthly operational cash burn rates.
    """
    daily_burn_rate: float
    weekly_burn_rate: float
    monthly_burn_rate: float
    avg_operational_cost: float
    cash_consumption_rate: float

class BurnRateEngine:
    """
    Analyzes historical cash debits and recurring expense obligations to calculate cash consumption metrics.
    """

    def calculate_burn_rate(self, historical_outflows: List[float], recurring_expenses: float) -> BurnRateReport:
        # Calculate daily historical outflow rate
        if historical_outflows:
            daily_hist = sum(historical_outflows) / len(historical_outflows)
        else:
            daily_hist = 0.0

        # Daily burn rate combines variable historical outflows and fixed daily overheads
        daily_burn = daily_hist + recurring_expenses
        
        # Safe default if no expense history exists
        if daily_burn <= 0:
            daily_burn = 100.0  # conservative baseline daily burn rate

        return BurnRateReport(
            daily_burn_rate=round(daily_burn, 2),
            weekly_burn_rate=round(daily_burn * 7.0, 2),
            monthly_burn_rate=round(daily_burn * 30.0, 2),
            avg_operational_cost=round(daily_burn * 30.0, 2),
            cash_consumption_rate=round(daily_burn, 2)
        )
