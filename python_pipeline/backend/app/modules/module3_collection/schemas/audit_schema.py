from dataclasses import dataclass

@dataclass
class WorkflowAuditEntry:
    """
    Schema representing records of workflow events and state transitions.
    """
    audit_id: str
    timestamp: str
    user: str
    invoice_id: str
    action: str          # Reminder Generated, Approval Requested, Escalation Triggered, etc.
    previous_status: str
    new_status: str
    reason: str
