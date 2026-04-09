---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/apiClient-ts-md-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 227
size: 4861 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# apiClient-ts-md-md-md-md.md

> Authentication / authorization module using **typescript** (227 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/apiClient-ts-md-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 227 |
| **Size** | 4861 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/apiClient-ts-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 189
size: 4072 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# apiClient-ts-md-md-md.md

> Authentication / authorization module using **typescript** (189 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/apiClient-ts-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 189 |
| **Size** | 4072 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/apiClient-ts-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 151
size: 3292 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# apiClient-ts-md-md.md

> Authentication / authorization module using **typescript** (151 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/apiClient-ts-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 151 |
| **Size** | 3292 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/apiClient-ts-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 113
size: 2521 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# apiClient-ts-md.md

> Authentication / authorization module using **typescript** (113 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/apiClient-ts-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 113 |
| **Size** | 2521 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/apiClient-ts.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 75
size: 1734 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# apiClient-ts.md

> Authentication / authorization module using **typescript** (75 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/apiClient-ts.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 75 |
| **Size** | 1734 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/lib/apiClient.ts"
project: "social-blueprint-ai"
role: auth
language: typescript
frameworks: [typescript]
lines: 37
size: 940 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, project/social-blueprint-ai, typescript]
---

# apiClient.ts

> Authentication / authorization module using **typescript** (37 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/lib/apiClient.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 37 |
| **Size** | 940 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[auth-ts]], [[config-ts]]

## 📄 Content

```typescript
import { getAuthToken } from './auth';
import { apiUrl } from '../config';

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
    } catch {
      // Not JSON or no error field
    }
    throw new Error(errorMessage);
  }

  const json = await response.json();
  return json.data !== undefined ? json.data : json;
}

```

```

```

```

```

```
