import os
import json
import logging
import google.generativeai as genai

logger = logging.getLogger(__name__)

class GemmaClient:
    """
    Client for interacting with Gemma/Gemini models via Google Generative AI SDK, 
    supporting schema enforcement, retry limits, and deterministic mock fallbacks.
    """

    def __init__(self):
        api_key = os.getenv("GEMMA_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.enabled = bool(api_key)
        if self.enabled:
            genai.configure(api_key=api_key)
            # Default to gemini-1.5-flash or gemini-2.5-flash if specified
            model_name = os.getenv("GEMMA_MODEL_NAME", "gemini-1.5-flash")
            self.model = genai.GenerativeModel(model_name)
        else:
            logger.warning("GEMMA_API_KEY or GEMINI_API_KEY not found. GemmaClient will run in mock mode.")
            self.model = None

    async def generate_response(self, prompt: str) -> str:
        """
        Sends prompt to Gemini API or runs mock behavior if API key is not configured.
        """
        if not self.enabled:
            # Generate deterministic mock responses to satisfy the generator logic
            return self._mock_response_generator(prompt)

        try:
            # google-generativeai API call
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemma client API call failed: {str(e)}")
            # Fallback to mock generation if the live endpoint errors
            return self._mock_response_generator(prompt)

    def _mock_response_generator(self, prompt: str) -> str:
        """
        Produces mock responses matching expected prompt schemas.
        """
        if "email_subject" in prompt:
            # Extract customer name/invoice number from prompt if possible
            tone = "Friendly"
            if "tone: Final Notice" in prompt or '"tone": "Final Notice"' in prompt:
                tone = "Final Notice"
            elif "tone: Firm" in prompt or '"tone": "Firm"' in prompt:
                tone = "Firm"
            elif "tone: Legal" in prompt or '"tone": "Legal Escalation"' in prompt:
                tone = "Legal Escalation"
            elif "tone: Professional" in prompt or '"tone": "Professional"' in prompt:
                tone = "Professional"

            return json.dumps({
                "email_subject": f"[{tone}] Outstanding Payment Reminder - Invoice Details",
                "email_body": "Dear Customer, this is a message regarding outstanding balances. Please check payment instructions below.",
                "tone": tone,
                "communication_goal": "Establish contact and secure payment schedule."
            })
        elif "sms_body" in prompt:
            return json.dumps({
                "sms_body": "Reminder: Your invoice is unpaid. Please check your dashboard to clear the balance. Thank you."
            })
        elif "whatsapp_body" in prompt:
            return json.dumps({
                "whatsapp_body": "Hello! Just a reminder that invoice INV-123 is outstanding. Outstanding amount: Rs. 5000. Pay here: [payment_link]"
            })
        elif "explanation" in prompt:
            # Extract reason codes to reflect them
            codes = []
            if "DAYS_OVERDUE_CRITICAL" in prompt:
                codes.append("DAYS_OVERDUE_CRITICAL")
            if "LARGE_OUTSTANDING_BALANCE" in prompt:
                codes.append("LARGE_OUTSTANDING_BALANCE")
            if "LOW_CUSTOMER_RELIABILITY" in prompt:
                codes.append("LOW_CUSTOMER_RELIABILITY")
            if "LIQUIDITY_DEFICIT_TRIGGER" in prompt:
                codes.append("LIQUIDITY_DEFICIT_TRIGGER")

            explanation_str = "This invoice has been prioritized because " + ", ".join(codes) if codes else "No specific critical flags triggered."
            return json.dumps({
                "explanation": explanation_str
            })
        return "{}"
