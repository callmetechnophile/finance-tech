from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any
import uuid

from app.database.session import get_db
from app.utils.deps import get_current_user, get_pagination
from app.models.schema import DocumentModel
from app.services.ocr_service import ocr_service
from app.services.background_tasks import process_document_ocr_task

router = APIRouter(prefix="/documents", tags=["Document Intelligence"])


@router.get("", summary="List Ingested Documents")
async def list_documents(
    pagination: Dict[str, int] = Depends(get_pagination),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    docs = db.query(DocumentModel).filter(DocumentModel.company_id == current_user["company_id"]).all()
    return {
        "success": True,
        "data": [
            {
                "id": d.id,
                "name": d.file_name,
                "type": d.file_type,
                "status": d.status,
                "confidence_score": d.confidence_score,
                "subtotal": d.subtotal,
                "tax": d.tax,
                "total": d.total,
                "quarantined": d.quarantined,
                "created_at": d.created_at.isoformat() if d.created_at else None,
            }
            for d in docs
        ],
        "pagination": pagination,
    }


@router.post("/upload", summary="Upload & Ingest Document")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    file_bytes = await file.read()
    file_ext = file.filename.split(".")[-1].upper() if "." in file.filename else "PDF"

    # Execute OCR Extraction
    parsed = ocr_service.parse_document(file_bytes, file.filename)

    # Save to Database
    doc_id = f"doc-{uuid.uuid4().hex[:6]}"
    doc = DocumentModel(
        id=doc_id,
        company_id=current_user["company_id"],
        file_name=file.filename,
        file_type=file_ext,
        status=parsed["status"],
        confidence_score=parsed["confidence_score"],
        subtotal=parsed["subtotal"],
        tax=parsed["tax"],
        total=parsed["total"],
        quarantined=parsed["quarantined"],
    )
    db.add(doc)
    db.commit()

    # Trigger Background Job
    background_tasks.add_task(process_document_ocr_task, file.filename, doc_id)

    return {
        "success": True,
        "data": {
            "id": doc.id,
            "name": doc.file_name,
            "type": doc.file_type,
            "status": doc.status,
            "confidence_score": doc.confidence_score,
            "total": doc.total,
            "quarantined": doc.quarantined,
        },
    }
