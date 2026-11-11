import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneAutoreparatur } from "@/lib/calculations/autoreparatur";
import { AUTOREPARATUR_SYSTEM_PROMPT, buildAutoreparaturUserMessage } from "@/lib/ai/prompts/autoreparatur";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const PositionSchema = z.object({
  beschreibung: z.string().max(200),
  arbeitsstunden: z.number().optional(),
  teilepreis: z.number().optional(),
});

const InputSchema = z.object({
  werkstattTyp:   z.enum(["markenwerkstatt", "freie_werkstatt", "schnellservice"]),
  fahrzeugKlasse: z.enum(["kleinwagen", "kompakt", "mittelklasse", "oberklasse", "nutzfahrzeug"]),
  angebotspreis:  z.number().positive().max(50_000),
  arbeitszeit:    z.number().positive().max(100).optional(),
  stundensatz:    z.number().positive().max(500).optional(),
  positionen:     z.array(PositionSchema).max(20).optional(),
  hauptarbeit:    z.string().max(200).optional(),
  fahrzeugAlter:  z.number().int().min(0).max(60).optional(),
  kilometerstand: z.number().int().min(0).max(2_000_000).optional(),
  zusatzAngaben:  z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Ungültige Eingabe", details: parsed.error.issues }, { status: 400 });
    }

    const input = parsed.data;
    const berechnungen = berechneAutoreparatur(input);

    const userMsg = buildAutoreparaturUserMessage(input, berechnungen);
    const { result: ki_raw, verfuegbar } = await callKI(AUTOREPARATUR_SYSTEM_PROMPT, userMsg);

    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) {
      try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; }
    }

    const analysisId = saveAnalyse({
      toolSlug:    "autoreparatur-check",
      toolTitle:   "Autoreparatur-Check",
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
    console.error("autoreparatur-check error:", err);
    return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 });
  }
}
