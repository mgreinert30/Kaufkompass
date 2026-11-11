import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneHaushaltsgeraet } from "@/lib/calculations/haushaltsgeraete";
import { HAUSHALTSGERAETE_SYSTEM_PROMPT, buildHaushaltsgeraeteUserMessage } from "@/lib/ai/prompts/haushaltsgeraete";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  geraeteTyp: z.enum(["kuehlschrank","waschmaschine","trockner","geschirrspueler","herd_backofen","mikrowelle","staubsauger","kaffeemaschine"]),
  energieKlasse: z.enum(["A","B","C","D","E","F","G"]),
  angebotspreis: z.number().positive().max(10_000),
  hersteller: z.string().max(100).optional(), modell: z.string().max(100).optional(),
  jahresverbrauchKwh: z.number().positive().max(5_000).optional(),
  strompreis: z.number().positive().max(100).optional(),
  garantieJahre: z.number().int().min(0).max(10).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneHaushaltsgeraet(input);
    const { result: ki_raw, verfuegbar } = await callKI(HAUSHALTSGERAETE_SYSTEM_PROMPT, buildHaushaltsgeraeteUserMessage(input, berechnungen));
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "haushaltsgeraete-check", toolTitle: "Haushaltsgeräte-Check", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
