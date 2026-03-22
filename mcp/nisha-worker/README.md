# MCP — Nisha Worker Bridge

Exposes the CloudProvision worker's API as MCP tools that Narad can call directly.

## Status: Planned (Phase 2)

## Prerequisite

Before implementing: add `ADMIN_SECRET_TOKEN` to the cloudprovision worker
(security audit BUG-04). Without that, these tools would call an unauthenticated endpoint.

## Planned Tools

| Tool | HTTP method | Endpoint |
|---|---|---|
| `list_clients` | GET | `/api/clients` |
| `get_client_logs` | GET | `/api/clients/:id/logs` |
| `provision_client` | POST | `/api/provision` |
| `destroy_client` | POST | `/api/clients/:id/destroy` |
| `get_platform_health` | GET | `/api/health` |

## Implementation Plan

The MCP bridge will live at `src/infrastructure/mcp/NishaWorkerMcp.js`.
It will implement a new port `IMcpToolProvider` and be injected into
`HandleUserMessage` as an optional additional tool source.

When a user sends `/nisha provision ...`, the use case will delegate
to this MCP tool rather than the AGI worker.

## Schema (for when implementation starts)

```js
// src/infrastructure/mcp/NishaWorkerMcp.js
export class NishaWorkerMcp {
  constructor({ workerUrl, adminToken, logger }) { ... }
  async listClients() { ... }
  async getClientLogs(clientId) { ... }
  async provisionClient(payload) { ... }
  async destroyClient(clientId) { ... }
  async getHealth() { ... }
}
```
