import hashlib
import uuid
import json
import os
from flask import Flask, request, jsonify, Response
from sqlalchemy.orm import Session

from app.config import settings
from app.database.connection import engine, Base, SessionLocal
from app.database import models
from app.validation.validator import classify_and_validate_file, validate_financial_math
from app.validation.normalizer import normalize_name
from app.converters.pdf_converter import convert_pdf_to_intermediate_format
from app.converters.tabular_converter import convert_tabular_to_records
from app.ocr.puter import perform_puter_ocr
from app.parser.universal import map_document_to_schema
from app.events.bus import publish_event

app = Flask(__name__)

# Initialize database schemas
Base.metadata.create_all(bind=engine)

@app.route("/", methods=["GET"])
def read_root():
    return jsonify({"message": "SME Document Ingestion API Online"})

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"})

@app.route("/dashboard", methods=["GET"])
def read_dashboard():
    static_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    with open(static_path, "r", encoding="utf-8") as f:
        return Response(f.read(), mimetype="text/html")

@app.route(f"{settings.API_V1_STR}/documents/upload", methods=["POST"])
def upload_document():
    db = SessionLocal()
    try:
        if 'file' not in request.files:
            return jsonify({"detail": "No file uploaded"}), 400
            
        file = request.files['file']
        file_name = file.filename
        content = file.read()
        
        # 1. Size & Signature Validation
        file_check = classify_and_validate_file(content, file_name)
        if not file_check["valid"]:
            return jsonify({"detail": file_check["error"]}), 400
            
        format_type = file_check["format"]

        # 2. Check Duplicates by Hash
        file_hash = hashlib.md5(content).hexdigest()
        existing_doc = db.query(models.DocumentRegistry).filter_by(file_hash=file_hash).first()
        if existing_doc:
            return jsonify({"detail": "Duplicate Document: This file has already been ingested."}), 409

        # 3. Route & Convert
        extracted_data = {}
        if format_type == "PDF":
            pdf_res = convert_pdf_to_intermediate_format(content, file_name)
            if pdf_res.get("is_scanned"):
                ocr_res = perform_puter_ocr(content, file_name)
                extracted_data = {"content": ocr_res.get("text", "")}
            else:
                extracted_data = {"content": pdf_res.get("content", "")}
        elif format_type == "IMAGE":
            ocr_res = perform_puter_ocr(content, file_name)
            extracted_data = {"content": ocr_res.get("text", "")}
        elif format_type in ["CSV", "EXCEL"]:
            extracted_data = convert_tabular_to_records(content, file_name, format_type)
            if not extracted_data.get("success"):
                return jsonify({"detail": extracted_data.get("error")}), 422

        # 4. Universal Extraction Mapping
        invoices = map_document_to_schema(extracted_data, file_name, file_hash, format_type)
        
        company_id = "apex-manufacturing-uuid" # Default tenant
        
        # Register Document in registry
        doc_uuid = "doc-" + str(uuid.uuid4())[:8]
        new_registry = models.DocumentRegistry(
            id=doc_uuid,
            company_id=company_id,
            document_type="INVOICE",
            original_file_name=file_name,
            file_hash=file_hash,
            storage_url=f"s3://sme-financial-intake/{file_hash}_{file_name}"
        )
        db.add(new_registry)
        db.commit()

        response_status = []

        # Process each extracted invoice transactionally
        for inv in invoices:
            validation_errors = validate_financial_math(inv)
            
            # Check duplicate in db by invoice number & vendor
            vendor_name = inv["parties"]["vendor"]["name"]
            inv_no = inv["metadata"]["invoice_number"]
            
            # Find or create vendor
            db_vendor = db.query(models.Vendor).filter_by(vendor_name=vendor_name).first()
            if not db_vendor:
                db_vendor = models.Vendor(
                    id="vend-" + str(uuid.uuid4())[:8],
                    company_id=company_id,
                    vendor_name=vendor_name,
                    tax_id=inv["parties"]["vendor"].get("tax_id", ""),
                    address=inv["parties"]["vendor"].get("address", "")
                )
                db.add(db_vendor)
                db.commit()
                db.refresh(db_vendor)
                publish_event("Vendor Added", {"id": db_vendor.id, "name": vendor_name})

            existing_invoice = None
            if inv_no:
                existing_invoice = db.query(models.Invoice).filter_by(
                    vendor_id=db_vendor.id, invoice_number=inv_no
                ).first()
                
            if existing_invoice:
                validation_errors.append(f"Duplicate Invoice Detection: Invoice number \"{inv_no}\" already exists for Vendor \"{vendor_name}\".")

            # Check Quarantine Routing
            if len(validation_errors) > 0:
                # Store in Quarantine Queue
                quarantine_id = "quar-" + str(uuid.uuid4())[:8]
                new_quarantine = models.QuarantineQueue(
                    id=quarantine_id,
                    company_id=company_id,
                    raw_document_url=new_registry.storage_url,
                    failed_json=json.dumps(inv),
                    failure_reason=" | ".join(validation_errors),
                    resolved=False
                )
                db.add(new_quarantine)
                
                # Write log
                log_id = "vlog-" + str(uuid.uuid4())[:8]
                new_log = models.ValidationLog(
                    id=log_id,
                    document_id=doc_uuid,
                    math_validity=False,
                    missing_fields=None,
                    confidence_score=0.90,
                    error_code=" | ".join(validation_errors)
                )
                db.add(new_log)
                
                # Audit trail
                audit_id = "audit-" + str(uuid.uuid4())[:8]
                new_audit = models.SystemAuditTrail(
                    id=audit_id,
                    company_id=company_id,
                    change_type="QUARANTINE_PLACEMENT",
                    target_table="quarantine_queue",
                    record_id=quarantine_id,
                    previous_state=None,
                    new_state=json.dumps(inv)
                )
                db.add(new_audit)
                db.commit()
                
                publish_event("Invoice Quarantined", {"id": quarantine_id, "errors": validation_errors})
                response_status.append({"invoice_number": inv_no, "status": "QUARANTINED", "errors": validation_errors})
            else:
                # Write to database production tables
                invoice_id = "inv-" + str(uuid.uuid4())[:8]
                new_invoice = models.Invoice(
                    id=invoice_id,
                    company_id=company_id,
                    vendor_id=db_vendor.id,
                    invoice_number=inv_no,
                    invoice_date=inv["metadata"]["date"],
                    due_date=inv["metadata"]["due_date"],
                    payment_terms=inv["metadata"]["payment_terms"],
                    currency=inv["financials"]["currency"],
                    subtotal=inv["financials"]["subtotal"],
                    tax_rate=inv["financials"]["tax_rate"],
                    tax_amount=inv["financials"]["tax_amount"],
                    total_amount=inv["financials"]["total_amount"],
                    payment_status="UNPAID",
                    validation_status="VALID",
                    category=inv["category"],
                    remarks=inv["remarks"]
                )
                db.add(new_invoice)
                
                # Write lines
                for item in inv["line_items"]:
                    line_id = "line-" + str(uuid.uuid4())[:8]
                    new_line = models.InvoiceLineItem(
                        id=line_id,
                        invoice_id=invoice_id,
                        description=item["description"],
                        quantity=item["quantity"],
                        unit_price=item["unit_price"],
                        tax_rate=item["tax_rate"],
                        tax_amount=item["tax_amount"],
                        subtotal=item["subtotal"],
                        total=item["total"]
                    )
                    db.add(new_line)
                    
                # Write Validation Log
                log_id = "vlog-" + str(uuid.uuid4())[:8]
                new_log = models.ValidationLog(
                    id=log_id,
                    document_id=doc_uuid,
                    math_validity=True,
                    confidence_score=0.95
                )
                db.add(new_log)
                
                # Audit Trail
                audit_id = "audit-" + str(uuid.uuid4())[:8]
                new_audit = models.SystemAuditTrail(
                    id=audit_id,
                    company_id=company_id,
                    change_type="INSERT",
                    target_table="invoices",
                    record_id=invoice_id,
                    new_state=json.dumps(inv)
                )
                db.add(new_audit)
                db.commit()
                
                publish_event("Invoice Created", {"id": invoice_id, "amount": new_invoice.total_amount})
                response_status.append({"invoice_number": inv_no, "status": "COMMITTED", "id": invoice_id})
                
        return jsonify({"document_id": doc_uuid, "transactions": response_status})
        
    except Exception as e:
        db.rollback()
        return jsonify({"detail": f"Internal ingestion error: {str(e)}"}), 500
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/review/queue", methods=["GET"])
def get_review_queue():
    db = SessionLocal()
    try:
        items = db.query(models.QuarantineQueue).filter_by(resolved=False).all()
        return jsonify([{
            "id": i.id,
            "raw_document_url": i.raw_document_url,
            "failed_json": json.loads(i.failed_json) if i.failed_json else {},
            "failure_reason": i.failure_reason,
            "created_at": str(i.created_at)
        } for i in items])
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/review/resolve/<quarantine_id>", methods=["POST"])
def resolve_quarantine(quarantine_id: str):
    db = SessionLocal()
    try:
        payload = request.get_json() or {}
        item = db.query(models.QuarantineQueue).filter_by(id=quarantine_id, resolved=False).first()
        if not item:
            return jsonify({"detail": "Quarantine record not found or already resolved"}), 404
            
        company_id = item.company_id
        
        # Verify corrected payload math
        errors = validate_financial_math(payload)
        if len(errors) > 0:
            return jsonify({"detail": f"Corrected data is still invalid: {', '.join(errors)}"}), 400
            
        # Commit to invoices
        invoice_id = "inv-" + str(uuid.uuid4())[:8]
        
        vendor_name = payload["parties"]["vendor"]["name"]
        db_vendor = db.query(models.Vendor).filter_by(vendor_name=vendor_name).first()
        if not db_vendor:
            db_vendor = models.Vendor(
                id="vend-" + str(uuid.uuid4())[:8],
                company_id=company_id,
                vendor_name=vendor_name,
                tax_id=payload["parties"]["vendor"].get("tax_id", ""),
                address=payload["parties"]["vendor"].get("address", "")
            )
            db.add(db_vendor)
            db.commit()
            db.refresh(db_vendor)
            publish_event("Vendor Added", {"id": db_vendor.id, "name": vendor_name})
            
        new_invoice = models.Invoice(
            id=invoice_id,
            company_id=company_id,
            vendor_id=db_vendor.id,
            invoice_number=payload["metadata"]["invoice_number"],
            invoice_date=payload["metadata"]["date"],
            due_date=payload["metadata"]["due_date"],
            payment_terms=payload["metadata"]["payment_terms"],
            currency=payload["financials"]["currency"],
            subtotal=payload["financials"]["subtotal"],
            tax_rate=payload["financials"]["tax_rate"],
            tax_amount=payload["financials"]["tax_amount"],
            total_amount=payload["financials"]["total_amount"],
            payment_status="UNPAID",
            validation_status="VALID",
            category=payload["category"],
            remarks=payload["remarks"]
        )
        db.add(new_invoice)
        
        # Write lines
        for item_line in payload["line_items"]:
            line_id = "line-" + str(uuid.uuid4())[:8]
            new_line = models.InvoiceLineItem(
                id=line_id,
                invoice_id=invoice_id,
                description=item_line["description"],
                quantity=item_line["quantity"],
                unit_price=item_line["unit_price"],
                tax_rate=item_line["tax_rate"],
                tax_amount=item_line["tax_amount"],
                subtotal=item_line["subtotal"],
                total=item_line["total"]
            )
            db.add(new_line)
            
        # Update quarantine status
        item.resolved = True
        
        # Audit Trail
        audit_id = "audit-" + str(uuid.uuid4())[:8]
        new_audit = models.SystemAuditTrail(
            id=audit_id,
            company_id=company_id,
            change_type="INSERT",
            target_table="invoices",
            record_id=invoice_id,
            previous_state=item.failed_json,
            new_state=json.dumps(payload)
        )
        db.add(new_audit)
        db.commit()
        
        publish_event("Invoice Created", {"id": invoice_id, "amount": new_invoice.total_amount})
        publish_event("Quarantine Resolved", {"id": quarantine_id})
        
        return jsonify({"status": "SUCCESS", "invoice_id": invoice_id})
    except Exception as e:
        db.rollback()
        return jsonify({"detail": f"Resolution error: {str(e)}"}), 500
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/database/summary", methods=["GET"])
def get_db_summary():
    db = SessionLocal()
    try:
        return jsonify({
            "companies_registered": db.query(models.Company).count(),
            "vendors_discovered": db.query(models.Vendor).count(),
            "customers_discovered": db.query(models.Customer).count(),
            "invoices_persisted": db.query(models.Invoice).count(),
            "line_items_persisted": db.query(models.InvoiceLineItem).count(),
            "document_registry_logs": db.query(models.DocumentRegistry).count(),
            "pipeline_validation_logs": db.query(models.ValidationLog).count(),
            "system_audit_trail_events": db.query(models.SystemAuditTrail).count(),
            "quarantine_review_queue": db.query(models.QuarantineQueue).filter_by(resolved=False).count()
        })
    finally:
        db.close()

# ─── Module 4 – Payments & Treasury Route Endpoints ────────────────────────
from app.modules.module4_payments.services.treasury_service import TreasuryService
from app.modules.module4_payments.services.vendor_analytics_service import VendorAnalyticsService
from app.modules.module4_payments.repositories.vendor_repository import VendorRepository
import asyncio

def run_async(coro):
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(coro)

@app.route(f"{settings.API_V1_STR}/payments/optimize", methods=["POST"])
def optimize_vendor_payments():
    db = SessionLocal()
    try:
        service = TreasuryService()
        report = run_async(service.optimize_treasury(db))
        return jsonify(report.model_dump())
    except Exception as e:
        return jsonify({"detail": f"Optimization failed: {str(e)}"}), 500
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/payments/recommendations", methods=["GET"])
def get_payment_recommendations():
    db = SessionLocal()
    try:
        service = TreasuryService()
        report = run_async(service.optimize_treasury(db))
        return jsonify([item.model_dump() for item in report.payment_queue])
    except Exception as e:
        return jsonify({"detail": f"Failed to retrieve recommendations: {str(e)}"}), 500
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/vendors", methods=["GET"])
def get_vendors_list():
    db = SessionLocal()
    try:
        repo = VendorRepository()
        analytics = VendorAnalyticsService(repo)
        vendors = repo.list_all_vendors(db)
        
        results = []
        for v in vendors:
            v_analytics = analytics.calculate_vendor_analytics(db, v.id)
            results.append({
                "vendor_id": v.id,
                "vendor_name": v.vendor_name,
                "tax_id": v.tax_id,
                "address": v.address,
                "analytics": v_analytics.model_dump()
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({"detail": f"Failed to retrieve vendors: {str(e)}"}), 500
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/vendors/<vendor_id>", methods=["GET"])
def get_vendor_detail(vendor_id: str):
    db = SessionLocal()
    try:
        repo = VendorRepository()
        analytics = VendorAnalyticsService(repo)
        vendor = repo.get_vendor_by_id(db, vendor_id)
        if not vendor:
            return jsonify({"detail": "Vendor not found"}), 404
            
        v_analytics = analytics.calculate_vendor_analytics(db, vendor_id)
        return jsonify({
            "vendor_id": vendor.id,
            "vendor_name": vendor.vendor_name,
            "tax_id": vendor.tax_id,
            "address": vendor.address,
            "analytics": v_analytics.model_dump()
        })
    except Exception as e:
        return jsonify({"detail": f"Failed to retrieve vendor details: {str(e)}"}), 500
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/payments/dashboard", methods=["GET"])
def get_payments_dashboard():
    db = SessionLocal()
    try:
        service = TreasuryService()
        report = run_async(service.optimize_treasury(db))
        
        # Calculate active opportunities
        total_queued = sum(a.outstanding_balance for a in report.payment_queue)
        discount_value = sum(a.discount_captured for a in report.payment_queue)
        penalty_risk = sum(a.penalty_avoided for a in report.payment_queue)
        
        return jsonify({
            "total_queued_payables": total_queued,
            "total_outstanding_count": len(report.payment_queue),
            "active_discount_value": discount_value,
            "total_penalty_risk": penalty_risk,
            "current_cash_buffer": report.starting_cash,
            "liquidity_impact_forecast": "Low" if report.ending_cash >= report.minimum_cash_buffer else "High",
            "recommendations": [item.model_dump() for item in report.payment_queue],
            "kpis": {
                "starting_cash": report.starting_cash,
                "ending_cash": report.ending_cash,
                "minimum_cash_buffer": report.minimum_cash_buffer,
                "total_inflow_forecast": report.total_inflow_forecast,
                "total_allocated_payments": report.total_allocated_payments,
                "expected_savings": report.expected_savings,
                "penalties_avoided": report.penalties_avoided
            }
        })
    except Exception as e:
        return jsonify({"detail": f"Failed to load dashboard data: {str(e)}"}), 500
    finally:
        db.close()

# ─── Module 5 – AI Financial Copilot Endpoints ────────────────────────
from app.modules.module5_copilot.services.copilot_service import CopilotService
from app.modules.module5_copilot.services.conversation_manager import SESSIONS

@app.route(f"{settings.API_V1_STR}/copilot/chat", methods=["POST"])
def copilot_chat():
    db = SessionLocal()
    try:
        payload = request.get_json() or {}
        session_id = payload.get("session_id", "default-session")
        message = payload.get("message", "")
        
        if not message:
            return jsonify({"detail": "Message field cannot be empty"}), 400
            
        service = CopilotService()
        response = run_async(service.execute_chat(db, session_id, message))
        return jsonify(response.model_dump())
    except Exception as e:
        return jsonify({"detail": f"Chat processing failed: {str(e)}"}), 500
    finally:
        db.close()

@app.route(f"{settings.API_V1_STR}/copilot/history", methods=["GET"])
def get_copilot_history():
    session_id = request.args.get("session_id", "default-session")
    service = CopilotService()
    session = service.conversation_manager.get_or_create_session(session_id)
    return jsonify([msg.model_dump() for msg in session.history])

@app.route(f"{settings.API_V1_STR}/copilot/suggestions", methods=["GET"])
def get_copilot_suggestions():
    service = CopilotService()
    suggestions = service.conversation_manager.get_suggested_questions(["FORECAST", "LIQUIDITY", "COLLECTIONS", "PAYMENTS"])
    return jsonify(suggestions)

@app.route(f"{settings.API_V1_STR}/copilot/history", methods=["DELETE"])
def delete_copilot_history():
    session_id = request.args.get("session_id", "default-session")
    service = CopilotService()
    service.conversation_manager.clear_session(session_id)
    return jsonify({"status": "SUCCESS", "message": f"History cleared for session {session_id}"})

@app.route(f"{settings.API_V1_STR}/copilot/summary", methods=["GET"])
def get_copilot_summary():
    db = SessionLocal()
    try:
        service = CopilotService()
        context = run_async(service.context_builder.build_context(db, ["FORECAST", "LIQUIDITY", "COLLECTIONS", "PAYMENTS"]))
        summary_text = service._build_deterministic_fallback(context)
        return jsonify({
            "summary": summary_text,
            "metrics": context
        })
    except Exception as e:
        return jsonify({"detail": f"Failed to retrieve summary: {str(e)}"}), 500
    finally:
        db.close()
