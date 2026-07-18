from typing import List
from app.modules.module3_collection.schemas.escalation_schema import EscalationState

class EscalationEngine:
    """
    Evaluates payment age, reliability indexes, and previous warning iterations 
    to assign the deterministic collection escalation level.
    """

    def evaluate_escalation(
        self,
        days_overdue: int,
        reminder_count: int,
        collection_probability: float,
        outstanding_amount: float,
        customer_reliability: float,
        liquidity_risk: str = "Low"
    ) -> EscalationState:
        
        triggers: List[str] = []
        
        # 1. Level 6: Legal Review
        if days_overdue > 90 or reminder_count >= 4:
            level = "Level 6"
            stage = "Legal_Review"
            if days_overdue > 90:
                triggers.append("Overdue days exceeds 90 days policy.")
            if reminder_count >= 4:
                triggers.append("Reminder attempts limit exceeded.")
        
        # 2. Level 5: Finance Escalation
        elif days_overdue > 60 or collection_probability < 30.0 or liquidity_risk == "Critical":
            level = "Level 5"
            stage = "Finance_Escalation"
            if days_overdue > 60:
                triggers.append("Overdue days exceeds 60 days.")
            if collection_probability < 30.0:
                triggers.append("Estimated recovery probability is critically low.")
            if liquidity_risk == "Critical":
                triggers.append("Company is in critical liquidity deficit status.")

        # 3. Level 4: Phone Call
        elif days_overdue > 30 or reminder_count == 3 or customer_reliability < 40.0:
            level = "Level 4"
            stage = "Phone_Call"
            if days_overdue > 30:
                triggers.append("Overdue days exceeds 30 days.")
            if reminder_count == 3:
                triggers.append("Three collection reminders sent.")
            if customer_reliability < 40.0:
                triggers.append("Customer reliability score is low.")

        # 4. Level 3: Firm Reminder
        elif days_overdue > 15 or reminder_count == 2:
            level = "Level 3"
            stage = "Firm"
            if days_overdue > 15:
                triggers.append("Overdue days exceeds 15 days.")
            if reminder_count == 2:
                triggers.append("Two collection reminders sent.")

        # 5. Level 2: Professional Reminder
        elif days_overdue > 5 or reminder_count == 1:
            level = "Level 2"
            stage = "Professional"
            if days_overdue > 5:
                triggers.append("Overdue days exceeds 5 days.")
            if reminder_count == 1:
                triggers.append("One collection reminder sent.")

        # 6. Level 1: Friendly Reminder
        else:
            level = "Level 1"
            stage = "Friendly"
            triggers.append("Initial collections cycle stage.")

        return EscalationState(
            escalation_level=level,
            escalation_stage=stage,
            days_overdue=days_overdue,
            reminder_count=reminder_count,
            escalation_triggers=triggers
        )
