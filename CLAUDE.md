# CLAUDE.md – Verbindliche Projektregeln: KaufKompass AI

## Projektübersicht
KaufKompass AI ist eine deutsche KI-Plattform für intelligente Kaufentscheidungen.
Zentrales Versprechen: „Prüfe, bevor du kaufst."

## Zwingend einzuhaltende Arbeitsregeln

1. **PHASE FÜR PHASE** – Niemals Phasen überspringen oder gleichzeitig mehrere Phasen bearbeiten.
2. **AUFGABE FÜR AUFGABE** – Innerhalb einer Phase immer nur eine Aufgabe bearbeiten.
3. **TESTEN VOR WEITERMACHEN** – Jede Aufgabe muss getestet und dokumentiert sein, bevor die nächste beginnt.
4. **KEINE FAKE-ERGEBNISSE** – Keine erfundenen KI-Analysen, Marktpreise oder Testergebnisse.
5. **DEMO = DEMO** – Demo-Modus muss immer klar als Demo gekennzeichnet sein.
6. **TASKS.md AKTUALISIEREN** – Nach jeder Aufgabe den Status in TASKS.md aktualisieren.
7. **BLOCKER DOKUMENTIEREN** – Wenn etwas nicht möglich ist, Blocker dokumentieren und weitermachen.
8. **GIT PUSH NACH JEDER ÄNDERUNG** – Nach jedem Edit committen und pushen.

## Technischer Stack

- **Framework:** Next.js 15 (App Router)
- **Sprache:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + Design Tokens
- **UI-Komponenten:** Radix UI primitives + eigene Komponenten
- **Icons:** Lucide React
- **Formulare:** React Hook Form + Zod
- **Diagramme:** Recharts
- **Animationen:** Framer Motion
- **Theme:** next-themes (Light/Dark)
- **Deployment:** Vercel-ready

## Design-Richtlinien (Kurzform)
- Premium SaaS / Fintech-Ästhetik
- Hintergrund: Weiß / sehr helles Grau
- Primärfarbe: Tiefes Blau (#1e3a5f)
- Akzent: Türkis (#0891b2)
- Text: Anthrazit (#1a1a2e)
- Keine Chatbot-Optik
- Keine überladenen Farbverläufe

## Sicherheitsregeln
- API-Keys ausschließlich in Umgebungsvariablen
- Niemals im Frontend-Code
- Alle Uploads serverseitig validieren
- Rate Limiting implementieren
- Zugangskontrolle vor Live-Aktivierung prüfen

## Konfigurationsprinzipien
- Projektname zentral konfigurierbar (config/branding.ts)
- Kategorien zentral registrierbar (config/categories.ts)
- Preismodell zentral konfigurierbar (config/pricing.ts)
- KI-Provider austauschbar (lib/ai/)
- Berechnungen in deterministischen Funktionen (lib/calculations/)

## Namenskonvention
- Komponenten: PascalCase
- Funktionen: camelCase
- Dateien: kebab-case
- Typen: PascalCase mit "I" Prefix für Interfaces (optional)
- Konstanten: SCREAMING_SNAKE_CASE

## Fertigstellungsdefinition
Eine Aufgabe gilt erst als fertig wenn:
- [ ] Funktion implementiert
- [ ] Code kompiliert fehlerfrei
- [ ] Manuelle Sichtprüfung durchgeführt
- [ ] Fehlerfälle behandelt
- [ ] TASKS.md aktualisiert

## Kontakt & Repository
Projektpfad: C:\Users\mgr30\OneDrive\Claude Code\kaufkompass-ai
