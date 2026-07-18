from dataclasses import dataclass

@dataclass
class InvoiceContext:
    """
    Schema representing core attributes and overdue metrics of a single invoice.
    """
    invoice_id: str
    amount: float
    outstanding_balance: float
    invoice_age_days: int
    due_date: str
    days_overdue: int
    payment_terms: str
    reminder_count: int
    customer_id: str
    customer_name: str
    payment_status: str  # PAID, UNPAID, PARTIAL
