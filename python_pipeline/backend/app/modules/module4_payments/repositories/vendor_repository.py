from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database.models import Invoice, Vendor

class VendorRepository:
    """
    Repository layer for managing vendor bills, payment history, and profile records.
    """

    def get_vendor_by_id(self, session: Session, vendor_id: str) -> Optional[Vendor]:
        stmt = select(Vendor).where(Vendor.id == vendor_id)
        return session.execute(stmt).scalar_one_or_none()

    def list_all_vendors(self, session: Session) -> List[Vendor]:
        stmt = select(Vendor)
        return list(session.execute(stmt).scalars().all())

    def get_vendor_bills(self, session: Session, vendor_id: str) -> List[Invoice]:
        stmt = select(Invoice).where(
            Invoice.vendor_id == vendor_id,
            Invoice.payment_status != "PAID"
        )
        return list(session.execute(stmt).scalars().all())

    def get_all_unpaid_bills(self, session: Session) -> List[Invoice]:
        stmt = select(Invoice).where(Invoice.vendor_id.isnot(None), Invoice.payment_status != "PAID")
        return list(session.execute(stmt).scalars().all())

    def get_all_vendor_invoices(self, session: Session) -> List[Invoice]:
        stmt = select(Invoice).where(Invoice.vendor_id.isnot(None))
        return list(session.execute(stmt).scalars().all())

    def get_historical_payments(self, session: Session, vendor_id: str) -> List[Invoice]:
        stmt = select(Invoice).where(
            Invoice.vendor_id == vendor_id,
            Invoice.payment_status == "PAID"
        )
        return list(session.execute(stmt).scalars().all())
