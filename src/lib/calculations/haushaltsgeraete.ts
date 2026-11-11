// Haushaltsgeräte-Check – Berechnungsmodul
export type GeraeteTyp = "kuehlschrank" | "waschmaschine" | "trockner" | "geschirrspueler" | "herd_backofen" | "mikrowelle" | "staubsauger" | "kaffeemaschine";
export type EnergieKlasse = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface HaushaltsgeraeteInput {
  geraeteTyp: GeraeteTyp; energieKlasse: EnergieKlasse;
  angebotspreis: number; hersteller?: string; modell?: string;
  jahresverbrauchKwh?: number;
  strompreis?: number; // ct/kWh
  garantieJahre?: number;
  zusatzAngaben?: string;
}

export interface HaushaltsgeraeteErgebnis {
  typLabel: string;
  referenzPreis: { min: number; max: number; mittel: number };
  angebotsBewertung: { einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer"; hinweis: string };
  betriebskosten10Jahre: { strom: number; gesamt: number };
  energieklasseHinweis: string;
  grundlagen: string[];
}

const GERAETE: Record<GeraeteTyp, { label: string; preise: { min: number; max: number; mittel: number }; typVerbrauchKwh: number }> = {
  kuehlschrank:    { label: "Kühlschrank",        preise: { min: 200, max: 2_000, mittel: 600  }, typVerbrauchKwh: 150 },
  waschmaschine:   { label: "Waschmaschine",      preise: { min: 300, max: 1_500, mittel: 650  }, typVerbrauchKwh: 170 },
  trockner:        { label: "Trockner",           preise: { min: 300, max: 1_500, mittel: 700  }, typVerbrauchKwh: 250 },
  geschirrspueler: { label: "Geschirrspüler",     preise: { min: 300, max: 1_500, mittel: 600  }, typVerbrauchKwh: 240 },
  herd_backofen:   { label: "Herd mit Backofen",  preise: { min: 400, max: 3_000, mittel: 900  }, typVerbrauchKwh: 150 },
  mikrowelle:      { label: "Mikrowelle",         preise: { min: 50,  max: 500,   mittel: 150  }, typVerbrauchKwh: 50  },
  staubsauger:     { label: "Staubsauger",        preise: { min: 50,  max: 1_000, mittel: 250  }, typVerbrauchKwh: 30  },
  kaffeemaschine:  { label: "Kaffeemaschine",     preise: { min: 50,  max: 1_500, mittel: 300  }, typVerbrauchKwh: 80  },
};

export function berechneHaushaltsgeraet(input: HaushaltsgeraeteInput): HaushaltsgeraeteErgebnis {
  const ref = GERAETE[input.geraeteTyp];
  const p = ref.preise;
  let einschaetzung: HaushaltsgeraeteErgebnis["angebotsBewertung"]["einschaetzung"];
  let hinweis: string;
  if      (input.angebotspreis < p.min * 0.75) { einschaetzung = "sehr_guenstig"; hinweis = "Sehr günstiger Preis – Ausstattung prüfen."; }
  else if (input.angebotspreis < p.min)         { einschaetzung = "guenstig";      hinweis = "Günstiger Preis für diese Kategorie."; }
  else if (input.angebotspreis <= p.max)        { einschaetzung = "marktgerecht";  hinweis = "Preis im marktüblichen Bereich."; }
  else if (input.angebotspreis <= p.max * 1.2)  { einschaetzung = "teuer";         hinweis = "Preis eher hoch."; }
  else                                           { einschaetzung = "sehr_teuer";   hinweis = "Deutlich über Marktdurchschnitt."; }

  const verbrauch = input.jahresverbrauchKwh ?? ref.typVerbrauchKwh;
  const strompreis = (input.strompreis ?? 32) / 100;
  const strom10J = Math.round(verbrauch * 10 * strompreis);
  const gesamt10J = input.angebotspreis + strom10J;

  const klasseGut = ["A", "B"].includes(input.energieKlasse);
  const energieklasseHinweis = klasseGut
    ? `Energieklasse ${input.energieKlasse}: Gute Effizienz – langfristig günstiger Betrieb.`
    : `Energieklasse ${input.energieKlasse}: Höherer Stromverbrauch. Differenz zu Klasse A: bis zu ${Math.round((verbrauch * 0.3) * 10 * strompreis)} € in 10 Jahren.`;

  return {
    typLabel: ref.label,
    referenzPreis: p,
    angebotsBewertung: { einschaetzung, hinweis },
    betriebskosten10Jahre: { strom: strom10J, gesamt: gesamt10J },
    energieklasseHinweis,
    grundlagen: ["Referenzpreise: Stiftung Warentest, idealo.de", "Betriebskosten: typischer Jahresverbrauch laut EU-Datenblatt"],
  };
}
