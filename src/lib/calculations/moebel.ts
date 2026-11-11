// Möbel-Kaufcheck – Berechnungsmodul
// Referenz: Statista Möbelmarkt Deutschland, Stiftung Warentest Preisführer
// Hinweis: Möbelpreise variieren extrem – KI-Einschätzung besonders wichtig

export type MoebelKategorie =
  | "sofa_couch"
  | "bett_lattenrost"
  | "kleiderschrank"
  | "esstisch_stuehle"
  | "regal_schrank"
  | "schreibtisch"
  | "kommode"
  | "matratze"
  | "sonstiges";

export type MoebelQualitaet = "einfach" | "mittel" | "hochwertig";

export interface MoebelInput {
  kategorie: MoebelKategorie;
  qualitaet: MoebelQualitaet;
  angebotspreis: number;
  material?: string;         // z.B. "Massivholz", "MDF", "Leder"
  hersteller?: string;
  massanfertigung?: boolean;
  lieferung?: boolean;       // Lieferung inklusive?
  montage?: boolean;         // Montage inklusive?
  zusatzAngaben?: string;
}

interface PreisBandbreite {
  min: number;
  mittel: number;
  max: number;
}

export interface MoebelErgebnis {
  kategorieLabel: string;
  qualitaetLabel: string;

  // Referenzpreise
  referenzPreis: PreisBandbreite;
  angebotsBewertung: {
    einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer";
    abweichungProzent: number;
    hinweis: string;
  };

  // Zusatzkosten-Einschätzung
  lieferungKosten: { min: number; max: number } | null;
  montageKosten:   { min: number; max: number } | null;
  gesamtkosten:    { min: number; max: number };

  qualitaetsHinweise: string[];
  grundlagen: string[];
}

// Referenzpreise nach Kategorie und Qualität
// Quelle: Statista Möbelmarkt, Stiftung Warentest, branchenübliche Preislagen
const REFERENZ: Record<MoebelKategorie, {
  label: string;
  preise: Record<MoebelQualitaet, PreisBandbreite>;
  lieferung?: { min: number; max: number };
  montage?: { min: number; max: number };
  qualitaetsHinweise: Record<MoebelQualitaet, string[]>;
}> = {
  sofa_couch: {
    label: "Sofa / Couch",
    preise: {
      einfach:   { min: 300,   mittel: 600,   max: 1_000 },
      mittel:    { min: 800,   mittel: 1_500, max: 2_500 },
      hochwertig: { min: 2_000, mittel: 4_000, max: 10_000 },
    },
    lieferung: { min: 50, max: 200 },
    montage: { min: 0, max: 150 },
    qualitaetsHinweise: {
      einfach:   ["Schaumstoffqualität oft niedrig (< 30 kg/m³)", "Bezug anfällig für Abrieb"],
      mittel:    ["Schaumstoffdichte 30–40 kg/m³ angemessen", "Holzrahmen auf Stabilität prüfen"],
      hochwertig: ["Zertifizierter Schaumstoff (z.B. CertiPUR)", "Echtes Leder: Pflegeanleitung prüfen"],
    },
  },
  bett_lattenrost: {
    label: "Bett mit Lattenrost",
    preise: {
      einfach:   { min: 150, mittel: 350,   max: 600 },
      mittel:    { min: 500, mittel: 900,   max: 1_500 },
      hochwertig: { min: 1_200, mittel: 2_500, max: 6_000 },
    },
    lieferung: { min: 50, max: 200 },
    montage: { min: 50, max: 200 },
    qualitaetsHinweise: {
      einfach:   ["MDF/Spanplatte: Feuchtigkeit vermeiden", "Lattenrost Flexibilität prüfen"],
      mittel:    ["Buchenholz oder Birke typisch", "Lattenanzahl: mind. 28 Leisten für 180 cm"],
      hochwertig: ["Massivholz: Langlebig, prüfe Verbindungen", "Elektrisch verstellbar: Garantie wichtig"],
    },
  },
  kleiderschrank: {
    label: "Kleiderschrank",
    preise: {
      einfach:   { min: 200, mittel: 500,   max: 900 },
      mittel:    { min: 600, mittel: 1_200, max: 2_000 },
      hochwertig: { min: 1_500, mittel: 3_500, max: 10_000 },
    },
    lieferung: { min: 50, max: 200 },
    montage: { min: 80, max: 250 },
    qualitaetsHinweise: {
      einfach:   ["Korpus meist 16 mm Spanplatte", "Türscharniere auf Langlebigkeit prüfen"],
      mittel:    ["19 mm Plattenstärke besser", "Dämpfer für Türen und Schubladen empfohlen"],
      hochwertig: ["Soft-Close Dämpfer Standard", "Innenausstattung: auf Flexibilität achten"],
    },
  },
  esstisch_stuehle: {
    label: "Esstisch mit Stühlen",
    preise: {
      einfach:   { min: 200, mittel: 450,   max: 800 },
      mittel:    { min: 600, mittel: 1_200, max: 2_500 },
      hochwertig: { min: 2_000, mittel: 4_500, max: 12_000 },
    },
    lieferung: { min: 50, max: 200 },
    montage: { min: 50, max: 200 },
    qualitaetsHinweise: {
      einfach:   ["MDF/Laminat: empfindlich gegen Kratzer", "Stuhlbeine auf Stabilität prüfen"],
      mittel:    ["Massivholz oder Furnier prüfen", "Ausziehfunktion: Mechanismus testen"],
      hochwertig: ["Massivholz: Schwund durch Klimaveränderungen", "Polsterstühle: Reinigbarkeit prüfen"],
    },
  },
  regal_schrank: {
    label: "Regal / Schrank",
    preise: {
      einfach:   { min: 100, mittel: 300,   max: 600 },
      mittel:    { min: 400, mittel: 800,   max: 1_500 },
      hochwertig: { min: 1_000, mittel: 2_500, max: 7_000 },
    },
    lieferung: { min: 50, max: 150 },
    montage: { min: 50, max: 200 },
    qualitaetsHinweise: {
      einfach:   ["Traglast pro Boden prüfen (mind. 20 kg)", "Wandbefestigung zwingend bei hohen Regalen"],
      mittel:    ["Rückwand-Stärke wichtig für Stabilität", "Verstellbare Böden bevorzugen"],
      hochwertig: ["Massivholz/Metall: sehr langlebig", "Maßanfertigung: Montagezeit und Garantie klären"],
    },
  },
  schreibtisch: {
    label: "Schreibtisch",
    preise: {
      einfach:   { min: 100, mittel: 250,   max: 500 },
      mittel:    { min: 400, mittel: 800,   max: 1_500 },
      hochwertig: { min: 1_200, mittel: 2_500, max: 6_000 },
    },
    lieferung: { min: 30, max: 150 },
    montage: { min: 30, max: 150 },
    qualitaetsHinweise: {
      einfach:   ["Plattenstärke mind. 25 mm für Stabilität", "Kabeldurchführung oft nachträglich teuer"],
      mittel:    ["Höhenverstellbarkeit prüfen (ergonomisch sinnvoll)", "Schubladenführung auf Dämpfer prüfen"],
      hochwertig: ["Elektrisch höhenverstellbar: Motorgarantie prüfen", "Massivholz: Schwund möglich"],
    },
  },
  kommode: {
    label: "Kommode",
    preise: {
      einfach:   { min: 80,  mittel: 200,   max: 400 },
      mittel:    { min: 300, mittel: 600,   max: 1_000 },
      hochwertig: { min: 800, mittel: 1_800, max: 5_000 },
    },
    lieferung: { min: 30, max: 150 },
    montage: { min: 30, max: 100 },
    qualitaetsHinweise: {
      einfach:   ["Schubladen auf Laufqualität testen", "MDF: empfindlich gegen Feuchtigkeit"],
      mittel:    ["Vollholzschubladen langlebiger", "Schubladenführung mit Dämpfer bevorzugen"],
      hochwertig: ["Zertifiziertes Massivholz prüfen", "Griffqualität oft vernachlässigt"],
    },
  },
  matratze: {
    label: "Matratze",
    preise: {
      einfach:   { min: 100, mittel: 300,   max: 600 },
      mittel:    { min: 400, mittel: 700,   max: 1_200 },
      hochwertig: { min: 1_000, mittel: 2_000, max: 5_000 },
    },
    lieferung: { min: 0, max: 100 },
    qualitaetsHinweise: {
      einfach:   ["Schaumstoffdichte < 30 kg/m³: kurze Lebensdauer", "Härtegradanpassung prüfen"],
      mittel:    ["Schaumstoffdichte 35–40 kg/m³ gut", "Testperiode und Rückgabe wichtig"],
      hochwertig: ["Latexkern: Allergikergeeignet prüfen", "Garantie auf Einliegen mind. 10 Jahre"],
    },
  },
  sonstiges: {
    label: "Sonstiges Möbelstück",
    preise: {
      einfach:   { min: 50,  mittel: 200,  max: 500 },
      mittel:    { min: 300, mittel: 700,  max: 1_500 },
      hochwertig: { min: 800, mittel: 2_000, max: 8_000 },
    },
    lieferung: { min: 30, max: 200 },
    montage: { min: 30, max: 150 },
    qualitaetsHinweise: {
      einfach:   ["Verarbeitungsqualität direkt vor Ort prüfen"],
      mittel:    ["Garantieumfang und Rückgaberecht klären"],
      hochwertig: ["Zertifizierungen und Materialangaben anfordern"],
    },
  },
};

export function berechnesMoebel(input: MoebelInput): MoebelErgebnis {
  const ref = REFERENZ[input.kategorie];
  const preise = ref.preise[input.qualitaet];

  // Angebotsbewertung
  const abweichung = Math.round(((input.angebotspreis - preise.mittel) / preise.mittel) * 100);

  let einschaetzung: MoebelErgebnis["angebotsBewertung"]["einschaetzung"];
  let hinweis: string;

  if      (input.angebotspreis < preise.min * 0.7)  { einschaetzung = "sehr_guenstig"; hinweis = "Sehr günstiger Preis – Qualität, Material und Hersteller genau prüfen."; }
  else if (input.angebotspreis < preise.min * 0.95) { einschaetzung = "guenstig";      hinweis = "Günstiger Preis – auf Vollständigkeit der Ausstattung achten."; }
  else if (input.angebotspreis <= preise.max * 1.05){ einschaetzung = "marktgerecht";  hinweis = "Preis im marktüblichen Rahmen."; }
  else if (input.angebotspreis <= preise.max * 1.3) { einschaetzung = "teuer";         hinweis = "Preis im oberen Marktbereich – auf Besonderheiten achten."; }
  else                                               { einschaetzung = "sehr_teuer";   hinweis = "Preis deutlich über Marktdurchschnitt – klären was inklusive ist."; }

  // Lieferung und Montage
  const lieferungKosten = !input.lieferung && ref.lieferung ? ref.lieferung : null;
  const montageKosten   = !input.montage   && ref.montage   ? ref.montage   : null;

  const lieferZusatz = lieferungKosten ? (lieferungKosten.min + lieferungKosten.max) / 2 : 0;
  const montageZusatz = montageKosten  ? (montageKosten.min  + montageKosten.max)  / 2 : 0;

  const gesamtkosten = {
    min: input.angebotspreis + (lieferungKosten?.min ?? 0) + (montageKosten?.min ?? 0),
    max: input.angebotspreis + (lieferungKosten?.max ?? 0) + (montageKosten?.max ?? 0),
  };

  void lieferZusatz;
  void montageZusatz;

  const qualitaetsHinweise = ref.qualitaetsHinweise[input.qualitaet];

  const grundlagen: string[] = [
    "Referenzpreise: Statista Möbelmarkt Deutschland, Stiftung Warentest Preisführer",
    "Preislagen variieren je nach Marke, Material und Vertriebsweg erheblich",
    `Kategorie: ${ref.label}, Qualitätsniveau: ${input.qualitaet}`,
    input.massanfertigung ? "Maßanfertigung: 30-100% Aufschlag auf Serienware üblich" : "",
    "Vergleichsangebote einholen: Möbelpreise stark verhandelbar",
  ].filter(Boolean);

  const qualitaetLabels: Record<MoebelQualitaet, string> = {
    einfach: "Einfach / Einsteiger",
    mittel: "Standard / Mittelklasse",
    hochwertig: "Hochwertig / Premium",
  };

  return {
    kategorieLabel: ref.label,
    qualitaetLabel: qualitaetLabels[input.qualitaet],
    referenzPreis: preise,
    angebotsBewertung: { einschaetzung, abweichungProzent: abweichung, hinweis },
    lieferungKosten,
    montageKosten,
    gesamtkosten,
    qualitaetsHinweise,
    grundlagen,
  };
}
