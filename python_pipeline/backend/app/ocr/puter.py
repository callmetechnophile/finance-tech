import base64
from typing import Dict, Any

def perform_puter_ocr(file_content: bytes, file_name: str) -> Dict[str, Any]:
    # Simulate Puter.js OCR API call
    # In a production environment, this sends the image to Puter.js Cloud API for layout parsing.
    
    # We provide realistic mock responses for test files
    name_lower = file_name.lower()
    
    # Check if scanned invoice
    if "invoice" in name_lower or "bill" in name_lower or "scan" in name_lower:
        return {
            "engine": "puter-ocr-v2",
            "document_type": "INVOICE",
            "text": "Steel Traders Inc\nInvoice: INV-2026-004\nDate: 2026-07-15\nDue: 2026-08-15\nGSTIN: 27AAAAA1111A1Z1\nItem: Heavy Duty CNC Milling Plate | Qty: 2 | Price: 5000.00 | Total: 10000.00\nSubtotal: 10000.00\nTax Rate: 18%\nTax: 1800.00\nTotal: 11800.00\nPayment Terms: Net 30",
            "confidence": 0.94,
            "language": "en",
            "layout_blocks": [
                {"type": "header", "text": "Steel Traders Inc"},
                {"type": "field", "key": "Invoice Number", "value": "INV-2026-004"},
                {"type": "table", "rows": [["Heavy Duty CNC Milling Plate", "2", "5000.00", "10000.00"]]}
            ]
        }
    elif "ledger" in name_lower or "shop" in name_lower:
        # Handwritten ledger simulation
        return {
            "engine": "puter-ocr-v2",
            "document_type": "LEDGER_ENTRY",
            "text": "CNC Job Shop Log\n18-07-2026\nCNC Lathe Repair - Spindle Alignment | 1 | 2500.00\nSubtotal: 2500.00\nTax: 0.00\nTotal: 2500.00\nPaid: Cash",
            "confidence": 0.88,
            "language": "en",
            "layout_blocks": [
                {"type": "title", "text": "CNC Job Shop Log"},
                {"type": "row", "values": ["CNC Lathe Repair - Spindle Alignment", "1", "2500.00"]}
            ]
        }
    else:
        # Default fallback
        return {
            "engine": "puter-ocr-v2",
            "document_type": "UNKNOWN",
            "text": "Simulated unclassified OCR text extraction",
            "confidence": 0.90,
            "language": "en",
            "layout_blocks": []
        }
