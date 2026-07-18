from dataclasses import dataclass

@dataclass
class StressScenarioInput:
    """
    Schema representing parameter modifiers for simulating cash flow stress events.
    """
    scenario_name: str
    cash_adjustment: float  # flat cash impact (+/-)
    receivables_delay_days: int  # days shifted
    payables_cost_multiplier: float  # multiplier on liabilities
    revenue_multiplier: float  # multiplier on daily inflows
    recurring_expense_multiplier: float  # multiplier on fixed overheads
