---
source: "/home/runner/work/narad/narad/sync_temp/indra/workflows.json"
project: "indra"
role: auth
language: json
frameworks: []
lines: 1
size: 3195 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, code, json, project/indra]
---

# workflows.json

> Authentication / authorization module (1 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `indra/workflows.json` |
| **Role** | auth |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 1 |
| **Size** | 3195 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```json
{"updatedAt":"2026-02-28T17:05:04.470Z","createdAt":"2026-02-25T05:45:43.788Z","id":"nUO8LU1i8SL6ZrJn","name":"Auto Sync","active":true,"isArchived":false,"nodes":[{"parameters":{"rule":{"interval":[{"triggerAtMinute":1}]}},"name":"Schedule Trigger","type":"n8n-nodes-base.scheduleTrigger","typeVersion":1.1,"position":[-304,-128],"id":"e035bd88-4390-4a30-b5bf-ae6e259933f2"},{"parameters":{"resource":"file","operation":"edit","owner":"sdachary","repository":"n8n-automated-backup","filePath":"workflows/workflows.json","fileContent":"={{ JSON.stringify($json) }}","commitMessage":"Automated Workflow Sync"},"name":"GitHub","type":"n8n-nodes-base.github","typeVersion":1,"position":[144,-128],"id":"e15c46dc-21d0-4478-b057-9fe7973ec2d4","webhookId":"f563260e-91a3-4de1-880c-31b7780e4106","credentials":{"githubApi":{"id":"IwvZimGrZFA3QJ1Z","name":"GitHub account"}}},{"parameters":{"filters":{},"requestOptions":{}},"name":"workflow","type":"n8n-nodes-base.n8n","typeVersion":1,"position":[-80,-128],"id":"ed8bf271-a5c3-4bfd-a27e-ba9aad7581df","credentials":{"n8nApi":{"id":"2EqIS6PYA39D6gaM","name":"n8n account"}}}],"connections":{"Schedule Trigger":{"main":[[{"node":"workflow","type":"main","index":0}]]},"workflow":{"main":[[{"node":"GitHub","type":"main","index":0}]]}},"settings":{"executionOrder":"v1","binaryMode":"separate","availableInMCP":false},"staticData":{"node:Schedule Trigger":{"recurrenceRules":[]}},"meta":{"templateCredsSetupCompleted":true},"pinData":{},"versionId":"9b07795d-3242-435a-8bb2-4248b78e369d","activeVersionId":"74d6f043-3374-4821-b642-902dd971f585","triggerCount":1,"shared":[{"updatedAt":"2026-02-25T05:45:43.788Z","createdAt":"2026-02-25T05:45:43.788Z","role":"workflow:owner","workflowId":"nUO8LU1i8SL6ZrJn","projectId":"779dXTtGBrYsXped"}],"activeVersion":{"updatedAt":"2026-02-25T06:43:34.360Z","createdAt":"2026-02-25T06:43:14.773Z","versionId":"74d6f043-3374-4821-b642-902dd971f585","workflowId":"nUO8LU1i8SL6ZrJn","nodes":[{"parameters":{"rule":{"interval":[{"field":"hours","hoursInterval":24}]}},"name":"Schedule Trigger","type":"n8n-nodes-base.scheduleTrigger","typeVersion":1.1,"position":[-304,-128],"id":"e035bd88-4390-4a30-b5bf-ae6e259933f2"},{"parameters":{"resource":"file","operation":"edit","owner":"sdachary","repository":"n8n-automated-backup","filePath":"workflows/workflows.json","fileContent":"={{ JSON.stringify($json) }}","commitMessage":"Automated Workflow Sync"},"name":"GitHub","type":"n8n-nodes-base.github","typeVersion":1,"position":[144,-128],"id":"e15c46dc-21d0-4478-b057-9fe7973ec2d4","webhookId":"f563260e-91a3-4de1-880c-31b7780e4106","credentials":{"githubApi":{"id":"IwvZimGrZFA3QJ1Z","name":"GitHub account"}}},{"parameters":{"filters":{},"requestOptions":{}},"name":"workflow","type":"n8n-nodes-base.n8n","typeVersion":1,"position":[-80,-128],"id":"ed8bf271-a5c3-4bfd-a27e-ba9aad7581df","credentials":{"n8nApi":{"id":"2EqIS6PYA39D6gaM","name":"n8n account"}}}],"connections":{"Schedule Trigger":{"main":[[{"node":"workflow","type":"main","index":0}]]},"workflow":{"main":[[{"node":"GitHub","type":"main","index":0}]]}},"authors":"S Deepak Achary","name":"Version 74d6f043","description":"","autosaved":true},"tags":[]}
```
