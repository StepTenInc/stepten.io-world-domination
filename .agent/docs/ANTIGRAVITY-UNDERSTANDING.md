# 🤖 Antigravity's Complete Understanding of StepTen.io

**Document Created:** January 10, 2026  
**Last Updated:** January 10, 2026  
**By:** Google Antigravity AI Agent  
**Status:** ✅ ALL DECISIONS CONFIRMED - READY TO BUILD

---

## 📋 EXECUTIVE SUMMARY

StepTen.io is a **personal holding company/brand hub** for an experienced entrepreneur (39 years old, 20+ years in business). The project is an ambitious, full-stack platform that serves as:

1. **Portfolio Showcase** — Displays 4 active businesses (ShoreAgents, ShoreAgents.ai, LMNH, BPOC.io)
2. **Product Marketplace** — Sells digital products and tools (SEO Content Engine, future tools)
3. **Service Platform** — Consulting ($500 one-off, $750/month retainer) and dev work ($250/hr)
4. **Content Hub** — AI-powered SEO engine that generates articles, courses, and YouTube content
5. **AI-First Experience** — Three AI agents handle all customer interactions (no contact form)
6. **Course Platform** — Full course builder with video hosting, lessons, modules
7. **MCP Integration** — Custom MCP server for Antigravity + site tool execution

---

## ✅ CONFIRMED DECISIONS

| Decision | Confirmed Value |
|----------|----------------|
| **Project State** | Greenfield - starting from scratch |
| **Structure** | **SIMPLIFIED** - No Turborepo, single Next.js project |
| **ORM Strategy** | Drizzle (complex queries) + Supabase client (simple/realtime) |
| **Hosting** | Vercel (frontend) - No Render account yet |
| **Domain** | stepten.io - deploy to Vercel first, DNS move later |
| **AI Models** | January 2026 models as documented - DO NOT CHANGE |
| **Prisma** | IGNORE completely - using Drizzle only |
| **Calendly** | NO - Build custom booking system |
| **Payments** | Skip for now - Singapore company not set up |
| **Newsletter** | DB table only - email service TBD |
| **Notifications** | Internal system + Discord integration |
| **Analytics** | Vercel built-in + Google Analytics later |
| **Course Platform** | Build full platform - no migration |
| **Voice Embeddings** | Build embeddings DB for owner's voice/opinions |
| **URL Structure** | Nested for dashboard, FLAT for articles (SEO) |
| **Silo System** | Pillar pages + supporting articles, prevent cannibalization |

---

## 🏗️ ARCHITECTURE OVERVIEW

### Tech Stack
```
Frontend:     Next.js 15 (App Router) + TypeScript + Tailwind CSS
Database:     Supabase (PostgreSQL + pgvector for embeddings)
ORM:          Drizzle (complex) + Supabase client (simple/realtime)
Auth:         Supabase Auth with RLS
Backend:      Python FastAPI (for AI agents & MCP)
AI Models:    Claude 4.5, Gemini 3, GPT-5.2, Grok 4.1, Perplexity, DeepSeek
UI:           ShadCN + Aceternity UI + Magic UI
Animations:   Framer Motion
Payments:     TBD (Singapore company pending)
Hosting:      Vercel (Next.js) - Python hosting TBD
```

### Project Structure (SIMPLIFIED - No Turborepo)
```
stepten.io/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public pages
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # User dashboard
│   ├── (admin)/           # Admin backend
│   ├── api/               # API routes
│   └── [slug]/            # Flat article URLs
├── components/            # React components
├── lib/                   # Utilities, clients
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
├── config/                # App configuration
├── supabase/              # Migrations
├── python/                # FastAPI backend (separate)
└── StepTen Project Docs/  # Documentation
```

---

## 🎨 DESIGN LANGUAGE

### Colors (Dark Mode Only)
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0a0a` | Main dark |
| Background Alt | `#111111` | Cards |
| Primary (Matrix Green) | `#00FF41` | CTAs, highlights |
| Info (Aqua) | `#22D3EE` | Links, info |
| Error | `#FF4757` | Errors |

### Style
- Futuristic "2030 aesthetic"
- Subtle glow effects
- Particle effects (hero sections ONLY)
- Space Grotesk font + JetBrains Mono for code
- WCAG AAA contrast compliant

---

## 🤖 AI MODEL USAGE MAP (January 2026 - CONFIRMED)

| Task | Model | API ID |
|------|-------|--------|
| Chat Agents | Claude 4.5 Sonnet | `claude-sonnet-4-5-20250929` |
| SEO Content Writing | Claude 4.5 Sonnet | `claude-sonnet-4-5-20250929` |
| Complex Reasoning | Claude 4.5 Opus | `claude-opus-4-5-20251101` |
| Research & Citations | Perplexity Sonar | `sonar-reasoning-pro` |
| Humanization | Grok 4.1 | `grok-4-1-fast-reasoning` |
| Code Optimization | Gemini 3 Pro | `gemini-3-pro-preview` |
| Embeddings | Gemini | `text-embedding-005` |
| Voice Transcription | OpenAI Whisper | `whisper-1` |
| Budget Coding | DeepSeek V3.2 | `deepseek-v3.2-maas` |
| Complex Logic | GPT-5.2 | `gpt-5.2` |

**⚠️ DO NOT USE OLD MODELS - These are the current January 2026 versions**

---

## 📊 SEO ENGINE PIPELINE

The centerpiece feature — a complete AI content creation system:

```
Voice Input → Whisper transcription → [IDEA]
                    ↓
Perplexity research + internal DB scan → [RESEARCH]
                    ↓
Claude framework generation → [FRAMEWORK]
                    ↓
Claude article writing → [DRAFT]
                    ↓
Grok humanization → [HUMANIZING]
                    ↓
Gemini optimization + schema → [OPTIMIZING]
                    ↓
Styling + media generation → [STYLING]
                    ↓
Human review → [PUBLISHED]
```

**Key Features:**
- Voice feedback at every stage
- Silo-based content organization (Pillar + Supporting articles)
- Internal link intelligence (up/down/sideways)
- Cannibalization prevention
- Affiliate link insertion
- Personality-based writing (with owner voice embeddings)
- RankMath 100/100 optimization

---

## � COURSE PLATFORM (NEW BUILD)

Full course builder from scratch:
- Video hosting in Supabase Storage
- Module and lesson structure
- Progress tracking
- "Best course builder ever" quality
- Admin backend for course creation
- User dashboard for course access

---

## 📅 CUSTOM BOOKING SYSTEM (NO CALENDLY)

Build our own booking/scheduling:
- Available time slots management
- Booking creation and confirmation
- Integration with AI agents
- No third-party dependencies

---

## 🔔 NOTIFICATION SYSTEM

- **Internal notifications** (not email/Slack based)
- **Discord integration:**
  - Admin channel for owner notifications
  - Paid Discord server for community

---

## 🎤 VOICE EMBEDDINGS SYSTEM

Database for owner's voice and opinions:
- Voice-to-text transcriptions
- Embeddings of thoughts/opinions on subjects
- RAG retrieval for content generation
- Ensures content reflects owner's authentic voice

---

## 👥 USER ROLES HIERARCHY

```
superadmin (you)
    └── admin
        ├── account_manager
        ├── sales
        ├── seo
        ├── ops
        └── dev
            └── paid_user
                └── user (free)
```

---

## 🔗 URL STRUCTURE (CONFIRMED)

| Route Type | Structure | Example |
|------------|-----------|--------|
| Dashboard | Nested under `/dashboard/` | `/dashboard/products/[slug]` |
| Admin | Nested under `/admin/` | `/admin/seo/articles` |
| **Articles** | **FLAT off root** (SEO) | `/my-article-slug` |
| Silos | Under `/topics/` | `/topics/ai-automation` |

---

## 🚀 BUILD ORDER (APPROVED)

### Phase 1: Foundation ✅ IN PROGRESS
1. Initialize Next.js 15 project with TypeScript + Tailwind
2. Configure ShadCN UI
3. Set up Supabase + Drizzle
4. Create root layout with dark theme
5. Build shared components (buttons, cards, inputs)

### Phase 2: Public Site
6. Homepage with sections
7. About page
8. Businesses listing + detail pages
9. Products listing + detail pages
10. Services page
11. Basic navigation + footer

### Phase 3: Auth
12. Login/Register/Forgot Password pages
13. Supabase auth integration
14. Protected route middleware
15. User profile creation

### Phase 4: Dashboards
16. User dashboard layout
17. Admin dashboard layout
18. Basic admin pages shell

### Phase 5: Core Features
19. Chat widget component
20. Agent integration (sales agent first)
21. SEO Engine admin interface
22. Content pipeline implementation
23. Course platform
24. Custom booking system

### Phase 6: Advanced Features
25. MCP server integration
26. Discord notifications
27. Voice embeddings system
28. Full agent memory system

### Phase 7: Polish & Launch
29. Testing & debugging
30. Production deployment to Vercel
31. DNS migration to stepten.io

---

## 📝 BUILD LOG

### January 10, 2026
- ✅ Read all 19 documentation files
- ✅ Created understanding document
- ✅ All questions answered by owner
- ✅ Fixed file structure references
- ✅ Updated documentation consistency
- 🔄 Starting Phase 1: Foundation

---

*This document will be updated as we progress through the build.*
