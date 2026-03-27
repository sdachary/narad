# Narad Migration Plan: VM-based to Serverless (Cloudflare Workers + Supabase)

## Overview
This document outlines the migration of Narad from a VM-based Node.js application to a serverless architecture using Cloudflare Workers for compute and Supabase for data storage.

## Current Architecture Analysis
- **Compute**: Persistent Node.js process on OCI VM
- **Telegram Interface**: Long-polling (no webhook server required)
- **Data Storage**: 
  - SQLite database (~/.narad/memory.db) for conversation contexts
  - File system (~/narad/knowledge/) for knowledge base
- **Scheduling**: Node-cron for scheduled jobs
- **Dependencies**: 
  - better-sqlite3 for SQLite access
  - node-cron for scheduling
  - Various npm packages for Telegram, HTTP clients, etc.

## Target Architecture
- **Compute**: Cloudflare Workers (serverless JavaScript execution)
- **Telegram Interface**: Webhook-based (Telegram sends HTTP requests to Worker)
- **Data Storage**: 
  - Supabase PostgreSQL for conversation contexts and MAS data
  - Supabase Storage for knowledge base files
- **Scheduling**: Supabase Cron Triggers or Cloudflare Workers Cron Triggers
- **State Management**: Externalized to Supabase (Workers are stateless)

## Migration Strategy
Phased approach to minimize risk and ensure functionality at each step:

### Phase 1: Preparation and Foundation
1. Set up Supabase project
2. Design database schema
3. Create Supabase storage buckets
4. Develop data access layer interfaces
5. Implement Supabase-based memory store
6. Implement Supabase-based knowledge loader

### Phase 2: Core Functionality Migration
1. Replace SQLiteMemoryStore with SupabaseMemoryStore
2. Replace FileKnowledgeLoader with SupabaseKnowledgeLoader
3. Keep VM-based deployment for testing
4. Verify data persistence and retrieval works correctly

### Phase 3: Telegram Interface Adaptation
1. Create webhook handler for Telegram updates
2. Modify TelegramBot to work with webhooks instead of long-polling
3. Update deployment to expose webhook endpoint
4. Test Telegram integration via webhooks

### Phase 4: Serverless Deployment Preparation
1. Adapt code for Cloudflare Workers runtime
2. Handle Workers limitations (no fs access, limited APIs)
3. Implement KV/D1 bindings for Supabase integration
4. Create wrangler.toml configuration

### Phase 5: Scheduling Migration
1. Replace node-cron with Cloudflare Workers Cron Triggers
2. Or implement Supabase Cron Triggers for scheduled jobs
3. Verify scheduled jobs execute correctly

### Phase 6: Full Serverless Deployment
1. Deploy to Cloudflare Workers
2. Configure Telegram webhook
3. Set up Supabase secrets in Cloudflare
4. Monitor and validate production behavior

## Detailed Implementation Plan

### 1. Supabase Setup
```bash
# Create Supabase project
# Run SQL migrations to create tables
```

#### Database Schema
```sql
-- Conversation contexts table
CREATE TABLE conversation_contexts (
  chat_id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge files table (metadata)
CREATE TABLE knowledge_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content_type TEXT,
  size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MAS tables (if needed)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  chat_id TEXT NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add other MAS tables as needed: subtasks, agents, checkpoints, etc.
```

#### Storage Buckets
- `narad-knowledge`: For storing knowledge base files (.md files)
- Optional: `narad-backups` for backups

### 2. Data Access Layer Implementation

#### SupabaseMemoryStore.js
```javascript
import { createClient } from '@supabase/supabase-js';
import { IMemoryStore } from '../../domain/interfaces/index.js';
import { ConversationContext } from '../../domain/entities/ConversationContext.js';

export class SupabaseMemoryStore extends IMemoryStore {
  constructor({ supabaseUrl, supabaseKey, logger }) {
    super();
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SupabaseMemoryStore: supabaseUrl and supabaseKey are required');
    }
    this.logger = logger;
    this.supabase = createClient(supabaseUrl, supabaseKey);
    
    logger.info('SupabaseMemoryStore initialised');
  }

  async load(chatId) {
    const { data, error } = await this.supabase
      .from('conversation_contexts')
      .select('data')
      .eq('chat_id', chatId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      this.logger.error('SupabaseMemoryStore.load: failed to load context', { chatId, error: error.message });
      return null;
    }

    if (!data) return null;

    try {
      const parsed = data.data;
      return new ConversationContext({
        chatId: parsed.chatId,
        userId: parsed.userId,
        history: parsed.history || [],
        platform: parsed.platform || '',
        maxHistory: parsed.maxHistory || 10,
      });
    } catch (err) {
      this.logger.warn('SupabaseMemoryStore.load: failed to parse context', { chatId, error: err.message });
      return null;
    }
  }

  async save(context) {
    const data = {
      chatId: context.chatId,
      userId: context.userId,
      history: context.history,
      platform: context.platform,
      maxHistory: context.maxHistory,
    };

    const { error } = await this.supabase
      .from('conversation_contexts')
      .upsert(
        { chat_id: context.chatId, data, updated_at: new Date() },
        { onConflict: 'chat_id' }
      );

    if (error) {
      this.logger.error('SupabaseMemoryStore.save: failed to save context', { 
        chatId: context.chatId, error: error.message 
      });
      throw error;
    }
  }

  async clear(chatId) {
    const { error } = await this.supabase
      .from('conversation_contexts')
      .delete()
      .eq('chat_id', chatId);

    if (error) {
      this.logger.error('SupabaseMemoryStore.clear: failed to clear context', { 
        chatId, error: error.message 
      });
      throw error;
    }
    
    this.logger.debug('SupabaseMemoryStore.clear', { chatId });
  }
}
```

#### SupabaseKnowledgeLoader.js
```javascript
import { createClient } from '@supabase/supabase-js';
import { IKnowledgeLoader } from '../../domain/interfaces/index.js';

export class SupabaseKnowledgeLoader extends IKnowledgeLoader {
  constructor({ supabaseUrl, supabaseKey, bucketName, logger }) {
    super();
    if (!supabaseUrl || !supabaseKey || !bucketName) {
      throw new Error('SupabaseKnowledgeLoader: supabaseUrl, supabaseKey, and bucketName are required');
    }
    this.logger = logger;
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.bucketName = bucketName;
    
    logger.info('SupabaseKnowledgeLoader initialised', { bucket: bucketName });
  }

  async load() {
    try {
      // List all files in the knowledge bucket
      const { data: files, error: listError } = await this.supabase
        .storage
        .from(this.bucketName)
        .list();

      if (listError) {
        this.logger.error('SupabaseKnowledgeLoader.load: failed to list files', { 
          bucket: this.bucketName, error: listError.message 
        });
        return '';
      }

      // Fetch content of each file
      const knowledgePromises = files
        .filter(file => file.name.endsWith('.md')) // Only load markdown files
        .asyncMap(async (file) => {
          try {
            const { data: fileData, error: fetchError } = await this.supabase
              .storage
              .from(this.bucketName)
              .download(file.name);

            if (fetchError) {
              this.logger.warn('SupabaseKnowledgeLoader.load: failed to fetch file', { 
                fileName: file.name, error: fetchError.message 
              });
              return '';
            }

            // Convert Blob to text
            const text = await fileData.text();
            return `=== ${file.name} ===\n${text}\n\n`;
          } catch (err) {
            this.logger.error('SupabaseKnowledgeLoader.load: error processing file', { 
              fileName: file.name, error: err.message 
            });
            return '';
          }
        });

      const knowledgeParts = await Promise.all(knowledgePromises);
      return knowledgeParts.join('');
    } catch (err) {
      this.logger.error('SupabaseKnowledgeLoader.load: failed to load knowledge', { 
        error: err.message 
      });
      return '';
    }
  }
}

// Helper asyncMap function
Array.prototype.asyncMap = async function(callback) {
  const results = [];
  for (const item of this) {
    results.push(await callback(item));
  }
  return results;
};
```

### 3. Telegram Webhook Adapter

#### WebhookTelegramBot.js
```javascript
export class WebhookTelegramBot {
  /**
   * @param {object} opts
   * @param {string} opts.botToken
   * @param {import('../router/MessageRouter.js').MessageRouter} opts.router
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ botToken, router, logger }) {
    if (!botToken) throw new Error('WebhookTelegramBot: botToken is required');
    this.botToken = botToken;
    this.router = router;
    this.logger = logger;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
    this._running = false;
  }

  /**
   * Process a Telegram webhook request
   * @param {object} req - HTTP request object (Cloudflare Workers Request)
   * @returns {Promise<Response>} - HTTP response
   */
  async handleWebhookRequest(req) {
    try {
      if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
      }

      const update = await req.json();
      await this._processUpdate(update);
      
      // Telegram expects a 200 OK response
      return new Response('OK', { status: 200 });
    } catch (err) {
      this.logger.error('WebhookTelegramBot: webhook processing failed', { 
        error: err.message 
      });
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  /**
   * Process a single Telegram update (shared with polling bot)
   * @param {object} update - The Telegram update object
   * @returns {Promise<void>}
   */
  async _processUpdate(update) {
    // Same implementation as in TelegramBot.js _processUpdate method
    if (!update.message) return;

    const msg = update.message;
    let document = null;

    if (msg.document) {
      const fileId = msg.document.file_id;
      const fileName = msg.document.file_name;
      const mimeType = msg.document.mime_type;
      
      // Fetch file_path from Telegram to allow downloader to work
      const fileInfo = await this._getFile(fileId);
      if (fileInfo) {
        document = {
          fileId,
          fileName,
          mimeType,
          filePath: fileInfo.file_path,
        };
      }
    }

    const raw = {
      messageId: msg.message_id,
      userId: msg.from?.id,
      chatId: msg.chat?.id,
      text: msg.text || msg.caption || '',
      date: new Date(msg.date * 1000),
      source: 'telegram',
      document,
    };

    // Fire-and-forget per message — don't block the caller
    this.router.route(raw).catch(err => {
      this.logger.error('WebhookTelegramBot: router.route threw', { 
        error: err.message, chatId: raw.chatId 
      });
    });
  }

  async _getFile(fileId) {
    try {
      const res = await fetch(`${this.baseUrl}/getFile?file_id=${fileId}`);
      const data = await res.json();
      return data.ok ? data.result : null;
    } catch (err) {
      this.logger.error('WebhookTelegramBot: getFile failed', { fileId, error: err.message });
      return null;
    }
  }

  // For compatibility with existing interface
  start() {
    this._running = true;
    this.logger.info('WebhookTelegramBot: ready to receive webhooks');
  }

  stop() {
    this._running = false;
  }
}
```

### 4. Cloudflare Workers Adaptation

#### wrangler.toml
```toml
name = "narad-serverless"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
# These will be overridden by secrets in production
TELEGRAM_BOT_TOKEN = ""
TELEGRAM_CHAT_ID = ""
GROQ_API_KEY = ""
OPENROUTER_API_KEY = ""
AGI_WORKER_URL = "https://narad.pages.dev"
LOG_LEVEL = "info"

[supabase]
# Supabase connection details (will be set as secrets)
URL = ""
SERVICE_ROLE_KEY = ""

[[kv_namespaces]]
binding = "NARAD_KV"
id = ""

[triggers]
# Cron triggers for scheduled jobs
crons = ["0 8 * * *", "*/30 * * * *", "0 9 * * 1"]  # morning digest, health check, weekly R&D
```

#### src/index.js (Worker entry point)
```javascript
import { TelegramSender } from './infrastructure/telegram/TelegramSender.js';
import { TelegramDownloader } from './infrastructure/telegram/TelegramDownloader.js';
import { ConsoleLogger } from './infrastructure/ConsoleLogger.js';
import { AgiWorkerClient } from './infrastructure/agi_worker/AgiWorkerClient.js';
import { SupabaseMemoryStore } from './infrastructure/memory/SupabaseMemoryStore.js';
import { SupabaseKnowledgeLoader } from './infrastructure/memory/SupabaseKnowledgeLoader.js';
import { CronScheduler } from './infrastructure/scheduler/CronScheduler.js';
import { SystemStats } from './infrastructure/system/SystemStats.js';
import { TaskManager } from './infrastructure/mas/TaskManager.js';
import { SubtaskManager } from './infrastructure/mas/SubtaskManager.js';
import { AgentManager } from './infrastructure/mas/AgentManager.js';
import { GitWorkflowManager } from './infrastructure/mas/GitWorkflowManager.js';
import { HandleUserMessage } from './application/use_cases/HandleUserMessage.js';
import { HandleCronJob } from './application/use_cases/HandleCronJob.js';
import { HandleMASRequest } from './application/use_cases/HandleMASRequest.js';
import { MessageRouter } from './interface/router/MessageRouter.js';
import { WebhookTelegramBot } from './interface/bot/WebhookTelegramBot.js';

// Initialize Supabase client
const initSupabase = () => {
  // In Workers, we'll use the Supabase JS client with service role key
  // For direct SQL queries, we might use HTTP API or a wrapper
  return {
    url: SUPABASE_URL,
    key: SUPABASE_SERVICE_ROLE_KEY
  };
};

export default {
  async fetch(request, env, ctx) {
    // Initialize logger
    const logger = new ConsoleLogger({
      level: env.LOG_LEVEL || 'info',
      service: 'narad-worker'
    });

    try {
      // Initialize infrastructure
      const supabaseConfig = initSupabase();
      
      const memoryStore = new SupabaseMemoryStore({
        supabaseUrl: supabaseConfig.url,
        supabaseKey: supabaseConfig.key,
        logger
      });

      const knowledgeLoader = new SupabaseKnowledgeLoader({
        supabaseUrl: supabaseConfig.url,
        supabaseKey: supabaseConfig.key,
        bucketName: 'narad-knowledge',
        logger
      });

      const agiWorker = new AgiWorkerClient({
        workerUrl: env.AGI_WORKER_URL,
        timeoutMs: 30000,
        logger
      });

      const messageSender = new TelegramSender({
        botToken: env.TELEGRAM_BOT_TOKEN,
        logger
      });

      const downloader = new TelegramDownloader({
        botToken: env.TELEGRAM_BOT_TOKEN,
        logger
      });

      const systemStats = new SystemStats({ logger });

      // MAS Infrastructure
      const taskManager = new TaskManager({
        logger,
        memoryStore, // Reusing existing memory store
      });

      const agentManager = new AgentManager({
        logger,
      });

      const gitWorkflowManager = new GitWorkflowManager({
        logger,
        workDir: '/tmp', // Workers tmp directory
      });

      const subtaskManager = new SubtaskManager({
        logger,
        agiWorker,
        agentManager,
        gitManager: gitWorkflowManager,
      });

      // Use Cases
      const handleUserMessage = new HandleUserMessage({
        agiWorker,
        memoryStore,
        messageSender,
        knowledgeLoader,
        downloader,
        systemStats,
        logger,
      });

      const handleMASRequest = new HandleMASRequest({
        taskManager,
        subtaskManager,
        agentManager,
        gitManager: gitWorkflowManager,
        messageSender,
        logger,
      });

      const handleCronJob = new HandleCronJob({
        agiWorker,
        messageSender,
        knowledgeLoader,
        logger,
        operatorChatId: env.TELEGRAM_CHAT_ID,
      });

      // Interface
      const router = new MessageRouter({
        handleUserMessage,
        messageSender,
        logger,
        allowedChatId: env.TELEGRAM_CHAT_ID,
      });

      const bot = new WebhookTelegramBot({
        botToken: env.TELEGRAM_BOT_TOKEN,
        router,
        logger,
      });

      // Handle webhook requests
      if (request.method === 'POST' && request.url.includes('/telegram-webhook')) {
        await bot.start();
        return bot.handleWebhookRequest(request);
      }

      // Health check endpoint
      if (request.method === 'GET' && request.url.endsWith('/health')) {
        return new Response(JSON.stringify({ status: 'healthy' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }

      // Default response
      return new Response('Narad Serverless Worker', { status: 200 });
    } catch (error) {
      logger.error('Worker fetch error', { error: error.message });
      return new Response('Internal Server Error', { status: 500 });
    }
  },

  // Handle cron triggers
  async scheduled(controller, env, ctx) {
    // Initialize logger
    const logger = new ConsoleLogger({
      level: env.LOG_LEVEL || 'info',
      service: 'narad-cron'
    });

    try {
      // Similar initialization as fetch handler but without Telegram bot
      const supabaseConfig = {
        url: env.SUPABASE_URL,
        key: env.SUPABASE_SERVICE_ROLE_KEY
      };

      const memoryStore = new SupabaseMemoryStore({
        supabaseUrl: supabaseConfig.url,
        supabaseKey: supabaseConfig.key,
        logger
      });

      const knowledgeLoader = new SupabaseKnowledgeLoader({
        supabaseUrl: supabaseConfig.url,
        supabaseKey: supabaseConfig.key,
        bucketName: 'narad-knowledge',
        logger
      });

      const agiWorker = new AgiWorkerClient({
        workerUrl: env.AGI_WORKER_URL,
        timeoutMs: 30000,
        logger
      });

      const messageSender = new TelegramSender({
        botToken: env.TELEGRAM_BOT_TOKEN,
        logger
      });

      const handleCronJob = new HandleCronJob({
        agiWorker,
        messageSender,
        knowledgeLoader,
        logger,
        operatorChatId: env.TELEGRAM_CHAT_ID,
      });

      // Execute cron job based on the scheduled time
      // In a real implementation, we'd need to identify which cron job triggered
      // For simplicity, we'll run all jobs or use metadata from the controller
      await handleCronJob.execute('cron-triggered');
      
      logger.info('Cron job executed successfully');
    } catch (error) {
      logger.error('Scheduled function error', { error: error.message });
    }
  }
};
```

### 5. Migration Steps

#### Phase 1: Preparation
1. [ ] Create Supabase project
2. [ ] Set up database schema
3. [ ] Create storage buckets
4. [ ] Install required dependencies: `@supabase/supabase-js`
5. [ ] Implement SupabaseMemoryStore and SupabaseKnowledgeLoader
6. [ ] Test data access layer with existing VM deployment

#### Phase 2: Core Migration
1. [ ] Replace SqliteMemoryStore with SupabaseMemoryStore in main.js
2. [ ] Replace FileKnowledgeLoader with SupabaseKnowledgeLoader in main.js
3. [ ] Update config to include Supabase credentials
4. [ ] Test with existing VM deployment to ensure data persistence works
5. [ ] Verify knowledge loading from Supabase Storage

#### Phase 3: Telegram Webhook
1. [ ] Implement WebhookTelegramBot
2. [ ] Create webhook endpoint handler
3. [ ] Test webhook locally with ngrok or similar
4. [ ] Update Telegram bot to use webhooks (delete webhook, set new webhook)
5. [ ] Verify Telegram communication works via webhooks

#### Phase 4: Workers Preparation
1. [ ] Adapt code for Cloudflare Workers runtime
2. [ ] Handle Workers-specific limitations (fetch API, no fs access, etc.)
3. [ ] Create wrangler.toml configuration
4. [ ] Test Workers deployment locally with `wrangler dev`

#### Phase 5: Scheduling
1. [ ] Implement cron trigger handler in Workers
2. [ ] Configure cron triggers in wrangler.toml
3. [ ] Test scheduled job execution
4. [ ] Verify all scheduled jobs (morning digest, health check, weekly R&D) work

#### Phase 6: Production Deployment
1. [ ] Deploy to Cloudflare Workers: `wrangler deploy`
2. [ ] Set up secrets in Cloudflare dashboard
3. [ ] Configure Telegram webhook to point to Worker URL
4. [ ] Monitor logs and validate functionality
5. [ ] Decommission VM-based deployment

## Risk Mitigation

### Data Migration
- Existing SQLite data will need to be migrated to Supabase
- Create migration script to copy data from ~/.narad/memory.db to Supabase
- Verify data integrity after migration

### Backward Compatibility
- Keep VM-based deployment running during transition
- Use feature flags to switch between storage implementations
- Monitor both systems in parallel

### Performance
- Workers have cold start times - consider keeping minimum instances if needed
- Supabase query latency - optimize queries and consider caching
- Telegram webhook response time - keep under Telegram's timeout limits

### Limitations and Workarounds
1. **Workers KV vs PostgreSQL**: Use Supabase PostgreSQL directly rather than Workers KV for complex queries
2. **File Access**: Use Supabase Storage instead of local file system
3. **Long-running Tasks**: Workers have execution limits - break long tasks into smaller chunks or use background functions
4. **Cron Precision**: Workers cron triggers may have slight delays - acceptable for this use case

## Estimated Effort
- Phase 1 (Preparation): 2-3 days
- Phase 2 (Core Migration): 3-4 days
- Phase 3 (Telegram Webhook): 2-3 days
- Phase 4 (Workers Preparation): 2-3 days
- Phase 5 (Scheduling): 1-2 days
- Phase 6 (Production Deployment): 1-2 days
- Total: 11-17 days

## Success Criteria
1. All existing Telegram commands work correctly via webhooks
2. Conversation contexts are persisted and retrieved correctly
3. Knowledge base is accessible and up-to-date
4. Scheduled jobs execute at correct times
5. MAS functionality remains intact
6. Performance is acceptable (response times < 2s for Telegram interactions)
7. No data loss during migration