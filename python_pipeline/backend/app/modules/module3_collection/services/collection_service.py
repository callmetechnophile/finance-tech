import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.database.models import Invoice
from app.modules.module3_collection.schemas.collection_report_schema import CollectionIntelligenceReport
from app.modules.module3_collection.repositories.invoice_repository import InvoiceRepository
from app.modules.module3_collection.services.invoice_context_service import InvoiceContextService
from app.modules.module3_collection.services.customer_analytics_engine import CustomerAnalyticsEngine
from app.modules.module3_collection.services.invoice_priority_engine import InvoicePriorityEngine
from app.modules.module3_collection.services.collection_risk_engine import CollectionRiskEngine

class CollectionService:
    """
    Main orchestration service evaluating receivables priorities, customer analytics, and collection risk tables.
    """

    def __init__(self):
        self.repository = InvoiceRepository()
        self.context_service = InvoiceContextService()
        self.analytics_engine = CustomerAnalyticsEngine()
        self.priority_engine = InvoicePriorityEngine()
        self.risk_engine = CollectionRiskEngine()

    def analyze_invoice_collection(
        self,
        session: Session,
        invoice_number: str,
        liquidity_risk: str = "Low",
        today: datetime.date = None
    ) -> Optional[CollectionIntelligenceReport]:
        
        if today is None:
            today = datetime.date.today()

        # 1. Fetch target invoice record
        invoice = self.repository.get_invoice_by_id(session, invoice_number)
        if not invoice:
            return None

        # 2. Fetch customer invoices and reminder logs
        customer_id = invoice.customer_id or "Unknown"
        customer_invoices = self.repository.get_invoices_by_customer_id(session, customer_id)
        reminders = self.repository.get_reminder_logs(session, invoice_number)
        reminder_count = len(reminders)

        # Query customer name
        from app.database.models import Customer
        from sqlalchemy import select
        customer_name = "Unknown Customer"
        if invoice.customer_id:
            customer = session.execute(
                select(Customer).where(Customer.id == invoice.customer_id)
            ).scalar_one_or_none()
            if customer:
                customer_name = customer.customer_name

        # 3. Assemble Invoice Context
        context = self.context_service.build_context(invoice, reminder_count, customer_name, today)

        # 4. Generate Customer Payment Profile
        profile = self.analytics_engine.analyze_customer(customer_invoices, today)

        # 5. Generate Priority Scores
        priority = self.priority_engine.calculate_priority(context, profile, liquidity_risk)

        # 6. Generate Collection Risk
        risk = self.risk_engine.calculate_risk(context, profile)

        return CollectionIntelligenceReport(
            company_id="apex-manufacturing-uuid",
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            invoice_id=invoice.invoice_number,
            customer_profile=profile,
            invoice_context=context,
            priority_score=priority.priority_score,
            priority_level=priority.priority_level,
            collection_risk=risk,
            collection_probability=risk.collection_probability,
            expected_collection_days=risk.expected_collection_days,
            ranking_position=1,  # Default ranking position
            reason_codes=priority.reason_codes,
            supporting_metrics={
                "outstanding_days": context.days_overdue,
                "reminders_sent": reminder_count
            }
        )

    def analyze_all_overdue_collections(
        self,
        session: Session,
        liquidity_risk: str = "Low",
        today: datetime.date = None
    ) -> List[CollectionIntelligenceReport]:
        
        if today is None:
            today = datetime.date.today()

        from sqlalchemy import select
        stmt = select(Invoice).where(Invoice.payment_status != "PAID")
        invoices = session.execute(stmt).scalars().all()
        
        reports: List[CollectionIntelligenceReport] = []
        for inv in invoices:
            if inv.payment_status != "PAID":
                rep = self.analyze_invoice_collection(session, inv.invoice_number, liquidity_risk, today)
                if rep:
                    reports.append(rep)

        # Sort all reports by priority score descending
        reports.sort(key=lambda r: r.priority_score, reverse=True)

        # Assign ranking positions
        for idx, rep in enumerate(reports):
            rep.ranking_position = idx + 1

        return reports
