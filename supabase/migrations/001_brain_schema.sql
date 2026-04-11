-- Brain Schema for Narad
-- Run this in Supabase SQL Editor

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Brain documents table (indexed project files)
CREATE TABLE brain_documents (
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
CREATE TABLE brain_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  keywords TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brain sessions (conversation tracking)
CREATE TABLE brain_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(100) UNIQUE NOT NULL,
  project VARCHAR(100),
  message_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_brain_project ON brain_documents(project);
CREATE INDEX idx_brain_source ON brain_documents(source);
CREATE INDEX idx_brain_embeddings ON brain_documents USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_insights_category ON brain_insights(category);
CREATE INDEX idx_sessions_session ON brain_sessions(session_id);

-- Enable RLS
ALTER TABLE brain_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE brain_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow service role full access)
CREATE POLICY "Service role full access" ON brain_documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON brain_insights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON brain_sessions FOR ALL USING (true) WITH CHECK (true);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON brain_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();