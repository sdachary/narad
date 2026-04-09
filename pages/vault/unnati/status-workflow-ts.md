---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/automation/status-workflow.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 51
size: 1492 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
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
| **Modified** | 2026-04-09 15:18 |

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
