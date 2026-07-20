from typing import Dict, Any, Generator
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db


def get_current_user(x_company_id: str = Header(default="apex-manufacturing-uuid")) -> Dict[str, Any]:
    """Dependency injects current authenticated user context."""
    return {
        "user_id": "usr-1",
        "name": "Alexander Miller",
        "role": "admin",
        "company_id": x_company_id,
        "company_name": "Apex Manufacturing Inc.",
    }


def get_pagination(page: int = 1, limit: int = 20) -> Dict[str, int]:
    """Dependency injects standardized pagination parameters."""
    limit = min(limit, 100)
    offset = (max(1, page) - 1) * limit
    return {"page": page, "limit": limit, "offset": offset}
