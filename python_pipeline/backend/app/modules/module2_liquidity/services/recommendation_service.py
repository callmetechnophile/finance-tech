import datetime
from dataclasses import dataclass, field
from typing import List
from app.modules.module2_liquidity.schemas.recommendation_schema import LiquidityRecommendation
from app.modules.module2_liquidity.schemas.warning_schema import EarlyWarning
from app.modules.module2_liquidity.schemas.priority_schema import PriorityMatrix
from app.modules.module2_liquidity.schemas.action_plan_schema import ActionPlan
from app.modules.module2_liquidity.schemas.liquidity_report_schema import LiquidityIntelligence
from app.modules.module2_liquidity.schemas.runway_report_schema import LiquidityScenarioReport
from app.modules.module2_liquidity.services.recommendation_engine import RecommendationEngine
from app.modules.module2_liquidity.services.priority_engine import PriorityEngine
from app.modules.module2_liquidity.services.early_warning_engine import EarlyWarningEngine
from app.modules.module2_liquidity.services.recommendation_validator import RecommendationValidator

@dataclass
class LiquidityRecommendationReport:
    """
    Consolidated recommendation report containing warnings, priorities, and action plans.
    """
    company_id: str
    generated_timestamp: str
    liquidity_score: float
    cash_runway: float
    overall_risk: str
    recommendations: List[LiquidityRecommendation] = field(default_factory=list)
    early_warnings: List[EarlyWarning] = field(default_factory=list)
    priority_matrix: PriorityMatrix = None
    action_plan: ActionPlan = None
    critical_actions: List[str] = field(default_factory=list)
    approval_required: List[str] = field(default_factory=list)
    overall_health_status: str = "Healthy"

class RecommendationService:
    """
    Orchestration layer coordinating business recommendation and early warning engines.
    """

    def __init__(self):
        self.rec_engine = RecommendationEngine()
        self.priority_engine = PriorityEngine()
        self.warning_engine = EarlyWarningEngine()
        self.validator = RecommendationValidator()

    def generate_recommendation_report(
        self,
        liq_intel: LiquidityIntelligence,
        stress_report: LiquidityScenarioReport
    ) -> LiquidityRecommendationReport:
        
        # 1. Parse trigger factors from inputs
        has_concentration = any("concentration" in f.lower() for f in liq_intel.contributing_factors)
        
        gst_risk = False
        for s in stress_report.stress_test_results:
            if "gst" in s.scenario_name.lower() and s.risk_level in ["Critical", "High"]:
                gst_risk = True
                
        # Calculate receivables delay ratio from features
        # Mock calculation: if there's concentration risk or low runway, trigger delay values
        rec_delay_ratio = 0.50 if has_concentration else 0.10

        # Calculate burn rate income ratio
        # Assuming typical recurring variables
        burn_income_ratio = 0.50 if liq_intel.risk_level in ["Critical", "High"] else 1.0

        # Estimate assets / liabilities ratios
        total_rec = liq_intel.current_cash * liq_intel.receivable_ratio
        total_pay = liq_intel.current_cash * liq_intel.payable_ratio

        # 2. Generate raw recommendations
        raw_recs = self.rec_engine.generate_recommendations(
            current_cash=liq_intel.current_cash,
            buffer_days=liq_intel.buffer_days,
            liquidity_score=liq_intel.liquidity_score,
            wc_ratio=liq_intel.working_capital_ratio,
            receivable_delay_ratio=rec_delay_ratio,
            payable_ratio=liq_intel.payable_ratio,
            burn_income_ratio=burn_income_ratio,
            total_receivables=total_rec,
            total_payables=total_pay,
            has_concentration_risk=has_concentration
        )

        # 3. Validate recommendations
        validated_recs = self.validator.validate_recommendations(raw_recs)

        # 4. Priority Rank recommendations
        ranked_recs, matrix = self.priority_engine.rank_recommendations(validated_recs)

        # 5. Generate Early Warnings
        safety_buffer_val = liq_intel.cash_buffer  # emergency reserve limit
        warnings = self.warning_engine.generate_warnings(
            current_cash=liq_intel.current_cash,
            buffer_days=liq_intel.buffer_days,
            wc_ratio=liq_intel.working_capital_ratio,
            receivable_delay_ratio=rec_delay_ratio,
            payable_ratio=liq_intel.payable_ratio,
            safety_buffer=safety_buffer_val,
            has_concentration_risk=has_concentration,
            gst_risk_present=gst_risk
        )

        # 6. Parse actions into chronological plan categories
        immediate = [r for r in ranked_recs if r.urgency == "Critical"]
        week = [r for r in ranked_recs if r.urgency == "High"]
        month = [r for r in ranked_recs if r.urgency == "Medium"]
        mon = [r for r in ranked_recs if r.urgency == "Low" and r.category == "Strategy"]
        opp = [r for r in ranked_recs if r.urgency == "Low" and r.category != "Strategy"]
        
        # Approval needed: high-risk elements with significant impacts or operational freezes
        approval = [r for r in ranked_recs if r.estimated_risk != "None" and r.urgency in ["Critical", "High"]]

        plan = ActionPlan(
            immediate_actions=immediate,
            this_week=week,
            this_month=month,
            monitor=mon,
            manager_approval_required=approval,
            future_opportunities=opp
        )

        return LiquidityRecommendationReport(
            company_id=liq_intel.company_id,
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            liquidity_score=liq_intel.liquidity_score,
            cash_runway=liq_intel.buffer_days,
            overall_risk=liq_intel.risk_level,
            recommendations=ranked_recs,
            early_warnings=warnings,
            priority_matrix=matrix,
            action_plan=plan,
            critical_actions=[r.title for r in immediate],
            approval_required=[r.title for r in approval],
            overall_health_status=liq_intel.liquidity_level
        )
