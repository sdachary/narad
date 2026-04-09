---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/Step2Location-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, react, typescript]
lines: 221
size: 7382 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, docs, documentation, markdown, project/narad, react, typescript]
---

# Step2Location-tsx.md

> Documentation using **docker, react, typescript** (221 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/Step2Location-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, react, typescript |
| **Lines** | 221 |
| **Size** | 7382 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/Step2Location.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [docker, react, typescript]
lines: 181
size: 6539 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, component, docker, project/unnati, react, tsx, typescript]
---

# Step2Location.tsx

> UI component using **docker, react, typescript** (181 lines).

**Key exports:** `Step2Location`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/Step2Location.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | docker, react, typescript |
| **Lines** | 181 |
| **Size** | 6539 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";
import { X, MapPin, Building2 } from "lucide-react";

const POPULAR_CITIES = [
  { id: "bangalore", name: "Bangalore", region: "Karnataka" },
  { id: "mumbai", name: "Mumbai", region: "Maharashtra" },
  { id: "delhi", name: "Delhi", region: "Delhi NCR" },
  { id: "pune", name: "Pune", region: "Maharashtra" },
  { id: "hyderabad", name: "Hyderabad", region: "Telangana" },
  { id: "chennai", name: "Chennai", region: "Tamil Nadu" },
];

interface City {
  id: string;
  name: string;
  region: string;
}

interface StepProps {
  data: { locations: string[]; remoteOnly: boolean };
  onUpdate: (data: { locations: string[]; remoteOnly: boolean }) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Location({ data, onUpdate, onNext, onBack }: StepProps) {
  const [customCity, setCustomCity] = useState("");
  const locations = data.locations || [];
  const remoteOnly = data.remoteOnly || false;

  const addLocation = (location: string) => {
    const trimmed = location.trim();
    if (trimmed && !locations.includes(trimmed)) {
      onUpdate({ locations: [...locations, trimmed], remoteOnly });
    }
  };

  const removeLocation = (location: string) => {
    onUpdate({
      locations: locations.filter((l) => l !== location),
      remoteOnly,
    });
  };

  const toggleCity = (city: City) => {
    const cityFull = `${city.name}, ${city.region}`;
    if (locations.includes(cityFull)) {
      removeLocation(cityFull);
    } else {
      addLocation(cityFull);
    }
  };

  const toggleRemoteOnly = () => {
    const newRemoteOnly = !remoteOnly;
    if (newRemoteOnly) {
      onUpdate({ locations: ["Remote"], remoteOnly: true });
    } else {
      onUpdate({ locations: locations.filter((l) => l !== "Remote"), remoteOnly: false });
    }
  };

  const isSelected = (city: City) => {
    return locations.includes(`${city.name}, ${city.region}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Where are you located?</h2>
        <p className="text-white/60">Select your preferred work locations</p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Building2 className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium">Remote Only</p>
          <p className="text-white/60 text-sm">Work from anywhere</p>
        </div>
        <button
          onClick={toggleRemoteOnly}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            remoteOnly ? "bg-amber-500" : "bg-white/20"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              remoteOnly ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {!remoteOnly && (
        <>
          {locations.length > 0 && (
            <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
              {locations.map((location) => (
                <span
                  key={location}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white border border-amber-500/30"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">{location}</span>
                  <button
                    onClick={() => removeLocation(location)}
                    className="p-0.5 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Popular Cities
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => toggleCity(city)}
                  className={`px-4 py-3 rounded-xl border transition-all text-left ${
                    isSelected(city)
                      ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <p className="font-medium">{city.name}</p>
                  <p className="text-xs text-white/50">{city.region}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Add Custom Location
            </label>
            <input
              type="text"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addLocation(customCity);
                  setCustomCity("");
                }
              }}
              placeholder="e.g., Kolkata, West Bengal"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 transition-all"
            />
          </div>
        </>
      )}

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={locations.length === 0}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

```

```
