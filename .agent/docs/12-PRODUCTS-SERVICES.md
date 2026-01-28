# 12 — Products & Services

---

## Services

### Consulting Packages

#### One-Off Session

| Field | Value |
|-------|-------|
| **Name** | One-Off Consulting Session |
| **Price** | $500 USD |
| **Type** | Fixed |

**Includes:**
- 1 hour call
- Strategy & implementation focus
- Recording provided
- Action plan delivered

**Booking:** Via chat agent

---

#### Monthly Retainer

| Field | Value |
|-------|-------|
| **Name** | Monthly Retainer |
| **Price** | $750 USD/month |
| **Type** | Monthly |

**Includes:**
- 2 sessions per month
- Async support via chat
- Priority access
- Ongoing strategy

**Booking:** Via chat agent

---

### Dev Work

#### Block Hours

| Field | Value |
|-------|-------|
| **Name** | Block Hours |
| **Price** | $250 USD/hour |
| **Type** | Hourly |
| **Availability** | Max 10 hours/month |

**Includes:**
- 10 hour blocks
- Web apps, AI, automation
- Full stack builds

**Booking:** Via chat agent

---

#### Custom Project

| Field | Value |
|-------|-------|
| **Name** | Custom Project |
| **Price** | Quote |
| **Type** | Quote |

**Includes:**
- MVPs, full apps
- AI integrations
- Automation systems
- Full scoping & proposal

**Booking:** Via chat agent

---

### Partnership / Equity

| Field | Value |
|-------|-------|
| **Name** | Partnership / Equity |
| **Price** | Equity + Advisory Fee |
| **Type** | Custom |

**Looking for:**
- Right startup opportunity
- Serious founders only
- Skin in the game required

**What you bring:**
- Full stack development (AI, web apps, automation)
- Marketing & SEO experience
- Business strategy (20+ years)
- Speed (ship in days, not months)

**Apply:** Via chat agent (qualifying questions)

---

## Products

### SEO Content Engine

| Field | Value |
|-------|-------|
| **Name** | SEO Content Engine |
| **Tagline** | AI-powered content creation pipeline |
| **Price Type** | Quote / Custom Build |
| **Status** | Active |

**Description:**
Full AI-powered SEO content creation system. Voice to published article with research, writing, humanization, and optimization.

**Features:**
- Voice-to-text idea capture
- Deep research with Perplexity
- AI writing with Claude
- Humanization with Grok
- SEO optimization with Gemini
- Silo management
- Internal linking intelligence

**Availability:**
- Internal use (StepTen)
- Custom builds for clients (quoted)
- API access (future)

---

### Additional Products (Future)

Products to be added:
- Agent Builder Platform
- Voice-to-Text MCP Controller
- Automated Blog System
- Directory/Affiliate Management System
- Course Platform
- Tools built and released

---

## Database Schema

### Services

```sql
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Pricing
  price_type TEXT CHECK (price_type IN ('fixed', 'hourly', 'monthly', 'quote')),
  price_amount INTEGER,  -- In cents, null for quote
  price_display TEXT,    -- "$500", "$250/hr", "Quote"
  
  -- Details
  features JSONB DEFAULT '[]',
  deliverables JSONB DEFAULT '[]',
  
  -- Availability
  max_per_month INTEGER,  -- e.g., 10 hours
  is_available BOOLEAN DEFAULT TRUE,
  
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Products

```sql
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
```

---

## Page Layouts

### /services

```
HERO
- "Work With Me"
- Subtitle

CONSULTING SECTION
- One-Off Session card
- Monthly Retainer card

DEV WORK SECTION
- Block Hours card
- Custom Project card

PARTNERSHIP SECTION
- What you bring
- What you're looking for
- Apply CTA

NOT FOR YOU IF
- Filters out bad fits
```

### /products (Outer View)

```
HERO
- "Tools & Products"

FILTERS
- All | Free | Paid | Coming Soon

PRODUCT GRID
- Cards with thumbnail, name, tagline
- Click → /products/[slug]
```

### /products/[slug] (Public Demo)

```
HERO
- Name, tagline
- Demo video/image
- CTA buttons

FEATURES
- Feature list
- Screenshots

PRICING
- Price info
- Sign up CTA

FAQ
- Common questions
```

### /dashboard/products/[slug] (Paid Access)

```
FULL PRODUCT ACCESS
- All features unlocked
- Documentation
- Support access
- Usage dashboard (if applicable)
```

---

## Integration Points

### Chat Agent
- Can explain services
- Can explain products
- Qualifies leads for services
- Directs to sign up for products

### Homepage
- Featured products section
- Services teaser

### Knowledge Base
- Product docs in RAG
- Service details for agent
