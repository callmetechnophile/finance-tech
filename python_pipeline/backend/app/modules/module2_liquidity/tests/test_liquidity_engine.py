import pytest
import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures as M1Features
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResponse as M1Forecast, ForecastResult as M1Result, ForecastSummary as M1Summary, ForecastMetadata as M1Metadata
from app.modules.module2_liquidity.services.liquidity_service import LiquidityService

@pytest.fixture
def service():
    return LiquidityService()

def mock_forecast(days_balance: float = 50000.0) -> M1Forecast:
    # Setup mock forecast responses for 30 days
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

def test_healthy_company(service):
    # High cash balance, low debt, strong history
    m1_features = M1Features(
        daily_cash_inflow={"2026-07-10": 2000.0, "2026-07-12": 2500.0},
        daily_cash_outflow={"2026-07-11": 500.0, "2026-07-13": 600.0},
        historical_cash_balance={"2026-07-13": 100000.0},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-25", "total_amount": 10000.0, "partner_id": "c-1"}
        ],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-28", "total_amount": 5000.0, "partner_id": "v-1"}
        ],
        recurring_income=100.0,
        recurring_expenses=50.0,
        current_cash_balance=100000.0
    )
    
    m1_forecast = mock_forecast(days_balance=100000.0)
    intel = service.run_liquidity_analysis(m1_features, m1_forecast)
    
    assert intel.liquidity_score >= 85.0
    assert intel.liquidity_level == "Excellent"
    assert intel.risk_level == "Very Low"
    assert len(intel.contributing_factors) == 0

def test_negative_working_capital(service):
    # High liabilities exceeding cash + receivables
    m1_features = M1Features(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-25", "total_amount": 2000.0, "partner_id": "c-1"}
        ],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-28", "total_amount": 35000.0, "partner_id": "v-1"}
        ],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=10000.0  # Total assets: 12000, Total liabilities: 35000
    )
    
    m1_forecast = mock_forecast(days_balance=10000.0)
    intel = service.run_liquidity_analysis(m1_features, m1_forecast)
    
    assert intel.working_capital < 0.0
    assert intel.working_capital_ratio < 1.0
    assert any("working capital deficit" in f.lower() for f in intel.contributing_factors)

def test_low_cash_balance(service):
    m1_features = M1Features(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[
            {"invoice_number": "P-Low", "due_date": "2026-07-28", "total_amount": 15000.0, "partner_id": "v-1"}
        ],
        recurring_income=0.0,
        recurring_expenses=100.0,
        current_cash_balance=2000.0  # low cash vs 15k payables
    )
    m1_forecast = mock_forecast(days_balance=2000.0)
    intel = service.run_liquidity_analysis(m1_features, m1_forecast)
    
    assert intel.risk_level in ["High", "Critical"]
    assert any("safety threshold target" in f.lower() for f in intel.contributing_factors)

def test_high_burn_rate(service):
    # Daily outflows are extremely high, draining buffer days runway
    m1_features = M1Features(
        daily_cash_inflow={},
        daily_cash_outflow={"2026-07-10": 10000.0, "2026-07-11": 15000.0},
        historical_cash_balance={},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=5000.0, # High overheads
        current_cash_balance=20000.0
    )
    m1_forecast = mock_forecast(days_balance=20000.0)
    intel = service.run_liquidity_analysis(m1_features, m1_forecast)
    
    assert intel.buffer_days < 10.0
    assert any("short operating cash runway" in f.lower() for f in intel.contributing_factors)

def test_large_receivables_delay(service):
    m1_features = M1Features(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-10", "total_amount": 50000.0, "partner_id": "c-1"}  # Delayed past 2026-07-15
        ],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=10000.0
    )
    m1_forecast = mock_forecast(days_balance=10000.0)
    intel = service.run_liquidity_analysis(m1_features, m1_forecast)
    
    assert any("customer payment delay" in f.lower() for f in intel.contributing_factors)

def test_large_payables_obligation(service):
    m1_features = M1Features(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-28", "total_amount": 40000.0, "partner_id": "v-1"}
        ],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=20000.0  # Payables (40k) exceed cash (20k)
    )
    m1_forecast = mock_forecast(days_balance=20000.0)
    intel = service.run_liquidity_analysis(m1_features, m1_forecast)
    
    assert any("accounts payable" in f.lower() for f in intel.contributing_factors)

def test_zero_revenue_and_expenses(service):
    m1_features = M1Features(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=10000.0
    )
    m1_forecast = mock_forecast(days_balance=10000.0)
    intel = service.run_liquidity_analysis(m1_features, m1_forecast)
    
    # Confirm fallback defaults prevent crashes and output valid models
    assert intel.burn_rate > 0.0
    assert intel.buffer_days > 0.0
    assert intel.liquidity_score > 0.0
