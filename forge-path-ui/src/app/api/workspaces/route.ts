import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      id: "ws-default",
      name: "My Enterprise Workspace",
      currency: "INR",
      density: "loose",
      has_documents: false,
    },
  });
}
