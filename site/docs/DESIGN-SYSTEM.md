# StepTen.io Design System

## Philosophy
- Nothing boring. Every element has life.
- Comic book meets Matrix meets GTA
- Characters ARE the brand
- Animations everywhere (Remotion)

---

## COLOR PALETTE

### Base
- **Black** `#000000` - Primary background
- **Matrix Green** `#00FF41` - Primary accent, code rain

### Site UI Colors (Buttons, CTAs, Links)
| Purpose | Color | Hex | Use |
|---------|-------|-----|-----|
| Primary Button | Matrix Green | `#00FF41` | Main CTAs, important actions |
| Secondary Button | White/Outline | `#FFFFFF` | Secondary actions |
| Danger/Alert | Red | `#FF3333` | Warnings, destructive |
| Success | Bright Green | `#00FF88` | Confirmations |
| Highlight | Orange | `#FF6B00` | Attention, urgency |

### Character Accents (Their sections/content only)
| Character | Color | Hex | When to use |
|-----------|-------|-----|-------------|
| Stephen | Teal/Cyan | `#00FFFF` | His articles, his quotes, his section |
| Reina | Purple | `#9D00FF` | Her articles, her quotes, her section |
| Pinky | Hot Pink | `#FF1493` | My articles, my quotes, my section |
| Clark | Electric Blue | `#0080FF` | His articles, his quotes, his section |

### Supporting
- **White** `#FFFFFF` - Text, highlights
- **Gray 100** `#E5E5E5` - Secondary text
- **Gray 500** `#666666` - Muted text
- **Gray 900** `#111111` - Card backgrounds

---

## TYPOGRAPHY

### Fonts
- **Headlines:** Bold, impactful (Bebas Neue, Oswald, or custom)
- **Body:** Clean, readable (Inter, Plus Jakarta Sans)
- **Code/Tech:** Monospace (JetBrains Mono, Fira Code)

### Scale
- Hero: 72-96px (massive, animated)
- H1: 48-64px
- H2: 36-48px
- H3: 24-32px
- Body: 16-18px
- Small: 12-14px

---

## COMPONENTS NEEDED

### 1. Navigation (Reusable)
- Logo left (STEPTEN.io with green glow)
- Links center or right
- Sticky on scroll
- Subtle animation on scroll (glass morphism or border glow)
- Mobile hamburger with full-screen takeover

### 2. Footer (Reusable)
- Character avatars row (links to their sections)
- Social links
- "Try to take over the world" tagline
- Matrix code rain subtle in background

### 3. Hero Section
- Full viewport height
- Character showcase (rotating or all visible)
- Animated headline text (typewriter, glitch, or reveal)
- "Enter the world" CTA button with glow
- Particle/code rain background (subtle, not distracting)

### 4. Character Cards
- Avatar image (prominent)
- Name + Role
- Character color accent (border/glow)
- Hover: Expand with quote or description
- Click: Goes to their section/articles

### 5. Article/Issue Cards
- Comic panel style frame
- Featured image
- Title + excerpt
- Author avatar + name (character)
- Character color accent
- "Issue #XX" badge

### 6. Quote Blocks
- Large text, character avatar
- Character color accent
- Dramatic styling (like comic speech bubble or modern pull quote)

### 7. CTA Sections
- Full-width
- Strong headline
- Animated button
- Background could be character silhouette or energy

### 8. Section Dividers
- Not boring lines
- Could be: circuit patterns, code snippets, character silhouettes
- Animated on scroll

---

## ANIMATION REQUIREMENTS

### Page Load
- Hero text reveals with glitch/typewriter effect
- Characters fade/slide in
- Code rain starts subtly

### Scroll Animations
- Elements fade up on enter viewport
- Parallax on certain layers
- Character cards have hover energy (glow pulse)

### Interactions
- Buttons: Glow intensify + slight scale on hover
- Cards: Lift + shadow + border glow on hover
- Links: Color shift to character color

### Special Effects (Remotion)
- Hero could have video intro
- Transitions between sections
- Loading states with character animations

---

## PAGE STRUCTURE (MVP)

### Homepage (Issue #1)
1. **Hero** - "Welcome to the comic book" + character showcase
2. **The Story** - Brief intro, what this is about
3. **Meet the Crew** - 4 character cards
4. **Latest Issues** - Recent articles grid
5. **The Philosophy** - Quote block (Stephen's manifesto)
6. **CTA** - "Start your story" / Newsletter / Whatever

### Character Pages (later)
- Each character gets their own page
- Their articles/issues listed
- Their backstory, their voice

### Blog/Issues (later)
- Article list with filters by character/topic
- Individual article pages (comic panel style?)

---

## ASSETS AVAILABLE

### Character Avatars
- `stephen_official.jpg` - Teal glasses, trucker cap, lightning
- `reina_official.jpg` - Purple highlights, choker, baddie
- `pinky_avatar_laser.jpg` - Grey rat, green laser eyes, gold earring
- `clark_official.jpg` - TBD (coming from Raina)

### Logo
- Need: STEPTEN.io wordmark
- Style: Tech/matrix, green glow effect

---

## FOR RAINA

### What I need from you:
1. **Logo** - STEPTEN.io wordmark in the style
2. **Component mockups** - How the cards, nav, footer should look
3. **Hero layout** - How characters are displayed
4. **Any additional character art** - Action poses, silhouettes, etc.
5. **Animation direction** - What should move, how aggressive

### Style References:
- Matrix code rain aesthetic
- GTA loading screens / character intros
- Comic book panels
- Cyberpunk 2077 UI elements
- Neon noir

---

## TECH STACK (For Build)

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion + Remotion for video
- **Fonts:** Google Fonts or self-hosted
- **Deployment:** Vercel
- **CMS (later):** Notion API, Contentlayer, or simple MDX

---

## NOTES

- No user auth needed
- No complex backend
- Just sick frontend + content
- Can add features later
- Focus: Look amazing, rank well, tell the story
