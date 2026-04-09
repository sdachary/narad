---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/connectors-js-md-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 244
size: 4851 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [config, documentation, markdown, project/narad]
---

# connectors-js-md-md-md-md.md

> Configuration file for the project (244 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/connectors-js-md-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 244 |
| **Size** | 4851 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/connectors-js-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 206
size: 4106 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad]
---

# connectors-js-md-md-md.md

> Configuration file for the project (206 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/connectors-js-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 206 |
| **Size** | 4106 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/connectors-js-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 168
size: 3370 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [config, documentation, markdown, project/narad]
---

# connectors-js-md-md.md

> Configuration file for the project (168 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/connectors-js-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 168 |
| **Size** | 3370 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/connectors-js-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 130
size: 2643 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, markdown, project/narad]
---

# connectors-js-md.md

> Configuration file for the project (130 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/connectors-js-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 130 |
| **Size** | 2643 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/connectors-js.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 92
size: 1928 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, documentation, markdown, project/narad]
---

# connectors-js.md

> Configuration file for the project (92 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/connectors-js.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 92 |
| **Size** | 1928 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/config/connectors.js"
project: "narad"
role: config
language: javascript
frameworks: []
lines: 52
size: 1118 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, javascript, project/narad]
---

# connectors.js

> Configuration file for the project (52 lines).

**Key exports:** `DISCORD_CONFIG`, `TELEGRAM_CONFIG`, `isConnectorEnabled`, `getConnectorConfig`, `initConnector`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/config/connectors.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 52 |
| **Size** | 1118 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```javascript
export const DISCORD_CONFIG = {
  enabled: false,
  botToken: '',
  serverMappings: [],
};

export const TELEGRAM_CONFIG = {
  enabled: false,
  botToken: '',
  allowedUsers: [],
};

export function isConnectorEnabled(type) {
  const configs = {
    discord: DISCORD_CONFIG,
    telegram: TELEGRAM_CONFIG
  };
  const config = configs[type?.toLowerCase()];
  return config?.enabled === true && !!config.botToken;
}

export function getConnectorConfig(type) {
  const configs = {
    discord: DISCORD_CONFIG,
    telegram: TELEGRAM_CONFIG
  };
  return configs[type?.toLowerCase()] || null;
}

export function initConnector(type, env) {
  const typeLower = type?.toLowerCase();
  
  if (typeLower === 'discord') {
    const token = env?.DISCORD_BOT_TOKEN;
    if (token) {
      DISCORD_CONFIG.enabled = true;
      DISCORD_CONFIG.botToken = token;
    }
    return DISCORD_CONFIG;
  }
  
  if (typeLower === 'telegram') {
    const token = env?.TELEGRAM_BOT_TOKEN;
    if (token) {
      TELEGRAM_CONFIG.enabled = true;
      TELEGRAM_CONFIG.botToken = token;
    }
    return TELEGRAM_CONFIG;
  }
  
  return null;
}

```

```

```

```

```

```
