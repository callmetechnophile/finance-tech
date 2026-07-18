import datetime
import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.modules.module4_payments.repositories.vendor_repository import VendorRepository
from app.modules.module4_payments.services.vendor_analytics_service import VendorAnalyticsService
from app.modules.module4_payments.services.bill_intelligence_service import BillIntelligenceService
from app.modules.module4_payments.services.payment_optimization_engine import PaymentOptimizationEngine
from app.modules.module4_payments.schemas.payment_schema import TreasuryOptimizationReport, BillDetail
from app.modules.module2_liquidity.services.liquidity_service import LiquidityService
from app.integrations.ai.ai_gateway import AIGateway

class TreasuryService:
    def __init__(self):
        self.repository = VendorRepository()
        self.vendor_analytics = VendorAnalyticsService(self.repository)
        self.bill_intelligence = BillIntelligenceService()
        self.optimizer = PaymentOptimizationEngine()
        self.ai_gateway = AIGateway()

    async def optimize_treasury(self, session: Session, today: datetime.date = None) -> TreasuryOptimizationReport:
        if today is None:
            today = datetime.date.today()

        # 1. Fetch live cash balance & forecasting limits
        # We can fall back to standard limits if module2 is unconfigured or returns zero
        starting_cash = 350000.0  # default sandbox company starting cash
        minimum_cash_buffer = 100000.0  # safety threshold
        max_daily_payments = 120000.0  # operating limit
        total_inflow_forecast = 150000.0

        # Try to pull actual metrics dynamically
        try:
            liq = LiquidityService()
            liq_metrics = liq.get_liquidity_report(session, today)
            if liq_metrics:
                starting_cash = liq_metrics.working_capital.liquid_cash
                minimum_cash_buffer = liq_metrics.cash_buffer.target_buffer_cash
        except Exception:
            pass

        # 2. Gather all unpaid bills
        unpaid_invoices = self.repository.get_all_unpaid_bills(session)
        
        # Resolve vendor names mapped from IDs
        bill_details: List[BillDetail] = []
        for inv in unpaid_invoices:
            vendor = self.repository.get_vendor_by_id(session, inv.vendor_id)
            vendor_name = vendor.vendor_name if vendor else "Unknown Supplier"
            bill_details.append(self.bill_intelligence.analyze_bill(inv, vendor_name, today))

        # 3. Run Optimization
        allocations = self.optimizer.optimize_schedule(
            current_cash=starting_cash,
            minimum_cash_buffer=minimum_cash_buffer,
            max_daily_payments=max_daily_payments,
            bills=bill_details,
            today=today
        )

        total_allocated = sum(a.outstanding_balance for a in allocations if a.recommendation == "PAY_NOW")
        expected_savings = sum(a.discount_captured for a in allocations)
        penalties_avoided = sum(a.penalty_avoided for a in allocations)

        ending_cash = starting_cash - total_allocated

        report = TreasuryOptimizationReport(
            generated_timestamp=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            starting_cash=starting_cash,
            ending_cash=ending_cash,
            minimum_cash_buffer=minimum_cash_buffer,
            total_inflow_forecast=total_inflow_forecast,
            total_allocated_payments=total_allocated,
            expected_savings=expected_savings,
            penalties_avoided=penalties_avoided,
            payment_queue=allocations
        )

        # 4. Gemma explanation generation (Integration Layer call)
        try:
            # Strip deep internals and summarize for AI
            summary_payload = {
                "starting_cash": starting_cash,
                "ending_cash": ending_cash,
                "allocated_payouts": total_allocated,
                "savings": expected_savings,
                "payments_count": len(allocations)
            }
            # Leverage existing AIGateway chat
            gemma_raw = await self.ai_gateway.service.generate_internal_summary("TREASURY-REPORT", [summary_payload])
            report.gemma_explanation = gemma_raw
        except Exception as ex:
            report.gemma_explanation = {
                "summary": "Deterministic schedule completed. Payouts prioritized to capture dynamic cash discounts and avoid penalty exposure."
            }

        return report
