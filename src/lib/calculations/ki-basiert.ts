// Shared types für KI-basierte Tools ohne komplexe Eigenberechnungen
// (Versicherung, Energie, Internet, Umzug, Hochzeit, Reise, Weiterbildung, Zahnarzt, Bestattung, Tierarzt, Kinderwagen, Matratze)

export interface KiAnalyseErgebnis {
  toolSlug: string;
  eingabeSummary: string;
  hinweise: string[];
  grundlagen: string[];
}
