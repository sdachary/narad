---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/skills.js"
project: "narad"
role: service
language: javascript
frameworks: [docker]
lines: 45
size: 1519 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, docker, javascript, project/narad, service]
---

# skills.js

> Service / API client module using **docker** (45 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/skills.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | docker |
| **Lines** | 45 |
| **Size** | 1519 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * Skill Service - Fetches and parses Superpowers-style MD skills from GitHub.
 * Supports custom skills via GitHub repo configuration.
 */

const SUPERPOWERS_REPO = 'obra/superpowers';

export async function fetchSkill(env, skillName) {
    // Check for custom skills repo in env, fallback to default
    const customRepo = env.SKILLS_REPO || SUPERPOWERS_REPO;
    console.log(`[Skills] Fetching from GitHub: ${customRepo}/${skillName}`);
    
    const GITHUB_TOKEN = env.GITHUB_TOKEN || env.SMRITI_SYNC_TOKEN;
    const url = `https://api.github.com/repos/${customRepo}/contents/skills/${skillName}.md`;
    
    const response = await fetch(url, {
        headers: {
            'Authorization': GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
            'Accept': 'application/vnd.github.v3.raw',
            'User-Agent': 'Narad-Neural-Kernel'
        }
    });
    
    if (!response.ok) throw new Error(`Skill ${skillName} not found`);
    
    const content = await response.text();
    return parseSkill(content);
}

function parseSkill(markdown) {
    // Simple YAML frontmatter parser
    const match = markdown.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
    if (!match) return { content: markdown };
    
    const yaml = match[1];
    const content = match[2];
    
    const metadata = {};
    yaml.split('\n').forEach(line => {
        const [key, ...value] = line.split(':');
        if (key && value) metadata[key.trim()] = value.join(':').trim();
    });
    
    return { metadata, content };
}

```
