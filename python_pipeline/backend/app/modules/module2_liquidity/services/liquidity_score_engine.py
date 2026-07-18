from app.modules.module2_liquidity.schemas.liquidity_score_schema import LiquidityScore
from app.modules.module2_liquidity.utils.liquidity_constants import LIQUIDITY_SCORE_THRESHOLDS

class LiquidityScoreEngine:
    """
    Computes a weighted liquidity score index (0 to 100) mapping cash runways, margins, and concentration ratios.
    """

    def calculate_score(
        self, 
        buffer_days: float, 
        wc_ratio: float, 
        receivable_delay_ratio: float, 
        payable_ratio: float, 
        burn_income_ratio: float
    ) -> LiquidityScore:
        
        # 1. Cash Buffer Score (Weight: 30%)
        if buffer_days >= 60.0:
            cb_score = 30.0
        elif buffer_days >= 30.0:
            cb_score = 24.0
        elif buffer_days >= 15.0:
            cb_score = 15.0
        elif buffer_days > 0.0:
            cb_score = 6.0
        else:
            cb_score = 0.0

        # 2. Working Capital Score (Weight: 25%)
        if wc_ratio >= 2.0:
            wc_score = 25.0
        elif wc_ratio >= 1.2:
            wc_score = 20.0
        elif wc_ratio >= 1.0:
            wc_score = 12.5
        else:
            wc_score = 2.5

        # 3. Receivables Health Score (Weight: 15%)
        # Lower delay ratio yields a higher score
        if receivable_delay_ratio <= 0.05:
            rec_score = 15.0
        elif receivable_delay_ratio <= 0.20:
            rec_score = 12.0
        elif receivable_delay_ratio <= 0.50:
            rec_score = 7.5
        else:
            rec_score = 1.5

        # 4. Payables Health Score (Weight: 15%)
        # Lower payable ratio yields a higher score
        if payable_ratio <= 0.20:
            pay_score = 15.0
        elif payable_ratio <= 0.50:
            pay_score = 12.0
        elif payable_ratio <= 1.00:
            pay_score = 7.5
        else:
            pay_score = 1.5

        # 5. Burn Rate Score (Weight: 15%)
        # Structural balance score
        if burn_income_ratio >= 1.0:
            br_score = 15.0
        elif burn_income_ratio >= 0.8:
            br_score = 12.0
        elif burn_income_ratio >= 0.5:
            br_score = 7.5
        else:
            br_score = 1.5

        final_score = cb_score + wc_score + rec_score + pay_score + br_score
        
        # Categorize classification
        classification = "Critical"
        for label, threshold in sorted(LIQUIDITY_SCORE_THRESHOLDS.items(), key=lambda x: x[1], reverse=True):
            if final_score >= threshold:
                classification = label
                break

        return LiquidityScore(
            final_score=round(final_score, 1),
            classification=classification,
            cash_buffer_score=cb_score,
            working_capital_score=wc_score,
            receivables_score=rec_score,
            payables_score=pay_score,
            burn_rate_score=br_score
        )
