---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/QuestionCard-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 135
size: 3713 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# QuestionCard-tsx.md

> Documentation using **react, typescript** (135 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/QuestionCard-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 135 |
| **Size** | 3713 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/interview/QuestionCard.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 95
size: 2911 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# QuestionCard.tsx

> UI component using **react, typescript** (95 lines).

**Key exports:** `QuestionCard`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/interview/QuestionCard.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 95 |
| **Size** | 2911 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";

interface QuestionCardProps {
  question: string;
  type: "technical" | "behavioral" | "company";
  onStartAnswer?: () => void;
}

export function QuestionCard({ question, type, onStartAnswer }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const typeStyles = {
    technical: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      icon: "text-blue-500",
    },
    behavioral: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      badge: "bg-purple-100 text-purple-700",
      icon: "text-purple-500",
    },
    company: {
      bg: "bg-green-50",
      border: "border-green-200",
      badge: "bg-green-100 text-green-700",
      icon: "text-green-500",
    },
  };

  const styles = typeStyles[type];

  return (
    <div
      className={`rounded-lg border ${styles.border} ${styles.bg} p-4 transition-all`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles.badge}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">{question}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-white/50 transition-colors"
        >
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {isExpanded && onStartAnswer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onStartAnswer}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            Start Recording Answer
          </button>
        </div>
      )}
    </div>
  );
}

```

```
