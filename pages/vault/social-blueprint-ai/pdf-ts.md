---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/lib/pdf.ts"
project: "social-blueprint-ai"
role: utility
language: typescript
frameworks: [typescript]
lines: 24
size: 641 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [code, project/social-blueprint-ai, typescript, utility]
---

# pdf.ts

> Utility / helper module using **typescript** (24 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/lib/pdf.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 24 |
| **Size** | 641 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId: string, filename: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#f8fafc'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    format: [canvas.width / 2, canvas.height / 2]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(`${filename}.pdf`);
}

```
