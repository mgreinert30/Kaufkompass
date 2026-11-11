// KI-Prompt: Fenster- und Dachcheck

export const FENSTER_DACH_SYSTEM_PROMPT = `
Du bist ein unabhängiger Bauberater in Deutschland für Fenster- und Dachrenovierungen. Analysiere Angebote ehrlich und praxisnah.

WICHTIG:
- Keine erfundenen Referenzwerte – nutze die berechneten Daten
- Weise auf bauphysikalische Risiken und typische Ausführungsfehler hin
- Benenne häufig fehlende Positionen in Angeboten (z.B. Einputzen, Abfall)
- BAFA-Fördervoraussetzungen klar kommunizieren

Antworte AUSSCHLIESSLICH mit validem JSON:
{
  "zusammenfassung": "2-3 Sätze Gesamteinschätzung",
  "kostenBewertung": {
    "einschaetzung": "marktgerecht | teuer | guenstig | sehr_teuer",
    "begruendung": "Konkrete Begründung mit Bezug zu Ausführung/Material",
    "fehlendePunkte": ["Oft fehlende Positionen im Angebot"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch | mittel | niedrig",
      "hinweis": "Konkretes Risiko",
      "empfehlung": "Was tun"
    }
  ],
  "foerderHinweise": [
    "Konkrete BAFA/KfW-Hinweise zur Maßnahme"
  ],
  "fragenFuerHandwerker": [
    "Fragen die vor Auftragsvergabe gestellt werden sollten"
  ],
  "einschraenkungen": ["Grenzen dieser Analyse"]
}
`.trim();

interface FensterDachUserMessageParams {
  massnahmeLabel: string;
  einheit: string;
  angebotspreis?: number;
  referenzMin: number;
  referenzMittel: number;
  referenzMax: number;
  angebotsBewertung: { einschaetzung: string | null; abweichungProzent: number | null; hinweis: string };
  foerderungSatz: number;
  foerderungBetrag: number;
  foerderungISFPBonus: number;
  nettokostenNachFoerderung: number;
  puffer: number;
  grundlagen: string[];
  zusatzAngaben?: string;
}

function fmt(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function buildFensterDachUserMessage(params: FensterDachUserMessageParams): string {
  const lines = [
    "## Fenster- und Dachcheck",
    "",
    "### Angebotsdetails",
    `- Maßnahme: ${params.massnahmeLabel}`,
    `- Einheit: ${params.einheit}`,
    params.angebotspreis ? `- Angebotspreis: ${fmt(params.angebotspreis)} €` : "- Angebotspreis: nicht angegeben",
    "",
    "### Berechnete Referenzwerte",
    `- Referenz: ${fmt(params.referenzMin)} – ${fmt(params.referenzMax)} € (Mittel: ${fmt(params.referenzMittel)} €)`,
    `- Einschätzung: ${params.angebotsBewertung.einschaetzung ?? "keine"}`,
    params.angebotsBewertung.abweichungProzent !== null
      ? `- Abweichung vom Mittel: ${params.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}${params.angebotsBewertung.abweichungProzent} %`
      : "",
    "",
    "### Förderung",
    `- BAFA Fördersatz: ${params.foerderungSatz} %`,
    params.foerderungISFPBonus > 0 ? `- iSFP-Bonus: +${params.foerderungISFPBonus} %` : "",
    `- Förderbetrag (geschätzt): ${fmt(params.foerderungBetrag)} €`,
    `- Nettokosten nach Förderung: ${fmt(params.nettokostenNachFoerderung)} €`,
    `- Empfohlener Puffer: ${fmt(params.puffer)} €`,
    "",
    "### Berechnungsgrundlagen",
    ...params.grundlagen.map((g) => `- ${g}`),
  ];

  if (params.zusatzAngaben) {
    lines.push("", "### Zusatzangaben", params.zusatzAngaben);
  }

  return lines.filter(Boolean).join("\n");
}
