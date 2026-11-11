import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { TIERARZT_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  tierArt: z.string().max(50).optional(),
  behandlung: z.string().max(200).optional(),
  gesamtkosten: z.number().positive().max(50_000).optional(),
  tierversicherung: z.boolean().optional(),
  behandlungsAlternative: z.boolean().optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const userMsg = `Tierarzt-Check:\nTier: ${input.tierArt ?? "nicht angegeben"}\nBehandlung: ${input.behandlung ?? "nicht angegeben"}\n${input.gesamtkosten ? `Kosten: ${input.gesamtkosten} €\n` : ""}Tierversicherung: ${input.tierversicherung ? "Ja" : "Nein/unbekannt"}\nAlternativen besprochen: ${input.behandlungsAlternative ? "Ja" : "Nein"}\n${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(TIERARZT_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "tierarzt-check", toolTitle: "Tierarzt-Check", eingabe: input as Record<string, unknown>, berechnungen: {}, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: {}, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
