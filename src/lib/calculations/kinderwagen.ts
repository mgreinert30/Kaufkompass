// Kinderwagen-Check – Berechnungsmodul (KI-basiert)
export interface KinderwagenInput {
  typ: string;
  angebotspreis: number;
  hersteller?: string; modell?: string;
  gewichtKg?: number;
  faltbar?: boolean;
  normen?: string; // z.B. EN 1888
  nutzungszeitraum?: string; // neugeboren, ab_6monate, ab_1jahr
  zusatzAngaben?: string;
}

export interface KinderwagenErgebnis {
  typLabel: string;
  referenzPreis: { min: number; max: number; mittel: number };
  preiseinschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer";
  preisHinweis: string;
  sicherheitsHinweis: string;
  grundlagen: string[];
}

const TYPEN: Record<string, { label: string; preise: { min: number; max: number; mittel: number } }> = {
  kombikinderwagen:   { label: "Kombikinderwagen",        preise: { min: 200,   max: 2_000, mittel: 700   } },
  buggy:              { label: "Buggy / Leichtkinderwagen",preise: { min: 50,    max: 600,   mittel: 200   } },
  joggingkinderwagen: { label: "Joggingkinderwagen",      preises: { min: 200,  max: 1_500, mittel: 500   } } as unknown as { label: string; preise: { min: number; max: number; mittel: number } },
  reisebuggy:         { label: "Reisebuggy",              preise: { min: 80,    max: 500,   mittel: 200   } },
  geschwisterwagen:   { label: "Geschwisterwagen",        preise: { min: 300,   max: 2_000, mittel: 900   } },
  tragetasche:        { label: "Tragetasche / Tragehilfe",preise: { min: 30,    max: 300,   mittel: 100   } },
  sonstiges:          { label: "Sonstiges",               preise: { min: 50,    max: 1_500, mittel: 400   } },
};

export function berechneKinderwagen(input: KinderwagenInput): KinderwagenErgebnis {
  const typ = TYPEN[input.typ] ?? TYPEN.sonstiges;
  const preise = typ.preise ?? { min: 50, max: 1500, mittel: 400 };
  const { min, max, mittel } = preise;
  const p = input.angebotspreis;
  let einschaetzung: KinderwagenErgebnis["preiseinschaetzung"] = "marktgerecht";
  let preisHinweis = "";

  if (p < min * 0.7) { einschaetzung = "sehr_guenstig"; preisHinweis = `Sehr günstiger Preis – prüfe Sicherheitsnormen (EN 1888) und Verarbeitungsqualität.`; }
  else if (p < mittel * 0.85) { einschaetzung = "guenstig"; preisHinweis = `Günstiger Preis für einen ${typ.label}.`; }
  else if (p <= mittel * 1.2) { einschaetzung = "marktgerecht"; preisHinweis = `Marktgerechter Preis.`; }
  else if (p <= max * 1.1) { einschaetzung = "teuer"; preisHinweis = `Vergleichsweise teuer – prüfe den Mehrwert (Zubehör, Garantie, Marke).`; }
  else { einschaetzung = "sehr_teuer"; preisHinweis = `Sehr teuer. Vergleichsangebote einholen.`; }

  return {
    typLabel: typ.label,
    referenzPreis: { min, max, mittel },
    preiseinschaetzung: einschaetzung,
    preisHinweis,
    sicherheitsHinweis: "Achte auf EN 1888-Norm, GS-Zeichen und TÜV-Prüfzeichen. Wichtig: Gurtsystem, Bremse, Standfestigkeit.",
    grundlagen: [
      "Stiftung Warentest Kinderwagen-Tests 2023/2024",
      "ADAC Kinderwagen-Test",
      "BabyOne, Böklunder Babymarkt Marktpreise 2024",
    ],
  };
}
