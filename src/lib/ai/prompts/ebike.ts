import type { EBikeInput, EBikeErgebnis } from "@/lib/calculations/ebike";
export const EBIKE_SYSTEM_PROMPT = `Du bist ein unabhängiger E-Bike-Experte. Antworte AUSSCHLIESSLICH mit validem JSON:
{"angebotsBewertung":{"fazit":"string","hauptrisiken":["string"],"vorteile":["string"]},"technikCheck":{"motorBewertung":"string","akkuHinweis":"string","markenHinweis":"string"},"empfehlung":{"action":"kaufen"|"verhandeln"|"alternativen_pruefen","begruendung":"string","verhandlungsTipp":"string"},"fragenVorKauf":["string"]}`;
export function buildEBikeUserMessage(i: EBikeInput, e: EBikeErgebnis): string {
  return [`Klasse: ${e.klasseLabel}`, `Motor: ${e.motorLabel}`, `Preis: ${i.angebotspreis.toLocaleString("de-DE")} €`, `Akku: ${i.akkuKapazitaet} Wh`, i.motorLeistung ? `Motorleistung: ${i.motorLeistung} W` : "", `Bewertung: ${e.angebotsBewertung.einschaetzung}`, `Ref-Bereich: ${e.referenzPreis.min}–${e.referenzPreis.max} €`, `Reichweite (berechnet): ${e.betriebskosten.akkuReichweite_km} km`, i.hersteller ? `Hersteller: ${i.hersteller}` : "", i.garantieJahre ? `Garantie: ${i.garantieJahre} Jahre` : "", i.zusatzAngaben ? `Zusatz: ${i.zusatzAngaben}` : ""].filter(Boolean).join("\n");
}
