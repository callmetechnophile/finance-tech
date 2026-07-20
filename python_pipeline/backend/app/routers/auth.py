from fastapi import APIRouter, Depends
from typing import Dict, Any
from app.utils.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/profile", summary="Get User Profile")
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    return {
        "success": True,
        "data": {
            "user": {
                "id": current_user["user_id"],
                "name": current_user["name"],
                "role": current_user["role"],
            },
            "company": {
                "id": current_user["company_id"],
                "name": current_user["company_name"],
            },
        },
    }
