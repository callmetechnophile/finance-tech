from dataclasses import dataclass, field
from typing import List, Dict, Any
from app.modules.module1_forecasting.schemas.business_driver_schema import BusinessDriver
from app.modules.module1_forecasting.schemas.factor_schema import ForecastFactor
from app.modules.module1_forecasting.schemas.trend_schema import Trend
from app.modules.module1_forecasting.schemas.anomaly_schema import FinancialAnomaly
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures

@dataclass
class CashFlowAnalysis:
    """
    Consolidated analysis combining drivers, trends, anomalies, and assets lists.
    """
    top_drivers: List[BusinessDriver] = field(default_factory=list)
    largest_expenses: List[Dict[str, Any]] = field(default_factory=list)
    largest_receivables: List[Dict[str, Any]] = field(default_factory=list)
    largest_payables: List[Dict[str, Any]] = field(default_factory=list)
    trend_summary: List[Trend] = field(default_factory=list)
    detected_anomalies: List[FinancialAnomaly] = field(default_factory=list)
    risk_indicators: List[str] = field(default_factory=list)

class CashFlowAnalyzer:
    """
    Combines outputs from the driver, trend, factor, and anomaly engines into a consolidated analysis.
    """

    def analyze(
        self, 
        features: ForecastFeatures, 
        drivers: List[BusinessDriver], 
        trends: List[Trend], 
        anomalies: List[FinancialAnomaly],
        factors: List[ForecastFactor]
    ) -> CashFlowAnalysis:
        
        # Sort largest open items
        sorted_recs = sorted(features.receivables, key=lambda r: r["total_amount"], reverse=True)[:5]
        sorted_pays = sorted(features.payables, key=lambda p: p["total_amount"], reverse=True)[:5]
        
        # Sort largest historical outflows
        sorted_expenses = []
        for date_str, val in sorted(features.daily_cash_outflow.items(), key=lambda item: item[1], reverse=True)[:5]:
            sorted_expenses.append({"date": date_str, "amount": val})
            
        # Determine risk indicators based on flags
        risk_indicators = []
        if features.current_cash_balance < 10000.0:
            risk_indicators.append("CRITICAL: Cash balance is below safety threshold buffer.")
            
        # If any anomaly is Critical
        if any(a.severity == "Critical" for a in anomalies):
            risk_indicators.append("HIGH RISK: Critical financial anomalies detected in ledgers.")
            
        # If any factor is High risk
        if any(f.impact_level == "High" for f in factors):
            risk_indicators.append("WARNING: High structural concentration risk observed in receivables or overhead burn rates.")

        # If cash balance trend is decreasing
        for t in trends:
            if t.metric_name == "Cash Balance Trend" and t.direction == "Decreasing":
                risk_indicators.append("ALERT: Enterprise cash balance is on a decreasing horizon trend.")

        return CashFlowAnalysis(
            top_drivers=drivers[:5], # top 5 drivers
            largest_expenses=sorted_expenses,
            largest_receivables=sorted_recs,
            largest_payables=sorted_pays,
            trend_summary=trends,
            detected_anomalies=anomalies,
            risk_indicators=risk_indicators
        )
