// Elektroauto-Kostencheck – Berechnungsmodul
// Referenz: ADAC Kostenvergleich E-Auto vs. Verbrenner, BAFA Förderung 2024

export type FahrzeugTyp = "bev" | "phev"; // Battery Electric / Plug-in Hybrid
export type LadeinfraStruktur = "nur_oeffentlich" | "wallbox_miete" | "wallbox_kauf";

export interface ElektroautoInput {
  kaufpreis: number;
  reichweite: number;           // km WLTP
  akkuKapazitaet: number;       // kWh
  jahresfahrleistung: number;   // km/Jahr
  strompreisHaushalt: number;   // ct/kWh (Haushaltsstrom)
  strompreisOeffentlich?: number; // ct/kWh (Schnelllader)
  ladeinfrastruktur: LadeinfraStruktur;
  fahrzeugTyp: FahrzeugTyp;
  vergleichsfahrzeugKraftstoff?: number; // L/100km Verbrauch Verbrenner
  kraftstoffpreis?: number;     // €/L
  foerderungErhalten?: boolean; // BAFA-Förderung erhalten?
  fahrzeugModell?: string;
  zusatzAngaben?: string;
}

export interface ElektroautoErgebnis {
  // Ladekosten
  verbrauchPro100km: number;      // kWh/100km (Faustregel: Kapazität / WLTP * 100)
  ladekostenProKm: number;        // € (Haushaltsstrom)
  jahresLadekosten: number;       // € bei Haushaltsstrom
  jahresLadekostenOeffentlich: number | null;

  // Infrastruktur
  ladeinfrastrukturKosten: { einmalig: number; label: string };

  // Förderung (BAFA BEG 2024: ausgelaufen für Privat ab 2024)
  foerderungHinweis: string;

  // TCO über 5 Jahre
  tco5Jahre: {
    kaufpreis:             number;
    ladekosten:            number;
    infrastruktur:         number;
    kfzSteuer:             number;    // E-Auto 10 Jahre befreit
    wartung:               number;    // grob: 30% weniger als Verbrenner
    gesamtTCO:             number;
    tcoProJahr:            number;
    tcoProKm:              number;
  };

  // Vergleich mit Verbrenner (wenn Daten vorhanden)
  vergleichVerbrenner: {
    moeglich: boolean;
    kraftstoffkostenJahr:    number | null;
    tco5JahreVerbrenner:     number | null;
    ersparnisBeiElektro:     number | null;
    amortisationJahre:       number | null;
  };

  umweltHinweis: string;
  grundlagen: string[];
}

export function berechneElektroauto(input: ElektroautoInput): ElektroautoErgebnis {
  // Verbrauch: Faustregel ~15-20 kWh/100 km; genauer: (kapazität / WLTP) * 100 * 1.15 (Ladeverluste)
  const verbrauchPro100km = parseFloat(((input.akkuKapazitaet / input.reichweite) * 100 * 1.15).toFixed(1));
  const strompreisEuro = input.strompreisHaushalt / 100;
  const ladekostenProKm = parseFloat(((verbrauchPro100km / 100) * strompreisEuro).toFixed(4));
  const jahresLadekosten = Math.round(input.jahresfahrleistung * ladekostenProKm);

  const jahresLadekostenOeffentlich = input.strompreisOeffentlich
    ? Math.round(input.jahresfahrleistung * (verbrauchPro100km / 100) * (input.strompreisOeffentlich / 100))
    : null;

  // Ladeinfrastruktur
  const infraKosten: Record<LadeinfraStruktur, { einmalig: number; label: string }> = {
    nur_oeffentlich:  { einmalig: 0,       label: "Nur öffentliches Laden" },
    wallbox_miete:    { einmalig: 300,     label: "Wallbox-Miete (Installation ~300 €)" },
    wallbox_kauf:     { einmalig: 1_500,   label: "Wallbox-Kauf inkl. Installation (~1.500 €)" },
  };
  const ladeinfrastrukturKosten = infraKosten[input.ladeinfrastruktur];

  // TCO 5 Jahre
  const kfzSteuer5J = 0; // 10 Jahre befreit
  const wartung5J = Math.round(input.kaufpreis * 0.03 * 5 * 0.7); // 70% der Verbrenner-Wartung
  const ladekosten5J = jahresLadekosten * 5;
  const gesamtTCO = input.kaufpreis + ladekosten5J + ladeinfrastrukturKosten.einmalig + kfzSteuer5J + wartung5J;
  const tcoProJahr = Math.round(gesamtTCO / 5);
  const tcoProKm = parseFloat((gesamtTCO / (input.jahresfahrleistung * 5)).toFixed(2));

  // Förderung
  const foerderungHinweis = input.fahrzeugTyp === "bev"
    ? "BAFA-Umweltbonus für Privatkäufer wurde Ende 2023 eingestellt. Prüfe aktuelle regionale Förderungen und THG-Prämie (~150–400 €/Jahr)."
    : "PHEV-Förderung wurde 2023 gestrichen. Prüfe aktuelle regionale Förderungen.";

  // Vergleich Verbrenner
  let vergleichVerbrenner: ElektroautoErgebnis["vergleichVerbrenner"] = {
    moeglich: false, kraftstoffkostenJahr: null, tco5JahreVerbrenner: null, ersparnisBeiElektro: null, amortisationJahre: null,
  };
  if (input.vergleichsfahrzeugKraftstoff && input.kraftstoffpreis) {
    const kraftstoffkostenJahr = Math.round(input.jahresfahrleistung / 100 * input.vergleichsfahrzeugKraftstoff * input.kraftstoffpreis);
    const wartungVerbrenner5J = Math.round(input.kaufpreis * 0.03 * 5);
    const tco5JahreVerbrenner = input.kaufpreis + kraftstoffkostenJahr * 5 + wartungVerbrenner5J;
    const ersparnisBeiElektro = tco5JahreVerbrenner - gesamtTCO;
    const amortisationJahre = ersparnisBeiElektro > 0 ? parseFloat((5 / (ersparnisBeiElektro / 5) * (gesamtTCO - input.kaufpreis)).toFixed(1)) : null;

    vergleichVerbrenner = { moeglich: true, kraftstoffkostenJahr, tco5JahreVerbrenner, ersparnisBeiElektro, amortisationJahre };
  }

  const umweltHinweis = `CO₂-Bilanz abhängig vom Strommix. Bei dt. Strommix (2024): ca. 150-180 g CO₂/km. Mit Ökostrom: ca. 20-30 g CO₂/km.`;

  const grundlagen = [
    "ADAC Kostenvergleich E-Auto vs. Verbrenner 2024",
    "Ladeeffizienz: 15% Ladeverluste eingerechnet",
    "KfZ-Steuerbefreiung E-Auto: 10 Jahre (§3d KraftStG)",
    "Wartungskosten: ca. 30% günstiger als Verbrenner (kein Öl, Kupplung, etc.)",
    input.fahrzeugModell ? `Fahrzeug: ${input.fahrzeugModell}` : "",
  ].filter(Boolean);

  return {
    verbrauchPro100km, ladekostenProKm, jahresLadekosten, jahresLadekostenOeffentlich,
    ladeinfrastrukturKosten, foerderungHinweis,
    tco5Jahre: { kaufpreis: input.kaufpreis, ladekosten: ladekosten5J, infrastruktur: ladeinfrastrukturKosten.einmalig, kfzSteuer: kfzSteuer5J, wartung: wartung5J, gesamtTCO, tcoProJahr, tcoProKm },
    vergleichVerbrenner, umweltHinweis, grundlagen,
  };
}
