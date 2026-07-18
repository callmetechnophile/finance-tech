from dataclasses import dataclass

@dataclass
class LiquidityScore:
    """
    Schema detailing the weighted liquidity score breakup.
    """
    final_score: float  # 0 to 100
    classification: str  # Excellent, Healthy, Moderate, Warning, Critical
    cash_buffer_score: float  # weighted score component
    working_capital_score: float
    receivables_score: float
    payables_score: float
    burn_rate_score: float
