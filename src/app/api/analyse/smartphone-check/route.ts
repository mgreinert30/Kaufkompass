import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneSmartphone } from "@/lib/calculations/smartphone";
import { SMARTPHONE_SYSTEM_PROMPT, buildSmartphoneUserMessage } from "@/lib/ai/prompts/smartphone";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  segment: z.enum(["einsteiger","mittelklasse","oberklasse","flagship"]),
  angebotspreis: z.number().positive().max(5_000),
  hersteller: z.string().max(100).optional(), modell: z.string().max(100).optional(),
  speicherGb: z.number().int().optional(), ramGb: z.number().int().optional(),
  akkuMah: z.number().int().optional(), displayZoll: z.number().optional(),
  erscheinungsjahr: z.number().int().min(2015).max(2025).optional(),
  mitVertrag: z.boolean().optional(), vertragslaufzeit: z.number().int().optional(),
  monatlicheRate: z.number().optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneSmartphone(input);
    const { result: ki_raw, verfuegbar } = await callKI(SMARTPHONE_SYSTEM_PROMPT, buildSmartphoneUserMessage(input, berechnungen));
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "smartphone-check", toolTitle: "Smartphone-Check", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
