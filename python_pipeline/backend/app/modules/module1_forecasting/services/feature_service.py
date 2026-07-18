from sqlalchemy.orm import Session
from app.database import models
from app.modules.module1_forecasting.schemas.feature_schema import ForecastFeatures
from typing import Dict, List, Any
import datetime

def prepare_features(db: Session, company_id: str, current_balance_override: float = 50000.0) -> ForecastFeatures:
    """
    Transforms raw database invoices, vendor bills, and records into time-series forecasting features.
    """
    # 1. Fetch Invoices from DB
    invoices = db.query(models.Invoice).filter(
        models.Invoice.company_id == company_id,
        models.Invoice.validation_status == "VALID"
    ).all()

    daily_inflow: Dict[str, float] = {}
    daily_outflow: Dict[str, float] = {}
    
    receivables: List[Dict[str, Any]] = []
    payables: List[Dict[str, Any]] = []
    
    recurring_income_total = 0.0
    recurring_expenses_total = 0.0
    
    # Track unique dates for historical calculation
    dates_tracked = set()

    for inv in invoices:
        is_payable = inv.vendor_id is not None
        is_receivable = inv.customer_id is not None
        amount = inv.total_amount or 0.0
        
        # Aggregate historical cash flow (assuming paid invoices represent past flows)
        # For simplicity, we use invoice_date as transaction timestamp
        inv_date = inv.invoice_date
        dates_tracked.add(inv_date)
        
        if inv.payment_status == "PAID":
            if is_receivable:
                daily_inflow[inv_date] = daily_inflow.get(inv_date, 0.0) + amount
            elif is_payable:
                daily_outflow[inv_date] = daily_outflow.get(inv_date, 0.0) + amount
        else:
            # Active liabilities and assets
            inv_dict = {
                "invoice_number": inv.invoice_number,
                "due_date": inv.due_date,
                "total_amount": amount,
                "category": inv.category,
                "partner_id": inv.vendor_id if is_payable else inv.customer_id
            }
            if is_receivable:
                receivables.append(inv_dict)
            elif is_payable:
                payables.append(inv_dict)
                
        # Estimate recurring obligations (e.g. rent, salaries, software) based on categories
        cat_lower = (inv.category or "").lower()
        if "rent" in cat_lower or "payroll" in cat_lower or "salary" in cat_lower or "utility" in cat_lower or "overhead" in cat_lower:
            if is_payable:
                recurring_expenses_total += amount
            else:
                recurring_income_total += amount

    # Estimate daily recurring averages (amortized over 30 days)
    daily_recurring_income = recurring_income_total / 30.0
    daily_recurring_expenses = recurring_expenses_total / 30.0

    # 2. Build Historical Cash Balance Series
    historical_balance: Dict[str, float] = {}
    running_balance = current_balance_override
    
    # Sort tracked dates to build a chronological timeline
    sorted_dates = sorted(list(dates_tracked))
    for d in sorted_dates:
        inflow = daily_inflow.get(d, 0.0)
        outflow = daily_outflow.get(d, 0.0)
        running_balance = running_balance + inflow - outflow
        historical_balance[d] = running_balance

    return ForecastFeatures(
        daily_cash_inflow=daily_inflow,
        daily_cash_outflow=daily_outflow,
        historical_cash_balance=historical_balance,
        receivables=receivables,
        payables=payables,
        recurring_income=daily_recurring_income,
        recurring_expenses=daily_recurring_expenses,
        current_cash_balance=current_balance_override
    )
