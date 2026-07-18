from dataclasses import dataclass, field
from typing import List, Dict, Any
from app.modules.module3_collection.schemas.approval_schema import WorkflowApproval
from app.modules.module3_collection.schemas.scheduler_schema import ReminderSchedule
from app.modules.module3_collection.schemas.task_schema import CollectionTask

@dataclass
class CollectionWorkflowReport:
    """
    Consolidated final workflow report mapping the collection workflow stage, 
    next action schedules, approval status, internal tasks, and dispatcher queues.
    """
    invoice_id: str
    workflow_status: str  # OPEN, PENDING_APPROVAL, COLLECTED, ESCALATED, CLOSED
    current_stage: str    # Friendly, Professional, Firm, Phone_Call, Finance_Escalation, Legal_Review, Closed
    next_action: str      # WAIT, SEND_EMAIL, SEND_SMS, SEND_WHATSAPP, SCHEDULE_PHONE_CALL, ESCALATE_MANAGER, etc.
    next_action_date: str
    approval_status: WorkflowApproval
    reminder_schedule: ReminderSchedule
    escalation_level: str  # Level 1 to Level 6
    generated_tasks: List[CollectionTask] = field(default_factory=list)
    dispatch_status: str = "PENDING"
    audit_reference: str = ""
    generated_timestamp: str = ""
