import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { FENSTER_DACH_SYSTEM_PROMPT, buildFensterDachUserMessage } from "@/lib/ai/prompts/fenster-dach";
import { berechneFensterDach } from "@/lib/calculations/fenster-dach";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  massnahme: z.enum([
    "fenster_austausch", "fenster_verglasung",
    "dach_eindeckung", "dach_daemmung_innen", "dach_daemmung_aussen",
    "dach_daemmung_flach", "dach_sanierung_komplett",
  ]),
  anzahlFenster: z.number().int().positive().max(200).optional(),
  fensterFlaeche: z.number().positive().max(2000).optional(),
  dachFlaeche:    z.number().positive().max(5000).optional(),
  angebotspreis:  z.number().positive().max(500_000).optional(),
  baujahr:        z.number().int().min(1850).max(2030).optional(),
  mitISFP:        z.boolean().optional(),
  bundesland:     z.string().max(50).optional(),
  zusatzAngaben:  z.string().max(2000).optional(),
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
  const calculations = berechneFensterDach(input);

  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const userMessage = buildFensterDachUserMessage({
        massnahmeLabel:    calculations.massnahmeLabel,
        einheit:           calculations.einheit,
        angebotspreis:     input.angebotspreis,
        referenzMin:       calculations.referenzKostenMin,
        referenzMittel:    calculations.referenzKostenMittel,
        referenzMax:       calculations.referenzKostenMax,
        angebotsBewertung: calculations.angebotsBewertung,
        foerderungSatz:    calculations.foerderungSatz,
        foerderungBetrag:  calculations.foerderungBetrag,
        foerderungISFPBonus: calculations.foerderungISFPBonus,
        nettokostenNachFoerderung: calculations.nettokostenNachFoerderung,
        puffer:            calculations.puffer,
        grundlagen:        calculations.grundlagen,
        zusatzAngaben:     input.zusatzAngaben,
      });
      const aiResponse = await callAI({ systemPrompt: FENSTER_DACH_SYSTEM_PROMPT, userMessage, maxTokens: 2000 });
      const rawAnalyse = extractJSON(aiResponse.content);
      const validated = KiAnalyseSchema.safeParse(rawAnalyse);
      ki_analyse = validated.success ? validated.data : rawAnalyse;
      ki_verfuegbar = true;
    } catch (err) {
      console.error("KI-Analyse fehlgeschlagen:", err);
    }
  }

  const analysisId = saveAnalyse({
    toolSlug: "fenster-dach-check",
    toolTitle: "Fenster- und Dachcheck",
    eingabe: input as Record<string, unknown>,
    berechnungen: calculations as unknown as Record<string, unknown>,
    ki_analyse: ki_analyse as Record<string, unknown> | null,
    ki_verfuegbar,
  });

  return NextResponse.json({ success: true, analysisId, result: { calculations, ki_analyse, ki_verfuegbar } });
}
