import pytest
import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.services.forecast_engine import ForecastEngine
from app.modules.module1_forecasting.services.forecast_validation_service import ForecastValidationService

@pytest.fixture
def engine():
    return ForecastEngine()

@pytest.fixture
def service():
    return ForecastValidationService()

def test_high_confidence_forecast(engine, service):
    # Abundant historical data (10 inflow, 10 outflow dates) + low volatility
    features = ForecastFeatures(
        daily_cash_inflow={f"2026-07-{i:02d}": 1000.0 for i in range(1, 11)},
        daily_cash_outflow={f"2026-07-{i:02d}": 800.0 for i in range(1, 11)},
        historical_cash_balance={f"2026-07-{i:02d}": 50000.0 + i*200.0 for i in range(1, 11)},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=50000.0
    )
    start_date = datetime.date(2026, 7, 15)
    forecast = engine.generate_forecast(features, start_date=start_date)
    report = service.run_validation(features, forecast, start_date=start_date)
    
    assert report.confidence.confidence_level == "High"
    assert report.confidence.confidence_score > 0.8
    assert report.validation.status == "PASS"

def test_low_confidence_forecast(engine, service):
    # Almost no history (0 inflow, 0 outflow)
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=50000.0
    )
    start_date = datetime.date(2026, 7, 15)
    forecast = engine.generate_forecast(features, start_date=start_date)
    report = service.run_validation(features, forecast, start_date=start_date)
    
    assert report.confidence.confidence_level == "Low"
    assert report.validation.status == "FAIL"  # due to missing historical data error

def test_scenarios_and_sensitivity_rankings(engine, service):
    features = ForecastFeatures(
        daily_cash_inflow={"2026-07-10": 4500.0, "2026-07-12": 5200.0},
        daily_cash_outflow={"2026-07-11": 3100.0, "2026-07-13": 2900.0},
        historical_cash_balance={"2026-07-13": 75000.0},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-20", "total_amount": 12000.0, "partner_id": "c-sme"}
        ],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-25", "total_amount": 8000.0, "partner_id": "v-sme"}
        ],
        recurring_income=0.0,
        recurring_expenses=500.0,
        current_cash_balance=75000.0
    )
    start_date = datetime.date(2026, 7, 15)
    forecast = engine.generate_forecast(features, start_date=start_date)
    report = service.run_validation(features, forecast, start_date=start_date)

    # 1. Verify Scenarios
    scenarios = {s.scenario_name: s for s in report.scenario_results}
    assert "Base Case" in scenarios
    assert "Optimistic Case" in scenarios
    assert "Pessimistic Case" in scenarios
    assert "Customer Payment Delays (+14d)" in scenarios
    assert "Material Price Hikes (+20%)" in scenarios
    
    # Pessimistic buffer should be lower than Optimistic buffer
    assert scenarios["Pessimistic Case"].cash_buffer < scenarios["Optimistic Case"].cash_buffer

    # 2. Verify Sensitivities
    assert len(report.sensitivity_report) > 0
    # First ranked variable has the highest impact value
    assert report.sensitivity_report[0].ranking == 1
    assert report.sensitivity_report[0].impact >= report.sensitivity_report[-1].impact

def test_forecast_comparison(engine, service):
    features_prev = ForecastFeatures(
        daily_cash_inflow={"2026-07-10": 4500.0},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=50000.0
    )
    
    # Current has $10k more cash balance
    features_curr = ForecastFeatures(
        daily_cash_inflow={"2026-07-10": 4500.0},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=60000.0
    )

    start_date = datetime.date(2026, 7, 15)
    forecast_prev = engine.generate_forecast(features_prev, start_date=start_date)
    forecast_curr = engine.generate_forecast(features_curr, start_date=start_date)
    
    report = service.run_validation(
        features=features_curr,
        current_forecast=forecast_curr,
        previous_forecast=forecast_prev,
        start_date=start_date
    )
    
    # 90-day ending balance difference should be 10000.0
    assert report.comparison.status_change == "Improved"
    assert report.comparison.ending_balance_difference == 10000.0
    assert "outlook improved" in report.comparison.details.lower()

def test_validation_warnings_and_assumptions(engine, service):
    features = ForecastFeatures(
        daily_cash_inflow={"2026-07-10": 4500.0},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[
            {"invoice_number": "DUP-REF", "due_date": "2026-07-20", "total_amount": 5000.0, "partner_id": "c-1"},
            {"invoice_number": "DUP-REF", "due_date": "2026-07-22", "total_amount": 3000.0, "partner_id": "c-1"}
        ],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=-5000.0  # Overdraft
    )
    
    start_date = datetime.date(2026, 7, 15)
    forecast = engine.generate_forecast(features, start_date=start_date)
    report = service.run_validation(features, forecast, start_date=start_date)
    
    # Overdraft should trigger warning, DUP-REF should trigger warning
    assert report.validation.status == "WARNING"
    assert any("overdraft" in w.lower() for w in report.validation.warnings)
    assert any("duplicate" in w.lower() for w in report.validation.warnings)
    
    # Verify assumptions list has credit/buffer/recurring items
    assert len(report.assumptions) > 0
    categories = [a.category for a in report.assumptions]
    assert "Buffer" in categories
    assert "Credit" in categories
