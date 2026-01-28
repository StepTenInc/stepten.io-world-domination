# 🔧 SEO Engine - Setup Guide

**Feature:** SEO Content Engine  
**Last Updated:** 2026-01-10 11:00 SGT

---

## Prerequisites

- [x] Next.js 15 app running on port 262
- [x] Supabase project configured
- [ ] OpenAI API key (for Whisper & DALL-E)
- [ ] Anthropic API key (for Claude)
- [ ] Perplexity API key (for research)
- [ ] xAI API key (for Grok)
- [ ] Google API key (for Gemini)

---

## Environment Variables Required

```env
# SEO Engine - AI Services
OPENAI_API_KEY=sk-...          # Whisper + DALL-E
ANTHROPIC_API_KEY=sk-ant-...   # Claude 4.5
PERPLEXITY_API_KEY=pplx-...    # Perplexity Sonar
XAI_API_KEY=xai-...            # Grok 4.1
GOOGLE_API_KEY=...             # Gemini 3 Pro

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
DATABASE_URL=postgresql://...
```

---

## Database Tables Required

### `articles`
```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'idea',  -- idea, research, framework, draft, humanizing, optimizing, styling, review, published
  silo_id UUID REFERENCES article_silos(id),
  meta_title TEXT,
  meta_description TEXT,
  main_keyword TEXT,
  semantic_keywords TEXT[],
  word_count INTEGER,
  reading_time INTEGER,
  seo_score INTEGER,
  human_score INTEGER,
  schema_json JSONB,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### `article_ideas`
```sql
CREATE TABLE article_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  input_type TEXT NOT NULL,  -- voice, text, document, existing
  raw_input TEXT,
  transcription TEXT,
  processed_idea TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### `article_silos`
```sql
CREATE TABLE article_silos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  pillar_article_id UUID,
  article_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## File Structure

```
stepten-app/
├── app/
│   ├── (admin)/admin/seo/
│   │   ├── page.tsx                    ← Dashboard
│   │   └── articles/new/
│   │       ├── step-1-idea/page.tsx
│   │       ├── step-2-research/page.tsx
│   │       ├── step-3-framework/page.tsx
│   │       ├── step-4-writing/page.tsx
│   │       ├── step-5-humanize/page.tsx
│   │       ├── step-6-optimize/page.tsx
│   │       ├── step-7-styling/page.tsx
│   │       └── step-8-publish/page.tsx
│   └── api/seo/
│       ├── transcribe/route.ts         ← Whisper
│       ├── research/route.ts           ← Perplexity
│       ├── framework/route.ts          ← Claude
│       ├── write/route.ts              ← Claude
│       ├── humanize/route.ts           ← Grok
│       ├── optimize/route.ts           ← Gemini
│       ├── generate-image/route.ts     ← DALL-E
│       └── publish/route.ts            ← Database
└── lib/
    └── seo/
        ├── prompts.ts                   ← All AI prompts
        ├── models.ts                    ← AI model configs
        └── utils.ts                     ← Helper functions
```

---

## Installation Steps

### 1. UI Pages (✅ Complete)
```bash
# Already created - all 8 step pages + dashboard
```

### 2. API Routes (🔲 Pending)
```bash
# Create API structure
mkdir -p app/api/seo/{transcribe,research,framework,write,humanize,optimize,generate-image,publish}
```

### 3. Database Migration (🔲 Pending)
```bash
# Create migration file
touch supabase/migrations/003_seo_engine.sql

# Push to database
npx supabase db push
```

### 4. Lib Utilities (🔲 Pending)
```bash
# Create lib structure
mkdir -p lib/seo
```

---

## Configuration

### AI Models Configuration

```typescript
// lib/seo/models.ts
export const SEO_MODELS = {
  transcription: {
    provider: 'openai',
    model: 'whisper-1',
  },
  research: {
    provider: 'perplexity',
    model: 'sonar-reasoning-pro',
  },
  framework: {
    provider: 'anthropic',
    model: 'claude-sonnet-4-5-20250929',
  },
  writing: {
    provider: 'anthropic',
    model: 'claude-sonnet-4-5-20250929',
  },
  humanization: {
    provider: 'xai',
    model: 'grok-4-1-fast-reasoning',
  },
  optimization: {
    provider: 'google',
    model: 'gemini-3-pro-preview',
  },
  imageGeneration: {
    provider: 'openai',
    model: 'dall-e-3',
  },
};
```

---

## Testing

### Test URLs
- Dashboard: http://localhost:262/admin/seo
- Step 1: http://localhost:262/admin/seo/articles/new/step-1-idea
- Step 2: http://localhost:262/admin/seo/articles/new/step-2-research
- Step 3: http://localhost:262/admin/seo/articles/new/step-3-framework
- Step 4: http://localhost:262/admin/seo/articles/new/step-4-writing
- Step 5: http://localhost:262/admin/seo/articles/new/step-5-humanize
- Step 6: http://localhost:262/admin/seo/articles/new/step-6-optimize
- Step 7: http://localhost:262/admin/seo/articles/new/step-7-styling
- Step 8: http://localhost:262/admin/seo/articles/new/step-8-publish

---

## Deployment Notes

- Ensure all API keys are set in Vercel environment
- Database migrations must be run before deploying
- Webhook endpoints for real-time updates (if needed)

---

*Setup guide last updated: 2026-01-10*
