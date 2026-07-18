from dataclasses import dataclass, field
from typing import Dict, List, Any

@dataclass
class LiquidityFeatures:
    """
    Unified preprocessed data features specifically grouped for liquidity health assessments.
    """
    current_cash: float
    expected_inflow: float  # projected inflow over 30 days
    expected_outflow: float  # projected outflow over 30 days
    receivable_ratio: float  # receivables over cash
    payable_ratio: float  # payables over cash
    working_capital: float  # Current Assets - Current Liabilities
    burn_rate: float  # estimated daily cash consumption rate
    safety_buffer: float  # current cash safety threshold target
    cash_conversion_cycle: float  # estimated number of days cash is tied up in cycle
    active_receivables: List[Dict[str, Any]] = field(default_factory=list)
    active_payables: List[Dict[str, Any]] = field(default_factory=list)
    historical_outflows: List[float] = field(default_factory=list)
