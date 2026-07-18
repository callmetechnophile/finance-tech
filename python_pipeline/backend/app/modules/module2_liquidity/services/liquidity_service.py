import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures as M1Features
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse as M1Forecast
from app.modules.module2_liquidity.schemas.liquidity_report_schema import LiquidityIntelligence
from app.modules.module2_liquidity.services.liquidity_feature_service import LiquidityFeatureService
from app.modules.module2_liquidity.services.working_capital_engine import WorkingCapitalEngine
from app.modules.module2_liquidity.services.burn_rate_engine import BurnRateEngine
from app.modules.module2_liquidity.services.cash_buffer_engine import CashBufferEngine
from app.modules.module2_liquidity.services.liquidity_score_engine import LiquidityScoreEngine
from app.modules.module2_liquidity.services.liquidity_engine import LiquidityEngine

class LiquidityService:
    """
    Main orchestration service evaluating the deterministic liquidity health and risk parameters.
    """

    def __init__(self):
        self.feature_service = LiquidityFeatureService()
        self.wc_engine = WorkingCapitalEngine()
        self.burn_engine = BurnRateEngine()
        self.buffer_engine = CashBufferEngine()
        self.score_engine = LiquidityScoreEngine()
        self.risk_engine = LiquidityEngine()

    def run_liquidity_analysis(
        self, 
        m1_features: M1Features, 
        m1_forecast: M1Forecast, 
        company_id: str = "apex-manufacturing-uuid"
    ) -> LiquidityIntelligence:
        
        # 1. Prepare Liquidity Features
        liq_features = self.feature_service.prepare_features(m1_features, m1_forecast)
        
        # 2. Run Working Capital calculations
        total_rec = sum(r["total_amount"] for r in m1_features.receivables)
        total_pay = sum(p["total_amount"] for p in m1_features.payables)
        wc = self.wc_engine.calculate_working_capital(
            current_cash=liq_features.current_cash,
            receivables_total=total_rec,
            payables_total=total_pay
        )
        
        # 3. Run Burn Rate analysis
        burn = self.burn_engine.calculate_burn_rate(
            historical_outflows=liq_features.historical_outflows,
            recurring_expenses=m1_features.recurring_expenses
        )
        
        # 4. Run Cash Buffer analysis
        buf = self.buffer_engine.calculate_cash_buffer(
            current_cash=liq_features.current_cash,
            daily_burn_rate=burn.daily_burn_rate
        )
        
        # 5. Compute Receivables delay ratio for scoring
        today_str = "2026-07-15"
        delayed_rec = sum(r["total_amount"] for r in m1_features.receivables if r["due_date"] < today_str)
        rec_delay_ratio = delayed_rec / total_rec if total_rec > 0 else 0.0
        
        # Calculate burn rate income ratio (structural balance)
        burn_income_ratio = m1_features.recurring_income / m1_features.recurring_expenses if m1_features.recurring_expenses > 0 else 1.0

        # Calculate Liquidity Score
        score = self.score_engine.calculate_score(
            buffer_days=buf.buffer_days_available,
            wc_ratio=wc.working_capital_ratio,
            receivable_delay_ratio=rec_delay_ratio,
            payable_ratio=liq_features.payable_ratio,
            burn_income_ratio=burn_income_ratio
        )
        
        # 6. Analyze risk level & contributing factors
        risk_level, factors = self.risk_engine.analyze_risk(
            score=score,
            features=liq_features,
            working_capital=wc,
            buffer_days=buf.buffer_days_available,
            receivable_delay_ratio=rec_delay_ratio,
            payable_ratio=liq_features.payable_ratio
        )

        return LiquidityIntelligence(
            company_id=company_id,
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            current_cash=liq_features.current_cash,
            working_capital=wc.net_working_capital,
            working_capital_ratio=wc.working_capital_ratio,
            burn_rate=burn.monthly_burn_rate,
            cash_buffer=buf.emergency_buffer,
            buffer_days=buf.buffer_days_available,
            liquidity_score=score.final_score,
            liquidity_level=score.classification,
            risk_level=risk_level,
            receivable_ratio=liq_features.receivable_ratio,
            payable_ratio=liq_features.payable_ratio,
            cash_conversion_cycle=liq_features.cash_conversion_cycle,
            contributing_factors=factors
        )
