/**
 * Skill Service - Fetches and parses Superpowers-style MD skills.
 * Supports local OpenCode skills and GitHub fallback.
 */

import { readFileSync, existsSync } from 'fs';

const SUPERPOWERS_REPO = 'obra/superpowers';
const LOCAL_SKILLS_PATH = '/home/deepak/Work/.skills';

export async function fetchSkill(env, skillName) {
    // 1. Check local OpenCode skills first
    const localPath = `${LOCAL_SKILLS_PATH}/${skillName}/SKILL.md`;
    if (existsSync(localPath)) {
        const content = readFileSync(localPath, 'utf-8');
        console.log(`[Skills] Loaded local skill: ${skillName}`);
        return parseSkill(content);
    }
    
    // 2. Fall back to GitHub (obra/superpowers)
    console.log(`[Skills] Fetching from GitHub: ${skillName}`);
    const GITHUB_TOKEN = env.GITHUB_TOKEN || env.SMRITI_SYNC_TOKEN;
    const url = `https://api.github.com/repos/${SUPERPOWERS_REPO}/contents/skills/${skillName}.md`;
    
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
