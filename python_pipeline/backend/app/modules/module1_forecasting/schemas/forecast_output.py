from dataclasses import dataclass, field
from typing import List, Dict, Any

@dataclass
class ForecastResult:
    """
    Detailed forecast projection metrics for a specific single day.
    """
    forecast_date: str
    projected_inflow: float
    projected_outflow: float
    projected_balance: float
    cash_buffer: float
    confidence_score: float

@dataclass
class ForecastSummary:
    """
    Aggregated summary projections across the 7, 30, and 90 day horizons.
    """
    horizon_7_day_balance: float
    horizon_30_day_balance: float
    horizon_90_day_balance: float
    minimum_7_day_buffer: float
    minimum_30_day_buffer: float
    minimum_90_day_buffer: float
    overall_confidence: float
    generated_at: str

@dataclass
class ForecastMetadata:
    """
    Metadata containing run parameters and audit values.
    """
    company_id: str
    input_data_hash: str
    parameters_applied: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ForecastResponse:
    """
    Response wrapper object returning the complete cash flow forecast run.
    """
    summary: ForecastSummary
    metadata: ForecastMetadata
    forecast_days: List[ForecastResult] = field(default_factory=list)
