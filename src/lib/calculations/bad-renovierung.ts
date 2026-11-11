// Badezimmer-Renovierungscheck – Berechnungsmodul
// Referenz: Destatis Baupreise, Handwerksverbände, BHB Sanitärmarkt 2023/2024
// Bundesweite Mittelwerte; regional und nach Ausführung stark abweichend

export type BadAusstattung = "basis" | "komfort" | "premium";
export type BadGroesse = "klein" | "mittel" | "gross";

export interface BadRenovierungInput {
  flaeche?: number;        // m² Badfläche
  ausstattung: BadAusstattung;
  groesse: BadGroesse;
  angebotspreis?: number;
  baujahr?: number;        // Gebäudebaujahr (ältere Bäder = mehr Risiko)
  mitBarrierefreiheit: boolean;
  mitHeizung: boolean;     // Fußbodenheizung o.Ä. inklusive
  zusatzAngaben?: string;
}

export interface BadRenovierungErgebnis {
  groesseLabel: string;
  ausstattungLabel: string;
  flaeche: number;         // effektiv (Schätzung wenn nicht angegeben)

  // Referenzkosten gesamt
  referenzMin: number;
  referenzMittel: number;
  referenzMax: number;
  referenzQuelle: string;

  // Aufschlüsselung
  kostenAufstellung: {
    abbruchEntsorgung:  { min: number; max: number };
    fliesen:            { min: number; max: number };
    sanitaerObjekte:    { min: number; max: number };
    installation:       { min: number; max: number };
    elektro:            { min: number; max: number };
    barrierefreiheit:   { min: number; max: number } | null;
    heizung:            { min: number; max: number } | null;
    sonstiges:          { min: number; max: number };
  };

  // Angebotsbewertung
  angebotsBewertung: {
    einschaetzung: "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer" | null;
    abweichungProzent: number | null;
    hinweis: string;
  };

  puffer: number;
  pufferProzent: number;
  grundlagen: string[];
}

// Referenzkosten je m² nach Ausstattung
// Quelle: Sanitärhandwerk, BHB 2023/2024
const KOSTEN_PRO_QM: Record<BadAusstattung, { min: number; mittel: number; max: number }> = {
  basis:   { min: 600,  mittel: 900,  max: 1300 },
  komfort: { min: 900,  mittel: 1400, max: 2000 },
  premium: { min: 1500, mittel: 2500, max: 4000 },
};

const GROESSE_DEFAULT_QM: Record<BadGroesse, number> = {
  klein:  5,
  mittel: 8,
  gross:  14,
};

export function berechneBadRenovierung(input: BadRenovierungInput): BadRenovierungErgebnis {
  const { ausstattung, groesse, angebotspreis, mitBarrierefreiheit, mitHeizung } = input;

  const effFlaeche = input.flaeche ?? GROESSE_DEFAULT_QM[groesse];
  const ref = KOSTEN_PRO_QM[ausstattung];

  let refMin    = Math.round(ref.min    * effFlaeche);
  let refMittel = Math.round(ref.mittel * effFlaeche);
  let refMax    = Math.round(ref.max    * effFlaeche);

  // Barrierefreiheit: +15–30 %
  if (mitBarrierefreiheit) {
    refMin    = Math.round(refMin    * 1.15);
    refMittel = Math.round(refMittel * 1.20);
    refMax    = Math.round(refMax    * 1.30);
  }

  // Fußbodenheizung: Pauschal +1.500–3.500 €
  if (mitHeizung) {
    refMin    += 1_500;
    refMittel += 2_500;
    refMax    += 3_500;
  }

  // Kostenaufstellung (anteilige Schätzung)
  const kostenAufstellung: BadRenovierungErgebnis["kostenAufstellung"] = {
    abbruchEntsorgung: {
      min: Math.round(effFlaeche * 50),
      max: Math.round(effFlaeche * 150),
    },
    fliesen: {
      min: Math.round(effFlaeche * 80  + effFlaeche * 2.5 * 80),  // Wand + Boden
      max: Math.round(effFlaeche * 200 + effFlaeche * 2.5 * 200),
    },
    sanitaerObjekte: ausstattung === "basis"
      ? { min: 1_200, max: 2_500 }
      : ausstattung === "komfort"
      ? { min: 2_500, max: 5_000 }
      : { min: 5_000, max: 15_000 },
    installation: {
      min: Math.round(effFlaeche * 100),
      max: Math.round(effFlaeche * 250),
    },
    elektro: { min: 400, max: 1_200 },
    barrierefreiheit: mitBarrierefreiheit ? { min: 2_000, max: 8_000 } : null,
    heizung:          mitHeizung          ? { min: 1_500, max: 3_500 } : null,
    sonstiges: {
      min: Math.round(refMin * 0.05),
      max: Math.round(refMax * 0.10),
    },
  };

  // Angebotsbewertung
  let einschaetzung: BadRenovierungErgebnis["angebotsBewertung"]["einschaetzung"] = null;
  let abweichungProzent: number | null = null;
  let bewertungHinweis = "Kein Angebotsvergleich (kein Angebotspreis eingegeben).";

  if (angebotspreis && angebotspreis > 0) {
    abweichungProzent = Math.round(((angebotspreis - refMittel) / refMittel) * 100);
    if      (angebotspreis < refMin * 0.9)     { einschaetzung = "guenstig";   bewertungHinweis = "Preis unter Marktdurchschnitt – Ausführungsqualität und Vollständigkeit prüfen."; }
    else if (angebotspreis <= refMittel * 1.1) { einschaetzung = "marktgerecht"; bewertungHinweis = "Preis im marktüblichen Rahmen."; }
    else if (angebotspreis <= refMax * 1.1)    { einschaetzung = "teuer";     bewertungHinweis = "Preis im oberen Marktbereich."; }
    else                                       { einschaetzung = "sehr_teuer"; bewertungHinweis = "Preis überschreitet Marktrahmen deutlich – Vergleichsangebote einholen."; }
  }

  const pufferProzent = 15; // Bäder haben mehr unvorhergesehenes (Leitungen, Schimmel)
  const basis = angebotspreis ?? refMittel;
  const puffer = Math.round(basis * (pufferProzent / 100));

  const groesseLabels: Record<BadGroesse, string> = {
    klein:  "Klein (bis 6 m²)",
    mittel: "Mittel (6–10 m²)",
    gross:  "Groß (10+ m²)",
  };
  const ausstattungLabels: Record<BadAusstattung, string> = {
    basis:   "Basis",
    komfort: "Komfort",
    premium: "Premium",
  };

  const grundlagen: string[] = [
    "Referenzpreise: Sanitärhandwerk, BHB Marktdaten 2023/2024",
    `Fläche: ${effFlaeche} m² (${input.flaeche ? "Nutzereingabe" : "geschätzt nach Größe"})`,
    "Puffer: 15 % für unvorhergesehene Positionen (Leitungen, Schimmel, bauliche Besonderheiten)",
    "Keine staatliche Förderung für Standard-Badsanierungen (Ausnahme: Barrierefreiheit KfW 455-B)",
    mitBarrierefreiheit ? "Barrierefreiheit: Zuschlag +15–30 %; KfW 455-B Programm prüfen" : "",
    mitHeizung ? "Fußbodenheizung: Pauschalzuschlag 1.500–3.500 €" : "",
  ].filter(Boolean);

  return {
    groesseLabel: groesseLabels[groesse],
    ausstattungLabel: ausstattungLabels[ausstattung],
    flaeche: effFlaeche,
    referenzMin:    refMin,
    referenzMittel: refMittel,
    referenzMax:    refMax,
    referenzQuelle: "Sanitärhandwerk, BHB Marktdaten 2023/2024",
    kostenAufstellung,
    angebotsBewertung: { einschaetzung, abweichungProzent, hinweis: bewertungHinweis },
    puffer,
    pufferProzent,
    grundlagen,
  };
}
