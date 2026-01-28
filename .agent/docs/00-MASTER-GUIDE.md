# StepTen.io — Master Guide

---

## Overview

StepTen.io is your personal holding company / brand hub that showcases:
- Your portfolio of businesses
- Products people can buy
- Services (consulting, dev work)
- Content (articles, courses, YouTube)
- AI agents handle all contact/enquiries

This document is the master reference. Detailed documentation for each component is in separate files.

---

## Documentation Index

| Document | Description |
|----------|-------------|
| `01-AI-MODEL-STACK.md` | AI models, API IDs, costs, best use cases |
| `02-TECH-STACK.md` | Technologies, frameworks, services used |
| `03-FILE-STRUCTURE.md` | Complete project file structure |
| `04-DATABASE-SCHEMA.md` | Full Supabase database schema |
| `05-USER-ROLES.md` | Roles, permissions, access levels |
| `06-URL-STRUCTURE.md` | All public, auth, dashboard, admin URLs |
| `07-SITE-PAGES.md` | Page layouts and sections |
| `08-SEO-ENGINE.md` | Full AI SEO content pipeline |
| `09-AI-AGENTS.md` | Agent configs, memory, RAG system |
| `10-MCP-ARCHITECTURE.md` | Custom MCP server and tools |
| `11-BUSINESSES-PORTFOLIO.md` | Your business portfolio structure |
| `12-PRODUCTS-SERVICES.md` | Products and services structure |
| `13-STYLE-GUIDE.md` | Colors, typography, effects, design tokens |
| `14-COMPONENT-LIBRARY.md` | Reusable component structure and patterns |
| `15-TESTING-GUIDE.md` | Test accounts, debugging procedures |
| `16-ANTIGRAVITY-RULES.md` | Google Antigravity IDE rules and workflows |
| `17-DEVELOPMENT-WORKFLOW.md` | How to develop, test, deploy |
| `18-LEARNING-GUIDE.md` | Master learning doc for all technologies (NotebookLLM) |

---

## Your Businesses

| Business | Tagline | Industry | Status |
|----------|---------|----------|--------|
| **ShoreAgents** | Offshore BPO staffing solutions | BPO / Staffing | Active |
| **ShoreAgents.ai** | AI-powered staff management software | SaaS / HR Tech | Active |
| **LMNH (Look Mum No Hands)** | AI bots anyone can create | AI / No-Code | Active |
| **BPOC.io** | AI careers platform for BPO workers | HR Tech / Careers | Active |

---

## AI Model Stack Summary

| Model | Best For |
|-------|----------|
| **Gemini 3 Pro/Flash** | Design, Python, Go, Multimodal, RAG (1M context), video analysis |
| **GPT-5.2** | TypeScript, SQL, Rust, JSON schemas, PhD-level logic |
| **Claude 4.5 Opus/Sonnet** | Agents, React/Frontend, Computer Use, SEO content |
| **Grok 4.1** | Real-time/breaking news, C++, social trending, cheap & fast |
| **DeepSeek V3.2** | Coding value king, Python/JS bulk work, 90% cheaper |
| **Perplexity Sonar** | SEO research, live citations, URL verification |

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Framer Motion |
| UI Components | Aceternity UI + Magic UI + ShadCN |
| Database | Supabase (Postgres + pgvector) |
| Auth | Supabase Auth (with RLS) |
| Storage | Supabase Storage |
| Python Backend | FastAPI (for agents + MCP) |
| Agent Framework | LlamaIndex + LangChain |
| MCP Server | Custom Python MCP |
| Vector Store | Supabase pgvector |
| Payments | Stripe |
| Deployment | Vercel (Next.js) + Render (Python) |

---

## Site Structure Summary

### Public Pages
- `/` — Homepage
- `/about` — Your story
- `/businesses` — Portfolio listing
- `/businesses/[slug]` — Individual business
- `/products` — Products listing
- `/products/[slug]` — Product demo page
- `/services` — Consulting & dev services
- `/courses` — Course listings
- `/courses/[slug]` — Course detail
- `/directory` — Affiliate tool reviews
- `/directory/[slug]` — Full tool review
- `/articles` — Article hub
- `/[slug]` — Flat article URLs
- `/topics/[silo]` — Silo pillar pages

**No /contact page** — Chat agent handles everything

### Auth Pages
- `/login`
- `/register`
- `/forgot-password`
- `/verify`

### User Dashboard
- `/dashboard` — User home
- `/dashboard/products` — User's products
- `/dashboard/products/[slug]` — Full product access
- `/dashboard/courses` — User's courses
- `/dashboard/courses/[slug]` — Course content
- `/dashboard/tools/[tool]` — Tool access
- `/dashboard/billing` — Subscription management
- `/dashboard/settings` — User settings
- `/dashboard/support` — Support (paid users)

### Admin Backend
- `/admin` — Admin dashboard
- `/admin/seo` — SEO Engine
- `/admin/seo/articles` — Article management
- `/admin/seo/silos` — Silo visualization
- `/admin/products` — Product management
- `/admin/courses` — Course management
- `/admin/users` — User management
- `/admin/agents` — AI agent management
- `/admin/analytics` — Analytics
- `/admin/settings` — System settings
- `/admin/team` — Team management

---

## User Roles Summary

```
superadmin (you)
    └── admin
        └── account_manager
        └── sales
        └── seo
        └── ops
        └── dev
            └── paid_user
                └── user (free)
```

---

## SEO Engine Pipeline Summary

```
[Voice/Text Input] → Whisper (transcribe)
        ↓
[Status: IDEA] ← saved to DB
        ↓
Perplexity (research + plan)
        ↓
[Status: RESEARCH] ← plan saved as JSONB
        ↓
Claude (framework)
        ↓
Claude (write article)
        ↓
[Status: DRAFT] ← content saved
        ↓
Grok (humanize)
        ↓
[Status: REVIEW]
        ↓
Gemini (optimize + schema + links)
        ↓
Style + Media (images, video)
        ↓
[Status: PUBLISHED] ← final article live
```

---

## AI Agents Summary

| Agent | Location | Model | Purpose |
|-------|----------|-------|---------|
| **Sales Agent** | Public site | Claude Sonnet 4.5 | Qualify leads, answer questions, book calls |
| **Onboarding Agent** | User dashboard | Claude Sonnet 4.5 | Help users get started, explain features |
| **Support Agent** | Paid dashboard | Claude Sonnet 4.5 | Technical support, business advice |

### Memory System
- Conversations stored in real-time
- Key facts extracted to long-term memory
- Monthly summarization of old conversations
- RAG retrieval across knowledge base + memories

---

## Services Summary

| Service | Price | Details |
|---------|-------|---------|
| One-off Session | $500 USD | 1 hour, strategy & implementation |
| Monthly Retainer | $750 USD/month | 2 sessions, async support |
| Dev Block Hours | $250 USD/hour | 10 hour blocks, max 10hrs/month |
| Custom Project | Quote | MVPs, full apps, AI integrations |
| Partnership/Equity | Apply | Right startup, serious founders only |

---

## Key Design Requirements

- Colors: Black (#0a0a0a), Matrix Green (#00FF41), Aqua (#22D3EE)
- Style: Futuristic, animated, 2030 aesthetic
- Effects: Subtle glows, smooth scroll, hover effects
- Particle effects: Hero sections only
- Accessibility: Reduced motion support
- UI Libraries: Aceternity UI, Magic UI, ShadCN

## Tech Decisions

- **ORM:** Drizzle (lightweight, fast, type-safe)
- **Python DB:** Supabase Python Client
- **Monorepo:** Turborepo
- **Python Hosting:** Render
- **Testing:** Local dev + Vercel preview deployments
- **Test accounts created with email verification disabled**

---

## Next Steps

1. Set up Next.js + Python repos
2. Run Supabase migrations
3. Build auth flow
4. Create public layout + homepage
5. Build admin shell
6. Implement SEO Engine
7. Deploy AI agents
8. Set up MCP server
9. Index knowledge base for RAG

---

## Reference Documents

See individual `.md` files in `/StepTen Project Docs` for complete details on each component.
