from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base


class CompanyModel(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry = Column(String, default="CNC & Fabrication")
    currency = Column(String, default="USD")
    liquid_cash = Column(Float, default=342000.0)
    quick_ratio = Column(Float, default=1.8)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="admin")
    company_id = Column(String, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)


class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, index=True)
    file_name = Column(String, nullable=False)
    file_type = Column(String, nullable=False)
    file_path = Column(String, nullable=True)
    status = Column(String, default="Parsed")
    confidence_score = Column(Float, default=0.98)
    subtotal = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    total = Column(Float, default=0.0)
    quarantined = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class InvoiceModel(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, index=True)
    invoice_number = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(String, nullable=False)
    days_overdue = Column(Integer, default=0)
    status = Column(String, default="Overdue")
    escalation_level = Column(String, default="L1 Reminder")
    created_at = Column(DateTime, default=datetime.utcnow)


class PaymentModel(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, index=True)
    vendor_name = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(String, nullable=False)
    status = Column(String, default="Scheduled")
    discount_terms = Column(String, default="2/10 net 30")
    created_at = Column(DateTime, default=datetime.utcnow)


class BankAccountModel(Base):
    __tablename__ = "bank_accounts"

    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, index=True)
    bank_name = Column(String, nullable=False)
    account_number = Column(String, nullable=False)
    balance = Column(Float, nullable=False)
    account_type = Column(String, default="Checking")
    created_at = Column(DateTime, default=datetime.utcnow)


class CopilotChatModel(Base):
    __tablename__ = "copilot_chats"

    id = Column(String, primary_key=True, index=True)
    company_id = Column(String, index=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
