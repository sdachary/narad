---
source: "/home/deepak/Work/social-blueprint-ai/src/services/geminiService.ts"
project: "social-blueprint-ai"
role: service
language: typescript
frameworks: [typescript]
lines: 65
size: 1550 bytes
last_modified: "2026-03-22 21:38"
scanned: "2026-04-06 21:37"
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
| **Modified** | 2026-03-22 21:38 |

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
