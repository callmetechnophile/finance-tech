import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      metrics: {
        cash_balance: null,
        receivables: null,
        payables: null,
        working_capital: null,
        liquidity_score: null,
        cash_runway_days: null,
        revenue_mtd: null,
        expenses_mtd: null,
      },
      charts: {
        cash_flow_trend: [],
        rev_exp_data: [],
        forecast_data: [],
      },
      collections_summary: {
        total_outstanding: null,
        pie_data: [],
      },
      treasury_summary: {
        total_payments_week: null,
        pending_approvals: 0,
        scheduled_payments: 0,
        wire_transfers: 0,
      },
      top_customers: [],
      recent_documents: [],
      upcoming_payments: [],
      ai_executive_brief: "No financial documents have been processed yet.",
      ai_insight: "No context available.",
    },
  });
}
