import os

class Settings:
    PROJECT_NAME: str = "SME Document Ingestion API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sme_finance.db")
    MAX_FILE_SIZE_MB: int = 15
    UPLOAD_DIR: str = "uploads"
    QUARANTINE_DIR: str = "quarantine"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.QUARANTINE_DIR, exist_ok=True)
