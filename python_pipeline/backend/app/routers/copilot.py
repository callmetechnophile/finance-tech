from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
from pydantic import BaseModel
import uuid

from app.database.session import get_db
from app.utils.deps import get_current_user
from app.services.ai_service import ai_service
from app.models.schema import CopilotChatModel, CompanyModel

router = APIRouter(prefix="/copilot", tags=["AI Copilot"])


class ChatQuery(BaseModel):
    message: str


@router.post("/chat", summary="Query NVIDIA Gemma Virtual CFO Copilot")
async def chat_copilot(
    query: ChatQuery,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    company = db.query(CompanyModel).filter(CompanyModel.id == current_user["company_id"]).first()
    context = {
        "cash": company.liquid_cash if company else 342000.0,
        "ar": 284500.0,
        "burn": 5000.0,
    }

    # Query NVIDIA Gemma API
    ai_result = ai_service.query_gemma(query.message, context=context)

    # Persist chat history
    user_chat = CopilotChatModel(
        id=f"chat-{uuid.uuid4().hex[:6]}",
        company_id=current_user["company_id"],
        role="user",
        content=query.message,
    )
    assistant_chat = CopilotChatModel(
        id=f"chat-{uuid.uuid4().hex[:6]}",
        company_id=current_user["company_id"],
        role="assistant",
        content=ai_result["response"],
    )
    db.add(user_chat)
    db.add(assistant_chat)
    db.commit()

    return {
        "success": True,
        "query": query.message,
        "response": ai_result["response"],
        "model": ai_result["model"],
        "provider": ai_result["provider"],
        "latency_ms": ai_result["latency_ms"],
    }
