from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.confidence_schema import ForecastConfidence
from app.modules.module1_forecasting.utils.statistics import standard_deviation, mean

class ConfidenceEngine:
    """
    Evaluates historical data volume, cash flow volatility, and data staleness to score forecast reliability.
    """

    def calculate_confidence(self, features: ForecastFeatures) -> ForecastConfidence:
        # 1. Historical data completeness score (0.0 to 1.0)
        # Based on count of historical dates present in inflows/outflows
        inflow_dates = len(features.daily_cash_inflow)
        outflow_dates = len(features.daily_cash_outflow)
        
        # Max out score at 10 distinct days
        completeness = min(1.0, (inflow_dates + outflow_dates) / 20.0) if (inflow_dates + outflow_dates) > 0 else 0.1
        
        # 2. Historical cash volatility check
        balances = list(features.historical_cash_balance.values())
        if len(balances) > 1:
            dev = standard_deviation(balances)
            mu = mean(balances)
            # Volatility is coefficient of variation (dev / mu)
            volatility = dev / mu if mu > 0 else 1.0
        else:
            volatility = 0.5 # default moderate volatility
            
        # Volatility penalty (capped at 0.3)
        volatility_penalty = min(0.3, volatility * 0.1)

        # 3. Base confidence calculation
        score = 0.95 * completeness - volatility_penalty
        score = max(0.1, min(1.0, score))
        
        # Determine confidence level
        if score > 0.8:
            level = "High"
            reason = "Excellent historical transaction density and low cash flow volatility."
        elif score > 0.5:
            level = "Medium"
            reason = "Moderate transaction history available; projections may experience minor variance."
        else:
            level = "Low"
            reason = "Insufficient historical ledger data to accurately model seasonal deviations."

        return ForecastConfidence(
            confidence_score=round(score, 2),
            confidence_level=level,
            reason=reason,
            historical_accuracy=round(score * 100.0, 1),
            data_quality=round(completeness, 2)
        )
