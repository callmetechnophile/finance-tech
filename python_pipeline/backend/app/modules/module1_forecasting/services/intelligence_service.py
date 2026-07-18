from dataclasses import dataclass, field
from typing import List, Dict, Any
import datetime

from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.business_driver_schema import BusinessDriver
from app.modules.module1_forecasting.schemas.factor_schema import ForecastFactor
from app.modules.module1_forecasting.schemas.trend_schema import Trend
from app.modules.module1_forecasting.schemas.anomaly_schema import FinancialAnomaly
from app.modules.module1_forecasting.intelligence.business_driver_engine import BusinessDriverEngine
from app.modules.module1_forecasting.intelligence.factor_engine import FactorEngine
from app.modules.module1_forecasting.intelligence.trend_engine import TrendEngine
from app.modules.module1_forecasting.intelligence.anomaly_engine import AnomalyEngine
from app.modules.module1_forecasting.intelligence.cashflow_analyzer import CashFlowAnalyzer, CashFlowAnalysis

@dataclass
class CashFlowIntelligence:
    """
    Unified forecasting intelligence object detailing the 'why' behind projected cash flow changes.
    """
    forecast_window: int
    top_business_drivers: List[BusinessDriver] = field(default_factory=list)
    forecast_factors: List[ForecastFactor] = field(default_factory=list)
    revenue_trends: List[Trend] = field(default_factory=list)
    expense_trends: List[Trend] = field(default_factory=list)
    cashflow_trends: List[Trend] = field(default_factory=list)
    largest_receivables: List[Dict[str, Any]] = field(default_factory=list)
    largest_payables: List[Dict[str, Any]] = field(default_factory=list)
    financial_anomalies: List[FinancialAnomaly] = field(default_factory=list)
    overall_risk_level: str = "Low"
    generated_timestamp: str = ""

class IntelligenceService:
    """
    Orchestration layer coordinating business driver, factor, trend, and anomaly analytics.
    """

    def __init__(self):
        self.driver_engine = BusinessDriverEngine()
        self.factor_engine = FactorEngine()
        self.trend_engine = TrendEngine()
        self.anomaly_engine = AnomalyEngine()
        self.analyzer = CashFlowAnalyzer()

    def run_analysis(self, features: ForecastFeatures, horizon_days: int = 90) -> CashFlowIntelligence:
        # 1. Trigger individual analytical engines
        drivers = self.driver_engine.analyze_drivers(features)
        factors = self.factor_engine.analyze_factors(features)
        trends = self.trend_engine.analyze_trends(features)
        anomalies = self.anomaly_engine.detect_anomalies(features)
        
        # 2. Run consolidator
        consolidated: CashFlowAnalysis = self.analyzer.analyze(
            features=features,
            drivers=drivers,
            trends=trends,
            anomalies=anomalies,
            factors=factors
        )
        
        # Determine overall risk level
        overall_risk = "Low"
        risk_indicators_count = len(consolidated.risk_indicators)
        if risk_indicators_count >= 3:
            overall_risk = "Critical"
        elif risk_indicators_count >= 1:
            overall_risk = "High"
        elif len(anomalies) > 0:
            overall_risk = "Medium"

        # Separate trends by category
        revenue_trends = [t for t in trends if "revenue" in t.metric_name.lower()]
        expense_trends = [t for t in trends if "expense" in t.metric_name.lower()]
        cashflow_trends = [t for t in trends if "balance" in t.metric_name.lower()]

        return CashFlowIntelligence(
            forecast_window=horizon_days,
            top_business_drivers=drivers,
            forecast_factors=factors,
            revenue_trends=revenue_trends,
            expense_trends=expense_trends,
            cashflow_trends=cashflow_trends,
            largest_receivables=consolidated.largest_receivables,
            largest_payables=consolidated.largest_payables,
            financial_anomalies=anomalies,
            overall_risk_level=overall_risk,
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )
