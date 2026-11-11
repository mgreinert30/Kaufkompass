import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { VERSICHERUNG_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  versicherungsArt: z.string().max(100),
  anbieter: z.string().max(100).optional(),
  jahresBeitrag: z.number().positive().max(100_000).optional(),
  laufzeit: z.string().max(50).optional(),
  selbstbehalt: z.number().min(0).max(10_000).optional(),
  deckungssumme: z.string().max(100).optional(),
  bestehendeVersicherung: z.string().max(200).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const userMsg = `Versicherungs-Check:\nArt: ${input.versicherungsArt}\n${input.anbieter ? `Anbieter: ${input.anbieter}\n` : ""}${input.jahresBeitrag ? `Jahresbeitrag: ${input.jahresBeitrag} €\n` : ""}${input.laufzeit ? `Laufzeit: ${input.laufzeit}\n` : ""}${input.selbstbehalt ? `Selbstbehalt: ${input.selbstbehalt} €\n` : ""}${input.deckungssumme ? `Deckungssumme: ${input.deckungssumme}\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(VERSICHERUNG_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "versicherung-check", toolTitle: "Versicherungs-Check", eingabe: input as Record<string, unknown>, berechnungen: {}, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: {}, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
