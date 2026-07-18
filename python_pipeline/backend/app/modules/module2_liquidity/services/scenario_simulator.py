import copy
import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures as M1Features
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse as M1Forecast
from app.modules.module1_forecasting.services.forecast_engine import ForecastEngine
from app.modules.module2_liquidity.schemas.stress_schema import StressScenarioInput
from app.modules.module2_liquidity.schemas.scenario_schema import StressScenarioResult
from app.modules.module2_liquidity.services.working_capital_engine import WorkingCapitalEngine
from app.modules.module2_liquidity.services.burn_rate_engine import BurnRateEngine
from app.modules.module2_liquidity.services.cash_buffer_engine import CashBufferEngine
from app.modules.module2_liquidity.services.liquidity_score_engine import LiquidityScoreEngine
from app.modules.module2_liquidity.services.liquidity_engine import LiquidityEngine

from app.modules.module2_liquidity.services.liquidity_feature_service import LiquidityFeatureService

class ScenarioSimulator:
    """
    Executes stress scenario parameters against features and recalculates runway metrics in-memory.
    """

    def __init__(self):
        self.forecast_engine = ForecastEngine()
        self.wc_engine = WorkingCapitalEngine()
        self.burn_engine = BurnRateEngine()
        self.buffer_engine = CashBufferEngine()
        self.score_engine = LiquidityScoreEngine()
        self.risk_engine = LiquidityEngine()
        self.feature_service = LiquidityFeatureService()

    def simulate_scenario(
        self, 
        m1_features: M1Features, 
        scenario_input: StressScenarioInput, 
        start_date: datetime.date = None
    ) -> StressScenarioResult:
        if start_date is None:
            start_date = datetime.date.today()

        # 1. Copy features to keep simulations isolated
        feat = copy.deepcopy(m1_features)

        # 2. Apply parameters in-memory
        feat.current_cash_balance += scenario_input.cash_adjustment
        feat.recurring_expenses *= scenario_input.recurring_expense_multiplier

        # Shift receivables due dates
        if scenario_input.receivables_delay_days > 0:
            for r in feat.receivables:
                due_dt = datetime.date.fromisoformat(r["due_date"])
                r["due_date"] = (due_dt + datetime.timedelta(days=scenario_input.receivables_delay_days)).strftime("%Y-%m-%d")

        # Scale payables total amount
        if scenario_input.payables_cost_multiplier != 1.0:
            for p in feat.payables:
                p["total_amount"] *= scenario_input.payables_cost_multiplier

        # Scale historical inflows (which shifts forecast averages)
        if scenario_input.revenue_multiplier != 1.0:
            for k in feat.daily_cash_inflow:
                feat.daily_cash_inflow[k] *= scenario_input.revenue_multiplier

        # 3. Re-run Forecast Engine for 30 days
        forecast_days = self.forecast_engine.forecast_30_days(feat, start_date)
        ending_cash = forecast_days[-1].projected_balance if forecast_days else feat.current_cash_balance

        # 4. Recalculate liquidity parameters
        total_rec = sum(r["total_amount"] for r in feat.receivables)
        total_pay = sum(p["total_amount"] for p in feat.payables)
        
        wc = self.wc_engine.calculate_working_capital(
            current_cash=feat.current_cash_balance,
            receivables_total=total_rec,
            payables_total=total_pay
        )

        hist_outflows = list(feat.daily_cash_outflow.values())
        burn = self.burn_engine.calculate_burn_rate(
            historical_outflows=hist_outflows,
            recurring_expenses=feat.recurring_expenses
        )

        buf = self.buffer_engine.calculate_cash_buffer(
            current_cash=feat.current_cash_balance,
            daily_burn_rate=burn.daily_burn_rate
        )

        # Calculate scores
        today_str = start_date.strftime("%Y-%m-%d")
        delayed_rec = sum(r["total_amount"] for r in feat.receivables if r["due_date"] < today_str)
        rec_delay_ratio = delayed_rec / total_rec if total_rec > 0 else 0.0
        
        payable_ratio = total_pay / feat.current_cash_balance if feat.current_cash_balance > 0 else 99.0
        burn_income_ratio = feat.recurring_income / feat.recurring_expenses if feat.recurring_expenses > 0 else 1.0

        score = self.score_engine.calculate_score(
            buffer_days=buf.buffer_days_available,
            wc_ratio=wc.working_capital_ratio,
            receivable_delay_ratio=rec_delay_ratio,
            payable_ratio=payable_ratio,
            burn_income_ratio=burn_income_ratio
        )

        from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse, ForecastSummary, ForecastMetadata
        dummy_forecast = ForecastResponse(
            summary=ForecastSummary(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, ""),
            metadata=ForecastMetadata("", "", {}),
            forecast_days=forecast_days
        )
        liq_feat = self.feature_service.prepare_features(feat, dummy_forecast)

        risk_level, _ = self.risk_engine.analyze_risk(
            score=score,
            features=liq_feat,
            working_capital=wc,
            buffer_days=buf.buffer_days_available,
            receivable_delay_ratio=rec_delay_ratio,
            payable_ratio=payable_ratio
        )

        assumptions = {
            "cash_adjustment": scenario_input.cash_adjustment,
            "receivables_delay_days": scenario_input.receivables_delay_days,
            "payables_cost_multiplier": scenario_input.payables_cost_multiplier,
            "revenue_multiplier": scenario_input.revenue_multiplier,
            "recurring_expense_multiplier": scenario_input.recurring_expense_multiplier
        }

        return StressScenarioResult(
            scenario_name=scenario_input.scenario_name,
            ending_cash=round(ending_cash, 2),
            working_capital=wc.net_working_capital,
            working_capital_ratio=wc.working_capital_ratio,
            liquidity_score=score.final_score,
            buffer_days=round(buf.buffer_days_available, 1),
            risk_level=risk_level,
            assumptions_applied=assumptions
        )
