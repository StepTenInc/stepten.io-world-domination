-- Create articles table for SEO Engine
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Create enum types
CREATE TYPE article_status AS ENUM ('draft', 'published', 'archived', 'scheduled');
CREATE TYPE article_type AS ENUM ('pillar', 'silo', 'supporting');

-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ,

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,

  -- SEO & Classification
  main_keyword TEXT,
  status article_status NOT NULL DEFAULT 'draft',
  article_type article_type NOT NULL DEFAULT 'supporting',
  silo TEXT,
  depth INTEGER NOT NULL DEFAULT 2,
  is_pillar BOOLEAN NOT NULL DEFAULT false,

  -- Metrics
  word_count INTEGER NOT NULL DEFAULT 0,
  read_time TEXT,
  seo_score INTEGER CHECK (seo_score >= 0 AND seo_score <= 100),
  human_score INTEGER CHECK (human_score >= 0 AND human_score <= 100),

  -- Media (stored as base64 or URLs)
  hero_image TEXT,
  hero_video TEXT,

  -- Metadata
  meta_title TEXT,
  meta_description TEXT,
  author_name TEXT DEFAULT 'Stephen Ten',
  author_avatar TEXT DEFAULT '/images/stepten-logo.png',

  -- URLs
  url TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS articles_status_idx ON public.articles(status);
CREATE INDEX IF NOT EXISTS articles_article_type_idx ON public.articles(article_type);
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS articles_published_at_idx ON public.articles(published_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Allow public read access to published articles
CREATE POLICY "Public can view published articles"
  ON public.articles
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users to do anything (for admin panel)
-- Note: In production, you'd want more granular policies
CREATE POLICY "Authenticated users can do anything"
  ON public.articles
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Allow service role full access (for API routes)
CREATE POLICY "Service role has full access"
  ON public.articles
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Grant permissions
GRANT ALL ON public.articles TO authenticated;
GRANT SELECT ON public.articles TO anon;

-- Comments for documentation
COMMENT ON TABLE public.articles IS 'SEO Engine articles - stores all published and draft articles';
COMMENT ON COLUMN public.articles.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN public.articles.article_type IS 'pillar = cornerstone, silo = hub, supporting = standard article';
COMMENT ON COLUMN public.articles.depth IS '0 = pillar, 1 = silo, 2+ = supporting';
COMMENT ON COLUMN public.articles.hero_image IS 'Base64 data URL or public URL';
