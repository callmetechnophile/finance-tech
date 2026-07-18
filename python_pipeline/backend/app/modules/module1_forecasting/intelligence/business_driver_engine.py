from typing import List, Dict, Any
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from app.modules.module1_forecasting.schemas.business_driver_schema import BusinessDriver

class BusinessDriverEngine:
    """
    Ranks the primary drivers affecting projected manufacturing cash flows (receivables, payroll, large payables).
    """

    def analyze_drivers(self, features: ForecastFeatures) -> List[BusinessDriver]:
        drivers: List[BusinessDriver] = []

        # 1. Evaluate accounts receivables (outstanding customer invoices)
        for r in features.receivables:
            amount = r["total_amount"]
            due_str = r["due_date"]
            inv_no = r["invoice_number"]
            
            # Determine if past due or large
            priority = "Medium"
            if amount > 25000.0:
                priority = "Critical"
            elif amount > 10000.0:
                priority = "High"
                
            drivers.append(BusinessDriver(
                driver_name=f"Pending Inflow: Invoice {inv_no}",
                impact_value=amount,
                priority=priority,
                category="Delayed Receivables"
            ))

        # 2. Evaluate accounts payables (vendor obligations)
        for p in features.payables:
            amount = p["total_amount"]
            inv_no = p["invoice_number"]
            cat = p.get("category", "General Expense")
            
            priority = "Medium"
            if amount > 15000.0:
                priority = "Critical"
            elif amount > 5000.0:
                priority = "High"
                
            drivers.append(BusinessDriver(
                driver_name=f"Pending Outflow: Bill {inv_no} ({cat})",
                impact_value=-amount,
                priority=priority,
                category="Large Vendor Bills"
            ))

        # 3. Add payroll / recurring commitments (multiply daily recurring by 30 to get a monthly scale)
        if features.recurring_expenses > 0:
            monthly_payroll_est = features.recurring_expenses * 30.0
            drivers.append(BusinessDriver(
                driver_name="Monthly Recurring commitments (Payroll & Overheads)",
                impact_value=-monthly_payroll_est,
                priority="High" if monthly_payroll_est > 20000.0 else "Medium",
                category="Payroll & Overheads"
            ))

        if features.recurring_income > 0:
            monthly_income_est = features.recurring_income * 30.0
            drivers.append(BusinessDriver(
                driver_name="Monthly Recurring Income (retainer retainers)",
                impact_value=monthly_income_est,
                priority="High" if monthly_income_est > 20000.0 else "Medium",
                category="Recurring Credits"
            ))

        # Rank drivers by absolute financial impact magnitude (absolute value)
        drivers.sort(key=lambda d: abs(d.impact_value), reverse=True)
        return drivers
