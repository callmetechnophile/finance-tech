import uuid
import datetime
from typing import List
from app.modules.module3_collection.schemas.task_schema import CollectionTask
from app.modules.module3_collection.schemas.approval_schema import WorkflowApproval

class TaskEngine:
    """
    Generates internal action items, assigning priorities and owner roles 
    based on escalation stages.
    """

    def generate_tasks(
        self,
        invoice_id: str,
        escalation_stage: str,
        next_action: str,
        approval: WorkflowApproval,
        reliability_score: float,
        today: datetime.date = None
    ) -> List[CollectionTask]:
        
        if today is None:
            today = datetime.date.today()

        tasks: List[CollectionTask] = []
        due_date_str = (today + datetime.timedelta(days=2)).isoformat()

        # Rule 1: High escalation actions need reviews/approvals
        if approval.approval_required and approval.approval_status == "PENDING":
            tasks.append(CollectionTask(
                task_id=f"TSK-{str(uuid.uuid4())[:8].upper()}",
                priority="High",
                owner=approval.approver_role,
                title=f"Review and approve {approval.approval_level} level collection action",
                due_date=due_date_str,
                status="PENDING",
                dependencies=[]
            ))

        # Rule 2: Escalation to Phone Calls
        if next_action == "SCHEDULE_PHONE_CALL" or escalation_stage == "Phone_Call":
            tasks.append(CollectionTask(
                task_id=f"TSK-{str(uuid.uuid4())[:8].upper()}",
                priority="Medium",
                owner="Account Manager",
                title=f"Call customer to resolve invoice {invoice_id}",
                due_date=due_date_str,
                status="PENDING",
                dependencies=[]
            ))

        # Rule 3: Escalation to Legal
        if next_action == "LEGAL_REVIEW" or escalation_stage == "Legal_Review":
            tasks.append(CollectionTask(
                task_id=f"TSK-{str(uuid.uuid4())[:8].upper()}",
                priority="High",
                owner="Legal Counsel",
                title=f"Prepare and dispatch formal legal notice for invoice {invoice_id}",
                due_date=due_date_str,
                status="PENDING",
                dependencies=[]
            ))

        # Rule 4: Poor reliability checks
        if reliability_score < 50.0:
            tasks.append(CollectionTask(
                task_id=f"TSK-{str(uuid.uuid4())[:8].upper()}",
                priority="Medium",
                owner="Account Manager",
                title=f"Verify contact details and register payment behavior issues for invoice {invoice_id}",
                due_date=due_date_str,
                status="PENDING",
                dependencies=[]
            ))

        # If no tasks triggered, generate a default verification task
        if not tasks:
            tasks.append(CollectionTask(
                task_id=f"TSK-{str(uuid.uuid4())[:8].upper()}",
                priority="Low",
                owner="Account Manager",
                title=f"Monitor payment cycle progress for invoice {invoice_id}",
                due_date=due_date_str,
                status="PENDING",
                dependencies=[]
            ))

        return tasks
