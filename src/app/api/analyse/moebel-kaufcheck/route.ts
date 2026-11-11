import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechnesMoebel } from "@/lib/calculations/moebel";
import { MOEBEL_SYSTEM_PROMPT, buildMoebelUserMessage } from "@/lib/ai/prompts/moebel";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  kategorie: z.enum([
    "sofa_couch", "bett_lattenrost", "kleiderschrank", "esstisch_stuehle",
    "regal_schrank", "schreibtisch", "kommode", "matratze", "sonstiges",
  ]),
  qualitaet:     z.enum(["einfach", "mittel", "hochwertig"]),
  angebotspreis: z.number().positive().max(100_000),
  material:      z.string().max(100).optional(),
  hersteller:    z.string().max(100).optional(),
  massanfertigung: z.boolean().optional(),
  lieferung:     z.boolean().optional(),
  montage:       z.boolean().optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Ungültige Eingabe", details: parsed.error.issues }, { status: 400 });
    }

    const input = parsed.data;
    const berechnungen = berechnesMoebel(input);

    const userMsg = buildMoebelUserMessage(input, berechnungen);
    const { result: ki_raw, verfuegbar } = await callKI(MOEBEL_SYSTEM_PROMPT, userMsg);

    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) {
      try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; }
    }

    const analysisId = saveAnalyse({
      toolSlug:    "moebel-kaufcheck",
      toolTitle:   "Möbel-Kaufcheck",
      eingabe:     input as Record<string, unknown>,
      berechnungen: berechnungen as unknown as Record<string, unknown>,
      ki_analyse,
      ki_verfuegbar: verfuegbar,
    });

    return NextResponse.json({
      success: true,
      analysisId,
      result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar },
    });
  } catch (err) {
    console.error("moebel-kaufcheck error:", err);
    return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 });
  }
}
