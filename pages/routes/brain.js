import { checkRateLimit, validateCSRF } from '../services/security.js';
import { getStore } from '../services/memory.js';
import { initializeVaultBrain, getBrainStats, queryBrain, searchVaultFiles, getAllInsights, formatBrainStatus, addInsight, learnFromConversation } from '../services/vault-brain.js';

export function setupBrainRoutes(app) {
  app.get('/api/brain/stats', async (c) => {
    try {
      const stats = await getBrainStats(c.env);
      const statusText = await formatBrainStatus(stats);
      
      return c.json({
        text: statusText,
        stats,
        commands: [
          '/brain - Show brain status',
          '/brain search <query> - Search vault files',
          '/brain insights - Show learned insights',
          '/brain learn <category> <content> - Add new insight'
        ]
      });
    } catch (e) {
      return c.json({ error: e.message }, 500);
    }
  });
  
  app.get('/api/brain/search', async (c) => {
    try {
      const query = c.req.query('q') || c.req.query('query') || '';
      const project = c.req.query('project');
      const limit = parseInt(c.req.query('limit') || 10);
      
      if (!query) {
        return c.json({ 
          error: 'Query required. Use ?q=search+term',
          example: '/api/brain/search?q=telegram+bot'
        }, 400);
      }
      
      const results = await searchVaultFiles(c.env, query, { project, limit });
      
      return c.json({
        query,
        ...results
      });
    } catch (e) {
      return c.json({ error: e.message }, 500);
    }
  });
  
  app.get('/api/brain/insights', async (c) => {
    try {
      const limit = parseInt(c.req.query('limit') || 20);
      const category = c.req.query('category');
      
      const insights = await getAllInsights(c.env, { category, limit });
      
      return c.json(insights);
    } catch (e) {
      return c.json({ error: e.message }, 500);
    }
  });
  
  app.post('/api/brain/learn', async (c) => {
    try {
      const body = await c.req.json();
      const { title, content, category, keywords } = body;
      
      if (!content) {
        return c.json({ error: 'content is required' }, 400);
      }
      
      const result = await addInsight(c.env, {
        title: title || content.slice(0, 100),
        content,
        category: category || 'manual',
        keywords: keywords || []
      });
      
      return c.json({ 
        success: true, 
        message: 'Insight added to brain',
        ...result 
      });
    } catch (e) {
      return c.json({ error: e.message }, 500);
    }
  });
  
  app.post('/api/brain/forget', async (c) => {
    try {
      const body = await c.req.json();
      const { category, olderThanDays } = body;
      
      return c.json({ 
        warning: 'Forget functionality not yet implemented',
        body: { category, olderThanDays }
      });
    } catch (e) {
      return c.json({ error: e.message }, 500);
    }
  });
}

export function handleBrainCommand(env, args) {
  const command = args[0]?.toLowerCase();
  const rest = args.slice(1).join(' ');
  
  switch (command) {
    case 'stats':
    case 'status':
      return getBrainStats(env).then(formatBrainStatus);
    
    case 'search':
    case 'find':
    case 'query':
      return searchVaultFiles(env, rest).then(r => {
        if (r.results.length === 0) {
          return `No results for "${r.query}"`;
        }
        return r.results.map(res => 
          `• ${res.title}\n  ${res.excerpt}\n  Score: ${res.score.toFixed(2)}`
        ).join('\n\n');
      });
    
    case 'insights':
    case 'learned':
      return getAllInsights(env, { limit: 10 }).then(r => {
        if (r.insights.length === 0) {
          return 'No insights learned yet. Narad learns from conversations with important keywords.';
        }
        return r.insights.map(i => 
          `• ${i.title}\n  Category: ${i.category}`
        ).join('\n\n');
      });
    
    case 'learn':
      return addInsight(env, {
        title: rest.slice(0, 100),
        content: rest,
        category: 'manual',
        keywords: []
      }).then(() => `Learned: ${rest.slice(0, 100)}`);
    
    case 'forget':
      return 'Forget functionality coming soon.';
    
    default:
      return 'Brain Commands:\n  /brain - Show status\n  /brain search <query> - Search\n  /brain insights - Learned items\n  /brain learn <content> - Add insight';
  }
}