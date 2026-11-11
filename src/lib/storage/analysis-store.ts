// Server-seitiger In-Memory-Store für Analyseergebnisse
// Ergebnisse verfallen nach 2 Stunden (Serverless-Neustart setzt Store zurück)

export type Schweregrad = "hoch" | "mittel" | "niedrig";

export interface GespeicherteAnalyse {
  id: string;
  toolSlug: string;
  toolTitle: string;
  erstelltAm: number;
  eingabe: Record<string, unknown>;
  berechnungen: Record<string, unknown>;
  ki_analyse: Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

const store = new Map<string, GespeicherteAnalyse>();
const TTL_MS = 2 * 60 * 60 * 1000; // 2 Stunden

export function saveAnalyse(
  data: Omit<GespeicherteAnalyse, "id" | "erstelltAm">
): string {
  const id = crypto.randomUUID();
  store.set(id, { ...data, id, erstelltAm: Date.now() });
  return id;
}

export function getAnalyse(id: string): GespeicherteAnalyse | null {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() - entry.erstelltAm > TTL_MS) {
    store.delete(id);
    return null;
  }
  return entry;
}

// Veraltete Einträge bereinigen (wird bei jedem save aufgerufen)
function cleanup() {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (now - entry.erstelltAm > TTL_MS) store.delete(id);
  }
}

// Auto-Cleanup alle 10 Minuten
setInterval(cleanup, 10 * 60 * 1000);
