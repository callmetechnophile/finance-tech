from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from app.database.session import get_db
from app.utils.deps import get_current_user
from app.models.schema import BankAccountModel, PaymentModel

router = APIRouter(prefix="/treasury", tags=["Treasury Operations"])


@router.get("/summary", summary="Get Bank Accounts Telemetry & Payout Queue")
async def get_treasury_summary(
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    accounts = db.query(BankAccountModel).filter(BankAccountModel.company_id == current_user["company_id"]).all()
    payments = db.query(PaymentModel).filter(PaymentModel.company_id == current_user["company_id"]).all()

    total_liquid = sum(a.balance for a in accounts)
    outstanding_ap = sum(p.amount for p in payments)

    return {
        "success": True,
        "total_liquid": total_liquid,
        "outstanding_ap": outstanding_ap,
        "connected_accounts": len(accounts),
        "bank_accounts": [
            {
                "id": a.id,
                "bank_name": a.bank_name,
                "account_number": a.account_number,
                "balance": a.balance,
                "account_type": a.account_type,
            }
            for a in accounts
        ],
        "payment_queue": [
            {
                "id": p.id,
                "vendor_name": p.vendor_name,
                "amount": p.amount,
                "due_date": p.due_date,
                "status": p.status,
                "discount_terms": p.discount_terms,
            }
            for p in payments
        ],
    }


@router.post("/payments/{payment_id}/pay", summary="Execute Vendor Payout Wire")
async def pay_vendor(
    payment_id: str,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    payment = db.query(PaymentModel).filter(PaymentModel.id == payment_id).first()
    if payment:
        payment.status = "Executed"
        db.commit()

    return {
        "success": True,
        "message": f"Payment {payment_id} executed successfully.",
    }
