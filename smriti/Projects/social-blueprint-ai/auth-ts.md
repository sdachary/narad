---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/lib/auth.ts"
project: "social-blueprint-ai"
role: auth
language: typescript
frameworks: [typescript]
lines: 61
size: 1750 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, project/social-blueprint-ai, typescript]
---

# auth.ts

> Authentication / authorization module using **typescript** (61 lines).

**Key exports:** `getAuthToken`, `logout`, `isAuthenticated`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/lib/auth.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 61 |
| **Size** | 1750 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[config-ts]]

## 📄 Content

```typescript
import { apiUrl } from '../config';

export async function login(email: string, password: string) {
  const response = await fetch(apiUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const { token } = await response.json();
  localStorage.setItem('authToken', token);
  localStorage.setItem('isAuthenticated', 'true');
  return token;
}

export async function register(email: string, password: string) {
  const response = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const { token } = await response.json();
  localStorage.setItem('authToken', token);
  localStorage.setItem('isAuthenticated', 'true');
  return token;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function logout() {
  localStorage.removeItem('authToken');
  localStorage.setItem('isAuthenticated', 'false');
  window.location.href = '/login';
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function loginWithGoogle() {
  const response = await fetch(apiUrl('/api/auth/google/url'));
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to initialize Google login');
  }
  const { url } = await response.json();
  window.location.href = url;
}

```
