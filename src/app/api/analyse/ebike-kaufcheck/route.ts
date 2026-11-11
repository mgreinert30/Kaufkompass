import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneEBike } from "@/lib/calculations/ebike";
import { EBIKE_SYSTEM_PROMPT, buildEBikeUserMessage } from "@/lib/ai/prompts/ebike";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  klasse: z.enum(["pedelec_25","speed_pedelec_45","e_cargo","e_mountainbike"]),
  motorPosition: z.enum(["mittelmotor","heckmotor","frontmotor"]),
  angebotspreis: z.number().positive().max(20_000),
  akkuKapazitaet: z.number().positive().max(2000),
  motorLeistung: z.number().positive().max(1000).optional(),
  reichweite: z.number().positive().max(500).optional(),
  hersteller: z.string().max(100).optional(),
  garantieJahre: z.number().int().min(0).max(10).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneEBike(input);
    const { result: ki_raw, verfuegbar } = await callKI(EBIKE_SYSTEM_PROMPT, buildEBikeUserMessage(input, berechnungen));
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "ebike-kaufcheck", toolTitle: "E-Bike-Kaufcheck", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
