import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callAI, isAIAvailable, extractJSON } from "@/lib/ai/provider";
import { IMMOBILIEN_SYSTEM_PROMPT, buildImmobilienUserMessage } from "@/lib/ai/prompts/immobilien";
import {
  berechneKaufnebenkosten,
  berechneFinanzierung,
  berechneKaufpreisProQm,
  BUNDESLAENDER,
} from "@/lib/calculations/immobilien";
import { formatQuelleForResult } from "@/lib/data-sources/registry";

// Eingabe-Schema
const InputSchema = z.object({
  bundesland:      z.enum(BUNDESLAENDER as [string, ...string[]]),
  immobilientyp:   z.enum(["Einfamilienhaus", "Doppelhaushälfte", "Reihenhaus", "Eigentumswohnung", "Mehrfamilienhaus", "Grundstück"]),
  wohnflaeche:     z.number().positive().optional(),
  baujahr:         z.number().int().min(1850).max(2030).optional(),
  kaufpreis:       z.number().positive().max(50_000_000),
  eigenkapital:    z.number().min(0),
  mitMakler:       z.boolean(),
  maklerprovision: z.number().min(0).max(0.1).optional(),
  zusatzAngaben:   z.string().max(2000).optional(),
});

type Input = z.infer<typeof InputSchema>;

// KI-Antwort-Schema (zur Validierung)
const KiAnalyseSchema = z.object({
  zusammenfassung: z.string(),
  bewertung: z.object({
    einschaetzung: z.string(),
    begruendung:   z.string(),
    einschraenkungen: z.array(z.string()),
  }),
  risikohinweise: z.array(z.object({
    schweregrad: z.enum(["hoch", "mittel", "niedrig"]),
    hinweis:     z.string(),
    empfehlung:  z.string(),
  })),
  fragenfuerBesichtigung: z.array(z.string()),
  fehlendeinformationen:  z.array(z.string()),
  einschraenkungen:       z.array(z.string()),
});

export async function POST(req: NextRequest) {
  // Rate-Limit-Header (einfach, ohne Redis)
  const ip = req.headers.get("x-forwarded-for") ?? "unbekannt";
  void ip; // wird für späteres Rate-Limiting genutzt

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Ungültige JSON-Anfrage" }, { status: 400 });
  }

  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Eingabefehler", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const input: Input = parsed.data;

  // 1. Deterministische Berechnungen
  const kaufnebenkosten = berechneKaufnebenkosten({
    kaufpreis:       input.kaufpreis,
    bundesland:      input.bundesland,
    mitMakler:       input.mitMakler,
    maklerprovision: input.maklerprovision,
  });

  const finanzierung = berechneFinanzierung({
    kaufpreis:       input.kaufpreis,
    kaufnebenkosten: kaufnebenkosten.gesamt,
    eigenkapital:    input.eigenkapital,
  });

  const preisProQm = input.wohnflaeche
    ? berechneKaufpreisProQm(input.kaufpreis, input.wohnflaeche)
    : null;

  const quellen = [
    formatQuelleForResult("grunderwerbsteuer_tabelle", "2024"),
  ];

  const calculations = {
    kaufpreis:        input.kaufpreis,
    kaufnebenkosten,
    gesamtinvestition: input.kaufpreis + kaufnebenkosten.gesamt,
    eigenkapital:     input.eigenkapital,
    finanzierung,
    preisProQm,
  };

  // 2. KI-Analyse (optional – falls kein API-Schlüssel, Fallback)
  let ki_analyse = null;
  let ki_verfuegbar = false;

  if (isAIAvailable()) {
    try {
      const userMessage = buildImmobilienUserMessage({
        immobilientyp:  input.immobilientyp,
        bundesland:     input.bundesland,
        wohnflaeche:    input.wohnflaeche,
        baujahr:        input.baujahr,
        kaufpreis:      input.kaufpreis,
        eigenkapital:   input.eigenkapital,
        kaufnebenkosten,
        finanzierung,
        preisProQm,
        zusatzAngaben:  input.zusatzAngaben,
      });

      const aiResponse = await callAI({
        systemPrompt: IMMOBILIEN_SYSTEM_PROMPT,
        userMessage,
        maxTokens: 2500,
      });

      const rawAnalyse = extractJSON(aiResponse.content);
      const validatedAnalyse = KiAnalyseSchema.safeParse(rawAnalyse);

      if (validatedAnalyse.success) {
        ki_analyse = validatedAnalyse.data;
        ki_verfuegbar = true;
      } else {
        // Wenn KI-Antwort nicht dem Schema entspricht, trotzdem rawAnalyse verwenden
        ki_analyse = rawAnalyse;
        ki_verfuegbar = true;
      }
    } catch (err) {
      // KI-Fehler blockieren nicht die Berechnungen
      console.error("KI-Analyse fehlgeschlagen:", err);
    }
  }

  return NextResponse.json({
    success: true,
    result: {
      calculations,
      ki_analyse,
      ki_verfuegbar,
      quellen,
    },
  });
}
