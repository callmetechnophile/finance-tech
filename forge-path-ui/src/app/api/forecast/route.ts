import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      time_series: [],
      forecast_drivers: [],
      confidence_interval: null,
      projected_cash: null,
      digest: "No financial documents have been processed yet.",
    },
  });
}
