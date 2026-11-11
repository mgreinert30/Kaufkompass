import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { GEBRAUCHTWAGEN_SYSTEM_PROMPT, buildGebrauchtwagenUserMessage } from "@/lib/ai/prompts/gebrauchtwagen";
import { berechneGebrauchtwagenBetriebskosten } from "@/lib/calculations/gebrauchtwagen";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  marke:              z.string().min(1).max(50),
  modell:             z.string().min(1).max(100),
  baujahr:            z.number().int().min(1990).max(2026),
  kilometerstand:     z.number().int().min(0).max(1_000_000),
  kraftstoff:         z.enum(["benzin", "diesel", "elektro", "hybrid"]),
  kaufpreis:          z.number().positive().max(500_000),
  hubraum:            z.number().int().min(500).max(10_000).optional(),
  verbrauch:          z.number().positive().max(50).optional(),
  jahresfahrleistung: z.number().int().min(1_000).max(100_000),
  zusatzAngaben:      z.string().max(2000).optional(),
});

type Input = z.infer<typeof InputSchema>;

const KiAnalyseSchema = z.object({
  zusammenfassung: z.string(),
  kostenBewertung: z.object({
    einschaetzung:    z.string(),
    begruendung:      z.string(),
    einschraenkungen: z.array(z.string()),
  }),
  risikohinweise: z.array(z.object({
    schweregrad: z.enum(["hoch", "mittel", "niedrig"]),
    hinweis:     z.string(),
    empfehlung:  z.string(),
  })),
  fragenFuerKauf: z.array(z.string()),
  pruefpunkte:    z.array(z.string()),
  einschraenkungen: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false, error: "Ungültige JSON-Anfrage" }, { status: 400 }); }

  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Eingabefehler", details: parsed.error.flatten() }, { status: 422 });
  }

  const input: Input = parsed.data;
  const calculations = berechneGebrauchtwagenBetriebskosten(input);

  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const userMessage = buildGebrauchtwagenUserMessage({
        ...input,
        ...calculations,
        zusatzAngaben: input.zusatzAngaben,
      });
      const aiResponse = await callAI({ systemPrompt: GEBRAUCHTWAGEN_SYSTEM_PROMPT, userMessage, maxTokens: 2000 });
      const rawAnalyse = extractJSON(aiResponse.content);
      const validated = KiAnalyseSchema.safeParse(rawAnalyse);
      ki_analyse = validated.success ? validated.data : rawAnalyse;
      ki_verfuegbar = true;
    } catch (err) {
      console.error("KI-Analyse fehlgeschlagen:", err);
    }
  }

  const analysisId = saveAnalyse({
    toolSlug: "gebrauchtwagen-check",
    toolTitle: "Gebrauchtwagen-Kaufcheck",
    eingabe: input as Record<string, unknown>,
    berechnungen: calculations as unknown as Record<string, unknown>,
    ki_analyse: ki_analyse as Record<string, unknown> | null,
    ki_verfuegbar,
  });

  return NextResponse.json({ success: true, analysisId, result: { calculations, ki_analyse, ki_verfuegbar } });
}
