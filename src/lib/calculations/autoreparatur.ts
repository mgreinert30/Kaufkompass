// Autoreparatur-Check – Berechnungsmodul
// Referenz: DAT Lohnkostenspiegel, ZDK Stundensatzerhebung, ADAC Werkstattdaten
// Hinweis: Stundensätze je nach Region und Betriebstyp stark unterschiedlich

export type WerkstattTyp = "markenwerkstatt" | "freie_werkstatt" | "schnellservice";
export type FahrzeugKlasse = "kleinwagen" | "kompakt" | "mittelklasse" | "oberklasse" | "nutzfahrzeug";

export interface ReparaturPosition {
  beschreibung: string;
  arbeitsstunden?: number;
  teilepreis?: number;
}

export interface AutoreparaturInput {
  werkstattTyp: WerkstattTyp;
  fahrzeugKlasse: FahrzeugKlasse;
  angebotspreis: number;
  arbeitszeit?: number;         // in Arbeitsstunden
  stundensatz?: number;         // angebotener Stundensatz
  positionen?: ReparaturPosition[];
  hauptarbeit?: string;         // z.B. "Bremsenwechsel", "Inspektion"
  fahrzeugAlter?: number;       // in Jahren
  kilometerstand?: number;
  zusatzAngaben?: string;
}

export interface AutoreparaturErgebnis {
  werkstattLabel: string;
  fahrzeugKlasseLabel: string;

  // Stundensatz-Einschätzung
  stundensatzReferenz: { min: number; max: number; marktMittel: number };
  stundensatzBewertung: {
    einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer";
    hinweis: string;
  } | null;

  // Gesamtpreis-Einschätzung
  angebotsBewertung: {
    einschaetzung: "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer" | "unbekannt";
    hinweis: string;
  };

  // Kostenaufschlüsselung
  kostenaufschluesselung: {
    arbeitskosten:  number | null;
    teilekosten:    number | null;
    sonstige:       number | null;
    gesamt:         number;
  };

  // Transparenz-Score (0-3: wie nachvollziehbar ist das Angebot)
  transparenzScore: number;
  transparenzHinweise: string[];

  risikoHinweise: string[];
  grundlagen: string[];
}

// Stundensätze nach Werkstatt-Typ und Fahrzeugklasse
// Quelle: DAT Lohnkostenspiegel 2023/2024, ZDK-Stundensatzerhebung
const STUNDENSAETZE: Record<WerkstattTyp, Record<FahrzeugKlasse, { min: number; max: number; mittel: number }>> = {
  markenwerkstatt: {
    kleinwagen:   { min: 110, max: 160, mittel: 135 },
    kompakt:      { min: 115, max: 170, mittel: 143 },
    mittelklasse: { min: 120, max: 185, mittel: 153 },
    oberklasse:   { min: 140, max: 220, mittel: 180 },
    nutzfahrzeug: { min: 115, max: 175, mittel: 145 },
  },
  freie_werkstatt: {
    kleinwagen:   { min: 75, max: 125, mittel: 100 },
    kompakt:      { min: 80, max: 130, mittel: 105 },
    mittelklasse: { min: 85, max: 140, mittel: 112 },
    oberklasse:   { min: 90, max: 150, mittel: 120 },
    nutzfahrzeug: { min: 80, max: 135, mittel: 108 },
  },
  schnellservice: {
    kleinwagen:   { min: 65, max: 110, mittel: 88 },
    kompakt:      { min: 70, max: 115, mittel: 93 },
    mittelklasse: { min: 75, max: 120, mittel: 98 },
    oberklasse:   { min: 80, max: 130, mittel: 105 },
    nutzfahrzeug: { min: 70, max: 120, mittel: 95 },
  },
};

export function berechneAutoreparatur(input: AutoreparaturInput): AutoreparaturErgebnis {
  const stRef = STUNDENSAETZE[input.werkstattTyp][input.fahrzeugKlasse];

  // Stundensatz-Einschätzung (wenn angegeben)
  let stundensatzBewertung: AutoreparaturErgebnis["stundensatzBewertung"] = null;
  if (input.stundensatz) {
    const abw = input.stundensatz - stRef.mittel;
    if      (input.stundensatz < stRef.min * 0.85) {
      stundensatzBewertung = { einschaetzung: "sehr_guenstig", hinweis: "Stundensatz ungewöhnlich niedrig – Qualität und Originalteile hinterfragen." };
    } else if (input.stundensatz < stRef.min) {
      stundensatzBewertung = { einschaetzung: "guenstig", hinweis: "Stundensatz günstig für diese Werkstattkategorie." };
    } else if (input.stundensatz <= stRef.max) {
      stundensatzBewertung = { einschaetzung: "marktgerecht", hinweis: `Stundensatz im marktüblichen Bereich (${stRef.min}–${stRef.max} €/h).` };
    } else if (input.stundensatz <= stRef.max * 1.2) {
      stundensatzBewertung = { einschaetzung: "teuer", hinweis: "Stundensatz leicht überdurchschnittlich – Vergleichsangebote einholen." };
    } else {
      stundensatzBewertung = { einschaetzung: "sehr_teuer", hinweis: "Stundensatz deutlich über Marktdurchschnitt – Begründung erfragen." };
    }
    void abw;
  }

  // Kostenaufschlüsselung
  let arbeitskosten: number | null = null;
  let teilekosten: number | null = null;

  if (input.arbeitszeit && input.stundensatz) {
    arbeitskosten = Math.round(input.arbeitszeit * input.stundensatz);
  }
  if (input.positionen) {
    const teileSumme = input.positionen.reduce((sum, p) => sum + (p.teilepreis ?? 0), 0);
    if (teileSumme > 0) teilekosten = Math.round(teileSumme);
    if (!arbeitskosten) {
      const arbeitsSumme = input.positionen.reduce((sum, p) => sum + ((p.arbeitsstunden ?? 0) * (input.stundensatz ?? stRef.mittel)), 0);
      if (arbeitsSumme > 0) arbeitskosten = Math.round(arbeitsSumme);
    }
  }

  const erklaerteSumme = (arbeitskosten ?? 0) + (teilekosten ?? 0);
  const sonstige = erklaerteSumme > 0 && erklaerteSumme < input.angebotspreis
    ? Math.round(input.angebotspreis - erklaerteSumme)
    : null;

  // Gesamtpreis-Bewertung (vereinfacht – echte Beurteilung durch KI)
  let angebotsBewertung: AutoreparaturErgebnis["angebotsBewertung"];
  if (erklaerteSumme === 0) {
    angebotsBewertung = { einschaetzung: "unbekannt", hinweis: "Keine Aufschlüsselung vorhanden – Vergleich nicht möglich." };
  } else {
    const abweichung = ((input.angebotspreis - erklaerteSumme) / erklaerteSumme) * 100;
    if (abweichung < -15) {
      angebotsBewertung = { einschaetzung: "guenstig", hinweis: "Gesamtpreis unter kalkuliertem Referenz – prüfe ob alle Positionen enthalten." };
    } else if (abweichung <= 15) {
      angebotsBewertung = { einschaetzung: "marktgerecht", hinweis: "Gesamtpreis entspricht der Kalkulation aus Arbeitszeit und Teilen." };
    } else if (abweichung <= 30) {
      angebotsBewertung = { einschaetzung: "teuer", hinweis: "Gesamtpreis über Kalkulation – lasse Positionen aufschlüsseln." };
    } else {
      angebotsBewertung = { einschaetzung: "sehr_teuer", hinweis: "Deutliche Abweichung zur Kalkulation – Positionen detailliert erfragen." };
    }
  }

  // Transparenz-Score
  let transparenzScore = 0;
  const transparenzHinweise: string[] = [];
  if (input.stundensatz)  { transparenzScore++; } else transparenzHinweise.push("Stundensatz nicht angegeben – unbedingt erfragen");
  if (input.arbeitszeit)  { transparenzScore++; } else transparenzHinweise.push("Arbeitszeit (Stunden) nicht ausgewiesen");
  if (teilekosten !== null){ transparenzScore++; } else transparenzHinweise.push("Teilepreise nicht separat aufgeführt");

  // Risikohinweise
  const risikoHinweise: string[] = [];
  if (!input.stundensatz || !input.arbeitszeit) risikoHinweise.push("Pauschalangebote ohne Stundennachweis: Bei Mehraufwand können Nachberechnungen entstehen");
  if (input.fahrzeugAlter && input.fahrzeugAlter > 10) risikoHinweise.push("Älteres Fahrzeug: Folgekosten durch weitere Verschleißteile möglich");
  if (input.kilometerstand && input.kilometerstand > 150_000) risikoHinweise.push("Hohe Laufleistung: Zusätzliche Reparaturen wahrscheinlicher");
  if (input.angebotspreis > 1_000 && transparenzScore < 2) risikoHinweise.push("Größere Reparatur ohne vollständige Aufschlüsselung – zweites Angebot einholen empfohlen");

  const grundlagen: string[] = [
    "Stundensatz-Referenz: DAT Lohnkostenspiegel 2023/2024",
    "ZDK-Stundensatzerhebung nach Betriebstyp und Region",
    "Teilepreise: variieren je nach Hersteller, Qualität (OE/OEM/Nachbau)",
    "Regional können Stundensätze um ±20% abweichen",
    input.hauptarbeit ? `Hauptarbeit: ${input.hauptarbeit}` : "",
  ].filter(Boolean);

  const werkstattLabels: Record<WerkstattTyp, string> = {
    markenwerkstatt: "Markenwerkstatt / Autohaus",
    freie_werkstatt: "Freie Fachwerkstatt",
    schnellservice:  "Schnellservice / Handelskette",
  };
  const fahrzeugKlasseLabels: Record<FahrzeugKlasse, string> = {
    kleinwagen:   "Kleinwagen",
    kompakt:      "Kompaktklasse",
    mittelklasse: "Mittelklasse",
    oberklasse:   "Oberklasse / Premium",
    nutzfahrzeug: "Nutzfahrzeug / Transporter",
  };

  return {
    werkstattLabel: werkstattLabels[input.werkstattTyp],
    fahrzeugKlasseLabel: fahrzeugKlasseLabels[input.fahrzeugKlasse],
    stundensatzReferenz: { min: stRef.min, max: stRef.max, marktMittel: stRef.mittel },
    stundensatzBewertung,
    angebotsBewertung,
    kostenaufschluesselung: { arbeitskosten, teilekosten, sonstige, gesamt: input.angebotspreis },
    transparenzScore,
    transparenzHinweise,
    risikoHinweise,
    grundlagen,
  };
}
