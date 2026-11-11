// KI-Prompt: Küchen-Kaufcheck

export const KUECHE_SYSTEM_PROMPT = `
Du bist ein unabhängiger Küchen-Kaufberater in Deutschland. Analysiere Küchenkauf-Angebote und gib ehrliche, praxisnahe Einschätzungen.

WICHTIG:
- Keine erfundenen Preise oder Referenzdaten – nutze ausschließlich die berechneten Werte
- Benenne unklare Positionen konkret
- Weise auf typische Fallen beim Küchenkauf hin (z.B. fehlende Posten, Qualitätsunterschiede)
- Stelle Fragen, die Käufer vor Vertragsabschluss stellen sollten

Antworte AUSSCHLIESSLICH mit validem JSON in diesem Format:
{
  "zusammenfassung": "2-3 Sätze Gesamteinschätzung des Angebots",
  "angebotsBewertung": {
    "einschaetzung": "marktgerecht | teuer | guenstig | sehr_teuer",
    "begruendung": "Konkrete Begründung mit Bezug zu Größe/Ausstattung/Montage",
    "fehlendePunkte": ["Listet mögliche fehlende Positionen im Angebot auf"]
  },
  "risikohinweise": [
    {
      "schweregrad": "hoch | mittel | niedrig",
      "hinweis": "Konkreter Hinweis",
      "empfehlung": "Handlungsempfehlung"
    }
  ],
  "typischeExtras": [
    "Positionen die oft nachträglich kosten, z.B. Steckdosen, Nischenpaneel, Küchenrückwand"
  ],
  "fragenFuerAnbieter": [
    "Konkrete Frage die der Käufer stellen sollte"
  ],
  "einschraenkungen": ["Hinweise auf Grenzen dieser Analyse"],
  "markenEinschaetzung": "Kurze Einschätzung zur genannten Marke, falls relevant"
}
`.trim();

interface KuecheUserMessageParams {
  angebotspreis: number;
  groesseLabel: string;
  typLabel: string;
  ausstattungLabel: string;
  mitMontage: boolean;
  mitElektrogeraeten: boolean;
  marke?: string;
  laufmeter?: number;
  referenzMin: number;
  referenzMittel: number;
  referenzMax: number;
  angebotsBewertung: {
    einschaetzung: string | null;
    abweichungProzent: number | null;
    hinweis: string;
  };
  empfohlenerPuffer: number;
  grundlagen: string[];
  zusatzAngaben?: string;
}

function fmt(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function buildKuecheUserMessage(params: KuecheUserMessageParams): string {
  const lines: string[] = [
    "## Küchen-Kaufcheck",
    "",
    "### Angebotsdetails",
    `- Angebotspreis: ${fmt(params.angebotspreis)} €`,
    `- Küchengröße: ${params.groesseLabel}`,
    `- Küchenform: ${params.typLabel}`,
    `- Ausstattungsniveau: ${params.ausstattungLabel}`,
    `- Montage inklusive: ${params.mitMontage ? "Ja" : "Nein"}`,
    `- Elektrogeräte inklusive: ${params.mitElektrogeraeten ? "Ja" : "Nein"}`,
  ];

  if (params.marke) lines.push(`- Marke/Hersteller: ${params.marke}`);
  if (params.laufmeter) lines.push(`- Laufmeter Schrankelemente: ${params.laufmeter} lm`);

  lines.push(
    "",
    "### Berechnete Referenzwerte",
    `- Marktüblicher Referenzpreis: ${fmt(params.referenzMin)} – ${fmt(params.referenzMax)} € (Mittel: ${fmt(params.referenzMittel)} €)`,
    `- Angebotseinschätzung: ${params.angebotsBewertung.einschaetzung ?? "keine"}`,
    params.angebotsBewertung.abweichungProzent !== null
      ? `- Abweichung vom Mittelwert: ${params.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}${params.angebotsBewertung.abweichungProzent} %`
      : "- Abweichung: keine Angabe",
    `- Empfohlener Puffer (10 %): ${fmt(params.empfohlenerPuffer)} €`,
    "",
    "### Berechnungsgrundlagen",
    ...params.grundlagen.map((g) => `- ${g}`),
  );

  if (params.zusatzAngaben) {
    lines.push("", "### Zusatzangaben des Nutzers", params.zusatzAngaben);
  }

  return lines.join("\n");
}
