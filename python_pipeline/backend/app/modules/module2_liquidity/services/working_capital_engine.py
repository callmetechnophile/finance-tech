from app.modules.module2_liquidity.schemas.working_capital_schema import WorkingCapital
from app.modules.module2_liquidity.utils.liquidity_constants import MINIMUM_WORKING_CAPITAL_RATIO

class WorkingCapitalEngine:
    """
    Evaluates current assets against current liabilities to compute working capital metrics.
    """

    def calculate_working_capital(self, current_cash: float, receivables_total: float, payables_total: float) -> WorkingCapital:
        # Assets: liquid cash + unpaid customer invoices
        current_assets = current_cash + receivables_total
        current_liabilities = payables_total

        net_wc = current_assets - current_liabilities
        
        # Prevent divide by zero
        if current_liabilities > 0:
            ratio = current_assets / current_liabilities
        else:
            ratio = 999.0 if current_assets > 0 else 1.0

        # Categorize health status based on ratios
        if ratio >= 2.0:
            health = "Excellent"
        elif ratio >= MINIMUM_WORKING_CAPITAL_RATIO:
            health = "Healthy"
        elif ratio >= 1.0:
            health = "Warning"
        else:
            health = "Critical"

        return WorkingCapital(
            current_assets=round(current_assets, 2),
            current_liabilities=round(current_liabilities, 2),
            net_working_capital=round(net_wc, 2),
            working_capital_ratio=round(ratio, 2),
            working_capital_health=health
        )
