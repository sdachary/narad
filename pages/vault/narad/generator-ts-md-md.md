---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/generator-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 100
size: 2416 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, utility]
---

# generator-ts-md.md

> Utility / helper module (100 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/generator-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 100 |
| **Size** | 2416 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/generator-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 62
size: 1710 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, utility]
---

# generator-ts.md

> Utility / helper module (62 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/generator-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 62 |
| **Size** | 1710 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/pdf/generator.ts"
project: "unnati"
role: utility
language: typescript
frameworks: []
lines: 24
size: 996 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# generator.ts

> Utility / helper module (24 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/pdf/generator.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | — |
| **Lines** | 24 |
| **Size** | 996 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[beam-ts]], [[browser-print-ts]]

## 📄 Content

```typescript
import { getResumePrintTemplate, getCoverLetterPrintTemplate, ResumeData, CoverLetterData } from './browser-print';
import { generatePDFWithBeam, PDFOptions } from './beam';

export type { ResumeData, CoverLetterData };

export async function generateResumePDF(data: ResumeData): Promise<ArrayBuffer> {
  const html = getResumePrintTemplate(data);
  return generatePDFWithBeam(html);
}

export async function generateCoverLetterPDF(data: CoverLetterData): Promise<ArrayBuffer> {
  const html = getCoverLetterPrintTemplate(data);
  return generatePDFWithBeam(html);
}

export async function generateResumePDFWithOptions(data: ResumeData, options: PDFOptions): Promise<ArrayBuffer> {
  const html = getResumePrintTemplate(data);
  return generatePDFWithBeam(html, options);
}

export async function generateCoverLetterPDFWithOptions(data: CoverLetterData, options: PDFOptions): Promise<ArrayBuffer> {
  const html = getCoverLetterPrintTemplate(data);
  return generatePDFWithBeam(html, options);
}

```

```

```
