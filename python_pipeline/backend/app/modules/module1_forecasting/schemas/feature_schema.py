from dataclasses import dataclass, field
from typing import Dict, List, Any

@dataclass
class ForecastFeatures:
    """
    Data structure representing processed financial features used directly by the cash flow forecast engine.
    """
    daily_cash_inflow: Dict[str, float] = field(
        default_factory=dict, 
        metadata={"description": "Historical aggregated daily cash inflows mapped by date string (YYYY-MM-DD)"}
    )
    daily_cash_outflow: Dict[str, float] = field(
        default_factory=dict, 
        metadata={"description": "Historical aggregated daily cash outflows mapped by date string (YYYY-MM-DD)"}
    )
    historical_cash_balance: Dict[str, float] = field(
        default_factory=dict, 
        metadata={"description": "Historical rolling daily cash balances mapped by date string (YYYY-MM-DD)"}
    )
    receivables: List[Dict[str, Any]] = field(
        default_factory=list, 
        metadata={"description": "List of active accounts receivable invoices with customer terms and due dates"}
    )
    payables: List[Dict[str, Any]] = field(
        default_factory=list, 
        metadata={"description": "List of active accounts payable bills with supplier terms and due dates"}
    )
    recurring_income: float = field(
        default=0.0, 
        metadata={"description": "Estimated daily recurring credit commitments (payroll, AMC retainer averages)"}
    )
    recurring_expenses: float = field(
        default=0.0, 
        metadata={"description": "Estimated daily recurring debit commitments (salaries, fixed factory costs)"}
    )
    current_cash_balance: float = field(
        default=0.0, 
        metadata={"description": "Starting cash liquid position establishing the baseline liquidity"}
    )
