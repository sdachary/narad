---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/status-workflow-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 91
size: 2351 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# status-workflow-ts.md

> Utility / helper module using **typescript** (91 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/status-workflow-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 91 |
| **Size** | 2351 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/automation/status-workflow.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 51
size: 1492 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, project/unnati, typescript, utility]
---

# status-workflow.ts

> Utility / helper module using **typescript** (51 lines).

**Key exports:** `getValidTransitions`, `isValidTransition`, `STATUS_ORDER`, `getNextStatus`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/automation/status-workflow.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 51 |
| **Size** | 1492 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```typescript
import { ApplicationStatus } from '../types';

export { ApplicationStatus };

const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.FOUND]: [
    ApplicationStatus.APPLIED,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.APPLIED]: [
    ApplicationStatus.VIEWED,
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.VIEWED]: [
    ApplicationStatus.INTERVIEW,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.INTERVIEW]: [
    ApplicationStatus.OFFER,
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.OFFER]: [
    ApplicationStatus.REJECTED,
  ],
  [ApplicationStatus.REJECTED]: [],
};

export function getValidTransitions(currentStatus: ApplicationStatus): ApplicationStatus[] {
  return TRANSITIONS[currentStatus] ?? [];
}

export function isValidTransition(from: ApplicationStatus, to: ApplicationStatus): boolean {
  const validTransitions = TRANSITIONS[from];
  return validTransitions?.includes(to) ?? false;
}

export const STATUS_ORDER: ApplicationStatus[] = [
  ApplicationStatus.FOUND,
  ApplicationStatus.APPLIED,
  ApplicationStatus.VIEWED,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.REJECTED,
];

export function getNextStatus(currentStatus: ApplicationStatus): ApplicationStatus | null {
  const idx = STATUS_ORDER.indexOf(currentStatus);
  if (idx === -1 || idx === STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[idx + 1];
}

```

```
