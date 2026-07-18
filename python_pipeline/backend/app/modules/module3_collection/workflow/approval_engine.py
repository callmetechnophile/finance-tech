from app.modules.module3_collection.schemas.approval_schema import WorkflowApproval

class ApprovalEngine:
    """
    Checks invoice values and communication tones against authorization limits 
    to trigger required approval checks.
    """

    def evaluate_approval(self, outstanding_balance: float, tone: str) -> WorkflowApproval:
        # Check amount limits (₹500,000 or $6,000)
        # Using ₹500,000 as defined in prompt
        if outstanding_balance > 500000.0 or outstanding_balance > 6000.0:
            return WorkflowApproval(
                approval_required=True,
                approval_status="PENDING",
                approval_level="Manager",
                approver_role="General Manager",
                approval_reason=f"Outstanding balance exceeds threshold: {outstanding_balance}"
            )

        if tone == "Final Notice":
            return WorkflowApproval(
                approval_required=True,
                approval_status="PENDING",
                approval_level="Finance Manager",
                approver_role="Head of Finance",
                approval_reason="Tone is set to Final Notice"
            )

        if tone == "Legal Escalation" or tone == "Legal Notice":
            return WorkflowApproval(
                approval_required=True,
                approval_status="PENDING",
                approval_level="Legal Team",
                approver_role="Chief Legal Officer",
                approval_reason="Tone is set to Legal Escalation"
            )

        # No approval required
        return WorkflowApproval(
            approval_required=False,
            approval_status="NOT_REQUIRED",
            approval_level="None",
            approver_role="None",
            approval_reason="No policy limits exceeded"
        )
