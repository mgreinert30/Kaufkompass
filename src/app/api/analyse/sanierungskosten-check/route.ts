import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { SANIERUNG_SYSTEM_PROMPT, buildSanierungUserMessage } from "@/lib/ai/prompts/sanierung";
import { berechneSanierung } from "@/lib/calculations/sanierung";

const InputSchema = z.object({
  massnahme:     z.enum(["fassade", "dach", "keller", "fenster", "heizung", "komplett"]),
  flaeche:       z.number().positive().max(10_000).optional(),
  angebotspreis: z.number().positive().max(1_000_000).optional(),
  mitISFP:       z.boolean().optional(),
  bundesland:    z.string().optional(),
  baujahr:       z.number().int().min(1850).max(2030).optional(),
  zusatzAngaben: z.string().max(2000).optional(),
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
  foerderHinweise:     z.array(z.string()),
  fragenFuerHandwerker: z.array(z.string()),
  einschraenkungen:    z.array(z.string()),
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
  const calculations = berechneSanierung(input);

  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const userMessage = buildSanierungUserMessage({
        massnahme:      input.massnahme,
        massnahmeLabel: calculations.massnahmeLabel,
        flaeche:        input.flaeche,
        angebotspreis:  input.angebotspreis,
        mitISFP:        input.mitISFP ?? false,
        referenzKostenMin:          calculations.referenzKostenMin,
        referenzKostenMax:          calculations.referenzKostenMax,
        referenzKostenMittel:       calculations.referenzKostenMittel,
        foerderungBetrag:           calculations.foerderungBetrag,
        foerderungSatz:             calculations.foerderungSatz,
        nettokostenNachFoerderung:  calculations.nettokostenNachFoerderung,
        puffer:                     calculations.puffer,
        gesamtkostenMitPuffer:      calculations.gesamtkostenMitPuffer,
        angebotsBewertung:          calculations.angebotsBewertung?.einschaetzung
          ? { einschaetzung: calculations.angebotsBewertung.einschaetzung!, abweichungProzent: calculations.angebotsBewertung.abweichungProzent }
          : null,
        grundlagen:                 calculations.grundlagen,
        zusatzAngaben:              input.zusatzAngaben,
      });
      const aiResponse = await callAI({ systemPrompt: SANIERUNG_SYSTEM_PROMPT, userMessage, maxTokens: 2000 });
      const rawAnalyse = extractJSON(aiResponse.content);
      const validated = KiAnalyseSchema.safeParse(rawAnalyse);
      ki_analyse = validated.success ? validated.data : rawAnalyse;
      ki_verfuegbar = true;
    } catch (err) {
      console.error("KI-Analyse fehlgeschlagen:", err);
    }
  }

  return NextResponse.json({ success: true, result: { calculations, ki_analyse, ki_verfuegbar } });
}
