---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/lib/apiClient.ts"
project: "social-blueprint-ai"
role: auth
language: typescript
frameworks: [typescript]
lines: 37
size: 940 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
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
| **Modified** | 2026-04-08 16:51 |

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
