from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures as M1Features
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse as M1Forecast
from app.modules.module2_liquidity.schemas.liquidity_feature_schema import LiquidityFeatures
from app.modules.module2_liquidity.utils.liquidity_constants import DEFAULT_SAFETY_BUFFER

class LiquidityFeatureService:
    """
    Extracts, groups, and maps output models from Module 1 into LiquidityFeatures inputs.
    """

    def prepare_features(self, m1_features: M1Features, m1_forecast: M1Forecast) -> LiquidityFeatures:
        current_cash = m1_features.current_cash_balance
        
        # 1. Expected inflows/outflows over 30 days
        days_30 = m1_forecast.forecast_days[:30]
        expected_inflow = sum(d.projected_inflow for d in days_30)
        expected_outflow = sum(d.projected_outflow for d in days_30)
        
        # 2. Total active receivables and payables values
        total_rec = sum(r["total_amount"] for r in m1_features.receivables)
        total_pay = sum(p["total_amount"] for p in m1_features.payables)
        
        # 3. Liquidity ratios
        rec_ratio = total_rec / current_cash if current_cash > 0 else 99.0
        pay_ratio = total_pay / current_cash if current_cash > 0 else 99.0
        
        # 4. Working Capital variables
        current_assets = current_cash + total_rec
        current_liabilities = total_pay
        net_wc = current_assets - current_liabilities
        
        # 5. Burn Rate calculations
        hist_outflows = list(m1_features.daily_cash_outflow.values())
        if hist_outflows:
            daily_hist = sum(hist_outflows) / len(hist_outflows)
        else:
            daily_hist = 0.0
            
        daily_burn = daily_hist + m1_features.recurring_expenses
        if daily_burn <= 0:
            daily_burn = 100.0 # baseline safety fallback

        safety_buffer = DEFAULT_SAFETY_BUFFER + (daily_burn * 30.0)
        
        # 6. Cash Conversion Cycle estimate (receivables days outstanding proxy)
        avg_daily_inflow = sum(m1_features.daily_cash_inflow.values()) / len(m1_features.daily_cash_inflow) if m1_features.daily_cash_inflow else 100.0
        if avg_daily_inflow > 0:
            ccc = total_rec / avg_daily_inflow
        else:
            ccc = 45.0 # default industry cycle average

        return LiquidityFeatures(
            current_cash=round(current_cash, 2),
            expected_inflow=round(expected_inflow, 2),
            expected_outflow=round(expected_outflow, 2),
            receivable_ratio=round(rec_ratio, 2),
            payable_ratio=round(pay_ratio, 2),
            working_capital=round(net_wc, 2),
            burn_rate=round(daily_burn, 2),
            safety_buffer=round(safety_buffer, 2),
            cash_conversion_cycle=round(ccc, 1),
            active_receivables=m1_features.receivables,
            active_payables=m1_features.payables,
            historical_outflows=hist_outflows
        )
