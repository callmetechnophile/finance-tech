from dataclasses import dataclass

@dataclass
class GemmaRawResponse:
    """
    Schema representing metadata of the raw Gemma LLM API response and validation status.
    """
    raw_json: str
    validated: bool
    retry_count: int
    fallback_used: bool
