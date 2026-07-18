from dataclasses import dataclass

@dataclass
class CustomerFinancialProfile:
    """
    Schema representing payment behaviors and historical collections metrics of a single customer.
    """
    avg_payment_delay: float  # days late (can be negative if early)
    late_payment_percentage: float
    on_time_payment_percentage: float
    payment_frequency: str  # High, Medium, Low
    average_invoice_value: float
    outstanding_balance: float
    historical_collection_success: float  # success rate percentage
    collection_response_rate: float  # response rate percentage
    customer_lifetime_days: int
    customer_reliability_score: float  # 0 to 100
