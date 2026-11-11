import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { HOCHZEIT_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  budget: z.number().positive().max(500_000).optional(),
  gaestezahl: z.number().int().positive().max(1_000).optional(),
  hochzeitsDatum: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  locationPreis: z.number().min(0).max(100_000).optional(),
  catering: z.string().max(200).optional(),
  cateringPreis: z.number().min(0).max(100_000).optional(),
  fotograf: z.number().min(0).max(20_000).optional(),
  musik: z.number().min(0).max(20_000).optional(),
  blumen: z.number().min(0).max(10_000).optional(),
  kleidung: z.number().min(0).max(20_000).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const gesamtPositionen = (input.locationPreis ?? 0) + (input.cateringPreis ?? 0) + (input.fotograf ?? 0) + (input.musik ?? 0) + (input.blumen ?? 0) + (input.kleidung ?? 0);
    const userMsg = `Hochzeits-Check:\nBudget: ${input.budget ?? "nicht angegeben"} €\nGäste: ${input.gaestezahl ?? "nicht angegeben"}\nSumme Positionen: ${gesamtPositionen} €\n${input.location ? `Location: ${input.location}, ${input.locationPreis ?? "?"} €\n` : ""}${input.catering ? `Catering: ${input.catering}, ${input.cateringPreis ?? "?"} €\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(HOCHZEIT_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "hochzeit-check", toolTitle: "Hochzeits-Check", eingabe: input as Record<string, unknown>, berechnungen: { gesamtPositionen }, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: { gesamtPositionen }, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
