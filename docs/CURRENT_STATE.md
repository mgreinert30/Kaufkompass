# CURRENT_STATE.md – Ist-Zustand KaufKompass AI
Stand: 2026-11-04

## Deployment
- Live URL: https://kaufkompass-ai.vercel.app
- Framework: Next.js 16.4.3 (Turbopack)
- Letztes Deployment: Phase 2 (44 statische Seiten)

---

## Was vollständig existiert

### Phase 1 – Design System ✅
- Design Tokens (Tailwind v4, CSS-Variablen, Light/Dark)
- 18 UI-Komponenten (Button, Badge, Upload, Cards, Skeleton etc.)
- Header, Navigation, Mobile-Nav, Footer

### Phase 2 – Website-Struktur ✅
- 44 statisch generierte Seiten
- Homepage mit Hero, Kategorien, Features, Pricing, FAQ
- `/kategorien` – Übersicht mit Suche + Filter
- 30 Kategorie-Detailseiten (`/kategorien/[slug]`)
- Infoseiten: So funktioniert es, Preise, Über uns, Kontakt, FAQ
- Rechtliche Seiten: Datenschutz, Impressum, Nutzungsbedingungen

---

## Was neu hinzukommt (Phase 3 start)

### Infrastruktur ✅ (gerade implementiert)
- `@anthropic-ai/sdk` installiert
- `src/types/analyse.ts` – gemeinsame Typen
- `src/lib/ai/provider.ts` – AI Provider Abstraktion (Claude)
- `src/lib/ai/types.ts` – AI-Typen
- `src/lib/ai/prompts/immobilien.ts` – spezialisierter Immobilien-Prompt
- `src/lib/calculations/immobilien.ts` – deterministische Kaufpreisberechnungen
- `src/lib/data-sources/registry.ts` – Quellenregister
- `.env.example` – API-Key-Vorlage

### Tool 01 – Immobilien-Kaufcheck ✅ (implementiert, noch nicht deployed)
- `src/app/api/analyse/immobilien-kaufcheck/route.ts` – API-Route (POST)
- `src/components/analyse/immobilien/input-form.tsx` – Eingabeformular
- `src/components/analyse/immobilien/result-dashboard.tsx` – Ergebnis-Dashboard
- `src/app/analyse/immobilien-kaufcheck/page.tsx` – vollständige Analyseseite
- `src/app/analyse/[slug]/page.tsx` – generischer Router

---

## Was fehlt / noch nicht funktioniert

| Kategorie | Status | Fehlend |
|-----------|--------|---------|
| Tool 01 Immobilien-Kaufcheck | Implementiert | API-Key in Vercel, Test |
| Tool 02–30 | Geplant | Vollständige Implementierung |
| PDF-Export | Partial | Browser-Print vorhanden; echter PDF-Export (Puppeteer/react-pdf) fehlt |
| Rate Limiting | Partial | In-Memory nicht implementiert; Redis fehlt |
| Datei-Upload-Verarbeitung | Fehlend | PDF-Textextraktion (pdf-parse) nicht implementiert |
| Datenbank | Fehlend | Kein persistenter Speicher; neon/planetscale/supabase nicht konfiguriert |
| Auth | Fehlend | next-auth nicht installiert |
| Zahlungsintegration | Fehlend | Stripe nicht installiert |
| PVGIS API | Verfügbar | Noch nicht angebunden (für Photovoltaik-Check) |
| EPREL API | Verfügbar | Noch nicht angebunden (für Haushaltsgeräte) |

---

## Konfigurierte Datenquellen

| Quelle | Typ | Status | Kategorie |
|--------|-----|--------|-----------|
| Grunderwerbsteuer-Tabelle | Statisch/Amtlich | ✅ Aktiv | Immobilien |
| Notar-Richtwert (1,5%) | Schätzwert | ✅ Als Schätzung markiert | Immobilien |
| Annuitätenformel | Mathematisch | ✅ Aktiv | Immobilien |
| PVGIS EU | Open Data API | 🔧 Noch nicht angebunden | Photovoltaik |
| EPREL EU | Open Data API | 🔧 Noch nicht angebunden | Haushaltsgeräte |
| Destatis Baupreise | Manuell | 🔧 Werte noch nicht eingepflegt | Sanierung |
| GOT Tierarzt | Statisch/Amtlich | 🔧 Noch nicht implementiert | Tierarzt |

---

## Kritische Fehlende Abhängigkeiten für volle Funktionalität

1. `ANTHROPIC_API_KEY` in Vercel Env Vars → KI-Analyse aktivieren
2. `pdf-parse` oder `pdf2json` → Dokumentenverarbeitung
3. `sharp` → Bildverarbeitung für hochgeladene Fotos
4. Rate-Limiting-Lösung (upstash-redis oder einfaches In-Memory)

---

## Bekannte Limitierungen

- **Keine regionalen Marktpreisdaten**: Kaufpreise können nicht objektiv mit Marktdaten verglichen werden. Die KI wird dies explizit kommunizieren.
- **Bodenrichtwerte (BORIS NRW u.a.)**: Automatisierter API-Zugang nicht ohne weiteres erlaubt; muss je Bundesland geprüft werden.
- **DAT/Schwacke (Fahrzeugpreise)**: Lizenzpflichtig – kein öffentlicher API-Zugang.
