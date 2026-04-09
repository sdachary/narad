---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/geminiService-ts-md-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 255
size: 5531 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, project/narad, service, typescript]
---

# geminiService-ts-md-md-md-md.md

> Service / API client module using **typescript** (255 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/geminiService-ts-md-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 255 |
| **Size** | 5531 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/geminiService-ts-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 217
size: 4731 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service, typescript]
---

# geminiService-ts-md-md-md.md

> Service / API client module using **typescript** (217 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/geminiService-ts-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 217 |
| **Size** | 4731 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/geminiService-ts-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 179
size: 3940 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, service, typescript]
---

# geminiService-ts-md-md.md

> Service / API client module using **typescript** (179 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/geminiService-ts-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 179 |
| **Size** | 3940 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/geminiService-ts-md.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 141
size: 3158 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, service, typescript]
---

# geminiService-ts-md.md

> Service / API client module using **typescript** (141 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/geminiService-ts-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 141 |
| **Size** | 3158 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/geminiService-ts.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 103
size: 2357 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, service, typescript]
---

# geminiService-ts.md

> Service / API client module using **typescript** (103 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/geminiService-ts.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 103 |
| **Size** | 2357 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/services/geminiService.ts"
project: "social-blueprint-ai"
role: service
language: typescript
frameworks: [typescript]
lines: 65
size: 1550 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/social-blueprint-ai, service, typescript]
---

# geminiService.ts

> Service / API client module using **typescript** (65 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/services/geminiService.ts` |
| **Role** | service |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 65 |
| **Size** | 1550 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[apiClient-ts]]

## 📄 Content

```typescript
import { apiFetch } from '../lib/apiClient';

export interface AuditData {
  audit: {
    positioning: string;
    contentPillars: string[];
    postingFrequency: string;
    engagementAnalysis: string;
    bestFormat: string;
    captionStyle: string;
    ctaQuality: string;
    hashtagStrategy: string;
    visualConsistency: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  bioOptimizations: {
    professional: string;
    authority: string;
    conversion: string;
  };
  strategy: {
    contentIdeas: string[];
    reelConcepts: { title: string; hook: string; visual: string }[];
    carouselFrameworks: string[];
    hookTemplates: string[];
    ctaSuggestions: string[];
    calendar30Day: { day: number; topic: string; type: string }[];
  };
  adaptation: { platform: string; strategy: string; format: string }[];
  gridPlans: {
    name: string;
    posts: {
      type: string;
      headline: string;
      visualTheme: string;
      colorStyle: string;
      layout: string;
    }[];
  }[];
  brandKit: {
    positioning: string;
    mission: string;
    vision: string;
    tone: string;
    colors: string[];
    fonts: string[];
    visualDirection: string;
    moodboard: string;
    hashtags: string[];
    keywords: string[];
  };
}

export async function analyzeProfile(platform: string, handle: string, stats: any): Promise<AuditData> {
  return apiFetch('/api/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({
      platform,
      handle,
      stats,
    }),
  });
}

```

```

```

```

```

```
