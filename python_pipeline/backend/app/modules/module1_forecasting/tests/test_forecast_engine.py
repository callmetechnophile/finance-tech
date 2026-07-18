import pytest
import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.services.forecast_engine import ForecastEngine

@pytest.fixture
def engine():
    return ForecastEngine()

def test_empty_dataset(engine):
    # Setup completely empty features
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=10000.0
    )
    
    start_date = datetime.date(2026, 7, 15)
    response = engine.generate_forecast(features, start_date=start_date)
    
    # Confirm starting balance persists across all days (since inflow and outflow are 0)
    assert len(response.forecast_days) == 90
    for day in response.forecast_days:
        assert day.projected_balance == 10000.0
        assert day.projected_inflow == 0.0
        assert day.projected_outflow == 0.0

def test_only_revenue(engine):
    # Setup features with customer receivables and recurring credit only
    start_date = datetime.date(2026, 7, 15)
    features = ForecastFeatures(
        daily_cash_inflow={"2026-07-14": 1000.0},
        daily_cash_outflow={},
        historical_cash_balance={"2026-07-14": 50000.0},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-17", "total_amount": 5000.0, "category": "Direct Revenue", "partner_id": "cust-1"}
        ],
        payables=[],
        recurring_income=500.0,
        recurring_expenses=0.0,
        current_cash_balance=50000.0
    )
    
    response = engine.generate_forecast(features, start_date=start_date)
    
    # Day 1: 2026-07-16
    # Inflow: recurring (500) + rolling avg of history (1000) = 1500
    # Outflow: 0
    # Balance: 50000 + 1500 = 51500
    day1 = response.forecast_days[0]
    assert day1.forecast_date == "2026-07-16"
    assert day1.projected_inflow == 1500.0
    assert day1.projected_outflow == 0.0
    assert day1.projected_balance == 51500.0
    
    # Day 2: 2026-07-17
    # Inflow: receivable (5000) + recurring (500) + rolling avg (1000) = 6500
    # Balance: 51500 + 6500 = 58000
    day2 = response.forecast_days[1]
    assert day2.forecast_date == "2026-07-17"
    assert day2.projected_balance == 58000.0

def test_only_expenses(engine):
    # Setup features with vendor bills and recurring debits only
    start_date = datetime.date(2026, 7, 15)
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={"2026-07-14": 2000.0},
        historical_cash_balance={"2026-07-14": 50000.0},
        receivables=[],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-18", "total_amount": 10000.0, "category": "Steel Purchase", "partner_id": "vend-1"}
        ],
        recurring_income=0.0,
        recurring_expenses=1000.0,
        current_cash_balance=50000.0
    )
    
    response = engine.generate_forecast(features, start_date=start_date)
    
    # Daily variable outflow: rolling average of [2000] = 2000
    # Daily recurring: 1000
    # Day 1 (2026-07-16): Outflow = 3000. Balance = 50000 - 3000 = 47000.
    assert response.forecast_days[0].projected_outflow == 3000.0
    assert response.forecast_days[0].projected_balance == 47000.0
    
    # Day 3 (2026-07-18): Outflow = 10000 (payable due) + 2000 (var) + 1000 (rec) = 13000.
    # Balances: Day 1 (47000) -> Day 2 (44000) -> Day 3 (44000 - 13000 = 31000).
    assert response.forecast_days[2].forecast_date == "2026-07-18"
    assert response.forecast_days[2].projected_balance == 31000.0

def test_mixed_cash_flow(engine):
    start_date = datetime.date(2026, 7, 15)
    features = ForecastFeatures(
        daily_cash_inflow={"2026-07-14": 3000.0},
        daily_cash_outflow={"2026-07-14": 2000.0},
        historical_cash_balance={"2026-07-14": 40000.0},
        receivables=[
            {"invoice_number": "R-1", "due_date": "2026-07-17", "total_amount": 5000.0, "category": "Service Fee", "partner_id": "c-1"}
        ],
        payables=[
            {"invoice_number": "P-1", "due_date": "2026-07-17", "total_amount": 4000.0, "category": "Rent", "partner_id": "v-1"}
        ],
        recurring_income=100.0,
        recurring_expenses=200.0,
        current_cash_balance=40000.0
    )
    
    response = engine.generate_forecast(features, start_date=start_date)
    
    # Day 1 (2026-07-16):
    # Inflow: 3000 + 100 = 3100
    # Outflow: 2000 + 200 = 2200
    # Balance: 40000 + 3100 - 2200 = 40900
    assert response.forecast_days[0].projected_balance == 40900.0
    
    # Day 2 (2026-07-17):
    # Inflow: 3000 + 100 + 5000 = 8100
    # Outflow: 2000 + 200 + 4000 = 6200
    # Balance: 40900 + 8100 - 6200 = 42800
    assert response.forecast_days[1].projected_balance == 42800.0

def test_negative_cash_balance(engine):
    # Large starting debt or massive expense driving balance negative
    start_date = datetime.date(2026, 7, 15)
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[],
        payables=[
            {"invoice_number": "P-Big", "due_date": "2026-07-16", "total_amount": 15000.0, "category": "CNC Machine", "partner_id": "v-2"}
        ],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=5000.0
    )
    
    response = engine.generate_forecast(features, start_date=start_date)
    # Day 1 (2026-07-16): Balance = 5000 - 15000 = -10000
    assert response.forecast_days[0].projected_balance == -10000.0
    # Cash Buffer safety index should drop negative: -10000 - 10000 (DEFAULT_CASH_BUFFER) = -20000
    assert response.forecast_days[0].cash_buffer == -20000.0

def test_large_receivables_and_payables(engine):
    start_date = datetime.date(2026, 7, 15)
    features = ForecastFeatures(
        daily_cash_inflow={},
        daily_cash_outflow={},
        historical_cash_balance={},
        receivables=[
            {"invoice_number": "Big-R", "due_date": "2026-07-20", "total_amount": 500000.0, "category": "CNC Milling Run", "partner_id": "c-3"}
        ],
        payables=[
            {"invoice_number": "Big-P", "due_date": "2026-07-22", "total_amount": 300000.0, "category": "Steel Materials", "partner_id": "v-3"}
        ],
        recurring_income=0.0,
        recurring_expenses=0.0,
        current_cash_balance=100000.0
    )
    
    response = engine.generate_forecast(features, start_date=start_date)
    
    # Prior to July 20, balance is 100000.0
    assert response.forecast_days[0].projected_balance == 100000.0
    
    # On July 20 (Day 5), balance increases to 600000.0
    day_5 = [d for d in response.forecast_days if d.forecast_date == "2026-07-20"][0]
    assert day_5.projected_balance == 600000.0
    
    # On July 22 (Day 7), balance drops to 600000 - 300000 = 300000.0
    day_7 = [d for d in response.forecast_days if d.forecast_date == "2026-07-22"][0]
    assert day_7.projected_balance == 300000.0

def test_sme_sample_data(engine):
    # Manufacturing SME sample setup simulating CNC job shop
    start_date = datetime.date(2026, 7, 15)
    features = ForecastFeatures(
        daily_cash_inflow={"2026-07-10": 4500.0, "2026-07-12": 5200.0},
        daily_cash_outflow={"2026-07-11": 3100.0, "2026-07-13": 2900.0},
        historical_cash_balance={"2026-07-13": 75000.0},
        receivables=[
            {"invoice_number": "CNC-099", "due_date": "2026-07-20", "total_amount": 12000.0, "category": "Fabrication Retainer", "partner_id": "c-sme"},
            {"invoice_number": "CNC-100", "due_date": "2026-08-10", "total_amount": 25000.0, "category": "Laser Cut Shipment", "partner_id": "c-sme"}
        ],
        payables=[
            {"invoice_number": "MAT-004", "due_date": "2026-07-25", "total_amount": 8000.0, "category": "Aluminum Plate Stock", "partner_id": "v-sme"}
        ],
        recurring_income=0.0,
        recurring_expenses=500.0, # e.g. Factory electricity daily amortized
        current_cash_balance=75000.0
    )
    
    response = engine.generate_forecast(features, start_date=start_date)
    
    # Check outputs structural formatting
    assert response.summary.horizon_7_day_balance > 0
    assert response.summary.horizon_30_day_balance > 0
    assert response.summary.horizon_90_day_balance > 0
    assert response.metadata.company_id == "apex-manufacturing-uuid"
    assert len(response.forecast_days) == 90
