# 04 — Database Schema

---

## Overview

Database: Supabase (PostgreSQL + pgvector)

All tables use:
- UUID primary keys
- `created_at` / `updated_at` timestamps
- Row Level Security (RLS)

---

## Users & Auth

```sql
-- Extends Supabase auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'paid_user', 'ops', 'seo', 'dev', 'sales', 'account_manager', 'admin', 'superadmin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members (for admin team)
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  department TEXT CHECK (department IN ('ops', 'seo', 'dev', 'sales', 'account_management')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Businesses (Portfolio)

```sql
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  description_full TEXT,
  
  -- Branding
  logo_url TEXT,
  logo_dark_url TEXT,
  brand_color TEXT,
  
  -- Links
  website_url TEXT,
  
  -- Media
  hero_image_url TEXT,
  hero_video_url TEXT,
  screenshots JSONB DEFAULT '[]',
  
  -- Details
  industry TEXT,
  founded_year INTEGER,
  your_role TEXT,
  status TEXT CHECK (status IN ('active', 'acquired', 'exited', 'building')),
  
  -- Features/highlights
  highlights JSONB DEFAULT '[]',
  
  -- Display
  display_order INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Articles & SEO

```sql
-- Silos (topic clusters)
CREATE TABLE public.silos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_silo_id UUID REFERENCES public.silos(id),
  pillar_article_id UUID,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'research', 'framework', 'draft', 'humanizing', 'optimizing', 'styling', 'review', 'published', 'archived', 'deleted')),
  article_type TEXT DEFAULT 'supporting' CHECK (article_type IN ('pillar', 'supporting')),
  
  -- Content
  title TEXT,
  slug TEXT UNIQUE,
  content_markdown TEXT,
  content_html TEXT,
  excerpt TEXT,
  
  -- SEO
  main_keyword TEXT,
  semantic_keywords JSONB DEFAULT '[]',
  meta_title TEXT,
  meta_description TEXT,
  schema_markup JSONB,
  
  -- Planning
  plan_data JSONB,
  framework_data JSONB,
  
  -- Media
  featured_image_url TEXT,
  featured_image_alt TEXT,
  video_hero_url TEXT,
  
  -- Links
  internal_links JSONB DEFAULT '[]',
  outbound_links JSONB DEFAULT '[]',
  affiliate_links JSONB DEFAULT '[]',
  
  -- Scores
  seo_score INTEGER,
  originality_score INTEGER,
  ai_detection_score INTEGER,
  readability_score INTEGER,
  
  -- Relations
  silo_id UUID REFERENCES public.silos(id),
  author_id UUID REFERENCES public.profiles(id),
  personality_id UUID REFERENCES public.personalities(id),
  
  -- Metadata
  word_count INTEGER,
  reading_time INTEGER,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Add foreign key to silos for pillar article
ALTER TABLE public.silos 
ADD CONSTRAINT fk_pillar_article 
FOREIGN KEY (pillar_article_id) REFERENCES public.articles(id);

-- Article embeddings for semantic search
CREATE TABLE public.article_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  embedding vector(768),
  chunk_text TEXT,
  chunk_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article links (for silo visualization)
CREATE TABLE public.article_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  target_article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  link_type TEXT CHECK (link_type IN ('up', 'down', 'sideways', 'related')),
  anchor_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_article_id, target_article_id)
);

-- Writing personalities
CREATE TABLE public.personalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  tone JSONB,
  writing_style TEXT,
  views_opinions JSONB,
  avoid_phrases JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice notes (for any stage feedback)
CREATE TABLE public.voice_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  stage TEXT,
  audio_url TEXT,
  transcription TEXT,
  ai_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Products & Courses

```sql
-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  description_full TEXT,
  
  -- Pricing
  price_type TEXT CHECK (price_type IN ('free', 'one_time', 'subscription', 'quote')),
  price_amount INTEGER,
  stripe_price_id TEXT,
  
  -- Access
  requires_subscription TEXT[],
  
  -- Media
  thumbnail_url TEXT,
  demo_video_url TEXT,
  screenshots JSONB DEFAULT '[]',
  
  -- Features
  features JSONB DEFAULT '[]',
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User product access
CREATE TABLE public.user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  access_type TEXT CHECK (access_type IN ('purchased', 'subscription', 'granted')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(user_id, product_id)
);

-- Courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  
  -- Pricing
  price_type TEXT CHECK (price_type IN ('free', 'one_time', 'subscription')),
  price_amount INTEGER,
  stripe_price_id TEXT,
  requires_subscription TEXT[],
  
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course modules
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course lessons
CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('video', 'text', 'quiz', 'exercise')),
  content TEXT,
  video_url TEXT,
  duration INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User course progress
CREATE TABLE public.user_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.course_lessons(id),
  completed_at TIMESTAMPTZ,
  progress_percent INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);
```

---

## Services

```sql
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Pricing
  price_type TEXT CHECK (price_type IN ('fixed', 'hourly', 'monthly', 'quote')),
  price_amount INTEGER,
  price_display TEXT,
  
  -- Details
  features JSONB DEFAULT '[]',
  deliverables JSONB DEFAULT '[]',
  
  -- Availability
  max_per_month INTEGER,
  is_available BOOLEAN DEFAULT TRUE,
  
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Affiliates & Directory

```sql
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  affiliate_url TEXT NOT NULL,
  regular_url TEXT,
  commission_rate DECIMAL,
  commission_type TEXT CHECK (commission_type IN ('percentage', 'fixed', 'recurring')),
  cookie_duration INTEGER,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Directory tools (affiliates with reviews)
CREATE TABLE public.directory_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  
  -- Links
  website_url TEXT,
  affiliate_url TEXT,
  has_affiliate BOOLEAN DEFAULT FALSE,
  
  -- Review
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_summary TEXT,
  review_full TEXT,
  
  -- Categorization
  category TEXT,
  tags JSONB DEFAULT '[]',
  pricing_type TEXT CHECK (pricing_type IN ('free', 'paid', 'freemium')),
  
  -- Media
  logo_url TEXT,
  screenshots JSONB DEFAULT '[]',
  
  -- Display
  is_featured BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## AI Agents & Memory

```sql
-- Agent configurations
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('sales', 'onboarding', 'support', 'seo', 'custom')),
  description TEXT,
  
  -- Config
  model TEXT NOT NULL,
  system_prompt TEXT,
  personality JSONB,
  
  -- Access
  is_public BOOLEAN DEFAULT FALSE,
  requires_auth BOOLEAN DEFAULT FALSE,
  requires_subscription TEXT[],
  
  -- Settings
  temperature DECIMAL DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4096,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent conversations
CREATE TABLE public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  session_id TEXT,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'summarized')),
  
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Conversation messages
CREATE TABLE public.agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  
  -- Tool usage
  tool_calls JSONB,
  tool_results JSONB,
  
  -- Metadata
  tokens_used INTEGER,
  model_used TEXT,
  latency_ms INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent memories (long-term)
CREATE TABLE public.agent_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  
  memory_type TEXT CHECK (memory_type IN ('fact', 'preference', 'summary', 'insight')),
  content TEXT NOT NULL,
  
  -- For RAG retrieval
  embedding vector(768),
  
  -- Source tracking
  source_conversation_id UUID REFERENCES public.agent_conversations(id),
  
  importance_score DECIMAL DEFAULT 0.5,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Monthly conversation summaries
CREATE TABLE public.conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  agent_id UUID REFERENCES public.agents(id),
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  summary TEXT NOT NULL,
  key_topics JSONB DEFAULT '[]',
  key_facts JSONB DEFAULT '[]',
  
  conversations_count INTEGER,
  messages_count INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base for RAG
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT CHECK (source_type IN ('article', 'product', 'course', 'faq', 'custom')),
  source_id UUID,
  
  title TEXT,
  content TEXT NOT NULL,
  
  embedding vector(768),
  
  metadata JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Leads

```sql
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact
  name TEXT,
  email TEXT,
  company TEXT,
  
  -- Qualification
  lead_type TEXT CHECK (lead_type IN ('consulting', 'dev_project', 'partnership', 'product_enquiry', 'other')),
  budget_range TEXT,
  timeline TEXT,
  project_description TEXT,
  
  -- Source
  source_page TEXT,
  conversation_id UUID REFERENCES public.agent_conversations(id),
  
  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Analytics

```sql
-- Page views
CREATE TABLE public.analytics_pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  session_id TEXT,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Indexes

```sql
-- Article indexes
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_silo ON public.articles(silo_id);
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_published ON public.articles(published_at);

-- Embedding indexes (for vector search)
CREATE INDEX idx_article_embeddings ON public.article_embeddings 
USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX idx_agent_memories_embedding ON public.agent_memories 
USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX idx_knowledge_base_embedding ON public.knowledge_base 
USING ivfflat (embedding vector_cosine_ops);

-- Conversation indexes
CREATE INDEX idx_conversations_user ON public.agent_conversations(user_id);
CREATE INDEX idx_conversations_agent ON public.agent_conversations(agent_id);
CREATE INDEX idx_messages_conversation ON public.agent_messages(conversation_id);
```
