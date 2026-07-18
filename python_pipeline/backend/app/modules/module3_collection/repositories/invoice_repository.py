from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database.models import Invoice

class InvoiceRepository:
    """
    Repository pattern managing data access layers for Invoice database tables.
    """

    def get_invoice_by_id(self, session: Session, invoice_id: str) -> Optional[Invoice]:
        # Using SQLAlchemy 2.0 select statement style
        stmt = select(Invoice).where(Invoice.invoice_number == invoice_id)
        result = session.execute(stmt).scalar_one_or_none()
        return result

    def get_invoices_by_customer_id(self, session: Session, customer_id: str) -> List[Invoice]:
        stmt = select(Invoice).where(Invoice.customer_id == customer_id)
        results = session.execute(stmt).scalars().all()
        return list(results)

    def get_reminder_logs(self, session: Session, invoice_id: str) -> List[Dict[str, Any]]:
        # Mock database logs query; since reminder logs might not exist in standard SQLite schemas,
        # we return an empty list or mock list to ensure no database crashes occur.
        return []

    def get_payment_history(self, session: Session, customer_id: str) -> List[Dict[str, Any]]:
        # Returns list of payments associated with customer invoices
        invoices = self.get_invoices_by_customer_id(session, customer_id)
        history = []
        for inv in invoices:
            if inv.payment_status == "PAID":
                history.append({
                    "invoice_number": inv.invoice_number,
                    "total_amount": inv.total_amount,
                    "payment_date": inv.due_date,  # default mock payment dates
                    "days_late": 0 # assume on-time
                })
        return history
