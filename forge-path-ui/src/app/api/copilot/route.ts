import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      messages: [],
      suggested_questions: [],
      solvency_digest: "No financial documents have been processed yet.",
      recommended_actions: [],
    },
  });
}

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    data: {
      response: "Waiting for financial context. Please upload an invoice, bank statement, or ledger to enable AI insights.",
    },
  });
}
