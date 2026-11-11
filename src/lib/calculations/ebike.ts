// E-Bike-Kaufcheck – Berechnungsmodul
export type EBikeKlasse = "pedelec_25" | "speed_pedelec_45" | "e_cargo" | "e_mountainbike";
export type MotorPosition = "mittelmotor" | "heckmotor" | "frontmotor";

export interface EBikeInput {
  klasse: EBikeKlasse; motorPosition: MotorPosition;
  angebotspreis: number; akkuKapazitaet: number; // Wh
  motorLeistung?: number; // W
  reichweite?: number; // km laut Hersteller
  hersteller?: string; garantieJahre?: number;
  zusatzAngaben?: string;
}

export interface EBikeErgebnis {
  klasseLabel: string; motorLabel: string;
  referenzPreis: { min: number; max: number; mittel: number };
  angebotsBewertung: { einschaetzung: "sehr_guenstig" | "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer"; hinweis: string };
  betriebskosten: { akkuReichweite_km: number; kostenPro100km: number; jahresstromkosten: number };
  qualitaetsHinweise: string[];
  grundlagen: string[];
}

const KLASSEN: Record<EBikeKlasse, { label: string; preise: { min: number; max: number; mittel: number } }> = {
  pedelec_25:         { label: "Pedelec (bis 25 km/h)", preise: { min: 800,   max: 6_000,  mittel: 2_500 } },
  speed_pedelec_45:   { label: "S-Pedelec (bis 45 km/h)",preise: { min: 2_500, max: 10_000, mittel: 5_000 } },
  e_cargo:            { label: "E-Lastenrad",           preise: { min: 2_000, max: 10_000, mittel: 4_500 } },
  e_mountainbike:     { label: "E-Mountainbike",        preise: { min: 2_000, max: 12_000, mittel: 5_000 } },
};

export function berechneEBike(input: EBikeInput): EBikeErgebnis {
  const ref = KLASSEN[input.klasse];
  const p = ref.preise;
  let einschaetzung: EBikeErgebnis["angebotsBewertung"]["einschaetzung"];
  let hinweis: string;
  if      (input.angebotspreis < p.min * 0.75) { einschaetzung = "sehr_guenstig"; hinweis = "Sehr günstiger Preis – No-Name-Motor und Billigakku möglich."; }
  else if (input.angebotspreis < p.min)         { einschaetzung = "guenstig";      hinweis = "Günstiger Preis – Markenkomponenten prüfen."; }
  else if (input.angebotspreis <= p.max)        { einschaetzung = "marktgerecht";  hinweis = "Preis im marktüblichen Bereich."; }
  else if (input.angebotspreis <= p.max * 1.2)  { einschaetzung = "teuer";         hinweis = "Preis im oberen Segment."; }
  else                                           { einschaetzung = "sehr_teuer";   hinweis = "Sehr hoher Preis – Ausstattung genau prüfen."; }

  // Betriebskosten: 1 kWh Laden ~0.32 €, Verbrauch ~8–15 Wh/km
  const verbrauchWh = 12; // Mittelwert Wh/km
  const akkuReichweite_km = Math.round((input.akkuKapazitaet / verbrauchWh) * 0.8); // 80% nutzbar
  const kostenPro100km = parseFloat(((verbrauchWh / 1000) * 0.32 * 100).toFixed(2));
  const jahresfahrleistung = 2000;
  const jahresstromkosten = Math.round(jahresfahrleistung * verbrauchWh / 1000 * 0.32);

  const motorLabels: Record<MotorPosition, string> = { mittelmotor: "Mittelmotor", heckmotor: "Heckmotor", frontmotor: "Frontmotor" };
  const qualitaetsHinweise = [
    input.motorPosition === "mittelmotor" ? "Mittelmotor: Beste Kraftübertragung, teurer in Reparatur" : "Nabenmotor: Günstiger, weniger natürliches Fahrgefühl",
    "Markenakku (z.B. Bosch, Shimano, Yamaha) bevorzugen",
    `Garantie: mind. ${input.garantieJahre ?? "2"} Jahre auf Motor und Akku prüfen`,
    "Reichweite: Herstellerangabe -30% für reale Bedingungen einplanen",
  ];

  return {
    klasseLabel: ref.label, motorLabel: motorLabels[input.motorPosition],
    referenzPreis: p,
    angebotsBewertung: { einschaetzung, hinweis },
    betriebskosten: { akkuReichweite_km, kostenPro100km, jahresstromkosten },
    qualitaetsHinweise,
    grundlagen: ["Referenzpreise: ZIV E-Bike-Markt 2024, Stiftung Warentest E-Bike-Tests", "Betriebskosten bei ~2.000 km/Jahr und 32 ct/kWh"],
  };
}
