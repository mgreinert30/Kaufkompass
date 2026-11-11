// Gebrauchtwaren-Check – Berechnungsmodul
export type GebrauchtwarenKategorie = "moebel" | "elektronik" | "fahrrad" | "kleidung" | "sport" | "haushalt" | "spielzeug" | "sonstiges";
export type ZustandNiveau = "neuwertig" | "sehr_gut" | "gut" | "akzeptabel" | "defekt";

export interface GebrauchtwarenInput {
  kategorie: GebrauchtwarenKategorie; zustand: ZustandNiveau;
  angebotspreis: number; neupreis?: number;
  baujahr?: number; hersteller?: string;
  plattform?: string; // z.B. "eBay Kleinanzeigen", "Vinted"
  zusatzAngaben?: string;
}

export interface GebrauchtwarenErgebnis {
  kategorieLabel: string; zustandLabel: string;
  wertabschlag: number; // % vom Neupreis
  empfohlenerPreis: { min: number; max: number } | null;
  angebotsBewertung: { einschaetzung: "sehr_guenstig" | "guenstig" | "fair" | "etwas_teuer" | "zu_teuer"; hinweis: string } | null;
  risikoHinweise: string[];
  grundlagen: string[];
}

const WERTABSCHLAEGE: Record<ZustandNiveau, { label: string; abschlag: { min: number; max: number } }> = {
  neuwertig:  { label: "Neuwertig / wie neu",   abschlag: { min: 10, max: 25 } },
  sehr_gut:   { label: "Sehr gut erhalten",     abschlag: { min: 25, max: 45 } },
  gut:        { label: "Gut erhalten",          abschlag: { min: 40, max: 60 } },
  akzeptabel: { label: "Akzeptabler Zustand",   abschlag: { min: 55, max: 75 } },
  defekt:     { label: "Defekt / für Bastler",  abschlag: { min: 80, max: 95 } },
};

const KATEGORIERISIKEN: Record<GebrauchtwarenKategorie, string[]> = {
  moebel:      ["Auf Schimmel, Kratzer und Schäden vor Ort prüfen", "Transport organisieren"],
  elektronik:  ["Funktionstest vor Ort zwingend", "Garantieverlust prüfen", "Batterie/Akku testen"],
  fahrrad:     ["Rahmennummer prüfen (Hehlerei ausschließen)", "Schaltung und Bremsen testen"],
  kleidung:    ["Rückgabe meist nicht möglich bei Privatverkauf"],
  sport:       ["Verschleiß und Sicherheitskomponenten prüfen"],
  haushalt:    ["Elektrische Geräte auf Funktion testen"],
  spielzeug:   ["Vollständigkeit prüfen, Sicherheitszeichen (CE) kontrollieren"],
  sonstiges:   ["Zustand vor Ort genau prüfen, Fotos anfordern"],
};

export function berechneGebrauchtwaren(input: GebrauchtwarenInput): GebrauchtwarenErgebnis {
  const zustandRef = WERTABSCHLAEGE[input.zustand];
  const risikoHinweise = KATEGORIERISIKEN[input.kategorie];

  let empfohlenerPreis: GebrauchtwarenErgebnis["empfohlenerPreis"] = null;
  let angebotsBewertung: GebrauchtwarenErgebnis["angebotsBewertung"] = null;

  if (input.neupreis) {
    const minPreis = Math.round(input.neupreis * (1 - zustandRef.abschlag.max / 100));
    const maxPreis = Math.round(input.neupreis * (1 - zustandRef.abschlag.min / 100));
    empfohlenerPreis = { min: minPreis, max: maxPreis };
    const mittelPreis = (minPreis + maxPreis) / 2;
    const abw = ((input.angebotspreis - mittelPreis) / mittelPreis) * 100;
    if      (abw < -20) { angebotsBewertung = { einschaetzung: "sehr_guenstig", hinweis: "Sehr günstiger Preis – Zustand genau prüfen." }; }
    else if (abw < -5)  { angebotsBewertung = { einschaetzung: "guenstig",      hinweis: "Günstiger Preis für diesen Zustand." }; }
    else if (abw <= 15) { angebotsBewertung = { einschaetzung: "fair",          hinweis: "Preis für diesen Zustand fair." }; }
    else if (abw <= 35) { angebotsBewertung = { einschaetzung: "etwas_teuer",   hinweis: "Etwas teuer für diesen Zustand." }; }
    else                { angebotsBewertung = { einschaetzung: "zu_teuer",      hinweis: "Preis zu hoch – Neuware wäre besser." }; }
  }

  return {
    kategorieLabel: input.kategorie, zustandLabel: zustandRef.label,
    wertabschlag: Math.round((zustandRef.abschlag.min + zustandRef.abschlag.max) / 2),
    empfohlenerPreis, angebotsBewertung, risikoHinweise,
    grundlagen: ["Wertabschläge: marktübliche Erfahrungswerte nach Zustand", "Keine Gewähr auf Vollständigkeit der Preisstaffelung"],
  };
}
