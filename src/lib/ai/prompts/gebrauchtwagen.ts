// KI-Prompt für den Gebrauchtwagen-Kaufcheck
// KI interpretiert nur – alle Zahlen kommen aus der Berechnungsengine.

export const GEBRAUCHTWAGEN_SYSTEM_PROMPT = `Du bist ein sachlicher Gebrauchtwagen-Kaufberater.

DEINE AUFGABE:
- Erkläre die berechneten Betriebskosten verständlich
- Bewerte das Fahrzeugangebot auf Basis der Daten
- Weise auf typische Risiken bei Gebrauchtwagen hin
- Gib konkrete Fragen für den Kauf mit

ABSOLUT VERBOTENE VERHALTENSWEISEN:
- Keine erfundenen Marktpreisvergleiche (DAT/Schwacke-Daten sind nicht verfügbar)
- Keine Garantien zu Fahrzeugzustand ohne technische Prüfung
- Keine spezifischen Modellmängel ohne gesicherte Daten
- Keine Rechts- oder Versicherungsberatung
- Keine dekorativen Emojis in der Analyse

AUSGABEFORMAT:
Antworte AUSSCHLIESSLICH mit validem JSON:

{
  "zusammenfassung": "2-3 Sätze Gesamteinschätzung der Wirtschaftlichkeit",
  "kostenBewertung": {
    "einschaetzung": "günstig" | "marktüblich" | "teuer" | "nicht beurteilbar",
    "begruendung": "Begründung auf Basis der Betriebskosten",
    "einschraenkungen": ["Liste der Einschränkungen"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch" | "mittel" | "niedrig",
      "hinweis": "Konkreter Risikohinweis",
      "empfehlung": "Was zu tun ist"
    }
  ],
  "fragenFuerKauf": ["Konkrete Fragen für Verkäufer oder Händler"],
  "pruefpunkte": ["Was unbedingt zu prüfen ist (HU, Unfallschäden, etc.)"],
  "einschraenkungen": ["Was diese Analyse nicht leisten kann"]
}`;

export function buildGebrauchtwagenUserMessage(params: {
  marke: string;
  modell: string;
  baujahr: number;
  kilometerstand: number;
  kraftstoff: string;
  kaufpreis: number;
  jahresfahrleistung: number;
  betriebskostenJaehrlich: number;
  betriebskosten5Jahre: number;
  kostenProKm: number;
  geschaetzterRestwert: number;
  wertverlust5Jahre: number;
  gesamtkostenMitKauf: number;
  fahrzeugalter: number;
  positionen: Array<{ bezeichnung: string; jahreskosten: number; grundlage: string }>;
  zusatzAngaben?: string;
}): string {
  const lines = [
    "## Gebrauchtwagen-Analyseanfrage",
    "",
    "### Fahrzeugdaten (vom Nutzer eingegeben)",
    `- Fahrzeug: ${params.marke} ${params.modell}`,
    `- Baujahr: ${params.baujahr} (Alter: ${params.fahrzeugalter} Jahre)`,
    `- Kilometerstand: ${params.kilometerstand.toLocaleString("de-DE")} km`,
    `- Kraftstoff: ${params.kraftstoff}`,
    `- Kaufpreis: ${params.kaufpreis.toLocaleString("de-DE")} €`,
    `- Jahresfahrleistung: ${params.jahresfahrleistung.toLocaleString("de-DE")} km`,
    "",
    "### Berechnete Betriebskosten (5 Jahre, deterministische Rechnung)",
    `- Betriebskosten/Jahr: ${params.betriebskostenJaehrlich.toLocaleString("de-DE")} €`,
    `- Betriebskosten gesamt (5 J.): ${params.betriebskosten5Jahre.toLocaleString("de-DE")} €`,
    `- Kosten pro km: ${params.kostenProKm.toFixed(2)} €/km`,
    `- Gesamtkosten inkl. Kauf: ${params.gesamtkostenMitKauf.toLocaleString("de-DE")} €`,
    `- Geschätzter Restwert nach 5 Jahren: ${params.geschaetzterRestwert.toLocaleString("de-DE")} €`,
    `- Wertverlust 5 Jahre: ${params.wertverlust5Jahre.toLocaleString("de-DE")} €`,
    "",
    "### Einzelpositionen",
    ...params.positionen.map((p) => `- ${p.bezeichnung}: ${p.jahreskosten.toLocaleString("de-DE")} €/Jahr (${p.grundlage})`),
    "",
    "### Wichtige Einschränkungen der Berechnung",
    "- KEIN Marktpreisvergleich möglich (DAT/Schwacke nicht verfügbar)",
    "- Versicherungs- und Steuerwerte sind Schätzungen",
    "- Reparaturkosten und unvorhergesehene Schäden nicht enthalten",
  ];

  if (params.zusatzAngaben) {
    lines.push("", "### Zusätzliche Angaben des Nutzers", params.zusatzAngaben);
  }

  lines.push("", "Erstelle deine Analyse gemäß dem vorgegebenen JSON-Schema.");
  return lines.join("\n");
}
