import type { ElektroautoInput, ElektroautoErgebnis } from "@/lib/calculations/elektroauto";

export const ELEKTROAUTO_SYSTEM_PROMPT = `Du bist ein unabhängiger E-Mobilitätsexperte.
Antworte AUSSCHLIESSLICH mit validem JSON:

{
  "wirtschaftlichkeit": {
    "fazit": "string (1-2 Sätze)",
    "hauptkostentreiber": ["string"],
    "einsparpotenziale": ["string"]
  },
  "praktischeHinweise": {
    "reichweiteAlltag": "string (Einschätzung Alltagstauglichkeit)",
    "ladeempfehlung": "string",
    "akkuPflege": "string"
  },
  "empfehlung": {
    "action": "kaufen_empfohlen" | "abwarten" | "alternativen_pruefen",
    "begruendung": "string",
    "zeitpunkt": "string (wann wäre Kauf ideal?)"
  },
  "fragenVorKauf": ["string"],
  "foerderHinweis": "string (aktuelle Fördermöglichkeiten allgemein)"
}`;

export function buildElektroautoUserMessage(input: ElektroautoInput, e: ElektroautoErgebnis): string {
  return [
    input.fahrzeugModell ? `Fahrzeug: ${input.fahrzeugModell}` : "",
    `Kaufpreis: ${input.kaufpreis.toLocaleString("de-DE")} €`,
    `Typ: ${input.fahrzeugTyp === "bev" ? "Vollelektrisch (BEV)" : "Plug-in-Hybrid (PHEV)"}`,
    `Reichweite WLTP: ${input.reichweite} km, Akku: ${input.akkuKapazitaet} kWh`,
    `Verbrauch (berechnet): ${e.verbrauchPro100km} kWh/100 km`,
    `Jahresfahrleistung: ${input.jahresfahrleistung.toLocaleString("de-DE")} km`,
    `Ladekosten/Jahr (Haushalt): ${e.jahresLadekosten.toLocaleString("de-DE")} €`,
    `Ladeinfrastruktur: ${e.ladeinfrastrukturKosten.label}`,
    `TCO 5 Jahre: ${e.tco5Jahre.gesamtTCO.toLocaleString("de-DE")} €`,
    `TCO/km: ${e.tco5Jahre.tcoProKm} €`,
    e.vergleichVerbrenner.moeglich ? `Vergleich Verbrenner TCO 5J: ${e.vergleichVerbrenner.tco5JahreVerbrenner?.toLocaleString("de-DE")} €` : "",
    e.vergleichVerbrenner.ersparnisBeiElektro !== null ? `Ersparnis E-Auto: ${e.vergleichVerbrenner.ersparnisBeiElektro.toLocaleString("de-DE")} €` : "",
    input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : "",
  ].filter(Boolean).join("\n");
}
