---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/Step1Roles.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 160
size: 5369 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# Step1Roles.tsx

> UI component using **react, typescript** (160 lines).

**Key exports:** `Step1Roles`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/Step1Roles.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 160 |
| **Size** | 5369 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";
import { X, Plus, Check } from "lucide-react";

const PREDEFINED_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "QA Engineer",
  "Mobile Developer",
  "UI/UX Designer",
];

const POPULAR_ROLES = [
  "React Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Flutter Developer",
  "AWS Engineer",
  "ML Engineer",
  "iOS Developer",
];

interface StepProps {
  data: { roles: string[] };
  onUpdate: (data: { roles: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step1Roles({ data, onUpdate, onNext, onBack }: StepProps) {
  const [customRole, setCustomRole] = useState("");
  const roles = data.roles || [];

  const addRole = (role: string) => {
    const trimmed = role.trim();
    if (trimmed && !roles.includes(trimmed)) {
      onUpdate({ roles: [...roles, trimmed] });
    }
    setCustomRole("");
  };

  const removeRole = (role: string) => {
    onUpdate({ roles: roles.filter((r) => r !== role) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addRole(customRole);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What roles are you looking for?</h2>
        <p className="text-white/60">Select all that apply or add your own</p>
      </div>

      {roles.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
          {roles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white border border-amber-500/30"
            >
              <span className="text-sm font-medium">{role}</span>
              <button
                onClick={() => removeRole(role)}
                className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Add Custom Role
        </label>
        <div className="relative">
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a role and press Enter..."
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
          />
          <button
            onClick={() => addRole(customRole)}
            disabled={!customRole.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-amber-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">
          Popular Roles
        </label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => addRole(role)}
              disabled={roles.includes(role)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/80 mb-3">
          Predefined Roles
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PREDEFINED_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => addRole(role)}
              disabled={roles.includes(role)}
              className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium text-center"
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={roles.length === 0}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

```
