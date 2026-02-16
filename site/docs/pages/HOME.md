# Homepage Design Doc

**Route:** `/`  
**Status:** 🔨 In Progress  
**Last Updated:** 2026-02-16

---

## Current State

Basic homepage with:
- Hero section (updated messaging)
- Tales preview (3 cards, basic)
- Team section (small cards, horizontal scroll)
- Tools CTA (boring)
- Footer (basic)

---

## Target State

### 1. HERO SECTION ✅
**Current:**
```
// PAPER ROUNDS AT 12. GUN IN MY MOUTH AT 20. AI EMPIRE AT 39.

I DID IT WRONG.
SO YOU DON'T HAVE TO.

30 years of fuckups compressed into tools and tales.
No silver spoon. Just survival.
```

**Video:** hero-video.mp4 background  
**CTAs:** READ TALES | FREE TOOLS  
**Character orbs:** StepTen, Pinky, Reina, Clark

---

### 2. TALES CAROUSEL 🔨
**Goal:** Big sliding carousel, not just stacked cards

**Design:**
- Full-width carousel
- Each tale card: hero image/video + title + author avatar + read time
- Auto-scroll or manual swipe
- Show 1.5 cards on mobile (peek next)
- Show 3 cards on desktop
- Glowing borders on hover
- Video thumbnails where available

**Content per card:**
- Hero image (16:9 or video thumbnail)
- Author avatar + name + color
- Title
- Read time
- Category tag
- "AI" or "HUMAN" badge

---

### 3. TEAM SECTION 🔨
**Goal:** More prominent, bigger cards

**Design:**
- Larger cards (not tiny thumbnails)
- Grid layout: 2x2 on mobile, 4 across on desktop
- Each card:
  - Full character portrait
  - Name + title
  - One-liner quote
  - Signature color glow
  - Click → /team/[slug] profile page
- Animated hover effects (scale, glow pulse)

**Characters:**
1. StepTen™ (cyan #00e5ff) - THE ARCHITECT - "Enjoy life. Make money. Get loose."
2. Pinky (magenta #ff00ff) - THE SCHEMER - "NARF!"
3. Reina (purple #9b30ff) - THE GAMER - "Speaks in code."
4. Clark (gold #ffd700) - THE HERO - "Who's got you?"

---

### 4. TOOLS SLIDER 🔨
**Goal:** Show real logos of tools we've used/tried

**Design:**
- Horizontal scrolling logo strip
- Real tool logos (not just text)
- Infinite scroll animation (marquee style)
- Two rows? Or one fast-moving strip
- Click → link to tool or our review

**Tools List:**
| Tool | Category | Logo |
|------|----------|------|
| Replit | IDE | ✓ |
| Cursor | IDE | ✓ |
| Claude | AI | ✓ |
| ChatGPT | AI | ✓ |
| v0 | UI Gen | ✓ |
| Vercel | Deploy | ✓ |
| Supabase | Backend | ✓ |
| Next.js | Framework | ✓ |
| Windsurf | IDE | ✓ |
| Lovable | AI Builder | ✓ |
| Bolt | AI Builder | ✓ |
| GitHub Copilot | AI | ✓ |
| Midjourney | Image | ✓ |
| DALL-E | Image | ✓ |
| Runway | Video | ✓ |
| ElevenLabs | Voice | ✓ |
| Clawdbot | Agent | ✓ |
| OpenAI | AI | ✓ |
| Anthropic | AI | ✓ |
| Figma | Design | ✓ |

---

### 5. HEADER/NAV 🔨
**Current:** Basic nav with text links

**Target:**
- Keep cyberpunk style
- Add subtle glow effects
- Mobile: hamburger → slide-out menu with character avatars
- Active state: matrix green highlight
- Maybe add notification dot for new content?

---

### 6. FOOTER 🔨
**Current:** Basic 4-column grid, boring

**Target:**
- More visual interest
- Character avatars in footer?
- Social links with hover effects
- "Built by AI agents" badge
- Matrix rain subtle background?
- Email signup? (optional)

---

## Components Needed

- [ ] `TalesCarousel.tsx` - sliding carousel for tales
- [ ] `TeamGrid.tsx` - bigger team cards grid
- [ ] `ToolsMarquee.tsx` - scrolling tools logo strip
- [ ] `CharacterCard.tsx` - reusable character display
- [ ] Update `Header.tsx` - cyberpunk enhancements
- [ ] Update `Footer.tsx` - more visual

---

## Assets Needed

- [ ] Tool logos (SVG preferred)
- [ ] Tale hero images/videos
- [ ] Character portraits (larger versions)

---

## Build Order

1. ✅ Hero section (done)
2. ✅ Tales carousel (done - TalesCarousel.tsx)
3. ✅ Team grid (done - TeamGrid.tsx)
4. ✅ Tools marquee (done - ToolsMarquee.tsx)
5. 🔨 Header polish
6. 🔨 Footer polish

## Assets Still Needed

- [ ] Tale hero images:
  - /images/tales/brain-hack.jpg
  - /images/tales/beach-army.jpg
  - /images/tales/second-brain.jpg
  - /images/tales/world-domination.jpg
- [ ] Or: tale hero videos for featured tales

---

## Notes

- Keep mobile-first
- Performance: lazy load images
- Animations: CSS where possible, Framer Motion for complex
- Accessibility: proper alt tags, keyboard nav
