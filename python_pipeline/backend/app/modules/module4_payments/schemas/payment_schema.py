from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any

@dataclass
class BillDetail:
    invoice_id: str
    invoice_number: str
    vendor_id: str
    vendor_name: str
    total_amount: float
    outstanding_balance: float
    due_date: str
    days_remaining: int
    days_overdue: int
    payment_terms: str
    strategic_importance: str
    discount_eligible: bool
    discount_savings: float
    discount_deadline: Optional[str] = None
    penalty_cost: float = 0.0
    penalty_date: Optional[str] = None

    def model_dump(self):
        return self.__dict__

@dataclass
class OptimizedPaymentAllocation:
    invoice_id: str
    invoice_number: str
    vendor_name: str
    outstanding_balance: float
    recommendation: str
    reason: str
    payment_date: str
    discount_captured: float
    penalty_avoided: float
    approval_required: bool

    def model_dump(self):
        return self.__dict__

@dataclass
class TreasuryOptimizationReport:
    generated_timestamp: str
    starting_cash: float
    ending_cash: float
    minimum_cash_buffer: float
    total_inflow_forecast: float
    total_allocated_payments: float
    expected_savings: float
    penalties_avoided: float
    payment_queue: List[OptimizedPaymentAllocation] = field(default_factory=list)
    gemma_explanation: Optional[Dict[str, Any]] = None

    def model_dump(self):
        res = self.__dict__.copy()
        res["payment_queue"] = [item.model_dump() for item in self.payment_queue]
        return res

@dataclass
class PaymentsDashboardData:
    total_queued_payables: float
    total_outstanding_count: int
    active_discount_value: float
    total_penalty_risk: float
    current_cash_buffer: float
    liquidity_impact_forecast: str
    recommendations: List[OptimizedPaymentAllocation] = field(default_factory=list)
    kpis: Dict[str, Any] = field(default_factory=dict)

    def model_dump(self):
        res = self.__dict__.copy()
        res["recommendations"] = [item.model_dump() for item in self.recommendations]
        return res
