// Tool 05 – Wärmepumpen-Angebotscheck
// Betriebskosten, Vergleich zu Gas, BAFA BEG WG.

export type WPTyp = "luft" | "sole" | "wasser";
export type GebaeudeTyp = "altbau_unsaniert" | "altbau_teilsaniert" | "baujahr80" | "neubau_kfw55" | "neubau_kfw40";

export interface WaermepumpeInput {
  wohnflaeche: number;        // m²
  gebaeudetyp: GebaeudeTyp;
  wpTyp: WPTyp;
  angebotspreis: number;      // € inkl. Installation
  heizwaermebedarf?: number;  // kWh/Jahr – wenn leer: wird berechnet
  strompreisWP?: number;      // €/kWh – Sondertarif
  gaspreisAktuell?: number;   // €/kWh – für Vergleich
  mitISFP?: boolean;
  einkommensbonus?: boolean;  // Haushaltseinkommen ≤ 40.000 €/Jahr
}

export interface WPBerechnungResult {
  heizwaermebedarfKWh: number;
  stromverbrauchWPKWh: number;
  betriebskostenJaehrlich: number;
  vergleichGasJaehrlich: number;
  einsparungJaehrlich: number;
  foerderungBAFA: number;
  foerderungSatz: number;
  nettokostenNachFoerderung: number;
  amortisationJahre: number | null;
  grundlagen: { bezeichnung: string; wert: string; quelle: string }[];
  anmerkungen: string[];
}

// ── Heizlastkennwerte je Gebäudetyp (kWh/m²/Jahr) ───────────────────────
const HEIZLASTKENNWERTE: Record<GebaeudeTyp, { mittel: number; label: string }> = {
  altbau_unsaniert:   { mittel: 190, label: "Altbau (unsaniert, vor 1979)" },
  altbau_teilsaniert: { mittel: 115, label: "Altbau (teilsaniert)" },
  baujahr80:          { mittel: 100, label: "EFH ca. 1980–2000" },
  neubau_kfw55:       { mittel: 55,  label: "Neubau / KfW 55" },
  neubau_kfw40:       { mittel: 40,  label: "Neubau / KfW 40 (GEG 2023)" },
};

// ── Jahresarbeitszahlen (JAZ) je WP-Typ ─────────────────────────────────
const JAZ_TYPISCH: Record<WPTyp, number> = {
  luft:   3.0,
  sole:   4.0,
  wasser: 4.5,
};

// ── Referenzpreise 2024 ──────────────────────────────────────────────────
const STROM_WP_STANDARD = 0.26;  // €/kWh (Wärmepumpen-Sondertarif 2024)
const GAS_STANDARD      = 0.09;  // €/kWh (Referenz Erdgas 2024)
const GAS_WIRKUNGSGRAD  = 0.92;  // Brennwertgerät

// ── BAFA BEG WG Fördersätze 2024 ────────────────────────────────────────
const BAFA_WP_BASIS          = 0.30;  // 30 % Basisförderung
const BAFA_EFFIZIENZBONUS    = 0.05;  // +5 % bei JAZ ≥ 3,5 (Luft) / ≥ 4,0 (Sole)
const BAFA_ISFP_BONUS        = 0.05;  // +5 % mit iSFP
const BAFA_EINKOMMENSBONUS   = 0.30;  // +30 % (Einkommen ≤ 40.000 €/J)
const BAFA_WP_HOECHSTBETRAG  = 30_000; // € je Wohneinheit EFH

export function berechneWaermepumpe(input: WaermepumpeInput): WPBerechnungResult {
  const kennwert  = HEIZLASTKENNWERTE[input.gebaeudetyp];
  const heizwaerme = input.heizwaermebedarf ?? Math.round(kennwert.mittel * input.wohnflaeche);

  const jaz       = JAZ_TYPISCH[input.wpTyp];
  const stromWP   = Math.round(heizwaerme / jaz);
  const stromPreis = input.strompreisWP ?? STROM_WP_STANDARD;
  const gasPreis   = input.gaspreisAktuell ?? GAS_STANDARD;

  const betriebskostenWP  = Math.round(stromWP * stromPreis);
  const betriebskostenGas = Math.round((heizwaerme / GAS_WIRKUNGSGRAD) * gasPreis);
  const einsparung        = betriebskostenGas - betriebskostenWP;

  // Förderung
  const effizienzBonus = jaz >= 3.5 ? BAFA_EFFIZIENZBONUS : 0;
  const isISFP         = input.mitISFP ?? false;
  const hatEinkBonus   = input.einkommensbonus ?? false;

  let foerderSatz = BAFA_WP_BASIS + effizienzBonus + (isISFP ? BAFA_ISFP_BONUS : 0);
  if (hatEinkBonus) foerderSatz = Math.min(foerderSatz + BAFA_EINKOMMENSBONUS, 0.70);

  const foerderBasis   = Math.min(input.angebotspreis, BAFA_WP_HOECHSTBETRAG);
  const foerderung     = Math.round(foerderBasis * foerderSatz);
  const netto          = input.angebotspreis - foerderung;

  const amortisation   = einsparung > 0 ? Math.round((netto / einsparung) * 10) / 10 : null;

  const grundlagen = [
    {
      bezeichnung: `Heizwärmebedarf (${kennwert.label})`,
      wert: `${heizwaerme.toLocaleString("de-DE")} kWh/Jahr`,
      quelle: `EnEV/GEG-Kennwert ${kennwert.mittel} kWh/m²/Jahr × ${input.wohnflaeche} m²`,
    },
    {
      bezeichnung: `JAZ (${input.wpTyp === "luft" ? "Luft-Wasser" : input.wpTyp === "sole" ? "Sole-Wasser (Erdwärme)" : "Wasser-Wasser"})`,
      wert: `${jaz.toFixed(1)}`,
      quelle: "Typische JAZ nach VDI 4650 / Erfahrungswerte",
    },
    {
      bezeichnung: "Stromverbrauch Wärmepumpe",
      wert: `${stromWP.toLocaleString("de-DE")} kWh/Jahr`,
      quelle: `Heizwärmebedarf ${heizwaerme.toLocaleString("de-DE")} kWh ÷ JAZ ${jaz}`,
    },
    {
      bezeichnung: "BAFA BEG WG Förderung",
      wert: `${(foerderSatz * 100).toFixed(0)} % = ${foerderung.toLocaleString("de-DE")} €`,
      quelle: "BAFA BEG WG, Stand 01.01.2024",
    },
  ];

  const anmerkungen = [
    "Heizwärmebedarf ist ein Richtwert – abhängig von Dämmzustand, Lage und Nutzungsverhalten.",
    "BAFA-Antrag muss VOR Auftragserteilung gestellt werden.",
    "Einkommensbonus gilt bei zu versteuerndem Jahreseinkommen ≤ 40.000 € (Haushalt).",
    "Gas-Referenzpreis 2024: 0,09 €/kWh. Langfristig steigende Gaspreise verbessern Wirtschaftlichkeit.",
    "Erdwärme (Sole) erfordert Bohrung – Bohrkosten sind im Angebot zu prüfen.",
  ];

  return {
    heizwaermebedarfKWh: heizwaerme,
    stromverbrauchWPKWh: stromWP,
    betriebskostenJaehrlich: betriebskostenWP,
    vergleichGasJaehrlich: betriebskostenGas,
    einsparungJaehrlich: einsparung,
    foerderungBAFA: foerderung,
    foerderungSatz: foerderSatz,
    nettokostenNachFoerderung: netto,
    amortisationJahre: amortisation,
    grundlagen,
    anmerkungen,
  };
}
