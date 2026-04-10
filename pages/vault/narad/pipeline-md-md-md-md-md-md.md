---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/pipeline-md-md-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 253
size: 6680 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad]
---

# pipeline-md-md-md-md-md.md

> Documentation (253 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/pipeline-md-md-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 253 |
| **Size** | 6680 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/pipeline-md-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 215
size: 5968 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad]
---

# pipeline-md-md-md-md.md

> Documentation (215 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/pipeline-md-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 215 |
| **Size** | 5968 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/pipeline-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 177
size: 5265 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# pipeline-md-md-md.md

> Documentation (177 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/pipeline-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 177 |
| **Size** | 5265 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/pipeline-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 139
size: 4571 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# pipeline-md-md.md

> Documentation (139 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/pipeline-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 139 |
| **Size** | 4571 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/pipeline-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 101
size: 3884 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad]
---

# pipeline-md.md

> Documentation (101 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/pipeline-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 101 |
| **Size** | 3884 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/career-ops/modes/de/pipeline.md"
project: "unnati"
role: docs
language: markdown
frameworks: []
lines: 63
size: 3203 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docs, documentation, markdown, project/unnati]
---

# pipeline.md

> Documentation (63 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/career-ops/modes/de/pipeline.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 63 |
| **Size** | 3203 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Modus: pipeline — URL-Inbox (Second Brain)

Verarbeitet URLs von Stellenanzeigen, die in `data/pipeline.md` gesammelt wurden. Der Kandidat wirft URLs ins Inbox, wann immer er eine entdeckt, und führt später `/career-ops pipeline` aus, um sie alle in einem Rutsch zu verarbeiten.

## Workflow

1. **Lesen** von `data/pipeline.md` → alle Items mit `- [ ]` im Abschnitt "Pendientes" / "Pending" / "Offen" finden
2. **Für jede offene URL**:
   a. Nächste fortlaufende `REPORT_NUM` berechnen (in `reports/` lesen, höchste Nummer + 1)
   b. **Stellenanzeige extrahieren** mit Playwright (`browser_navigate` + `browser_snapshot`) → WebFetch → WebSearch
   c. Wenn die URL nicht erreichbar ist → als `- [!]` mit Notiz markieren und weitermachen
   d. **Vollständige Auto-Pipeline ausführen**: A-F-Bewertung → Report .md → PDF (wenn Score >= 3.0) → Tracker
   e. **Von "Offen" nach "Verarbeitet" verschieben**: `- [x] #NNN | URL | Firma | Rolle | Score/5 | PDF ✅/❌`
3. **Bei 3+ offenen URLs** Agenten parallel starten (Agent-Tool mit `run_in_background`), um Tempo zu machen.
4. **Am Ende** eine Zusammenfassungstabelle ausgeben:

```
| # | Firma | Rolle | Score | PDF | Empfohlene Aktion |
```

## Format von pipeline.md

```markdown
## Offen
- [ ] https://jobs.example.com/posting/123
- [ ] https://boards.greenhouse.io/company/jobs/456 | Company GmbH | Senior PM
- [!] https://private.url/job — Fehler: Login erforderlich

## Verarbeitet
- [x] #143 | https://jobs.example.com/posting/789 | Acme GmbH | AI PM | 4.2/5 | PDF ✅
- [x] #144 | https://boards.greenhouse.io/xyz/jobs/012 | BigCo | SA | 2.1/5 | PDF ❌
```

> Hinweis: Die Sektion-Überschriften können auf EN ("Pending"/"Processed"), ES ("Pendientes"/"Procesadas") oder DE ("Offen"/"Verarbeitet") sein. Beim Lesen flexibel sein, beim Schreiben dem Stil der bestehenden Datei treu bleiben.

## Intelligente Erkennung der Stellenanzeige aus der URL

1. **Playwright (bevorzugt):** `browser_navigate` + `browser_snapshot`. Funktioniert mit allen SPAs.
2. **WebFetch (Fallback):** Für statische Seiten oder wenn Playwright nicht verfügbar ist.
3. **WebSearch (letzter Ausweg):** In sekundären Portalen suchen, die die Stellenanzeige indexieren.

**Sonderfälle:**
- **LinkedIn**: Kann Login erfordern → mit `[!]` markieren und den Kandidaten bitten, den Text einzufügen
- **PDF**: Wenn die URL auf ein PDF zeigt, direkt mit dem Read-Tool lesen
- **`local:`-Präfix**: Lokale Datei lesen. Beispiel: `local:jds/linkedin-pm-ai.md` → `jds/linkedin-pm-ai.md` lesen
- **StepStone / XING / kununu**: Häufig deutscher Markt, oft Cookie-Banner. Playwright kann in Snapshot scrollen, um den Anzeigentext zu erfassen
- **Bundesagentur für Arbeit (arbeitsagentur.de)**: Strukturierte Stellenanzeigen, gut maschinenlesbar. WebFetch reicht meist

## Automatische Nummerierung

1. Alle Dateien in `reports/` listen
2. Aus dem Präfix die Nummer extrahieren (z. B. `142-medispend...` → 142)
3. Neue Nummer = höchste gefundene + 1

## Synchronisierung der Quellen

Vor dem Verarbeiten irgendeiner URL die Sync prüfen:

```bash
node cv-sync-check.mjs
```

Bei Abweichungen den Kandidaten warnen, bevor weitergearbeitet wird.

```

```

```

```

```

```
