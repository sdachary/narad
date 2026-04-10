---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/mcp-js-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 414
size: 9519 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, project/narad, service]
---

# mcp-js-md-md-md.md

> Service / API client module (414 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/mcp-js-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 414 |
| **Size** | 9519 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/mcp-js-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 376
size: 8808 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service]
---

# mcp-js-md-md.md

> Service / API client module (376 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/mcp-js-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 376 |
| **Size** | 8808 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/mcp-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 338
size: 8106 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, service]
---

# mcp-js-md.md

> Service / API client module (338 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/mcp-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 338 |
| **Size** | 8106 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/mcp-js.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 300
size: 7413 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, service]
---

# mcp-js.md

> Service / API client module (300 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/mcp-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 300 |
| **Size** | 7413 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/mcp.js"
project: "narad"
role: service
language: javascript
frameworks: []
lines: 260
size: 6678 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, javascript, project/narad, service]
---

# mcp.js

> Service / API client module (260 lines).

**Key exports:** `mcpManager`, `listAvailableConnectors`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/mcp.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 260 |
| **Size** | 6678 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const MCP_CONFIG = {
  supportedConnectors: [
    'github', 'notion', 'slack', 'discord', 'gmail', 'drive', 
    'jira', 'confluence', 'postgres', 'mysql', 'mongodb', 
    'redis', 'elasticsearch', 's3', 'webhook'
  ],
  maxConnections: 10,
  timeout: 30000
};

class MCPConnector {
  constructor(config) {
    this.id = config.id;
    this.type = config.type;
    this.config = config;
    this.connected = false;
  }
  
  async connect() {
    this.connected = true;
    return { success: true };
  }
  
  async disconnect() {
    this.connected = false;
    return { success: true };
  }
  
  async query(data) {
    throw new Error('Not implemented');
  }
}

class GitHubConnector extends MCPConnector {
  async query(data) {
    const { owner, repo, path, query } = data;
    const token = this.config.token;
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    };
    
    if (query) {
      const response = await fetch(
        `https://api.github.com/search/code?q=${encodeURIComponent(query)}&repo=${owner}/${repo}`,
        { headers }
      );
      const results = await response.json();
      return { type: 'search', results: results.items || [] };
    }
    
    if (path) {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers }
      );
      const content = await response.json();
      return { type: 'content', data: content };
    }
    
    return { error: 'Invalid query' };
  }
}

class NotionConnector extends MCPConnector {
  async query(data) {
    const { databaseId, filter } = data;
    const token = this.config.token;
    
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filter || {})
    });
    
    const results = await response.json();
    return { type: 'database', results: results.results || [] };
  }
}

class SlackConnector extends MCPConnector {
  async query(data) {
    const { channel, message, search } = data;
    const token = this.config.token;
    
    if (search) {
      const response = await fetch('https://slack.com/api/search.messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: search })
      });
      const result = await response.json();
      return { type: 'search', messages: result.messages || [] };
    }
    
    if (message && channel) {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ channel, text: message })
      });
      const result = await response.json();
      return { type: 'message', sent: result.ok };
    }
    
    return { error: 'Invalid query' };
  }
}

class PostgresConnector extends MCPConnector {
  async query(data) {
    const { sql, params } = data;
    
    return {
      type: 'sql',
      notice: 'Cloudflare Workers does not support direct Postgres. Use external API wrapper.',
      sql,
      params
    };
  }
}

class S3Connector extends MCPConnector {
  async query(data) {
    const { bucket, key, operation, content } = data;
    const { endpoint, accessKey, secretKey } = this.config;
    
    return {
      type: 's3',
      notice: 'S3 operations require external service or Cloudflare R2',
      bucket,
      key,
      operation
    };
  }
}

const CONNECTOR_CLASSES = {
  github: GitHubConnector,
  notion: NotionConnector,
  slack: SlackConnector,
  postgres: PostgresConnector,
  s3: S3Connector
};

class MCPManager {
  constructor() {
    this.connectors = new Map();
    this.connections = new Map();
  }
  
  registerConnector(connector) {
    this.connectors.set(connector.id, connector);
    return { success: true, id: connector.id };
  }
  
  async connect(connectorId, config = {}) {
    const ConnectorClass = CONNECTOR_CLASSES[connectorType];
    if (!ConnectorClass) {
      return { error: `Unknown connector: ${connectorType}` };
    }
    
    const connector = new ConnectorClass({
      id: connectorId,
      type: connectorType,
      ...config
    });
    
    await connector.connect();
    this.connections.set(connectorId, connector);
    
    return { success: true };
  }
  
  async disconnect(connectorId) {
    const connector = this.connections.get(connectorId);
    if (connector) {
      await connector.disconnect();
      this.connections.delete(connectorId);
    }
    return { success: true };
  }
  
  async query(connectorId, data) {
    const connector = this.connections.get(connectorId);
    if (!connector) {
      return { error: `Not connected: ${connectorId}` };
    }
    
    return connector.query(data);
  }
  
  listConnectors() {
    return {
      registered: Array.from(this.connectors.keys()),
      connected: Array.from(this.connections.keys()),
      available: MCP_CONFIG.supportedConnectors
    };
  }
}

export const mcpManager = new MCPManager();

export async function mcpConnect(env, connectorType, config) {
  if (!MCP_CONFIG.supportedConnectors.includes(connectorType)) {
    return { error: `Unsupported connector: ${connectorType}` };
  }
  
  const connectorId = `${connectorType}:${Date.now()}`;
  const apiKey = env[`${connectorType.toUpperCase()}_API_KEY`] || config.apiKey;
  
  const connector = CONNECTOR_CLASSES[connectorType];
  if (!connector) {
    return { error: `Connector not implemented: ${connectorType}` };
  }
  
  const instance = new connector({
    id: connectorId,
    type: connectorType,
    token: apiKey,
    ...config
  });
  
  await instance.connect();
  mcpManager.connections.set(connectorId, instance);
  
  return { success: true, connectorId, type: connectorType };
}

export async function mcpQuery(env, connectorId, query) {
  const connector = mcpManager.connections.get(connectorId);
  if (!connector) {
    return { error: `Not connected: ${connectorId}` };
  }
  
  return connector.query(query);
}

export async function mcpDisconnect(connectorId) {
  const connector = mcpManager.connections.get(connectorId);
  if (connector) {
    await connector.disconnect();
    mcpManager.connections.delete(connectorId);
  }
  return { success: true };
}

export function listAvailableConnectors() {
  return MCP_CONFIG.supportedConnectors;
}

```

```

```

```

```
