from dataclasses import dataclass, field
from typing import List
import datetime

from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse
from app.modules.module1_forecasting.schemas.confidence_schema import ForecastConfidence
from app.modules.module1_forecasting.schemas.validation_schema import ValidationReport
from app.modules.module1_forecasting.schemas.assumption_schema import ForecastAssumption
from app.modules.module1_forecasting.schemas.scenario_schema import ScenarioResult
from app.modules.module1_forecasting.schemas.sensitivity_schema import SensitivityReport
from app.modules.module1_forecasting.validation.forecast_comparator import ForecastComparison, ForecastComparator
from app.modules.module1_forecasting.validation.confidence_engine import ConfidenceEngine
from app.modules.module1_forecasting.validation.assumptions_engine import AssumptionsEngine
from app.modules.module1_forecasting.validation.scenario_engine import ScenarioEngine
from app.modules.module1_forecasting.validation.sensitivity_engine import SensitivityEngine
from app.modules.module1_forecasting.validation.validation_engine import ValidationEngine

@dataclass
class ForecastValidationReport:
    """
    Consolidated validation and scenario simulation report for the forecast run.
    """
    forecast: ForecastResponse
    confidence: ForecastConfidence
    validation: ValidationReport
    assumptions: List[ForecastAssumption] = field(default_factory=list)
    scenario_results: List[ScenarioResult] = field(default_factory=list)
    sensitivity_report: List[SensitivityReport] = field(default_factory=list)
    comparison: ForecastComparison = None
    overall_reliability: str = "Low"
    generated_timestamp: str = ""

class ForecastValidationService:
    """
    Orchestration layer coordinating confidence checks, assumptions indexing, scenario runs, and variances.
    """

    def __init__(self):
        self.confidence_engine = ConfidenceEngine()
        self.assumptions_engine = AssumptionsEngine()
        self.scenario_engine = ScenarioEngine()
        self.sensitivity_engine = SensitivityEngine()
        self.validation_engine = ValidationEngine()
        self.comparator = ForecastComparator()

    def run_validation(
        self, 
        features: ForecastFeatures, 
        current_forecast: ForecastResponse, 
        previous_forecast: ForecastResponse = None,
        start_date: datetime.date = None
    ) -> ForecastValidationReport:
        if start_date is None:
            start_date = datetime.date.today()
            
        # 1. Run all engines
        conf = self.confidence_engine.calculate_confidence(features)
        assumptions = self.assumptions_engine.generate_assumptions(features)
        scenarios = self.scenario_engine.run_scenarios(features, start_date)
        sensitivities = self.sensitivity_engine.generate_report(features, start_date)
        val_rep = self.validation_engine.validate_forecast(features, current_forecast.forecast_days)
        
        # 2. Run comparator
        if previous_forecast is None:
            # Mock placeholder comparator if no past runs exist
            comp = ForecastComparison(
                status_change="Unchanged",
                buffer_difference=0.0,
                ending_balance_difference=0.0,
                details="No previous forecast record available for comparative variance check."
            )
        else:
            comp = self.comparator.compare_forecasts(current_forecast, previous_forecast)
            
        # Determine overall reliability index
        reliability = conf.confidence_level
        if val_rep.status == "FAIL":
            reliability = "Low (Failing consistency checks)"

        return ForecastValidationReport(
            forecast=current_forecast,
            confidence=conf,
            validation=val_rep,
            assumptions=assumptions,
            scenario_results=scenarios,
            sensitivity_report=sensitivities,
            comparison=comp,
            overall_reliability=reliability,
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )
