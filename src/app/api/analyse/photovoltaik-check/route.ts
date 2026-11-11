import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { PHOTOVOLTAIK_SYSTEM_PROMPT, buildPhotovoltaikUserMessage } from "@/lib/ai/prompts/photovoltaik";
import { berechnePV } from "@/lib/calculations/photovoltaik";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  leistungKWp:         z.number().positive().max(100),
  jahresverbrauchKWh:  z.number().int().min(500).max(100_000),
  anschaffungskosten:  z.number().positive().max(500_000),
  eigenverbrauchQuote: z.number().min(0.1).max(0.8),
  speichergroesseKWh:  z.number().min(0).max(50).optional(),
  region:              z.enum(["sued", "mitte", "nord"]).optional(),
  ausrichtung:         z.enum(["sued", "suedost", "suedwest", "ost_west", "ost", "west"]).optional(),
  einspeiseverguetung: z.number().min(0).max(30).optional(),
  zusatzAngaben:       z.string().max(2000).optional(),
});

type Input = z.infer<typeof InputSchema>;

const KiAnalyseSchema = z.object({
  zusammenfassung: z.string(),
  wirtschaftlichkeit: z.object({
    einschaetzung:    z.string(),
    begruendung:      z.string(),
    einschraenkungen: z.array(z.string()),
  }),
  risikohinweise: z.array(z.object({
    schweregrad: z.enum(["hoch", "mittel", "niedrig"]),
    hinweis:     z.string(),
    empfehlung:  z.string(),
  })),
  fragenFuerAnbieter: z.array(z.string()),
  foerderHinweise:    z.array(z.string()),
  einschraenkungen:   z.array(z.string()),
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
  const calculations = berechnePV(input);

  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const userMessage = buildPhotovoltaikUserMessage({
        leistungKWp:         input.leistungKWp,
        jahresverbrauchKWh:  input.jahresverbrauchKWh,
        anschaffungskosten:  input.anschaffungskosten,
        region:              input.region ?? "mitte",
        ausrichtung:         input.ausrichtung ?? "sued",
        speichergroesseKWh:  input.speichergroesseKWh,
        jahresertragKWh:     calculations.jahresertragKWh,
        eigenverbrauchKWh:   calculations.eigenverbrauchKWh,
        einspeisungKWh:      calculations.einspeisungKWh,
        jahreseinnahmen:     calculations.jahreseinnahmen,
        amortisationJahre:   calculations.amortisationJahre,
        annahmen:            calculations.annahmen,
        zusatzAngaben:       input.zusatzAngaben,
      });
      const aiResponse = await callAI({ systemPrompt: PHOTOVOLTAIK_SYSTEM_PROMPT, userMessage, maxTokens: 2000 });
      const rawAnalyse = extractJSON(aiResponse.content);
      const validated = KiAnalyseSchema.safeParse(rawAnalyse);
      ki_analyse = validated.success ? validated.data : rawAnalyse;
      ki_verfuegbar = true;
    } catch (err) {
      console.error("KI-Analyse fehlgeschlagen:", err);
    }
  }

  const analysisId = saveAnalyse({
    toolSlug: "photovoltaik-check",
    toolTitle: "Photovoltaik-Check",
    eingabe: input as Record<string, unknown>,
    berechnungen: calculations as unknown as Record<string, unknown>,
    ki_analyse: ki_analyse as Record<string, unknown> | null,
    ki_verfuegbar,
  });

  return NextResponse.json({ success: true, analysisId, result: { calculations, ki_analyse, ki_verfuegbar } });
}
