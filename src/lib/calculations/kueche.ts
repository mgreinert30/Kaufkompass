// Küchen-Kaufcheck – Berechnungsmodul
// Referenz: Statista Küchenstudio-Markt, ZVEI, BHB Marktdaten
// Bundesweite Mittelwerte; regional und markenabhängig stark abweichend

export type KuecheGroesse = "klein" | "mittel" | "gross" | "xlarge";
export type KuecheTyp = "l_form" | "u_form" | "gerade" | "insel";
export type AusstattungsNiveau = "basis" | "mittel" | "premium";

export interface KuecheInput {
  angebotspreis: number;
  groesse: KuecheGroesse;
  typ: KuecheTyp;
  ausstattung: AusstattungsNiveau;
  mitMontage: boolean;
  mitElektrogeraeten: boolean;
  marke?: string; // optional für KI-Einordnung
  laufmeter?: number; // laufende Meter Schrankelemente
  zusatzAngaben?: string;
}

interface PreisBandbreite {
  min: number;
  mittel: number;
  max: number;
  quelle: string;
}

export interface KuecheKostenErgebnis {
  angebotspreis: number;
  groesseLabel: string;
  typLabel: string;
  ausstattungLabel: string;

  // Referenzpreise
  referenzPreis: PreisBandbreite;
  angebotsBewertung: {
    einschaetzung: "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer" | null;
    abweichungProzent: number | null;
    hinweis: string;
  };

  // Kostenaufschlüsselung
  kostenAufstellung: {
    unterschraenke: { min: number; max: number };
    oberschraenke: { min: number; max: number };
    elektrogeraete: { min: number; max: number } | null;
    montage: { min: number; max: number } | null;
    arbeitsplatte: { min: number; max: number };
    anschlussarbeiten: { min: number; max: number };
    gesamtMitPuffer: { min: number; max: number };
  };

  // Puffer
  empfohlenerPuffer: number;
  pufferProzent: number;

  grundlagen: string[];
}

// Referenzpreise nach Größe und Ausstattung (inkl. Montage, netto)
// Quelle: BHB Marktdaten 2023, Statista Küchenmarkt, Branchenverbände
const REFERENZ_PREISE: Record<
  KuecheGroesse,
  Record<AusstattungsNiveau, { min: number; max: number; mittel: number }>
> = {
  klein: {
    basis:   { min: 3_000, max:  6_000, mittel:  4_500 },
    mittel:  { min: 5_000, max: 10_000, mittel:  7_500 },
    premium: { min: 8_000, max: 18_000, mittel: 13_000 },
  },
  mittel: {
    basis:   { min:  5_000, max: 10_000, mittel:  7_500 },
    mittel:  { min:  8_000, max: 16_000, mittel: 12_000 },
    premium: { min: 14_000, max: 30_000, mittel: 22_000 },
  },
  gross: {
    basis:   { min:  8_000, max: 15_000, mittel: 11_500 },
    mittel:  { min: 12_000, max: 22_000, mittel: 17_000 },
    premium: { min: 20_000, max: 45_000, mittel: 32_500 },
  },
  xlarge: {
    basis:   { min: 12_000, max: 22_000, mittel: 17_000 },
    mittel:  { min: 18_000, max: 35_000, mittel: 26_500 },
    premium: { min: 30_000, max: 70_000, mittel: 50_000 },
  },
};

// Elektrogeräte-Referenz (wenn mitElektrogeraeten = true)
const ELEKTROGERAETE_KOSTEN: Record<
  AusstattungsNiveau,
  { min: number; max: number }
> = {
  basis:   { min: 1_200, max: 2_500 },
  mittel:  { min: 2_500, max: 5_000 },
  premium: { min: 5_000, max: 15_000 },
};

// Montagekosten je Laufmeter (wenn mitMontage = true)
const MONTAGE_PRO_LM = { min: 150, max: 350 };

export function berechneKueche(input: KuecheInput): KuecheKostenErgebnis {
  const { angebotspreis, groesse, typ, ausstattung, mitMontage, mitElektrogeraeten, laufmeter } = input;

  const refRaw = REFERENZ_PREISE[groesse][ausstattung];
  const ref: PreisBandbreite = {
    min: refRaw.min,
    mittel: refRaw.mittel,
    max: refRaw.max,
    quelle: "BHB Marktdaten 2023, Statista Küchenmarkt Deutschland",
  };

  // Elektrogeräte- und Montageanteil hinzurechnen falls inklusive
  let refMin = ref.min;
  let refMittel = ref.mittel;
  let refMax = ref.max;

  if (!mitElektrogeraeten) {
    // Referenzpreise schließen Geräte üblicherweise ein – abziehen
    const gerComp = ELEKTROGERAETE_KOSTEN[ausstattung];
    refMin   = Math.max(500, refMin   - gerComp.max);
    refMittel = refMittel - ((gerComp.min + gerComp.max) / 2);
    refMax   = refMax   - gerComp.min;
  }

  if (!mitMontage) {
    // Referenz enthält Montage – grob 10–15 % abziehen
    refMin   = Math.round(refMin   * 0.87);
    refMittel = Math.round(refMittel * 0.87);
    refMax   = Math.round(refMax   * 0.87);
  }

  // Angebotsbewertung
  let einschaetzung: KuecheKostenErgebnis["angebotsBewertung"]["einschaetzung"] = null;
  let abweichungProzent: number | null = null;
  let bewertungHinweis = "Kein Angebotsvergleich möglich (keine Referenz verfügbar).";

  if (angebotspreis > 0 && refMittel > 0) {
    abweichungProzent = Math.round(((angebotspreis - refMittel) / refMittel) * 100);

    if      (angebotspreis < refMin * 0.9)  { einschaetzung = "guenstig";   bewertungHinweis = "Preis liegt deutlich unter Marktdurchschnitt – Qualität und Vollständigkeit der Leistungen kritisch prüfen."; }
    else if (angebotspreis <= refMittel * 1.1) { einschaetzung = "marktgerecht"; bewertungHinweis = "Preis liegt im marktüblichen Rahmen."; }
    else if (angebotspreis <= refMax * 1.1)    { einschaetzung = "teuer";     bewertungHinweis = "Preis liegt im oberen Marktbereich – auf Qualität und Vollständigkeit achten."; }
    else                                       { einschaetzung = "sehr_teuer"; bewertungHinweis = "Preis überschreitet Marktrahmen deutlich – Verhandlung und Vergleichsangebote empfohlen."; }
  }

  // Laufmeter schätzen falls nicht angegeben
  const lm = laufmeter ?? (groesse === "klein" ? 3 : groesse === "mittel" ? 4.5 : groesse === "gross" ? 6 : 8);

  // Einzelposten-Schätzung (Orientierung)
  const kostenAufstellung: KuecheKostenErgebnis["kostenAufstellung"] = {
    unterschraenke: {
      min: Math.round(lm * 200),
      max: Math.round(lm * 600),
    },
    oberschraenke: {
      min: Math.round(lm * 150),
      max: Math.round(lm * 500),
    },
    elektrogeraete: mitElektrogeraeten ? ELEKTROGERAETE_KOSTEN[ausstattung] : null,
    montage: mitMontage
      ? { min: Math.round(lm * MONTAGE_PRO_LM.min), max: Math.round(lm * MONTAGE_PRO_LM.max) }
      : null,
    arbeitsplatte: {
      min: Math.round(lm * 150),
      max: Math.round(lm * 800),
    },
    anschlussarbeiten: { min: 300, max: 1_200 },
    gesamtMitPuffer: {
      min: Math.round(refMin   * 1.05),
      max: Math.round(refMax   * 1.15),
    },
  };

  const pufferProzent = 10;
  const empfohlenerPuffer = Math.round(angebotspreis * (pufferProzent / 100));

  const groesseLabels: Record<KuecheGroesse, string> = {
    klein: "Klein (bis ~8 m²)",
    mittel: "Mittel (8–14 m²)",
    gross: "Groß (14–20 m²)",
    xlarge: "Sehr groß (20+ m²)",
  };
  const typLabels: Record<KuecheTyp, string> = {
    l_form: "L-Form",
    u_form: "U-Form",
    gerade: "Einzeilig (Gerade)",
    insel: "Inselküche",
  };
  const ausstattungLabels: Record<AusstattungsNiveau, string> = {
    basis: "Basis",
    mittel: "Standard",
    premium: "Premium",
  };

  const grundlagen: string[] = [
    "Referenzpreise: BHB Marktdaten 2023, Statista Küchenmarkt Deutschland",
    "Montage: ca. 150–350 € je Laufmeter Schrankelemente",
    "Elektrogeräte: Einbaugeräte-Set nach Ausstattungsniveau",
    "Puffer: 10 % für Nacharbeiten, Lieferabweichungen und Anpassungen",
    `Laufmeter-Schätzung: ${lm} lm (${laufmeter ? "Nutzereingabe" : "geschätzt nach Größe"})`,
  ];

  return {
    angebotspreis,
    groesseLabel:    groesseLabels[groesse],
    typLabel:        typLabels[typ],
    ausstattungLabel: ausstattungLabels[ausstattung],
    referenzPreis: { ...ref, min: refMin, mittel: refMittel, max: refMax },
    angebotsBewertung: { einschaetzung, abweichungProzent, hinweis: bewertungHinweis },
    kostenAufstellung,
    empfohlenerPuffer,
    pufferProzent,
    grundlagen,
  };
}
