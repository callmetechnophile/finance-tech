import datetime
from typing import List, Dict, Any
from app.database.models import Invoice
from app.modules.module4_payments.schemas.payment_schema import BillDetail
from app.modules.module4_payments.services.discount_engine import DiscountEngine
from app.modules.module4_payments.services.penalty_engine import PenaltyEngine

class BillIntelligenceService:
    def __init__(self):
        self.discount_engine = DiscountEngine()
        self.penalty_engine = PenaltyEngine()

    def analyze_bill(self, invoice: Invoice, vendor_name: str, today: datetime.date = None) -> BillDetail:
        if today is None:
            today = datetime.date.today()

        # Parse due date
        try:
            due_date = datetime.datetime.strptime(invoice.due_date, "%Y-%m-%d").date()
        except Exception:
            due_date = today + datetime.timedelta(days=30)  # Default 30 days fallback

        days_remaining = (due_date - today).days
        days_overdue = max(0, (today - due_date).days)

        # Strategic Importance
        strategic = "Low"
        if invoice.category in ["Raw Materials", "CNC Tooling", "Critical", "Machinery"]:
            strategic = "Critical"
        elif invoice.total_amount > 20000:
            strategic = "High"
        elif invoice.total_amount > 5000:
            strategic = "Medium"

        # Check Discounts
        discount_eligible = False
        discount_savings = 0.0
        discount_deadline = None

        disc = self.discount_engine.calculate_discount(invoice, today)
        if disc and disc["eligible"]:
            discount_eligible = True
            discount_savings = disc["savings"]
            discount_deadline = disc["deadline"].strftime("%Y-%m-%d")

        # Check Penalties
        penalty_cost = 0.0
        penalty_date = None
        pen = self.penalty_engine.calculate_penalty(invoice, today)
        if pen and pen["penalty_cost"] > 0:
            penalty_cost = pen["penalty_cost"]
            penalty_date = pen["penalty_date"].strftime("%Y-%m-%d")

        return BillDetail(
            invoice_id=invoice.id,
            invoice_number=invoice.invoice_number,
            vendor_id=invoice.vendor_id or "Unknown",
            vendor_name=vendor_name,
            total_amount=invoice.total_amount,
            outstanding_balance=invoice.total_amount,  # Assume full outstanding if unpaid
            due_date=invoice.due_date,
            days_remaining=days_remaining,
            days_overdue=days_overdue,
            payment_terms=invoice.payment_terms or "Net 30",
            strategic_importance=strategic,
            discount_eligible=discount_eligible,
            discount_savings=discount_savings,
            discount_deadline=discount_deadline,
            penalty_cost=penalty_cost,
            penalty_date=penalty_date
        )
