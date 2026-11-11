import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { KUECHE_SYSTEM_PROMPT, buildKuecheUserMessage } from "@/lib/ai/prompts/kueche";
import { berechneKueche } from "@/lib/calculations/kueche";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  angebotspreis:        z.number().positive().max(500_000),
  groesse:              z.enum(["klein", "mittel", "gross", "xlarge"]),
  typ:                  z.enum(["l_form", "u_form", "gerade", "insel"]),
  ausstattung:          z.enum(["basis", "mittel", "premium"]),
  mitMontage:           z.boolean(),
  mitElektrogeraeten:   z.boolean(),
  marke:                z.string().max(100).optional(),
  laufmeter:            z.number().positive().max(30).optional(),
  zusatzAngaben:        z.string().max(2000).optional(),
});

type Input = z.infer<typeof InputSchema>;

const KiAnalyseSchema = z.object({
  zusammenfassung: z.string(),
  angebotsBewertung: z.object({
    einschaetzung: z.string(),
    begruendung: z.string(),
    fehlendePunkte: z.array(z.string()),
  }),
  risikohinweise: z.array(z.object({
    schweregrad: z.enum(["hoch", "mittel", "niedrig"]),
    hinweis: z.string(),
    empfehlung: z.string(),
  })),
  typischeExtras: z.array(z.string()),
  fragenFuerAnbieter: z.array(z.string()),
  einschraenkungen: z.array(z.string()),
  markenEinschaetzung: z.string().optional(),
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
  const calculations = berechneKueche(input);

  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const userMessage = buildKuecheUserMessage({
        angebotspreis:    input.angebotspreis,
        groesseLabel:     calculations.groesseLabel,
        typLabel:         calculations.typLabel,
        ausstattungLabel: calculations.ausstattungLabel,
        mitMontage:       input.mitMontage,
        mitElektrogeraeten: input.mitElektrogeraeten,
        marke:            input.marke,
        laufmeter:        input.laufmeter,
        referenzMin:      calculations.referenzPreis.min,
        referenzMittel:   calculations.referenzPreis.mittel,
        referenzMax:      calculations.referenzPreis.max,
        angebotsBewertung: calculations.angebotsBewertung,
        empfohlenerPuffer: calculations.empfohlenerPuffer,
        grundlagen:       calculations.grundlagen,
        zusatzAngaben:    input.zusatzAngaben,
      });
      const aiResponse = await callAI({ systemPrompt: KUECHE_SYSTEM_PROMPT, userMessage, maxTokens: 2000 });
      const rawAnalyse = extractJSON(aiResponse.content);
      const validated = KiAnalyseSchema.safeParse(rawAnalyse);
      ki_analyse = validated.success ? validated.data : rawAnalyse;
      ki_verfuegbar = true;
    } catch (err) {
      console.error("KI-Analyse fehlgeschlagen:", err);
    }
  }

  const analysisId = saveAnalyse({
    toolSlug: "kuechen-kaufcheck",
    toolTitle: "Küchen-Kaufcheck",
    eingabe: input as Record<string, unknown>,
    berechnungen: calculations as unknown as Record<string, unknown>,
    ki_analyse: ki_analyse as Record<string, unknown> | null,
    ki_verfuegbar,
  });

  return NextResponse.json({ success: true, analysisId, result: { calculations, ki_analyse, ki_verfuegbar } });
}
