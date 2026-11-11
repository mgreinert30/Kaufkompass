import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneGebrauchtwaren } from "@/lib/calculations/gebrauchtwaren";
import { GEBRAUCHTWAREN_SYSTEM_PROMPT, buildGebrauchtwarenUserMessage } from "@/lib/ai/prompts/gebrauchtwaren";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  kategorie: z.enum(["moebel","elektronik","fahrrad","kleidung","sport","haushalt","spielzeug","sonstiges"]),
  zustand: z.enum(["neuwertig","sehr_gut","gut","akzeptabel","defekt"]),
  angebotspreis: z.number().positive().max(100_000),
  neupreis: z.number().positive().max(500_000).optional(),
  baujahr: z.number().int().min(1900).max(2025).optional(),
  hersteller: z.string().max(100).optional(),
  plattform: z.string().max(100).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneGebrauchtwaren(input);
    const { result: ki_raw, verfuegbar } = await callKI(GEBRAUCHTWAREN_SYSTEM_PROMPT, buildGebrauchtwarenUserMessage(input, berechnungen));
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "gebrauchtwaren-check", toolTitle: "Gebrauchtwaren-Check", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
