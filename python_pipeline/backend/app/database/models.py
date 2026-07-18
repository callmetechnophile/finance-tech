from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, ForeignKey, Text
from sqlalchemy.sql import func
from app.database.connection import Base

class Company(Base):
    __tablename__ = "companies"
    id = Column(String(50), primary_key=True)
    company_name = Column(String(100), nullable=False)
    tax_id = Column(String(50), unique=True)
    base_currency = Column(String(10), default="USD")

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(String(50), primary_key=True)
    company_id = Column(String(50), nullable=False)
    vendor_name = Column(String(100), nullable=False)
    tax_id = Column(String(50))
    address = Column(Text)

class Customer(Base):
    __tablename__ = "customers"
    id = Column(String(50), primary_key=True)
    company_id = Column(String(50), nullable=False)
    customer_name = Column(String(100), nullable=False)
    tax_id = Column(String(50))
    address = Column(Text)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(String(50), primary_key=True)
    company_id = Column(String(50), nullable=False)
    vendor_id = Column(String(50), nullable=True)
    customer_id = Column(String(50), nullable=True)
    invoice_number = Column(String(50), nullable=False)
    invoice_date = Column(String(20), nullable=False)
    due_date = Column(String(20), nullable=False)
    payment_terms = Column(String(50))
    currency = Column(String(10), default="USD")
    subtotal = Column(Float, default=0.0)
    tax_rate = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    total_amount = Column(Float, default=0.0)
    payment_status = Column(String(20), default="UNPAID")
    validation_status = Column(String(20), default="VALID")
    category = Column(String(50), default="General")
    remarks = Column(Text)

class InvoiceLineItem(Base):
    __tablename__ = "invoice_line_items"
    id = Column(String(50), primary_key=True)
    invoice_id = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    quantity = Column(Float, default=0.0)
    unit_price = Column(Float, default=0.0)
    tax_rate = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    subtotal = Column(Float, default=0.0)
    total = Column(Float, default=0.0)

class DocumentRegistry(Base):
    __tablename__ = "document_registry"
    id = Column(String(50), primary_key=True)
    company_id = Column(String(50), nullable=False)
    document_type = Column(String(50))
    original_file_name = Column(String(255))
    file_hash = Column(String(64), unique=True)
    storage_url = Column(String(255))
    created_at = Column(DateTime, default=func.now())

class ValidationLog(Base):
    __tablename__ = "validation_logs"
    id = Column(String(50), primary_key=True)
    document_id = Column(String(50), nullable=False)
    math_validity = Column(Boolean, default=True)
    missing_fields = Column(Text)
    confidence_score = Column(Float, default=1.0)
    error_code = Column(Text)
    created_at = Column(DateTime, default=func.now())

class SystemAuditTrail(Base):
    __tablename__ = "system_audit_trail"
    id = Column(String(50), primary_key=True)
    company_id = Column(String(50), nullable=False)
    user_identifier = Column(String(100), default="SYSTEM")
    change_type = Column(String(50)) # INSERT, UPDATE, QUARANTINE_PLACEMENT
    target_table = Column(String(100))
    record_id = Column(String(50))
    previous_state = Column(Text)
    new_state = Column(Text)
    created_at = Column(DateTime, default=func.now())

class QuarantineQueue(Base):
    __tablename__ = "quarantine_queue"
    id = Column(String(50), primary_key=True)
    company_id = Column(String(50), nullable=False)
    raw_document_url = Column(String(255))
    failed_json = Column(Text)
    failure_reason = Column(Text)
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())

class CommunicationLog(Base):
    __tablename__ = "communication_logs"
    id = Column(String(50), primary_key=True)
    invoice_id = Column(String(50), nullable=False)
    channel = Column(String(50), nullable=False)
    tone = Column(String(50), nullable=False)
    email_subject = Column(String(255))
    content = Column(Text, nullable=False)
    status = Column(String(50), default="SENT")
    gemma_explanation = Column(Text)
    fallback_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
