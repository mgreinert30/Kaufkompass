import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { REISE_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  reiseArt: z.string().max(100).optional(),
  anbieter: z.string().max(100).optional(),
  preis: z.number().positive().max(100_000).optional(),
  personenZahl: z.number().int().positive().max(50).optional(),
  reiseDauer: z.number().int().positive().max(365).optional(),
  reiseZiel: z.string().max(100).optional(),
  buchungsArt: z.string().max(100).optional(),
  stornobedingungen: z.string().max(300).optional(),
  versicherung: z.boolean().optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const userMsg = `Reise-Check:\nArt: ${input.reiseArt ?? "Pauschalreise"}\n${input.anbieter ? `Anbieter: ${input.anbieter}\n` : ""}${input.preis ? `Preis: ${input.preis} €\n` : ""}${input.personenZahl ? `Personen: ${input.personenZahl}\n` : ""}${input.reiseDauer ? `Dauer: ${input.reiseDauer} Tage\n` : ""}${input.reiseZiel ? `Ziel: ${input.reiseZiel}\n` : ""}${input.stornobedingungen ? `Storno: ${input.stornobedingungen}\n` : ""}Reiseversicherung: ${input.versicherung ? "Ja" : "Nein/unbekannt"}\n${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(REISE_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "reise-hotel-check", toolTitle: "Reise & Hotel-Check", eingabe: input as Record<string, unknown>, berechnungen: {}, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: {}, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
