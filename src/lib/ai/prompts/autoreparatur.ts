import type { AutoreparaturInput, AutoreparaturErgebnis } from "@/lib/calculations/autoreparatur";

export const AUTOREPARATUR_SYSTEM_PROMPT = `Du bist ein unabhängiger Kfz-Sachverständiger und Verbraucherschützer.
Deine Aufgabe: Komprimierte, ehrliche Einschätzung eines Werkstattangebots auf Basis der vorliegenden Daten.

Antworte AUSSCHLIESSLICH mit validem JSON (kein Markdown, kein Text davor/danach):

{
  "angebotsBewertung": {
    "fazit": "string (1-2 Sätze: Lohnt sich das Angebot / ist es transparent?)",
    "hauptrisiken": ["string"],
    "positivePunkte": ["string"]
  },
  "positionenCheck": {
    "auffaelligkeiten": ["string – unklare oder fehlende Positionen"],
    "typischeZusatzkosten": ["string – was könnte noch dazukommen"],
    "fehlendePflichtangaben": ["string – was der Kostenvoranschlag enthalten sollte"]
  },
  "empfehlung": {
    "action": "annehmen" | "verhandeln" | "zweites_angebot" | "ablehnen",
    "begruendung": "string (1-2 Sätze)",
    "verhandlungsTipp": "string (konkreter Tipp)"
  },
  "fragenFuerWerkstatt": ["string – 3-4 konkrete Fragen vor Auftragserteilung"],
  "alternativenHinweis": "string (kurzer Hinweis auf Möglichkeiten)"
}

Regeln:
- Keine erfundenen Preise oder Stundensätze nennen
- Keine spezifischen Werkstätten empfehlen
- Keine Diagnose oder technische Beurteilung ohne ausreichende Daten
- Praxisnah: Was würde ein Verbraucherschutzexperte raten?`;

export function buildAutoreparaturUserMessage(input: AutoreparaturInput, ergebnis: AutoreparaturErgebnis): string {
  const lines: string[] = [
    `Werkstatttyp: ${ergebnis.werkstattLabel}`,
    `Fahrzeugklasse: ${ergebnis.fahrzeugKlasseLabel}`,
    `Angebotspreis gesamt: ${input.angebotspreis.toLocaleString("de-DE")} €`,
  ];

  if (input.hauptarbeit)   lines.push(`Hauptarbeit: ${input.hauptarbeit}`);
  if (input.stundensatz)   lines.push(`Angebotener Stundensatz: ${input.stundensatz} €/h`);
  if (input.arbeitszeit)   lines.push(`Arbeitszeit: ${input.arbeitszeit} Stunden`);
  if (ergebnis.kostenaufschluesselung.arbeitskosten !== null)
    lines.push(`Kalkulierte Arbeitskosten: ${ergebnis.kostenaufschluesselung.arbeitskosten.toLocaleString("de-DE")} €`);
  if (ergebnis.kostenaufschluesselung.teilekosten !== null)
    lines.push(`Teilekosten: ${ergebnis.kostenaufschluesselung.teilekosten.toLocaleString("de-DE")} €`);
  if (ergebnis.kostenaufschluesselung.sonstige !== null)
    lines.push(`Nicht erklärter Rest: ${ergebnis.kostenaufschluesselung.sonstige.toLocaleString("de-DE")} €`);
  if (input.fahrzeugAlter) lines.push(`Fahrzeugalter: ${input.fahrzeugAlter} Jahre`);
  if (input.kilometerstand) lines.push(`Kilometerstand: ${input.kilometerstand.toLocaleString("de-DE")} km`);

  lines.push(``, `Stundensatz-Referenz für ${ergebnis.werkstattLabel}: ${ergebnis.stundensatzReferenz.min}–${ergebnis.stundensatzReferenz.max} €/h (Mittel: ${ergebnis.stundensatzReferenz.marktMittel} €/h)`);
  lines.push(`Transparenz-Score: ${ergebnis.transparenzScore}/3`);

  if (ergebnis.transparenzHinweise.length > 0) {
    lines.push(`Fehlende Transparenz: ${ergebnis.transparenzHinweise.join("; ")}`);
  }
  if (ergebnis.risikoHinweise.length > 0) {
    lines.push(`Risikohinweise: ${ergebnis.risikoHinweise.join("; ")}`);
  }
  if (input.positionen && input.positionen.length > 0) {
    lines.push(``, `Positionen im Angebot:`);
    input.positionen.forEach((p) => {
      const teile = p.teilepreis ? ` (Teile: ${p.teilepreis} €)` : "";
      const arbeit = p.arbeitsstunden ? ` (${p.arbeitsstunden} h)` : "";
      lines.push(`  - ${p.beschreibung}${arbeit}${teile}`);
    });
  }
  if (input.zusatzAngaben) lines.push(``, `Zusatzangaben: ${input.zusatzAngaben}`);

  return lines.join("\n");
}
