// narad/pages/services/supabase-client.js

const SUPABASE_URL = env.SUPABASE_URL || 'https://facurlopyzmmrjnllsnd.supabase.co';

export async function getSupabaseHeaders(env) {
  const key = env.SUPABASE_SERVICE_KEY || '';
  return {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`,
  };
}

export async function supabaseQuery(env, table, queryParams = '') {
  const headers = await getSupabaseHeaders(env);
  const url = `${SUPABASE_URL}/rest/v1/${table}${queryParams}`;
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase query failed: ${response.status} - ${error}`);
  }
  return await response.json();
}

export async function supabaseInsert(env, table, data) {
  const headers = await getSupabaseHeaders(env);
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase insert failed: ${response.status} - ${error}`);
  }
  return await response.json();
}

export async function supabaseUpdate(env, table, id, data) {
  const headers = await getSupabaseHeaders(env);
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase update failed: ${response.status} - ${error}`);
  }
  return await response.json();
}

export async function supabaseDelete(env, table, id) {
  const headers = await getSupabaseHeaders(env);
  const url = `${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase delete failed: ${response.status} - ${error}`);
  }
  return true;
}
