import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { BESTATTUNG_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  bestattungsArt: z.string().max(100).optional(),
  anbieter: z.string().max(100).optional(),
  gesamtkosten: z.number().positive().max(100_000).optional(),
  sterbegeldVorhanden: z.boolean().optional(),
  leistungsUmfang: z.string().max(300).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const userMsg = `Bestattungs-Check:\nArt: ${input.bestattungsArt ?? "nicht angegeben"}\n${input.anbieter ? `Anbieter: ${input.anbieter}\n` : ""}${input.gesamtkosten ? `Gesamtkosten: ${input.gesamtkosten} €\n` : ""}Sterbegeld vorhanden: ${input.sterbegeldVorhanden ? "Ja" : "Nein/unbekannt"}\n${input.leistungsUmfang ? `Leistungsumfang: ${input.leistungsUmfang}\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(BESTATTUNG_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "bestattung-check", toolTitle: "Bestattungs-Check", eingabe: input as Record<string, unknown>, berechnungen: {}, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: {}, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
