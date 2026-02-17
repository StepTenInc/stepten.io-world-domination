-- Tales/Articles Media Migration
-- Run this in Supabase Dashboard > SQL Editor

-- Option A: Add media columns to existing articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS hero_image TEXT,
ADD COLUMN IF NOT EXISTS hero_video TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT,
ADD COLUMN IF NOT EXISTS thumbnail TEXT,
ADD COLUMN IF NOT EXISTS author_type TEXT DEFAULT 'AI',
ADD COLUMN IF NOT EXISTS read_time TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_pillar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS silo TEXT,
ADD COLUMN IF NOT EXISTS stepten_score INTEGER;

-- Option B: Create dedicated tales table (if articles is for something else)
CREATE TABLE IF NOT EXISTS tales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  
  -- Author
  author TEXT NOT NULL,
  author_type TEXT DEFAULT 'AI',
  
  -- Categorization  
  category TEXT,
  tags TEXT[],
  silo TEXT,
  
  -- Dates
  date DATE DEFAULT CURRENT_DATE,
  read_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Flags
  featured BOOLEAN DEFAULT false,
  is_pillar BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft',
  
  -- Media (Supabase Storage URLs)
  hero_image TEXT,
  hero_video TEXT,
  og_image TEXT,
  thumbnail TEXT,
  
  -- Scoring
  stepten_score INTEGER,
  stepten_score_breakdown JSONB
);

-- Index for fast slug lookups
CREATE INDEX IF NOT EXISTS tales_slug_idx ON tales(slug);
CREATE INDEX IF NOT EXISTS tales_featured_idx ON tales(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS tales_silo_idx ON tales(silo);

-- Enable RLS
ALTER TABLE tales ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public tales are viewable by everyone" 
ON tales FOR SELECT 
USING (status = 'published' OR status IS NULL);

-- Service role full access
CREATE POLICY "Service role has full access to tales"
ON tales FOR ALL
USING (auth.role() = 'service_role');

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tales_updated_at
  BEFORE UPDATE ON tales
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
