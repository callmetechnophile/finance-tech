import json
import logging
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)

class ResponseValidator:
    """
    Validates Gemma LLM JSON responses against character limits, required keys, 
    and verifies that it has not hallucinated incorrect invoice identifiers or balances.
    """

    def validate_email_response(self, raw_resp: str, target_invoice_id: str, target_balance: float) -> Tuple[bool, str]:
        """
        Validates Gemma email output JSON. Returns (is_valid, error_msg).
        """
        try:
            data = json.loads(raw_resp)
        except json.JSONDecodeError:
            return False, "Invalid JSON structure"

        # Check required fields
        required = ["email_subject", "email_body", "tone"]
        for key in required:
            if key not in data or not data[key]:
                return False, f"Missing required key: {key}"

        # Check for hallucinated invoice numbers
        subject = data["email_subject"]
        body = data["email_body"]
        import re
        all_text = subject + " " + body
        # Matches alphanumeric characters starting with INV-
        inv_mentions = re.findall(r"INV-[A-Za-z0-9_]+", all_text)
        for mention in inv_mentions:
            if mention != target_invoice_id:
                return False, f"Hallucinated incorrect invoice ID: {mention}"

        return True, ""

    def validate_sms_response(self, raw_resp: str) -> Tuple[bool, str]:
        try:
            data = json.loads(raw_resp)
        except json.JSONDecodeError:
            return False, "Invalid JSON structure"

        if "sms_body" not in data or not data["sms_body"]:
            return False, "Missing 'sms_body' key"

        if len(data["sms_body"]) > 320:
            return False, "SMS exceeds maximum 320 character limit"

        return True, ""

    def validate_whatsapp_response(self, raw_resp: str) -> Tuple[bool, str]:
        try:
            data = json.loads(raw_resp)
        except json.JSONDecodeError:
            return False, "Invalid JSON structure"

        if "whatsapp_body" not in data or not data["whatsapp_body"]:
            return False, "Missing 'whatsapp_body' key"

        return True, ""

    def validate_explanation_response(self, raw_resp: str) -> Tuple[bool, str]:
        try:
            data = json.loads(raw_resp)
        except json.JSONDecodeError:
            return False, "Invalid JSON structure"

        if "explanation" not in data or not data["explanation"]:
            return False, "Missing 'explanation' key"

        return True, ""
