from typing import List
from app.modules.module3_collection.schemas.invoice_context_schema import InvoiceContext
from app.modules.module3_collection.schemas.customer_profile_schema import CustomerFinancialProfile
from app.modules.module3_collection.schemas.priority_schema import InvoicePriority
from app.modules.module3_collection.utils.collection_constants import PRIORITY_THRESHOLDS

class InvoicePriorityEngine:
    """
    Ranks receivables based on overdue limits, invoice amounts, and liquidity deficit impacts.
    """

    def calculate_priority(
        self,
        context: InvoiceContext,
        profile: CustomerFinancialProfile,
        liquidity_risk: str = "Low"
    ) -> InvoicePriority:
        
        reason_codes: List[str] = []

        # 1. Days Overdue Component (30%)
        if context.days_overdue > 30:
            od_score = 30.0
            reason_codes.append("DAYS_OVERDUE_CRITICAL")
        elif context.days_overdue > 15:
            od_score = 20.0
            reason_codes.append("DAYS_OVERDUE_WARNING")
        elif context.days_overdue > 0:
            od_score = 10.0
        else:
            od_score = 0.0

        # 2. Outstanding Amount Component (25%)
        # Rs 500,000 is approx $6,000. Let's support both INR and USD values
        amount = context.outstanding_balance
        if amount > 500000.0 or amount > 6000.0:
            amt_score = 25.0
            reason_codes.append("LARGE_OUTSTANDING_BALANCE")
        elif amount > 100000.0 or amount > 1200.0:
            amt_score = 18.0
        elif amount > 10000.0 or amount > 120.0:
            amt_score = 10.0
        else:
            amt_score = 5.0

        # 3. Customer Reliability Component (20%)
        # Lower reliability score yields higher collection priority urgency
        rel = profile.customer_reliability_score
        if rel < 40.0:
            rel_score = 20.0
            reason_codes.append("LOW_CUSTOMER_RELIABILITY")
        elif rel < 70.0:
            rel_score = 12.0
            reason_codes.append("MODERATE_CUSTOMER_RELIABILITY")
        else:
            rel_score = 4.0

        # 4. Reminder History Component (10%)
        if context.reminder_count >= 3:
            rem_score = 10.0
            reason_codes.append("MAX_REMINDERS_EXCEEDED")
        elif context.reminder_count >= 1:
            rem_score = 5.0
        else:
            rem_score = 0.0

        # 5. Invoice Age Component (10%)
        if context.invoice_age_days > 90:
            age_score = 10.0
            reason_codes.append("INVOICE_AGE_OLD")
        elif context.invoice_age_days > 45:
            age_score = 6.0
        else:
            age_score = 2.0

        # 6. Liquidity Impact Component (5%)
        if liquidity_risk in ["Critical", "High"]:
            liq_score = 5.0
            reason_codes.append("LIQUIDITY_DEFICIT_TRIGGER")
        elif liquidity_risk == "Medium":
            liq_score = 3.0
        else:
            liq_score = 1.0

        total_score = od_score + amt_score + rel_score + rem_score + age_score + liq_score

        # Determine level label
        level = "Low"
        for label, threshold in sorted(PRIORITY_THRESHOLDS.items(), key=lambda x: x[1], reverse=True):
            if total_score >= threshold:
                level = label
                break

        return InvoicePriority(
            priority_score=round(total_score, 1),
            priority_level=level,
            reason_codes=reason_codes
        )
