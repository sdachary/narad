-- Migration 004: Add vector support to existing public schema tables
-- Use this if you CANNOT drop existing tables
-- This adds vector column and HNSW index to tables already in public schema

-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================================================
-- Option A: Use vector(1536) for OpenAI ada-002 embeddings
-- Uncomment the lines below and comment out Option B
-- =============================================================================

-- Add embedding column to brain_documents
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brain_documents' AND column_name = 'embedding') THEN
    ALTER TABLE brain_documents ADD COLUMN embedding vector(1536);
  END IF;
END $$;

-- Add embedding column to brain_insights  
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'brain_insights' AND column_name = 'embedding') THEN
    ALTER TABLE brain_insights ADD COLUMN embedding vector(1536);
  END IF;
END $$;

-- =============================================================================
-- Option B: Use vector(384) for bge-small embeddings
-- Uncomment below and comment out Option A if using bge-small
-- =============================================================================
-- ALTER TABLE brain_documents ADD COLUMN IF NOT EXISTS embedding vector(384);
-- ALTER TABLE brain_insights ADD COLUMN IF NOT EXISTS embedding vector(384);

-- =============================================================================
-- Create HNSW indexes for vector search
-- =============================================================================

-- Drop existing index if exists and recreate
DROP INDEX IF EXISTS idx_brain_documents_embeddings;
CREATE INDEX idx_brain_documents_embeddings 
ON brain_documents USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

DROP INDEX IF EXISTS idx_brain_insights_embeddings;
CREATE INDEX idx_brain_insights_embeddings 
ON brain_insights USING hnsw (embedding vector_cosine_ops) 
WITH (m = 16, ef_construction = 64);

-- =============================================================================
-- RPC Functions for vector search (in public schema)
-- =============================================================================

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

-- Function to match brain insights using vector similarity
CREATE OR REPLACE FUNCTION match_brain_insights(
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
  FROM brain_insights bi
  WHERE match_category IS NULL OR bi.category = match_category
  ORDER BY bi.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Keyword search fallback
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
GRANT EXECUTE ON FUNCTION match_brain_insights TO service_role;
GRANT EXECUTE ON FUNCTION search_brain_documents TO service_role;