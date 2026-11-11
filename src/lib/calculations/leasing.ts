// Auto-Leasingcheck – Berechnungsmodul
// Referenz: DAT Leasingspiegel, Bundesverband Leasing e.V.
// Berechnung: Effektiver Leasingpreis und Gesamtkosten über Laufzeit

export type LeasingTyp = "privat" | "gewerblich";

export interface LeasingInput {
  fahrzeugListenpreis: number;
  leasingrate: number;             // monatliche Rate
  laufzeit: number;                // in Monaten (12-60)
  kilometerProJahr: number;
  anzahlung?: number;
  restwert?: number;               // am Ende der Laufzeit
  uebernahmeOption?: boolean;      // Kaufoption am Ende
  leasingTyp: LeasingTyp;
  fahrzeugModell?: string;
  herstellerBeitrag?: number;      // Herstellerzuschuss/Prämie
  versicherungProMonat?: number;
  wartungProMonat?: number;
  zusatzAngaben?: string;
}

export interface LeasingErgebnis {
  // Kerndaten
  gesamteLeasingkosten: number;         // Summe aller Raten + Anzahlung
  effektiverMonatsaufwand: number;      // inkl. Anzahlung umgerechnet

  // Vergleich: Kaufen vs. Leasen
  verbleibenderRestwert: number;        // geschätzter Restwert am Ende
  kapitalverlust: number;               // Listenpreis - Restwert
  leasingVsKaufVergleich: {
    leasingGesamtkosten: number;        // inkl. Anzahlung
    kaufGesamtkosten: number;           // Listenpreis - Restwert (nach Laufzeit)
    differenz: number;                  // Leasing - Kauf-Kapitalverlust
    empfehlung: "leasing_guenstiger" | "kauf_guenstiger" | "aehnlich";
  };

  // Rate-Einschätzung
  ratenBewertung: {
    prozentVonListenpreis: number;
    einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer";
    hinweis: string;
  };

  // Gesamtkosten-Übersicht
  kostenuebersicht: {
    summeRaten:        number;
    anzahlung:         number;
    versicherung:      number | null;
    wartung:           number | null;
    gesamtTCO:         number;          // Total Cost of Ownership über Laufzeit
  };

  kilometerHinweis: string;
  grundlagen: string[];
}

export function berechneLeasingcheck(input: LeasingInput): LeasingErgebnis {
  const summeRaten = Math.round(input.leasingrate * input.laufzeit);
  const anzahlung = input.anzahlung ?? 0;
  const gesamteLeasingkosten = summeRaten + anzahlung;
  const effektiverMonatsaufwand = Math.round(gesamteLeasingkosten / input.laufzeit);

  // Restwert-Schätzung (wenn nicht angegeben)
  // Faustregel: Fahrzeuge verlieren ca. 50-65% über 3 Jahre
  let verbleibenderRestwert: number;
  if (input.restwert) {
    verbleibenderRestwert = input.restwert;
  } else {
    const jahreAbschreibung = 0.18; // ca. 18% pro Jahr als Faustregel
    const laufzeitJahre = input.laufzeit / 12;
    verbleibenderRestwert = Math.round(input.fahrzeugListenpreis * Math.pow(1 - jahreAbschreibung, laufzeitJahre));
  }

  const kapitalverlust = input.fahrzeugListenpreis - verbleibenderRestwert;

  // Leasing vs. Kauf
  const kaufGesamtkosten = kapitalverlust; // Wertverlust bei Kauf
  const differenz = gesamteLeasingkosten - kaufGesamtkosten;
  let empfehlung: LeasingErgebnis["leasingVsKaufVergleich"]["empfehlung"];
  if      (differenz < -500) empfehlung = "leasing_guenstiger";
  else if (differenz >  500) empfehlung = "kauf_guenstiger";
  else                        empfehlung = "aehnlich";

  // Rate als % des Listenpreises (Marktrichtwert: ~1% = faire Rate)
  const prozentVonListenpreis = parseFloat(((input.leasingrate / input.fahrzeugListenpreis) * 100).toFixed(2));
  let einschaetzung: LeasingErgebnis["ratenBewertung"]["einschaetzung"];
  let hinweis: string;
  if      (prozentVonListenpreis < 0.6) { einschaetzung = "sehr_guenstig"; hinweis = "Sehr günstige Rate – Restwert und Kilometerbedingungen genau prüfen."; }
  else if (prozentVonListenpreis < 0.85){ einschaetzung = "guenstig";      hinweis = "Günstige Rate – Konditionen vergleichen."; }
  else if (prozentVonListenpreis < 1.1) { einschaetzung = "marktgerecht";  hinweis = "Rate im marktüblichen 1%-Bereich."; }
  else if (prozentVonListenpreis < 1.4) { einschaetzung = "teuer";         hinweis = "Rate über 1% des Listenpreises – Verhandlungspotenzial prüfen."; }
  else                                   { einschaetzung = "sehr_teuer";   hinweis = "Rate deutlich über Marktdurchschnitt – Angebote vergleichen."; }

  // TCO
  const versicherungGesamt = input.versicherungProMonat ? Math.round(input.versicherungProMonat * input.laufzeit) : null;
  const wartungGesamt = input.wartungProMonat ? Math.round(input.wartungProMonat * input.laufzeit) : null;
  const gesamtTCO = gesamteLeasingkosten + (versicherungGesamt ?? 0) + (wartungGesamt ?? 0);

  // Kilometerhinweis
  const erlaubteKm = (input.kilometerProJahr * input.laufzeit) / 12;
  const kilometerHinweis = `Erlaubte Laufleistung: ${erlaubteKm.toLocaleString("de-DE")} km in ${input.laufzeit} Monaten. Mehrkilometerkosten typisch: 5–25 Cent/km je nach Vertrag.`;

  const grundlagen: string[] = [
    "Berechnung nach DAT Leasingspiegel und Bundesverband Leasing",
    "1%-Regel als Marktrichtwert für Leasingrate",
    "Restwert-Faustregel: ca. 18% Wertverlust/Jahr (je nach Modell)",
    "Steuerliche Aspekte (Gewerbeleasing) nicht berücksichtigt",
    input.fahrzeugModell ? `Fahrzeug: ${input.fahrzeugModell}` : "",
  ].filter(Boolean);

  return {
    gesamteLeasingkosten,
    effektiverMonatsaufwand,
    verbleibenderRestwert,
    kapitalverlust,
    leasingVsKaufVergleich: {
      leasingGesamtkosten: gesamteLeasingkosten,
      kaufGesamtkosten,
      differenz,
      empfehlung,
    },
    ratenBewertung: { prozentVonListenpreis, einschaetzung, hinweis },
    kostenuebersicht: {
      summeRaten,
      anzahlung,
      versicherung: versicherungGesamt,
      wartung: wartungGesamt,
      gesamtTCO,
    },
    kilometerHinweis,
    grundlagen,
  };
}
