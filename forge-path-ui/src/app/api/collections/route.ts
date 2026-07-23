import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      invoices: [],
      delinquent_count: 0,
      total_receivables: 0,
      recovery_rate: null,
      aging_buckets: [],
    },
  });
}
