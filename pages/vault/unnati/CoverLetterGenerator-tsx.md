---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/ai/CoverLetterGenerator.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 231
size: 8020 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# CoverLetterGenerator.tsx

> UI component using **react, typescript** (231 lines).

**Key exports:** `CoverLetterGenerator`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/ai/CoverLetterGenerator.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 231 |
| **Size** | 8020 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";

interface CoverLetterFormData {
  jobTitle: string;
  companyName: string;
  tone: "professional" | "casual" | "enthusiastic";
  length: "short" | "medium" | "long";
  focusAreas: string[];
}

const FOCUS_AREAS = [
  "Skills match",
  "Work experience",
  "Achievements",
  "Company alignment",
  "Career goals",
];

export function CoverLetterGenerator() {
  const [formData, setFormData] = useState<CoverLetterFormData>({
    jobTitle: "",
    companyName: "",
    tone: "professional",
    length: "medium",
    focusAreas: ["Skills match", "Work experience"],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();
      setResult(data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${formData.companyName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFocusArea = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter((a) => a !== area)
        : [...prev.focusAreas, area],
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Cover Letter Generator
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Google"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {(["professional", "casual", "enthusiastic"] as const).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, tone }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    formData.tone === tone
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <div className="flex flex-wrap gap-2">
              {(["short", "medium", "long"] as const).map((length) => (
                <button
                  key={length}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, length }))}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                    formData.length === length
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleFocusArea(area)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.focusAreas.includes(area)
                      ? "bg-blue-100 text-blue-700 border border-blue-300"
                      : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Generated Cover Letter</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <p className="whitespace-pre-wrap text-sm text-gray-800">{result}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```
