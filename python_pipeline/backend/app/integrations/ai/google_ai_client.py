import httpx
import logging
import json
from typing import Dict, Any, Optional
from app.integrations.ai.ai_config import AIConfig

logger = logging.getLogger(__name__)


class GoogleAIClient:
    """
    HTTP client for querying Google AI Studio API endpoints for Gemma 4 models.
    Supports system instructions, chat completions, structured JSON output, timeouts, and offline mocks.
    """

    def __init__(self, config: AIConfig = None):
        self.config = config or AIConfig()

    async def execute_chat(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """
        Executes Chat Completion query to Google AI Studio for Gemma 4.
        Supports both OpenAI-compatible endpoint and native Google AI Studio REST API.
        """
        if not self.config.is_configured():
            logger.warning("Google AI Studio is not configured or using placeholder key. Running in offline mock mode.")
            return self._mock_response(prompt)

        # Primary: Google AI Studio REST API endpoint for Gemma 4
        url = f"{self.config.base_url}/models/{self.config.model_name}:generateContent?key={self.config.api_key}"
        
        contents = []
        if system_instruction:
            contents.append({"role": "user", "parts": [{"text": system_instruction}]})
            contents.append({"role": "model", "parts": [{"text": "Understood. I will act according to your instructions."}]})
        
        contents.append({"role": "user", "parts": [{"text": prompt}]})

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": 0.2,
                "maxOutputTokens": 2048
            }
        }

        try:
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                response = await client.post(url, json=payload)
                
                # Fallback to OpenAI-compatible endpoint if native endpoint returns 404
                if response.status_code == 404:
                    return await self._execute_openai_compat(prompt, system_instruction)
                    
                response.raise_for_status()
                data = response.json()
                
                # Extract text from Google AI Studio response format
                candidates = data.get("candidates", [])
                if candidates and "content" in candidates[0]:
                    parts = candidates[0]["content"].get("parts", [])
                    if parts:
                        return parts[0].get("text", "")
                
                return ""
        except Exception as e:
            logger.error(f"Google AI Studio Chat API call failed for model {self.config.model_name}: {str(e)}")
            raise

    async def _execute_openai_compat(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """
        Fallback query via Google AI Studio OpenAI-compatible endpoint.
        """
        url = f"{self.config.base_url}/openai/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json"
        }
        
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.config.model_name,
            "messages": messages,
            "temperature": 0.2
        }

        async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    async def check_health(self) -> bool:
        """
        Validates connection to Google AI Studio models endpoint.
        """
        if not self.config.is_configured():
            return False
        
        url = f"{self.config.base_url}/models?key={self.config.api_key}"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(url)
                return res.status_code == 200
        except Exception:
            return False

    def _mock_response(self, prompt: str) -> str:
        """
        Provides mock responses for prompt keywords when offline.
        """
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


# Alias for backward compatibility
NIMClient = GoogleAIClient
