import datetime
from typing import List, Dict, Any
from app.modules.module4_payments.schemas.payment_schema import BillDetail, OptimizedPaymentAllocation
from app.modules.module4_payments.services.constraint_engine import ConstraintEngine

class PaymentOptimizationEngine:
    def __init__(self):
        self.constraint_engine = ConstraintEngine()

    def optimize_schedule(
        self,
        current_cash: float,
        minimum_cash_buffer: float,
        max_daily_payments: float,
        bills: List[BillDetail],
        today: datetime.date = None
    ) -> List[OptimizedPaymentAllocation]:
        if today is None:
            today = datetime.date.today()

        allocations: List[OptimizedPaymentAllocation] = []

        # 1. Deterministic prioritization score calculation
        scored_bills = []
        for bill in bills:
            score = 0.0
            
            # Criteria A: Supplier Criticality
            if bill.strategic_importance == "Critical":
                score += 50.0
            elif bill.strategic_importance == "High":
                score += 25.0

            # Criteria B: Early payment discount savings value
            if bill.discount_eligible:
                # Add up to 30 points scaled by savings
                score += min(30.0, 10.0 + (bill.discount_savings / 100.0))

            # Criteria C: Penalty cost avoidance
            if bill.days_overdue > 0:
                score += min(20.0, 10.0 + bill.penalty_cost)

            # Criteria D: Proximity to due date
            if bill.days_remaining <= 0:
                score += 15.0  # Overdue
            elif bill.days_remaining <= 5:
                score += 10.0
            elif bill.days_remaining <= 15:
                score += 5.0

            scored_bills.append((score, bill))

        # Sort descending by priority score
        scored_bills.sort(key=lambda x: x[0], reverse=True)

        # 2. Allocation mapping
        for score, bill in scored_bills:
            recommendation = "DELAY_PAYMENT"
            reason = "Conserving cash runway"
            payment_date = (today + datetime.timedelta(days=7)).strftime("%Y-%m-%d")
            discount_captured = 0.0
            penalty_avoided = 0.0
            approval_required = False

            # Determine actions
            if bill.days_overdue > 0 or bill.days_remaining <= 2:
                recommendation = "PAY_NOW"
                reason = f"Due date near or past. Avoid penalty/interest. Score: {score:.1f}"
                payment_date = today.strftime("%Y-%m-%d")
                penalty_avoided = bill.penalty_cost
            elif bill.discount_eligible:
                recommendation = "PAY_NOW"
                reason = f"Active early discount eligible. Captured savings of {bill.discount_savings:.1f}."
                payment_date = today.strftime("%Y-%m-%d")
                discount_captured = bill.discount_savings
            elif bill.strategic_importance == "Critical":
                recommendation = "PAY_NOW"
                reason = "Critical operational supplier payout required."
                payment_date = today.strftime("%Y-%m-%d")
            else:
                # Standard net scheduler
                recommendation = "AUTO_PAY"
                reason = "Scheduled automatic payment on due date."
                payment_date = bill.due_date

            # Large transaction approval threshold
            if bill.total_amount > 20000.0:
                approval_required = True

            allocations.append(OptimizedPaymentAllocation(
                invoice_id=bill.invoice_id,
                invoice_number=bill.invoice_number,
                vendor_name=bill.vendor_name,
                outstanding_balance=bill.outstanding_balance,
                recommendation=recommendation,
                reason=reason,
                payment_date=payment_date,
                discount_captured=discount_captured,
                penalty_avoided=penalty_avoided,
                approval_required=approval_required
            ))

        # 3. Constraint checking & remediation
        _, _, final_allocations = self.constraint_engine.validate_schedule(
            current_cash=current_cash,
            minimum_cash_buffer=minimum_cash_buffer,
            max_daily_payments=max_daily_payments,
            allocations=allocations
        )

        return final_allocations
