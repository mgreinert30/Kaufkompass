// Tool 03 – Photovoltaik-Check
// Deterministische Ertrags- und Wirtschaftlichkeitsberechnung.

export type PVRegion = "sued" | "mitte" | "nord";
export type PVAusrichtung = "sued" | "suedost" | "suedwest" | "ost_west" | "ost" | "west";

export interface PVInput {
  leistungKWp: number;
  jahresverbrauchKWh: number;
  anschaffungskosten: number;
  eigenverbrauchQuote: number;      // 0.25–0.60 typisch
  speichergroesseKWh?: number;
  region?: PVRegion;
  ausrichtung?: PVAusrichtung;
  einspeiseverguetung?: number;     // ct/kWh – wenn leer: Standardwert 2024
}

export interface PVJahreBilanz {
  jahr: number;
  jahresertragKWh: number;
  eigenverbrauchKWh: number;
  einspeisungKWh: number;
  einnahmenEuro: number;
  kumuliertEinnahmen: number;
  kumuliertKosten: number;          // Anschaffung – kein Laufzeitaufwand modelliert
}

export interface PVBerechnungResult {
  jahresertragKWh: number;
  eigenverbrauchKWh: number;
  einspeisungKWh: number;
  jahreseinnahmen: number;          // Einsparung + Einspeisung
  amortisationJahre: number | null;
  bilanz20Jahre: PVJahreBilanz[];
  annahmen: { bezeichnung: string; wert: string }[];
  anmerkungen: string[];
}

// ── Volllaststunden je Region ────────────────────────────────────────────
const VOLLLASTSTUNDEN: Record<PVRegion, number> = {
  sued:  1050,
  mitte: 950,
  nord:  850,
};

// Ausrichtungsfaktor (relativ zu Süd = 1.0)
const AUSRICHTUNGSFAKTOR: Record<PVAusrichtung, number> = {
  sued:      1.00,
  suedost:   0.97,
  suedwest:  0.97,
  ost_west:  0.90,  // Ost-West-Aufteilung typisch 90%
  ost:       0.80,
  west:      0.80,
};

// EEG 2024 – Einspeisevergütung (ab 01.08.2024)
const EINSPEISEVERGUETUNG_DEFAULT = 0.0829; // 8,29 Ct/kWh für ≤10 kWp

// Referenz-Haushaltsstrompreis 2024
const STROMPREIS_HAUSHALT = 0.33; // €/kWh

export function berechnePV(input: PVInput): PVBerechnungResult {
  const region    = input.region     ?? "mitte";
  const ausricht  = input.ausrichtung ?? "sued";
  const eigenQ    = Math.min(Math.max(input.eigenverbrauchQuote, 0.1), 0.8);
  const vergaetung = input.einspeiseverguetung
    ? input.einspeiseverguetung / 100
    : EINSPEISEVERGUETUNG_DEFAULT;

  const volllaststunden = VOLLLASTSTUNDEN[region] * AUSRICHTUNGSFAKTOR[ausricht];
  const jahresertrag    = Math.round(input.leistungKWp * volllaststunden);

  // Eigenverbrauch: begrenzt durch tatsächlichen Jahresverbrauch
  const eigenverbrauchMaxKWh  = input.jahresverbrauchKWh * eigenQ;
  const eigenverbrauchKWh     = Math.min(jahresertrag * eigenQ, eigenverbrauchMaxKWh);
  const einspeisungKWh        = Math.max(0, jahresertrag - eigenverbrauchKWh);

  const einnahmenEinspeisung  = einspeisungKWh  * vergaetung;
  const einsparungEigenverbrauch = eigenverbrauchKWh * STROMPREIS_HAUSHALT;
  const jahreseinnahmen       = Math.round((einnahmenEinspeisung + einsparungEigenverbrauch) * 100) / 100;

  const amortisationJahre = jahreseinnahmen > 0
    ? Math.round((input.anschaffungskosten / jahreseinnahmen) * 10) / 10
    : null;

  // 20-Jahres-Bilanz
  const bilanz20Jahre: PVJahreBilanz[] = [];
  let kumuliertEinnahmen = 0;
  for (let j = 1; j <= 20; j++) {
    // Degradation: 0.5% p.a.
    const degradationsFaktor = Math.pow(0.995, j - 1);
    const ertragJ = Math.round(jahresertrag * degradationsFaktor);
    const eigenJ  = Math.round(eigenverbrauchKWh * degradationsFaktor);
    const einsJ   = Math.max(0, ertragJ - eigenJ);
    const einJ    = Math.round(
      (einsJ * vergaetung + eigenJ * STROMPREIS_HAUSHALT) * 100
    ) / 100;
    kumuliertEinnahmen += einJ;
    bilanz20Jahre.push({
      jahr: j,
      jahresertragKWh: ertragJ,
      eigenverbrauchKWh: eigenJ,
      einspeisungKWh: einsJ,
      einnahmenEuro: einJ,
      kumuliertEinnahmen: Math.round(kumuliertEinnahmen * 100) / 100,
      kumuliertKosten: input.anschaffungskosten,
    });
  }

  const annahmen = [
    { bezeichnung: "Volllaststunden/Jahr", wert: `${volllaststunden.toFixed(0)} h/Jahr (Region: ${region})` },
    { bezeichnung: "Ausrichtungsfaktor",   wert: `${(AUSRICHTUNGSFAKTOR[ausricht] * 100).toFixed(0)} % (${ausricht})` },
    { bezeichnung: "Eigenverbrauchsquote", wert: `${(eigenQ * 100).toFixed(0)} %` },
    { bezeichnung: "Einspeisevergütung",   wert: `${(vergaetung * 100).toFixed(2)} Ct/kWh (EEG 2024)` },
    { bezeichnung: "Strompreis",           wert: `${STROMPREIS_HAUSHALT.toFixed(2)} €/kWh (Referenzwert 2024)` },
    { bezeichnung: "Degradation",          wert: "0,5 % p.a. (Modulalterung)" },
  ];

  const anmerkungen = [
    "Erträge sind Schätzwerte basierend auf Standortdaten – tatsächliche Erträge weichen ab.",
    "Steigende Strompreise verbessern die Wirtschaftlichkeit.",
    "Speicher (falls vorhanden) erhöht Eigenverbrauch und Wirtschaftlichkeit.",
    "Wartungskosten (ca. 1-2 % p.a.) sind nicht eingerechnet.",
    "Einspeisevergütung gilt nur für nicht-selbst-verbrauchten Anteil.",
  ];

  return {
    jahresertragKWh: jahresertrag,
    eigenverbrauchKWh: Math.round(eigenverbrauchKWh),
    einspeisungKWh: Math.round(einspeisungKWh),
    jahreseinnahmen,
    amortisationJahre,
    bilanz20Jahre,
    annahmen,
    anmerkungen,
  };
}
