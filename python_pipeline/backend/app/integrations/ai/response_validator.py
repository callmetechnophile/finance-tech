import json
import re
import logging
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)

class ResponseValidator:
    """
    Validates NIM client response JSON formatting, lengths, and checks for hallucinated values.
    """

    def validate_email_response(self, raw_resp: str, target_invoice_id: str) -> Tuple[bool, str]:
        # Strip markdown codeblocks (e.g. ```json ... ```) if Gemma slips them in
        cleaned = self._clean_markdown(raw_resp)
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            return False, "Response is not valid JSON"

        # Check required fields
        required = ["email_subject", "email_body", "tone"]
        for key in required:
            if key not in data or not data[key]:
                return False, f"Missing required key: {key}"

        # Invoice number hallucination check
        all_text = f"{data['email_subject']} {data['email_body']}"
        mentions = re.findall(r"INV-[A-Za-z0-9_]+", all_text)
        for m in mentions:
            if m != target_invoice_id:
                return False, f"Hallucinated invoice ID detected: {m}"

        return True, ""

    def validate_sms_response(self, raw_resp: str) -> Tuple[bool, str]:
        cleaned = self._clean_markdown(raw_resp)
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            return False, "Response is not valid JSON"

        if "sms_body" not in data or not data["sms_body"]:
            return False, "Missing 'sms_body' key"

        if len(data["sms_body"]) > 320:
            return False, "SMS exceeds max 320 characters"

        return True, ""

    def validate_whatsapp_response(self, raw_resp: str) -> Tuple[bool, str]:
        cleaned = self._clean_markdown(raw_resp)
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            return False, "Response is not valid JSON"

        if "whatsapp_body" not in data or not data["whatsapp_body"]:
            return False, "Missing 'whatsapp_body' key"

        return True, ""

    def validate_explanation_response(self, raw_resp: str) -> Tuple[bool, str]:
        cleaned = self._clean_markdown(raw_resp)
        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError:
            return False, "Response is not valid JSON"

        if "explanation" not in data or not data["explanation"]:
            return False, "Missing 'explanation' key"

        return True, ""

    def _clean_markdown(self, text: str) -> str:
        """
        Strips markdown codeblock fences from responses.
        """
        text = text.strip()
        if text.startswith("```"):
            # Find the index of the first newline after the block fence
            nl_idx = text.find("\n")
            if nl_idx != -1:
                # Strip leading ```json or ``` and trailing ```
                text = text[nl_idx:].strip()
            if text.endswith("```"):
                text = text[:-3].strip()
        return text
