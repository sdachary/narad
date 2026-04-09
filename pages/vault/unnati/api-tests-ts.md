---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/testing/api-tests.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 51
size: 1334 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, project/unnati, typescript, utility]
---

# api-tests.ts

> Utility / helper module using **typescript** (51 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/testing/api-tests.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 51 |
| **Size** | 1334 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function testApplicationsAPI(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/applications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok || response.status === 401;
  } catch {
    return false;
  }
}

export async function testNotificationsAPI(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/notifications`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok || response.status === 401;
  } catch {
    return false;
  }
}

export async function testJobSearch(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/jobs/search?query=test&limit=1`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok || response.status === 401;
  } catch {
    return false;
  }
}

export async function runAllTests(): Promise<{
  applications: boolean;
  notifications: boolean;
  jobSearch: boolean;
}> {
  const [applications, notifications, jobSearch] = await Promise.all([
    testApplicationsAPI(),
    testNotificationsAPI(),
    testJobSearch()
  ]);

  return { applications, notifications, jobSearch };
}

```
