import { NextRequest, NextResponse } from "next/server";
import { getAnalyse } from "@/lib/storage/analysis-store";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ analysisId: string }> }
) {
  const { analysisId } = await params;
  const analyse = getAnalyse(analysisId);

  if (!analyse) {
    return NextResponse.json(
      { success: false, error: "Analyse nicht gefunden oder abgelaufen" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, analyse });
}
