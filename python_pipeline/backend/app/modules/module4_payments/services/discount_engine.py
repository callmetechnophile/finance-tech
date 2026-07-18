import datetime
import re
from typing import Dict, Any, Optional
from app.database.models import Invoice

class DiscountEngine:
    def calculate_discount(self, invoice: Invoice, today: datetime.date = None) -> Optional[Dict[str, Any]]:
        if today is None:
            today = datetime.date.today()

        terms = invoice.payment_terms or ""
        # Match standard terms like "2/10 Net 30" or "1/15 Net 30"
        match = re.search(r"(\d+(?:\.\d+)?)\s*/\s*(\d+)", terms, re.IGNORECASE)
        if not match:
            return {"eligible": False, "savings": 0.0, "deadline": None}

        discount_pct = float(match.group(1))
        discount_days = int(match.group(2))

        try:
            inv_date = datetime.datetime.strptime(invoice.invoice_date, "%Y-%m-%d").date()
        except Exception:
            inv_date = today

        deadline = inv_date + datetime.timedelta(days=discount_days)
        eligible = today <= deadline

        savings = 0.0
        if eligible:
            savings = invoice.total_amount * (discount_pct / 100.0)

        return {
            "eligible": eligible,
            "savings": savings,
            "deadline": deadline,
            "discount_pct": discount_pct
        }
