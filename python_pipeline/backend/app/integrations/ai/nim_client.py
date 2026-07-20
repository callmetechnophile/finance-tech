"""
Legacy module alias. Replaced by google_ai_client.py.
Forwards all calls to GoogleAIClient (Google AI Studio + Gemma 4 model).
"""

from app.integrations.ai.google_ai_client import GoogleAIClient, NIMClient  # noqa: F401
