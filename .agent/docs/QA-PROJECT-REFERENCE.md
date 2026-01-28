# 📋 StepTen.io - Q&A Project Reference

**Purpose:** Single source of truth for all project decisions and clarifications  
**Rule:** Update this document whenever a question is asked and answered

---

## How to Use This Document

1. When you have a question, add it to the **OPEN QUESTIONS** section
2. Once answered, move it to the relevant **ANSWERED** section with timestamp
3. Reference this document before asking repeated questions

---

## 🔴 OPEN QUESTIONS

*No open questions currently*

---

## ✅ ANSWERED QUESTIONS

### Project Setup & Structure

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Is this greenfield or existing code? | **Greenfield** - starting from scratch |
| 2026-01-10 | Turborepo monorepo or simplified? | **Simplified structure** - no Turborepo |
| 2026-01-10 | Supabase project created? | Yes, but API keys not yet provided |
| 2026-01-10 | Vercel account? | Yes |
| 2026-01-10 | Render account? | No - not needed with simplified structure |
| 2026-01-10 | Development port? | **Port 262** - dedicated port for StepTen.io |

### ORM & Database

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Drizzle or Supabase client? | **Both** - Drizzle for complex queries, Supabase client for simple/realtime |
| 2026-01-10 | Prisma? | **NO** - Ignore Prisma completely, use Drizzle only |

### Domain & Hosting

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Production domain? | stepten.io (currently on Wix, registered at Namecheap) |
| 2026-01-10 | Deployment approach? | Deploy to Vercel first on their link, then move DNS later |

### AI Models

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Which AI model versions? | Use January 2026 models as documented - DO NOT USE OLD MODELS |
| 2026-01-10 | Are the model IDs correct? | Yes - Claude 4.5, GPT-5.2, Gemini 3, Grok 4.1 are current |

### Features & Integrations

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Calendly integration? | **NO** - Build custom booking system, no third-party |
| 2026-01-10 | Newsletter? | DB table for now, email service TBD (SendGrid/SendinBlue) |
| 2026-01-10 | Notifications? | Internal system + Discord integration (admin channel + paid server) |
| 2026-01-10 | Analytics? | Vercel built-in + Google Analytics later |
| 2026-01-10 | Payments/Stripe? | Skip for now - Singapore company not set up |
| 2026-01-10 | MCP Server? | Yes - build as part of project for site + Antigravity integration |

### Content & Courses

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Existing courses to migrate? | No - build full course platform from scratch |
| 2026-01-10 | Course requirements? | Videos, outline, lessons - "best course builder ever" |
| 2026-01-10 | Content/logos available? | Yes - owner has all content ready |

### URL Structure

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Article URLs? | **FLAT** off root domain (e.g., `/my-article-slug`) |
| 2026-01-10 | Dashboard URLs? | Nested under `/dashboard/` |
| 2026-01-10 | Admin URLs? | Nested under `/admin/` |

### Voice & Embeddings

| Date | Question | Answer |
|------|----------|--------|
| 2026-01-10 | Voice embeddings? | Yes - build DB for owner's voice/opinions on all subjects |
| 2026-01-10 | Purpose? | RAG retrieval for content generation with authentic voice |

---

## 🔒 FIRM DECISIONS (Never Change)

These are absolute decisions that should never be questioned:

1. **NO Prisma** - Using Drizzle only
2. **NO Calendly** - Building custom booking system
3. **NO Turborepo** - Simplified structure
4. **AI Models** - Use January 2026 versions as documented
5. **Articles** - Flat URL structure off root
6. **Dark Mode Only** - No light mode

---

## 📝 Notes

*Add any additional context or notes here as the project progresses*

---

**Last Updated:** 2026-01-10 09:00 SGT
