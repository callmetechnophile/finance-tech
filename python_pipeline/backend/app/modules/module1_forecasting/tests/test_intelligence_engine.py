import pytest
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.services.intelligence_service import IntelligenceService

@pytest.fixture
def service():
    return IntelligenceService()

def test_revenue_growth_trend(service):
    # Historical credit inflows increasing week-over-week
    features = ForecastFeatures(
        daily_cash_inflow={
            "2026-07-01": 1000.0, "2026-07-02": 1100.0,
            "2026-07-08": 2000.0, "2026-07-09": 2200.0
        },
        daily_cash_outflow={},
        historical_cash_balance={"2026-07-09": 50000.0},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=50000.0
    )
    intel = service.run_analysis(features)
    
    assert len(intel.revenue_trends) == 1
    trend = intel.revenue_trends[0]
    assert trend.direction == "Increasing"
    assert trend.percentage_change > 0.0

def test_revenue_decline_trend(service):
    # Historical credit inflows decreasing week-over-week
    features = ForecastFeatures(
        daily_cash_inflow={
            "2026-07-01": 5000.0, "2026-07-02": 4500.0,
            "2026-07-08": 1000.0, "2026-07-09": 800.0
        },
        daily_cash_outflow={},
        historical_cash_balance={"2026-07-09": 50000.0},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=50000.0
    )
    intel = service.run_analysis(features)
    
    assert len(intel.revenue_trends) == 1
    trend = intel.revenue_trends[0]
    assert trend.direction == "Decreasing"
    assert trend.percentage_change < 0.0

def test_expense_spike_anomaly(service):
    # Historical outflow spike (mean: 1000, stddev: ~500, spike: 15000)
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={
            "2026-07-01": 1000.0, "2026-07-02": 1200.0,
            "2026-07-03": 900.0, "2026-07-04": 1100.0,
            "2026-07-05": 15000.0  # Spikes way above mean + 2*stddev
        },
        historical_cash_balance={"2026-07-05": 30000.0},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=30000.0
    )
    intel = service.run_analysis(features)
    
    # Anomaly engine should flag the daily outflow spike
    spikes = [a for a in intel.financial_anomalies if "spike" in a.reason.lower()]
    assert len(spikes) == 1
    assert spikes[0].severity == "Warning"
    assert spikes[0].impact == 15000.0

def test_duplicate_payments_anomaly(service):
    # Two identical active payables (matching vendor & amount)
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[
            {"invoice_number": "BILL-100", "due_date": "2026-07-20", "total_amount": 7500.0, "partner_id": "v-iron-works"},
            {"invoice_number": "BILL-101", "due_date": "2026-07-22", "total_amount": 7500.0, "partner_id": "v-iron-works"}
        ],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=40000.0
    )
    intel = service.run_analysis(features)
    
    dups = [a for a in intel.financial_anomalies if "duplicate" in a.reason.lower()]
    assert len(dups) == 1
    assert dups[0].severity == "Warning"
    assert dups[0].impact == 7500.0
    assert "BILL-100" in dups[0].affected_transaction

def test_large_receivables_delay_driver(service):
    # Overdue invoice of a large sum
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[
            {"invoice_number": "INV-CRIT", "due_date": "2026-07-10", "total_amount": 45000.0, "partner_id": "cust-big"}
        ],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=15000.0
    )
    intel = service.run_analysis(features)
    
    # Inflow driver should rank at the top
    assert len(intel.top_business_drivers) == 1
    driver = intel.top_business_drivers[0]
    assert driver.priority == "Critical"
    assert driver.impact_value == 45000.0
    assert driver.category == "Delayed Receivables"

    # Customer dependency risk check
    factors = [f for f in intel.forecast_factors if "concentration" in f.factor_name.lower()]
    assert len(factors) == 1
    assert factors[0].impact_level == "High"

def test_empty_dataset(service):
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
    intel = service.run_analysis(features)
    
    assert len(intel.top_business_drivers) == 0
    assert len(intel.forecast_factors) == 0
    assert len(intel.financial_anomalies) == 0
    assert intel.overall_risk_level == "Low"
