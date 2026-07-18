import httpx
import logging
from typing import Dict, Any
from app.integrations.ai.ai_config import AIConfig

logger = logging.getLogger(__name__)

class NIMClient:
    """
    HTTP client for querying NVIDIA NIM inference APIs with credentials and timeout scopes.
    """

    def __init__(self, config: AIConfig = None):
        self.config = config or AIConfig()
        self.headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json"
        }

    async def execute_chat(self, prompt: str) -> str:
        """
        Executes Chat Completion query to the NVIDIA NIM endpoint.
        """
        if not self.config.is_configured():
            logger.warning("NVIDIA NIM is not configured. Running in offline mock mode.")
            return self._mock_response(prompt)

        url = f"{self.config.base_url}/chat/completions"
        payload = {
            "model": self.config.model_name,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2
        }

        try:
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                response = await client.post(url, headers=self.headers, json=payload)
                response.raise_for_status()
                data = response.json()
                # Extract response text
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"NVIDIA NIM Chat API call failed: {str(e)}")
            # Raise exception to trigger retries/fallbacks in higher layers
            raise

    async def check_health(self) -> bool:
        """
        Validates connection by querying the models endpoint or health ping.
        """
        if not self.config.is_configured():
            return False
        
        url = f"{self.config.base_url}/models"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url, headers=self.headers)
                return res.status_code == 200
        except Exception:
            return False

    def _mock_response(self, prompt: str) -> str:
        """
        Provides mock responses for prompt keywords when offline.
        """
        import json
        if "email_subject" in prompt:
            return json.dumps({
                "email_subject": "Overdue Balance Reminder: Invoice INV-123",
                "email_body": "Dear Customer, please find attached a reminder regarding invoice INV-123. Kindly arrange payment.",
                "tone": "Friendly",
                "communication_goal": "Collect outstanding balance"
            })
        elif "sms_body" in prompt:
            return json.dumps({
                "sms_body": "Reminder: Invoice INV-123 is outstanding. Settle balance. Thanks."
            })
        elif "whatsapp_body" in prompt:
            return json.dumps({
                "whatsapp_body": "Hello! Just a reminder that invoice INV-123 is outstanding. Pay here: [payment_link]"
            })
        elif "explanation" in prompt:
            return json.dumps({
                "explanation": "This invoice has been prioritized because DAYS_OVERDUE_CRITICAL trigger is active."
            })
        return "{}"
