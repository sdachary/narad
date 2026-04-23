-- Migration 003: Narad schema with vector support
-- Drops existing brain_* tables and recreates them in dedicated "narad" schema
-- Run in Supabase SQL Editor

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create dedicated narad schema
CREATE SCHEMA IF NOT EXISTS narad;

-- Drop existing tables if they exist (in any schema)
DROP TABLE IF EXISTS narad.brain_documents CASCADE;
DROP TABLE IF EXISTS narad.brain_insights CASCADE;
DROP TABLE IF EXISTS narad.brain_sessions CASCADE;

-- Drop old public schema tables if they exist (from failed migrations)
DROP TABLE IF EXISTS public.brain_documents CASCADE;
DROP TABLE IF EXISTS public.brain_insights CASCADE;
DROP TABLE IF EXISTS public.brain_sessions CASCADE;

-- Brain documents table (indexed project files) - in narad schema
CREATE TABLE narad.brain_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project VARCHAR(100) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(100),
  keywords TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brain insights (learned from conversations)
CREATE TABLE narad.brain_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  keywords TEXT[] DEFAULT '{}',
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brain sessions (conversation tracking)
CREATE TABLE narad.brain_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) UNIQUE NOT NULL,
  project VARCHAR(100),
  message_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW indexes for vector search
CREATE INDEX idx_brain_documents_embeddings 
ON narad.brain_documents USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

CREATE INDEX idx_brain_insights_embeddings 
ON narad.brain_insights USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- Regular indexes
CREATE INDEX idx_brain_documents_project ON narad.brain_documents(project);
CREATE INDEX idx_brain_documents_source ON narad.brain_documents(source);
CREATE INDEX idx_brain_insights_category ON narad.brain_insights(category);
CREATE INDEX idx_brain_sessions_session ON narad.brain_sessions(session_id);

-- Enable RLS on all tables
ALTER TABLE narad.brain_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE narad.brain_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE narad.brain_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow full access to authenticated users (service role)
CREATE POLICY "Service role full access documents" ON narad.brain_documents 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access insights" ON narad.brain_insights 
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access sessions" ON narad.brain_sessions 
FOR ALL USING (true) WITH CHECK (true);

-- Also allow anon read for public queries (optional - remove if not needed)
CREATE POLICY "Allow anon read documents" ON narad.brain_documents 
FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION narad.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS set_updated_at ON narad.brain_documents;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON narad.brain_documents
  FOR EACH ROW EXECUTE FUNCTION narad.update_updated_at();

-- =============================================================================
-- RPC Functions for vector search in narad schema
-- =============================================================================

-- Function to match brain documents using vector similarity
CREATE OR REPLACE FUNCTION narad.match_documents(
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
  FROM narad.brain_documents bd
  WHERE match_project IS NULL OR bd.project = match_project
  ORDER BY bd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Function to match brain insights using vector similarity
CREATE OR REPLACE FUNCTION narad.match_insights(
  query_embedding vector(1536),
  match_category text DEFAULT NULL,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  category text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    bi.id,
    bi.title,
    bi.content,
    bi.category,
    bi.metadata,
    1 - (bi.embedding <=> query_embedding) AS similarity
  FROM narad.brain_insights bi
  WHERE match_category IS NULL OR bi.category = match_category
  ORDER BY bi.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Keyword search fallback
CREATE OR REPLACE FUNCTION narad.search_documents(
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
  FROM narad.brain_documents bd
  WHERE (search_query IS NULL OR bd.title ILIKE '%' || search_query || '%' OR bd.content ILIKE '%' || search_query || '%')
    AND (search_project IS NULL OR bd.project = search_project)
  LIMIT search_limit;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION narad.match_documents TO service_role;
GRANT EXECUTE ON FUNCTION narad.match_insights TO service_role;
GRANT EXECUTE ON FUNCTION narad.search_documents TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA narad TO service_role;

-- Grant table access
GRANT ALL ON TABLE narad.brain_documents TO service_role;
GRANT ALL ON TABLE narad.brain_insights TO service_role;
GRANT ALL ON TABLE narad.brain_sessions TO service_role;