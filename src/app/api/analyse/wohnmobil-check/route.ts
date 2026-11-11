import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneWohnmobil } from "@/lib/calculations/wohnmobil";
import { WOHNMOBIL_SYSTEM_PROMPT, buildWohnmobilUserMessage } from "@/lib/ai/prompts/wohnmobil";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  typ: z.enum(["alkoven","teilintegriert","vollintegriert","van_campingbus","caravan"]),
  kaufpreis: z.number().positive().max(500_000), baujahr: z.number().int().min(1950).max(2025),
  kilometerstand: z.number().int().min(0).max(2_000_000).optional(),
  schlafplaetze: z.number().int().min(1).max(10).optional(),
  mitGarantie: z.boolean().optional(), jahreskosten: z.number().optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneWohnmobil(input);
    const { result: ki_raw, verfuegbar } = await callKI(WOHNMOBIL_SYSTEM_PROMPT, buildWohnmobilUserMessage(input, berechnungen));
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "wohnmobil-check", toolTitle: "Wohnmobil- und Campercheck", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
