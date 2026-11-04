// Deterministische Berechnungen für den Immobilien-Kaufcheck
// Keine KI-Schätzungen – alle Ergebnisse sind mathematisch nachvollziehbar

import type { FinanzierungsSzenario, KostenpunktMitQuelle } from "@/types/analyse";

// ── Grunderwerbsteuer-Tabelle ────────────────────────────────────────────────
// Quelle: Jeweilige Landesgrunderwerbsteuergesetze (Stand 2024)
// Bayern und Sachsen: 3,5% (§ 11 GrEStG), alle anderen gemäß Landesgesetz
export const GRUNDERWERBSTEUER_SAETZE: Record<string, number> = {
  "Baden-Württemberg":      0.050,
  "Bayern":                 0.035,
  "Berlin":                 0.060,
  "Brandenburg":            0.065,
  "Bremen":                 0.050,
  "Hamburg":                0.055,
  "Hessen":                 0.060,
  "Mecklenburg-Vorpommern": 0.050,
  "Niedersachsen":          0.050,
  "Nordrhein-Westfalen":    0.065,
  "Rheinland-Pfalz":        0.050,
  "Saarland":               0.055,
  "Sachsen":                0.035,
  "Sachsen-Anhalt":         0.050,
  "Schleswig-Holstein":     0.065,
  "Thüringen":              0.065,
};

export const BUNDESLAENDER = Object.keys(GRUNDERWERBSTEUER_SAETZE).sort();

export interface KaufnebenkostenInput {
  kaufpreis: number;
  bundesland: string;
  mitMakler: boolean;
  maklerprovision?: number; // Anteil Käufer, z.B. 0.03571
}

export interface Kaufnebenkosten {
  grunderwerbsteuer: { betrag: number; satz: number; bundesland: string };
  notarUndGrundbuch: { betrag: number; richtwert: string };
  makler: { betrag: number; satz: number; mitMakler: boolean };
  gesamt: number;
  prozentVomKaufpreis: number;
  positionen: KostenpunktMitQuelle[];
}

export function berechneKaufnebenkosten(input: KaufnebenkostenInput): Kaufnebenkosten {
  const ges = GRUNDERWERBSTEUER_SAETZE[input.bundesland] ?? 0.05;
  const gesKosten = input.kaufpreis * ges;

  // Notar + Grundbuch: üblicher Richtwert ca. 1,5–2 % des Kaufpreises
  // (Notargebühren nach GNotKG, abhängig vom Kaufpreis)
  const notarUndGrundbuch = input.kaufpreis * 0.015;

  const maklersatz = input.mitMakler ? (input.maklerprovision ?? 0.03571) : 0;
  const maklerKosten = input.kaufpreis * maklersatz;

  const gesamt = gesKosten + notarUndGrundbuch + maklerKosten;

  return {
    grunderwerbsteuer: {
      betrag: round2(gesKosten),
      satz: ges,
      bundesland: input.bundesland,
    },
    notarUndGrundbuch: {
      betrag: round2(notarUndGrundbuch),
      richtwert: "ca. 1,5 % (Schätzwert; tatsächliche Kosten variieren)",
    },
    makler: {
      betrag: round2(maklerKosten),
      satz: maklersatz,
      mitMakler: input.mitMakler,
    },
    gesamt: round2(gesamt),
    prozentVomKaufpreis: round2((gesamt / input.kaufpreis) * 100),
    positionen: [
      {
        bezeichnung: `Grunderwerbsteuer ${input.bundesland} (${(ges * 100).toFixed(1)} %)`,
        betrag: round2(gesKosten),
        berechnung: `${input.kaufpreis.toLocaleString("de-DE")} € × ${(ges * 100).toFixed(1)} %`,
        quelle: "Grunderwerbsteuergesetz des Bundeslandes",
      },
      {
        bezeichnung: "Notar- und Grundbuchkosten (Schätzwert)",
        betrag: round2(notarUndGrundbuch),
        berechnung: `${input.kaufpreis.toLocaleString("de-DE")} € × 1,5 %`,
        quelle: "Richtwert gemäß GNotKG; tatsächliche Kosten vom Notar anfragen",
      },
      ...(input.mitMakler
        ? [{
            bezeichnung: `Maklerprovision Käufer (${(maklersatz * 100).toFixed(2)} %)`,
            betrag: round2(maklerKosten),
            berechnung: `${input.kaufpreis.toLocaleString("de-DE")} € × ${(maklersatz * 100).toFixed(2)} %`,
            quelle: "Nutzereingabe",
          }]
        : []),
    ],
  };
}

export interface FinanzierungsInput {
  kaufpreis: number;
  kaufnebenkosten: number;
  eigenkapital: number;
  tilgungssatz?: number; // Standard 2 %
}

export function berechneFinanzierung(input: FinanzierungsInput): {
  fremdkapital: number;
  fremdkapitalquote: number;
  szenarien: FinanzierungsSzenario[];
  anmerkungen: string[];
} {
  const gesamtkosten = input.kaufpreis + input.kaufnebenkosten;
  const fremdkapital = Math.max(0, gesamtkosten - input.eigenkapital);
  const fremdkapitalquote = (fremdkapital / input.kaufpreis) * 100;
  const tilgung = input.tilgungssatz ?? 0.02;

  const zinssaetze = [
    { satz: 0.035, label: "günstig (3,5 %)" },
    { satz: 0.04, label: "mittel (4,0 %)" },
    { satz: 0.045, label: "hoch (4,5 %)" },
  ];

  const szenarien: FinanzierungsSzenario[] = zinssaetze.map(({ satz, label }) => {
    const laufzeit = 30;
    const monatssatz = satz / 12;
    const nMonate = laufzeit * 12;

    // Annuität: P × (r(1+r)^n) / ((1+r)^n − 1)
    const annuitaet =
      fremdkapital > 0
        ? fremdkapital * (monatssatz * Math.pow(1 + monatssatz, nMonate)) /
          (Math.pow(1 + monatssatz, nMonate) - 1)
        : 0;

    return {
      bezeichnung: label,
      zinssatz: satz,
      tilgungssatz: tilgung,
      laufzeitJahre: laufzeit,
      monatlicheRate: round2(annuitaet),
      gesamtRueckzahlung: round2(annuitaet * nMonate),
      gesamtZinsen: round2(annuitaet * nMonate - fremdkapital),
    };
  });

  const anmerkungen: string[] = [
    "Zinssätze sind Beispielwerte. Tatsächliche Konditionen hängen von Bonität, Bank und Marktlage ab.",
    "Tilgungssatz 2 % p.a. ist ein gängiger Ausgangswert; höhere Tilgung reduziert die Gesamtlaufzeit deutlich.",
    "Notar- und Grundbuchkosten sollten aus Eigenkapital finanziert werden, nicht über Kredit.",
  ];

  return {
    fremdkapital: round2(fremdkapital),
    fremdkapitalquote: round2(fremdkapitalquote),
    szenarien,
    anmerkungen,
  };
}

export function berechneKaufpreisProQm(kaufpreis: number, wohnflaeche: number): number | null {
  if (!wohnflaeche || wohnflaeche <= 0) return null;
  return round2(kaufpreis / wohnflaeche);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
