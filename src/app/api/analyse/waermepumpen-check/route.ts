import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { WAERMEPUMPE_SYSTEM_PROMPT, buildWaermepumpeUserMessage } from "@/lib/ai/prompts/waermepumpe";
import { berechneWaermepumpe } from "@/lib/calculations/waermepumpe";

const InputSchema = z.object({
  wohnflaeche:        z.number().positive().max(2000),
  gebaeudetyp:        z.enum(["altbau_unsaniert", "altbau_teilsaniert", "baujahr80", "neubau_kfw55", "neubau_kfw40"]),
  wpTyp:              z.enum(["luft", "sole", "wasser"]),
  angebotspreis:      z.number().positive().max(200_000),
  heizwaermebedarf:   z.number().positive().max(500_000).optional(),
  strompreisWP:       z.number().min(0.1).max(0.5).optional(),
  gaspreisAktuell:    z.number().min(0.01).max(0.3).optional(),
  mitISFP:            z.boolean().optional(),
  einkommensbonus:    z.boolean().optional(),
  zusatzAngaben:      z.string().max(2000).optional(),
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
  foerderHinweise:          z.array(z.string()),
  fragenFuerInstallateur:   z.array(z.string()),
  einschraenkungen:         z.array(z.string()),
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
  const calculations = berechneWaermepumpe(input);

  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const gebaeudeLabelMap: Record<string, string> = {
        altbau_unsaniert:   "Altbau (unsaniert, vor 1979)",
        altbau_teilsaniert: "Altbau (teilsaniert)",
        baujahr80:          "EFH ca. 1980–2000",
        neubau_kfw55:       "Neubau / KfW 55",
        neubau_kfw40:       "Neubau / KfW 40 (GEG 2023)",
      };
      const userMessage = buildWaermepumpeUserMessage({
        wohnflaeche:              input.wohnflaeche,
        gebaeudetyp:              gebaeudeLabelMap[input.gebaeudetyp] ?? input.gebaeudetyp,
        wpTyp:                    input.wpTyp,
        angebotspreis:            input.angebotspreis,
        mitISFP:                  input.mitISFP ?? false,
        einkommensbonus:          input.einkommensbonus ?? false,
        heizwaermebedarfKWh:      calculations.heizwaermebedarfKWh,
        stromverbrauchWPKWh:      calculations.stromverbrauchWPKWh,
        betriebskostenJaehrlich:  calculations.betriebskostenJaehrlich,
        vergleichGasJaehrlich:    calculations.vergleichGasJaehrlich,
        einsparungJaehrlich:      calculations.einsparungJaehrlich,
        foerderungBAFA:           calculations.foerderungBAFA,
        foerderungSatz:           calculations.foerderungSatz,
        nettokostenNachFoerderung: calculations.nettokostenNachFoerderung,
        amortisationJahre:        calculations.amortisationJahre,
        grundlagen:               calculations.grundlagen,
        zusatzAngaben:            input.zusatzAngaben,
      });
      const aiResponse = await callAI({ systemPrompt: WAERMEPUMPE_SYSTEM_PROMPT, userMessage, maxTokens: 2000 });
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
