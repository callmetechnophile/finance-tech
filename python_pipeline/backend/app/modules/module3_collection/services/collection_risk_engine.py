from typing import List
from app.modules.module3_collection.schemas.invoice_context_schema import InvoiceContext
from app.modules.module3_collection.schemas.customer_profile_schema import CustomerFinancialProfile
from app.modules.module3_collection.schemas.collection_risk_schema import CollectionRisk
from app.modules.module3_collection.utils.collection_constants import RISK_THRESHOLDS

class CollectionRiskEngine:
    """
    Evaluates customer behavior and invoice ages to calculate collection probabilities and default risks.
    """

    def calculate_risk(self, context: InvoiceContext, profile: CustomerFinancialProfile) -> CollectionRisk:
        factors: List[str] = []

        # Start with base collection probability of 95%
        probability = 95.0
        expected_days = 10 # default expected collection resolution window

        # Penalty 1: Days Overdue
        if context.days_overdue > 60:
            probability -= 40.0
            expected_days += 45
            factors.append("Critically aged invoice: Overdue by >60 days.")
        elif context.days_overdue > 30:
            probability -= 25.0
            expected_days += 20
            factors.append("Invoice is overdue by >30 days.")
        elif context.days_overdue > 0:
            probability -= 10.0
            expected_days += 7
            factors.append("Invoice is past its due date.")

        # Penalty 2: Customer payment history reliability
        rel = profile.customer_reliability_score
        if rel < 40.0:
            probability -= 25.0
            expected_days += 15
            factors.append("Poor historical customer payment reliability record.")
        elif rel < 70.0:
            probability -= 10.0
            expected_days += 5
            factors.append("Moderate historical payment reliability (frequent delays).")

        # Penalty 3: Unresolved communications
        if context.reminder_count >= 3:
            probability -= 15.0
            expected_days += 10
            factors.append("High reminder counts sent with zero payment settlements.")

        # Cap probability between 5.0% and 98.0%
        probability = max(5.0, min(98.0, probability))

        # Risk score is inverse of probability
        risk_score = 100.0 - probability

        # Determine level label
        level = "Very Low"
        for label, threshold in sorted(RISK_THRESHOLDS.items(), key=lambda x: x[1], reverse=True):
            if risk_score >= threshold:
                level = label
                break

        return CollectionRisk(
            risk_score=round(risk_score, 1),
            risk_level=level,
            collection_probability=round(probability, 1),
            expected_collection_days=int(expected_days),
            contributing_factors=factors
        )
