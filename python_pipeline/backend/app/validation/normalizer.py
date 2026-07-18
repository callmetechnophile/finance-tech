import re
from datetime import datetime

def normalize_date(date_str: str) -> str:
    if not date_str:
        return ""
    # Strip whitespace
    clean_date = date_str.strip()
    
    # Try parsing common formats
    formats = [
        "%Y-%m-%d",      # 2026-07-18
        "%d/%m/%Y",      # 18/07/2026
        "%m/%d/%Y",      # 07/18/2026
        "%Y/%m/%d",      # 2026/07/18
        "%d-%m-%Y",      # 18-07-2026
        "%b %d, %Y",     # Jul 18, 2026
        "%B %d, %Y",     # July 18, 2026
        "%d %b %Y",      # 18 Jul 2026
        "%d %B %Y",      # 18 July 2026
    ]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(clean_date, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
            
    # Regex fallback for YYYYMMDD
    match = re.match(r'^(\d{4})(\d{2})(\d{2})$', clean_date)
    if match:
        return f"{match.group(1)}-{match.group(2)}-{match.group(3)}"
        
    return clean_date  # Return original if parsing fails

def normalize_currency(currency_str: str) -> str:
    if not currency_str:
        return "USD"
    
    clean = currency_str.strip().upper()
    
    mapping = {
        "$": "USD",
        "USD": "USD",
        "€": "EUR",
        "EUR": "EUR",
        "£": "GBP",
        "GBP": "GBP",
        "₹": "INR",
        "INR": "INR",
        "RS": "INR",
        "CAD": "CAD",
        "AUD": "AUD",
        "YEN": "JPY",
        "¥": "JPY"
    }
    
    return mapping.get(clean, clean)

def normalize_name(name_str: str) -> str:
    if not name_str:
        return ""
    
    # Strip spaces and title-case
    clean = name_str.strip()
    # Replace multiple spaces with single space
    clean = re.sub(r'\s+', ' ', clean)
    return clean.title()

def normalize_category(category_str: str) -> str:
    if not category_str:
        return "General"
    
    clean = category_str.strip().lower()
    
    # Simple semantic mapping
    if any(k in clean for k in ["steel", "aluminum", "copper", "iron", "sheet", "weld", "wire", "stock", "raw"]):
        return "Raw Material Purchases"
    if any(k in clean for k in ["coolant", "tool", "cnc", "lathe", "repair", "service", "maintenance", "amc"]):
        return "Machine Maintenance"
    if any(k in clean for k in ["rent", "lease", "building", "warehouse"]):
        return "Facility Rent"
    if any(k in clean for k in ["power", "electricity", "water", "gas", "utility"]):
        return "Utilities"
    if any(k in clean for k in ["salary", "wage", "payroll", "employee", "worker"]):
        return "Payroll"
        
    return "General"

def normalize_payment_terms(terms_str: str) -> str:
    if not terms_str:
        return "Due on Receipt"
    
    clean = terms_str.strip().lower()
    
    if "30" in clean:
        return "Net 30"
    if "60" in clean:
        return "Net 60"
    if "90" in clean:
        return "Net 90"
    if "cod" in clean or "cash" in clean or "delivery" in clean:
        return "COD"
    if "immediate" in clean or "receipt" in clean or "now" in clean:
        return "Due on Receipt"
        
    return terms_str.title()
