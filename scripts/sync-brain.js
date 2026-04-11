#!/usr/bin/env node
/**
 * Sync Brain - Index your projects to Supabase
 * Run: node scripts/sync-brain.js [--project narad] [--force]
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lpyatghqeqnbcnedregw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECTS_DIR = join(__dirname, '../smriti/Projects');

const PROJECT_EXTENSIONS = ['.md', '.js', '.ts', '.tsx', '.jsx', '.json', '.yaml', '.yml', '.sql', '.sh'];

const PROJECT_KEYWORDS = {
  narad: ['chat', 'ai', 'assistant', 'telegram', 'bot', 'cloudflare', 'gateway', 'rag'],
  vishwakarma: ['cloudflare', 'workers', 'deployment', 'wrangler'],
  chitragupta: ['tracking', 'analytics', 'metrics', 'dashboards'],
  indra: ['keep-alive', 'monitoring', 'workflows'],
  nisha: ['skills', 'orchestration', 'agents'],
  'nisha-saas': ['saas', 'subscription', 'billing'],
  'career-ops': ['resume', 'job', 'application', 'interview'],
  'social-blueprint-ai': ['social', 'twitter', 'automation'],
  unnati: ['job', 'hunt', 'career'],
  kanak: ['inventory', 'ledger', 'billing']
};

function getClient() {
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_KEY environment variable required');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false }
  });
}

async function getFiles(dir, baseDir = dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.name.startsWith('.')) continue;
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const subFiles = await getFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (PROJECT_EXTENSIONS.includes(ext)) {
          files.push({
            path: fullPath,
            relativePath: fullPath.replace(baseDir + '/', ''),
            ext
          });
        }
      }
    }
  } catch (e) {
    console.error(`Error reading ${dir}:`, e.message);
  }
  
  return files;
}

async function readFileContent(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    return content;
  } catch (e) {
    return null;
  }
}

function extractKeywords(text, project) {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'import', 'export', 'const', 'function', 'return', 'async', 'await'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  const wordCount = new Map();
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }
  
  const customKeywords = PROJECT_KEYWORDS[project] || [];
  
  return [...new Set([...customKeywords, ...Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)])];
}

async function indexProject(supabase, project, force = false) {
  const projectDir = join(PROJECTS_DIR, project);
  
  try {
    await stat(projectDir);
  } catch {
    console.log(`Project "${project}" not found, skipping...`);
    return { indexed: 0, skipped: 0 };
  }
  
  console.log(`\n📂 Indexing project: ${project}`);
  
  const files = await getFiles(projectDir);
  console.log(`   Found ${files.length} files`);
  
  let indexed = 0;
  let skipped = 0;
  
  for (const file of files) {
    const content = await readFileContent(file.path);
    
    if (!content || content.length < 50) {
      skipped++;
      continue;
    }
    
    if (!force) {
      const { data: existing } = await supabase
        .from('brain_documents')
        .select('id')
        .eq('source', `vault:${project}:${file.relativePath}`)
        .limit(1);
      
      if (existing?.length > 0) {
        skipped++;
        continue;
      }
    }
    
    const keywords = extractKeywords(content, project);
    
    const { error } = await supabase
      .from('brain_documents')
      .insert({
        project,
        title: file.relativePath,
        content: content.slice(0, 50000),
        source: `vault:${project}:${file.relativePath}`,
        keywords,
        metadata: { path: file.relativePath, type: 'indexed' }
      });
    
    if (error) {
      console.error(`   Error indexing ${file.relativePath}:`, error.message);
    } else {
      indexed++;
    }
    
    if (indexed % 50 === 0) {
      console.log(`   Indexed ${indexed} files...`);
    }
  }
  
  console.log(`   ✅ Indexed: ${indexed}, Skipped: ${skipped}`);
  
  return { indexed, skipped };
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const projectArg = args.find(a => a.startsWith('--project='));
  const project = projectArg ? projectArg.replace('--project=', '') : null;
  
  console.log('🧠 Brain Sync - Index projects to Supabase');
  console.log('='.repeat(40));
  
  if (!SUPABASE_SERVICE_KEY) {
    console.error('\n❌ Error: SUPABASE_SERVICE_KEY not set');
    console.log('   Run: SUPABASE_SERVICE_KEY=your_key node scripts/sync-brain.js');
    process.exit(1);
  }
  
  const supabase = getClient();
  
  const projects = project 
    ? [project]
    : ['narad', 'vishwakarma', 'chitragupta', 'indra', 'nisha', 'nisha-saas', 'career-ops', 'unnati', 'kanak'];
  
  let totalIndexed = 0;
  let totalSkipped = 0;
  
  for (const p of projects) {
    const result = await indexProject(supabase, p, force);
    totalIndexed += result.indexed;
    totalSkipped += result.skipped;
  }
  
  console.log('\n' + '='.repeat(40));
  console.log(`📊 Total: ${totalIndexed} indexed, ${totalSkipped} skipped`);
  console.log('✅ Sync complete!');
}

main().catch(console.error);