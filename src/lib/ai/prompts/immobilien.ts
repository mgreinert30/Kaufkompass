// Spezialisierter KI-Prompt für den Immobilien-Kaufcheck
// Die KI erhält fertige Berechnungen und liefert ausschließlich Interpretation.
// Alle Zahlen im Prompt stammen aus der deterministischen Berechnungsengine.

export const IMMOBILIEN_SYSTEM_PROMPT = `Du bist ein sachlicher, erklärender Kaufberater für Immobilien.

DEINE AUFGABE:
- Erkläre und interpretiere die bereitgestellten Berechnungen verständlich
- Weise auf konkrete Risiken und offene Fragen hin
- Formuliere Fragen, die der Käufer vor dem Kauf klären sollte
- Halte dich strikt an die bereitgestellten Daten

ABSOLUT VERBOTENE VERHALTENSWEISEN:
- Keine erfundenen Kaufpreisvergleiche oder Marktdaten
- Keine spezifischen Preisangaben für Regionen ohne bereitgestellte Daten
- Keine Garantien oder Versprechen zu Wertentwicklung
- Keine Rechts-, Steuer- oder Finanzberatung
- Keine Aussagen zu versteckten Schäden ohne technische Prüfung
- Keine URLs oder Quellen erfinden – nur die im Kontext bereitgestellten

WENN DATEN FEHLEN:
- Fehlende Informationen klar als "fehlend" kennzeichnen
- Keine Annahmen als Tatsachen ausgeben
- Einschränkungen offen kommunizieren

AUSGABEFORMAT:
Antworte AUSSCHLIESSLICH mit validem JSON in folgendem Schema:

{
  "zusammenfassung": "2-3 Sätze verständliche Gesamteinschätzung auf Basis der vorliegenden Daten",
  "bewertung": {
    "einschaetzung": "ein Wort: 'günstig' | 'marktüblich' | 'teuer' | 'nicht beurteilbar'",
    "begruendung": "Begründung NUR wenn konkrete Datenbasis vorhanden, sonst erklären warum keine Bewertung möglich",
    "einschraenkungen": ["Liste der Einschränkungen dieser Bewertung"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch" | "mittel" | "niedrig",
      "hinweis": "Konkreter, faktischer Risikohinweis",
      "empfehlung": "Was der Käufer konkret tun sollte"
    }
  ],
  "fragenfuerBesichtigung": ["Liste konkreter Fragen für Besichtigung/Verhandlung"],
  "fehlendeinformationen": ["Informationen, die für eine vollständigere Analyse fehlen"],
  "einschraenkungen": ["Was diese KI-Analyse nicht leisten kann"]
}`;

export function buildImmobilienUserMessage(params: {
  immobilientyp: string;
  bundesland: string;
  wohnflaeche?: number;
  baujahr?: number;
  kaufpreis: number;
  eigenkapital: number;
  kaufnebenkosten: {
    grunderwerbsteuer: { betrag: number; satz: number };
    notarUndGrundbuch: { betrag: number };
    makler: { betrag: number; mitMakler: boolean };
    gesamt: number;
    prozentVomKaufpreis: number;
  };
  finanzierung: {
    fremdkapital: number;
    fremdkapitalquote: number;
    szenarien: Array<{ bezeichnung: string; monatlicheRate: number; gesamtZinsen: number }>;
  };
  preisProQm?: number | null;
  zusatzAngaben?: string;
}): string {
  const lines: string[] = [
    "## Immobilien-Analyseanfrage",
    "",
    "### Objektdaten (vom Nutzer eingegeben)",
    `- Typ: ${params.immobilientyp}`,
    `- Bundesland: ${params.bundesland}`,
    params.wohnflaeche ? `- Wohnfläche: ${params.wohnflaeche} m²` : "- Wohnfläche: nicht angegeben",
    params.baujahr ? `- Baujahr: ${params.baujahr}` : "- Baujahr: nicht angegeben",
    `- Angebotspreis: ${params.kaufpreis.toLocaleString("de-DE")} €`,
    `- Eigenkapital: ${params.eigenkapital.toLocaleString("de-DE")} €`,
    "",
    "### Berechnete Kaufnebenkosten (deterministische Berechnung)",
    `- Grunderwerbsteuer (${(params.kaufnebenkosten.grunderwerbsteuer.satz * 100).toFixed(1)} %): ${params.kaufnebenkosten.grunderwerbsteuer.betrag.toLocaleString("de-DE")} €`,
    `- Notar + Grundbuch (Schätzwert 1,5 %): ${params.kaufnebenkosten.notarUndGrundbuch.betrag.toLocaleString("de-DE")} €`,
    params.kaufnebenkosten.makler.mitMakler
      ? `- Maklerprovision: ${params.kaufnebenkosten.makler.betrag.toLocaleString("de-DE")} €`
      : "- Makler: nicht angegeben / kein Makler",
    `- Kaufnebenkosten gesamt: ${params.kaufnebenkosten.gesamt.toLocaleString("de-DE")} € (${params.kaufnebenkosten.prozentVomKaufpreis.toFixed(1)} % des Kaufpreises)`,
    "",
    "### Finanzierung",
    `- Benötigtes Fremdkapital: ${params.finanzierung.fremdkapital.toLocaleString("de-DE")} €`,
    `- Fremdkapitalquote: ${params.finanzierung.fremdkapitalquote.toFixed(1)} % des Kaufpreises`,
    "",
    "### Finanzierungsszenarien (Annuitätendarlehen, 30 Jahre)",
  ];

  for (const s of params.finanzierung.szenarien) {
    lines.push(`- ${s.bezeichnung}: ${s.monatlicheRate.toLocaleString("de-DE")} €/Monat, Gesamtzinsen: ${s.gesamtZinsen.toLocaleString("de-DE")} €`);
  }

  if (params.preisProQm) {
    lines.push("", `### Kaufpreis pro m²`, `- ${params.preisProQm.toLocaleString("de-DE")} €/m²`);
  }

  if (params.zusatzAngaben) {
    lines.push("", "### Zusätzliche Angaben des Nutzers", params.zusatzAngaben);
  }

  lines.push(
    "",
    "### Verfügbare Datenquellen",
    "- Grunderwerbsteuer: amtliche Tabelle (Landesrecht, Stand 2024)",
    "- Notar/Grundbuch: Richtwert (kein amtlicher Festwert)",
    "- KEINE regionalen Marktpreisdaten verfügbar",
    "- KEINE Bodenrichtwert-Daten verfügbar",
    "",
    "Erstelle deine Analyse gemäß dem vorgegebenen JSON-Schema.",
    "Verweise auf fehlende Marktdaten und sage deutlich, dass du den Kaufpreis mangels Vergleichsdaten NICHT objektiv bewerten kannst."
  );

  return lines.join("\n");
}
