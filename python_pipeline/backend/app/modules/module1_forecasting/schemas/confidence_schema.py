from dataclasses import dataclass

@dataclass
class ForecastConfidence:
    """
    Schema representing calculated confidence levels and data health of the forecast run.
    """
    confidence_score: float  # 0.0 to 1.0
    confidence_level: str  # High, Medium, Low
    reason: str
    historical_accuracy: float  # percentage score
    data_quality: float  # score based on data completeness
