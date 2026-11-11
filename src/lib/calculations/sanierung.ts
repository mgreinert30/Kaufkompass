// Tool 04 – Sanierungskosten-Check
// Referenzwerte aus Destatis / BMWSB. BAFA BEG-Fördersätze Stand 2024.

export type SanierungsMassnahme =
  | "fassade"
  | "dach"
  | "keller"
  | "fenster"
  | "heizung"
  | "komplett";

export interface SanierungInput {
  massnahme: SanierungsMassnahme;
  flaeche?: number;        // m² (bei Fenster: Anzahl Stück)
  angebotspreis?: number;  // vorliegender Angebotspreis zur Einordnung
  mitISFP?: boolean;       // individueller Sanierungsfahrplan vorhanden
  bundesland?: string;
  baujahr?: number;
}

export interface SanierungBerechnungResult {
  massnahmeLabel: string;
  referenzKostenMin: number;
  referenzKostenMax: number;
  referenzKostenMittel: number;
  foerderungBetrag: number;
  foerderungSatz: number;
  nettokostenNachFoerderung: number;
  puffer: number;
  gesamtkostenMitPuffer: number;
  angebotsBewertung?: { einschaetzung: "guenstig" | "marktpreisnahe" | "teuer" | null; abweichungProzent?: number };
  grundlagen: { bezeichnung: string; wert: string; quelle: string }[];
  anmerkungen: string[];
}

// ── Referenzwerte (BMWSB / co2online 2023/2024) ──────────────────────────
const REFERENZWERTE: Record<SanierungsMassnahme, {
  label: string;
  einheit: string;
  minProEinheit: number;
  maxProEinheit: number;
  quelle: string;
}> = {
  fassade: {
    label: "Fassadendämmung (WDVS)",
    einheit: "m² Fassadenfläche",
    minProEinheit: 80,
    maxProEinheit: 180,
    quelle: "co2online Sanierungsrechner 2024",
  },
  dach: {
    label: "Dachdämmung",
    einheit: "m² Dachfläche",
    minProEinheit: 100,
    maxProEinheit: 220,
    quelle: "BMWSB Modernisierungskosten 2023",
  },
  keller: {
    label: "Kellerdeckendämmung",
    einheit: "m² Fläche",
    minProEinheit: 50,
    maxProEinheit: 120,
    quelle: "co2online Sanierungsrechner 2024",
  },
  fenster: {
    label: "Fensteraustausch (Dreifachverglasung)",
    einheit: "Stück",
    minProEinheit: 400,
    maxProEinheit: 900,
    quelle: "BMWSB Modernisierungskosten 2023",
  },
  heizung: {
    label: "Heizungserneuerung (Wärmepumpe o. ä.)",
    einheit: "pauschal",
    minProEinheit: 10_000,
    maxProEinheit: 25_000,
    quelle: "BAFA BEG-Statistik 2023, typische Vollkosten",
  },
  komplett: {
    label: "Komplettsanierung (EH85 / EH70)",
    einheit: "m² Wohnfläche",
    minProEinheit: 400,
    maxProEinheit: 1_200,
    quelle: "BMWSB Sanierungskosten-Atlas 2023",
  },
};

// BAFA BEG EM Fördersätze 2024
const BAFA_FOERDERSATZ_BASIS = 0.15;    // 15 % Basisförderung
const BAFA_BONUS_ISFP        = 0.05;    // +5 % mit iSFP
const BAFA_HOECHSTBETRAG_EM  = 60_000; // € je Wohneinheit (EFH)

// Heizung bekommt ab 01.01.2024 BEG-WG-Heizungsbonus separat
const BAFA_HEIZUNG_MIN = 0.30;

export function berechneSanierung(input: SanierungInput): SanierungBerechnungResult {
  const ref     = REFERENZWERTE[input.massnahme];
  const einheit = input.flaeche ?? 1;
  const isISFP  = input.mitISFP ?? false;

  const refMin    = input.massnahme === "heizung" ? ref.minProEinheit : ref.minProEinheit * einheit;
  const refMax    = input.massnahme === "heizung" ? ref.maxProEinheit : ref.maxProEinheit * einheit;
  const refMittel = Math.round((refMin + refMax) / 2);

  // Förderung
  let foerderSatz = BAFA_FOERDERSATZ_BASIS + (isISFP ? BAFA_BONUS_ISFP : 0);
  if (input.massnahme === "heizung") foerderSatz = Math.max(foerderSatz, BAFA_HEIZUNG_MIN);

  const foerderBasis   = Math.min(refMittel, BAFA_HOECHSTBETRAG_EM);
  const foerderungBetrag = Math.round(foerderBasis * foerderSatz);

  const nettoKosten   = refMittel - foerderungBetrag;
  const puffer        = Math.round(nettoKosten * 0.15);
  const gesamtMitPuffer = nettoKosten + puffer;

  // Angebotsbewertung
  let angebotsBewertung: SanierungBerechnungResult["angebotsBewertung"];
  if (input.angebotspreis !== undefined && input.angebotspreis > 0) {
    const abweichung = ((input.angebotspreis - refMittel) / refMittel) * 100;
    angebotsBewertung = {
      einschaetzung:
        abweichung < -20 ? "guenstig" :
        abweichung > 25  ? "teuer"    : "marktpreisnahe",
      abweichungProzent: Math.round(abweichung),
    };
  }

  const grundlagen = [
    {
      bezeichnung: `Referenzkosten ${ref.label}`,
      wert: `${refMin.toLocaleString("de-DE")} – ${refMax.toLocaleString("de-DE")} € (Mittel: ${refMittel.toLocaleString("de-DE")} €)`,
      quelle: ref.quelle,
    },
    {
      bezeichnung: "BAFA BEG EM Förderung",
      wert: `${(foerderSatz * 100).toFixed(0)} % = ${foerderungBetrag.toLocaleString("de-DE")} €${isISFP ? " (inkl. iSFP-Bonus)" : ""}`,
      quelle: "BAFA BEG, Stand 01.01.2024",
    },
    {
      bezeichnung: "Puffer (15 %)",
      wert: `${puffer.toLocaleString("de-DE")} €`,
      quelle: "Erfahrungswert – Sanierungen überschreiten häufig den Angebotsumfang",
    },
  ];

  const anmerkungen = [
    "Referenzkosten sind bundesweite Mittelwerte – regional kann es erheblich abweichen.",
    "BAFA-Förderung erfordert Antragstellung VOR Auftragsvergabe.",
    "Höchstbetrag für BAFA BEG EM: 60.000 € je Wohneinheit.",
    "Fördersätze können sich ändern – aktuellen Stand auf bafa.de prüfen.",
    "Kein Ersatz für ein konkretes Fachplanergebot.",
  ];

  return {
    massnahmeLabel: ref.label,
    referenzKostenMin: refMin,
    referenzKostenMax: refMax,
    referenzKostenMittel: refMittel,
    foerderungBetrag,
    foerderungSatz: foerderSatz,
    nettokostenNachFoerderung: nettoKosten,
    puffer,
    gesamtkostenMitPuffer: gesamtMitPuffer,
    angebotsBewertung,
    grundlagen,
    anmerkungen,
  };
}
