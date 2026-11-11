import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneMatratze } from "@/lib/calculations/matratze";
import { MATRATZEN_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  matratzenTyp: z.enum(["kaltschaum","taschenfederkern","latex","visco","gel","hybrid","wasserbett","sonstiges"]),
  haertegrad: z.string().max(20),
  angebotspreis: z.number().positive().max(10_000),
  breite: z.number().int().min(60).max(200).optional(),
  laenge: z.number().int().min(140).max(220).optional(),
  hersteller: z.string().max(100).optional(),
  modell: z.string().max(100).optional(),
  koerpergewicht: z.number().min(20).max(300).optional(),
  schlaflage: z.string().max(50).optional(),
  mitProbeliegen: z.boolean().optional(),
  garantieJahre: z.number().int().min(0).max(30).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneMatratze(input);
    const userMsg = `Matratzen-Check:\nTyp: ${berechnungen.typLabel}\nPreis: ${input.angebotspreis} €\nHärtegrad: ${input.haertegrad}\n${input.koerpergewicht ? `Körpergewicht: ${input.koerpergewicht} kg\n` : ""}${input.schlaflage ? `Schlaflage: ${input.schlaflage}\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(MATRATZEN_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "matratzen-check", toolTitle: "Matratzen-Check", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
