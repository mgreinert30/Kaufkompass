import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { BAD_SYSTEM_PROMPT, buildBadUserMessage } from "@/lib/ai/prompts/bad-renovierung";
import { berechneBadRenovierung } from "@/lib/calculations/bad-renovierung";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  groesse:               z.enum(["klein", "mittel", "gross"]),
  ausstattung:           z.enum(["basis", "komfort", "premium"]),
  flaeche:               z.number().positive().max(100).optional(),
  angebotspreis:         z.number().positive().max(500_000).optional(),
  baujahr:               z.number().int().min(1850).max(2030).optional(),
  mitBarrierefreiheit:   z.boolean(),
  mitHeizung:            z.boolean(),
  zusatzAngaben:         z.string().max(2000).optional(),
});

type Input = z.infer<typeof InputSchema>;

const KiAnalyseSchema = z.object({
  zusammenfassung: z.string(),
  kostenBewertung: z.object({
    einschaetzung: z.string(),
    begruendung: z.string(),
    fehlendePunkte: z.array(z.string()),
  }),
  risikohinweise: z.array(z.object({
    schweregrad: z.enum(["hoch", "mittel", "niedrig"]),
    hinweis: z.string(),
    empfehlung: z.string(),
  })),
  foerderHinweise: z.array(z.string()),
  fragenFuerHandwerker: z.array(z.string()),
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
  const calculations = berechneBadRenovierung(input);

  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const userMessage = buildBadUserMessage({
        groesseLabel:    calculations.groesseLabel,
        ausstattungLabel: calculations.ausstattungLabel,
        flaeche:         calculations.flaeche,
        angebotspreis:   input.angebotspreis,
        referenzMin:     calculations.referenzMin,
        referenzMittel:  calculations.referenzMittel,
        referenzMax:     calculations.referenzMax,
        angebotsBewertung: calculations.angebotsBewertung,
        mitBarrierefreiheit: input.mitBarrierefreiheit,
        mitHeizung:      input.mitHeizung,
        puffer:          calculations.puffer,
        grundlagen:      calculations.grundlagen,
        zusatzAngaben:   input.zusatzAngaben,
      });
      const aiResponse = await callAI({ systemPrompt: BAD_SYSTEM_PROMPT, userMessage, maxTokens: 2000 });
      const rawAnalyse = extractJSON(aiResponse.content);
      const validated = KiAnalyseSchema.safeParse(rawAnalyse);
      ki_analyse = validated.success ? validated.data : rawAnalyse;
      ki_verfuegbar = true;
    } catch (err) {
      console.error("KI-Analyse fehlgeschlagen:", err);
    }
  }

  const analysisId = saveAnalyse({
    toolSlug: "bad-renovierung-check",
    toolTitle: "Badezimmer-Renovierungscheck",
    eingabe: input as Record<string, unknown>,
    berechnungen: calculations as unknown as Record<string, unknown>,
    ki_analyse: ki_analyse as Record<string, unknown> | null,
    ki_verfuegbar,
  });

  return NextResponse.json({ success: true, analysisId, result: { calculations, ki_analyse, ki_verfuegbar } });
}
