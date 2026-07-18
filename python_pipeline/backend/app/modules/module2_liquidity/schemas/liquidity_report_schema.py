from dataclasses import dataclass, field
from typing import List

@dataclass
class LiquidityIntelligence:
    """
    Unified liquidity intelligence report detailing the financial health of the manufacturing SME.
    """
    company_id: str
    generated_timestamp: str
    current_cash: float
    working_capital: float
    working_capital_ratio: float
    burn_rate: float  # monthly cash consumption estimate
    cash_buffer: float  # emergency reserve cash available
    buffer_days: float  # days of operations cash represents
    liquidity_score: float  # 0 to 100 index
    liquidity_level: str  # Excellent, Healthy, Moderate, Warning, Critical
    risk_level: str  # Very Low, Low, Medium, High, Critical
    receivable_ratio: float
    payable_ratio: float
    cash_conversion_cycle: float
    contributing_factors: List[str] = field(default_factory=list)
