import re
from typing import Dict, Any, Tuple, List

class CopilotResponseValidator:
    """
    Ensures Gemma response does not contain fabricated/hallucinated numbers 
    that were not present in the input query or unified context dictionary.
    """

    def validate_response(self, response_text: str, context: Dict[str, Any]) -> Tuple[bool, str]:
        # Extract all numbers from the generated response (e.g. $45,000 or 150000 or 68)
        # We look for digits, optional decimal or comma separators
        numbers = re.findall(r"\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b", response_text)
        
        # Flatten all values in the context dictionary to look up allowed numbers
        allowed_strings = self._flatten_dict_values(context)
        
        # Add basic safe/structural numbers
        allowed_strings.extend(["100", "0", "1", "2", "3", "4", "5", "6", "7", "30", "90"])

        for num in numbers:
            # Strip commas and convert to float format for loose comparison
            clean_num = num.replace(",", "")
            
            # Check if this exact clean number is close to any number in allowed context
            matched = False
            for allowed in allowed_strings:
                try:
                    if float(clean_num) == float(allowed):
                        matched = True
                        break
                except ValueError:
                    if clean_num in str(allowed):
                        matched = True
                        break
            
            if not matched:
                return False, f"Hallucinated or unverified number detected in response: {num}"

        return True, ""

    def _flatten_dict_values(self, d: Any) -> List[str]:
        flat = []
        if isinstance(d, dict):
            for v in d.values():
                flat.extend(self._flatten_dict_values(v))
        elif isinstance(d, list):
            for item in d:
                flat.extend(self._flatten_dict_values(item))
        else:
            if d is not None:
                flat.append(str(d))
        return flat
