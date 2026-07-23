import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      runway_days: null,
      liquidity_score: null,
      cash_flow_timeline: [],
      forecast_runway: [],
      stress_test_scenarios: [],
      cash_gap_prediction: null,
    },
  });
}
