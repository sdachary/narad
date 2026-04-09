---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Step5Experience-tsx-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 167
size: 4845 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# Step5Experience-tsx-md.md

> Documentation using **react, typescript** (167 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Step5Experience-tsx-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 167 |
| **Size** | 4845 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/Step5Experience-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 129
size: 4056 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# Step5Experience-tsx.md

> Documentation using **react, typescript** (129 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/Step5Experience-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 129 |
| **Size** | 4056 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/Step5Experience.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 90
size: 3240 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# Step5Experience.tsx

> UI component using **react, typescript** (90 lines).

**Key exports:** `Step5Experience`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/Step5Experience.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 90 |
| **Size** | 3240 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface ExperienceOption {
  value: string;
  label: string;
  description: string;
}

const experienceOptions: ExperienceOption[] = [
  { value: "fresher", label: "Fresher", description: "0-1 years of experience" },
  { value: "junior", label: "Junior", description: "1-3 years of experience" },
  { value: "mid-level", label: "Mid-level", description: "3-5 years of experience" },
  { value: "senior", label: "Senior", description: "5-8 years of experience" },
  { value: "lead", label: "Lead/Principal", description: "8+ years of experience" },
  { value: "executive", label: "Executive", description: "Executive/C-Level positions" },
];

export default function Step5Experience({ data, onUpdate, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState(data.experience || "");

  const handleSelect = (value: string) => {
    setSelected(value);
    onUpdate({ experience: value });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What&apos;s your experience level?</h2>
        <p className="text-gray-600">Select the option that best describes your professional background</p>
      </div>

      <div className="grid gap-4 mb-8">
        {experienceOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selected === option.value
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-semibold ${
                  selected === option.value ? "text-blue-700" : "text-gray-900"
                }`}>
                  {option.label}
                </span>
                {selected === option.value && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

```

```
