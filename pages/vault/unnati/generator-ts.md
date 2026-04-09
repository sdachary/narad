---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/pdf/generator.ts"
project: "unnati"
role: utility
language: typescript
frameworks: []
lines: 24
size: 996 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
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
| **Modified** | 2026-04-09 15:18 |

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
