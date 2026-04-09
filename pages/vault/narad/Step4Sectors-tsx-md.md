---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/Step4Sectors-tsx.md"
project: "narad"
role: middleware
language: markdown
frameworks: [react, typescript]
lines: 201
size: 5943 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, middleware, project/narad, react, typescript]
---

# Step4Sectors-tsx.md

> Middleware layer using **react, typescript** (201 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/Step4Sectors-tsx.md` |
| **Role** | middleware |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 201 |
| **Size** | 5943 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/Step4Sectors.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 163
size: 5160 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# Step4Sectors.tsx

> UI component using **react, typescript** (163 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/Step4Sectors.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 163 |
| **Size** | 5160 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```tsx
import React, { useState, useMemo } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { StepProps } from './types';

const sectorOptions = [
  'AI/ML',
  'Fintech',
  'E-commerce',
  'Healthcare',
  'SaaS',
  'EdTech',
  'Gaming',
  'Logistics',
  'CyberSecurity',
  'Blockchain',
  'IoT',
  'AR/VR',
];

const Step4Sectors: React.FC<StepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const selectedSectors: string[] = data.sectors || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [customSector, setCustomSector] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return sectorOptions;
    return sectorOptions.filter(s =>
      s.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const availableOptions = filteredOptions.filter(
    opt => !selectedSectors.includes(opt)
  );

  const addSector = (sector: string) => {
    if (sector && !selectedSectors.includes(sector)) {
      onUpdate({ sectors: [...selectedSectors, sector] });
    }
  };

  const removeSector = (sector: string) => {
    onUpdate({
      sectors: selectedSectors.filter(s => s !== sector)
    });
  };

  const handleCustomAdd = () => {
    if (customSector.trim()) {
      addSector(customSector.trim());
      setCustomSector('');
    }
  };

  const handleNext = () => {
    if (selectedSectors.length > 0) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        What industry are you in?
      </h2>
      <p className="text-gray-500 mb-8">
        Select all that apply
      </p>

      {selectedSectors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          {selectedSectors.map((sector) => (
            <span
              key={sector}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
            >
              {sector}
              <button
                onClick={() => removeSector(sector)}
                className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search sectors..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {availableOptions.map((sector) => (
          <button
            key={sector}
            onClick={() => addSector(sector)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-all"
          >
            {sector}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1">
          <input
            type="text"
            value={customSector}
            onChange={(e) => setCustomSector(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomAdd()}
            placeholder="Add custom sector..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button
          onClick={handleCustomAdd}
          disabled={!customSector.trim()}
          className={`
            p-3 rounded-xl transition-all
            ${customSector.trim()
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selectedSectors.length === 0}
          className={`
            px-6 py-2.5 rounded-lg font-medium transition-all
            ${selectedSectors.length > 0
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step4Sectors;

```

```
