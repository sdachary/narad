---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Step7HuntSettings-tsx-md-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [react, typescript]
lines: 396
size: 12100 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [config, documentation, markdown, project/narad, react, typescript]
---

# Step7HuntSettings-tsx-md-md-md-md.md

> Configuration file for the project using **react, typescript** (396 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Step7HuntSettings-tsx-md-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 396 |
| **Size** | 12100 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Step7HuntSettings-tsx-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [react, typescript]
lines: 358
size: 11251 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad, react, typescript]
---

# Step7HuntSettings-tsx-md-md-md.md

> Configuration file for the project using **react, typescript** (358 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Step7HuntSettings-tsx-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 358 |
| **Size** | 11251 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Step7HuntSettings-tsx-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [react, typescript]
lines: 320
size: 10411 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [config, documentation, markdown, project/narad, react, typescript]
---

# Step7HuntSettings-tsx-md-md.md

> Configuration file for the project using **react, typescript** (320 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Step7HuntSettings-tsx-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 320 |
| **Size** | 10411 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/Step7HuntSettings-tsx-md.md"
project: "narad"
role: config
language: markdown
frameworks: [react, typescript]
lines: 282
size: 9582 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, markdown, project/narad, react, typescript]
---

# Step7HuntSettings-tsx-md.md

> Configuration file for the project using **react, typescript** (282 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/Step7HuntSettings-tsx-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 282 |
| **Size** | 9582 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/Step7HuntSettings-tsx.md"
project: "narad"
role: config
language: markdown
frameworks: [react, typescript]
lines: 244
size: 8760 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, documentation, markdown, project/narad, react, typescript]
---

# Step7HuntSettings-tsx.md

> Configuration file for the project using **react, typescript** (244 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/Step7HuntSettings-tsx.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 244 |
| **Size** | 8760 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/Step7HuntSettings.tsx"
project: "unnati"
role: config
language: tsx
frameworks: [react, typescript]
lines: 204
size: 7920 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, project/unnati, react, tsx, typescript]
---

# Step7HuntSettings.tsx

> Configuration file for the project using **react, typescript** (204 lines).

**Key exports:** `Step7HuntSettings`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/Step7HuntSettings.tsx` |
| **Role** | config |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 204 |
| **Size** | 7920 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";
import { Zap, Sliders, Clock, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface FrequencyOption {
  value: string;
  label: string;
  description: string;
}

const frequencyOptions: FrequencyOption[] = [
  { value: "realtime", label: "Real-time", description: "Continuous monitoring as new jobs appear" },
  { value: "hourly", label: "Hourly", description: "Check for new jobs every hour" },
  { value: "daily", label: "Daily", description: "Once a day summary of new opportunities" },
  { value: "weekly", label: "Weekly", description: "Weekly digest of best matches" },
];

export default function Step7HuntSettings({ data, onUpdate, onNext, onBack }: StepProps) {
  const [autoApply, setAutoApply] = useState(data.autoApply || false);
  const [matchThreshold, setMatchThreshold] = useState(data.matchThreshold || 70);
  const [frequency, setFrequency] = useState(data.frequency || "daily");

  const handleAutoApplyToggle = (enabled: boolean) => {
    setAutoApply(enabled);
    onUpdate({ autoApply: enabled });
  };

  const handleThresholdChange = (value: number) => {
    setMatchThreshold(value);
    onUpdate({ matchThreshold: value });
  };

  const handleFrequencyChange = (value: string) => {
    setFrequency(value);
    onUpdate({ frequency: value });
  };

  const getThresholdColor = () => {
    if (matchThreshold >= 80) return "text-green-600";
    if (matchThreshold >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getThresholdLabel = () => {
    if (matchThreshold >= 80) return "High (Strict)";
    if (matchThreshold >= 60) return "Medium (Balanced)";
    return "Low (Broad)";
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure your job hunt</h2>
        <p className="text-gray-600">Set up how aggressively you want to search for opportunities</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Auto-apply</h3>
                <p className="text-sm text-gray-500">
                  {autoApply 
                    ? "Automatically apply to matched jobs after review" 
                    : "Get suggestions, I apply manually"}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleAutoApplyToggle(!autoApply)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                autoApply ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow ${
                  autoApply ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Sliders className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Match Score Threshold</h3>
              <p className="text-sm text-gray-500">Minimum match score to consider a job</p>
            </div>
          </div>

          <div className="px-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Score: {matchThreshold}%</span>
              <span className={`text-sm font-semibold ${getThresholdColor()}`}>
                {getThresholdLabel()}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={matchThreshold}
              onChange={(e) => handleThresholdChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[0, 30, 50, 70, 90].map((value) => (
                <button
                  key={value}
                  onClick={() => handleThresholdChange(value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    matchThreshold === value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Search Frequency</h3>
              <p className="text-sm text-gray-500">How often should we scan for new opportunities</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleFrequencyChange(option.value)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  frequency === option.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {frequency === option.value && (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <span className={`font-semibold block ${frequency === option.value ? "text-green-800" : "text-gray-900"}`}>
                    {option.label}
                  </span>
                  <span className="text-sm text-gray-500">{option.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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

```

```

```
