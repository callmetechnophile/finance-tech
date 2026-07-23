import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      score: null,
      rating: null,
      factors: [],
      status: "Risk engine awaiting financial data.",
    },
  });
}
