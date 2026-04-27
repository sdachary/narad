const DEFAULT_SUPABASE_URL = 'https://facurlopyzmmrjnllsnd.supabase.co';

function parseTableName(table) {
  if (table.includes('.')) {
    const [schema, tableName] = table.split('.');
    return { schema, table: tableName };
  }
  return { schema: 'public', table };
}

function getUrl(env, table, queryParams = '') {
  const baseUrl = env?.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const { table: tableName } = parseTableName(table);
  return `${baseUrl}/rest/v1/${tableName}${queryParams}`;
}

export async function getSupabaseHeaders(env, schema = 'public') {
  const key = env.SUPABASE_SERVICE_KEY || '';
  const headers = {
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`,
  };
  
  if (schema && schema !== 'public') {
    headers['Accept-Profile'] = schema;
    headers['Content-Profile'] = schema;
  }
  
  return headers;
}

export async function supabaseQuery(env, table, queryParams = '') {
  const { schema, table: tableName } = parseTableName(table);
  const headers = await getSupabaseHeaders(env, schema);
  const url = getUrl(env, table, queryParams);
  
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Supabase query failed: ${response.status} - ${error}`);
  }
  return await response.json();
}

export async function supabaseInsert(env, table, data) {
  const { schema, table: tableName } = parseTableName(table);
  const headers = await getSupabaseHeaders(env, schema);
  const url = getUrl(env, table);
  
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
  const { schema, table: tableName } = parseTableName(table);
  const headers = await getSupabaseHeaders(env, schema);
  const url = getUrl(env, table, `?id=eq.${id}`);
  
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
  const { schema, table: tableName } = parseTableName(table);
  const headers = await getSupabaseHeaders(env, schema);
  const url = getUrl(env, table, `?id=eq.${id}`);
  
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

