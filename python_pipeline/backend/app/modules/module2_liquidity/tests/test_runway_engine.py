import pytest
import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures as M1Features
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse as M1Forecast, ForecastResult as M1Result, ForecastSummary as M1Summary, ForecastMetadata as M1Metadata
from app.modules.module2_liquidity.services.liquidity_scenario_service import LiquidityScenarioService

@pytest.fixture
def service():
    return LiquidityScenarioService()

def mock_forecast(days_balance: float = 50000.0) -> M1Forecast:
    results = []
    start_date = datetime.date(2026, 7, 15)
    for i in range(1, 31):
        dt_str = (start_date + datetime.timedelta(days=i)).strftime("%Y-%m-%d")
        results.append(M1Result(
            forecast_date=dt_str,
            projected_inflow=100.0,
            projected_outflow=100.0,
            projected_balance=days_balance,
            cash_buffer=days_balance - 10000.0,
            confidence_score=0.95
        ))
    
    summary = M1Summary(
        horizon_7_day_balance=days_balance,
        horizon_30_day_balance=days_balance,
        horizon_90_day_balance=days_balance,
        minimum_7_day_buffer=days_balance - 10000.0,
        minimum_30_day_buffer=days_balance - 10000.0,
        minimum_90_day_buffer=days_balance - 10000.0,
        overall_confidence=0.95,
        generated_at="2026-07-15T00:00:00Z"
    )
    
    metadata = M1Metadata(
        company_id="apex-manufacturing-uuid",
        input_data_hash="hash123",
        parameters_applied={"current_cash_balance": days_balance}
    )
    
    return M1Forecast(summary=summary, metadata=metadata, forecast_days=results)

def test_healthy_company_runway(service):
    # High cash balance, low debt, strong history
    m1_features = M1Features(
        daily_cash_inflow={"2026-07-10": 2000.0},
        daily_cash_outflow={"2026-07-11": 500.0},
        historical_cash_balance={},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-25", "total_amount": 1000.0, "partner_id": "c-1"}
        ],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-28", "total_amount": 500.0, "partner_id": "v-1"}
        ],
        recurring_income=100.0,
        recurring_expenses=50.0,
        current_cash_balance=100000.0
    )
    
    m1_forecast = mock_forecast(days_balance=100000.0)
    report = service.run_stress_analysis(m1_features, m1_forecast, start_date=datetime.date(2026, 7, 15))
    
    assert report.cash_runway.runway_level == "Healthy"
    assert report.cash_runway.current_runway_days > 90.0
    assert report.overall_resilience_score > 90.0
    assert any(x in report.lowest_risk_scenario for x in ["Optimistic", "New Customer Retainer"])

def test_critical_liquidity_negative_cash(service):
    # Overdrawn current cash position + liabilities
    m1_features = M1Features(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[
            {"invoice_number": "P-Crit", "due_date": "2026-07-28", "total_amount": 25000.0, "partner_id": "v-1"}
        ],
        recurring_income=0.0,
        recurring_expenses=100.0,
        current_cash_balance=-5000.0
    )
    m1_forecast = mock_forecast(days_balance=-5000.0)
    report = service.run_stress_analysis(m1_features, m1_forecast, start_date=datetime.date(2026, 7, 15))
    
    assert report.cash_runway.runway_level == "Critical"
    assert report.cash_runway.current_runway_days <= 0.0
    assert report.base_case.risk_level == "Critical"

def test_stress_testing_shocks(service):
    # High cash baseline
    m1_features = M1Features(
        daily_cash_inflow={"2026-07-10": 2000.0},
        daily_cash_outflow={"2026-07-11": 500.0},
        historical_cash_balance={},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-25", "total_amount": 1000.0, "partner_id": "c-1"}
        ],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-28", "total_amount": 500.0, "partner_id": "v-1"}
        ],
        recurring_income=100.0,
        recurring_expenses=50.0,
        current_cash_balance=30000.0
    )
    
    m1_forecast = mock_forecast(days_balance=30000.0)
    report = service.run_stress_analysis(m1_features, m1_forecast, start_date=datetime.date(2026, 7, 15))
    
    # Verify rankings lists order
    # The first element (lowest risk) has risk_level index <= last element (highest risk)
    # E.g. Lowest risk should have a higher score than highest risk
    assert report.scenario_rankings[0].liquidity_score >= report.scenario_rankings[-1].liquidity_score
    assert len(report.stress_test_results) > 0
