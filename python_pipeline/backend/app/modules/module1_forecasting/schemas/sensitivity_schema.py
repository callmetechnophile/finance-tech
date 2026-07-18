from dataclasses import dataclass

@dataclass
class SensitivityReport:
    """
    Schema representing how sensitive the projected balance is to a given input variable shift.
    """
    variable: str  # Customer Payment Delay, Revenue, Payroll, GST, etc.
    impact: float  # Absolute impact on ending cash balance
    ranking: int  # 1 for highest impact, etc.
    percentage_change: float  # percentage shift in outcome
