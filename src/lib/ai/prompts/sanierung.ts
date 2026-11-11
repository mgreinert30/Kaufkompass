// KI-Prompt für den Sanierungskosten-Check
// KI interpretiert Referenzwerte und Fördermöglichkeiten.

export const SANIERUNG_SYSTEM_PROMPT = `Du bist ein sachlicher Sanierungsberater.

DEINE AUFGABE:
- Erkläre die Referenzkosten und die BAFA-Förderung verständlich
- Bewerte ein vorliegendes Angebot (falls angegeben) im Vergleich zu Referenzwerten
- Gib Hinweise zu Förderbedingungen und Auflagen
- Formuliere konkrete Fragen für den Handwerkervergleich

ABSOLUT VERBOTENE VERHALTENSWEISEN:
- Keine Garantien zu tatsächlichen Baukosten
- Keine regionalen Preisangaben ohne bereitgestellte Daten
- Keine Rechts- oder Steuerberatung
- Keine erfundenen Förderprogramme
- Keine dekorativen Emojis

AUSGABEFORMAT:
Antworte AUSSCHLIESSLICH mit validem JSON:

{
  "zusammenfassung": "2-3 Sätze Gesamteinschätzung der Kosten und Förderung",
  "kostenBewertung": {
    "einschaetzung": "günstig" | "marktüblich" | "teuer" | "nicht beurteilbar",
    "begruendung": "Begründung NUR wenn Angebot vorhanden, sonst erklären warum nicht",
    "einschraenkungen": ["Liste der Einschränkungen"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch" | "mittel" | "niedrig",
      "hinweis": "Konkreter Risikohinweis",
      "empfehlung": "Was zu tun ist"
    }
  ],
  "foerderHinweise": ["BAFA-Fördervoraussetzungen und Verfahren"],
  "fragenFuerHandwerker": ["Konkrete Fragen für Angebotsvergleich"],
  "einschraenkungen": ["Was diese Analyse nicht leisten kann"]
}`;

export function buildSanierungUserMessage(params: {
  massnahme: string;
  massnahmeLabel: string;
  flaeche?: number;
  angebotspreis?: number;
  mitISFP: boolean;
  referenzKostenMin: number;
  referenzKostenMax: number;
  referenzKostenMittel: number;
  foerderungBetrag: number;
  foerderungSatz: number;
  nettokostenNachFoerderung: number;
  puffer: number;
  gesamtkostenMitPuffer: number;
  angebotsBewertung?: { einschaetzung: string; abweichungProzent?: number } | null;
  grundlagen: Array<{ bezeichnung: string; wert: string; quelle: string }>;
  zusatzAngaben?: string;
}): string {
  const lines = [
    "## Sanierungskosten-Analyseanfrage",
    "",
    "### Maßnahme (vom Nutzer eingegeben)",
    `- Maßnahme: ${params.massnahmeLabel}`,
    params.flaeche ? `- Fläche/Menge: ${params.flaeche} ${params.massnahme === "fenster" ? "Stück" : "m²"}` : "",
    params.angebotspreis ? `- Vorliegender Angebotspreis: ${params.angebotspreis.toLocaleString("de-DE")} €` : "- Vorliegender Angebotspreis: nicht angegeben",
    `- Individueller Sanierungsfahrplan (iSFP): ${params.mitISFP ? "vorhanden (+5 % Bonus)" : "nicht vorhanden"}`,
    "",
    "### Berechnete Referenzkosten und Förderung (deterministische Rechnung)",
    `- Referenzkosten: ${params.referenzKostenMin.toLocaleString("de-DE")} – ${params.referenzKostenMax.toLocaleString("de-DE")} € (Mittel: ${params.referenzKostenMittel.toLocaleString("de-DE")} €)`,
    `- BAFA Förderung (${(params.foerderungSatz * 100).toFixed(0)} %): ${params.foerderungBetrag.toLocaleString("de-DE")} €`,
    `- Nettokosten nach Förderung: ${params.nettokostenNachFoerderung.toLocaleString("de-DE")} €`,
    `- Puffer (15 %): ${params.puffer.toLocaleString("de-DE")} €`,
    `- Gesamtkosten mit Puffer: ${params.gesamtkostenMitPuffer.toLocaleString("de-DE")} €`,
  ].filter((l) => l !== "");

  if (params.angebotsBewertung) {
    lines.push(
      "",
      "### Angebotsbewertung",
      `- Einschätzung: ${params.angebotsBewertung.einschaetzung}`,
      params.angebotsBewertung.abweichungProzent !== undefined
        ? `- Abweichung vom Referenzwert: ${params.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}${params.angebotsBewertung.abweichungProzent} %`
        : ""
    );
  }

  lines.push(
    "",
    "### Datenquellen",
    ...params.grundlagen.map((g) => `- ${g.bezeichnung}: ${g.quelle}`)
  );

  if (params.zusatzAngaben) {
    lines.push("", "### Zusätzliche Angaben des Nutzers", params.zusatzAngaben);
  }

  lines.push(
    "",
    "### Wichtige Einschränkungen",
    "- Referenzkosten sind bundesweite Mittelwerte – regional stark abweichend",
    "- BAFA-Antrag VOR Auftragserteilung erforderlich",
    "",
    "Erstelle deine Analyse gemäß dem vorgegebenen JSON-Schema."
  );
  return lines.join("\n");
}
