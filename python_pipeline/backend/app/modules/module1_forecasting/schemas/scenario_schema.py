from dataclasses import dataclass

@dataclass
class ScenarioResult:
    """
    Schema representing the recalculated cash metrics under a specific simulated scenario.
    """
    scenario_name: str  # Base Case, Optimistic, Pessimistic, etc.
    projected_balance: float  # balance at close of horizon (e.g. 90 days)
    cash_buffer: float  # minimum balance observed during horizon
    receivables: float  # total sum of receivables in this scenario
    payables: float  # total sum of payables in this scenario
    risk_level: str  # Low, Medium, High, Critical
