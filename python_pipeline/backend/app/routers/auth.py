from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, Optional
import random
import time
from app.utils.deps import get_current_user
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory OTP storage for FastAPI backend
_otp_store: Dict[str, Dict[str, Any]] = {}


class OTPSendRequest(BaseModel):
    phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    code: str


@router.post("/otp/send", summary="Send Phone Verification OTP Code")
async def send_otp(payload: OTPSendRequest):
    phone = payload.phone.strip().replace(" ", "").replace("-", "")
    full_phone = phone if phone.startswith("+") else f"+91{phone.lstrip('0')}"

    # Generate 6-digit OTP code
    otp_code = str(random.randint(100000, 999999))

    # Save to store with 5-minute expiry
    expires_at = time.time() + 300
    _otp_store[phone] = {"code": otp_code, "expires_at": expires_at, "attempts": 0}
    _otp_store[full_phone] = {"code": otp_code, "expires_at": expires_at, "attempts": 0}

    return {
        "success": True,
        "message": f"Verification code sent to {full_phone}.",
        "demoCode": otp_code,
        "mock": True,
    }


@router.post("/otp/verify", summary="Verify Phone OTP Code")
async def verify_otp(payload: OTPVerifyRequest):
    phone = payload.phone.strip().replace(" ", "").replace("-", "")
    full_phone = phone if phone.startswith("+") else f"+91{phone.lstrip('0')}"
    code = payload.code.strip()

    otp_data = _otp_store.get(phone) or _otp_store.get(full_phone)

    if not otp_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active verification code found for this phone number.",
        )

    if time.time() > otp_data["expires_at"]:
        _otp_store.pop(phone, None)
        _otp_store.pop(full_phone, None)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired. Please request a new one.",
        )

    if otp_data["attempts"] >= 3:
        _otp_store.pop(phone, None)
        _otp_store.pop(full_phone, None)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP verification limit exceeded (3 attempts max). Please request a new code.",
        )

    if otp_data["code"] == code:
        _otp_store.pop(phone, None)
        _otp_store.pop(full_phone, None)
        return {
            "success": True,
            "user": {
                "id": f"usr-phone-{phone[-4:]}",
                "email": f"{phone}@forge-path.internal",
                "name": f"User {phone[-4:]}",
                "role": "admin",
                "company_id": "apex-manufacturing-uuid",
            },
            "company": {
                "id": "apex-manufacturing-uuid",
                "name": "Apex Manufacturing Inc.",
                "industry": "CNC & Fabrication",
                "currency": "INR",
            },
            "token": f"mock-jwt-phone-{random.randint(1000, 9999)}",
        }
    else:
        otp_data["attempts"] += 1
        remaining = 3 - otp_data["attempts"]
        if remaining <= 0:
            _otp_store.pop(phone, None)
            _otp_store.pop(full_phone, None)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect code. OTP limit exceeded (3 attempts max). Please request a new code.",
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Incorrect code. {remaining} attempts remaining.",
        )


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
