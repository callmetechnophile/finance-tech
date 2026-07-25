import { NextResponse } from "next/server";
import { tigergraph } from "@/lib/tigergraph";

export async function GET() {
  try {
    const health = await tigergraph.checkHealth();
    return NextResponse.json({
      status: "success",
      timestamp: new Date().toISOString(),
      health,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to connect to TigerGraph cluster",
      },
      { status: 500 }
    );
  }
}
