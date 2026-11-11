// Smartphone-Check – Berechnungsmodul
export type SmartphoneSegment = "einsteiger" | "mittelklasse" | "oberklasse" | "flagship";

export interface SmartphoneInput {
  segment: SmartphoneSegment; angebotspreis: number;
  hersteller?: string; modell?: string;
  speicherGb?: number; ramGb?: number;
  akkuMah?: number; displayZoll?: number;
  erscheinungsjahr?: number;
  mitVertrag?: boolean; vertragslaufzeit?: number; monatlicheRate?: number;
  zusatzAngaben?: string;
}

export interface SmartphoneErgebnis {
  segmentLabel: string;
  referenzPreis: { min: number; max: number; mittel: number };
  angebotsBewertung: { einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer"; hinweis: string };
  alterHinweis: string | null;
  vertragKosten: { gesamtkosten: number; geraetAnteil: number; tarifAnteil: number } | null;
  qualitaetsHinweise: string[];
  grundlagen: string[];
}

const SEGMENTE: Record<SmartphoneSegment, { label: string; preise: { min: number; max: number; mittel: number } }> = {
  einsteiger:  { label: "Einsteiger",   preise: { min: 100, max: 300,   mittel: 180 } },
  mittelklasse:{ label: "Mittelklasse", preise: { min: 250, max: 550,   mittel: 380 } },
  oberklasse:  { label: "Oberklasse",   preise: { min: 450, max: 900,   mittel: 650 } },
  flagship:    { label: "Flagship",     preise: { min: 800, max: 2_000, mittel: 1_200 } },
};

export function berechneSmartphone(input: SmartphoneInput): SmartphoneErgebnis {
  const ref = SEGMENTE[input.segment];
  const p = ref.preise;
  let einschaetzung: SmartphoneErgebnis["angebotsBewertung"]["einschaetzung"];
  let hinweis: string;
  if      (input.angebotspreis < p.min * 0.75) { einschaetzung = "sehr_guenstig"; hinweis = "Sehr günstiger Preis – Neuheit vs. älteres Modell prüfen."; }
  else if (input.angebotspreis < p.min)         { einschaetzung = "guenstig";      hinweis = "Günstiger Preis – auf Vollständigkeit achten."; }
  else if (input.angebotspreis <= p.max)        { einschaetzung = "marktgerecht";  hinweis = "Preis im marktüblichen Bereich."; }
  else if (input.angebotspreis <= p.max * 1.2)  { einschaetzung = "teuer";         hinweis = "Preis eher hoch – auf Besonderheiten achten."; }
  else                                           { einschaetzung = "sehr_teuer";   hinweis = "Sehr hoher Preis – Vergleichsangebote einholen."; }

  const alterHinweis = input.erscheinungsjahr && (new Date().getFullYear() - input.erscheinungsjahr) > 2
    ? `Erscheinungsjahr ${input.erscheinungsjahr}: Prüfe, ob noch Android/iOS-Updates gewährleistet sind.`
    : null;

  let vertragKosten: SmartphoneErgebnis["vertragKosten"] = null;
  if (input.mitVertrag && input.monatlicheRate && input.vertragslaufzeit) {
    const gesamtkosten = input.monatlicheRate * input.vertragslaufzeit;
    const tarifAnteil = Math.round(gesamtkosten - input.angebotspreis);
    vertragKosten = { gesamtkosten, geraetAnteil: input.angebotspreis, tarifAnteil: tarifAnteil > 0 ? tarifAnteil : 0 };
  }

  const qualitaetsHinweise = [
    "Updateversprechen: Android mind. 3 Jahre, iOS mind. 5 Jahre",
    input.akkuMah && input.akkuMah < 3_000 ? "Kleiner Akku: Externe Powerbank empfehlenswert" : "Akkukapazität im guten Bereich",
    "IP-Schutzklasse für Wasser/Staub prüfen (IP68 ideal)",
    "Garantie: 2 Jahre Herstellergarantie Standard (EU)",
  ];

  return {
    segmentLabel: ref.label,
    referenzPreis: p,
    angebotsBewertung: { einschaetzung, hinweis },
    alterHinweis,
    vertragKosten,
    qualitaetsHinweise,
    grundlagen: ["Referenzpreise: idealo.de, Geizhals.de Marktdaten 2024", "Vertragskosten: Gesamtkosten über Laufzeit"],
  };
}
