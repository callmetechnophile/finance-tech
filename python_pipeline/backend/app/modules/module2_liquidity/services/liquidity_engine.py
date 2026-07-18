from typing import List
from app.modules.module2_liquidity.schemas.working_capital_schema import WorkingCapital
from app.modules.module2_liquidity.schemas.liquidity_score_schema import LiquidityScore
from app.modules.module2_liquidity.schemas.liquidity_feature_schema import LiquidityFeatures
from app.modules.module2_liquidity.utils.liquidity_constants import RISK_LEVEL_THRESHOLDS

class LiquidityEngine:
    """
    Evaluates liquidity risk levels and identifies contributing factors based on core indicators.
    """

    def analyze_risk(
        self, 
        score: LiquidityScore, 
        features: LiquidityFeatures, 
        working_capital: WorkingCapital,
        buffer_days: float,
        receivable_delay_ratio: float,
        payable_ratio: float
    ) -> tuple[str, List[str]]:
        
        # Determine risk level based on final score thresholds
        risk_level = "Critical"
        for label, threshold in sorted(RISK_LEVEL_THRESHOLDS.items(), key=lambda x: x[1], reverse=True):
            if score.final_score >= threshold:
                risk_level = label
                break

        # Map contributing factors deterministically (no recommendations, only observations)
        factors = []
        if buffer_days < 30.0:
            factors.append(f"Short operating cash runway: Projected reserves cover only {buffer_days:.1f} days of operations.")
        if working_capital.working_capital_health == "Critical":
            factors.append("Severe working capital deficit: Current liabilities exceed current assets.")
        if receivable_delay_ratio > 0.40:
            factors.append(f"High customer payment delay: {receivable_delay_ratio:.1%} of receivables are past due.")
        if payable_ratio > 1.00:
            factors.append("Overwhelming accounts payable: Short-term supplier liabilities exceed liquid cash reserves.")
        if score.burn_rate_score <= 1.5:
            factors.append("Negative structural cash balance shift: Fixed recurring expenses exceed credit retainers.")
        if features.current_cash < features.safety_buffer:
            factors.append(f"Liquidity below safety threshold target: Current cash lacks safety reserve by ${features.safety_buffer - features.current_cash:,.2f}.")

        return risk_level, factors
