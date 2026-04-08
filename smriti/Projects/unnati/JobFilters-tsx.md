---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/jobs/JobFilters.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 261
size: 9537 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# JobFilters.tsx

> UI component using **react, typescript** (261 lines).

**Key exports:** `JobFilters`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/jobs/JobFilters.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 261 |
| **Size** | 9537 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState, useMemo } from "react";
import { X, SlidersHorizontal, Filter } from "lucide-react";

export type JobStatus = "FOUND" | "APPLIED" | "VIEWED" | "INTERVIEW" | "OFFER" | "REJECTED";

export interface JobFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  status: JobStatus[];
  minMatchScore: number;
  maxMatchScore: number;
  companyTypes: string[];
  locations: string[];
  skills: string[];
}

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "FOUND", label: "Found" },
  { value: "APPLIED", label: "Applied" },
  { value: "VIEWED", label: "Viewed" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
];

const COMPANY_TYPES = ["Startup", "Big Tech", "Enterprise", "Consulting", "Fintech", "Healthcare"];

const LOCATIONS = ["Remote", "San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA", "London, UK"];

const SKILLS = ["React", "TypeScript", "Node.js", "Python", "Go", "AWS", "PostgreSQL", "Machine Learning"];

export function JobFilters({ onFilterChange }: JobFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    minMatchScore: 0,
    maxMatchScore: 100,
    companyTypes: [],
    locations: [],
    skills: [],
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.status.length > 0) count++;
    if (filters.minMatchScore > 0 || filters.maxMatchScore < 100) count++;
    if (filters.companyTypes.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.skills.length > 0) count++;
    return count;
  }, [filters]);

  const handleStatusToggle = (status: JobStatus) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    const newFilters = { ...filters, status: newStatus };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCompanyTypeToggle = (type: string) => {
    const newTypes = filters.companyTypes.includes(type)
      ? filters.companyTypes.filter((t) => t !== type)
      : [...filters.companyTypes, type];
    const newFilters = { ...filters, companyTypes: newTypes };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];
    const newFilters = { ...filters, locations: newLocations };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    const newFilters = { ...filters, skills: newSkills };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleMatchScoreChange = (value: number, type: "min" | "max") => {
    const newFilters = {
      ...filters,
      minMatchScore: type === "min" ? value : filters.minMatchScore,
      maxMatchScore: type === "max" ? value : filters.maxMatchScore,
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleClearAll = () => {
    const newFilters: FilterState = {
      status: [],
      minMatchScore: 0,
      maxMatchScore: 100,
      companyTypes: [],
      locations: [],
      skills: [],
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-indigo-600 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-100">
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="mt-4 flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusToggle(option.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    filters.status.includes(option.value)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">
              Match Score: {filters.minMatchScore}% - {filters.maxMatchScore}%
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minMatchScore}
                onChange={(e) => handleMatchScoreChange(parseInt(e.target.value), "min")}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-sm text-gray-500">-</span>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.maxMatchScore}
                onChange={(e) => handleMatchScoreChange(parseInt(e.target.value), "max")}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">Company Type</label>
            <div className="flex flex-wrap gap-2">
              {COMPANY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleCompanyTypeToggle(type)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    filters.companyTypes.includes(type)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">Location</label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationToggle(location)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    filters.locations.includes(location)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2.5">Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                    filters.skills.includes(skill)
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```
