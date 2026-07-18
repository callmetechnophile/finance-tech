from dataclasses import dataclass

@dataclass
class WorkflowApproval:
    """
    Schema representing approval status, approver roles, and levels.
    """
    approval_required: bool
    approval_status: str  # APPROVED, PENDING, REJECTED, NOT_REQUIRED
    approval_level: str   # Manager, Finance Manager, Legal Team, None
    approver_role: str    # General Manager, Head of Finance, Chief Legal Officer, None
    approval_reason: str
