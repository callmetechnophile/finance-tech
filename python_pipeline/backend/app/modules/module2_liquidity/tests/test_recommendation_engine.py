import pytest
import datetime
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures as M1Features
from app.modules.module2_liquidity.schemas.liquidity_report_schema import LiquidityIntelligence
from app.modules.module2_liquidity.schemas.runway_report_schema import LiquidityScenarioReport
from app.modules.module2_liquidity.schemas.scenario_schema import StressScenarioResult
from app.modules.module2_liquidity.schemas.runway_schema import RunwayReport
from app.modules.module2_liquidity.services.recommendation_service import RecommendationService

@pytest.fixture
def service():
    return RecommendationService()

def mock_scenario_report(gst_risk: str = "Low") -> LiquidityScenarioReport:
    base = StressScenarioResult("Base Case", 50000.0, 45000.0, 1.5, 80.0, 45.0, "Low")
    opt = StressScenarioResult("Optimistic Case", 60000.0, 55000.0, 1.8, 90.0, 60.0, "Very Low")
    pess = StressScenarioResult("Pessimistic Case", 30000.0, 25000.0, 0.9, 45.0, 20.0, "High")
    
    gst_res = StressScenarioResult("GST Payment Settlement Outflow", 25000.0, 20000.0, 0.8, 40.0, 15.0, gst_risk)
    
    runway = RunwayReport(45.0, 50000.0, 100.0, "Stable", 30, 1000.0)
    
    return LiquidityScenarioReport(
        base_case=base,
        optimistic_case=opt,
        pessimistic_case=pess,
        stress_test_results=[gst_res],
        cash_runway=runway,
        scenario_rankings=[opt, base, pess, gst_res]
    )

def test_healthy_company_recommendations(service):
    # High cash, low risks
    intel = LiquidityIntelligence(
        company_id="apex-manufacturing-uuid",
        generated_timestamp="2026-07-15T00:00:00Z",
        current_cash=100000.0,
        working_capital=80000.0,
        working_capital_ratio=2.5,
        burn_rate=3000.0,
        cash_buffer=15000.0,
        buffer_days=90.0,
        liquidity_score=95.0,
        liquidity_level="Excellent",
        risk_level="Very Low",
        receivable_ratio=0.0,
        payable_ratio=0.0,
        cash_conversion_cycle=40.0,
        contributing_factors=[]
    )
    
    report = service.generate_recommendation_report(intel, mock_scenario_report())
    
    # Healthy company should get "Maintain Current Strategy"
    assert len(report.recommendations) == 1
    assert report.recommendations[0].recommendation_id == "REC-MAINTAIN-STRATEGY"
    assert report.overall_health_status == "Excellent"

def test_critical_liquidity_recommendations(service):
    # Very low cash buffer days runway
    intel = LiquidityIntelligence(
        company_id="apex-manufacturing-uuid",
        generated_timestamp="2026-07-15T00:00:00Z",
        current_cash=5000.0,
        working_capital=2000.0,
        working_capital_ratio=1.1,
        burn_rate=9000.0,
        cash_buffer=15000.0,
        buffer_days=15.0,  # critical low runway <30d
        liquidity_score=40.0,
        liquidity_level="Critical",
        risk_level="Critical",
        receivable_ratio=0.80,
        payable_ratio=0.90,
        cash_conversion_cycle=45.0,
        contributing_factors=["Short operating cash runway"]
    )
    
    report = service.generate_recommendation_report(intel, mock_scenario_report(gst_risk="High"))
    
    # Confirm Critical priority actions generated
    assert len(report.recommendations) > 0
    assert report.priority_matrix.critical_count > 0
    assert "REC-COLLECT-RECEIVABLES" in report.priority_matrix.ranked_ids
    assert "REC-PAUSE-CAPEX" in report.priority_matrix.ranked_ids
    
    # Confirm Early warning generated for runway below 30 days
    runway_warnings = [w for w in report.early_warnings if w.category == "Runway"]
    assert len(runway_warnings) == 1
    assert runway_warnings[0].severity == "Critical"
    
    # GST warning should be active due to High gst risk
    gst_warnings = [w for w in report.early_warnings if w.category == "GST"]
    assert len(gst_warnings) == 1

def test_receivables_concentration_risk(service):
    intel = LiquidityIntelligence(
        company_id="apex-manufacturing-uuid",
        generated_timestamp="2026-07-15T00:00:00Z",
        current_cash=50000.0,
        working_capital=40000.0,
        working_capital_ratio=1.5,
        burn_rate=3000.0,
        cash_buffer=12000.0,
        buffer_days=45.0,
        liquidity_score=75.0,
        liquidity_level="Healthy",
        risk_level="Low",
        receivable_ratio=0.40,
        payable_ratio=0.10,
        cash_conversion_cycle=40.0,
        contributing_factors=["High customer concentration risk detected"]
    )
    
    report = service.generate_recommendation_report(intel, mock_scenario_report())
    
    # Should recommend Diversify Customers
    assert any(r.recommendation_id == "REC-DIVERSIFY-CUSTOMERS" for r in report.recommendations)
    assert any(w.warning_id == "WARN-CUST-CONCENTRATION" for w in report.early_warnings)

def test_conflict_resolution_and_validation(service):
    # Overdrawn and low cash
    intel = LiquidityIntelligence(
        company_id="apex-manufacturing-uuid",
        generated_timestamp="2026-07-15T00:00:00Z",
        current_cash=2000.0,
        working_capital=-5000.0,
        working_capital_ratio=0.5,
        burn_rate=9000.0,
        cash_buffer=12000.0,
        buffer_days=6.0,
        liquidity_score=20.0,
        liquidity_level="Critical",
        risk_level="Critical",
        receivable_ratio=0.80,
        payable_ratio=2.50,
        cash_conversion_cycle=45.0,
        contributing_factors=["Severe working capital deficit", "Short operating cash runway"]
    )
    
    report = service.generate_recommendation_report(intel, mock_scenario_report())
    
    # Validator should filter out Early Payment Discounts (due to low cash)
    assert not any(r.recommendation_id == "REC-EARLY-PAYMENT-DISCOUNTS" for r in report.recommendations)
    # Validator should filter out Maintain Strategy
    assert not any(r.recommendation_id == "REC-MAINTAIN-STRATEGY" for r in report.recommendations)

def test_action_plan_chronology(service):
    intel = LiquidityIntelligence(
        company_id="apex-manufacturing-uuid",
        generated_timestamp="2026-07-15T00:00:00Z",
        current_cash=5000.0,
        working_capital=2000.0,
        working_capital_ratio=1.1,
        burn_rate=9000.0,
        cash_buffer=15000.0,
        buffer_days=15.0,
        liquidity_score=40.0,
        liquidity_level="Critical",
        risk_level="Critical",
        receivable_ratio=0.80,
        payable_ratio=0.90,
        cash_conversion_cycle=45.0,
        contributing_factors=["Short operating cash runway"]
    )
    
    report = service.generate_recommendation_report(intel, mock_scenario_report())
    
    # Verify action plan categories are filled correctly
    assert len(report.action_plan.immediate_actions) > 0 # Critical ones
    assert len(report.critical_actions) == len(report.action_plan.immediate_actions)
    assert report.critical_actions[0] == report.action_plan.immediate_actions[0].title
