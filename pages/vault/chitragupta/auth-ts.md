---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/src/ts/auth.ts"
project: "chitragupta"
role: auth
language: typescript
frameworks: [typescript, vite]
lines: 85
size: 3232 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, code, project/chitragupta, typescript, vite]
---

# auth.ts

> Authentication / authorization module using **typescript, vite** (85 lines).

**Key exports:** `auth`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/src/ts/auth.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | typescript, vite |
| **Lines** | 85 |
| **Size** | 3232 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[api-ts]]

## 📄 Content

```typescript
import { api } from './api';

export const auth = {
  signup: async (data: any) => {
    const res = await api.post('/auth/signup', data);
    localStorage.setItem('token', res.token);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('userId', res.userId);
    localStorage.setItem('organizationId', res.organizationId);
    localStorage.setItem('organizations', JSON.stringify(res.organizations));
    localStorage.setItem('role', res.role);
    return res;
  },

  login: async (data: any) => {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.token);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('userId', res.userId);
    localStorage.setItem('organizationId', res.organizationId);
    localStorage.setItem('organizations', JSON.stringify(res.organizations));
    localStorage.setItem('role', res.role);
    return res;
  },

  switchOrg: async (organizationId: string) => {
    const res = await api.post('/v1/auth/switch-org', { organizationId });
    localStorage.setItem('token', res.token);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('organizationId', res.organizationId);
    localStorage.setItem('role', res.role);
    return res;
  },

  getOrganizations: async () => {
    const res = await api.get('/v1/auth/orgs');
    return res;
  },

  invite: async (data: { email: string; role: string; memberName: string }) => {
    const res = await api.post('/v1/auth/invite', data);
    return res;
  },

  getCurrentOrg: () => {
    const orgId = localStorage.getItem('organizationId');
    const orgs = auth.getOrganizationsList();
    return orgs.find((o: any) => o.id === orgId) || orgs[0];
  },

  getOrganizationsList: () => {
    const stored = localStorage.getItem('organizations');
    return stored ? JSON.parse(stored) : [];
  },

  getRole: () => localStorage.getItem('role'),

  hasPermission: (permission: string) => {
    const role = auth.getRole();
    const permissions: Record<string, Record<string, boolean>> = {
      OWNER: { canDeleteOrg: true, canManageBilling: true, canManageMembers: true, canManageTransactions: true, canManageServices: true, canInviteMembers: true },
      ADMIN: { canDeleteOrg: false, canManageBilling: false, canManageMembers: true, canManageTransactions: true, canManageServices: true, canInviteMembers: true },
      MEMBER: { canDeleteOrg: false, canManageBilling: false, canManageMembers: false, canManageTransactions: false, canManageServices: false, canInviteMembers: false },
    };
    return permissions[role || 'MEMBER']?.[permission] ?? false;
  },

  logout: async () => {
    try {
      await api.post('/api/logout', {});
    } catch (e) {
      console.error('Logout audit failed', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('organizationId');
    localStorage.removeItem('organizations');
    localStorage.removeItem('role');
    window.location.href = '/login.html';
  },

  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

```
