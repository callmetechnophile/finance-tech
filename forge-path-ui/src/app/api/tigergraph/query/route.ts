import { NextRequest, NextResponse } from "next/server";
import { tigergraph } from "@/lib/tigergraph";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { queryName = "getVendorRiskExposure", params = {} } = body;
    const result = await tigergraph.runGSQLQuery(queryName, params);
    
    return NextResponse.json({
      status: "success",
      queryName,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "GSQL query execution failed",
      },
      { status: 500 }
    );
  }
}
