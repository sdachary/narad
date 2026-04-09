---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/Step3CompanyType.tsx"
project: "unnati"
role: service
language: tsx
frameworks: [react, typescript]
lines: 128
size: 4038 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, project/unnati, react, service, tsx, typescript]
---

# Step3CompanyType.tsx

> Service / API client module using **react, typescript** (128 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/Step3CompanyType.tsx` |
| **Role** | service |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 128 |
| **Size** | 4038 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```tsx
import React from 'react';
import { Rocket, Package, Briefcase, Building2 } from 'lucide-react';
import { StepProps } from './types';

interface CompanyType {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const companyTypes: CompanyType[] = [
  {
    id: 'startup',
    label: 'Startup',
    description: 'High growth potential, equity-based compensation',
    icon: <Rocket className="w-6 h-6" />,
  },
  {
    id: 'product',
    label: 'Product-based',
    description: 'Build and own our own products',
    icon: <Package className="w-6 h-6" />,
  },
  {
    id: 'service',
    label: 'Service-based',
    description: 'Wipro, TCS, Accenture and similar IT services',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    description: 'FAANG and large corporations',
    icon: <Building2 className="w-6 h-6" />,
  },
];

const Step3CompanyType: React.FC<StepProps> = ({ data, onUpdate, onNext, onBack }) => {
  const selected = data.companyTypes || [];

  const toggleType = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((t: string) => t !== id)
      : [...selected, id];
    onUpdate({ companyTypes: updated });
  };

  const handleNext = () => {
    if (selected.length > 0) {
      onNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        What type of company do you work at?
      </h2>
      <p className="text-gray-500 mb-8">
        Select all that apply
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {companyTypes.map((type) => {
          const isSelected = selected.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={`
                relative flex flex-col items-start p-5 rounded-xl border-2 text-left transition-all duration-200
                ${isSelected
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className={`
                p-2.5 rounded-lg mb-3 transition-colors
                ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                {type.icon}
              </div>
              <span className={`font-semibold text-base mb-1 ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                {type.label}
              </span>
              <span className="text-sm text-gray-500 leading-relaxed">
                {type.description}
              </span>
              {isSelected && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className={`
            px-6 py-2.5 rounded-lg font-medium transition-all
            ${selected.length > 0
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

export default Step3CompanyType;

```
