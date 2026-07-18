from dataclasses import dataclass

@dataclass
class FinancialAnomaly:
    """
    Schema representing a statistically flagged financial outlier or threat (e.g. duplicate bills, expense spikes).
    """
    reason: str
    severity: str  # Critical, Warning, Info
    impact: float
    affected_transaction: str  # Invoice/Bill number or transaction ID
