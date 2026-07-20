from pydantic import BaseModel, Field
from typing import Dict, Any, Optional


class ComponentHealth(BaseModel):
    status: str = Field(example="healthy")
    latency_ms: Optional[float] = Field(default=None, example=24.5)
    details: Optional[Dict[str, Any]] = None


class HealthResponse(BaseModel):
    status: str = Field(example="healthy")
    environment: str = Field(example="development")
    version: str = Field(example="1.0.0")
    timestamp: str = Field(example="2026-07-19T19:35:00Z")
    components: Dict[str, ComponentHealth]
