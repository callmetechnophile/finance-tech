import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FinancialEventBus")

def publish_event(event_type: str, payload: Dict[str, Any]) -> None:
    # In a production layout, this broadcasts to RabbitMQ, Kafka, or AWS EventBridge.
    # For Module 0, it logs and registers the event chronologically.
    logger.info(f"[EVENT BUS] Publishing Event: {event_type} | Payload ID: {payload.get('id', 'N/A')}")
    # Downstream modules subscribe to these events (e.g. Module 1: update forecasts, Module 2: refresh risks)
