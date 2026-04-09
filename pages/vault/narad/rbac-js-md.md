---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/rbac-js.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 239
size: 5896 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, documentation, markdown, project/narad]
---

# rbac-js.md

> Authentication / authorization module (239 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/rbac-js.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 239 |
| **Size** | 5896 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/pages/services/rbac.js"
project: "vishwakarma"
role: auth
language: javascript
frameworks: []
lines: 199
size: 5102 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [auth, code, javascript, project/vishwakarma]
---

# rbac.js

> Authentication / authorization module (199 lines).

**Key exports:** `checkPermission`, `getRolePermissions`, `getAllRoles`, `validateRole`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/pages/services/rbac.js` |
| **Role** | auth |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 199 |
| **Size** | 5102 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const RBAC_CONFIG = {
  roles: {
    admin: {
      name: 'Administrator',
      permissions: ['*'],
      description: 'Full system access'
    },
    operator: {
      name: 'Operator',
      permissions: ['provision', 'monitor', 'backup', 'restore'],
      description: 'Can manage deployments'
    },
    viewer: {
      name: 'Viewer',
      permissions: ['view'],
      description: 'Read-only access'
    },
    client: {
      name: 'Client',
      permissions: ['self_service', 'view'],
      description: 'Client self-service access'
    }
  },
  defaultRole: 'client'
};

export function checkPermission(userRole, permission) {
  const role = RBAC_CONFIG.roles[userRole];
  if (!role) return false;
  if (role.permissions.includes('*')) return true;
  return role.permissions.includes(permission);
}

export function getRolePermissions(role) {
  return RBAC_CONFIG.roles[role]?.permissions || [];
}

export function getAllRoles() {
  return RBAC_CONFIG.roles;
}

export function validateRole(role) {
  return RBAC_CONFIG.roles[role] ? true : false;
}

export async function authorizeRequest(request, env, requiredPermission) {
  const jwt = request.headers.get('CF-Access-Jwt-Assertion');
  const authHeader = request.headers.get('Authorization');
  
  if (env.ENVIRONMENT === 'dev') {
    return { authorized: true, role: 'admin', userId: 'dev' };
  }
  
  if (jwt) {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        return { authorized: false, error: 'Invalid JWT format' };
      }
      
      const payload = JSON.parse(atob(parts[1]));
      const role = payload.role || RBAC_CONFIG.defaultRole;
      
      if (!checkPermission(role, requiredPermission)) {
        return { authorized: false, error: 'Insufficient permissions' };
      }
      
      return {
        authorized: true,
        role,
        userId: payload.sub,
        email: payload.email
      };
    } catch (e) {
      return { authorized: false, error: 'Invalid JWT' };
    }
  }
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const userData = await env.RESOURCES.get(`token:${token}`, 'json');
    
    if (!userData) {
      return { authorized: false, error: 'Invalid token' };
    }
    
    if (!checkPermission(userData.role, requiredPermission)) {
      return { authorized: false, error: 'Insufficient permissions' };
    }
    
    return {
      authorized: true,
      role: userData.role,
      userId: userData.userId
    };
  }
  
  return { authorized: false, error: 'Authentication required' };
}

export async function createSession(env, userId, role, expiresIn = 86400) {
  const token = generateSecureToken(32);
  const session = {
    userId,
    role,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
  };
  
  await env.RESOURCES.put(`token:${token}`, JSON.stringify(session), {
    expirationTtl: expiresIn
  });
  
  return { token, expiresIn };
}

export async function validateSession(env, token) {
  const session = await env.RESOURCES.get(`token:${token}`, 'json');
  
  if (!session) {
    return { valid: false, error: 'Session not found' };
  }
  
  if (new Date(session.expiresAt) < new Date()) {
    return { valid: false, error: 'Session expired' };
  }
  
  return { valid: true, session };
}

export async function revokeSession(env, token) {
  await env.RESOURCES.delete(`token:${token}`);
  return { success: true };
}

function generateSecureToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function setupSSO(env, config) {
  const ssoConfig = {
    provider: config.provider,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    authorizedDomains: config.authorizedDomains || [],
    roleMapping: config.roleMapping || {},
    enabled: true,
    createdAt: new Date().toISOString()
  };
  
  await env.RESOURCES.put('sso:config', JSON.stringify(ssoConfig));
  
  return { success: true, provider: config.provider };
}

export async function handleSSOLogin(env, provider, code) {
  let userInfo;
  
  switch (provider) {
    case 'google':
      userInfo = await handleGoogleSSO(code, env);
      break;
    case 'oidc':
      userInfo = await handleOIDCSSO(code, env);
      break;
    default:
      return { error: 'Unknown SSO provider' };
  }
  
  if (!userInfo) {
    return { error: 'SSO authentication failed' };
  }
  
  const role = RBAC_CONFIG.defaultRole;
  const session = await createSession(env, userInfo.email, role);
  
  return {
    success: true,
    session,
    user: {
      email: userInfo.email,
      name: userInfo.name,
      role
    }
  };
}

async function handleGoogleSSO(code, env) {
  return { email: 'user@gmail.com', name: 'Google User' };
}

async function handleOIDCSSO(code, env) {
  return { email: 'user@oidc.com', name: 'OIDC User' };
}

```

```
