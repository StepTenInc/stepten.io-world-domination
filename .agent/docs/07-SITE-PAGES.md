# 07 — Site Pages

---

## Homepage (`/`)

### Sections

```
1. HERO
   - Your name/brand
   - One-liner: "Builder. Investor. AI & Automation Obsessed."
   - CTA: Explore Businesses | View Products
   - Animated/futuristic design (dark + green)

2. BUSINESSES (Portfolio)
   - Grid of business cards
   - Logo, name, tagline, status badge
   - Click → /businesses/[slug]

3. PRODUCTS
   - Featured products
   - Quick buy/demo CTAs
   - Click → /products/[slug]

4. SERVICES
   - Consulting packages teaser
   - "Work With Me" section
   - Handled by chat agent

5. CONTENT
   - Latest articles
   - Featured course
   - YouTube embed or link

6. ABOUT TEASER
   - Quick bio
   - "20+ years in business, started at 18"
   - Link to full /about

7. CHAT WIDGET
   - Always visible (bottom right)
   - "Got questions? Talk to my AI"
```

---

## About Page (`/about`)

### Sections

```
1. HERO
   - Your photo (optional) or stylized graphic
   - "Hey, I'm [Name]"
   - One-liner

2. THE STORY
   - Started at 18, now 39
   - 20+ years in business
   - What you've learned
   - Your approach

3. WHAT I DO
   - Build businesses
   - Create AI tools
   - Consult/advise
   - Teach (YouTube, courses)

4. EXPERTISE
   - Visual skill bars or tags
   - SEO, Marketing, Dev, AI, Automation, Business Strategy

5. BUSINESSES
   - Quick grid linking to /businesses

6. VALUES / APPROACH
   - Contrarian views
   - How you work
   - What you believe

7. WORK WITH ME
   - Services overview
   - Chat CTA (no contact form)

8. CONNECT
   - Social links (YouTube, Twitter/X, LinkedIn, etc)
```

---

## Businesses Page (`/businesses`)

### Layout

```
1. HERO
   - "My Portfolio"
   - Subtitle about building businesses

2. FILTERS
   - All | Active | Building | Exited

3. BUSINESS GRID
   - Cards for each business
```

### Business Card Component

```
┌─────────────────────────────────────┐
│  [LOGO]                             │
│                                     │
│  ShoreAgents                        │
│  Offshore BPO staffing solutions    │
│                                     │
│  🟢 Active    |    BPO / Staffing   │
│                                     │
│  [View Details]  [Visit Site →]     │
└─────────────────────────────────────┘
```

---

## Individual Business Page (`/businesses/[slug]`)

### Sections

```
1. HERO
   - Business logo (large)
   - Name + tagline
   - Status badge
   - Website link button
   - Hero image/video background

2. OVERVIEW
   - Full description
   - Your role
   - Founded year
   - Industry

3. HIGHLIGHTS
   - Key metrics/achievements
   - Visual cards or animated counters

4. SCREENSHOTS/MEDIA
   - Product screenshots
   - Demo video if available

5. RELATED
   - Other businesses in same space
   - Products that complement

6. CTA
   - Visit website
   - Chat to learn more
```

---

## Services Page (`/services`)

### Layout

```
1. HERO
   - "Work With Me"
   - "High-level consulting & implementation for serious founders"

2. CONSULTING PACKAGES

   ┌─────────────────────────────────────┐
   │  ONE-OFF SESSION                    │
   │  $500 USD                           │
   │                                     │
   │  • 1 hour call                      │
   │  • Strategy & implementation        │
   │  • Recording provided               │
   │  • Action plan delivered            │
   │                                     │
   │  [Book via Chat]                    │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │  MONTHLY RETAINER                   │
   │  $750 USD/month                     │
   │                                     │
   │  • 2 sessions per month             │
   │  • Async support via chat           │
   │  • Priority access                  │
   │  • Ongoing strategy                 │
   │                                     │
   │  [Book via Chat]                    │
   └─────────────────────────────────────┘

3. DEV WORK

   ┌─────────────────────────────────────┐
   │  BLOCK HOURS                        │
   │  $250 USD/hour                      │
   │                                     │
   │  • 10 hour blocks                   │
   │  • Web apps, AI, automation         │
   │  • Full stack builds                │
   │  • Max 10hrs/month available        │
   │                                     │
   │  [Enquire via Chat]                 │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │  CUSTOM PROJECT                     │
   │  Quote                              │
   │                                     │
   │  • MVPs, full apps                  │
   │  • AI integrations                  │
   │  • Automation systems               │
   │  • Full scoping & proposal          │
   │                                     │
   │  [Get Quote via Chat]               │
   └─────────────────────────────────────┘

4. PARTNERSHIPS / EQUITY
   - Looking for the right startup
   - What you bring (tech, marketing, experience)
   - Serious enquiries only
   - [Apply via Chat]

5. NOT FOR YOU IF...
   - "Idea guys" with no skin in the game
   - People who want free advice
   - Anyone not ready to execute
```

---

## Products Page (`/products`)

### Layout (Outer View)

```
1. HERO
   - "Tools & Products"
   - Subtitle

2. FILTERS
   - All | Free | Paid | Coming Soon

3. PRODUCT GRID
   - Cards showing:
     - Thumbnail
     - Name
     - Tagline
     - Price/CTA
     - Click → /products/[slug]
```

---

## Individual Product Page (`/products/[slug]`)

### Layout (Public Demo View)

```
1. HERO
   - Product name
   - Tagline
   - Demo video or hero image
   - CTA: Get Started | View Demo

2. FEATURES
   - Feature list with icons
   - Screenshots

3. PRICING
   - Price display
   - What's included
   - CTA to sign up/buy

4. FAQ
   - Common questions

5. RELATED
   - Other products
```

---

## Directory Page (`/directory`)

### Layout

```
1. HERO
   - "Tools I Use & Recommend"
   - "Honest reviews, affiliate links disclosed"

2. FILTERS
   - Category: AI | Dev | Marketing | Business | Automation
   - Type: Free | Paid | Freemium

3. TOOL GRID

   ┌─────────────────────────────────────┐
   │  [LOGO]  Vercel                     │
   │                                     │
   │  ⭐⭐⭐⭐⭐  "Best deployment platform" │
   │                                     │
   │  Category: Dev                      │
   │  Price: Freemium                    │
   │                                     │
   │  [Read Review]  [Try It →]          │
   └─────────────────────────────────────┘
```

---

## Articles Hub (`/articles`)

### Layout

```
1. HERO
   - "Articles"
   - Search bar

2. FILTERS
   - By silo/topic
   - By date

3. ARTICLE GRID
   - Cards with:
     - Featured image
     - Title
     - Excerpt
     - Read time
     - Click → /[slug]

4. SILOS SECTION
   - Links to pillar pages
   - /topics/[silo]
```

---

## Article Page (`/[slug]`)

### Supporting Article Template

```
1. HEADER
   - Title (H1)
   - Meta (author, date, read time)
   - Featured image

2. TABLE OF CONTENTS
   - Sidebar (sticky)
   - Jump links to H2s

3. CONTENT
   - Full article
   - Internal links
   - Outbound links
   - Affiliate links (marked)
   - Images with alt text

4. AUTHOR BOX
   - Your info
   - Social links

5. RELATED ARTICLES
   - Same silo
   - Related topics

6. CTA
   - Newsletter signup
   - Product promo
```

---

## Silo Pillar Page (`/topics/[silo]`)

### Pillar Template (Sick Design)

```
1. HERO (Full screen, animated)
   - Topic name
   - Topic description
   - Visual elements (3D, particles, etc)

2. OVERVIEW
   - What this topic covers
   - Why it matters

3. CONTENT SECTIONS
   - Rich media
   - Interactive elements
   - Key concepts

4. SUPPORTING ARTICLES
   - Grid of linked articles
   - Visual silo map

5. RESOURCES
   - Related products
   - Tools
   - Courses

6. CTA
   - Newsletter
   - Product
```

---

## Dashboard Pages

### Dashboard Home (`/dashboard`)

```
- Welcome message
- Quick stats
- Recent activity
- Quick links to products/courses
- Chat widget (onboarding/support agent)
```

### User Products (`/dashboard/products`)

```
- Grid of purchased/accessible products
- Progress indicators
- Click → full product access
```

### User Courses (`/dashboard/courses`)

```
- Enrolled courses
- Progress bars
- Continue learning CTAs
```

---

## Admin Pages

### Admin Dashboard (`/admin`)

```
- Overview stats
- Recent activity
- Quick links to sections
- Alerts/notifications
```

### SEO Engine (`/admin/seo`)

```
- Article stats (by status)
- Recent articles
- Quick actions (new article)
- Silo health overview
```

### Silo Visualization (`/admin/seo/silos`)

```
- Visual map of silos
- Articles as nodes
- Links shown as connections
- Click to drill down
- Health indicators
```
