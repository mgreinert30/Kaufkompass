// Gemeinsame Typen für alle 30 Analyse-Tools

export type AnalyseStatus = "idle" | "loading" | "result" | "error";
export type Schweregrad = "hoch" | "mittel" | "niedrig";
export type Quellentyp = "amtlich" | "open-data" | "berechnet" | "nutzereingabe" | "herstellerdaten";

export interface Quelle {
  name: string;
  url?: string;
  datenstand: string;
  beschreibung: string;
  typ: Quellentyp;
}

export interface Risikohinweis {
  schweregrad: Schweregrad;
  hinweis: string;
  empfehlung: string;
}

export interface KostenpunktMitQuelle {
  bezeichnung: string;
  betrag: number;
  berechnung?: string;
  quelle?: string;
}

export interface FinanzierungsSzenario {
  bezeichnung: string;
  zinssatz: number;
  tilgungssatz: number;
  laufzeitJahre: number;
  monatlicheRate: number;
  gesamtRueckzahlung: number;
  gesamtZinsen: number;
}

// Gemeinsame Struktur für alle KI-Analysen
export interface KiAnalyseBase {
  zusammenfassung: string;
  risikohinweise: Risikohinweis[];
  fehlendeinformationen: string[];
  einschraenkungen: string[];
  quellen: Quelle[];
}
