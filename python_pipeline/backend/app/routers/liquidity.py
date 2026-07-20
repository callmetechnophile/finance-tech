from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database.session import get_db
from app.utils.deps import get_current_user
from app.models.schema import CompanyModel

router = APIRouter(prefix="/liquidity", tags=["Liquidity Command Center"])


@router.get("/metrics", summary="Get Liquidity Rating & Solvency Ratios")
async def get_liquidity_metrics(
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    company = db.query(CompanyModel).filter(CompanyModel.id == current_user["company_id"]).first()
    liquid = company.liquid_cash if company else 342000.0

    return {
        "success": True,
        "liquidity_rating": 84,
        "quick_ratio": company.quick_ratio if company else 1.8,
        "current_ratio": 2.4,
        "working_capital": 224100.0,
        "operating_cash_reserve": liquid,
    }
