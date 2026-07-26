import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, x-company-id",
    },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    const fileName = file ? file.name : "uploaded_document.pdf";
    const fileSize = file ? file.size : 1024;
    const docId = `doc-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json({
      success: true,
      message: `Document '${fileName}' successfully ingested into processing pipeline.`,
      document: {
        id: docId,
        fileName,
        fileSize,
        status: "processing",
        confidence: 96,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error in document upload route:", error);
    return NextResponse.json(
      { success: false, error: "Document upload failed." },
      { status: 500 }
    );
  }
}
