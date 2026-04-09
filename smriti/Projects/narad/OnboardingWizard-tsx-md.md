---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/OnboardingWizard-tsx.md"
project: "narad"
role: docs
language: markdown
frameworks: [react, typescript]
lines: 230
size: 6726 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad, react, typescript]
---

# OnboardingWizard-tsx.md

> Documentation using **react, typescript** (230 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/OnboardingWizard-tsx.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 230 |
| **Size** | 6726 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/OnboardingWizard.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 190
size: 5723 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# OnboardingWizard.tsx

> UI component using **react, typescript** (190 lines).

**Key exports:** `OnboardingWizard`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/OnboardingWizard.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 190 |
| **Size** | 5723 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

[[Step1Roles-tsx]], [[Step2Location-tsx]], [[Step3CompanyType-tsx]], [[Step4Sectors-tsx]], [[Step5Experience-tsx]], [[Step6Resume-tsx]], [[Step7HuntSettings-tsx]], [[Step8Launch-tsx]]

## 📄 Content

```tsx
"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Step1Roles from "./Step1Roles";
import Step2Location from "./Step2Location";
import Step3CompanyType from "./Step3CompanyType";
import Step4Sectors from "./Step4Sectors";
import Step5Experience from "./Step5Experience";
import Step6Resume from "./Step6Resume";
import Step7HuntSettings from "./Step7HuntSettings";
import Step8Launch from "./Step8Launch";

interface OnboardingData {
  roles: string[];
  locations: string[];
  remoteOnly: boolean;
  companyTypes: string[];
  sectors: string[];
  experience: string;
  resume: any;
  autoApply: boolean;
  matchThreshold: number;
  frequency: string;
  [key: string]: any;
}

interface OnboardingWizardProps {
  onComplete: () => void;
}

const STEPS = [
  { id: 1, title: "Roles", required: true },
  { id: 2, title: "Location", required: true },
  { id: 3, title: "Company Type", required: true },
  { id: 4, title: "Sectors", required: true },
  { id: 5, title: "Experience", required: true },
  { id: 6, title: "Resume", required: false },
  { id: 7, title: "Hunt Settings", required: true },
  { id: 8, title: "Launch", required: true },
];

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    roles: [],
    locations: [],
    remoteOnly: false,
    companyTypes: [],
    sectors: [],
    experience: "",
    resume: null,
    autoApply: false,
    matchThreshold: 70,
    frequency: "daily",
  });

  const updateData = useCallback((update: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...update }));
  }, []);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.roles.length > 0;
      case 2:
        return data.locations.length > 0;
      case 3:
        return data.companyTypes.length > 0;
      case 4:
        return data.sectors.length > 0;
      case 5:
        return !!data.experience;
      case 6:
        return true;
      case 7:
        return true;
      case 8:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderStep = () => {
    const commonProps = {
      data,
      onUpdate: updateData,
      onNext: handleNext,
      onBack: handleBack,
    };

    switch (currentStep) {
      case 1:
        return <Step1Roles {...commonProps} />;
      case 2:
        return <Step2Location {...commonProps} />;
      case 3:
        return <Step3CompanyType {...commonProps} />;
      case 4:
        return <Step4Sectors {...commonProps} />;
      case 5:
        return <Step5Experience {...commonProps} />;
      case 6:
        return <Step6Resume {...commonProps} />;
      case 7:
        return <Step7HuntSettings {...commonProps} />;
      case 8:
        return <Step8Launch {...commonProps} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Unnati</h1>
          <p className="text-white/60">Let&apos;s set up your job hunt</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-4 ring-amber-500/30"
                        : "bg-white/10 text-white/50 border border-white/20"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs text-white/60 mt-1 hidden sm:block">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
                      currentStep > step.id ? "bg-green-500" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between mt-6 text-white/60 text-sm">
          <span>
            Step {currentStep} of {STEPS.length}
          </span>
          <span>
            {STEPS[currentStep - 1]?.required && (
              <span className="text-amber-400">* Required</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

```

```
