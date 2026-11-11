// Tool 02 – Gebrauchtwagen-Kaufcheck
// Deterministische Betriebskosten-Berechnung über 5 Jahre.
// Keine KI-Schätzungen für Zahlen.

export type Kraftstoff = "benzin" | "diesel" | "elektro" | "hybrid";

export interface GebrauchtwagenInput {
  marke: string;
  modell: string;
  baujahr: number;
  kilometerstand: number;
  kraftstoff: Kraftstoff;
  kaufpreis: number;
  hubraum?: number;         // ccm – für KFZ-Steuer
  verbrauch?: number;       // L/100km (Benzin/Diesel) | kWh/100km (Elektro)
  jahresfahrleistung: number;
}

export interface BetriebskostenPosition {
  bezeichnung: string;
  jahreskosten: number;
  fuenfJahresKosten: number;
  grundlage: string;
}

export interface GebrauchtwagenBerechnungResult {
  fahrzeugalter: number;
  betriebskostenJaehrlich: number;
  betriebskosten5Jahre: number;
  positionen: BetriebskostenPosition[];
  gesamtkostenMitKauf: number;
  kostenProKm: number;
  geschaetzterRestwert: number;
  wertverlust5Jahre: number;
  anmerkungen: string[];
}

// ── Referenzpreise 2024 ──────────────────────────────────────────────────
const KRAFTSTOFFPREISE: Record<Kraftstoff, number> = {
  benzin:  1.80,  // €/L
  diesel:  1.65,  // €/L
  elektro: 0.30,  // €/kWh (Haushaltsstrom)
  hybrid:  1.60,  // €/L (Mischverbrauch)
};

// Typischer Verbrauch wenn nicht angegeben
const TYPVERBRAUCH: Record<Kraftstoff, number> = {
  benzin:  7.5,   // L/100km
  diesel:  6.0,   // L/100km
  elektro: 18.0,  // kWh/100km
  hybrid:  5.5,   // L/100km
};

// ── KFZ-Steuer (vereinfacht, Schätzwert) ────────────────────────────────
function berechneKfzSteuer(input: GebrauchtwagenInput): number {
  if (input.kraftstoff === "elektro") return 0; // kostenlos bis 2030

  const ccm = input.hubraum ?? 1600;
  const einheiten = Math.ceil(ccm / 100);

  if (input.kraftstoff === "diesel") {
    // 9,50 € je angefangene 100 ccm + CO2-Zuschlag (Schätzwert)
    return Math.round(einheiten * 9.5 + 100);
  }
  // Benzin/Hybrid: 2,00 € je angefangene 100 ccm + CO2-Zuschlag
  return Math.round(einheiten * 2.0 + 60);
}

// ── Wartungskosten (altersabhängig) ──────────────────────────────────────
function berechneWartung(baujahr: number): number {
  const alter = new Date().getFullYear() - baujahr;
  if (alter <= 3)  return 350;
  if (alter <= 6)  return 550;
  if (alter <= 10) return 750;
  return 950;
}

// ── Versicherung (Segment-Schätzwert) ────────────────────────────────────
function berechneVersicherung(kaufpreis: number): number {
  if (kaufpreis < 8_000)  return 650;
  if (kaufpreis < 15_000) return 850;
  if (kaufpreis < 25_000) return 1_100;
  if (kaufpreis < 40_000) return 1_450;
  return 2_000;
}

// ── Wertverlust (vereinfachtes Modell) ───────────────────────────────────
function berechneRestwertNach5Jahren(kaufpreis: number, baujahr: number): number {
  const alter = new Date().getFullYear() - baujahr;
  // Jüngere Fahrzeuge verlieren mehr absolut
  const faktor = alter < 5 ? 0.45 : alter < 10 ? 0.30 : 0.15;
  return Math.max(500, Math.round(kaufpreis * faktor));
}

// ── Hauptrechnung ────────────────────────────────────────────────────────
export function berechneGebrauchtwagenBetriebskosten(
  input: GebrauchtwagenInput
): GebrauchtwagenBerechnungResult {
  const verbrauch  = input.verbrauch ?? TYPVERBRAUCH[input.kraftstoff];
  const preis      = KRAFTSTOFFPREISE[input.kraftstoff];
  const kraftstoffJaehrlich = (verbrauch / 100) * input.jahresfahrleistung * preis;

  const kfzSteuer     = berechneKfzSteuer(input);
  const wartung       = berechneWartung(input.baujahr);
  const versicherung  = berechneVersicherung(input.kaufpreis);
  const tuevJaehrlich = 80; // ~160 € alle 2 Jahre

  const positionen: BetriebskostenPosition[] = [
    {
      bezeichnung: `Kraftstoff (${input.kraftstoff === "elektro" ? `${verbrauch} kWh/100km` : `${verbrauch} L/100km`}, ${input.jahresfahrleistung.toLocaleString("de-DE")} km/Jahr)`,
      jahreskosten: Math.round(kraftstoffJaehrlich),
      fuenfJahresKosten: Math.round(kraftstoffJaehrlich * 5),
      grundlage: `Referenzpreis ${input.kraftstoff === "elektro" ? KRAFTSTOFFPREISE.elektro + " €/kWh" : preis + " €/L"} (2024)`,
    },
    {
      bezeichnung: "KFZ-Versicherung (KH + TK, Schätzwert)",
      jahreskosten: versicherung,
      fuenfJahresKosten: versicherung * 5,
      grundlage: "Schätzwert je Fahrzeugklasse – individuell abweichend",
    },
    {
      bezeichnung: "KFZ-Steuer",
      jahreskosten: kfzSteuer,
      fuenfJahresKosten: kfzSteuer * 5,
      grundlage: input.kraftstoff === "elektro"
        ? "Elektrofahrzeuge: steuerfrei bis 2030"
        : `Vereinfachte Berechnung, Hubraum ${input.hubraum ?? 1600} ccm (§ 8 KraftStG)`,
    },
    {
      bezeichnung: "Wartung & Inspektion",
      jahreskosten: wartung,
      fuenfJahresKosten: wartung * 5,
      grundlage: `Altersbasierter Richtwert (Fahrzeug ${new Date().getFullYear() - input.baujahr} Jahre alt)`,
    },
    {
      bezeichnung: "Hauptuntersuchung (TÜV/DEKRA)",
      jahreskosten: tuevJaehrlich,
      fuenfJahresKosten: tuevJaehrlich * 5,
      grundlage: "ca. 160 € alle 2 Jahre – Schätzwert",
    },
  ];

  const betriebskostenJaehrlich = positionen.reduce((s, p) => s + p.jahreskosten, 0);
  const betriebskosten5Jahre    = positionen.reduce((s, p) => s + p.fuenfJahresKosten, 0);
  const restwert                = berechneRestwertNach5Jahren(input.kaufpreis, input.baujahr);
  const wertverlust5Jahre       = input.kaufpreis - restwert;
  const gesamtkosten            = input.kaufpreis + betriebskosten5Jahre;
  const gesamtKm5J              = input.jahresfahrleistung * 5;
  const kostenProKm             = gesamtKm5J > 0 ? (gesamtkosten - restwert) / gesamtKm5J : 0;

  const anmerkungen = [
    "Versicherungs- und Steuerwerte sind Schätzungen – individuell prüfen.",
    "Kraftstoffpreise basieren auf Referenzwerten 2024 (ADAC Durchschnitt).",
    "Kein Marktpreisvergleich möglich – DAT/Schwacke-Daten sind lizenzpflichtig.",
    "Für Diesel nach Euro-5 können höhere Steuerkosten anfallen.",
  ];

  return {
    fahrzeugalter: new Date().getFullYear() - input.baujahr,
    betriebskostenJaehrlich,
    betriebskosten5Jahre,
    positionen,
    gesamtkostenMitKauf: gesamtkosten,
    kostenProKm: Math.round(kostenProKm * 100) / 100,
    geschaetzterRestwert: restwert,
    wertverlust5Jahre,
    anmerkungen,
  };
}
