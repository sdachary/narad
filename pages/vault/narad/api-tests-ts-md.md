---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/api-tests-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 89
size: 2066 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# api-tests-ts.md

> Utility / helper module using **typescript** (89 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/api-tests-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 89 |
| **Size** | 2066 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/testing/api-tests.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 51
size: 1334 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
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
| **Modified** | 2026-04-08 16:51 |

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

```
