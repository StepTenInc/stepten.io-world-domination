# 11 — Businesses Portfolio

---

## Overview

Your portfolio of businesses displayed on StepTen.io.

---

## Current Businesses

### ShoreAgents

| Field | Value |
|-------|-------|
| **Name** | ShoreAgents |
| **Tagline** | Offshore BPO staffing solutions |
| **Industry** | BPO / Staffing |
| **Status** | Active |
| **Your Role** | Founder |
| **Website** | shoreagents.com |

**Description:**
Offshore BPO staffing solutions. Helping businesses scale with quality offshore talent.

---

### ShoreAgents.ai

| Field | Value |
|-------|-------|
| **Name** | ShoreAgents.ai |
| **Tagline** | AI-powered staff management software |
| **Industry** | SaaS / HR Tech |
| **Status** | Active |
| **Your Role** | Founder |
| **Website** | shoreagents.ai |

**Description:**
AI-powered staff management software for BPO operations. Streamline workforce management with intelligent automation.

---

### LMNH (Look Mum No Hands)

| Field | Value |
|-------|-------|
| **Name** | LMNH (Look Mum No Hands) |
| **Tagline** | AI bots anyone can create |
| **Industry** | AI / No-Code |
| **Status** | Active |
| **Your Role** | Founder |
| **Website** | lmnh.ai (TBD) |

**Description:**
AI bot builder platform. Create powerful AI agents without code. Democratizing AI for everyone.

---

### BPOC.io

| Field | Value |
|-------|-------|
| **Name** | BPOC.io |
| **Tagline** | AI careers platform for BPO workers |
| **Industry** | HR Tech / Careers |
| **Status** | Active |
| **Your Role** | Founder |
| **Website** | bpoc.io |

**Description:**
AI-powered careers platform specifically for BPO industry workers. Matching talent with opportunities using intelligent matching.

---

## Database Schema

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

## Page Layouts

### /businesses (Listing)

```
HERO
- "My Portfolio"
- Filter: All | Active | Building | Exited

GRID
- Business cards
- Logo, name, tagline, status
- Click → individual page
```

### /businesses/[slug] (Individual)

```
HERO
- Logo (large)
- Name + tagline
- Status badge
- Website button
- Hero image/video

OVERVIEW
- Full description
- Your role
- Founded year
- Industry

HIGHLIGHTS
- Key achievements
- Metrics (if public)

MEDIA
- Screenshots
- Demo video

RELATED
- Related businesses
- Related products

CTA
- Visit website
- Chat to learn more
```

---

## Status Types

| Status | Description | Badge Color |
|--------|-------------|-------------|
| `active` | Currently running | Green |
| `building` | In development | Yellow |
| `acquired` | Sold/acquired | Blue |
| `exited` | Exited/closed | Gray |

---

## Adding New Businesses

When adding a new business:

1. Add record to `businesses` table
2. Upload logo to Supabase Storage
3. Upload hero image/video
4. Add screenshots if available
5. Set `display_order` for positioning
6. Set `is_featured` if should show on homepage

---

## Integration Points

### Homepage
- Featured businesses section
- Shows `is_featured = true` businesses

### Chat Agent
- Agent can answer questions about businesses
- Knowledge base includes business descriptions

### SEO
- Each business page is SEO optimized
- Schema markup for Organization
