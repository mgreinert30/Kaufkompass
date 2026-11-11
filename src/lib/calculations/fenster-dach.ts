// Fenster- und Dachcheck – Berechnungsmodul
// Referenz: Destatis Baupreisindizes, BHB Dach- und Fenstermarkt, BAFA BEG EM
// Bundesweite Mittelwerte; regional und nach Ausführung stark abweichend

export type FensterDachMassnahme =
  | "fenster_austausch"       // Fenster komplett tauschen
  | "fenster_verglasung"      // Nur Verglasung tauschen
  | "dach_eindeckung"         // Dacheindeckung komplett
  | "dach_daemmung_innen"     // Innendämmung Dachschräge
  | "dach_daemmung_aussen"    // Aufsparrendämmung
  | "dach_daemmung_flach"     // Flachdach-Dämmung
  | "dach_sanierung_komplett";// Dach inkl. Dämmung komplett

export interface FensterDachInput {
  massnahme: FensterDachMassnahme;
  anzahlFenster?: number;    // Für Fenster-Maßnahmen
  fensterFlaeche?: number;   // m² Fensterfläche gesamt
  dachFlaeche?: number;      // m² Dachfläche
  angebotspreis?: number;    // Vorliegendes Angebot
  baujahr?: number;          // Gebäudealter für Dämmklasse
  mitISFP?: boolean;         // iSFP-Bonus BAFA
  bundesland?: string;
  zusatzAngaben?: string;
}

export interface FensterDachErgebnis {
  massnahmeLabel: string;
  einheit: string;

  // Referenzpreise
  referenzKostenMin: number;
  referenzKostenMax: number;
  referenzKostenMittel: number;
  referenzQuelle: string;

  // Angebotsbewertung (wenn Preis angegeben)
  angebotsBewertung: {
    einschaetzung: "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer" | null;
    abweichungProzent: number | null;
    hinweis: string;
  };

  // BAFA-Förderung
  foerderungMoeglich: boolean;
  foerderungSatz: number; // %
  foerderungBetrag: number; // €
  foerderungISFPBonus: number; // %
  foerderungHinweise: string[];

  // Nettokosten
  nettokostenNachFoerderung: number;
  puffer: number;
  pufferProzent: number;

  grundlagen: string[];
}

// Referenzpreise je Maßnahme
// Quelle: Destatis Baupreise, Handwerksverbände, BHB 2023/2024
const REFERENZ: Record<
  FensterDachMassnahme,
  { label: string; einheit: string; min: number; mittel: number; max: number; foerderbar: boolean; foerderSatz: number }
> = {
  fenster_austausch: {
    label: "Fenstertausch (komplett)",
    einheit: "pro Fenster",
    min: 500, mittel: 900, max: 1800,
    foerderbar: true, foerderSatz: 15,
  },
  fenster_verglasung: {
    label: "Verglasung tauschen",
    einheit: "pro Fenster",
    min: 200, mittel: 400, max: 700,
    foerderbar: false, foerderSatz: 0,
  },
  dach_eindeckung: {
    label: "Dacheindeckung",
    einheit: "pro m²",
    min: 80, mittel: 140, max: 250,
    foerderbar: false, foerderSatz: 0,
  },
  dach_daemmung_innen: {
    label: "Dachschrägen-Innendämmung",
    einheit: "pro m²",
    min: 70, mittel: 130, max: 220,
    foerderbar: true, foerderSatz: 15,
  },
  dach_daemmung_aussen: {
    label: "Aufsparrendämmung (Dach)",
    einheit: "pro m²",
    min: 180, mittel: 300, max: 500,
    foerderbar: true, foerderSatz: 15,
  },
  dach_daemmung_flach: {
    label: "Flachdach-Dämmung",
    einheit: "pro m²",
    min: 150, mittel: 250, max: 450,
    foerderbar: true, foerderSatz: 15,
  },
  dach_sanierung_komplett: {
    label: "Dachsanierung komplett (Eindeckung + Dämmung)",
    einheit: "pro m²",
    min: 250, mittel: 450, max: 750,
    foerderbar: true, foerderSatz: 15,
  },
};

export function berechneFensterDach(input: FensterDachInput): FensterDachErgebnis {
  const ref = REFERENZ[input.massnahme];
  const { angebotspreis, mitISFP, anzahlFenster, dachFlaeche, fensterFlaeche } = input;

  // Menge ermitteln
  const isFenster = ["fenster_austausch", "fenster_verglasung"].includes(input.massnahme);
  const einheitenAnzahl = isFenster
    ? (anzahlFenster ?? (fensterFlaeche ? Math.ceil(fensterFlaeche / 1.5) : 10))
    : (dachFlaeche ?? 100);

  // Gesamtkosten Referenz
  const refMin    = Math.round(ref.min    * einheitenAnzahl);
  const refMittel = Math.round(ref.mittel * einheitenAnzahl);
  const refMax    = Math.round(ref.max    * einheitenAnzahl);

  // BAFA-Förderung
  const foerderSatz     = ref.foerderbar ? ref.foerderSatz : 0;
  const isfpBonus       = (ref.foerderbar && mitISFP) ? 5 : 0;
  const totalFoerderSatz = Math.min(foerderSatz + isfpBonus, 70);
  const basis           = angebotspreis ?? refMittel;
  const foerderBetrag   = ref.foerderbar ? Math.round(basis * (totalFoerderSatz / 100)) : 0;
  const nettokosten     = basis - foerderBetrag;
  const pufferProzent   = 10;
  const puffer          = Math.round(basis * (pufferProzent / 100));

  // Angebotseinschätzung
  let einschaetzung: FensterDachErgebnis["angebotsBewertung"]["einschaetzung"] = null;
  let abweichungProzent: number | null = null;
  let bewertungHinweis = "Kein Angebotsvergleich (kein Angebotspreis eingegeben).";

  if (angebotspreis && angebotspreis > 0) {
    abweichungProzent = Math.round(((angebotspreis - refMittel) / refMittel) * 100);
    if      (angebotspreis < refMin * 0.9)     { einschaetzung = "guenstig";   bewertungHinweis = "Preis unter Marktdurchschnitt – Ausführungsqualität und Vollständigkeit prüfen."; }
    else if (angebotspreis <= refMittel * 1.1) { einschaetzung = "marktgerecht"; bewertungHinweis = "Preis im marktüblichen Rahmen."; }
    else if (angebotspreis <= refMax * 1.1)    { einschaetzung = "teuer";     bewertungHinweis = "Preis im oberen Marktbereich."; }
    else                                       { einschaetzung = "sehr_teuer"; bewertungHinweis = "Preis überschreitet Marktrahmen deutlich – Vergleichsangebote einholen."; }
  }

  const foerderungHinweise: string[] = [];
  if (ref.foerderbar) {
    foerderungHinweise.push(`BAFA BEG EM: ${foerderSatz} % Grundförderung für ${ref.label}`);
    if (mitISFP) foerderungHinweise.push("iSFP-Bonus: +5 % (individueller Sanierungsfahrplan vorhanden)");
    foerderungHinweise.push("WICHTIG: Förderantrag VOR Beauftragung beim BAFA stellen");
    foerderungHinweise.push("Mindest-Anforderungen an Dämmwerte / U-Werte müssen erfüllt sein");
  } else {
    foerderungHinweise.push("Für diese Maßnahme ist keine BAFA-Förderung vorgesehen");
    foerderungHinweise.push("Prüfe ggf. KfW-Förderprogramme für Einzelmaßnahmen");
  }

  const grundlagen: string[] = [
    `Referenzpreise: Destatis Baupreise 2023, Handwerksverbände (${ref.einheit})`,
    `Menge: ${einheitenAnzahl} ${isFenster ? "Fenster" : "m²"} (${isFenster && !anzahlFenster ? "geschätzt" : "Nutzereingabe"})`,
    `BAFA BEG EM Fördersatz: ${foerderSatz} % (Stand 2024)`,
    "Puffer: 10 % für Nacharbeiten und unvorhergesehene Positionen",
    "Regional und je nach Ausführungsqualität stark abweichend",
  ];

  return {
    massnahmeLabel: ref.label,
    einheit: ref.einheit,
    referenzKostenMin: refMin,
    referenzKostenMax: refMax,
    referenzKostenMittel: refMittel,
    referenzQuelle: "Destatis Baupreisindizes, BHB Marktdaten 2023/2024",
    angebotsBewertung: { einschaetzung, abweichungProzent, hinweis: bewertungHinweis },
    foerderungMoeglich: ref.foerderbar,
    foerderungSatz:     foerderSatz,
    foerderungBetrag:   foerderBetrag,
    foerderungISFPBonus: isfpBonus,
    foerderungHinweise,
    nettokostenNachFoerderung: nettokosten,
    puffer,
    pufferProzent,
    grundlagen,
  };
}
