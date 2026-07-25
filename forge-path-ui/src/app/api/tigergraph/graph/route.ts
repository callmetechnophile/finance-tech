import { NextResponse } from "next/server";
import { tigergraph } from "@/lib/tigergraph";

export async function GET() {
  try {
    const graphData = await tigergraph.getFinancialGraph();
    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      graph: graphData,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to fetch TigerGraph network topology",
      },
      { status: 500 }
    );
  }
}
