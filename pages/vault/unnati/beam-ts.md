---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/pdf/beam.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [docker, typescript]
lines: 66
size: 1517 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [code, docker, project/unnati, typescript, utility]
---

# beam.ts

> Utility / helper module using **docker, typescript** (66 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/pdf/beam.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | docker, typescript |
| **Lines** | 66 |
| **Size** | 1517 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

[[env-ts]]

## 📄 Content

```typescript
import { getEnv } from '@/lib/env';

export interface PDFOptions {
  format?: 'A4' | 'Letter';
  margin?: number;
}

interface BeamPDFResponse {
  data?: {
    result?: ArrayBuffer;
  };
  error?: {
    message: string;
  };
}

const BEAM_API_URL = 'https://api.beam.cloud/v1/pdf';

export async function generatePDFWithBeam(
  html: string,
  options: PDFOptions = {}
): Promise<ArrayBuffer> {
  const env = getEnv();
  const { format = 'A4', margin = 20 } = options;

  try {
    const response = await fetch(BEAM_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.ephemeralCompute.beam.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: html,
        format,
        margin,
        options: {
          printBackground: true,
          preferCssPageSize: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Beam API error: ${response.status} ${errorText}`);
    }

    const data: BeamPDFResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.data?.result) {
      throw new Error('No PDF result returned from Beam API');
    }

    return data.data.result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate PDF with Beam: ${error.message}`);
    }
    throw new Error('Failed to generate PDF with Beam: Unknown error');
  }
}

```
