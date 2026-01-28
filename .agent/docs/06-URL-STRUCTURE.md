# 06 — URL Structure

---

## Public Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/about` | About page (your story) |
| `/businesses` | Portfolio listing |
| `/businesses/[slug]` | Individual business page |
| `/products` | Products listing (outer view) |
| `/products/[slug]` | Product demo page (public) |
| `/services` | Consulting & dev services |
| `/courses` | Course listings |
| `/courses/[slug]` | Course detail (public view) |
| `/directory` | Tool directory / affiliate reviews |
| `/directory/[slug]` | Full tool review |
| `/articles` | Articles hub |
| `/[slug]` | Flat article URLs (SEO optimized) |
| `/topics/[silo]` | Silo pillar pages |
| `/legal/privacy` | Privacy policy |
| `/legal/terms` | Terms of service |

**No /contact page** — Chat agent handles all enquiries

---

## Auth Pages

| URL | Description |
|-----|-------------|
| `/login` | Login page |
| `/register` | Registration page |
| `/forgot-password` | Password reset |
| `/verify` | Email verification |

---

## User Dashboard

| URL | Description |
|-----|-------------|
| `/dashboard` | Dashboard home |
| `/dashboard/products` | User's products (inner view) |
| `/dashboard/products/[slug]` | Full product access (paid check) |
| `/dashboard/courses` | User's courses |
| `/dashboard/courses/[slug]` | Course content |
| `/dashboard/tools/[tool]` | Tool access |
| `/dashboard/billing` | Subscription management |
| `/dashboard/settings` | User settings |
| `/dashboard/support` | Support (paid users only) |

---

## Admin Backend

| URL | Description |
|-----|-------------|
| `/admin` | Admin dashboard |
| `/admin/seo` | SEO Engine dashboard |
| `/admin/seo/articles` | All articles list |
| `/admin/seo/articles/new` | New article flow |
| `/admin/seo/articles/[id]` | Edit article |
| `/admin/seo/articles/[id]/preview` | Article preview |
| `/admin/seo/silos` | Silo visualization |
| `/admin/seo/silos/[id]` | Individual silo |
| `/admin/seo/keywords` | Keyword management |
| `/admin/seo/competitors` | Competitor analysis |
| `/admin/seo/analytics` | SEO analytics |
| `/admin/products` | Product management |
| `/admin/products/[id]` | Edit product |
| `/admin/courses` | Course management |
| `/admin/courses/[id]` | Edit course |
| `/admin/users` | User management |
| `/admin/users/[id]` | User details |
| `/admin/agents` | AI agent management |
| `/admin/agents/conversations` | View conversations |
| `/admin/agents/memories` | View memories |
| `/admin/analytics` | Site analytics |
| `/admin/settings` | System settings |
| `/admin/team` | Team management |

---

## API Routes

| URL | Description |
|-----|-------------|
| `/api/auth/[...supabase]` | Supabase auth handlers |
| `/api/webhooks/stripe` | Stripe webhooks |
| `/api/webhooks/supabase` | Supabase webhooks |
| `/api/articles` | Article CRUD |
| `/api/agents/chat` | Agent chat endpoint |
| `/api/agents/memory` | Agent memory operations |
| `/api/seo/research` | SEO research (Perplexity) |
| `/api/seo/write` | Article writing (Claude) |
| `/api/seo/humanize` | Humanization (Grok) |
| `/api/seo/optimize` | Optimization (Gemini) |
| `/api/mcp` | MCP proxy to Python backend |

---

## URL Notes

### Article URLs (Flat Structure)
Articles use flat URLs for SEO:
- ✅ `stepten.io/my-article-slug`
- ❌ `stepten.io/articles/my-article-slug`

The `/articles` page is the hub/listing only.

### Silo Pillar Pages
Pillar content lives under `/topics/`:
- `stepten.io/topics/ai-automation`
- `stepten.io/topics/seo-strategy`

### Product Views
- **Outer view** (public): `/products/[slug]` — Demo, features, pricing
- **Inner view** (dashboard): `/dashboard/products/[slug]` — Full access for paid users
