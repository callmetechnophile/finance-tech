import re
from typing import Dict, Any, List

def classify_and_validate_file(file_content: bytes, file_name: str) -> Dict[str, Any]:
    # 1. Size Check (max 15 MB)
    max_size = 15 * 1024 * 1024
    if len(file_content) > max_size:
        return {"valid": False, "format": "UNKNOWN", "error": "File size exceeds 15 MB limit"}

    if len(file_content) < 4:
        return {"valid": False, "format": "UNKNOWN", "error": "File is empty or corrupted"}

    # 2. Magic Bytes Validation
    magic_bytes = file_content[:8]
    ext = file_name.split('.')[-1].lower()

    detected_format = "UNKNOWN"
    
    if magic_bytes.startswith(b'%PDF-'):
        detected_format = "PDF"
    elif magic_bytes.startswith(b'\x89PNG\r\n\x1a\n'):
        detected_format = "IMAGE"
    elif magic_bytes.startswith(b'\xff\xd8\xff'):
        detected_format = "IMAGE"
    elif magic_bytes.startswith(b'PK\x03\x04'):
        # ZIP file signature - likely Excel (.xlsx)
        detected_format = "EXCEL"
    else:
        # Check if text/csv
        try:
            sample = file_content[:1024].decode('utf-8')
            # Check if it looks like comma/semicolon/tab separated values
            if ',' in sample or ';' in sample or '\t' in sample:
                detected_format = "CSV"
            else:
                detected_format = "TEXT"
        except UnicodeDecodeError:
            detected_format = "UNKNOWN"

    # 3. Match format with extension
    if ext in ['png', 'jpg', 'jpeg'] and detected_format != "IMAGE":
        return {"valid": False, "format": "UNKNOWN", "error": "File signature does not match image extension"}
    if ext == 'pdf' and detected_format != "PDF":
        return {"valid": False, "format": "UNKNOWN", "error": "File signature does not match PDF extension"}
    if ext == 'xlsx' and detected_format != "EXCEL":
        return {"valid": False, "format": "UNKNOWN", "error": "File signature does not match Excel extension"}
    if ext == 'csv' and detected_format not in ["CSV", "TEXT"]:
        return {"valid": False, "format": "UNKNOWN", "error": "File signature does not match CSV extension"}

    if detected_format == "UNKNOWN":
        return {"valid": False, "format": "UNKNOWN", "error": "Unsupported file format signature"}

    return {"valid": True, "format": detected_format, "error": None}

def validate_financial_math(record: Dict[str, Any]) -> List[str]:
    errors = []
    
    financials = record.get("financials", {})
    subtotal = float(financials.get("subtotal", 0.0))
    tax_amount = float(financials.get("tax_amount", 0.0))
    total_amount = float(financials.get("total_amount", 0.0))
    
    # 1. Total = Subtotal + Tax
    if abs((subtotal + tax_amount) - total_amount) > 0.05:
        errors.append(f"Math Error: Subtotal ({subtotal}) + Tax ({tax_amount}) != Total ({total_amount})")
        
    # 2. Line items sum matches subtotal
    line_items = record.get("line_items", [])
    computed_subtotal = 0.0
    for idx, item in enumerate(line_items):
        qty = float(item.get("quantity", 0.0))
        price = float(item.get("unit_price", 0.0))
        item_subtotal = float(item.get("subtotal", 0.0))
        
        # Line qty * price matches line subtotal
        if abs((qty * price) - item_subtotal) > 0.05:
            errors.append(f"Math Error (Line {idx + 1}): Qty ({qty}) * Price ({price}) != Subtotal ({item_subtotal})")
            
        computed_subtotal += item_subtotal
        
    if abs(computed_subtotal - subtotal) > 0.05:
        errors.append(f"Math Error: Sum of Line Subtotals ({computed_subtotal}) != Invoice Subtotal ({subtotal})")
        
    # 3. Check dates chronology
    metadata = record.get("metadata", {})
    invoice_date = metadata.get("date", "")
    due_date = metadata.get("due_date", "")
    
    if invoice_date and due_date:
        if due_date < invoice_date:
            errors.append(f"Date Error: Due date ({due_date}) is earlier than invoice date ({invoice_date})")
            
    # 4. Check negative values
    if total_amount < 0:
        errors.append("Validation Error: Invoice total amount cannot be negative")
        
    for idx, item in enumerate(line_items):
        if float(item.get("subtotal", 0.0)) < 0 or float(item.get("unit_price", 0.0)) < 0:
            errors.append(f"Validation Error (Line {idx + 1}): Item values cannot be negative")

    return errors
