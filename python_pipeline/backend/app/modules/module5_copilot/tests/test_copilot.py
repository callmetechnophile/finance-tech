import pytest
import datetime
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from app.database.models import Base
from app.modules.module5_copilot.services.query_router import QueryRouter
from app.modules.module5_copilot.services.copilot_response_validator import CopilotResponseValidator
from app.modules.module5_copilot.services.copilot_service import CopilotService

@pytest.fixture
def anyio_backend():
    return "asyncio"

@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    session = Session(bind=engine)
    yield session
    session.close()

def test_query_router():
    router = QueryRouter()
    
    # Test individual routes
    assert "FORECAST" in router.route_query("show me cash flow forecast projection")
    assert "LIQUIDITY" in router.route_query("what is my current cash runway?")
    assert "COLLECTIONS" in router.route_query("which invoices are overdue?")
    assert "PAYMENTS" in router.route_query("which vendors should I pay today?")

    # Test multi-module route
    cnc_routes = router.route_query("can I buy a CNC machine?")
    assert len(cnc_routes) > 1

def test_response_validator():
    validator = CopilotResponseValidator()
    
    context = {
        "modules": {
            "LIQUIDITY": {
                "liquidity_score": 84,
                "runway_days": 68
            }
        }
    }

    # Test valid text (only references numbers present in context or allowed defaults)
    valid_text = "Your current liquidity score is 84 with 68 days of cash runway remaining."
    valid, err = validator.validate_response(valid_text, context)
    assert valid is True

    # Test invalid text containing hallucinated numbers (e.g. 500 days runway or $40,000 budget)
    invalid_text = "You can afford the CNC machine as your budget is $40,000 and runway is 500 days."
    valid, err = validator.validate_response(invalid_text, context)
    assert valid is False
    assert "Hallucinated" in err

@pytest.mark.anyio
async def test_copilot_service_orchestrator(db_session):
    with patch("app.integrations.ai.nim_client.NIMClient.execute_chat") as mock_chat:
        # Mock chat outputs structural answer using only context numbers
        mock_chat.return_value = "Your current liquidity score is 84."
        
        service = CopilotService()
        res = await service.execute_chat(
            session=db_session,
            session_id="test-session-1",
            user_message="what is my liquidity score?",
            today=datetime.date(2026, 7, 15)
        )
        
        assert "84" in res.response
        assert len(res.suggested_questions) > 0
        assert "LIQUIDITY" in res.referenced_metrics["modules"]
