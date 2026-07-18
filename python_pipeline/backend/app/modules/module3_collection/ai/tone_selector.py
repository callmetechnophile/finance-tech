class ToneSelector:
    """
    Deterministically selects collection communication tone based on priority levels, 
    reminder logs history, and calculated customer risk parameters.
    """

    def select_tone(self, priority_level: str, reminder_count: int, risk_level: str) -> str:
        if reminder_count >= 3:
            return "Legal Escalation"
        
        if reminder_count == 2:
            if priority_level == "Critical" or risk_level == "Critical":
                return "Final Notice"
            return "Firm"
            
        if reminder_count == 1:
            # Under reminder count 1, it is Professional unless Critical
            if priority_level == "Critical" or risk_level == "Critical":
                return "Firm"
            return "Professional"
            
        # reminder_count == 0
        if priority_level == "Critical" or risk_level == "Critical":
            return "Professional"
        if priority_level == "High" or risk_level == "High":
            return "Firm"
        if priority_level == "Medium" or risk_level == "Medium":
            return "Professional"
        return "Friendly"
