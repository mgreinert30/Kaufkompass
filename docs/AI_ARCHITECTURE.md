# AI_ARCHITECTURE.md – KI-Architektur KaufKompass AI

## Grundprinzip

Keine 30 isolierten KI-Tools – eine gemeinsame Infrastruktur mit 30 spezialisierten Profilen.

```
Nutzereingabe
     │
     ▼
┌─────────────────────────────────────────┐
│         Schicht 1 – Dateneingabe        │
│  Formular-Validierung (Zod) + Upload    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Schicht 2 – Datenextraktion        │
│  Strukturierung der Nutzereingaben +    │
│  (zukünftig: PDF-Text-Extraktion)       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│     Schicht 3 – Quellenrecherche        │
│  Data-Source-Registry + externe APIs   │
│  (PVGIS, EPREL, Bundesnetzagentur)      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│     Schicht 4 – Berechnungsengine       │
│  Deterministische, getestete Funktionen │
│  lib/calculations/[kategorie].ts        │
│  KEINE KI-Schätzungen für Zahlen!       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│     Schicht 5 – KI-Interpretation       │
│  Claude (claude-sonnet-4-6)             │
│  lib/ai/provider.ts                     │
│  lib/ai/prompts/[kategorie].ts          │
│  Validierung der KI-Antwort (Zod)       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Schicht 6 – Ergebnisbericht        │
│  components/analyse/[kategorie]/        │
│  result-dashboard.tsx + Print-CSS       │
└─────────────────────────────────────────┘
```

## KI-Provider

### Aktuell implementiert
- **Claude** via `@anthropic-ai/sdk`
- Modell: `claude-sonnet-4-6`
- Konfiguration: `ANTHROPIC_API_KEY` Umgebungsvariable
- Datei: `src/lib/ai/provider.ts`

### Fallback-Verhalten
Wenn kein API-Key konfiguriert ist, gibt die API-Route trotzdem die **deterministischen Berechnungen** zurück. Die KI-Interpretation wird als "nicht verfügbar" gekennzeichnet. Das Tool bleibt nutzbar.

### Zukünftige Provider (geplant)
- OpenAI (via `OPENAI_API_KEY`)
- Google Gemini (via `GOOGLE_AI_API_KEY`)
- Provider-Abstraktion in `provider.ts` ist vorbereitet

## Prompt-Strategie

Jede Kategorie hat einen eigenen System-Prompt (`lib/ai/prompts/[kategorie].ts`).

**Gemeinsame Regeln für alle Prompts:**
1. KI erhält fertige Berechnungsergebnisse – berechnet NICHT selbst
2. KI darf keine Quellen erfinden
3. KI muss Einschränkungen explizit kommunizieren
4. Ausgabe immer als valides JSON (definiertes Schema)
5. Prompt enthält explizite Verbotsliste (keine Marktpreise, keine Diagnosen, etc.)

## Ausgabe-Schema (Basis)

Jede KI-Antwort wird serverseitig mit Zod validiert:

```typescript
{
  zusammenfassung: string,       // 2-3 Sätze Gesamteinschätzung
  bewertung: {
    einschaetzung: string,       // Kurzurteil oder "nicht beurteilbar"
    begruendung: string,
    einschraenkungen: string[]
  },
  risikohinweise: [{
    schweregrad: "hoch"|"mittel"|"niedrig",
    hinweis: string,
    empfehlung: string
  }],
  fragenfuerBesichtigung: string[],
  fehlendeinformationen: string[],
  einschraenkungen: string[]
}
```

## Datei-Struktur

```
src/lib/ai/
├── provider.ts          # Anthropic-Client + callAI() + extractJSON()
├── types.ts             # AIRequestOptions, AIResponse, AIError
└── prompts/
    ├── immobilien.ts    # ✅ Implementiert
    ├── gebrauchtwagen.ts # 🔧 Geplant
    └── ...              # Je Tool eine Datei

src/lib/calculations/
├── immobilien.ts        # ✅ Implementiert
├── gebrauchtwagen.ts    # 🔧 Geplant
└── ...

src/lib/data-sources/
└── registry.ts          # ✅ Implementiert (Quellenregister)

src/app/api/analyse/
├── immobilien-kaufcheck/
│   └── route.ts         # ✅ Implementiert
└── [weitere tools]/
    └── route.ts         # 🔧 Geplant
```

## Sicherheit

- API-Schlüssel nur in Umgebungsvariablen, nie im Client-Code
- Eingabe-Validierung mit Zod vor jedem API-Aufruf
- KI-Ausgabe wird serverseitig validiert
- Prompt-Injection-Schutz: hochgeladene Dokumente werden nicht direkt als Prompt übergeben
- Rate Limiting: TODO (geplant mit Upstash Redis oder einfachem In-Memory-Limiter)
