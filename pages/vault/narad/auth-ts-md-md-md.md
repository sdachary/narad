---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/auth-ts-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 149
size: 3386 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# auth-ts-md-md.md

> Authentication / authorization module using **typescript** (149 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/auth-ts-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 149 |
| **Size** | 3386 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/auth-ts-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 111
size: 2630 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# auth-ts-md.md

> Authentication / authorization module using **typescript** (111 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/auth-ts-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 111 |
| **Size** | 2630 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/auth-ts.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 73
size: 1858 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# auth-ts.md

> Authentication / authorization module using **typescript** (73 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/auth-ts.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 73 |
| **Size** | 1858 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/worker/src/auth.ts"
project: "social-blueprint-ai"
role: auth
language: typescript
frameworks: [typescript]
lines: 35
size: 1094 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, code, project/social-blueprint-ai, typescript]
---

# auth.ts

> Authentication / authorization module using **typescript** (35 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/worker/src/auth.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 35 |
| **Size** | 1094 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const getSecret = (env: any) => new TextEncoder().encode(
  env.JWT_SECRET || 'dev-secret-change-in-production'
);

export async function generateToken(userId: number, email: string, env: any): Promise<string> {
  const secret = getSecret(env);
  return await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string, env: any): Promise<{ userId: number; email: string }> {
  const secret = getSecret(env);
  try {
    const verified = await jwtVerify(token, secret);
    return {
      userId: verified.payload.userId as number,
      email: verified.payload.email as string,
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

```

```

```

```
