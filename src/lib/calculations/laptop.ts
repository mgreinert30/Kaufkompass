// Laptop- und PC-Check – Berechnungsmodul
export type GeraetTyp = "laptop_einsteiger" | "laptop_mittelklasse" | "laptop_profi" | "desktop_pc" | "gaming_pc" | "macbook";
export type Verwendungszweck = "buero_web" | "homeoffice" | "kreativ_foto_video" | "gaming" | "programmierung" | "schulstudium";

export interface LaptopInput {
  geraetTyp: GeraetTyp; verwendungszweck: Verwendungszweck;
  angebotspreis: number; hersteller?: string; modell?: string;
  prozessor?: string; ramGb?: number; speicherGb?: number;
  bildschirmzoll?: number; betriebssystem?: string;
  garantieJahre?: number; refurbished?: boolean;
  zusatzAngaben?: string;
}

export interface LaptopErgebnis {
  typLabel: string; zweckLabel: string;
  referenzPreis: { min: number; max: number; mittel: number };
  angebotsBewertung: { einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer"; hinweis: string };
  anforderungsCheck: { erfuellt: string[]; fehlend: string[] };
  empfehlung: string;
  grundlagen: string[];
}

const TYPEN: Record<GeraetTyp, { label: string; preise: { min: number; max: number; mittel: number } }> = {
  laptop_einsteiger: { label: "Einsteiger-Laptop",    preise: { min: 250,   max: 600,   mittel: 400 } },
  laptop_mittelklasse: { label: "Mittelklasse-Laptop",preise: { min: 500,   max: 1_200, mittel: 800 } },
  laptop_profi:      { label: "Profi-Laptop",         preise: { min: 1_000, max: 3_000, mittel: 1_800 } },
  desktop_pc:        { label: "Desktop-PC",           preise: { min: 400,   max: 1_500, mittel: 800 } },
  gaming_pc:         { label: "Gaming-PC",            preise: { min: 800,   max: 4_000, mittel: 1_800 } },
  macbook:           { label: "MacBook",              preise: { min: 1_100, max: 4_000, mittel: 1_800 } },
};

const ANFORDERUNGEN: Record<Verwendungszweck, { label: string; minRam: number; empfRam: number; minSpeicher: number }> = {
  buero_web:          { label: "Büro & Web",           minRam: 4,  empfRam: 8,  minSpeicher: 128 },
  homeoffice:         { label: "Homeoffice",           minRam: 8,  empfRam: 16, minSpeicher: 256 },
  kreativ_foto_video: { label: "Kreativ (Foto/Video)", minRam: 16, empfRam: 32, minSpeicher: 512 },
  gaming:             { label: "Gaming",               minRam: 16, empfRam: 32, minSpeicher: 512 },
  programmierung:     { label: "Programmierung",       minRam: 16, empfRam: 32, minSpeicher: 512 },
  schulstudium:       { label: "Schule/Studium",       minRam: 8,  empfRam: 16, minSpeicher: 256 },
};

export function berechneLaptop(input: LaptopInput): LaptopErgebnis {
  const ref = TYPEN[input.geraetTyp];
  const anf = ANFORDERUNGEN[input.verwendungszweck];
  const p = ref.preise;
  let einschaetzung: LaptopErgebnis["angebotsBewertung"]["einschaetzung"];
  let hinweis: string;
  if      (input.angebotspreis < p.min * 0.75) { einschaetzung = "sehr_guenstig"; hinweis = "Sehr günstiger Preis – Spezifikationen sorgfältig prüfen."; }
  else if (input.angebotspreis < p.min)         { einschaetzung = "guenstig";      hinweis = "Günstiger Preis – auf vollständige Ausstattung achten."; }
  else if (input.angebotspreis <= p.max)        { einschaetzung = "marktgerecht";  hinweis = "Preis im marktüblichen Bereich."; }
  else if (input.angebotspreis <= p.max * 1.2)  { einschaetzung = "teuer";         hinweis = "Preis eher hoch für diese Kategorie."; }
  else                                           { einschaetzung = "sehr_teuer";   hinweis = "Deutlich über Marktdurchschnitt."; }

  const erfuellt: string[] = []; const fehlend: string[] = [];
  if (input.ramGb) {
    if (input.ramGb >= anf.empfRam) erfuellt.push(`RAM: ${input.ramGb} GB (empfohlen: ${anf.empfRam} GB) ✓`);
    else if (input.ramGb >= anf.minRam) fehlend.push(`RAM: ${input.ramGb} GB (empfohlen: ${anf.empfRam} GB für ${anf.label})`);
    else fehlend.push(`RAM: ${input.ramGb} GB zu wenig (Minimum: ${anf.minRam} GB)`);
  }
  if (input.speicherGb) {
    if (input.speicherGb >= anf.minSpeicher) erfuellt.push(`Speicher: ${input.speicherGb} GB ✓`);
    else fehlend.push(`Speicher: ${input.speicherGb} GB zu wenig (empfohlen: ${anf.minSpeicher} GB)`);
  }

  const empfehlung = input.refurbished ? "Refurbished: Zertifizierten Händler wählen, Garantie prüfen (mind. 12 Monate)." : `Für ${anf.label} geeignet. Vergleich auf Geizhals.de empfohlen.`;

  return {
    typLabel: ref.label, zweckLabel: anf.label,
    referenzPreis: p,
    angebotsBewertung: { einschaetzung, hinweis },
    anforderungsCheck: { erfuellt, fehlend },
    empfehlung,
    grundlagen: ["Referenzpreise: Geizhals.de Marktdaten, Notebookcheck.com", "Anforderungen nach typischem Nutzungsprofil"],
  };
}
