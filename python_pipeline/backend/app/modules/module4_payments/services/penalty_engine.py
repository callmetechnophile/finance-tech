import datetime
from typing import Dict, Any, Optional
from app.database.models import Invoice

class PenaltyEngine:
    def calculate_penalty(self, invoice: Invoice, today: datetime.date = None) -> Optional[Dict[str, Any]]:
        if today is None:
            today = datetime.date.today()

        try:
            due_date = datetime.datetime.strptime(invoice.due_date, "%Y-%m-%d").date()
        except Exception:
            due_date = today

        days_overdue = (today - due_date).days
        penalty_cost = 0.0
        
        # Standard fee: 1.5% monthly late fee, computed pro-rata
        if days_overdue > 0:
            monthly_rate = 0.015
            penalty_cost = invoice.total_amount * monthly_rate * (days_overdue / 30.0)

        return {
            "penalty_cost": penalty_cost,
            "days_overdue": max(0, days_overdue),
            "penalty_date": due_date
        }
