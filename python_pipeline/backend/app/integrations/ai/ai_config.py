import os
from dataclasses import dataclass

@dataclass(frozen=True)
class AIConfig:
    """
    Configuration holding credential secrets and endpoints for NVIDIA NIM services.
    """
    api_key: str = os.getenv("NVIDIA_API_KEY", "")
    base_url: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    model_name: str = os.getenv("NVIDIA_MODEL", "google/gemma-2-9b-it")
    timeout_seconds: float = float(os.getenv("NVIDIA_TIMEOUT_SECONDS", "30.0"))
    max_retries: int = int(os.getenv("NVIDIA_MAX_RETRIES", "3"))

    def is_configured(self) -> bool:
        return bool(self.api_key)
