-- Migration: Internal Linking Engine Tables
-- Description: Creates tables for article embeddings and internal linking analysis
-- Date: 2026-01-20

-- Enable pgvector extension for embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- Create published_articles table
-- Stores all published articles that can be linked to
CREATE TABLE IF NOT EXISTS published_articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  focus_keyword TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_published_articles_status ON published_articles(status);
CREATE INDEX IF NOT EXISTS idx_published_articles_created_at ON published_articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_articles_slug ON published_articles(slug);

-- Create article_embeddings table
-- Caches OpenAI embeddings for semantic similarity analysis
CREATE TABLE IF NOT EXISTS article_embeddings (
  article_id TEXT PRIMARY KEY,
  embedding VECTOR(1536), -- text-embedding-3-small produces 1536-dimensional vectors
  content_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (article_id) REFERENCES published_articles(id) ON DELETE CASCADE
);

-- Create vector similarity index for fast nearest neighbor search
-- Using IVFFlat index with cosine distance (best for text embeddings)
CREATE INDEX IF NOT EXISTS idx_article_embeddings_vector ON article_embeddings
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create internal_link_suggestions table
-- Stores all link suggestions made by the engine
CREATE TABLE IF NOT EXISTS internal_link_suggestions (
  id TEXT PRIMARY KEY,
  source_article_id TEXT NOT NULL,
  target_article_id TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  relevance_score INTEGER NOT NULL CHECK (relevance_score >= 0 AND relevance_score <= 100),
  semantic_similarity DECIMAL(5,4) NOT NULL CHECK (semantic_similarity >= 0 AND semantic_similarity <= 1),
  paragraph_index INTEGER NOT NULL,
  sentence_index INTEGER NOT NULL,
  position INTEGER NOT NULL,
  context TEXT,
  reasoning TEXT,
  bidirectional BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (source_article_id) REFERENCES published_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (target_article_id) REFERENCES published_articles(id) ON DELETE CASCADE
);

-- Create indexes for link suggestions
CREATE INDEX IF NOT EXISTS idx_internal_links_source ON internal_link_suggestions(source_article_id);
CREATE INDEX IF NOT EXISTS idx_internal_links_target ON internal_link_suggestions(target_article_id);
CREATE INDEX IF NOT EXISTS idx_internal_links_status ON internal_link_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_internal_links_relevance ON internal_link_suggestions(relevance_score DESC);

-- Create internal_links_applied table
-- Tracks which suggestions have been actually applied to articles
CREATE TABLE IF NOT EXISTS internal_links_applied (
  id TEXT PRIMARY KEY,
  suggestion_id TEXT NOT NULL,
  source_article_id TEXT NOT NULL,
  target_article_id TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (suggestion_id) REFERENCES internal_link_suggestions(id) ON DELETE CASCADE,
  FOREIGN KEY (source_article_id) REFERENCES published_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (target_article_id) REFERENCES published_articles(id) ON DELETE CASCADE
);

-- Create index for applied links
CREATE INDEX IF NOT EXISTS idx_applied_links_source ON internal_links_applied(source_article_id);
CREATE INDEX IF NOT EXISTS idx_applied_links_target ON internal_links_applied(target_article_id);

-- Create function to find similar articles using cosine similarity
-- This function can be called directly from the application
CREATE OR REPLACE FUNCTION find_similar_articles(
  target_embedding VECTOR(1536),
  similarity_threshold FLOAT DEFAULT 0.3,
  max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
  article_id TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.article_id,
    1 - (ae.embedding <=> target_embedding) AS similarity
  FROM article_embeddings ae
  WHERE 1 - (ae.embedding <=> target_embedding) >= similarity_threshold
  ORDER BY ae.embedding <=> target_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Create function to get embedding with fallback
-- Returns cached embedding or null if not found
CREATE OR REPLACE FUNCTION get_cached_embedding(p_article_id TEXT)
RETURNS VECTOR(1536) AS $$
DECLARE
  cached_embedding VECTOR(1536);
BEGIN
  SELECT embedding INTO cached_embedding
  FROM article_embeddings
  WHERE article_id = p_article_id;

  RETURN cached_embedding;
END;
$$ LANGUAGE plpgsql;

-- Create function to update embedding cache
-- Upserts embedding for an article
CREATE OR REPLACE FUNCTION cache_embedding(
  p_article_id TEXT,
  p_embedding VECTOR(1536),
  p_content_preview TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO article_embeddings (article_id, embedding, content_preview, created_at, updated_at)
  VALUES (p_article_id, p_embedding, p_content_preview, NOW(), NOW())
  ON CONFLICT (article_id)
  DO UPDATE SET
    embedding = EXCLUDED.embedding,
    content_preview = EXCLUDED.content_preview,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_published_articles_updated_at ON published_articles;
CREATE TRIGGER update_published_articles_updated_at
  BEFORE UPDATE ON published_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_article_embeddings_updated_at ON article_embeddings;
CREATE TRIGGER update_article_embeddings_updated_at
  BEFORE UPDATE ON article_embeddings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_internal_link_suggestions_updated_at ON internal_link_suggestions;
CREATE TRIGGER update_internal_link_suggestions_updated_at
  BEFORE UPDATE ON internal_link_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for link analytics
CREATE OR REPLACE VIEW internal_linking_analytics AS
SELECT
  pa.id,
  pa.title,
  pa.slug,
  COUNT(DISTINCT ils_outbound.id) as outbound_links_suggested,
  COUNT(DISTINCT ils_inbound.id) as inbound_links_suggested,
  COUNT(DISTINCT ila_outbound.id) as outbound_links_applied,
  COUNT(DISTINCT ila_inbound.id) as inbound_links_applied,
  AVG(ils_outbound.relevance_score) as avg_outbound_relevance,
  AVG(ils_inbound.relevance_score) as avg_inbound_relevance
FROM published_articles pa
LEFT JOIN internal_link_suggestions ils_outbound ON pa.id = ils_outbound.source_article_id
LEFT JOIN internal_link_suggestions ils_inbound ON pa.id = ils_inbound.target_article_id
LEFT JOIN internal_links_applied ila_outbound ON pa.id = ila_outbound.source_article_id
LEFT JOIN internal_links_applied ila_inbound ON pa.id = ila_inbound.target_article_id
GROUP BY pa.id, pa.title, pa.slug;

-- Create view for orphaned content detection
CREATE OR REPLACE VIEW orphaned_articles AS
SELECT
  pa.id,
  pa.title,
  pa.slug,
  pa.created_at
FROM published_articles pa
LEFT JOIN internal_links_applied ila_outbound ON pa.id = ila_outbound.source_article_id
LEFT JOIN internal_links_applied ila_inbound ON pa.id = ila_inbound.target_article_id
WHERE pa.status = 'published'
GROUP BY pa.id, pa.title, pa.slug, pa.created_at
HAVING COUNT(ila_outbound.id) = 0 AND COUNT(ila_inbound.id) = 0;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON published_articles TO authenticated;
-- GRANT ALL ON article_embeddings TO authenticated;
-- GRANT ALL ON internal_link_suggestions TO authenticated;
-- GRANT ALL ON internal_links_applied TO authenticated;

-- Add helpful comments
COMMENT ON TABLE published_articles IS 'Stores all published articles available for internal linking';
COMMENT ON TABLE article_embeddings IS 'Caches OpenAI embeddings for semantic similarity analysis';
COMMENT ON TABLE internal_link_suggestions IS 'AI-generated internal link suggestions';
COMMENT ON TABLE internal_links_applied IS 'Tracks which link suggestions have been applied';
COMMENT ON FUNCTION find_similar_articles IS 'Finds semantically similar articles using cosine similarity';
COMMENT ON VIEW internal_linking_analytics IS 'Analytics view showing linking metrics per article';
COMMENT ON VIEW orphaned_articles IS 'Articles with no incoming or outgoing internal links';

-- Insert sample data for testing (optional - comment out in production)
/*
INSERT INTO published_articles (id, slug, title, content, focus_keyword, status) VALUES
('article-1', 'complete-seo-guide', 'Complete SEO Guide for 2026', '<h1>Complete SEO Guide</h1><p>Learn everything about SEO...</p>', 'SEO guide', 'published'),
('article-2', 'keyword-research-tips', 'Advanced Keyword Research Tips', '<h1>Keyword Research</h1><p>Master keyword research...</p>', 'keyword research', 'published'),
('article-3', 'link-building-strategies', 'Effective Link Building Strategies', '<h1>Link Building</h1><p>Build quality backlinks...</p>', 'link building', 'published')
ON CONFLICT (id) DO NOTHING;
*/
