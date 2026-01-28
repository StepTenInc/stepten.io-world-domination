# 03 — File Structure

---

## Project Root (SIMPLIFIED STRUCTURE)

```
stepten.io/
├── app/                              # Next.js 15 App Router
│   ├── (public)/                     # Public routes
│   ├── (auth)/                       # Auth routes
│   ├── (dashboard)/                  # User dashboard
│   ├── (admin)/                      # Admin backend
│   ├── api/                          # API routes
│   └── [slug]/                       # Flat article URLs
├── components/                       # React components
├── lib/                              # Utilities, clients
├── hooks/                            # Custom hooks
├── types/                            # TypeScript types
├── config/                           # App configuration
├── supabase/                         # Database migrations & functions
├── python/                           # Python Backend (separate)
├── StepTen Project Docs/             # Documentation
├── scripts/                          # Setup & utility scripts
├── .env.example
├── .env.local                        # Local environment (gitignored)
├── .gitignore
├── package.json
├── tailwind.config.ts
├── drizzle.config.ts
├── next.config.ts
├── tsconfig.json
└── README.md
```

**NOTE:** Using simplified structure - NO Turborepo monorepo

---

## Next.js App (`apps/web/`)

```
apps/web/
├── app/
│   ├── (public)/                     # Public routes (no auth)
│   │   ├── layout.tsx                # Public layout
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── businesses/
│   │   │   ├── page.tsx              # Portfolio listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Individual business
│   │   ├── products/
│   │   │   ├── page.tsx              # Products listing (outer view)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Product demo page (public)
│   │   ├── services/
│   │   │   └── page.tsx              # Consulting & dev services
│   │   ├── courses/
│   │   │   ├── page.tsx              # Course listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Course detail (public)
│   │   ├── directory/
│   │   │   ├── page.tsx              # Tool directory
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Full tool review
│   │   ├── articles/
│   │   │   └── page.tsx              # Articles hub
│   │   ├── [slug]/
│   │   │   └── page.tsx              # Flat article URLs
│   │   ├── topics/
│   │   │   └── [silo]/
│   │   │       └── page.tsx          # Silo pillar pages
│   │   └── legal/
│   │       ├── privacy/
│   │       │   └── page.tsx
│   │       └── terms/
│   │           └── page.tsx
│   │
│   ├── (auth)/                       # Auth pages
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── verify/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                  # User dashboard (authenticated)
│   │   ├── layout.tsx                # Dashboard layout (checks auth + tier)
│   │   ├── page.tsx                  # Dashboard home
│   │   ├── products/
│   │   │   ├── page.tsx              # User's products (inner view)
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Full product access (paid check)
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── tools/
│   │   │   └── [tool]/
│   │   │       └── page.tsx
│   │   ├── billing/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── support/
│   │       └── page.tsx
│   │
│   ├── (admin)/                      # Admin backend (role-based)
│   │   ├── layout.tsx                # Admin layout (role check)
│   │   ├── page.tsx                  # Admin dashboard
│   │   ├── seo/
│   │   │   ├── page.tsx              # SEO Engine dashboard
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx          # All articles list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # New article flow
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Edit article
│   │   │   │       └── preview/
│   │   │   │           └── page.tsx
│   │   │   ├── silos/
│   │   │   │   ├── page.tsx          # Silo visualization
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── keywords/
│   │   │   │   └── page.tsx
│   │   │   ├── competitors/
│   │   │   │   └── page.tsx
│   │   │   └── analytics/
│   │   │       └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── courses/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── agents/
│   │   │   ├── page.tsx              # Manage AI agents
│   │   │   ├── conversations/
│   │   │   │   └── page.tsx
│   │   │   └── memories/
│   │   │       └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── team/
│   │       └── page.tsx              # Team management
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...supabase]/
│   │   │       └── route.ts
│   │   ├── webhooks/
│   │   │   ├── stripe/
│   │   │   │   └── route.ts
│   │   │   └── supabase/
│   │   │       └── route.ts
│   │   ├── articles/
│   │   │   └── route.ts
│   │   ├── agents/
│   │   │   ├── chat/
│   │   │   │   └── route.ts
│   │   │   └── memory/
│   │   │       └── route.ts
│   │   ├── seo/
│   │   │   ├── research/
│   │   │   │   └── route.ts
│   │   │   ├── write/
│   │   │   │   └── route.ts
│   │   │   ├── humanize/
│   │   │   │   └── route.ts
│   │   │   └── optimize/
│   │   │       └── route.ts
│   │   └── mcp/
│   │       └── route.ts              # MCP proxy to Python
│   │
│   ├── layout.tsx                    # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                           # ShadCN + custom components
│   ├── layouts/
│   │   ├── PublicLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── AdminLayout.tsx
│   │   └── AuthLayout.tsx
│   ├── agents/
│   │   ├── ChatWidget.tsx            # Reusable chat component
│   │   ├── VoiceInput.tsx            # Whisper voice component
│   │   └── AgentAvatar.tsx
│   ├── seo/
│   │   ├── ArticleEditor.tsx
│   │   ├── SiloVisualizer.tsx
│   │   ├── ResearchPanel.tsx
│   │   └── ScoreCard.tsx
│   ├── articles/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleTemplate.tsx       # Supporting article template
│   │   └── SiloPillarTemplate.tsx    # Pillar page template
│   └── marketing/
│       ├── Hero.tsx
│       ├── Features.tsx
│       └── Pricing.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── admin.ts
│   ├── stripe/
│   │   └── index.ts
│   ├── ai/
│   │   ├── claude.ts
│   │   ├── gemini.ts
│   │   ├── grok.ts
│   │   ├── perplexity.ts
│   │   ├── whisper.ts
│   │   └── embeddings.ts
│   ├── mcp/
│   │   └── client.ts
│   └── utils/
│       └── index.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useSubscription.ts
│   ├── useAgent.ts
│   └── useVoice.ts
│
├── types/
│   ├── database.ts                   # Supabase generated types
│   ├── articles.ts
│   ├── agents.ts
│   └── users.ts
│
├── config/
│   ├── site.ts
│   ├── navigation.ts
│   └── agents.ts                     # Agent personalities config
│
├── middleware.ts                     # Auth + role middleware
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Python Backend (`apps/python/`)

```
apps/python/
├── app/
│   ├── main.py                       # FastAPI entry
│   ├── config.py
│   ├── api/
│   │   ├── routes/
│   │   │   ├── agents.py
│   │   │   ├── mcp.py
│   │   │   ├── seo.py
│   │   │   └── embeddings.py
│   │   └── deps.py
│   ├── agents/
│   │   ├── base.py                   # Base agent class
│   │   ├── sales_agent.py            # Public sales agent
│   │   ├── onboarding_agent.py       # User onboarding
│   │   ├── support_agent.py          # Paid support agent
│   │   └── seo_agent.py              # SEO engine orchestrator
│   ├── mcp/
│   │   ├── server.py                 # MCP server implementation
│   │   ├── tools/
│   │   │   ├── database.py
│   │   │   ├── search.py
│   │   │   ├── email.py
│   │   │   └── analytics.py
│   │   └── resources/
│   ├── llama_index/
│   │   ├── indexes.py
│   │   ├── retrievers.py
│   │   └── query_engines.py
│   ├── memory/
│   │   ├── conversation.py           # Conversation memory
│   │   ├── summarizer.py             # Monthly summarization
│   │   └── retrieval.py              # Memory retrieval
│   ├── rag/
│   │   ├── knowledge_base.py
│   │   ├── articles.py
│   │   └── products.py
│   ├── services/
│   │   ├── perplexity.py
│   │   ├── claude.py
│   │   ├── gemini.py
│   │   ├── grok.py
│   │   └── whisper.py
│   └── db/
│       ├── supabase.py
│       └── models.py
│
├── requirements.txt
├── Dockerfile
└── pyproject.toml
```

---

## Supabase (`supabase/`)

```
supabase/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_articles.sql
│   ├── 003_agents.sql
│   ├── 004_products.sql
│   ├── 005_businesses.sql
│   └── 006_rls_policies.sql
├── functions/
│   ├── summarize_conversations/
│   │   └── index.ts
│   └── refresh_embeddings/
│       └── index.ts
└── seed.sql
```

---

## Documentation (`StepTen Project Docs/`)

```
StepTen Project Docs/
├── 00-MASTER-GUIDE.md
├── 01-AI-MODEL-STACK.md
├── 02-TECH-STACK.md
├── 03-FILE-STRUCTURE.md
├── 04-DATABASE-SCHEMA.md
├── 05-USER-ROLES.md
├── 06-URL-STRUCTURE.md
├── 07-SITE-PAGES.md
├── 08-SEO-ENGINE.md
├── 09-AI-AGENTS.md
├── 10-MCP-ARCHITECTURE.md
├── 11-BUSINESSES-PORTFOLIO.md
├── 12-PRODUCTS-SERVICES.md
├── 13-STYLE-GUIDE.md
├── 14-COMPONENT-LIBRARY.md
├── 15-TESTING-GUIDE.md
├── 16-ANTIGRAVITY-RULES.md
├── 17-DEVELOPMENT-WORKFLOW.md
├── 18-LEARNING-GUIDE.md
└── ANTIGRAVITY-UNDERSTANDING.md       # Agent's understanding doc
```

---

## Scripts (`scripts/`)

```
scripts/
├── setup.sh
├── seed-db.ts
└── generate-types.ts
```
