from typing import List
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.forecast_output import ForecastResult
from app.modules.module1_forecasting.schemas.validation_schema import ValidationReport

class ValidationEngine:
    """
    Scans forecast features and daily projection days to verify data integrity and consistency.
    """

    def validate_forecast(self, features: ForecastFeatures, forecast_days: List[ForecastResult]) -> ValidationReport:
        errors: List[str] = []
        warnings: List[str] = []
        recommendations: List[str] = []

        # 1. Validate features data completeness
        inflow_count = len(features.daily_cash_inflow)
        outflow_count = len(features.daily_cash_outflow)

        if inflow_count == 0 and outflow_count == 0:
            errors.append("Critical Data Missing: Historical transaction ledgers are completely empty.")
        elif inflow_count < 3:
            warnings.append("Insufficient transaction history: Inflow historical data points are low (<3).")
            recommendations.append("Ensure additional customer payment receipts are uploaded to improve forecast reliability.")

        # 2. Check for negative bank balance override starting point
        if features.current_cash_balance < 0:
            warnings.append("Starting cash position is negative (overdraft).")
            recommendations.append("Prioritize collecting overdue accounts receivables immediately to cover starting liability.")

        # 3. Scan daily projected days
        has_negative_balance = False
        max_daily_inflow_observed = 0.0
        
        for d in forecast_days:
            if d.projected_balance < 0:
                has_negative_balance = True
            if d.projected_inflow > max_daily_inflow_observed:
                max_daily_inflow_observed = d.projected_inflow

        if has_negative_balance:
            warnings.append("Projected cash balance falls below zero during the forecast window.")
            recommendations.append("Review scheduled vendor payments and delay non-essential material orders to preserve liquidity.")

        # 4. Scan for duplicate invoice references in outstanding lists
        seen_receivables = set()
        for r in features.receivables:
            ref = r["invoice_number"]
            if ref in seen_receivables:
                warnings.append(f"Duplicate customer invoice reference detected: '{ref}'")
            seen_receivables.add(ref)

        # 5. Determine overall validation status
        if len(errors) > 0:
            status = "FAIL"
        elif len(warnings) > 0:
            status = "WARNING"
        else:
            status = "PASS"
            recommendations.append("Projections pass all automated consistency validations.")

        return ValidationReport(
            status=status,
            errors=errors,
            warnings=warnings,
            recommendations=recommendations
        )
