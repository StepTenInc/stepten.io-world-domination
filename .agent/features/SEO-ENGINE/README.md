# 🚀 SEO Content Engine - Feature Documentation

**Feature ID:** `seo-engine`  
**Status:** 🟡 In Development  
**Created:** 2026-01-10  
**Last Updated:** 2026-01-10 11:00 SGT  
**Owner:** Stephen Ten

---

## 📋 Overview

The SEO Content Engine is an 8-step AI-powered pipeline that transforms voice ideas into fully optimized, published articles. Each step uses specific AI models for maximum quality.

---

## 🗂️ Documentation Structure

```
.agent/features/SEO-ENGINE/
├── README.md                    ← You are here
├── SETUP.md                     ← Installation & configuration
├── CURRENT-STATE.md             ← What's working now
├── ERROR-LOG.md                 ← Bugs fixed with timestamps
├── FUTURE-IMPROVEMENTS.md       ← Roadmap & ideas
└── prompts/                     ← AI prompts for each step
    ├── step-1-voice-idea.md
    ├── step-2-research.md
    ├── step-3-framework.md
    ├── step-4-writing.md
    ├── step-5-humanize.md
    ├── step-6-optimize.md
    ├── step-7-styling.md
    └── step-8-publish.md
```

---

## 🔧 Tech Stack for This Feature

| Component | Technology | Purpose |
|-----------|------------|---------|
| Voice Transcription | OpenAI Whisper | Step 1 - Voice to text |
| Research | Perplexity Sonar | Step 2 - Deep research |
| Framework | Claude 4.5 Sonnet | Step 3 - Article structure |
| Writing | Claude 4.5 Sonnet | Step 4 - Full article |
| Humanization | Grok 4.1 | Step 5 - Remove AI patterns |
| Optimization | Gemini 3 Pro | Step 6 - SEO & schema |
| Image Generation | DALL-E 3 / Flux | Step 7 - Article images |
| Publishing | Internal | Step 8 - Database & deploy |

---

## 📊 Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SEO CONTENT ENGINE                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  🎤 Step 1      🔍 Step 2      📋 Step 3      ✍️ Step 4            │
│  Voice/Text → Research → Framework → Writing                       │
│  [Whisper]    [Perplexity]  [Claude]    [Claude]                   │
│                                                                     │
│  🧠 Step 5      ⚡ Step 6      🎨 Step 7      🚀 Step 8            │
│  Humanize → Optimize → Styling → Publish                           │
│  [Grok]      [Gemini]   [DALL-E]   [Database]                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Related Files

### UI Pages
- `/app/(admin)/admin/seo/page.tsx` - Main dashboard
- `/app/(admin)/admin/seo/articles/new/step-1-idea/page.tsx`
- `/app/(admin)/admin/seo/articles/new/step-2-research/page.tsx`
- `/app/(admin)/admin/seo/articles/new/step-3-framework/page.tsx`
- `/app/(admin)/admin/seo/articles/new/step-4-writing/page.tsx`
- `/app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`
- `/app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx`
- `/app/(admin)/admin/seo/articles/new/step-7-styling/page.tsx`
- `/app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`

### API Routes (To Be Built)
- `/app/api/seo/transcribe/route.ts`
- `/app/api/seo/research/route.ts`
- `/app/api/seo/framework/route.ts`
- `/app/api/seo/write/route.ts`
- `/app/api/seo/humanize/route.ts`
- `/app/api/seo/optimize/route.ts`
- `/app/api/seo/generate-image/route.ts`
- `/app/api/seo/publish/route.ts`

### Database Tables
- `articles` - Main article storage
- `article_ideas` - Saved ideas
- `article_research` - Research data
- `article_silos` - Content silos
- `article_images` - Generated images

---

## 📚 Quick Links

- [Setup Guide](./SETUP.md)
- [Current State](./CURRENT-STATE.md)
- [Error Log](./ERROR-LOG.md)
- [Future Improvements](./FUTURE-IMPROVEMENTS.md)
- [Prompts Directory](./prompts/)

---

*Last updated by: Antigravity Agent*
