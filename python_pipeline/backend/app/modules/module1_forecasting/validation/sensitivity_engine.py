import copy
import datetime
from typing import List
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.sensitivity_schema import SensitivityReport
from app.modules.module1_forecasting.services.forecast_engine import ForecastEngine

class SensitivityEngine:
    """
    Evaluates individual variable shifts to rank factors influencing cash flow outcomes.
    """

    def __init__(self):
        self.engine = ForecastEngine()

    def generate_report(self, features: ForecastFeatures, start_date: datetime.date = None) -> List[SensitivityReport]:
        if start_date is None:
            start_date = datetime.date.today()
            
        reports: List[SensitivityReport] = []

        # 0. Get Base Case ending balance
        base_days = self.engine.forecast_90_days(features, start_date)
        base_balance = base_days[-1].projected_balance if base_days else features.current_cash_balance

        if base_balance == 0:
            base_balance = 1.0 # prevent divide by zero

        # Variable 1: Customer Payment Delay (+7 Days lag)
        var1_features = copy.deepcopy(features)
        for r in var1_features.receivables:
            due_dt = datetime.date.fromisoformat(r["due_date"])
            var1_features.due_date = (due_dt + datetime.timedelta(days=7)).strftime("%Y-%m-%d")
        var1_days = self.engine.forecast_90_days(var1_features, start_date)
        var1_bal = var1_days[-1].projected_balance if var1_days else features.current_cash_balance
        impact_var1 = base_balance - var1_bal
        pct_var1 = (impact_var1 / base_balance) * 100.0

        reports.append(SensitivityReport(
            variable="Customer Payment Delay (+7 Days)",
            impact=round(abs(impact_var1), 2),
            ranking=0,
            percentage_change=round(pct_var1, 2)
        ))

        # Variable 2: Revenue Decline (-10% inflow)
        var2_features = copy.deepcopy(features)
        for k in var2_features.daily_cash_inflow:
            var2_features.daily_cash_inflow[k] *= 0.9
        var2_days = self.engine.forecast_90_days(var2_features, start_date)
        var2_bal = var2_days[-1].projected_balance if var2_days else features.current_cash_balance
        impact_var2 = base_balance - var2_bal
        pct_var2 = (impact_var2 / base_balance) * 100.0

        reports.append(SensitivityReport(
            variable="Revenue Inflow Decline (-10%)",
            impact=round(abs(impact_var2), 2),
            ranking=0,
            percentage_change=round(pct_var2, 2)
        ))

        # Variable 3: Payroll / Recurring Cost Increase (+10% recurring expense)
        var3_features = copy.deepcopy(features)
        var3_features.recurring_expenses *= 1.1
        var3_days = self.engine.forecast_90_days(var3_features, start_date)
        var3_bal = var3_days[-1].projected_balance if var3_days else features.current_cash_balance
        impact_var3 = base_balance - var3_bal
        pct_var3 = (impact_var3 / base_balance) * 100.0

        reports.append(SensitivityReport(
            variable="Payroll & Fixed Overheads Increase (+10%)",
            impact=round(abs(impact_var3), 2),
            ranking=0,
            percentage_change=round(pct_var3, 2)
        ))

        # Variable 4: Vendor Price Hikes (+10% payables)
        var4_features = copy.deepcopy(features)
        for p in var4_features.payables:
            p["total_amount"] *= 1.1
        var4_days = self.engine.forecast_90_days(var4_features, start_date)
        var4_bal = var4_days[-1].projected_balance if var4_days else features.current_cash_balance
        impact_var4 = base_balance - var4_bal
        pct_var4 = (impact_var4 / base_balance) * 100.0

        reports.append(SensitivityReport(
            variable="Vendor Price Hikes (+10%)",
            impact=round(abs(impact_var4), 2),
            ranking=0,
            percentage_change=round(pct_var4, 2)
        ))

        # Sort reports by absolute impact in descending order and set rankings
        reports.sort(key=lambda r: r.impact, reverse=True)
        for idx, r in enumerate(reports):
            r.ranking = idx + 1

        return reports
