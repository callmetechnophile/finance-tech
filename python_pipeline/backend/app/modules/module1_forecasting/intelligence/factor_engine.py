from typing import List, Dict
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.factor_schema import ForecastFactor

class FactorEngine:
    """
    Evaluates concentration risks, dependency indexes, and structural balance shifts.
    """

    def analyze_factors(self, features: ForecastFeatures) -> List[ForecastFactor]:
        factors: List[ForecastFactor] = []

        total_rec = sum(r["total_amount"] for r in features.receivables)
        total_pay = sum(p["total_amount"] for p in features.payables)

        # 1. Customer Concentration Risk
        if total_rec > 0:
            cust_shares: Dict[str, float] = {}
            for r in features.receivables:
                cust = r.get("partner_id", "Unknown")
                cust_shares[cust] = cust_shares.get(cust, 0.0) + r["total_amount"]
                
            for cust, amt in cust_shares.items():
                share = amt / total_rec
                if share > 0.4:
                    factors.append(ForecastFactor(
                        factor_name="High Customer Concentration Risk",
                        impact_value=amt,
                        impact_level="High",
                        description=f"Customer '{cust}' represents {share:.1%} of total outstanding receivables (${total_rec:,.2f}).",
                        source="Receivables Ledger"
                    ))

        # 2. Vendor Concentration Risk
        if total_pay > 0:
            vend_shares: Dict[str, float] = {}
            for p in features.payables:
                vend = p.get("partner_id", "Unknown")
                vend_shares[vend] = vend_shares.get(vend, 0.0) + p["total_amount"]
                
            for vend, amt in vend_shares.items():
                share = amt / total_pay
                if share > 0.4:
                    factors.append(ForecastFactor(
                        factor_name="High Vendor Concentration Risk",
                        impact_value=-amt,
                        impact_level="Medium",
                        description=f"Vendor '{vend}' represents {share:.1%} of total outstanding liabilities (${total_pay:,.2f}).",
                        source="Payables Ledger"
                    ))

        # 3. Delayed Receivables
        # Assume due_date is in past compared to a reference date (e.g. today's date)
        # For this milestone, we count the receivables that have due dates in the past
        today_str = "2026-07-15" # Mock timeline start date
        delayed_amt = 0.0
        for r in features.receivables:
            if r["due_date"] < today_str:
                delayed_amt += r["total_amount"]
                
        if delayed_amt > 0:
            factors.append(ForecastFactor(
                factor_name="Delayed Customer Receivables",
                impact_value=-delayed_amt,
                impact_level="High" if delayed_amt > 15000.0 else "Medium",
                description=f"An amount of ${delayed_amt:,.2f} is past due, restricting liquid cash conversion speed.",
                source="Aging Schedule"
            ))

        # 4. Burn Rate Factor (recurring costs exceed recurring income)
        if features.recurring_expenses > features.recurring_income:
            net_burn = (features.recurring_expenses - features.recurring_income) * 30.0
            factors.append(ForecastFactor(
                factor_name="Negative Structural Burn Rate",
                impact_value=-net_burn,
                impact_level="High" if net_burn > 10000.0 else "Medium",
                description=f"Fixed monthly overheads exceed fixed monthly credit retainer terms by ${net_burn:,.2f}.",
                source="Recurring templates"
            ))

        return factors
