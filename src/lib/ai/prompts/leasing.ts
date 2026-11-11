import type { LeasingInput, LeasingErgebnis } from "@/lib/calculations/leasing";

export const LEASING_SYSTEM_PROMPT = `Du bist ein unabhängiger Kfz-Finanzierungsexperte.
Deine Aufgabe: Komprimierte, ehrliche Einschätzung eines Leasingangebots.

Antworte AUSSCHLIESSLICH mit validem JSON (kein Markdown, kein Text davor/danach):

{
  "angebotsBewertung": {
    "fazit": "string (1-2 Sätze: Lohnt sich das Leasing?)",
    "hauptrisiken": ["string"],
    "vorteile": ["string"]
  },
  "konditionenCheck": {
    "auffaelligkeiten": ["string – z.B. hoher Restwert, unklare Konditionen"],
    "versteckteKosten": ["string – typische Kostenfallen"],
    "kilometerRisiko": "string (Einschätzung zum Kilometerrisiko)"
  },
  "steuerHinweis": "string (kurzer Hinweis für Privat vs. Gewerbe, falls relevant)",
  "empfehlung": {
    "action": "leasing_empfohlen" | "kaufen_besser" | "konditionen_pruefen" | "anderes_angebot",
    "begruendung": "string (1-2 Sätze)",
    "verhandlungsTipp": "string"
  },
  "fragenFuerHaendler": ["string – 3-4 Fragen vor Vertragsunterzeichnung"],
  "alternativenHinweis": "string"
}

Regeln:
- Keine erfundenen Restwerte oder Zinsen nennen
- Steuervorteile nur allgemein beschreiben, keine konkreten Zahlen ohne Datenbasis
- Praxisnah und ohne Marketingsprache`;

export function buildLeasingUserMessage(input: LeasingInput, ergebnis: LeasingErgebnis): string {
  const lines: string[] = [
    `Fahrzeuglisten preis: ${input.fahrzeugListenpreis.toLocaleString("de-DE")} €`,
    input.fahrzeugModell ? `Fahrzeug: ${input.fahrzeugModell}` : "",
    `Leasingtyp: ${input.leasingTyp === "gewerblich" ? "Gewerblich" : "Privat"}`,
    `Monatliche Rate: ${input.leasingrate.toLocaleString("de-DE")} €`,
    `Laufzeit: ${input.laufzeit} Monate`,
    `Kilometer/Jahr: ${input.kilometerProJahr.toLocaleString("de-DE")} km`,
    input.anzahlung ? `Anzahlung: ${input.anzahlung.toLocaleString("de-DE")} €` : "Anzahlung: keine",
    input.restwert  ? `Vertragsrestwert: ${input.restwert.toLocaleString("de-DE")} €` : `Geschätzter Restwert: ${ergebnis.verbleibenderRestwert.toLocaleString("de-DE")} €`,
    "",
    `Rate als % des Listenpreises: ${ergebnis.ratenBewertung.prozentVonListenpreis}% (Marktrichtwert ~1%)`,
    `Bewertung: ${ergebnis.ratenBewertung.einschaetzung.replace("_", " ")}`,
    "",
    `Gesamtkosten Leasing: ${ergebnis.gesamteLeasingkosten.toLocaleString("de-DE")} €`,
    `Kapitalverlust Kauf (Wertverlust): ${ergebnis.kapitalverlust.toLocaleString("de-DE")} €`,
    `Differenz Leasing vs. Kauf: ${ergebnis.leasingVsKaufVergleich.differenz > 0 ? "+" : ""}${ergebnis.leasingVsKaufVergleich.differenz.toLocaleString("de-DE")} €`,
    `Vergleich: ${ergebnis.leasingVsKaufVergleich.empfehlung}`,
  ].filter(Boolean);

  if (input.versicherungProMonat) lines.push(`Versicherung: ${input.versicherungProMonat} €/Monat`);
  if (input.wartungProMonat)      lines.push(`Wartung/Service: ${input.wartungProMonat} €/Monat`);
  if (ergebnis.kostenuebersicht.gesamtTCO !== ergebnis.gesamteLeasingkosten)
    lines.push(`TCO (Gesamtaufwand): ${ergebnis.kostenuebersicht.gesamtTCO.toLocaleString("de-DE")} €`);
  if (input.zusatzAngaben) lines.push(``, `Zusatzangaben: ${input.zusatzAngaben}`);

  return lines.join("\n");
}
