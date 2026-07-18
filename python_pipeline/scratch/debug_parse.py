import sys
import os
import re

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from app.ocr.puter import perform_puter_ocr

ocr_res = perform_puter_ocr(b"", "digital_invoice.pdf")
text = ocr_res["text"]

currency_match = re.search(r'(?:Currency|USD|EUR|GBP|INR|Rs|\$|\u20b9)', text, re.IGNORECASE)
if currency_match:
    print("Matched Currency text:", currency_match.group(0))
else:
    print("No currency match")
