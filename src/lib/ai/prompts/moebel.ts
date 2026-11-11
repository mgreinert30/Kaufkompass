import type { MoebelInput, MoebelErgebnis } from "@/lib/calculations/moebel";

export const MOEBEL_SYSTEM_PROMPT = `Du bist ein unabhängiger Möbel- und Einrichtungsexperte.
Deine Aufgabe: Komprimierte, ehrliche Einschätzung eines Möbelangebots auf Basis von Preis, Material und Kategorie.

Antworte AUSSCHLIESSLICH mit validem JSON (kein Markdown, kein Text davor/danach):

{
  "angebotsBewertung": {
    "fazit": "string (1-2 Sätze: Lohnt sich der Kauf?)",
    "hauptrisiken": ["string", "string"],
    "staerken": ["string"]
  },
  "qualitaetsPruefung": {
    "woraufAchten": ["string – konkreter Prüfpunkt für dieses Möbelstück"],
    "typischeSchwachstellen": ["string – häufige Mängel bei dieser Kategorie/Qualitätsstufe"],
    "garantieHinweis": "string (Was sollte die Garantie abdecken?)"
  },
  "kaufEmpfehlung": {
    "empfehlung": "kaufen" | "verhandeln" | "alternativen_pruefen" | "ablehnen",
    "begruendung": "string (1-2 Sätze)",
    "verhandlungstipp": "string (konkreter Tipp, falls anwendbar)"
  },
  "fragenFuerAnbieter": ["string – 3 wichtige Fragen vor dem Kauf"],
  "alternativenHinweis": "string (kurzer Hinweis auf günstigere Alternativen oder bessere Qualität für ähnlichen Preis)"
}

Regeln:
- Keine erfundenen Preise, Marken oder Modelle nennen
- Keine spezifischen Shops empfehlen
- Praxisnah und ehrlich – keine Marketingsprache
- Besonderheiten wie Massanfertigung oder spezifische Materialien berücksichtigen`;

export function buildMoebelUserMessage(input: MoebelInput, ergebnis: MoebelErgebnis): string {
  const lines: string[] = [
    `Möbelkategorie: ${ergebnis.kategorieLabel}`,
    `Qualitätsniveau: ${ergebnis.qualitaetLabel}`,
    `Angebotspreis: ${input.angebotspreis.toLocaleString("de-DE")} €`,
    `Bewertung: ${ergebnis.angebotsBewertung.einschaetzung.replace("_", " ")} (${ergebnis.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}${ergebnis.angebotsBewertung.abweichungProzent}% ggü. Referenz)`,
    `Referenzpreis (Mittel): ${ergebnis.referenzPreis.mittel.toLocaleString("de-DE")} €`,
    `Referenzbereich: ${ergebnis.referenzPreis.min.toLocaleString("de-DE")} – ${ergebnis.referenzPreis.max.toLocaleString("de-DE")} €`,
  ];

  if (input.material)        lines.push(`Material: ${input.material}`);
  if (input.hersteller)      lines.push(`Hersteller/Marke: ${input.hersteller}`);
  if (input.massanfertigung) lines.push("Maßanfertigung: Ja");
  if (input.lieferung)       lines.push("Lieferung: inklusive");
  if (input.montage)         lines.push("Montage: inklusive");
  if (input.zusatzAngaben)   lines.push(`Zusatzinfo: ${input.zusatzAngaben}`);

  lines.push("", "Gesamtkosten inkl. geschätzter Zusatzleistungen:");
  lines.push(`  Min: ${ergebnis.gesamtkosten.min.toLocaleString("de-DE")} €`);
  lines.push(`  Max: ${ergebnis.gesamtkosten.max.toLocaleString("de-DE")} €`);

  if (ergebnis.lieferungKosten) lines.push(`Lieferung (nicht inklusive, geschätzt): ${ergebnis.lieferungKosten.min}–${ergebnis.lieferungKosten.max} €`);
  if (ergebnis.montageKosten)   lines.push(`Montage (nicht inklusive, geschätzt): ${ergebnis.montageKosten.min}–${ergebnis.montageKosten.max} €`);

  return lines.join("\n");
}
