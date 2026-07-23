import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: [],
    count: 0,
  });
}

export async function POST(request: Request) {
  return NextResponse.json(
    { success: true, message: "Document ingestion initiated." },
    { status: 201 }
  );
}
