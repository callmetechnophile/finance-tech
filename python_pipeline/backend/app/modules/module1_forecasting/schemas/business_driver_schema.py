from dataclasses import dataclass

@dataclass
class BusinessDriver:
    """
    Schema representing a primary driver (large bill, delayed receipt) shifting cash projections.
    """
    driver_name: str
    impact_value: float
    priority: str  # Critical, High, Medium, Low
    category: str  # e.g., Delayed Receivables, Large Vendor Bills, Payroll, GST, Utilities
