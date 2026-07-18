from typing import List, Dict, Any, Tuple
from app.modules.module4_payments.schemas.payment_schema import BillDetail, OptimizedPaymentAllocation

class ConstraintEngine:
    def validate_schedule(
        self,
        current_cash: float,
        minimum_cash_buffer: float,
        max_daily_payments: float,
        allocations: List[OptimizedPaymentAllocation]
    ) -> Tuple[bool, str, List[OptimizedPaymentAllocation]]:
        """
        Validates optimization outputs against liquidity safety constraints.
        If a violation is detected, lower-priority allocations are deferred until cash limits are satisfied.
        """
        total_payment_amount = sum(
            a.outstanding_balance for a in allocations if a.recommendation == "PAY_NOW"
        )

        # 1. Check Max Daily Payments Constraint
        if total_payment_amount > max_daily_payments:
            # We exceed the maximum allowed daily disbursement
            # Defer lowest priority pay-now recommendations
            adjusted = []
            accumulated = 0.0
            
            # Sort: Critical first, then High, then others
            # Let's map priorities for sorting
            def get_sort_weight(alloc: OptimizedPaymentAllocation) -> int:
                # We want to keep critical payouts
                if "Critical" in alloc.reason:
                    return 3
                if "Discount" in alloc.reason:
                    return 2
                return 1

            sorted_allocs = sorted(allocations, key=get_sort_weight, reverse=True)

            for a in sorted_allocs:
                if a.recommendation == "PAY_NOW":
                    if accumulated + a.outstanding_balance <= max_daily_payments:
                        adjusted.append(a)
                        accumulated += a.outstanding_balance
                    else:
                        # Downgrade to delay payment
                        adjusted.append(OptimizedPaymentAllocation(
                            invoice_id=a.invoice_id,
                            invoice_number=a.invoice_number,
                            vendor_name=a.vendor_name,
                            outstanding_balance=a.outstanding_balance,
                            recommendation="DELAY_PAYMENT",
                            reason="Daily disbursement limit exceeded",
                            payment_date=a.payment_date,
                            discount_captured=0.0,
                            penalty_avoided=0.0,
                            approval_required=a.approval_required
                        ))
                else:
                    adjusted.append(a)
            
            return False, "Disbursement limit exceeded. Lower priority payments deferred.", adjusted

        # 2. Check Cash Buffer Constraint
        ending_cash = current_cash - total_payment_amount
        if ending_cash < minimum_cash_buffer:
            # We violate our minimum safety operating buffer
            # Defer non-critical payouts
            adjusted = []
            accumulated_payout = 0.0
            
            # Sort: keep critical first
            def get_sort_weight(alloc: OptimizedPaymentAllocation) -> int:
                if "Critical" in alloc.reason:
                    return 3
                if "Discount" in alloc.reason:
                    return 2
                return 1

            sorted_allocs = sorted(allocations, key=get_sort_weight, reverse=True)

            for a in sorted_allocs:
                if a.recommendation == "PAY_NOW":
                    potential_ending_cash = current_cash - (accumulated_payout + a.outstanding_balance)
                    # Allow payout if it doesn't violate minimum buffer, or if it is Critical
                    if potential_ending_cash >= minimum_cash_buffer or "Critical" in a.reason:
                        adjusted.append(a)
                        accumulated_payout += a.outstanding_balance
                    else:
                        # Defer to conserve cash
                        adjusted.append(OptimizedPaymentAllocation(
                            invoice_id=a.invoice_id,
                            invoice_number=a.invoice_number,
                            vendor_name=a.vendor_name,
                            outstanding_balance=a.outstanding_balance,
                            recommendation="DELAY_PAYMENT",
                            reason="Deferred to preserve minimum safety cash buffer",
                            payment_date=a.payment_date,
                            discount_captured=0.0,
                            penalty_avoided=0.0,
                            approval_required=a.approval_required
                        ))
                else:
                    adjusted.append(a)

            return False, "Minimum cash buffer constraint violated. Non-essential payments deferred.", adjusted

        return True, "All constraints satisfied.", allocations
