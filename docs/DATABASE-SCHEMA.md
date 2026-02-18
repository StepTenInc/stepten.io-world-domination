# StepTen.io Database Schema
## The Living Content System

### Overview
Everything connects. Articles recommend articles. Tools link to tales. Internal links flow naturally based on semantic relationships, not manual work.

---

## Core Tables

### 1. `tales` - The Content
```sql
CREATE TABLE tales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  
  -- Author & metadata
  author TEXT NOT NULL, -- stepten, pinky, reina, clark
  author_type TEXT, -- HUMAN, AI, LEGEND
  category TEXT, -- VISION, CODE, CHAOS, HERO, etc.
  
  -- SEO
  stepten_score INTEGER,
  stepten_score_breakdown JSONB,
  
  -- Status
  status TEXT DEFAULT 'draft', -- draft, published, archived
  featured BOOLEAN DEFAULT false,
  is_pillar BOOLEAN DEFAULT false,
  silo TEXT, -- content silo grouping
  
  -- Media
  hero_image TEXT,
  hero_video TEXT,
  
  -- Dates
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. `tale_embeddings` - Semantic Understanding
```sql
CREATE TABLE tale_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tale_id UUID REFERENCES tales(id) ON DELETE CASCADE,
  
  -- The vector (OpenAI ada-002 = 1536 dimensions)
  embedding vector(1536),
  
  -- What was embedded
  embedding_type TEXT, -- 'full', 'summary', 'topics', 'wisdom'
  source_text TEXT, -- The text that was embedded
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast similarity search
CREATE INDEX ON tale_embeddings USING ivfflat (embedding vector_cosine_ops);
```

### 3. `tale_entities` - Extracted Knowledge
```sql
CREATE TABLE tale_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tale_id UUID REFERENCES tales(id) ON DELETE CASCADE,
  
  entity_type TEXT NOT NULL, -- 'topic', 'tool', 'person', 'lesson', 'quote', 'personal_story'
  entity_value TEXT NOT NULL,
  entity_slug TEXT, -- for linking (e.g., 'cursor' links to /tools/cursor)
  
  -- Context
  context TEXT, -- surrounding text where this was mentioned
  sentiment TEXT, -- positive, negative, neutral
  importance INTEGER DEFAULT 1, -- 1-5 scale
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Examples:
-- entity_type: 'tool', entity_value: 'Cursor', entity_slug: 'cursor'
-- entity_type: 'lesson', entity_value: 'Consistency beats talent'
-- entity_type: 'personal_story', entity_value: 'Left Australia 2016'
```

### 4. `tale_relationships` - Semantic Connections
```sql
CREATE TABLE tale_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  source_tale_id UUID REFERENCES tales(id) ON DELETE CASCADE,
  target_tale_id UUID REFERENCES tales(id) ON DELETE CASCADE,
  
  relationship_type TEXT, -- 'similar', 'continuation', 'references', 'contradicts', 'expands'
  similarity_score FLOAT, -- 0-1 cosine similarity
  
  -- Why they're related
  shared_topics TEXT[], -- ['ai-coding', 'cursor', 'learning']
  shared_entities TEXT[],
  
  -- Manual override
  is_manual BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(source_tale_id, target_tale_id)
);
```

### 5. `internal_links` - Link Graph
```sql
CREATE TABLE internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Source (where the link appears)
  source_type TEXT NOT NULL, -- 'tale', 'tool', 'team', 'page'
  source_id UUID,
  source_slug TEXT,
  
  -- Target (where it links to)
  target_type TEXT NOT NULL,
  target_id UUID,
  target_slug TEXT,
  target_url TEXT NOT NULL,
  
  -- Link details
  anchor_text TEXT NOT NULL,
  context TEXT, -- surrounding sentence
  
  -- Auto vs manual
  is_auto_generated BOOLEAN DEFAULT true,
  
  -- Tracking
  click_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for finding all links from/to a page
CREATE INDEX ON internal_links(source_slug);
CREATE INDEX ON internal_links(target_slug);
```

### 6. `outbound_links` - Verified External Links
```sql
CREATE TABLE outbound_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- The link
  url TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  
  -- Categorization
  category TEXT, -- 'tool', 'person', 'resource', 'documentation', 'news'
  tags TEXT[],
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  last_verified_at TIMESTAMPTZ,
  http_status INTEGER,
  
  -- Quality signals
  domain_authority INTEGER, -- Moz DA if we have it
  is_dofollow BOOLEAN DEFAULT true,
  
  -- Our relationship
  relationship TEXT, -- 'affiliate', 'reference', 'inspiration', 'competitor'
  affiliate_code TEXT, -- if applicable
  
  -- Metadata
  title TEXT,
  description TEXT,
  favicon TEXT,
  
  -- Usage tracking
  times_linked INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 7. `tools` - Tool Database (extends what's in code)
```sql
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Categorization
  category TEXT NOT NULL,
  tags TEXT[],
  
  -- Links
  url TEXT NOT NULL,
  affiliate_url TEXT,
  logo_url TEXT,
  
  -- Pricing
  pricing TEXT, -- free, freemium, paid, enterprise
  pricing_details JSONB,
  
  -- Our review
  overall_rating FLOAT,
  battle_tested BOOLEAN DEFAULT false,
  
  -- Individual reviews stored in tool_reviews table
  
  -- API info
  has_api BOOLEAN DEFAULT false,
  api_docs_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 8. `tool_reviews` - Team Reviews Per Tool
```sql
CREATE TABLE tool_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  
  reviewer TEXT NOT NULL, -- stepten, pinky, reina, clark
  rating INTEGER, -- 1-5
  verdict TEXT, -- one-liner
  content TEXT, -- full markdown review
  
  -- Structured feedback
  pros TEXT[],
  cons TEXT[],
  best_for TEXT[],
  not_for TEXT[],
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(tool_id, reviewer)
);
```

---

## Functions

### Find Similar Tales
```sql
CREATE OR REPLACE FUNCTION find_similar_tales(
  p_tale_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  tale_id UUID,
  slug TEXT,
  title TEXT,
  similarity FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.slug,
    t.title,
    1 - (te1.embedding <=> te2.embedding) as similarity
  FROM tales t
  JOIN tale_embeddings te1 ON te1.tale_id = t.id
  JOIN tale_embeddings te2 ON te2.tale_id = p_tale_id
  WHERE t.id != p_tale_id
    AND te1.embedding_type = 'full'
    AND te2.embedding_type = 'full'
    AND t.status = 'published'
  ORDER BY te1.embedding <=> te2.embedding
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
```

### Generate Internal Link Suggestions
```sql
CREATE OR REPLACE FUNCTION suggest_internal_links(
  p_content TEXT,
  p_exclude_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
  target_type TEXT,
  target_slug TEXT,
  target_title TEXT,
  anchor_suggestion TEXT,
  relevance_score FLOAT
) AS $$
-- Uses entity matching and embedding similarity
-- to suggest where to link within content
$$ LANGUAGE plpgsql;
```

---

## Embedding Pipeline

1. **On Tale Create/Update:**
   - Generate embedding for full content
   - Generate embedding for summary/excerpt
   - Extract entities (tools, topics, lessons, personal stories)
   - Store in tale_entities

2. **Nightly Job:**
   - Recalculate tale_relationships based on embedding similarity
   - Update internal_links suggestions
   - Verify outbound_links (check HTTP status)

3. **On Request:**
   - `find_similar_tales()` for recommendations
   - `suggest_internal_links()` for content creation

---

## Notes

- Using Supabase project: `iavnhggphhrvbcidixiw` (StepTen.io)
- pgvector extension required for embeddings
- OpenAI ada-002 for embeddings (1536 dimensions)
- Consider upgrading to text-embedding-3-large for better quality
