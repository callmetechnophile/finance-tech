import os
import sys
import json
import pytest
import io
from unittest.mock import patch, MagicMock

# Add app to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app.main import app
from app.database.connection import engine, Base, SessionLocal
from app.database import models

@pytest.fixture
def client():
    app.config['TESTING'] = True
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    comp = models.Company(
        id="apex-manufacturing-uuid",
        company_name="Apex Manufacturing Inc",
        tax_id="US9999999",
        base_currency="USD"
    )
    db.add(comp)
    db.commit()
    db.close()
    
    with app.test_client() as client:
        yield client
        
    Base.metadata.drop_all(bind=engine)

def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "healthy"}

def test_file_validation_invalid_size(client):
    huge_data = b"0" * (20 * 1024 * 1024)
    response = client.post(
        "/api/v1/documents/upload",
        data={"file": (io.BytesIO(huge_data), "large_invoice.pdf")},
        content_type="multipart/form-data"
    )
    assert response.status_code == 400
    assert "exceeds 15 MB" in response.get_json()["detail"]

def test_file_validation_extension_mismatch(client):
    invalid_data = b"Not a PNG file really"
    response = client.post(
        "/api/v1/documents/upload",
        data={"file": (io.BytesIO(invalid_data), "invoice.png")},
        content_type="multipart/form-data"
    )
    assert response.status_code == 400
    assert "signature does not match" in response.get_json()["detail"]

def test_digital_pdf_ingestion_success(client):
    pdf_text = (
        "Steel Traders Inc\n"
        "Invoice: INV-2026-004\n"
        "Date: 2026-07-15\n"
        "Due: 2026-08-15\n"
        "Item: Steel Stock Sheet | Qty: 1 | Price: 1000.00 | Total: 1000.00\n"
        "Subtotal: 1000.00\n"
        "Tax Rate: 18%\n"
        "Tax: 180.00\n"
        "Total: 1180.00\n"
    )
    
    # Mock pdfplumber.open to return our text
    with patch('pdfplumber.open') as mock_open:
        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = pdf_text
        mock_pdf.pages = [mock_page]
        mock_open.return_value.__enter__.return_value = mock_pdf

        pdf_data = b"%PDF-1.4\n" + b"Dummy binary pdf content"
        response = client.post(
            "/api/v1/documents/upload",
            data={"file": (io.BytesIO(pdf_data), "digital_invoice.pdf")},
            content_type="multipart/form-data"
        )
        
        assert response.status_code == 200
        txs = response.get_json()["transactions"]
        assert len(txs) == 1
        if "errors" in txs[0]:
            print("DIGITAL PDF ERRORS:", txs[0]["errors"])
        assert txs[0]["status"] == "COMMITTED"
        assert txs[0]["invoice_number"] == "INV-2026-004"

    # Verify database state
    db = SessionLocal()
    invs = db.query(models.Invoice).all()
    assert len(invs) == 1
    assert invs[0].invoice_number == "INV-2026-004"
    assert invs[0].total_amount == 1180.00
    assert invs[0].category == "Raw Material Purchases"
    db.close()

def test_scanned_image_ingestion_success(client):
    png_data = b"\x89PNG\r\n\x1a\n" + b"Dummy scan invoice data block"
    response = client.post(
        "/api/v1/documents/upload",
        data={"file": (io.BytesIO(png_data), "invoice_scan.png")},
        content_type="multipart/form-data"
    )
    assert response.status_code == 200
    txs = response.get_json()["transactions"]
    assert len(txs) == 1
    assert txs[0]["status"] == "COMMITTED"
    assert txs[0]["invoice_number"] == "INV-2026-004"

def test_validation_failure_routes_to_quarantine(client):
    pdf_text = (
        "Steel Traders Inc\n"
        "Invoice: INV-9999\n"
        "Date: 2026-07-15\n"
        "Due: 2026-08-15\n"
        "Subtotal: 1000.00\n"
        "Tax: 180.00\n"
        "Total: 9999.00\n" # Math mismatch: 1000 + 180 != 9999
    )
    
    with patch('pdfplumber.open') as mock_open:
        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = pdf_text
        mock_pdf.pages = [mock_page]
        mock_open.return_value.__enter__.return_value = mock_pdf

        pdf_data = b"%PDF-1.4\n" + b"Dummy binary pdf content"
        response = client.post(
            "/api/v1/documents/upload",
            data={"file": (io.BytesIO(pdf_data), "math_error.pdf")},
            content_type="multipart/form-data"
        )
        
        assert response.status_code == 200
        txs = response.get_json()["transactions"]
        assert len(txs) == 1
        assert txs[0]["status"] == "QUARANTINED"
        assert "Math Error" in txs[0]["errors"][0]

    # Verify Quarantine Queue
    db = SessionLocal()
    quar_list = db.query(models.QuarantineQueue).all()
    assert len(quar_list) == 1
    assert quar_list[0].resolved is False
    assert "Math Error" in quar_list[0].failure_reason
    db.close()

def test_quarantine_resolution_success(client):
    # 1. Ingest failed item
    pdf_text = (
        "Steel Traders Inc\n"
        "Invoice: INV-9999\n"
        "Date: 2026-07-15\n"
        "Due: 2026-08-15\n"
        "Subtotal: 1000.00\n"
        "Tax: 180.00\n"
        "Total: 9999.00\n"
    )
    
    with patch('pdfplumber.open') as mock_open:
        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = pdf_text
        mock_pdf.pages = [mock_page]
        mock_open.return_value.__enter__.return_value = mock_pdf

        pdf_data = b"%PDF-1.4\n" + b"Dummy binary pdf content"
        client.post(
            "/api/v1/documents/upload",
            data={"file": (io.BytesIO(pdf_data), "math_error.pdf")},
            content_type="multipart/form-data"
        )

    db = SessionLocal()
    quar_item = db.query(models.QuarantineQueue).first()
    assert quar_item is not None
    quar_id = quar_item.id
    failed_json = json.loads(quar_item.failed_json)
    db.close()

    # 2. Correct the total amount math error
    failed_json["financials"]["total_amount"] = 1180.00
    failed_json["line_items"][0]["total"] = 1180.00
    
    res = client.post(
        f"/api/v1/review/resolve/{quar_id}",
        json=failed_json
    )
    assert res.status_code == 200
    assert res.get_json()["status"] == "SUCCESS"

    # Verify resolved in DB
    db = SessionLocal()
    resolved_item = db.query(models.QuarantineQueue).filter_by(id=quar_id).first()
    assert resolved_item.resolved is True
    
    inv = db.query(models.Invoice).filter_by(invoice_number="INV-9999").first()
    assert inv is not None
    assert inv.total_amount == 1180.00
    db.close()

def test_csv_ingestion_success(client):
    csv_data = b"Invoice,Vendor,Date,Total,Tax,Description\nINV-C1,Metal Traders,2026-07-15,1180.00,180.00,Steel Sheets\n"
    response = client.post(
        "/api/v1/documents/upload",
        data={"file": (io.BytesIO(csv_data), "ledger_export.csv")},
        content_type="multipart/form-data"
    )
    assert response.status_code == 200
    txs = response.get_json()["transactions"]
    assert len(txs) == 1
    assert txs[0]["status"] == "COMMITTED"
    assert txs[0]["invoice_number"] == "INV-C1"

    db = SessionLocal()
    invs = db.query(models.Invoice).all()
    assert len(invs) == 1
    assert invs[0].invoice_number == "INV-C1"
    assert invs[0].total_amount == 1180.00
    db.close()

def test_duplicate_document_prevention(client):
    pdf_text = (
        "Steel Traders Inc\n"
        "Invoice: INV-DUP-1\n"
        "Date: 2026-07-15\n"
        "Due: 2026-08-15\n"
        "Subtotal: 1000.00\n"
        "Tax Rate: 18%\n"
        "Tax: 180.00\n"
        "Total: 1180.00\n"
    )
    
    with patch('pdfplumber.open') as mock_open:
        mock_pdf = MagicMock()
        mock_page = MagicMock()
        mock_page.extract_text.return_value = pdf_text
        mock_pdf.pages = [mock_page]
        mock_open.return_value.__enter__.return_value = mock_pdf

        pdf_data = b"%PDF-1.4\n" + b"Dummy binary pdf content"
        res1 = client.post(
            "/api/v1/documents/upload",
            data={"file": (io.BytesIO(pdf_data), "dup_invoice.pdf")},
            content_type="multipart/form-data"
        )
        assert res1.status_code == 200

        res2 = client.post(
            "/api/v1/documents/upload",
            data={"file": (io.BytesIO(pdf_data), "dup_invoice.pdf")},
            content_type="multipart/form-data"
        )
        assert res2.status_code == 409
        assert "Duplicate Document" in res2.get_json()["detail"]
