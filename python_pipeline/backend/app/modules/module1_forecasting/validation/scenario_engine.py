import copy
import datetime
from typing import List
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.scenario_schema import ScenarioResult
from app.modules.module1_forecasting.services.forecast_engine import ForecastEngine

class ScenarioEngine:
    """
    Simulates alternative business scenarios by modifying forecast inputs and running projection engine.
    """

    def __init__(self):
        self.engine = ForecastEngine()

    def run_scenarios(self, features: ForecastFeatures, start_date: datetime.date = None) -> List[ScenarioResult]:
        if start_date is None:
            start_date = datetime.date.today()
            
        results: List[ScenarioResult] = []

        # Helper to compute risk level
        def determine_risk(buffer: float) -> str:
            if buffer < 0:
                return "Critical"
            elif buffer < 10000.0:
                return "High"
            elif buffer < 25000.0:
                return "Medium"
            return "Low"

        # --- 1. Base Case ---
        base_days = self.engine.forecast_90_days(features, start_date)
        base_buffer = min(day.projected_balance for day in base_days)
        results.append(ScenarioResult(
            scenario_name="Base Case",
            projected_balance=base_days[-1].projected_balance,
            cash_buffer=base_buffer,
            receivables=sum(r["total_amount"] for r in features.receivables),
            payables=sum(p["total_amount"] for p in features.payables),
            risk_level=determine_risk(base_buffer)
        ))

        # --- 2. Optimistic Scenario (+15% variable revenue, no customer delays) ---
        opt_features = copy.deepcopy(features)
        # Scale up inflows history (which scales rolling averages)
        for k in opt_features.daily_cash_inflow:
            opt_features.daily_cash_inflow[k] *= 1.15
        opt_days = self.engine.forecast_90_days(opt_features, start_date)
        opt_buffer = min(day.projected_balance for day in opt_days)
        results.append(ScenarioResult(
            scenario_name="Optimistic Case",
            projected_balance=opt_days[-1].projected_balance,
            cash_buffer=opt_buffer,
            receivables=sum(r["total_amount"] for r in opt_features.receivables),
            payables=sum(p["total_amount"] for p in opt_features.payables),
            risk_level=determine_risk(opt_buffer)
        ))

        # --- 3. Pessimistic Scenario (-20% variable revenue, +15% vendor cost increases) ---
        pess_features = copy.deepcopy(features)
        for k in pess_features.daily_cash_inflow:
            pess_features.daily_cash_inflow[k] *= 0.8
        for p in pess_features.payables:
            p["total_amount"] *= 1.15
        pess_days = self.engine.forecast_90_days(pess_features, start_date)
        pess_buffer = min(day.projected_balance for day in pess_days)
        results.append(ScenarioResult(
            scenario_name="Pessimistic Case",
            projected_balance=pess_days[-1].projected_balance,
            cash_buffer=pess_buffer,
            receivables=sum(r["total_amount"] for r in pess_features.receivables),
            payables=sum(p["total_amount"] for p in pess_features.payables),
            risk_level=determine_risk(pess_buffer)
        ))

        # --- 4. Customer Delays Payment (All receivables due dates shifted by 14 days) ---
        delay_features = copy.deepcopy(features)
        for r in delay_features.receivables:
            due_dt = datetime.date.fromisoformat(r["due_date"])
            r["due_date"] = (due_dt + datetime.timedelta(days=14)).strftime("%Y-%m-%d")
        delay_days = self.engine.forecast_90_days(delay_features, start_date)
        delay_buffer = min(day.projected_balance for day in delay_days)
        results.append(ScenarioResult(
            scenario_name="Customer Payment Delays (+14d)",
            projected_balance=delay_days[-1].projected_balance,
            cash_buffer=delay_buffer,
            receivables=sum(r["total_amount"] for r in delay_features.receivables),
            payables=sum(p["total_amount"] for p in delay_features.payables),
            risk_level=determine_risk(delay_buffer)
        ))

        # --- 5. Raw Material Cost Spike (+20% vendor price increase) ---
        cost_features = copy.deepcopy(features)
        for p in cost_features.payables:
            p["total_amount"] *= 1.2
        cost_days = self.engine.forecast_90_days(cost_features, start_date)
        cost_buffer = min(day.projected_balance for day in cost_days)
        results.append(ScenarioResult(
            scenario_name="Material Price Hikes (+20%)",
            projected_balance=cost_days[-1].projected_balance,
            cash_buffer=cost_buffer,
            receivables=sum(r["total_amount"] for r in cost_features.receivables),
            payables=sum(p["total_amount"] for p in cost_features.payables),
            risk_level=determine_risk(cost_buffer)
        ))

        # --- 6. Lost Customer (Drops the largest outstanding receivable) ---
        lost_features = copy.deepcopy(features)
        if lost_features.receivables:
            lost_features.receivables.sort(key=lambda r: r["total_amount"])
            lost_features.receivables.pop() # remove largest
        lost_days = self.engine.forecast_90_days(lost_features, start_date)
        lost_buffer = min(day.projected_balance for day in lost_days)
        results.append(ScenarioResult(
            scenario_name="Lost Primary Customer Invoice",
            projected_balance=lost_days[-1].projected_balance,
            cash_buffer=lost_buffer,
            receivables=sum(r["total_amount"] for r in lost_features.receivables),
            payables=sum(p["total_amount"] for p in lost_features.payables),
            risk_level=determine_risk(lost_buffer)
        ))

        return results
