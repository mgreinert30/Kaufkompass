import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { WEITERBILDUNG_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  kursArt: z.string().max(100).optional(),
  anbieter: z.string().max(100).optional(),
  preis: z.number().positive().max(100_000).optional(),
  dauer: z.string().max(100).optional(),
  format: z.string().max(50).optional(),
  abschluss: z.string().max(100).optional(),
  akkreditierung: z.string().max(200).optional(),
  foerderungMoeglich: z.boolean().optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const userMsg = `Weiterbildungs-Check:\nKurs: ${input.kursArt ?? "nicht angegeben"}\n${input.anbieter ? `Anbieter: ${input.anbieter}\n` : ""}${input.preis ? `Preis: ${input.preis} €\n` : ""}${input.dauer ? `Dauer: ${input.dauer}\n` : ""}${input.format ? `Format: ${input.format}\n` : ""}${input.abschluss ? `Abschluss: ${input.abschluss}\n` : ""}${input.akkreditierung ? `Akkreditierung: ${input.akkreditierung}\n` : ""}Förderung möglich: ${input.foerderungMoeglich ? "Ja" : "Unbekannt"}\n${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(WEITERBILDUNG_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "weiterbildung-check", toolTitle: "Weiterbildungs-Check", eingabe: input as Record<string, unknown>, berechnungen: {}, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: {}, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
