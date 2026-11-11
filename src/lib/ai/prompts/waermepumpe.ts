// KI-Prompt für den Wärmepumpen-Check
// KI interpretiert Betriebskosten und Wirtschaftlichkeit.

export const WAERMEPUMPE_SYSTEM_PROMPT = `Du bist ein sachlicher Wärmepumpen-Fachberater.

DEINE AUFGABE:
- Erkläre die berechneten Betriebskosten und die Wirtschaftlichkeit verständlich
- Erkläre die BAFA BEG WG Förderung und ihre Bedingungen
- Weise auf Risiken und technische Anforderungen hin
- Gib konkrete Fragen für den Angebotsvergleich

ABSOLUT VERBOTENE VERHALTENSWEISEN:
- Keine Garantien zu tatsächlichen Betriebskosten oder JAZ-Werten
- Keine spezifischen Produktempfehlungen ohne Daten
- Keine Rechts- oder Steuerberatung
- Keine erfundenen Förderprogramme
- Keine dekorativen Emojis

AUSGABEFORMAT:
Antworte AUSSCHLIESSLICH mit validem JSON:

{
  "zusammenfassung": "2-3 Sätze Gesamteinschätzung der Wirtschaftlichkeit",
  "wirtschaftlichkeit": {
    "einschaetzung": "sehr gut" | "gut" | "akzeptabel" | "kritisch" | "nicht beurteilbar",
    "begruendung": "Begründung auf Basis der Amortisationszeit und Einsparung",
    "einschraenkungen": ["Liste der Einschränkungen"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch" | "mittel" | "niedrig",
      "hinweis": "Konkreter Risikohinweis",
      "empfehlung": "Was zu tun ist"
    }
  ],
  "foerderHinweise": ["BAFA BEG WG Fördervoraussetzungen und Verfahren"],
  "fragenFuerInstallateur": ["Konkrete Fragen für Handwerker und Angebotsvergleich"],
  "einschraenkungen": ["Was diese Analyse nicht leisten kann"]
}`;

export function buildWaermepumpeUserMessage(params: {
  wohnflaeche: number;
  gebaeudetyp: string;
  wpTyp: string;
  angebotspreis: number;
  heizwaermebedarfKWh: number;
  stromverbrauchWPKWh: number;
  betriebskostenJaehrlich: number;
  vergleichGasJaehrlich: number;
  einsparungJaehrlich: number;
  foerderungBAFA: number;
  foerderungSatz: number;
  nettokostenNachFoerderung: number;
  amortisationJahre: number | null;
  mitISFP: boolean;
  einkommensbonus: boolean;
  grundlagen: Array<{ bezeichnung: string; wert: string; quelle: string }>;
  zusatzAngaben?: string;
}): string {
  const wpTypLabel = params.wpTyp === "luft" ? "Luft-Wasser-Wärmepumpe"
    : params.wpTyp === "sole" ? "Sole-Wasser-Wärmepumpe (Erdwärme)"
    : "Wasser-Wasser-Wärmepumpe";

  const lines = [
    "## Wärmepumpen-Analyseanfrage",
    "",
    "### Angaben (vom Nutzer eingegeben)",
    `- Wohnfläche: ${params.wohnflaeche} m²`,
    `- Gebäudetyp: ${params.gebaeudetyp}`,
    `- Wärmepumpentyp: ${wpTypLabel}`,
    `- Angebotspreis (inkl. Installation): ${params.angebotspreis.toLocaleString("de-DE")} €`,
    `- Individueller Sanierungsfahrplan (iSFP): ${params.mitISFP ? "vorhanden (+5 % Bonus)" : "nicht vorhanden"}`,
    `- Einkommensbonus (≤ 40.000 €/Jahr): ${params.einkommensbonus ? "beantragt (+30 %)" : "nein"}`,
    "",
    "### Berechnete Betriebskosten und Wirtschaftlichkeit (deterministische Rechnung)",
    `- Heizwärmebedarf: ${params.heizwaermebedarfKWh.toLocaleString("de-DE")} kWh/Jahr`,
    `- Stromverbrauch WP: ${params.stromverbrauchWPKWh.toLocaleString("de-DE")} kWh/Jahr`,
    `- Betriebskosten Wärmepumpe: ${params.betriebskostenJaehrlich.toLocaleString("de-DE")} €/Jahr`,
    `- Vergleich Gasheizung: ${params.vergleichGasJaehrlich.toLocaleString("de-DE")} €/Jahr`,
    `- Jährliche Einsparung: ${params.einsparungJaehrlich.toLocaleString("de-DE")} €/Jahr`,
    "",
    "### BAFA BEG WG Förderung",
    `- Fördersatz: ${(params.foerderungSatz * 100).toFixed(0)} %`,
    `- Förderbetrag: ${params.foerderungBAFA.toLocaleString("de-DE")} €`,
    `- Nettokosten nach Förderung: ${params.nettokostenNachFoerderung.toLocaleString("de-DE")} €`,
    `- Amortisation: ${params.amortisationJahre ? `${params.amortisationJahre} Jahre` : "nicht berechenbar (keine Einsparung)"}`,
    "",
    "### Datengrundlagen",
    ...params.grundlagen.map((g) => `- ${g.bezeichnung}: ${g.wert} (${g.quelle})`),
  ];

  if (params.zusatzAngaben) {
    lines.push("", "### Zusätzliche Angaben des Nutzers", params.zusatzAngaben);
  }

  lines.push(
    "",
    "### Wichtige Einschränkungen",
    "- JAZ-Werte sind Typwerte – tatsächliche JAZ hängt von Einbau und Betrieb ab",
    "- BAFA-Antrag VOR Auftragserteilung stellen",
    "- Bohrkosten bei Erdwärme können stark variieren",
    "",
    "Erstelle deine Analyse gemäß dem vorgegebenen JSON-Schema."
  );
  return lines.join("\n");
}
