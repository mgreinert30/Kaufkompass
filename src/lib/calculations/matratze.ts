// Matratzen-Check – Berechnungsmodul (KI-basiert)
export interface MatratzeInput {
  matratzenTyp: string;
  haertegrad: string;
  angebotspreis: number;
  breite?: number; laenge?: number;
  hersteller?: string; modell?: string;
  koerpergewicht?: number;
  schlaflage?: string;
  mitProbeliegen?: boolean;
  garantieJahre?: number;
  zusatzAngaben?: string;
}

export interface MatratzeErgebnis {
  typLabel: string;
  referenzPreis: { min: number; max: number; mittel: number };
  preiseinschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer";
  preisHinweis: string;
  grundlagen: string[];
}

const TYPEN: Record<string, { label: string; preise: { min: number; max: number; mittel: number } }> = {
  kaltschaum:        { label: "Kaltschaummatratze",    preise: { min: 100, max: 800,   mittel: 300  } },
  taschenfederkern:  { label: "Taschenfederkern",      preise: { min: 150, max: 1_200, mittel: 450  } },
  latex:             { label: "Latexmatratze",          preise: { min: 200, max: 1_500, mittel: 600  } },
  visco:             { label: "Visco-/Memoryfoam",     preise: { min: 150, max: 1_000, mittel: 400  } },
  gel:               { label: "Gelmatratze",            preise: { min: 200, max: 1_200, mittel: 500  } },
  hybrid:            { label: "Hybridmatratze",         preise: { min: 300, max: 2_000, mittel: 700  } },
  wasserbett:        { label: "Wasserbettmatratze",     preise: { min: 400, max: 3_000, mittel: 1_200 } },
  sonstiges:         { label: "Sonstige",               preise: { min: 50,  max: 2_000, mittel: 350  } },
};

export function berechneMatratze(input: MatratzeInput): MatratzeErgebnis {
  const typ = TYPEN[input.matratzenTyp] ?? TYPEN.sonstiges;
  const { min, max, mittel } = typ.preise;
  const p = input.angebotspreis;
  let einschaetzung: MatratzeErgebnis["preiseinschaetzung"] = "marktgerecht";
  let preisHinweis = "";

  if (p < min * 0.7) { einschaetzung = "sehr_guenstig"; preisHinweis = `Sehr günstiger Preis – prüfe Qualität und Garantiebedingungen sorgfältig.`; }
  else if (p < mittel * 0.85) { einschaetzung = "guenstig"; preisHinweis = `Günstiger Preis für eine ${typ.label}.`; }
  else if (p <= mittel * 1.2) { einschaetzung = "marktgerecht"; preisHinweis = `Marktgerechter Preis für eine ${typ.label}.`; }
  else if (p <= max * 1.1) { einschaetzung = "teuer"; preisHinweis = `Vergleichsweise teuer – prüfe ob Zusatzleistungen (Lieferung, Probeschlafen) enthalten sind.`; }
  else { einschaetzung = "sehr_teuer"; preisHinweis = `Sehr teuer. Hole Vergleichsangebote ein.`; }

  return {
    typLabel: typ.label,
    referenzPreis: { min, max, mittel },
    preiseinschaetzung: einschaetzung,
    preisHinweis,
    grundlagen: [
      "Stiftung Warentest Matratzen-Tests 2023/2024",
      "Handelsverband Textil, Schuhe, Lederwaren (BTE) – Marktdaten 2024",
      "IKEA, Bettenwelt, Emma, Casper Preisvergleiche",
    ],
  };
}
