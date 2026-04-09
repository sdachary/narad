---
source: "/home/runner/work/narad/narad/sync_temp/unnati/career-ops/modes/tracker.md"
project: "unnati"
role: docs
language: markdown
frameworks: []
lines: 23
size: 792 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [docs, documentation, markdown, project/unnati]
---

# tracker.md

> Documentation (23 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/career-ops/modes/tracker.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 23 |
| **Size** | 792 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Modo: tracker — Tracker de Aplicaciones

Lee y muestra `data/applications.md`.

**Formato del tracker:**
```markdown
| # | Fecha | Empresa | Rol | Score | Estado | PDF | Report |
```

Estados posibles: `Evaluada` → `Aplicado` → `Respondido` → `Contacto` → `Entrevista` → `Oferta` / `Rechazada` / `Descartada` / `NO APLICAR`

- `Aplicado` = el candidato envió su candidatura
- `Respondido` = Un recruiter/empresa contactó y el candidato respondió (inbound)
- `Contacto` = El candidato contactó proactivamente a alguien de la empresa (outbound, ej: LinkedIn power move)

Si el usuario pide actualizar un estado, editar la fila correspondiente.

Mostrar también estadísticas:
- Total de aplicaciones
- Por estado
- Score promedio
- % con PDF generado
- % con report generado

```
