import datetime
from typing import List
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures as M1Features
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse as M1Forecast
from app.modules.module2_liquidity.schemas.runway_report_schema import LiquidityScenarioReport
from app.modules.module2_liquidity.schemas.scenario_schema import StressScenarioResult
from app.modules.module2_liquidity.schemas.stress_schema import StressScenarioInput
from app.modules.module2_liquidity.services.runway_engine import RunwayEngine
from app.modules.module2_liquidity.services.stress_testing_engine import StressTestingEngine
from app.modules.module2_liquidity.services.scenario_simulator import ScenarioSimulator
from app.modules.module2_liquidity.services.runway_comparator import RunwayComparator

class LiquidityScenarioService:
    """
    Orchestration layer coordinating runway engine outputs and running stress scenario comparisons.
    """

    def __init__(self):
        self.runway_engine = RunwayEngine()
        self.stress_engine = StressTestingEngine()
        self.simulator = ScenarioSimulator()
        self.comparator = RunwayComparator()

    def run_stress_analysis(
        self, 
        m1_features: M1Features, 
        m1_forecast: M1Forecast, 
        start_date: datetime.date = None
    ) -> LiquidityScenarioReport:
        if start_date is None:
            start_date = datetime.date.today()

        # 1. Compute Base Cash Runway Report
        hist_outflows = list(m1_features.daily_cash_outflow.values())
        if hist_outflows:
            daily_hist = sum(hist_outflows) / len(hist_outflows)
        else:
            daily_hist = 0.0
            
        daily_burn = daily_hist + m1_features.recurring_expenses
        if daily_burn <= 0:
            daily_burn = 100.0
            
        runway_rep = self.runway_engine.calculate_runway(
            cash_remaining=m1_features.current_cash_balance,
            daily_burn_rate=daily_burn
        )

        # 2. Run standard simulations
        # --- Base Case ---
        base_input = StressScenarioInput("Base Case", 0.0, 0, 1.0, 1.0, 1.0)
        base_res = self.simulator.simulate_scenario(m1_features, base_input, start_date)

        # --- Optimistic Case (+15% revenue, no customer delays) ---
        opt_input = StressScenarioInput("Optimistic Case", 0.0, 0, 1.0, 1.15, 1.0)
        opt_res = self.simulator.simulate_scenario(m1_features, opt_input, start_date)

        # --- Pessimistic Case (-20% revenue, +15% costs) ---
        pess_input = StressScenarioInput("Pessimistic Case", 0.0, 0, 1.15, 0.80, 1.15)
        pess_res = self.simulator.simulate_scenario(m1_features, pess_input, start_date)

        # Run other stress parameters
        stress_inputs = self.stress_engine.get_standard_scenarios()
        stress_results: List[StressScenarioResult] = []
        for stress_in in stress_inputs:
            stress_results.append(self.simulator.simulate_scenario(m1_features, stress_in, start_date))

        # 3. Rank all simulated events
        all_results = [base_res, opt_res, pess_res] + stress_results
        rankings = self.comparator.rank_scenarios(all_results)

        # Identify worst and best cases
        lowest_risk = rankings[0].scenario_name
        highest_risk = rankings[-1].scenario_name

        # Calculate Overall Resilience Score
        # Percentage of scenarios resulting in Low, Very Low, or Medium risk level
        safe_scenarios = [r for r in all_results if r.risk_level in ["Very Low", "Low", "Medium"]]
        resilience_score = (len(safe_scenarios) / len(all_results)) * 100.0 if all_results else 100.0

        return LiquidityScenarioReport(
            base_case=base_res,
            optimistic_case=opt_res,
            pessimistic_case=pess_res,
            stress_test_results=stress_results,
            cash_runway=runway_rep,
            scenario_rankings=rankings,
            highest_risk_scenario=highest_risk,
            lowest_risk_scenario=lowest_risk,
            overall_resilience_score=round(resilience_score, 1),
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )
