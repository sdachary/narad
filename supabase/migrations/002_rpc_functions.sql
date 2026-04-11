-- RPC function for vector similarity search
-- Run this in Supabase SQL Editor after the main schema

-- Function to match brain documents using vector similarity
CREATE OR REPLACE FUNCTION match_brain_documents(
  query_embedding vector(1536),
  match_project text DEFAULT NULL,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  project text,
  title text,
  content text,
  source text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bd.id,
    bd.project,
    bd.title,
    bd.content,
    bd.source,
    bd.metadata,
    1 - (bd.embedding <=> query_embedding) AS similarity
  FROM brain_documents bd
  WHERE match_project IS NULL OR bd.project = match_project
  ORDER BY bd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to match brain documents by text (keyword search fallback)
CREATE OR REPLACE FUNCTION search_brain_documents(
  search_query text,
  search_project text DEFAULT NULL,
  search_limit int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  project text,
  title text,
  content text,
  source text,
  metadata jsonb
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bd.id,
    bd.project,
    bd.title,
    bd.content,
    bd.source,
    bd.metadata
  FROM brain_documents bd
  WHERE (search_query IS NULL OR bd.title ILIKE '%' || search_query || '%' OR bd.content ILIKE '%' || search_query || '%')
    AND (search_project IS NULL OR bd.project = search_project)
  LIMIT search_limit;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION match_brain_documents TO service_role;
GRANT EXECUTE ON FUNCTION search_brain_documents TO service_role;