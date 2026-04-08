---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/ai/MatchAnalysis.tsx"
project: "unnati"
role: component
language: tsx
frameworks: [react, typescript]
lines: 254
size: 9411 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, component, project/unnati, react, tsx, typescript]
---

# MatchAnalysis.tsx

> UI component using **react, typescript** (254 lines).

**Key exports:** `MatchAnalysis`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/ai/MatchAnalysis.tsx` |
| **Role** | component |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 254 |
| **Size** | 9411 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState } from "react";

interface SkillMatch {
  name: string;
  matched: boolean;
  importance: "high" | "medium" | "low";
}

interface MatchAnalysisProps {
  jobTitle: string;
  companyName: string;
  resumeId?: string;
}

export function MatchAnalysis({ jobTitle, companyName, resumeId }: MatchAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [analysis, setAnalysis] = useState<{
    score: number;
    skills: SkillMatch[];
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  } | null>(null);

  const runAnalysis = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai/match-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, companyName, resumeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze match");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Match Analysis
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Analyze your resume match for {jobTitle} at {companyName}
        </p>

        {!analysis && (
          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Analyzing..." : "Analyze Match"}
          </button>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${analysis.score * 3.52} 352`}
                    className={getScoreColor(analysis.score)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Skills Breakdown</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      skill.matched
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {skill.matched && (
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {skill.name}
                    <span
                      className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] ${getImportanceColor(
                        skill.importance
                      )}`}
                    >
                      {skill.importance}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Strengths</h3>
                <ul className="space-y-1.5">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Gaps</h3>
                <ul className="space-y-1.5">
                  {analysis.gaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {analysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendations.map((rec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {rec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Re-analyzing..." : "Re-analyze"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

```
