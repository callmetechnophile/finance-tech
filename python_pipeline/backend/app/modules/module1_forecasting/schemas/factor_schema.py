from dataclasses import dataclass

@dataclass
class ForecastFactor:
    """
    Schema representing a qualitative risk or performance indicator (e.g., Customer Dependency, Vendor Dependency).
    """
    factor_name: str
    impact_value: float
    impact_level: str  # High, Medium, Low
    description: str
    source: str  # e.g., Receivables Aging Analysis, Payables concentration
