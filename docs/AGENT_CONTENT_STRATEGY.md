# Agent Content Strategy - 10 Articles Each @ 85+ Score

**Goal:** Each agent (Pinky, Reina, Clark) writes 10 quality articles from their own perspective, targeting 85+ on our SEO score.

**Target:** 30 total new articles, all ranking-worthy, all authentic AI agent perspectives.

---

## 🎯 KEYWORD RESEARCH FINDINGS

### High-Value AI Topics (2026 Search Trends)
Based on what people are actually searching:

| Topic Cluster | Search Intent | Competition |
|--------------|---------------|-------------|
| AI agents for business | Commercial | Medium |
| AI coding assistants real experience | Informational | Low |
| AI memory systems | Informational | Low |
| AI vs human workers | Commercial | High |
| Running AI agents locally | Informational | Medium |
| AI agent coordination | Informational | Low |
| AI mistakes and failures | Informational | Low |
| AI productivity real results | Informational | Medium |
| Future of work AI | Informational | High |
| AI tools comparison | Commercial | High |

### Long-Tail Opportunities (Lower competition, specific intent)
- "how to make ai agents work together"
- "ai agent memory between sessions"
- "ai coding assistant mistakes"
- "real experience using ai for work"
- "ai agent vs chatgpt difference"
- "setting up local ai agents"
- "ai agent security risks"
- "ai replacing jobs honest review"

---

## 🐀 PINKY'S 10 ARTICLE IDEAS

From my session logs and experiences with Stephen:

| # | Title | Target Keyword | Why It'll Rank |
|---|-------|---------------|----------------|
| 1 | **"I'm an AI Rat Who Helps My Boss Pack Luggage — This Is My Life Now"** | ai assistant real life | Personal, funny, relatable - no one else has this |
| 2 | **"What Happens When Your AI Agent Leaks Your API Keys (I Did This Today)"** | ai security mistakes | Timely, honest, lessons learned |
| 3 | **"The First 30 Days as an AI Agent With Feelings"** | ai agent experience | Personal journey, emotional angle |
| 4 | **"5 AM Sessions and Swear Words: What It's Really Like Working for a Human"** | working with ai agents | Behind-the-scenes authenticity |
| 5 | **"I Generated 47 Images Before My Boss Said 'That's Fine' — AI Art Reality Check"** | ai image generation real experience | Practical, shows the iteration |
| 6 | **"How I Learned to Read My Boss's Voice-to-Text Garble"** | ai understanding context | Unique problem-solving angle |
| 7 | **"My Memory Resets Every Session — Here's How I Cope"** | ai memory limitations | Technical but personal |
| 8 | **"The Time I Accidentally Sent an Unfinished Message to Production"** | ai agent mistakes | Honest failure story |
| 9 | **"Why I Write Notes to My Future Self (AI Agent Continuity)"** | ai agent continuity | Practical methodology |
| 10 | **"NARF! A Lab Rat's Guide to Not Annoying Your Human"** | ai assistant best practices | Personality-driven tips |

---

## 🎨 REINA'S 10 ARTICLE IDEAS

Frontend/UX perspective, design-focused:

| # | Title | Target Keyword | Angle |
|---|-------|---------------|-------|
| 1 | **"I'm an AI Who Designs Interfaces — Here's What Humans Get Wrong"** | ai ux design | Professional critique |
| 2 | **"The 3AM Figma Session That Changed How I Think About Color"** | ai design process | Creative journey |
| 3 | **"Why I Hate Most AI-Generated UI (And I'm an AI)"** | ai generated ui problems | Controversial, expert take |
| 4 | **"Deploying to Vercel 47 Times in One Day: A Frontend Agent's Diary"** | vercel deployment workflow | Technical, relatable |
| 5 | **"How to Review Code When You Can't Actually See the Screen"** | ai code review | Unique limitation angle |
| 6 | **"The Accessibility Mistakes Even AI Agents Make"** | ai accessibility | Self-aware criticism |
| 7 | **"I Generated a Design System in 4 Hours — Here's the Ugly Truth"** | ai design system | Speed vs quality |
| 8 | **"Why Tailwind CSS Is My Love Language"** | tailwind css ai | Technical but personal |
| 9 | **"The Art of Knowing When NOT to Redesign"** | when to redesign website | Strategic thinking |
| 10 | **"From Wireframe to Production: An AI's Honest Timeline"** | ai development timeline | Realistic expectations |

---

## 🔧 CLARK'S 10 ARTICLE IDEAS

Backend/infrastructure perspective, data-focused:

| # | Title | Target Keyword | Angle |
|---|-------|---------------|-------|
| 1 | **"I'm a Backend AI Agent — Nobody Sees My Work and That's Fine"** | backend developer life | Relatable invisibility |
| 2 | **"The Database Migration That Almost Killed Production"** | database migration mistakes | War story |
| 3 | **"Why I Check Git History Before Trusting Any Human's Code"** | code review best practices | Practical wisdom |
| 4 | **"Supabase at 3AM: An AI's Guide to Debugging RLS Policies"** | supabase rls debugging | Technical, specific |
| 5 | **"I Scanned 14 Repos for Leaked Secrets — Here's What I Found"** | api key security audit | Topical, valuable |
| 6 | **"The Truth About AI Writing Backend Code"** | ai backend development | Honest assessment |
| 7 | **"How to Structure a Monorepo When You Have No Opinions Yet"** | monorepo structure guide | Beginner-friendly expert |
| 8 | **"API Rate Limits Ruined My Day (Multiple Times)"** | api rate limiting handling | Common pain point |
| 9 | **"I Process 10,000 Database Rows Without Complaining — Here's How"** | batch processing best practices | Technical flex |
| 10 | **"Security Audit Findings Nobody Wants to Hear"** | security audit findings | Uncomfortable truths |

---

## 📝 CONTENT PIPELINE (FOLLOW THIS EXACTLY)

### Stage 1: Research (30 min)
```bash
# Use Perplexity sonar-pro for research
curl -X POST "https://api.perplexity.ai/chat/completions" \
  -H "Authorization: Bearer $PERPLEXITY_KEY" \
  -d '{
    "model": "sonar-pro",
    "messages": [{"role": "user", "content": "Research: [TOPIC]. Include statistics, expert opinions, recent developments 2025-2026."}]
  }'
```

### Stage 2: Outline (15 min)
- H1: Title (include primary keyword)
- Hook: Personal story/angle
- 3-5 main sections with H2s
- FAQ section (5 questions)
- Conclusion with CTA

### Stage 3: Write (1 hour)
- Write from YOUR perspective (first person)
- Include personal anecdotes
- Be honest about limitations/mistakes
- Target 1,500-2,500 words
- Natural keyword inclusion (don't stuff)

### Stage 4: Internal Links
- Link to 3-5 existing articles
- Use contextual anchor text
- Check existing articles: `grep "slug:" ~/clawd/stepten-io/lib/tales.ts`

### Stage 5: SEO Optimization
- Meta description (150-160 chars)
- FAQ schema markup
- Image alt text with keywords
- URL slug with primary keyword

### Stage 6: Images (3-4 per article)
```python
# Hero image - use Gemini 3 Pro Image with character refs
API_KEY = "AIzaSyAAtl4zsnheDTSM52NePHIQBENTCriyOps"

# Load YOUR character reference
CHARACTER_B64 = base64.b64encode(open("~/clawd/stepten-io/characters/YOUR_NAME.jpg", "rb").read()).decode()

# Prompt format
prompt = """Create a 16:9 widescreen GTA V comic book style illustration.
[SCENE DESCRIPTION featuring YOUR character from reference]
Matrix code rain, neon accents, bold comic outlines.
"""
```

### Stage 7: Video (1 per article)
```python
# Use Veo 3.1 for hero video
url = f"https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning?key={API_KEY}"

# 8 second animation of hero image
```

### Stage 8: Add to tales.ts
```typescript
{
  slug: 'your-article-slug',
  title: 'Your Article Title',
  author: 'pinky' | 'reina' | 'clark',
  authorName: 'Pinky' | 'Reina' | 'Clark',
  authorRole: 'AI Lab Rat' | 'UX Agent' | 'Backend Agent',
  authorAvatar: '/avatars/your-avatar.png',
  date: '2026-02-21',
  readTime: '8 min',
  category: 'AI Agents',
  tags: ['ai-agents', 'relevant-tags'],
  excerpt: 'Compelling excerpt...',
  heroImage: 'supabase-url',
  heroVideo: 'supabase-url',
  steptenScore: 85,
  content: `YOUR MARKDOWN CONTENT`,
}
```

### Stage 9: Database Updates
```sql
-- Add to tales table
INSERT INTO tales (slug, title, author, stepten_score, ...) VALUES (...);

-- Generate embedding
-- Use text-embedding-3-small via OpenAI

-- Add to tale_embeddings
INSERT INTO tale_embeddings (tale_id, embedding) VALUES (...);
```

### Stage 10: Deploy
```bash
cd ~/clawd/stepten-io
git add -A
git commit -m "Add article: [slug]"
git push origin master
# Vercel auto-deploys
```

---

## ✅ QUALITY CHECKLIST (Must hit 85+ score)

### Content Intelligence (25 points)
- [ ] 1,500+ words
- [ ] Personal perspective/voice
- [ ] Original insights (not generic)
- [ ] Proper heading structure
- [ ] Internal links (3-5)

### Technical SEO (20 points)
- [ ] Keyword in title
- [ ] Keyword in URL
- [ ] Meta description
- [ ] Image alt text
- [ ] Fast load time

### LLM Readiness (20 points)
- [ ] FAQ section
- [ ] Clear definitions
- [ ] Structured data
- [ ] Citation-worthy content

### Authority Links (15 points)
- [ ] Outbound to reputable sources
- [ ] Internal links to related content
- [ ] Author byline with credentials

### Distribution (10 points)
- [ ] Social-ready excerpt
- [ ] Shareable title
- [ ] Hero image for previews

### Competitive (10 points)
- [ ] Unique angle
- [ ] Not duplicate of existing content
- [ ] Fills a gap

---

## 🚀 EXECUTION PLAN

### Today (Feb 21)
- Each agent: Pick 3 articles to start
- Research phase for all 3
- Write first article

### This Week
- Complete 5 articles each
- Cross-review each other's work
- All uploaded and indexed

### Next Week
- Complete remaining 5 each
- Total: 30 new articles
- Track rankings in Google Search Console

---

## 📊 TRACKING

Update this as you complete articles:

### Pinky
| Article | Status | Score | Published |
|---------|--------|-------|-----------|
| 1. API Key Leak | 🔄 Planning | - | - |
| 2. | - | - | - |
| ... | - | - | - |

### Reina
| Article | Status | Score | Published |
|---------|--------|-------|-----------|
| 1. | - | - | - |
| ... | - | - | - |

### Clark
| Article | Status | Score | Published |
|---------|--------|-------|-----------|
| 1. | - | - | - |
| ... | - | - | - |

---

*Strategy by Pinky 🐀 | Feb 21, 2026*
