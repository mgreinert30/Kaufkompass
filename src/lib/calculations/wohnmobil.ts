// Wohnmobil-Check – Berechnungsmodul
export type WohnmobilTyp = "alkoven" | "teilintegriert" | "vollintegriert" | "van_campingbus" | "caravan";

export interface WohnmobilInput {
  typ: WohnmobilTyp; kaufpreis: number; baujahr: number;
  kilometerstand?: number; schlafplaetze?: number;
  tüvBis?: string; mitGarantie?: boolean;
  jahreskosten?: number; // Versicherung + Stellplatz pauschal
  zusatzAngaben?: string;
}

export interface WohnmobilErgebnis {
  typLabel: string;
  alterInJahren: number;
  werteinschaetzung: { einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer"; hinweis: string };
  jaehrlicheKosten: { versicherung: number; stellplatz: number; wartung: number; gesamt: number };
  risikoHinweise: string[];
  grundlagen: string[];
}

const TYPPREISE: Record<WohnmobilTyp, { label: string; preise: { min: number; max: number; mittel: number } }> = {
  alkoven:         { label: "Alkovenmobil",    preise: { min: 8_000,  max: 60_000,  mittel: 25_000 } },
  teilintegriert:  { label: "Teilintegriert",  preise: { min: 15_000, max: 80_000,  mittel: 35_000 } },
  vollintegriert:  { label: "Vollintegriert",  preise: { min: 20_000, max: 120_000, mittel: 55_000 } },
  van_campingbus:  { label: "Van / Campingbus",preise: { min: 10_000, max: 70_000,  mittel: 30_000 } },
  caravan:         { label: "Wohnwagen",       preise: { min: 3_000,  max: 40_000,  mittel: 15_000 } },
};

export function berechneWohnmobil(input: WohnmobilInput): WohnmobilErgebnis {
  const ref = TYPPREISE[input.typ];
  const alterInJahren = new Date().getFullYear() - input.baujahr;
  const preisRef = ref.preise;

  let einschaetzung: WohnmobilErgebnis["werteinschaetzung"]["einschaetzung"];
  let hinweis: string;
  if      (input.kaufpreis < preisRef.min * 0.7) { einschaetzung = "sehr_guenstig"; hinweis = "Sehr günstiger Preis – Zustand und TÜV sorgfältig prüfen."; }
  else if (input.kaufpreis < preisRef.min)        { einschaetzung = "guenstig";      hinweis = "Günstiger Preis – Vollständige Prüfung empfohlen."; }
  else if (input.kaufpreis <= preisRef.max)       { einschaetzung = "marktgerecht";  hinweis = "Preis im marktüblichen Bereich."; }
  else if (input.kaufpreis <= preisRef.max * 1.3) { einschaetzung = "teuer";         hinweis = "Preis eher hoch – Ausstattung und Zustand prüfen."; }
  else                                             { einschaetzung = "sehr_teuer";   hinweis = "Deutlich über Marktdurchschnitt."; }

  const versicherung = input.typ === "caravan" ? 300 : Math.round(input.kaufpreis * 0.012);
  const stellplatz = input.typ === "caravan" ? 1_200 : 800;
  const wartung = Math.round(input.kaufpreis * 0.015);
  const gesamt = (input.jahreskosten ?? (versicherung + stellplatz + wartung));

  const risikoHinweise: string[] = [];
  if (alterInJahren > 15) risikoHinweise.push("Baujahr älter als 15 Jahre: Dichtungen, Gasanlage und Elektrik intensiv prüfen");
  if (input.kilometerstand && input.kilometerstand > 150_000) risikoHinweise.push("Hoher Kilometerstand: Motordiagnose empfohlen");
  if (!input.mitGarantie) risikoHinweise.push("Ohne Garantie: Puffer von 10% für Reparaturen einkalkulieren");

  return {
    typLabel: ref.label, alterInJahren,
    werteinschaetzung: { einschaetzung, hinweis },
    jaehrlicheKosten: { versicherung, stellplatz, wartung, gesamt },
    risikoHinweise,
    grundlagen: ["Referenzpreise: mobile.de Marktdaten, ADAC Campingführer", "Jahreskosten: Versicherung, Stellplatz, Wartungsschätzung"],
  };
}
