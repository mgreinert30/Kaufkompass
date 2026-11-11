import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneKinderwagen } from "@/lib/calculations/kinderwagen";
import { KINDERWAGEN_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  typ: z.enum(["kombikinderwagen","buggy","joggingkinderwagen","reisebuggy","geschwisterwagen","tragetasche","sonstiges"]),
  angebotspreis: z.number().positive().max(5_000),
  hersteller: z.string().max(100).optional(),
  modell: z.string().max(100).optional(),
  gewichtKg: z.number().min(1).max(30).optional(),
  faltbar: z.boolean().optional(),
  normen: z.string().max(100).optional(),
  nutzungszeitraum: z.string().max(50).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneKinderwagen(input);
    const userMsg = `Kinderwagen-Check:\nTyp: ${berechnungen.typLabel}\nPreis: ${input.angebotspreis} €\n${input.hersteller ? `Hersteller: ${input.hersteller}\n` : ""}${input.modell ? `Modell: ${input.modell}\n` : ""}${input.gewichtKg ? `Gewicht: ${input.gewichtKg} kg\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(KINDERWAGEN_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "kinderwagen-check", toolTitle: "Kinderwagen-Check", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
