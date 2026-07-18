class WorkflowEngine:
    """
    Evaluates customer profiles, invoice overdue logs, and reminder statuses 
    to decide the next deterministic collection action.
    """

    def determine_next_action(
        self,
        payment_status: str,
        days_overdue: int,
        reminder_count: int,
        remaining_attempts: int,
        escalation_level: str
    ) -> str:
        
        # 1. Closed or paid cases
        if payment_status == "PAID":
            return "CLOSE_CASE"

        # 2. Checked limits
        if remaining_attempts <= 0:
            if days_overdue > 90:
                return "LEGAL_REVIEW"
            return "ESCALATE_MANAGER"

        # 3. Handle legal reviews and corporate escalation levels
        if escalation_level == "Level 6" or days_overdue > 90:
            return "LEGAL_REVIEW"
        elif escalation_level == "Level 5":
            return "ESCALATE_FINANCE"
        elif escalation_level == "Level 4":
            return "SCHEDULE_PHONE_CALL"

        # 4. Standard reminder flows based on escalation levels and reminder logs
        if escalation_level == "Level 3":
            # Level 3 represents Firm reminders
            return "SEND_SMS" # prefer SMS for Firm communication recommendation
        elif escalation_level == "Level 2":
            # Level 2 represents Professional reminders
            return "SEND_EMAIL"
        elif escalation_level == "Level 1":
            # Level 1 represents Friendly reminders
            if reminder_count == 0:
                return "SEND_EMAIL"
            else:
                return "SEND_WHATSAPP"

        # Default action
        return "WAIT"
