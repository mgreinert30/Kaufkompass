import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { UMZUG_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  umzugsArt: z.string().max(100).optional(),
  anbieter: z.string().max(100).optional(),
  angebotspreis: z.number().positive().max(50_000).optional(),
  entfernungKm: z.number().positive().max(5_000).optional(),
  wohnflaeche: z.number().positive().max(1_000).optional(),
  etage: z.number().int().min(0).max(30).optional(),
  umzugsLeistungen: z.string().max(300).optional(),
  umzugsDatum: z.string().max(50).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const userMsg = `Umzugs-Check:\n${input.anbieter ? `Anbieter: ${input.anbieter}\n` : ""}${input.angebotspreis ? `Angebotspreis: ${input.angebotspreis} €\n` : ""}${input.entfernungKm ? `Entfernung: ${input.entfernungKm} km\n` : ""}${input.wohnflaeche ? `Wohnfläche: ${input.wohnflaeche} m²\n` : ""}${input.etage ? `Etage: ${input.etage}\n` : ""}${input.umzugsLeistungen ? `Leistungen: ${input.umzugsLeistungen}\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(UMZUG_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "umzug-check", toolTitle: "Umzugs-Check", eingabe: input as Record<string, unknown>, berechnungen: {}, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: {}, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
