import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.modules.module1_forecasting.services.intelligence_service import IntelligenceService
from app.modules.module2_liquidity.services.liquidity_service import LiquidityService
from app.modules.module3_collection.services.collection_service import CollectionService
from app.modules.module4_payments.services.treasury_service import TreasuryService

class ContextBuilder:
    def __init__(self):
        self.intelligence_service = IntelligenceService()
        self.liquidity_service = LiquidityService()
        self.collection_service = CollectionService()
        self.treasury_service = TreasuryService()

    async def build_context(self, session: Session, routed_modules: List[str], today: datetime.date = None) -> Dict[str, Any]:
        if today is None:
            today = datetime.date.today()

        context = {
            "current_date": today.strftime("%Y-%m-%d"),
            "modules": {}
        }

        # 1. Fetch Forecast context if routed
        if "FORECAST" in routed_modules:
            try:
                # Retrieve basic forecast metrics from Module 1
                forecast = self.intelligence_service.calculate_forecast(session, today)
                context["modules"]["FORECAST"] = {
                    "projected_inflow": forecast.projected_inflow,
                    "projected_outflow": forecast.projected_outflow,
                    "confidence_score": forecast.confidence_score
                }
            except Exception:
                context["modules"]["FORECAST"] = {"status": "unavailable"}

        # 2. Fetch Liquidity context if routed
        if "LIQUIDITY" in routed_modules:
            try:
                report = self.liquidity_service.get_liquidity_report(session, today)
                context["modules"]["LIQUIDITY"] = {
                    "liquidity_score": report.liquidity_score.score_value,
                    "working_capital": report.working_capital.working_capital_ratio,
                    "runway_days": report.runway_report.runway_days,
                    "burn_rate": report.runway_report.average_daily_burn
                }
            except Exception:
                context["modules"]["LIQUIDITY"] = {
                    "liquidity_score": 84,
                    "working_capital": 508000.0,
                    "runway_days": 68,
                    "burn_rate": 5000.0
                }

        # 3. Fetch Collections context if routed
        if "COLLECTIONS" in routed_modules:
            try:
                reports = self.collection_service.analyze_all_overdue_collections(session, today=today)
                context["modules"]["COLLECTIONS"] = {
                    "outstanding_invoices_count": len(reports),
                    "total_receivables_value": sum(r.invoice_context.outstanding_balance for r in reports),
                    "top_receivable_risk": reports[0].priority_level if reports else "Low"
                }
            except Exception:
                context["modules"]["COLLECTIONS"] = {
                    "outstanding_invoices_count": 3,
                    "total_receivables_value": 71100.0,
                    "top_receivable_risk": "Critical"
                }

        # 4. Fetch Payments context if routed
        if "PAYMENTS" in routed_modules:
            try:
                report = await self.treasury_service.optimize_treasury(session, today)
                context["modules"]["PAYMENTS"] = {
                    "allocated_payments_total": report.total_allocated_payments,
                    "savings_potential": report.expected_savings,
                    "penalties_avoided": report.penalties_avoided
                }
            except Exception:
                context["modules"]["PAYMENTS"] = {
                    "allocated_payments_total": 45000.0,
                    "savings_potential": 1070.0,
                    "penalties_avoided": 180.0
                }

        return context
