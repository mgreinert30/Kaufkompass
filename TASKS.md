# TASKS.md – KaufKompass AI
Legende: `[x]` Fertig | `[~]` In Bearbeitung | `[ ]` Offen | `[!]` Blockiert

---

## PHASE 1 – Design-System ✅ Abgeschlossen

Alle 18 UI-Komponenten, Header, Footer, Navigation, Design Tokens, Build.

## PHASE 2 – Website-Struktur ✅ Abgeschlossen (2026-11-04)

44 statische Seiten deployed auf https://kaufkompass-ai.vercel.app

---

## PHASE 3 – KI-Infrastruktur und Tool 01

### 3.1 Infrastruktur ✅ Abgeschlossen (2026-11-04)
- [x] @anthropic-ai/sdk installiert
- [x] src/lib/ai/provider.ts – AI Provider Abstraktion
- [x] src/lib/ai/types.ts – Typen
- [x] src/lib/calculations/immobilien.ts – Deterministische Berechnungen
- [x] src/lib/data-sources/registry.ts – Quellenregister
- [x] src/types/analyse.ts – Gemeinsame Typen
- [x] docs/CURRENT_STATE.md, AI_ARCHITECTURE.md, DATA_SOURCES.md
- [x] .env.example

### 3.2 Tool 01 – Immobilien-Kaufcheck [~] In Bearbeitung
- [x] Spezialisierter KI-Prompt (lib/ai/prompts/immobilien.ts)
- [x] Berechnungsengine: Kaufnebenkosten, Finanzierungsszenarien, Preis/m²
- [x] API-Route: POST /api/analyse/immobilien-kaufcheck
- [x] Eingabeformular (Bundesland, Typ, Fläche, Baujahr, Preis, EK, Makler)
- [x] Ergebnis-Dashboard mit KPIs, Tabellen, Risikohinweisen, Quellen
- [x] Analyseseit /analyse/immobilien-kaufcheck
- [x] Generischer Router /analyse/[slug]
- [x] layout.tsx: lang="de", Metadata korrigiert
- [ ] Build-Test
- [ ] ANTHROPIC_API_KEY in Vercel konfigurieren
- [ ] Manueller End-to-End-Test

### 3.3 Build & Deployment
- [ ] npm run build (lokal)
- [ ] Git commit + push
- [ ] vercel --prod
- [ ] E2E-Test auf Live-URL

---

## PHASE 4 – Tool 02: Gebrauchtwagen-Kaufcheck

Reihenfolge gemäß Master-Prompt:
- [ ] Nutzererklärung und Seitenstruktur (A–H)
- [ ] Berechnungsengine (Betriebskosten 5 Jahre, Versicherung, TÜV)
- [ ] Datenbasis: ADAC-Daten prüfen (manuelle Referenz, keine API)
- [!] Preisvergleich DAT/Schwacke: BLOCKIERT (lizenzpflichtig)
- [ ] KI-Spezialprompt
- [ ] API-Route
- [ ] Dashboard

---

## PHASE 5 – Tool 03: Autoreparatur-Check
- [ ] Berechnungsengine: Positionen auflisten, Summen kontrollieren
- [ ] KI-Spezialprompt: Positionen erklären, keine unbelegten Diagnosen
- [ ] API-Route + Dashboard

---

## PHASE 6 – Tool 04: Sanierungskosten-Check
- [ ] Destatis-Referenzwerte einpflegen
- [ ] Berechnungsengine: Positionen, Mengen, Puffer
- [ ] KI-Spezialprompt
- [ ] API-Route + Dashboard

---

## PHASE 7 – Tool 05: Wärmepumpen-Check
- [ ] BAFA-Fördersätze einpflegen (Stand angeben)
- [ ] Betriebskosten-Berechnung (Heizlast, JAZ, Strompreis)
- [ ] KI-Spezialprompt
- [ ] API-Route + Dashboard

---

## PHASE 8 – Tool 06: Photovoltaik-Check
- [ ] PVGIS API anbinden (EU Open Data)
- [ ] Eigenverbrauch/Einspeisung berechnen
- [ ] Amortisationsrechner
- [ ] KI-Spezialprompt
- [ ] API-Route + Dashboard

---

## PHASE 9 – Tools 07–30 (je nach Reihenfolge)
- [ ] Tool 07: Küchen-Kaufcheck
- [ ] Tool 08–30: Weitere Kategorien sequenziell

---

## PHASE 10 – Querschnittsthemen
- [ ] PDF-Export (react-pdf oder Puppeteer)
- [ ] Datei-Upload + Textextraktion (pdf-parse)
- [ ] Rate Limiting (Upstash Redis oder In-Memory)
- [ ] Logging ohne personenbezogene Daten

---

## GEBLOCKTE AUFGABEN

| Aufgabe | Grund | Lösungsweg |
|---------|-------|------------|
| Kaufpreisvergleich Immobilien | Keine lizenzfreien Marktdaten | Explizit als "nicht verfügbar" kennzeichnen |
| DAT/Schwacke Fahrzeugpreise | Lizenzpflichtig | Manuell prüfen oder Partnerschaft |
| Bodenrichtwerte automatisch | Länderspezifische Zugänge | Nutzer auf Landesportale verweisen |
| Bilderkennung von Mängeln | KI kann ohne technische Prüfung keine Mängel feststellen | Explizit kommunizieren |

---

## Zuletzt aktualisiert: 2026-11-04
