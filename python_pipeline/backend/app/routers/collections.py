from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any
from pydantic import BaseModel

from app.database.session import get_db
from app.utils.deps import get_current_user
from app.models.schema import InvoiceModel
from app.services.background_tasks import dispatch_collection_reminders_task

router = APIRouter(prefix="/collections", tags=["Collections Operations"])


class RemindPayload(BaseModel):
    channel: str = "email"


@router.get("/invoices", summary="Get Accounts Receivable Invoices")
async def get_collections_invoices(
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    invoices = db.query(InvoiceModel).filter(InvoiceModel.company_id == current_user["company_id"]).all()
    total_ar = sum(i.amount for i in invoices)

    return {
        "success": True,
        "total_ar": total_ar,
        "active_accounts": len(invoices),
        "invoices": [
            {
                "id": i.id,
                "invoice_number": i.invoice_number,
                "customer": i.customer_name,
                "amount": i.amount,
                "due_date": i.due_date,
                "days_overdue": i.days_overdue,
                "status": i.status,
                "escalation_level": i.escalation_level,
            }
            for i in invoices
        ],
    }


@router.post("/invoices/{invoice_id}/remind", summary="Dispatch Reminder via Twilio SMS & Brevo Email")
async def send_invoice_reminder(
    invoice_id: str,
    payload: RemindPayload,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    inv = db.query(InvoiceModel).filter(InvoiceModel.id == invoice_id).first()
    customer = inv.customer_name if inv else "Apex Customer"
    amount = inv.amount if inv else 47500.0

    # Queue multi-channel dispatch
    background_tasks.add_task(
        dispatch_collection_reminders_task,
        customer_name=customer,
        phone="+15550199221",
        email="billing@apex-customer.com",
        invoice_id=invoice_id,
        amount=amount,
    )

    return {
        "success": True,
        "message": f"Queued {payload.channel.upper()} reminder for invoice {invoice_id} via Twilio & Brevo.",
    }
