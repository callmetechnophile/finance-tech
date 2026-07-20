from sqlalchemy.orm import Session
from app.database.session import engine, SessionLocal, Base
# Import all ORM models so they are registered in Base.metadata
from app.models.schema import (
    CompanyModel,
    UserModel,
    DocumentModel,
    InvoiceModel,
    PaymentModel,
    BankAccountModel,
    CopilotChatModel,
)
from app.utils.logger import logger


def init_db():
    """Initializes tables and seeds demo datasets if database is empty."""
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # Check if demo company exists
        existing_company = db.query(CompanyModel).filter(CompanyModel.id == "apex-manufacturing-uuid").first()
        if not existing_company:
            logger.info("🌱 Seeding empty database with demo financial datasets...")

            # 1. Company & User
            company = CompanyModel(
                id="apex-manufacturing-uuid",
                name="Apex Manufacturing Inc.",
                industry="CNC & Fabrication",
                currency="USD",
                liquid_cash=342000.0,
                quick_ratio=1.8,
            )
            user = UserModel(
                id="usr-1",
                email="finance@apex.com",
                name="Alexander Miller",
                role="admin",
                company_id="apex-manufacturing-uuid",
            )
            db.add(company)
            db.add(user)

            # 2. Bank Accounts
            accounts = [
                BankAccountModel(
                    id="ba-1",
                    company_id="apex-manufacturing-uuid",
                    bank_name="JPMorgan Chase",
                    account_number="...0192",
                    balance=255000.0,
                    account_type="Operating Checking",
                ),
                BankAccountModel(
                    id="ba-2",
                    company_id="apex-manufacturing-uuid",
                    bank_name="Neon Treasury Reserve",
                    account_number="...8841",
                    balance=42000.0,
                    account_type="Yield Reserve (4.8% APY)",
                ),
                BankAccountModel(
                    id="ba-3",
                    company_id="apex-manufacturing-uuid",
                    bank_name="Silicon Valley Bank",
                    account_number="...5512",
                    balance=45000.0,
                    account_type="Revolving Credit Line",
                ),
            ]
            db.add_all(accounts)

            # 3. Customer Invoices (AR)
            invoices = [
                InvoiceModel(
                    id="inv-089",
                    company_id="apex-manufacturing-uuid",
                    invoice_number="INV-2024-089",
                    customer_name="Apex Steel Works",
                    amount=47500.0,
                    due_date="2026-06-04",
                    days_overdue=45,
                    status="Overdue",
                    escalation_level="L4 Escalation",
                ),
                InvoiceModel(
                    id="inv-074",
                    company_id="apex-manufacturing-uuid",
                    invoice_number="INV-2024-074",
                    customer_name="Delta Fabrication",
                    amount=28000.0,
                    due_date="2026-07-07",
                    days_overdue=12,
                    status="Overdue",
                    escalation_level="L1 Reminder",
                ),
                InvoiceModel(
                    id="inv-092",
                    company_id="apex-manufacturing-uuid",
                    invoice_number="INV-2024-092",
                    customer_name="Titan Robotics Corp",
                    amount=62400.0,
                    due_date="2026-07-28",
                    days_overdue=0,
                    status="Current",
                    escalation_level="None",
                ),
            ]
            db.add_all(invoices)

            # 4. Supplier Payments (AP)
            payments = [
                PaymentModel(
                    id="pay-101",
                    company_id="apex-manufacturing-uuid",
                    vendor_name="CNC Machinery Corp",
                    amount=45000.0,
                    due_date="2026-07-24",
                    status="Pending Dual Signoff",
                    discount_terms="2/10 net 30 ($900 discount)",
                ),
                PaymentModel(
                    id="pay-102",
                    company_id="apex-manufacturing-uuid",
                    vendor_name="Industrial Alloy Supply",
                    amount=18400.0,
                    due_date="2026-07-30",
                    status="Scheduled",
                    discount_terms="Net 30",
                ),
            ]
            db.add_all(payments)

            # 5. Documents
            documents = [
                DocumentModel(
                    id="doc-1",
                    company_id="apex-manufacturing-uuid",
                    file_name="Apex_Steel_Invoice_89.pdf",
                    file_type="PDF",
                    status="Parsed",
                    confidence_score=0.98,
                    subtotal=45000.0,
                    tax=2500.0,
                    total=47500.0,
                    quarantined=False,
                ),
                DocumentModel(
                    id="doc-2",
                    company_id="apex-manufacturing-uuid",
                    file_name="CNC_Maintenance_Bill.xlsx",
                    file_type="XLSX",
                    status="Parsed",
                    confidence_score=1.0,
                    subtotal=45000.0,
                    tax=0.0,
                    total=45000.0,
                    quarantined=False,
                ),
            ]
            db.add_all(documents)

            db.commit()
            logger.info("✅ Database seeded with demo financial data successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
