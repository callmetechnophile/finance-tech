import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class CommunicationDispatcher:
    """
    Mock dispatch queue abstraction layer, managing messaging delivery simulation 
    without importing external provider APIs.
    """

    def __init__(self):
        # Keep an in-memory dispatch queue for test validation checks
        self.dispatch_queue: List[Dict[str, Any]] = []

    def dispatch_communication(
        self,
        invoice_id: str,
        dispatch_type: str,  # EMAIL, SMS, WHATSAPP, PHONE_CALL, INTERNAL_TASK
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        
        logger.info(f"Queueing {dispatch_type} dispatch event for Invoice: {invoice_id}")
        
        # Build mock record
        record = {
            "invoice_id": invoice_id,
            "type": dispatch_type,
            "payload": payload,
            "status": "QUEUED",
            "delivery_attempts": 1
        }
        
        self.dispatch_queue.append(record)

        # Mock successful dispatch result
        return {
            "invoice_id": invoice_id,
            "dispatch_status": "SUCCESS",
            "dispatch_type": dispatch_type,
            "details": f"Successfully mock dispatched via {dispatch_type} adapter."
        }

    def clear_queue(self):
        self.dispatch_queue.clear()
