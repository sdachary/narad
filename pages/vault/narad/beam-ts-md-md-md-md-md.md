---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/beam-ts-md-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [docker, typescript]
lines: 256
size: 5417 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, documentation, markdown, project/narad, typescript, utility]
---

# beam-ts-md-md-md-md.md

> Utility / helper module using **docker, typescript** (256 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/beam-ts-md-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 256 |
| **Size** | 5417 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/beam-ts-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [docker, typescript]
lines: 218
size: 4616 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, documentation, markdown, project/narad, typescript, utility]
---

# beam-ts-md-md-md.md

> Utility / helper module using **docker, typescript** (218 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/beam-ts-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 218 |
| **Size** | 4616 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/beam-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [docker, typescript]
lines: 180
size: 3824 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, documentation, markdown, project/narad, typescript, utility]
---

# beam-ts-md-md.md

> Utility / helper module using **docker, typescript** (180 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/beam-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 180 |
| **Size** | 3824 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/beam-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [docker, typescript]
lines: 142
size: 3041 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, documentation, markdown, project/narad, typescript, utility]
---

# beam-ts-md.md

> Utility / helper module using **docker, typescript** (142 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/beam-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 142 |
| **Size** | 3041 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/beam-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [docker, typescript]
lines: 104
size: 2265 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docker, documentation, markdown, project/narad, typescript, utility]
---

# beam-ts.md

> Utility / helper module using **docker, typescript** (104 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/beam-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 104 |
| **Size** | 2265 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/pdf/beam.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [docker, typescript]
lines: 66
size: 1517 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
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
| **Modified** | 2026-04-08 16:51 |

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

```

```

```

```

```
