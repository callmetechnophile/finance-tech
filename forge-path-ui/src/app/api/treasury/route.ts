import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      bank_accounts: [],
      payment_queue: [],
      pending_approvals: [],
      treasury_sweeps: [],
      total_balance: null,
      payables_total: null,
    },
  });
}
