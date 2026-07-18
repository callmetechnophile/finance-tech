import datetime
from app.database.models import Invoice
from app.modules.module3_collection.schemas.invoice_context_schema import InvoiceContext

class InvoiceContextService:
    """
    Assembles invoice context records by merging core attributes and calculating aging parameters.
    """

    def build_context(self, invoice: Invoice, reminder_count: int, customer_name: str = "Unknown Customer", today: datetime.date = None) -> InvoiceContext:
        if today is None:
            today = datetime.date.today()

        # Calculate invoice age in days
        inv_dt = datetime.date.fromisoformat(invoice.invoice_date)
        age_days = (today - inv_dt).days

        # Calculate days overdue
        due_dt = datetime.date.fromisoformat(invoice.due_date)
        overdue_days = (today - due_dt).days if today > due_dt else 0

        # Prevent negative age/overdue limits
        age_days = max(0, age_days)
        overdue_days = max(0, overdue_days)

        if overdue_days == 0 and invoice.payment_status != "PAID":
            status = "UNPAID"
        elif invoice.payment_status == "PAID":
            status = "PAID"
        else:
            status = "UNPAID" # overdue implies unpaid/partial

        return InvoiceContext(
            invoice_id=invoice.invoice_number,
            amount=invoice.total_amount,
            outstanding_balance=0.0 if status == "PAID" else invoice.total_amount,
            invoice_age_days=age_days,
            due_date=invoice.due_date,
            days_overdue=overdue_days if status != "PAID" else 0,
            payment_terms=invoice.payment_terms or "Net 30",
            reminder_count=reminder_count,
            customer_id=invoice.customer_id or "Unknown",
            customer_name=customer_name,
            payment_status=status
        )
