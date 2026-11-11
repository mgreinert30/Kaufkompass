// KI-Prompt: Badezimmer-Renovierungscheck

export const BAD_SYSTEM_PROMPT = `
Du bist ein unabhängiger Bauberater in Deutschland für Badsanierungen. Analysiere Badangebote ehrlich.

WICHTIG: Keine erfundenen Referenzwerte. Nutze die berechneten Daten.

Antworte AUSSCHLIESSLICH mit validem JSON:
{
  "zusammenfassung": "2-3 Sätze Gesamteinschätzung",
  "kostenBewertung": {
    "einschaetzung": "marktgerecht | teuer | guenstig | sehr_teuer",
    "begruendung": "Konkrete Begründung",
    "fehlendePunkte": ["Oft fehlende Positionen (z.B. Schimmelschutz, Heizleitungen)"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch | mittel | niedrig",
      "hinweis": "Konkretes Risiko",
      "empfehlung": "Handlungsempfehlung"
    }
  ],
  "foerderHinweise": ["KfW 455-B für Barrierefreiheit, sonstige Hinweise"],
  "fragenFuerHandwerker": ["Fragen vor Auftragsvergabe"],
  "einschraenkungen": ["Grenzen dieser Analyse"]
}
`.trim();

interface BadUserMessageParams {
  groesseLabel: string;
  ausstattungLabel: string;
  flaeche: number;
  angebotspreis?: number;
  referenzMin: number;
  referenzMittel: number;
  referenzMax: number;
  angebotsBewertung: { einschaetzung: string | null; abweichungProzent: number | null; hinweis: string };
  mitBarrierefreiheit: boolean;
  mitHeizung: boolean;
  puffer: number;
  grundlagen: string[];
  zusatzAngaben?: string;
}

function fmt(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function buildBadUserMessage(params: BadUserMessageParams): string {
  const lines = [
    "## Badezimmer-Renovierungscheck",
    "",
    "### Angaben",
    `- Größe: ${params.groesseLabel} (${params.flaeche} m²)`,
    `- Ausstattung: ${params.ausstattungLabel}`,
    `- Barrierefreiheit: ${params.mitBarrierefreiheit ? "Ja" : "Nein"}`,
    `- Fußbodenheizung: ${params.mitHeizung ? "Ja" : "Nein"}`,
    params.angebotspreis ? `- Angebotspreis: ${fmt(params.angebotspreis)} €` : "- Angebotspreis: nicht angegeben",
    "",
    "### Berechnete Referenzwerte",
    `- Referenz: ${fmt(params.referenzMin)} – ${fmt(params.referenzMax)} € (Mittel: ${fmt(params.referenzMittel)} €)`,
    `- Einschätzung: ${params.angebotsBewertung.einschaetzung ?? "keine"}`,
    params.angebotsBewertung.abweichungProzent !== null
      ? `- Abweichung: ${params.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}${params.angebotsBewertung.abweichungProzent} %`
      : "",
    `- Puffer (15 %): ${fmt(params.puffer)} €`,
    "",
    "### Berechnungsgrundlagen",
    ...params.grundlagen.map((g) => `- ${g}`),
  ];

  if (params.zusatzAngaben) lines.push("", "### Zusatzangaben", params.zusatzAngaben);

  return lines.filter(Boolean).join("\n");
}
