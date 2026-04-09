---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/STAREditor-tsx-md.md"
project: "narad"
role: service
language: markdown
frameworks: [react, typescript]
lines: 316
size: 9449 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, react, service, typescript]
---

# STAREditor-tsx-md.md

> Service / API client module using **react, typescript** (316 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/STAREditor-tsx-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 316 |
| **Size** | 9449 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/STAREditor-tsx.md"
project: "narad"
role: service
language: markdown
frameworks: [react, typescript]
lines: 278
size: 8652 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, react, service, typescript]
---

# STAREditor-tsx.md

> Service / API client module using **react, typescript** (278 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/STAREditor-tsx.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | react, typescript |
| **Lines** | 278 |
| **Size** | 8652 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/components/interview/STAREditor.tsx"
project: "unnati"
role: service
language: tsx
frameworks: [react, typescript]
lines: 238
size: 7846 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [code, project/unnati, react, service, tsx, typescript]
---

# STAREditor.tsx

> Service / API client module using **react, typescript** (238 lines).

**Key exports:** `STAREditor`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/components/interview/STAREditor.tsx` |
| **Role** | service |
| **Language** | tsx |
| **Frameworks** | react, typescript |
| **Lines** | 238 |
| **Size** | 7846 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```tsx
"use client";

import { useState, useEffect } from "react";

interface STARStory {
  id?: string;
  userId?: string;
  category: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
}

interface STAREditorProps {
  story?: STARStory;
  onSave: (story: STARStory) => void;
}

const CATEGORIES = [
  "Leadership",
  "Teamwork",
  "Problem Solving",
  "Conflict Resolution",
  "Innovation",
  "Customer Service",
  "Time Management",
  "Adaptability",
];

export function STAREditor({ story, onSave }: STAREditorProps) {
  const [category, setCategory] = useState(story?.category || "");
  const [situation, setSituation] = useState(story?.situation || "");
  const [task, setTask] = useState(story?.task || "");
  const [action, setAction] = useState(story?.action || "");
  const [result, setResult] = useState(story?.result || "");
  const [tags, setTags] = useState<string[]>(story?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (story) {
      setCategory(story.category);
      setSituation(story.situation);
      setTask(story.task);
      setAction(story.action);
      setResult(story.result);
      setTags(story.tags);
    }
  }, [story]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSave({
        ...(story?.id && { id: story.id }),
        ...(story?.userId && { userId: story.userId }),
        category,
        situation,
        task,
        action,
        result,
        tags,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isValid = category && situation && task && action && result;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Situation <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Describe the context and background of the situation.
        </p>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Where were you? What was the context?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Task <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          What was your specific responsibility or goal?
        </p>
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What were you responsible for?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Action <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          What specific steps did you take to address the situation?
        </p>
        <textarea
          value={action}
          onChange={(e) => setAction(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What did you do? How did you do it?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Result <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          What was the outcome? Include metrics if possible.
        </p>
        <textarea
          value={result}
          onChange={(e) => setResult(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What was the result? What did you learn?"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-700"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1.5 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a tag (press Enter)"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Add
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || isSaving}
        className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? "Saving..." : story?.id ? "Update Story" : "Save Story"}
      </button>
    </form>
  );
}

```

```

```
