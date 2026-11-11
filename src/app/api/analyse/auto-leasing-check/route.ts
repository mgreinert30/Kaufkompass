import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneLeasingcheck } from "@/lib/calculations/leasing";
import { LEASING_SYSTEM_PROMPT, buildLeasingUserMessage } from "@/lib/ai/prompts/leasing";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  fahrzeugListenpreis:  z.number().positive().max(500_000),
  leasingrate:          z.number().positive().max(10_000),
  laufzeit:             z.number().int().min(12).max(60),
  kilometerProJahr:     z.number().int().min(1_000).max(200_000),
  anzahlung:            z.number().min(0).optional(),
  restwert:             z.number().min(0).optional(),
  uebernahmeOption:     z.boolean().optional(),
  leasingTyp:           z.enum(["privat", "gewerblich"]),
  fahrzeugModell:       z.string().max(100).optional(),
  herstellerBeitrag:    z.number().min(0).optional(),
  versicherungProMonat: z.number().min(0).optional(),
  wartungProMonat:      z.number().min(0).optional(),
  zusatzAngaben:        z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Ungültige Eingabe", details: parsed.error.issues }, { status: 400 });
    }

    const input = parsed.data;
    const berechnungen = berechneLeasingcheck(input);

    const userMsg = buildLeasingUserMessage(input, berechnungen);
    const { result: ki_raw, verfuegbar } = await callKI(LEASING_SYSTEM_PROMPT, userMsg);

    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) {
      try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; }
    }

    const analysisId = saveAnalyse({
      toolSlug:    "auto-leasing-check",
      toolTitle:   "Auto-Leasingcheck",
      eingabe:     input as Record<string, unknown>,
      berechnungen: berechnungen as unknown as Record<string, unknown>,
      ki_analyse,
      ki_verfuegbar: verfuegbar,
    });

    return NextResponse.json({
      success: true,
      analysisId,
      result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar },
    });
  } catch (err) {
    console.error("auto-leasing-check error:", err);
    return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 });
  }
}
