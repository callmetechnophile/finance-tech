from typing import List
from app.modules.module2_liquidity.schemas.recommendation_schema import LiquidityRecommendation

class RecommendationEngine:
    """
    Evaluates core liquidity metrics and issues deterministic, structured cash management recommendations.
    """

    def generate_recommendations(
        self,
        current_cash: float,
        buffer_days: float,
        liquidity_score: float,
        wc_ratio: float,
        receivable_delay_ratio: float,
        payable_ratio: float,
        burn_income_ratio: float,
        total_receivables: float,
        total_payables: float,
        has_concentration_risk: bool = False
    ) -> List[LiquidityRecommendation]:
        
        recs: List[LiquidityRecommendation] = []

        # Rule 1: Operating Runway is low (<30 days)
        if buffer_days < 30.0:
            recs.append(LiquidityRecommendation(
                recommendation_id="REC-COLLECT-RECEIVABLES",
                title="Accelerate Outstanding Customer Collections",
                description="The company's operating cash runway is critically low. Prioritize collecting overdue invoices.",
                reason=f"Current runway covers only {buffer_days:.1f} days of operations compared to a 30-day safe limit.",
                expected_financial_impact=round(total_receivables * 0.5, 2),
                urgency="Critical",
                category="Accounts Receivable",
                estimated_benefit="High cash velocity inflow",
                estimated_risk="Potential client friction",
                required_action="Initiate direct collection emails and follow up on customer accounts past due."
            ))
            
            recs.append(LiquidityRecommendation(
                recommendation_id="REC-PAUSE-CAPEX",
                title="Pause All Non-Critical Capital Expenditures",
                description="Immediately freeze planned machine acquisitions and structural additions to preserve cash.",
                reason="Operating cash levels are below standard buffer limits.",
                expected_financial_impact=8000.0,
                urgency="Critical",
                category="CapEx",
                estimated_benefit="Preserves immediate cash reserves",
                estimated_risk="Delayed factory expansion",
                required_action="Suspend pending purchase requests for machine upgrades and logistics improvements."
            ))

        # Rule 2: Low Liquidity Score and Negative Working Capital
        if liquidity_score < 50.0 and wc_ratio < 1.0:
            recs.append(LiquidityRecommendation(
                recommendation_id="REC-PAUSE-SPENDING",
                title="Pause Discretionary and Non-Critical Spending",
                description="Reduce daily overhead and administrative operational costs to ease the cash drain.",
                reason=f"Liquidity score is warning at {liquidity_score} and liabilities exceed current assets.",
                expected_financial_impact=5000.0,
                urgency="High",
                category="Overheads",
                estimated_benefit="Reduces structural burn rate",
                estimated_risk="Minor operational friction",
                required_action="Suspend travel, non-essential audits, and delay software renewals that aren't critical."
            ))

        # Rule 3: Customer dependency concentration risk >45%
        if has_concentration_risk:
            recs.append(LiquidityRecommendation(
                recommendation_id="REC-DIVERSIFY-CUSTOMERS",
                title="Diversify Customer Dependency Exposure",
                description="Settle dependency ratios by adding new buyer contracts and client retainers.",
                reason="A single primary client represents >40% of outstanding accounts receivable.",
                expected_financial_impact=0.0,
                urgency="Medium",
                category="Strategy",
                estimated_benefit="Reduces credit default threat",
                estimated_risk="Requires sales resources",
                required_action="Instruct sales management to secure secondary buyer accounts and diversify revenue sources."
            ))

        # Rule 4: Vendor invoice early payment (runway is high and cash buffer sufficient)
        if buffer_days >= 45.0 and payable_ratio < 0.30 and total_payables > 1000.0:
            recs.append(LiquidityRecommendation(
                recommendation_id="REC-EARLY-PAYMENT-DISCOUNTS",
                title="Negotiate Early Payment Discounts",
                description="Pay key suppliers ahead of schedule in exchange for discount terms.",
                reason=f"Operating runway is healthy at {buffer_days:.1f} days, and short-term payables are low.",
                expected_financial_impact=round(total_payables * 0.02, 2),
                urgency="Low",
                category="Accounts Payable",
                estimated_benefit="Reduces cost of raw materials",
                estimated_risk="Negligible cash runway drop",
                required_action="Contact raw materials suppliers offering settling of bills within 5 days for 2% discounts."
            ))

        # Rule 5: Healthy company baseline strategy
        if buffer_days >= 90.0 and liquidity_score >= 85.0 and len(recs) == 0:
            recs.append(LiquidityRecommendation(
                recommendation_id="REC-MAINTAIN-STRATEGY",
                title="Maintain Current Allocation Strategy",
                description="Operational margins and runway coverage show excellent health. Maintain buffer allocation.",
                reason="Runway exceeds 90 days and liquidity score is excellent.",
                expected_financial_impact=0.0,
                urgency="Low",
                category="Strategy",
                estimated_benefit="Stable risk structure",
                estimated_risk="None",
                required_action="Continue daily balance sweeps and maintain normal payables schedule."
            ))

        return recs
