import re
from typing import Dict, Any, List
from app.validation.normalizer import (
    normalize_date, normalize_currency, normalize_name,
    normalize_category, normalize_payment_terms
)

def parse_text_invoice(text: str) -> Dict[str, Any]:
    # Default values
    result = {
        "invoice_number": "",
        "po_number": "",
        "date": "",
        "due_date": "",
        "payment_terms": "",
        "vendor": {"name": "", "tax_id": "", "address": ""},
        "customer": {"name": "", "tax_id": "", "address": ""},
        "currency": "USD",
        "subtotal": 0.0,
        "tax_rate": 0.0,
        "tax_amount": 0.0,
        "total_amount": 0.0,
        "line_items": [],
        "category": "General",
        "payment_status": "UNPAID",
        "remarks": ""
    }

    # Extract vendor name (first line or look for "Inc" / "Traders")
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        result["vendor"]["name"] = normalize_name(lines[0])
        
    # Search for patterns with word boundaries and literal space matching
    inv_match = re.search(r'\b(?:Invoice|Inv|Bill)(?:\s*Number|\s*No|\s*#)?\s*[:#-]?\s*([A-Z0-9-]+)', text, re.IGNORECASE)
    if inv_match:
        result["invoice_number"] = inv_match.group(1).strip()
        
    po_match = re.search(r'\b(?:PO|Purchase\s*Order)(?:\s*No|\s*#)?\s*[:#-]?\s*([A-Z0-9-]+)', text, re.IGNORECASE)
    if po_match:
        result["po_number"] = po_match.group(1).strip()

    # Use space character class [ \t] instead of \s to prevent crossing newlines
    date_matches = re.findall(r'\b(?:Date|Issued|Billing[ \t]+Date)[ \t]*[:#-]?[ \t]*([0-9a-zA-Z[ \t],-/]+)', text, re.IGNORECASE)
    if date_matches:
        result["date"] = normalize_date(date_matches[0])
        
    due_matches = re.findall(r'\b(?:Due|Payment[ \t]+Due|Expiry)[ \t]*[:#-]?[ \t]*([0-9a-zA-Z[ \t],-/]+)', text, re.IGNORECASE)
    if due_matches:
        result["due_date"] = normalize_date(due_matches[0])

    terms_match = re.search(r'\b(?:Payment[ \t]+Terms|Terms)[ \t]*[:#-]?[ \t]*([a-zA-Z0-9[ \t]]+)', text, re.IGNORECASE)
    if terms_match:
        result["payment_terms"] = normalize_payment_terms(terms_match.group(1))

    # Match currency with word boundaries to avoid company name substrings like "Traders" -> "rs"
    currency_match = re.search(r'\b(?:Currency|USD|EUR|GBP|INR|Rs)\b|\$|\u20b9', text, re.IGNORECASE)
    if currency_match:
        result["currency"] = normalize_currency(currency_match.group(0))

    # Amounts
    subtotal_match = re.search(r'\b(?:Subtotal|Sub-total|Net[ \t]+Amount)[ \t]*[:#-]?[ \t]*([$]?\s*\d+(?:\.\d{2})?)', text, re.IGNORECASE)
    if subtotal_match:
        sub_str = re.sub(r'[^\d.]', '', subtotal_match.group(1))
        result["subtotal"] = float(sub_str) if sub_str else 0.0

    tax_rate_match = re.search(r'\b(?:Tax[ \t]+Rate|GST[ \t]+Rate|VAT[ \t]+Rate)[ \t]*[:#-]?[ \t]*(\d+)%', text, re.IGNORECASE)
    if tax_rate_match:
        result["tax_rate"] = float(tax_rate_match.group(1)) / 100.0

    tax_amount_match = re.search(r'\b(?:Tax[ \t]+Amount|Tax|GST|VAT)[ \t]*[:#-]?[ \t]*([$]?\s*\d+(?:\.\d{2})?)', text, re.IGNORECASE)
    if tax_amount_match:
        tax_str = re.sub(r'[^\d.]', '', tax_amount_match.group(1))
        result["tax_amount"] = float(tax_str) if tax_str else 0.0

    # Get the last occurrence of Total to avoid matching line item totals
    total_matches = re.findall(r'\b(?:Total|Total[ \t]+Amount|Grand[ \t]+Total|Amount[ \t]+Due)[ \t]*[:#-]?[ \t]*([$]?\s*\d+(?:\.\d{2})?)', text, re.IGNORECASE)
    if total_matches:
        tot_str = re.sub(r'[^\d.]', '', total_matches[-1])
        result["total_amount"] = float(tot_str) if tot_str else 0.0

    # Line Items extraction
    line_pattern = r'(?:Item|Line|Desc|Product).*?\n(.*?)(?:\n\n|\nSubtotal|\nTotal)'
    items_block = re.search(line_pattern, text, re.DOTALL | re.IGNORECASE)
    if items_block:
        item_lines = items_block.group(1).strip().split('\n')
        for item_line in item_lines:
            parts = [p.strip() for p in item_line.split('|') if p.strip()]
            if len(parts) >= 3:
                desc = parts[0]
                try:
                    qty = float(re.sub(r'[^\d.]', '', parts[1]))
                    price = float(re.sub(r'[^\d.]', '', parts[2]))
                    line_total = float(re.sub(r'[^\d.]', '', parts[3])) if len(parts) > 3 else qty * price
                    result["line_items"].append({
                        "description": desc,
                        "quantity": qty,
                        "unit_price": price,
                        "tax_rate": result["tax_rate"],
                        "tax_amount": round(line_total * result["tax_rate"], 2),
                        "subtotal": line_total,
                        "total": round(line_total * (1 + result["tax_rate"]), 2)
                    })
                except Exception:
                    pass

    # If no line items extracted, create a single default line item from subtotal
    if not result["line_items"] and result["subtotal"] > 0:
        result["line_items"].append({
            "description": "Standard Invoiced Materials/Services",
            "quantity": 1.0,
            "unit_price": result["subtotal"],
            "tax_rate": result["tax_rate"],
            "tax_amount": result["tax_amount"],
            "subtotal": result["subtotal"],
            "total": result["total_amount"]
        })

    # Set category
    all_texts = text + " " + " ".join([i["description"] for i in result["line_items"]])
    result["category"] = normalize_category(all_texts)
    
    return result

def parse_tabular_records(records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    parsed_invoices = []
    
    for row in records:
        keys_lower = {k.lower(): v for k, v in row.items()}
        
        # Expanded Invoice ID / Number lookups
        inv_no = ""
        inv_keys = [
            "invoice", "invoice_number", "invoice_no", "inv_no", "bill_no", "number",
            "invoice id", "invoiceid", "id", "ref", "reference", "inv", "bill",
            "bill id", "billid", "ref_no", "reference_no", "doc_no", "doc_number"
        ]
        for k in inv_keys:
            if k in keys_lower and keys_lower[k]:
                inv_no = str(keys_lower[k]).strip()
                break
                
        if not inv_no:
            continue
            
        # Expanded Vendor / Supplier Name lookups
        vendor_name = ""
        vendor_keys = [
            "vendor", "vendor_name", "supplier", "payee", "seller",
            "vendor id", "supplier name", "supplier_name", "vendor_name",
            "party", "creditor", "company", "biller"
        ]
        for k in vendor_keys:
            if k in keys_lower and keys_lower[k]:
                vendor_name = normalize_name(str(keys_lower[k]))
                break
                
        # Expanded Date lookups
        inv_date = ""
        date_keys = [
            "date", "invoice_date", "bill_date", "issue_date", "inv_date",
            "doc_date", "document date", "billing date", "created_date", "timestamp"
        ]
        for k in date_keys:
            if k in keys_lower and keys_lower[k]:
                inv_date = normalize_date(str(keys_lower[k]))
                break
                
        # Expanded Total Amount lookups
        total_val = 0.0
        total_keys = [
            "total", "amount", "invoice_amount", "total_amount", "value",
            "net_amount", "grand_total", "grand total", "total val",
            "amount_due", "balance", "price", "total_price"
        ]
        for k in total_keys:
            if k in keys_lower and keys_lower[k]:
                try:
                    total_val = float(re.sub(r'[^\d.]', '', str(keys_lower[k])))
                except ValueError:
                    pass
                break
                
        # Expanded Tax Amount lookups
        tax_val = 0.0
        tax_keys = [
            "tax", "gst", "vat", "tax_amount", "cgst", "sgst", "igst",
            "tax val", "gst_amount", "vat_amount"
        ]
        for k in tax_keys:
            if k in keys_lower and keys_lower[k]:
                try:
                    tax_val = float(re.sub(r'[^\d.]', '', str(keys_lower[k])))
                except ValueError:
                    pass
                break
                
        subtotal_val = total_val - tax_val
        subtotal_keys = [
            "subtotal", "sub_total", "net_amount", "taxable_amount", "taxable_value"
        ]
        for k in subtotal_keys:
            if k in keys_lower and keys_lower[k]:
                try:
                    subtotal_val = float(re.sub(r'[^\d.]', '', str(keys_lower[k])))
                except ValueError:
                    pass
                break
                
        # Expanded Description lookups
        desc = ""
        desc_keys = [
            "description", "particulars", "item", "details", "remarks",
            "memo", "line_item", "product", "services"
        ]
        for k in desc_keys:
            if k in keys_lower and keys_lower[k]:
                desc = str(keys_lower[k]).strip()
                break

        # Check canonical currency
        currency_val = "USD"
        for k in ["currency", "curr", "currency_code"]:
            if k in keys_lower and keys_lower[k]:
                currency_val = normalize_currency(str(keys_lower[k]))
                break

        # Vendor details mapping
        vendor_tax_id = ""
        for k in ["vendor_gst_number", "gst_number", "gstin", "tax_id", "tax_number", "company_gst_number"]:
            if k in keys_lower and keys_lower[k]:
                vendor_tax_id = str(keys_lower[k]).strip()
                break
        
        vendor_address = ""
        for k in ["vendor_address", "supplier_address", "address", "company_address"]:
            if k in keys_lower and keys_lower[k]:
                vendor_address = str(keys_lower[k]).strip()
                break

        # Customer details mapping
        customer_name = "Apex Manufacturing"
        for k in ["customer_name", "client_name", "buyer_name"]:
            if k in keys_lower and keys_lower[k]:
                customer_name = normalize_name(str(keys_lower[k]))
                break
                
        customer_tax_id = ""
        for k in ["customer_gst_number", "customer_tax_id"]:
            if k in keys_lower and keys_lower[k]:
                customer_tax_id = str(keys_lower[k]).strip()
                break
                
        customer_address = ""
        for k in ["customer_address", "buyer_address"]:
            if k in keys_lower and keys_lower[k]:
                customer_address = str(keys_lower[k]).strip()
                break

        # Purchase Order Mapping
        po_no = ""
        for k in ["purchase_order_number", "po_number", "po_no"]:
            if k in keys_lower and keys_lower[k]:
                po_no = str(keys_lower[k]).strip()
                break

        # Due Date mapping
        due_dt = ""
        for k in ["due_date", "payment_due_date", "expiry_date"]:
            if k in keys_lower and keys_lower[k]:
                due_dt = normalize_date(str(keys_lower[k]))
                break
        if not due_dt:
            due_dt = inv_date

        # Payment Terms mapping
        pay_terms = "Net 30"
        for k in ["payment_terms", "terms"]:
            if k in keys_lower and keys_lower[k]:
                pay_terms = normalize_payment_terms(str(keys_lower[k]))
                break

        # Category mapping
        cat_val = ""
        for k in ["category", "business_category"]:
            if k in keys_lower and keys_lower[k]:
                cat_val = normalize_category(str(keys_lower[k]))
                break
        if not cat_val:
            cat_val = normalize_category(desc)

        # Payment Status mapping
        pay_status = "UNPAID"
        for k in ["payment_status", "status"]:
            if k in keys_lower and keys_lower[k]:
                pay_status = str(keys_lower[k]).strip().upper()
                break

        parsed_invoices.append({
            "invoice_number": inv_no,
            "po_number": po_no,
            "date": inv_date,
            "due_date": due_dt,
            "payment_terms": pay_terms,
            "vendor": {
                "name": vendor_name if vendor_name else "Unknown Vendor",
                "tax_id": vendor_tax_id,
                "address": vendor_address
            },
            "customer": {
                "name": customer_name,
                "tax_id": customer_tax_id,
                "address": customer_address
            },
            "currency": currency_val,
            "subtotal": subtotal_val,
            "tax_rate": round(tax_val / subtotal_val, 2) if subtotal_val > 0 else 0.0,
            "tax_amount": tax_val,
            "total_amount": total_val,
            "line_items": [{
                "description": desc if desc else "Tabular imported invoice materials",
                "quantity": 1.0,
                "unit_price": subtotal_val,
                "tax_rate": round(tax_val / subtotal_val, 2) if subtotal_val > 0 else 0.0,
                "tax_amount": tax_val,
                "subtotal": subtotal_val,
                "total": total_val
            }],
            "category": cat_val,
            "payment_status": pay_status,
            "remarks": "Imported via CSV/Excel tabular load"
        })
        
    return parsed_invoices

def map_document_to_schema(extracted_content: Dict[str, Any], file_name: str, file_hash: str, format_type: str) -> List[Dict[str, Any]]:
    invoices = []
    
    if format_type in ["CSV", "EXCEL", "TABULAR"]:
        records = extracted_content.get("records", [])
        invoices = parse_tabular_records(records)
    else:
        # Standard TEXT markdown / OCR output
        text = extracted_content.get("content", "")
        parsed = parse_text_invoice(text)
        invoices = [parsed]
        
    # Wrap with source metadata
    final_documents = []
    for inv in invoices:
        final_documents.append({
            "company_id": "apex-manufacturing-uuid",
            "document_type": "INVOICE",
            "source_document": {
                "file_name": file_name,
                "file_hash": file_hash,
                "format": format_type,
                "storage_url": f"s3://sme-financial-intake/{file_hash}_{file_name}"
            },
            "metadata": {
                "invoice_number": inv["invoice_number"],
                "po_number": inv["po_number"],
                "date": inv["date"],
                "due_date": inv["due_date"],
                "payment_terms": inv["payment_terms"]
            },
            "parties": {
                "vendor": inv["vendor"],
                "customer": inv["customer"]
            },
            "financials": {
                "currency": inv["currency"],
                "subtotal": inv["subtotal"],
                "tax_rate": inv["tax_rate"],
                "tax_amount": inv["tax_amount"],
                "total_amount": inv["total_amount"]
            },
            "line_items": inv["line_items"],
            "category": inv["category"],
            "payment_status": inv["payment_status"],
            "validation_status": "VALID",
            "remarks": inv["remarks"]
        })
        
    return final_documents
