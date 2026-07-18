import datetime
import hashlib
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.forecast_output import (
    ForecastResult, ForecastSummary, ForecastMetadata, ForecastResponse
)
from app.modules.module1_forecasting.services.feature_service import prepare_features as load_features_from_db
from app.modules.module1_forecasting.services.calculations import (
    project_cash_balance, calculate_cash_buffer, rolling_average
)
from app.modules.module1_forecasting.utils.statistics import (
    standard_deviation, confidence_score
)
from app.modules.module1_forecasting.utils.constants import (
    DEFAULT_CASH_BUFFER, DEFAULT_FORECAST_CONFIDENCE, FORECAST_WINDOWS
)

class ForecastEngine:
    """
    Core deterministic cash flow forecasting engine for manufacturing SMEs.
    Projects incoming and outgoing cash and rolling balances over horizons.
    """

    def prepare_features(self, db: Session, company_id: str, manual_override: float = None) -> ForecastFeatures:
        """
        Loads the features vector from DB records.
        """
        start_balance = manual_override if manual_override is not None else 50000.0
        return load_features_from_db(db, company_id, current_balance_override=start_balance)

    def _forecast_horizon(self, features: ForecastFeatures, horizon_days: int, start_date: datetime.date = None) -> List[ForecastResult]:
        """
        Calculates daily forecast projections for a given horizon window using rolling averages and schedules.
        """
        if start_date is None:
            start_date = datetime.date.today()
            
        results = []
        running_balance = features.current_cash_balance
        
        # Calculate historical baseline statistics
        inflow_history = list(features.daily_cash_inflow.values())
        outflow_history = list(features.daily_cash_outflow.values())
        balance_history = list(features.historical_cash_balance.values())
        
        avg_var_inflow = rolling_average(inflow_history, 30)
        avg_var_outflow = rolling_average(outflow_history, 30)
        
        # Calculate historical balance volatility for confidence index
        bal_deviation = standard_deviation(balance_history) if len(balance_history) > 1 else 1000.0
        
        # Parse receivables and payables schedules
        receivables_by_date: Dict[str, float] = {}
        for r in features.receivables:
            due_str = r["due_date"]
            receivables_by_date[due_str] = receivables_by_date.get(due_str, 0.0) + r["total_amount"]
            
        payables_by_date: Dict[str, float] = {}
        for p in features.payables:
            due_str = p["due_date"]
            payables_by_date[due_str] = payables_by_date.get(due_str, 0.0) + p["total_amount"]

        for day in range(1, horizon_days + 1):
            projected_date = start_date + datetime.timedelta(days=day)
            date_str = projected_date.strftime("%Y-%m-%d")
            
            # 1. Expected Scheduled Flows
            sch_inflow = receivables_by_date.get(date_str, 0.0)
            sch_outflow = payables_by_date.get(date_str, 0.0)
            
            # 2. Add Recurring templates
            fixed_inflow = features.recurring_income
            fixed_outflow = features.recurring_expenses
            
            # 3. Add Variable (Moving Average) components
            var_inflow = avg_var_inflow
            var_outflow = avg_var_outflow
            
            # Total projected daily flows
            daily_inflow_proj = sch_inflow + fixed_inflow + var_inflow
            daily_outflow_proj = sch_outflow + fixed_outflow + var_outflow
            
            # 4. Integrate rolling balance
            running_balance = project_cash_balance(running_balance, daily_inflow_proj, daily_outflow_proj)
            
            # Compute daily safety margin index
            margin_buffer = running_balance - DEFAULT_CASH_BUFFER
            
            # Compute daily confidence score (decays over time)
            day_confidence = confidence_score(bal_deviation, data_age_days=day)
            
            results.append(ForecastResult(
                forecast_date=date_str,
                projected_inflow=round(daily_inflow_proj, 2),
                projected_outflow=round(daily_outflow_proj, 2),
                projected_balance=round(running_balance, 2),
                cash_buffer=round(margin_buffer, 2),
                confidence_score=round(day_confidence, 2)
            ))
            
        return results

    def forecast_7_days(self, features: ForecastFeatures, start_date: datetime.date = None) -> List[ForecastResult]:
        """
        Generates forecast timeline for the next 7 days.
        """
        return self._forecast_horizon(features, 7, start_date)

    def forecast_30_days(self, features: ForecastFeatures, start_date: datetime.date = None) -> List[ForecastResult]:
        """
        Generates forecast timeline for the next 30 days.
        """
        return self._forecast_horizon(features, 30, start_date)

    def forecast_90_days(self, features: ForecastFeatures, start_date: datetime.date = None) -> List[ForecastResult]:
        """
        Generates forecast timeline for the next 90 days.
        """
        return self._forecast_horizon(features, 90, start_date)

    def generate_forecast(self, features: ForecastFeatures, company_id: str = "apex-manufacturing-uuid", start_date: datetime.date = None) -> ForecastResponse:
        """
        Aggregates projections for all three horizons, creates summaries, and computes metadata.
        """
        if start_date is None:
            start_date = datetime.date.today()
            
        # Compute the maximum window (90 days)
        forecast_days = self.forecast_90_days(features, start_date)
        
        # Slice for summaries
        results_7 = forecast_days[:7]
        results_30 = forecast_days[:30]
        results_90 = forecast_days[:90]
        
        bal_7 = results_7[-1].projected_balance if results_7 else features.current_cash_balance
        bal_30 = results_30[-1].projected_balance if results_30 else features.current_cash_balance
        bal_90 = results_90[-1].projected_balance if results_90 else features.current_cash_balance
        
        buf_7 = calculate_cash_buffer([day.projected_balance for day in results_7])
        buf_30 = calculate_cash_buffer([day.projected_balance for day in results_30])
        buf_90 = calculate_cash_buffer([day.projected_balance for day in results_90])
        
        avg_confidence = sum([day.confidence_score for day in results_90]) / len(results_90) if results_90 else DEFAULT_FORECAST_CONFIDENCE
        
        summary = ForecastSummary(
            horizon_7_day_balance=round(bal_7, 2),
            horizon_30_day_balance=round(bal_30, 2),
            horizon_90_day_balance=round(bal_90, 2),
            minimum_7_day_buffer=round(buf_7, 2),
            minimum_30_day_buffer=round(buf_30, 2),
            minimum_90_day_buffer=round(buf_90, 2),
            overall_confidence=round(avg_confidence, 2),
            generated_at=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )
        
        # Fingerprint data input for auditable consistency
        input_data = {
            "balance": features.current_cash_balance,
            "receivables": features.receivables,
            "payables": features.payables,
            "recurring_expenses": features.recurring_expenses
        }
        data_bytes = json.dumps(input_data, sort_keys=True).encode("utf-8")
        input_hash = hashlib.sha256(data_bytes).hexdigest()
        
        metadata = ForecastMetadata(
            company_id=company_id,
            input_data_hash=input_hash,
            parameters_applied={
                "windows": FORECAST_WINDOWS,
                "current_cash_balance": features.current_cash_balance
            }
        )
        
        return ForecastResponse(
            summary=summary,
            metadata=metadata,
            forecast_days=forecast_days
        )
