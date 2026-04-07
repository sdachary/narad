---
source: "/home/deepak/Work/chitragupta/src/ts/api.ts"
project: "chitragupta"
role: auth
language: typescript
frameworks: [typescript, vite]
lines: 95
size: 2636 bytes
last_modified: "2026-04-07 13:44"
scanned: "2026-04-07 13:44"
tags: [auth, code, project/chitragupta, typescript, vite]
---

# api.ts

> Authentication / authorization module using **typescript, vite** (95 lines).

**Key exports:** `api`, `invoices`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/src/ts/api.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | typescript, vite |
| **Lines** | 95 |
| **Size** | 2636 bytes |
| **Modified** | 2026-04-07 13:44 |

## 🔗 Related Files

—

## 📄 Content

```typescript
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        throw json;
      } catch (e) {
        throw new Error(text || res.statusText);
      }
    }
    return res.json();
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        throw json;
      } catch (e) {
        throw new Error(text || res.statusText);
      }
    }
    return res.json();
  },
  put: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        throw json;
      } catch (e) {
        throw new Error(text || res.statusText);
      }
    }
    return res.json();
  },
  delete: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!res.ok) {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        throw json;
      } catch (e) {
        throw new Error(text || res.statusText);
      }
    }
    return res;
  },
};

export const invoices = {
  list: async (orgId: string, status?: string) => {
    const query = status && status !== 'all' ? `?status=${status}` : '';
    return api.get(`/v1/organizations/${orgId}/invoices${query}`);
  },
  get: async (orgId: string, id: string) => {
    return api.get(`/v1/organizations/${orgId}/invoices/${id}`);
  },
  create: async (orgId: string, data: any) => {
    return api.post(`/v1/organizations/${orgId}/invoices`, data);
  },
  getPdf: async (orgId: string, id: string) => {
    return api.get(`/v1/organizations/${orgId}/invoices/${id}/pdf`);
  },
};

```
