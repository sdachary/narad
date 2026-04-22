// narad/pages/routes/management.js
import { supabaseQuery, supabaseInsert, supabaseUpdate, supabaseDelete } from '../services/supabase-client.js';

export function setupManagementRoutes(app) {
  // PORTFOLIO CRUD
  app.get('/api/management/investments', async (c) => {
    try {
      const data = await supabaseQuery(c.env, 'investments', '?order=name.asc');
      return c.json(data);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/management/investments', async (c) => {
    try {
      const body = await c.req.json();
      const data = await supabaseInsert(c.env, 'investments', body);
      return c.json(data[0]);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.patch('/api/management/investments/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const data = await supabaseUpdate(c.env, 'investments', id, body);
      return c.json(data[0]);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.delete('/api/management/investments/:id', async (c) => {
    try {
      const id = c.req.param('id');
      await supabaseDelete(c.env, 'investments', id);
      return c.json({ success: true });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // FINANCE CRUD (Multiple tables)
  const FINANCE_TABLES = ['bank_accounts', 'credit_cards', 'loans', 'wallets'];

  app.get('/api/management/accounts', async (c) => {
    try {
      const results = await Promise.all(FINANCE_TABLES.map(async (table) => {
        const items = await supabaseQuery(c.env, table);
        return items.map(item => ({ ...item, _table: table }));
      }));
      return c.json(results.flat());
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/management/accounts/:table', async (c) => {
    try {
      const table = c.req.param('table');
      const body = await c.req.json();
      const data = await supabaseInsert(c.env, table, body);
      return c.json(data[0]);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.patch('/api/management/accounts/:table/:id', async (c) => {
    try {
      const { table, id } = c.req.param();
      const body = await c.req.json();
      const data = await supabaseUpdate(c.env, table, id, body);
      return c.json(data[0]);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.delete('/api/management/accounts/:table/:id', async (c) => {
    try {
      const { table, id } = c.req.param();
      await supabaseDelete(c.env, table, id);
      return c.json({ success: true });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  // EXPENSES CRUD
  app.get('/api/management/expenses', async (c) => {
    try {
      const data = await supabaseQuery(c.env, 'expenses');
      return c.json(data);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.post('/api/management/expenses', async (c) => {
    try {
      const body = await c.req.json();
      const data = await supabaseInsert(c.env, 'expenses', body);
      return c.json(data[0]);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.patch('/api/management/expenses/:id', async (c) => {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const data = await supabaseUpdate(c.env, 'expenses', id, body);
      return c.json(data[0]);
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });

  app.delete('/api/management/expenses/:id', async (c) => {
    try {
      const id = c.req.param('id');
      await supabaseDelete(c.env, 'expenses', id);
      return c.json({ success: true });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });
}
