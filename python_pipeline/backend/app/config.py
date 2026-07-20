import os
from typing import List, Optional
from pydantic import Field
try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings  # Fallback for older pydantic v1


class Settings(BaseSettings):
    # Application & Security
    APP_NAME: str = Field(default="FORGE-PATH Financial Operations API")
    APP_ENV: str = Field(default="development")
    LOG_LEVEL: str = Field(default="INFO")
    DEBUG: bool = Field(default=True)
    API_V1_STR: str = Field(default="/api/v1")
    SECRET_KEY: str = Field(default="forge-path-super-secret-key-change-in-production")
    JWT_SECRET: str = Field(default="forge-path-jwt-signing-key-backend-only")
    
    CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"]
    )

    # Authentication
    CLERK_SECRET_KEY: Optional[str] = Field(default=None)

    # Database Configuration (Neon PostgreSQL & SQLite)
    DATABASE_URL: str = Field(default="sqlite:///./sme_finance.db")
    NEON_DATABASE_URL: Optional[str] = Field(default=None)
    NEON_BRANCH: Optional[str] = Field(default="production")
    NEON_AUTH_BASE_URL: Optional[str] = Field(default=None)
    NEON_AUTH_JWKS_URL: Optional[str] = Field(default=None)

    # File Storage (Supabase)
    SUPABASE_URL: Optional[str] = Field(default=None)
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = Field(default=None)
    SUPABASE_STORAGE_BUCKET: str = Field(default="financial-documents")

    # AI Inference (Google AI Studio + Gemma 4 Model)
    GOOGLE_API_KEY: Optional[str] = Field(default=None)
    GOOGLE_AI_MODEL: str = Field(default="gemma-4")
    GOOGLE_AI_BASE_URL: str = Field(default="https://generativelanguage.googleapis.com/v1beta")
    GEMMA_API_KEY: Optional[str] = Field(default=None)
    GEMMA_MODEL_NAME: str = Field(default="gemma-4")

    # OCR Processing
    OCR_ENGINE: str = Field(default="paddle_ocr")

    # Communication Providers (Brevo & Twilio)
    BREVO_API_KEY: Optional[str] = Field(default=None)
    BREVO_SENDER_EMAIL: str = Field(default="work.ayush2k6@gmail.com")
    BREVO_SENDER_NAME: str = Field(default="Apex Manufacturing Admin")

    TWILIO_ACCOUNT_SID: Optional[str] = Field(default=None)
    TWILIO_AUTH_TOKEN: Optional[str] = Field(default=None)
    TWILIO_PHONE_NUMBER: Optional[str] = Field(default=None)
    TWILIO_WHATSAPP_NUMBER: Optional[str] = Field(default=None)

    # Graph Database (Neo4j / AuraDB)
    NEO4J_URI: Optional[str] = Field(default=None)
    NEO4J_USERNAME: Optional[str] = Field(default=None)
    NEO4J_PASSWORD: Optional[str] = Field(default=None)

    # Analytics Database (ClickHouse)
    CLICKHOUSE_URL: Optional[str] = Field(default="http://localhost:8123")
    CLICKHOUSE_USER: Optional[str] = Field(default="default")
    CLICKHOUSE_PASSWORD: Optional[str] = Field(default="")

    # Cache & Broker (Redis)
    REDIS_URL: Optional[str] = Field(default="redis://localhost:6379/0")

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.development", ".env.production"),
        env_file_encoding="utf-8",
        extra="ignore"
    ) if "SettingsConfigDict" in globals() else {}


settings = Settings()
