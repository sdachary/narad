# MCP — Nisha Worker Bridge

> Future: expose the CloudProvision worker's `/api/clients` and `/api/provision`
> as MCP tools that Narad can call directly.

## Planned Tools

| Tool | Description |
|---|---|
| `list_clients` | Get all provisioned client VMs and their status |
| `get_client_logs` | Fetch deployment logs for a specific client |
| `provision_client` | Trigger a new OCI VM provisioning |
| `destroy_client` | Trigger teardown of a client VM |
| `get_platform_health` | Overall health of Nisha platform |

## Status

Not implemented yet. First implement the `ADMIN_SECRET_TOKEN` fix in the
cloudprovision worker (security audit item) before exposing these as MCP tools.

See: [Nisha Audit Report](https://github.com/sdachary/nisha) — BUG-04
