from typing import List
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.assumption_schema import ForecastAssumption
from app.modules.module1_forecasting.utils.constants import DEFAULT_CASH_BUFFER

class AssumptionsEngine:
    """
    Identifies and registers underlying pricing, credit, and overhead rules currently driving the projections.
    """

    def generate_assumptions(self, features: ForecastFeatures) -> List[ForecastAssumption]:
        assumptions: List[ForecastAssumption] = []

        # 1. Cash Buffer assumption
        assumptions.append(ForecastAssumption(
            name="Minimum Cash Balance Buffer",
            value=f"${DEFAULT_CASH_BUFFER:,.2f}",
            category="Buffer",
            importance="High",
            modifiable=True
        ))

        # 2. Customer payment lag offset
        assumptions.append(ForecastAssumption(
            name="Standard Customer Payment Terms delay",
            value="Due Date + 5 days constant safety delay",
            category="Credit",
            importance="High",
            modifiable=True
        ))

        # 3. Recurring Payroll & Overhead cost rate
        payroll_daily = features.recurring_expenses
        assumptions.append(ForecastAssumption(
            name="Daily Recurring Overheads and Payroll rate",
            value=f"${payroll_daily:,.2f} per day",
            category="Recurring",
            importance="High",
            modifiable=False
        ))

        # 4. Recurring Credit agreements
        income_daily = features.recurring_income
        assumptions.append(ForecastAssumption(
            name="Daily Recurring Contract Retainers credit rate",
            value=f"${income_daily:,.2f} per day",
            category="Recurring",
            importance="Medium",
            modifiable=False
        ))

        # 5. Volatility estimation basis
        inflows_count = len(features.daily_cash_inflow)
        assumptions.append(ForecastAssumption(
            name="Historical Variable Revenue baseline basis",
            value=f"Computed from {inflows_count} past payment logs",
            category="Revenue basis",
            importance="Medium",
            modifiable=False
        ))

        return assumptions
