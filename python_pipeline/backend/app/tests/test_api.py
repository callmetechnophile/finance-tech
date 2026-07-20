import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_health_check():
    """Verify root health check endpoint returns 200 OK and healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_versioned_health_check():
    """Verify API v1 health check returns operational component telemetry."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "components" in data
    assert data["components"]["database"]["status"] == "healthy"


def test_auth_profile_endpoint():
    """Verify auth profile returns authenticated user context."""
    response = client.get("/api/v1/auth/profile", headers={"x-company-id": "apex-test-company"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["company"]["id"] == "apex-test-company"


def test_documents_list_endpoint():
    """Verify document intelligence endpoint returns ingestion logs."""
    response = client.get("/api/v1/documents")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert isinstance(data["data"], list)


def test_forecast_horizon_endpoint():
    """Verify cash flow forecast returns metrics for target horizon."""
    response = client.get("/api/v1/cashflow/forecast?horizon=30d")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["horizon"] == "30d"
    assert data["metrics"]["available_cash"] == 342000


def test_liquidity_metrics_endpoint():
    """Verify liquidity command center returns rating and ratios."""
    response = client.get("/api/v1/liquidity/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["liquidity_rating"] == 84
    assert data["quick_ratio"] == 1.8


def test_collections_invoices_endpoint():
    """Verify collections operations endpoint returns AR balance and delinquent queue."""
    response = client.get("/api/v1/collections/invoices")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_ar"] > 0
    assert len(data["invoices"]) >= 2


def test_treasury_summary_endpoint():
    """Verify treasury summary endpoint returns bank accounts telemetry."""
    response = client.get("/api/v1/treasury/summary")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total_liquid"] == 342000


def test_copilot_chat_endpoint():
    """Verify AI Virtual CFO copilot chat endpoint returns inference response."""
    response = client.post("/api/v1/copilot/chat", json={"message": "What is our 30d cash runway?"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "query" in data
    assert data["query"] == "What is our 30d cash runway?"
