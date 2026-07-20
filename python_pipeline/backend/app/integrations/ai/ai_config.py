import os
from dataclasses import dataclass

@dataclass(frozen=True)
class AIConfig:
    """
    Configuration holding credential secrets and endpoints for Google AI Studio (Gemma 4 model).
    """
    api_key: str = os.getenv("GOOGLE_API_KEY", os.getenv("GEMMA_API_KEY", ""))
    base_url: str = os.getenv("GOOGLE_AI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta")
    model_name: str = os.getenv("GOOGLE_AI_MODEL", "gemma-4")
    timeout_seconds: float = float(os.getenv("GOOGLE_AI_TIMEOUT_SECONDS", "30.0"))
    max_retries: int = int(os.getenv("GOOGLE_AI_MAX_RETRIES", "3"))

    def is_configured(self) -> bool:
        return bool(self.api_key) and not self.api_key.startswith("AIzaSy_REPLACE")
