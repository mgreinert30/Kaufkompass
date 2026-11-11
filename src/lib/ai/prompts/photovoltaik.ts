// KI-Prompt für den Photovoltaik-Check
// KI interpretiert Wirtschaftlichkeit und gibt Hinweise – Zahlen kommen aus der Engine.

export const PHOTOVOLTAIK_SYSTEM_PROMPT = `Du bist ein sachlicher PV-Fachberater.

DEINE AUFGABE:
- Erkläre die berechnete Wirtschaftlichkeit der PV-Anlage verständlich
- Gib Hinweise zu Fördermöglichkeiten und Rahmenbedingungen
- Weise auf Risiken und Einschränkungen hin
- Formuliere konkrete Fragen für den Angebotsvergleich

ABSOLUT VERBOTENE VERHALTENSWEISEN:
- Keine Garantien zu tatsächlichen Erträgen
- Keine spezifischen Produktempfehlungen ohne bereitgestellte Daten
- Keine Rechts- oder Steuerberatung (EEG-Vergütung ist keine Steuerberatung)
- Keine erfundenen Förderprogramme
- Keine dekorativen Emojis

AUSGABEFORMAT:
Antworte AUSSCHLIESSLICH mit validem JSON:

{
  "zusammenfassung": "2-3 Sätze Gesamteinschätzung der Wirtschaftlichkeit",
  "wirtschaftlichkeit": {
    "einschaetzung": "sehr gut" | "gut" | "akzeptabel" | "kritisch" | "nicht beurteilbar",
    "begruendung": "Begründung auf Basis der Amortisationszeit",
    "einschraenkungen": ["Liste der Einschränkungen"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch" | "mittel" | "niedrig",
      "hinweis": "Konkreter Risikohinweis",
      "empfehlung": "Was zu tun ist"
    }
  ],
  "fragenFuerAnbieter": ["Konkrete Fragen für Angebotsvergleich und Installateur"],
  "foerderHinweise": ["Relevante Förderprogramme und Hinweise (nur gesicherte Angaben)"],
  "einschraenkungen": ["Was diese Analyse nicht leisten kann"]
}`;

export function buildPhotovoltaikUserMessage(params: {
  leistungKWp: number;
  jahresverbrauchKWh: number;
  anschaffungskosten: number;
  region: string;
  ausrichtung: string;
  jahresertragKWh: number;
  eigenverbrauchKWh: number;
  einspeisungKWh: number;
  jahreseinnahmen: number;
  amortisationJahre: number | null;
  speichergroesseKWh?: number;
  annahmen: Array<{ bezeichnung: string; wert: string }>;
  zusatzAngaben?: string;
}): string {
  const lines = [
    "## Photovoltaik-Analyseanfrage",
    "",
    "### Anlagendaten (vom Nutzer eingegeben)",
    `- Anlagenleistung: ${params.leistungKWp} kWp`,
    `- Jahresverbrauch Haushalt: ${params.jahresverbrauchKWh.toLocaleString("de-DE")} kWh`,
    `- Anschaffungskosten: ${params.anschaffungskosten.toLocaleString("de-DE")} €`,
    `- Region: ${params.region}`,
    `- Ausrichtung: ${params.ausrichtung}`,
    params.speichergroesseKWh ? `- Batteriespeicher: ${params.speichergroesseKWh} kWh` : "- Batteriespeicher: keiner",
    "",
    "### Berechnete Erträge und Wirtschaftlichkeit (deterministische Rechnung)",
    `- Geschätzter Jahresertrag: ${params.jahresertragKWh.toLocaleString("de-DE")} kWh`,
    `- Eigenverbrauch: ${params.eigenverbrauchKWh.toLocaleString("de-DE")} kWh/Jahr`,
    `- Einspeisung: ${params.einspeisungKWh.toLocaleString("de-DE")} kWh/Jahr`,
    `- Jährliche Einnahmen (Einsparung + Vergütung): ${params.jahreseinnahmen.toLocaleString("de-DE")} €`,
    `- Amortisation: ${params.amortisationJahre ? `${params.amortisationJahre} Jahre` : "nicht berechenbar"}`,
    "",
    "### Berechnungsannahmen",
    ...params.annahmen.map((a) => `- ${a.bezeichnung}: ${a.wert}`),
  ];

  if (params.zusatzAngaben) {
    lines.push("", "### Zusätzliche Angaben des Nutzers", params.zusatzAngaben);
  }

  lines.push(
    "",
    "### Wichtige Einschränkungen",
    "- Erträge sind Schätzwerte – tatsächliche Werte weichen ab",
    "- Keine spezifischen Produkt- oder Anbieterempfehlungen",
    "",
    "Erstelle deine Analyse gemäß dem vorgegebenen JSON-Schema."
  );
  return lines.join("\n");
}
