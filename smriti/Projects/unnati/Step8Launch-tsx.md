---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/onboarding/Step8Launch.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 269
size: 8691 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# Step8Launch.tsx

> UI component using **react, typescript** (269 lines).

**Key exports:** `Step8Launch`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/onboarding/Step8Launch.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 269 |
| **Size** | 8691 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";
import { 
  CheckCircle, 
  ChevronLeft, 
  Briefcase, 
  MapPin, 
  Building2, 
  Target, 
  Award, 
  FileText, 
  Zap,
  Loader2,
  PartyPopper
} from "lucide-react";

interface StepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
}

const roleLabels: Record<string, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full Stack Developer",
  mobile: "Mobile Developer",
  devops: "DevOps Engineer",
  data: "Data Scientist",
  ml: "ML Engineer",
  product: "Product Manager",
  design: "UX/UI Designer",
  qa: "QA Engineer",
};

const experienceLabels: Record<string, string> = {
  fresher: "Fresher (0-1 years)",
  junior: "Junior (1-3 years)",
  "mid-level": "Mid-level (3-5 years)",
  senior: "Senior (5-8 years)",
  lead: "Lead/Principal (8+ years)",
  executive: "Executive",
};

const frequencyLabels: Record<string, string> = {
  realtime: "Real-time",
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
};

export default function Step8Launch({ data, onBack, onComplete }: StepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleLaunch = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const profileData = {
        roles: data.roles || [],
        locations: data.locations || [],
        companyTypes: data.companyTypes || [],
        sectors: data.sectors || [],
        experience: data.experience || "",
        resume: data.resume || null,
        huntSettings: {
          autoApply: data.autoApply || false,
          matchThreshold: data.matchThreshold || 70,
          frequency: data.frequency || "daily",
        },
      };

      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!profileRes.ok) {
        throw new Error("Failed to save preferences");
      }

      const huntRes = await fetch("/api/hunt/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          active: true,
          settings: profileData.huntSettings,
        }),
      });

      if (!huntRes.ok) {
        throw new Error("Failed to start hunt");
      }

      setIsSuccess(true);
      
      setTimeout(() => {
        onComplete();
      }, 2500);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center py-12">
        <div className="relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <PartyPopper className="w-12 h-12 text-green-600" />
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-400/20 rounded-full animate-ping" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Hunt Activated!</h2>
        <p className="text-gray-600 text-lg mb-6">
          Your job hunt is now live. We&apos;ll keep an eye out for perfect opportunities for you.
        </p>
        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="w-5 h-5 animate-pulse" />
          <span className="font-medium">Redirecting to dashboard...</span>
        </div>
      </div>
    );
  }

  const SummaryItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review and Launch</h2>
        <p className="text-gray-600">Confirm your preferences and start the hunt</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Your Profile Summary
          </h3>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <SummaryItem 
            icon={<Briefcase className="w-4 h-4" />}
            label="Roles"
            value={data.roles?.length > 0 
              ? data.roles.map((r: string) => roleLabels[r] || r).join(", ")
              : "Not selected"}
          />

          <SummaryItem 
            icon={<MapPin className="w-4 h-4" />}
            label="Locations"
            value={data.locations?.length > 0 
              ? data.locations.join(", ")
              : "Not selected"}
          />

          <SummaryItem 
            icon={<Building2 className="w-4 h-4" />}
            label="Company Types"
            value={data.companyTypes?.length > 0 
              ? data.companyTypes.map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")
              : "Not selected"}
          />

          <SummaryItem 
            icon={<Target className="w-4 h-4" />}
            label="Sectors"
            value={data.sectors?.length > 0 
              ? data.sectors.join(", ")
              : "Not selected"}
          />

          <SummaryItem 
            icon={<Award className="w-4 h-4" />}
            label="Experience"
            value={experienceLabels[data.experience] || "Not selected"}
          />

          <SummaryItem 
            icon={<FileText className="w-4 h-4" />}
            label="Resume"
            value={data.resume?.name ? `Uploaded (${data.resume.name})` : "Not uploaded"}
          />

          <div className="col-span-1 sm:col-span-2 pt-2 mt-2 border-t border-gray-100">
            <SummaryItem 
              icon={<Zap className="w-4 h-4" />}
              label="Hunt Settings"
              value={
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      data.autoApply 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {data.autoApply ? "Auto-apply ON" : "Suggestions only"}
                    </span>
                    <span className="text-gray-500 text-xs">
                      Match: {data.matchThreshold || 70}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Frequency: {frequencyLabels[data.frequency] || "Daily"}
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between mt-10">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleLaunch}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Launching...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Start Hunt
            </>
          )}
        </button>
      </div>
    </div>
  );
}

```
