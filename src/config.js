/**
 * Config
 *
 * Single source of truth for all configuration values.
 * Reads from environment variables. Fails fast on missing required vars.
 * No config file parsing here — env vars are the contract.
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function required(key) {
  const val = process.env[key];
  if (!val || val.startsWith('REPLACE_ME') || val.startsWith('gsk_REPLACE')) {
    throw new Error(`Config: required env var "${key}" is missing or not filled in. Check your .env file.`);
  }
  return val;
}

function optional(key, defaultValue = '') {
  return process.env[key] || defaultValue;
}

export function loadConfig() {
  // ── Required ──────────────────────────────────────────────────────
  const GROQ_API_KEY        = required('GROQ_API_KEY');

  // ── Optional ──────────────────────────────────────────────────────
  const OPENROUTER_API_KEY  = optional('OPENROUTER_API_KEY');
  const BRAVE_API_KEY       = optional('BRAVE_API_KEY');
  const LOG_LEVEL           = optional('LOG_LEVEL', 'info');

  // ── Derived paths ─────────────────────────────────────────────────
  const HOME         = process.env.HOME || '/home/ubuntu';
  const NARAD_DIR    = optional('NARAD_DIR', path.join(HOME, 'narad'));
  const MEMORY_DB    = optional('MEMORY_DB', path.join(HOME, '.narad', 'memory.db'));
  const KNOWLEDGE_DIR = optional('KNOWLEDGE_DIR', path.join(NARAD_DIR, 'knowledge'));

  // ── AGI Worker URL ────────────────────────────────────────────────
  // The AGI worker lives at narad-7hc.pages.dev — Cloudflare Pages project
  // that handles Groq inference and acts as the brain.
  const AGI_WORKER_URL = optional('AGI_WORKER_URL', 'https://narad-7hc.pages.dev');

  // ── Load cron jobs from nullclaw config file (optional) ───────────
  // We read cron definitions from config.example.json as a source of truth.
  // At runtime, operators can override by setting CRON_CONFIG_PATH.
  let cronJobs = [];
  const cronConfigPath = optional('CRON_CONFIG_PATH', path.join(NARAD_DIR, 'config', 'config.example.json'));
  if (existsSync(cronConfigPath)) {
    try {
      const raw = JSON.parse(readFileSync(cronConfigPath, 'utf-8'));
      cronJobs = raw.cron || [];
    } catch (err) {
      console.error(`Config: failed to parse cron config at ${cronConfigPath}: ${err.message}`);
    }
  }

  return Object.freeze({
    agi: {
      workerUrl:  AGI_WORKER_URL,
      timeoutMs:  45_000,
    },
    memory: {
      dbPath:      MEMORY_DB,
      knowledgeDir: KNOWLEDGE_DIR,
    },
    log: {
      level: LOG_LEVEL,
    },
    cron: {
      jobs:          cronJobs,
      // No longer using Telegram chat ID for cron since Telegram integration removed
      operatorChatId: 'web-interface', // Default value for web interface
    },
    // Passed to AGI worker for model selection
    models: {
      groqApiKey:       GROQ_API_KEY,
      openrouterApiKey: OPENROUTER_API_KEY,
      braveApiKey:      BRAVE_API_KEY,
    },
  });
}
