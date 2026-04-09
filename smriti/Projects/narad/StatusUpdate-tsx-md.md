---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/StatusUpdate-tsx.md"
project: "narad"
role: config
language: markdown
frameworks: [typescript]
lines: 146
size: 3866 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad, typescript]
---

# StatusUpdate-tsx.md

> Configuration file for the project using **typescript** (146 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/StatusUpdate-tsx.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 146 |
| **Size** | 3866 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/jobs/StatusUpdate.tsx"
project: "unnati"
role: config
language: tsx
frameworks: [typescript]
lines: 107
size: 3077 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, config, project/unnati, tsx, typescript]
---

# StatusUpdate.tsx

> Configuration file for the project using **typescript** (107 lines).

**Key exports:** `StatusUpdate`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/jobs/StatusUpdate.tsx` |
| **Role** | config |
| **Language** | tsx |
| **Frameworks** | typescript |
| **Lines** | 107 |
| **Size** | 3077 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```tsx
'use client';

import { ApplicationStatus } from '@/lib/types';

interface StatusUpdateProps {
  status: ApplicationStatus;
  onStatusChange: (status: ApplicationStatus) => void;
}

const STATUS_CONFIG: Array<{
  status: ApplicationStatus;
  label: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}> = [
  { 
    status: ApplicationStatus.FOUND, 
    label: 'Found', 
    bg: 'bg-blue-50 hover:bg-blue-100', 
    text: 'text-blue-700', 
    border: 'border-blue-200',
    icon: '🔍'
  },
  { 
    status: ApplicationStatus.APPLIED, 
    label: 'Applied', 
    bg: 'bg-amber-50 hover:bg-amber-100', 
    text: 'text-amber-700', 
    border: 'border-amber-200',
    icon: '📤'
  },
  { 
    status: ApplicationStatus.VIEWED, 
    label: 'Viewed', 
    bg: 'bg-purple-50 hover:bg-purple-100', 
    text: 'text-purple-700', 
    border: 'border-purple-200',
    icon: '👁️'
  },
  { 
    status: ApplicationStatus.INTERVIEW, 
    label: 'Interview', 
    bg: 'bg-emerald-50 hover:bg-emerald-100', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200',
    icon: '📅'
  },
  { 
    status: ApplicationStatus.OFFER, 
    label: 'Offer', 
    bg: 'bg-rose-50 hover:bg-rose-100', 
    text: 'text-rose-700', 
    border: 'border-rose-200',
    icon: '🎉'
  },
  { 
    status: ApplicationStatus.REJECTED, 
    label: 'Rejected', 
    bg: 'bg-gray-50 hover:bg-gray-100', 
    text: 'text-gray-700', 
    border: 'border-gray-200',
    icon: '❌'
  },
];

function getStatusConfig(status: ApplicationStatus) {
  return STATUS_CONFIG.find(s => s.status === status) || STATUS_CONFIG[0];
}

export function StatusUpdate({ status, onStatusChange }: StatusUpdateProps) {
  const currentConfig = getStatusConfig(status);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Update Status</h3>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentConfig.bg} ${currentConfig.text} ${currentConfig.border} border`}>
            {currentConfig.icon} {currentConfig.label}
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {STATUS_CONFIG.map((config) => {
          const isActive = config.status === status;
          return (
            <button
              key={config.status}
              onClick={() => onStatusChange(config.status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? `${config.bg} ${config.text} ${config.border} border shadow-sm`
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

```
