from typing import List, Dict
import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.trend_schema import Trend
from app.modules.module1_forecasting.utils.statistics import mean

class TrendEngine:
    """
    Computes mathematical trends, growth rates, and direction indexes of historical financial flows.
    """

    def analyze_trends(self, features: ForecastFeatures) -> List[Trend]:
        trends: List[Trend] = []

        # 1. Revenue (Inflow) Trend Analysis
        inflows = list(features.daily_cash_inflow.values())
        if len(inflows) >= 4:
            # Split into two halves to measure growth trend
            mid = len(inflows) // 2
            first_half = inflows[:mid]
            second_half = inflows[mid:]
            
            mean1 = mean(first_half)
            mean2 = mean(second_half)
            
            if mean1 > 0:
                pct_change = ((mean2 - mean1) / mean1) * 100.0
                growth_rate = mean2 - mean1
                
                direction = "Stable"
                if pct_change > 5.0:
                    direction = "Increasing"
                elif pct_change < -5.0:
                    direction = "Decreasing"
                    
                trends.append(Trend(
                    trend_type="Weekly",
                    metric_name="Revenue Growth",
                    percentage_change=round(pct_change, 2),
                    growth_rate=round(growth_rate, 2),
                    direction=direction
                ))

        # 2. Expense (Outflow) Trend Analysis
        outflows = list(features.daily_cash_outflow.values())
        if len(outflows) >= 4:
            mid = len(outflows) // 2
            first_half = outflows[:mid]
            second_half = outflows[mid:]
            
            mean1 = mean(first_half)
            mean2 = mean(second_half)
            
            if mean1 > 0:
                pct_change = ((mean2 - mean1) / mean1) * 100.0
                growth_rate = mean2 - mean1
                
                direction = "Stable"
                if pct_change > 5.0:
                    direction = "Increasing"
                elif pct_change < -5.0:
                    direction = "Decreasing"
                    
                trends.append(Trend(
                    trend_type="Weekly",
                    metric_name="Expense Growth",
                    percentage_change=round(pct_change, 2),
                    growth_rate=round(growth_rate, 2),
                    direction=direction
                ))

        # 3. Cash Balance Trend Analysis
        balances = list(features.historical_cash_balance.values())
        if len(balances) >= 4:
            mid = len(balances) // 2
            first_half = balances[:mid]
            second_half = balances[mid:]
            
            mean1 = mean(first_half)
            mean2 = mean(second_half)
            
            if mean1 > 0:
                pct_change = ((mean2 - mean1) / mean1) * 100.0
                growth_rate = mean2 - mean1
                
                direction = "Stable"
                if pct_change > 2.0:
                    direction = "Increasing"
                elif pct_change < -2.0:
                    direction = "Decreasing"
                    
                trends.append(Trend(
                    trend_type="Horizon",
                    metric_name="Cash Balance Trend",
                    percentage_change=round(pct_change, 2),
                    growth_rate=round(growth_rate, 2),
                    direction=direction
                ))
                
        return trends
