import datetime
from sqlalchemy.orm import Session
from app.modules.module3_collection.schemas.collection_report_schema import CollectionIntelligenceReport
from app.modules.module3_collection.schemas.communication_schema import CommunicationRecommendation
from app.modules.module3_collection.schemas.workflow_schema import CollectionWorkflowReport
from app.modules.module3_collection.workflow.workflow_engine import WorkflowEngine
from app.modules.module3_collection.workflow.approval_engine import ApprovalEngine
from app.modules.module3_collection.workflow.reminder_scheduler import ReminderScheduler
from app.modules.module3_collection.workflow.escalation_engine import EscalationEngine
from app.modules.module3_collection.workflow.task_engine import TaskEngine
from app.modules.module3_collection.workflow.dispatcher import CommunicationDispatcher
from app.modules.module3_collection.workflow.audit_engine import AuditEngine

class WorkflowService:
    """
    Main orchestration service coordinating the workflow engine state transitions, 
    approval matrices, reminder timelines, task allocations, mock dispatching, and audit logging.
    """

    def __init__(self):
        self.workflow_engine = WorkflowEngine()
        self.approval_engine = ApprovalEngine()
        self.scheduler = ReminderScheduler()
        self.escalation_engine = EscalationEngine()
        self.task_engine = TaskEngine()
        self.dispatcher = CommunicationDispatcher()
        self.audit_engine = AuditEngine()

    def process_workflow(
        self,
        session: Session,
        report: CollectionIntelligenceReport,
        recommendation: CommunicationRecommendation,
        last_reminder_date: str = None,
        today: datetime.date = None
    ) -> CollectionWorkflowReport:
        
        if today is None:
            today = datetime.date.today()

        invoice_ctx = report.invoice_context
        profile = report.customer_profile

        # 1. Evaluate Escalation Levels (Levels 1 to 6)
        escalation = self.escalation_engine.evaluate_escalation(
            days_overdue=invoice_ctx.days_overdue,
            reminder_count=invoice_ctx.reminder_count,
            collection_probability=report.collection_probability,
            outstanding_amount=invoice_ctx.outstanding_balance,
            customer_reliability=profile.customer_reliability_score,
            liquidity_risk=report.supporting_metrics.get("liquidity_risk", "Low")
        )

        # 2. Evaluate Approval Checks
        approval = self.approval_engine.evaluate_approval(
            outstanding_balance=invoice_ctx.outstanding_balance,
            tone=recommendation.tone
        )

        # 3. Calculate Reminder Schedule
        # Standard configuration: max attempts = 4, cooling interval = 7 days
        schedule = self.scheduler.calculate_schedule(
            reminder_count=invoice_ctx.reminder_count,
            last_reminder_date_str=last_reminder_date,
            max_attempts=4,
            min_interval_days=7,
            today=today
        )

        # 4. Run State Machine to Determine Next Action
        next_action = self.workflow_engine.determine_next_action(
            payment_status=invoice_ctx.payment_status,
            days_overdue=invoice_ctx.days_overdue,
            reminder_count=invoice_ctx.reminder_count,
            remaining_attempts=schedule.remaining_attempts,
            escalation_level=escalation.escalation_level
        )

        if schedule.status == "COOLING_DOWN":
            next_action = "WAIT"

        # Update workflow status based on approval and actions
        if invoice_ctx.payment_status == "PAID":
            status = "CLOSED"
        elif approval.approval_required and approval.approval_status == "PENDING":
            status = "PENDING_APPROVAL"
            # If pending approval, we wait rather than directly sending
            next_action = "ESCALATE_MANAGER"
        elif next_action == "LEGAL_REVIEW":
            status = "ESCALATED"
        elif next_action == "ESCALATE_FINANCE" or next_action == "ESCALATE_MANAGER":
            status = "ESCALATED"
        else:
            status = "OPEN"

        # 5. Generate Internal Action Items
        tasks = self.task_engine.generate_tasks(
            invoice_id=invoice_ctx.invoice_id,
            escalation_stage=escalation.escalation_stage,
            next_action=next_action,
            approval=approval,
            reliability_score=profile.customer_reliability_score,
            today=today
        )

        # 6. Mock Dispatch Communications
        dispatch_res = "PENDING"
        if status != "PENDING_APPROVAL" and next_action in ["SEND_EMAIL", "SEND_SMS", "SEND_WHATSAPP"]:
            payload = {
                "subject": recommendation.email.get("email_subject"),
                "body": recommendation.email.get("email_body") if next_action == "SEND_EMAIL" else (recommendation.sms if next_action == "SEND_SMS" else recommendation.whatsapp),
                "tone": recommendation.tone
            }
            res = self.dispatcher.dispatch_communication(
                invoice_id=invoice_ctx.invoice_id,
                dispatch_type=next_action.replace("SEND_", ""),
                payload=payload
            )
            dispatch_res = res.get("dispatch_status", "SUCCESS")

        # 7. Record Transition Audit entry
        audit_entry = self.audit_engine.record_transition(
            session=session,
            invoice_id=invoice_ctx.invoice_id,
            action=f"Workflow Action Triggered: {next_action}",
            previous_status="OPEN",
            new_status=status,
            reason=f"Escalation Level: {escalation.escalation_level}, overdue days: {invoice_ctx.days_overdue}"
        )

        return CollectionWorkflowReport(
            invoice_id=invoice_ctx.invoice_id,
            workflow_status=status,
            current_stage=escalation.escalation_stage,
            next_action=next_action,
            next_action_date=schedule.next_reminder_date,
            approval_status=approval,
            reminder_schedule=schedule,
            escalation_level=escalation.escalation_level,
            generated_tasks=tasks,
            dispatch_status=dispatch_res,
            audit_reference=audit_entry.audit_id,
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        )
