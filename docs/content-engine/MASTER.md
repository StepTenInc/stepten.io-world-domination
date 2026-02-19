# StepTen Content Engine v2 - MASTER REFERENCE
**Last Updated:** February 18, 2026
**Verified via:** Direct API queries + Perplexity sonar-pro

---

# PART 1: OUR API KEYS & MODELS

Everything below was queried directly from the APIs. This is what WE have access to.

---

## 1.1 GOOGLE GENERATIVE AI API
**Key:** `Supabase credentials.google_generative_ai_key`
**Endpoint:** `generativelanguage.googleapis.com/v1beta`

### Text Models
| Model ID | Input | Output | Use For |
|----------|-------|--------|---------|
| `gemini-3-pro-preview` | 1M | 65K | **Best quality, complex tasks** |
| `gemini-3-flash-preview` | 1M | 65K | Fast quality |
| `gemini-2.5-pro` | 1M | 65K | Stable production |
| `gemini-2.5-flash` | 1M | 65K | **SEO, fast tasks** |
| `gemini-2.5-flash-lite` | 1M | 65K | Cheapest |
| `deep-research-pro-preview-12-2025` | 131K | 65K | **Deep research** |
| `gemini-2.5-computer-use-preview-10-2025` | 131K | 65K | Browser automation |

### Image Generation Models
| Model ID | Use For |
|----------|---------|
| `imagen-4.0-ultra-generate-001` | **Hero images (highest quality)** |
| `imagen-4.0-generate-001` | Standard photos |
| `imagen-4.0-fast-generate-001` | **Body images (fast)** |
| `gemini-3-pro-image-preview` / `nano-banana-pro-preview` | Multimodal image gen |
| `gemini-2.5-flash-image` | Fast multimodal |

### Video Generation Models
| Model ID | Use For |
|----------|---------|
| `veo-3.1-generate-preview` | **Best quality video** |
| `veo-3.1-fast-generate-preview` | Fast video |
| `veo-3.0-generate-001` | Stable |
| `veo-2.0-generate-001` | Legacy |

### Audio/TTS Models
| Model ID | Use For |
|----------|---------|
| `gemini-2.5-flash-preview-tts` | Text-to-speech |
| `gemini-2.5-pro-preview-tts` | Quality TTS |

### Embedding Models
| Model ID | Use For |
|----------|---------|
| `gemini-embedding-001` | Text embeddings |

---

## 1.2 OPENAI API
**Key:** Supabase `credentials.openai_api_key`
**Endpoint:** `api.openai.com/v1`

### Text Models
| Model ID | Use For |
|----------|---------|
| `gpt-5.2` | **Latest flagship** |
| `gpt-5.2-pro` | Highest quality |
| `gpt-5.1` | Stable |
| `gpt-5-mini` | Fast/cheap |
| `gpt-5-nano` | Cheapest |

### Reasoning Models
| Model ID | Use For |
|----------|---------|
| `o3` | **Latest reasoning** |
| `o3-mini` | Fast reasoning |
| `o1-pro` | Heavy reasoning |

### Audio Models
| Model ID | Use For |
|----------|---------|
| `whisper-1` | **Speech-to-text (BEST)** |
| `gpt-4o-transcribe-diarize` | **With speaker detection** |
| `tts-1-hd` | Quality TTS |

### Image Models
| Model ID | Use For |
|----------|---------|
| `gpt-image-1.5` | Latest image gen |
| `dall-e-3` | DALL-E |

### Video Models
| Model ID | Use For |
|----------|---------|
| `sora-2-pro` | **Best video** |
| `sora-2` | Standard video |

### Embedding Models
| Model ID | Use For |
|----------|---------|
| `text-embedding-3-small` | **Standard (use this)** |
| `text-embedding-3-large` | Best quality |

### Search Models
| Model ID | Use For |
|----------|---------|
| `gpt-5-search-api` | Web search integrated |

---

## 1.3 XAI GROK API
**Key:** Supabase `credentials.grok_api_key`
**Endpoint:** `api.x.ai/v1`

### Text Models
| Model ID | Context | Price (in/out per M) | Use For |
|----------|---------|----------------------|---------|
| `grok-4-1-fast-reasoning` | 2M | $0.20 / $0.50 | **Humanization, titles (BEST VALUE)** |
| `grok-4-1-fast-non-reasoning` | 2M | $0.20 / $0.50 | Fast without reasoning |
| `grok-4-fast-reasoning` | 2M | TBD | Grok 4 |
| `grok-3` | 128K | Lower | Previous gen |

### Vision Models
| Model ID | Use For |
|----------|---------|
| `grok-2-vision-1212` | **Image understanding** |

### Image Models
| Model ID | Use For |
|----------|---------|
| `grok-imagine-image-pro` | Best image gen |
| `grok-imagine-image` | Standard |

### Video Models
| Model ID | Use For |
|----------|---------|
| `grok-imagine-video` | **Video generation (fallback)** |

---

## 1.4 ANTHROPIC CLAUDE API
**Key:** Supabase `credentials.anthropic_api_key`
**Endpoint:** `api.anthropic.com/v1`

| Model ID | Context | Output | Price (in/out per M) | Use For |
|----------|---------|--------|----------------------|---------|
| `claude-opus-4-6` | 1M (beta) | 128K | $5 / $25 | **Long-form writing** |
| `claude-sonnet-4-6` | 1M (beta) | - | TBD | Balanced |
| `claude-haiku-3-5` | 200K | - | $0.25 / $1.25 | Fast/cheap |

---

## 1.5 PERPLEXITY API
**Key:** Supabase `credentials.perplexity_api_key`
**Endpoint:** `api.perplexity.ai`

| Model ID | Context | Use For |
|----------|---------|---------|
| `sonar-pro` | 200K | **Research with citations** |
| `sonar-deep-research` | 128K | **Exhaustive research** |
| `sonar-reasoning-pro` | 128K | Complex analysis |
| `sonar` | 128K | Quick search |

---

## 1.6 OTHER KEYS (Supabase credentials table)
| Key Name | Purpose |
|----------|---------|
| `serper_api_key` | Google search (link verification) |
| `runway_api_key` | Runway Gen-4 video |
| `leonardo_api_key` | Leonardo Phoenix images |
| `resend_api_key` | Email sending |
| `github_pat` | GitHub (PinkyClawd) |

---

# PART 2: CONTENT PIPELINE

## 2.1 THE 10-STAGE PIPELINE

```
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1: TRANSCRIPTION                                        │
│  Model: whisper-1 (OpenAI)                                      │
│  Input: Audio/video file                                        │
│  Output: Full transcript with timestamps                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2: DEEP RESEARCH                                         │
│  Model: sonar-pro (Perplexity)                                  │
│  Input: Transcript + topic                                       │
│  Output: Facts, stats, quotes with citations                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3: VERIFY LINKS                                          │
│  Tool: Serper API + HEAD requests                               │
│  Input: All URLs from research                                   │
│  Output: Verified working links only                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4: STRUCTURE + TITLES                                    │
│  Model: grok-4-1-fast-reasoning (xAI)                           │
│  Input: Transcript + research                                    │
│  Output: Outline + 10 title options                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5: WRITE DRAFT                                           │
│  Model: claude-opus-4-6 (Anthropic)                             │
│  Input: Outline + research + transcript                          │
│  Output: Full article draft (2000-3000 words)                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6: HUMANIZE                                              │
│  Model: grok-4-1-fast-reasoning (xAI)                           │
│  Input: Draft                                                    │
│  Output: Human-sounding content                                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 7: SEO OPTIMIZATION                                      │
│  Model: gemini-2.5-flash (Google)                               │
│  Input: Humanized content                                        │
│  Output: Meta, schema, keywords, optimized headings              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 8: INTERNAL LINKS                                        │
│  Model: text-embedding-3-small (OpenAI)                         │
│  Input: Content + existing article embeddings                    │
│  Output: Relevant internal links inserted                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 9: IMAGES                                                │
│  Models: imagen-4.0-ultra (hero), imagen-4.0-fast (body)        │
│  Input: Article sections                                         │
│  Output: Hero image + 3-5 body images                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 10: VIDEO                                                │
│  Model: veo-3.1-generate-preview (Google)                       │
│  Fallback: grok-imagine-video (xAI)                             │
│  Input: Hero image + script                                      │
│  Output: 6-8 second hero video                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2.2 MODEL SELECTION BY STAGE

| Stage | Model | Why This Model |
|-------|-------|----------------|
| 1. Transcription | `whisper-1` | Best accuracy, industry standard |
| 2. Research | `sonar-pro` | Built-in citations, web search |
| 3. Verify Links | `serper_api_key` | Fast, cheap link checking |
| 4. Structure | `grok-4-1-fast-reasoning` | 2M context, human-like, $0.20/M |
| 5. Write | `claude-opus-4-6` | 1M context, 128K output, best prose |
| 6. Humanize | `grok-4-1-fast-reasoning` | Conversational, natural |
| 7. SEO | `gemini-2.5-flash` | Fast, cheap, Google-native |
| 8. Internal Links | `text-embedding-3-small` | Standard embeddings |
| 9. Hero Image | `imagen-4.0-ultra-generate-001` | Highest quality |
| 9. Body Images | `imagen-4.0-fast-generate-001` | Fast iteration |
| 10. Video | `veo-3.1-generate-preview` | Best quality, image-to-video |
| 10. Fallback | `grok-imagine-video` | If Veo rejects |

---

# PART 3: PROMPTING TECHNIQUES

## 3.1 RESEARCH PROMPT (Perplexity)
```
You are researching for an authoritative blog article about: {TOPIC}

Find and cite:
1. Recent statistics (last 2 years) with exact numbers
2. Expert quotes from industry leaders
3. Case studies or real examples
4. Contrarian viewpoints
5. Common misconceptions to debunk

For each fact, provide:
- The exact claim
- Source URL
- Publication date

If you cannot verify something, say "I don't know" - do not make up facts.
```

## 3.2 STRUCTURE PROMPT (Grok)
```
Based on this transcript and research, create:

1. A compelling article outline with:
   - Hook intro (problem/question)
   - 5-7 H2 sections
   - Key points under each
   - Strong conclusion with CTA

2. Generate 10 title options that are:
   - Under 60 characters
   - Include the main keyword naturally
   - Create curiosity or promise value
   - NOT clickbait

Transcript: {TRANSCRIPT}
Research: {RESEARCH}
Target keyword: {KEYWORD}
```

## 3.3 WRITING PROMPT (Claude)
```
Write a {WORD_COUNT}-word article following this outline exactly.

Voice guidelines:
- Write like a knowledgeable friend, not a professor
- Use "you" and "we" naturally
- Include specific examples and numbers
- Break up text with subheadings every 200-300 words
- One idea per paragraph
- Vary sentence length (mix short punchy with longer explanatory)

DO NOT:
- Use corporate speak ("leverage", "synergy", "utilize")
- Start sentences with "In today's world" or "In this article"
- Use excessive transition words
- Write generic conclusions

Outline: {OUTLINE}
Research: {RESEARCH}
Transcript context: {TRANSCRIPT}
```

## 3.4 HUMANIZATION PROMPT (Grok)
```
Rewrite this article to sound like a real human wrote it.

Make it:
- Conversational but authoritative
- Include occasional contractions
- Add personality without being unprofessional
- Remove any AI-typical phrases
- Keep all facts and citations intact

The reader should feel like they're getting advice from a smart friend who knows their stuff.

Article: {DRAFT}
```

## 3.5 SEO PROMPT (Gemini)
```
Optimize this article for SEO:

1. Meta title (under 60 chars, keyword near start)
2. Meta description (under 155 chars, compelling, keyword included)
3. URL slug (3-5 words, keyword included)
4. Schema markup (Article type)
5. Suggest any heading optimizations
6. Identify 3-5 secondary keywords to naturally include

Primary keyword: {KEYWORD}
Article: {CONTENT}
```

## 3.6 IMAGE PROMPT TEMPLATE (Imagen)
```
{STYLE}: {SUBJECT} {ACTION/STATE}, {SETTING/BACKGROUND}, {LIGHTING}, {MOOD}

Examples:
- Professional photo: Business team collaborating around a modern desk, sleek office with floor-to-ceiling windows, natural daylight, productive and focused atmosphere
- Editorial style: Entrepreneur working on laptop in minimalist home office, clean white background with plants, soft morning light, calm and focused
```

## 3.7 VIDEO PROMPT TEMPLATE (Veo)
```
Create a {DURATION}-second video:
- Opening: {OPENING_SHOT}
- Movement: {CAMERA_MOVEMENT}
- Subject: {MAIN_SUBJECT}
- Ending: {FINAL_FRAME}
- Style: {VISUAL_STYLE}
- Mood: {ATMOSPHERE}
```

---

# PART 4: API PARAMETERS

## 4.1 IMAGEN API
```python
# Endpoint
POST https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-ultra-generate-001:predict

# Request body
{
  "instances": [{
    "prompt": "string (max 480 tokens)"
  }],
  "parameters": {
    "sampleCount": 1,  # 1-4 images
    "aspectRatio": "16:9"  # or "1:1", "9:16", "4:3", "3:4"
  }
}
```

## 4.2 VEO API
```python
# Endpoint
POST https://generativelanguage.googleapis.com/v1beta/models/veo-3.1-generate-preview:predictLongRunning

# Request body
{
  "instances": [{
    "prompt": "string",
    "image": {  # OPTIONAL - for image-to-video
      "bytesBase64Encoded": "...",
      "mimeType": "image/jpeg"
    }
  }],
  "parameters": {
    "aspectRatio": "16:9",  # or "9:16"
    "durationSeconds": 6  # 4, 6, or 8
  }
}
```

## 4.3 WHISPER API
```python
# Endpoint
POST https://api.openai.com/v1/audio/transcriptions

# Request (multipart form)
{
  "model": "whisper-1",
  "file": audio_file,
  "response_format": "verbose_json",  # for timestamps
  "language": "en"
}
```

## 4.4 EMBEDDINGS API
```python
# Endpoint
POST https://api.openai.com/v1/embeddings

# Request body
{
  "model": "text-embedding-3-small",
  "input": "text to embed"
}
# Returns 1536-dimension vector
```

## 4.5 PERPLEXITY API
```python
# Endpoint
POST https://api.perplexity.ai/chat/completions

# Request body
{
  "model": "sonar-pro",
  "messages": [{"role": "user", "content": "..."}],
  "search_recency_filter": "month"  # day, week, month, year
}
# Returns content + citations array
```

---

# PART 5: COST OPTIMIZATION

## 5.1 CHEAPEST OPTIONS BY TASK
| Task | Model | Price |
|------|-------|-------|
| Text (huge context) | `grok-4-1-fast-reasoning` | $0.20 / $0.50 per M |
| Text (fast) | `gemini-2.5-flash` | ~$0.0001 / $0.0004 per M |
| Images | `imagen-4.0-fast-generate-001` | $0.02 / image |
| Embeddings | `text-embedding-3-small` | $0.00002 / 1K tokens |

## 5.2 QUALITY OPTIONS BY TASK
| Task | Model | Price |
|------|-------|-------|
| Text | `claude-opus-4-6` | $5 / $25 per M |
| Images | `imagen-4.0-ultra-generate-001` | $0.06 / image |
| Video | `veo-3.1-generate-preview` | TBD |

## 5.3 ESTIMATED COST PER ARTICLE
| Component | Est. Cost |
|-----------|-----------|
| Transcription (5 min audio) | ~$0.01 |
| Research (sonar-pro) | ~$0.05 |
| Structure (grok) | ~$0.02 |
| Writing (claude) | ~$0.15 |
| Humanization (grok) | ~$0.02 |
| SEO (gemini) | ~$0.001 |
| Embeddings | ~$0.001 |
| Hero image (ultra) | $0.06 |
| Body images x4 (fast) | $0.08 |
| Hero video | ~$0.50 |
| **TOTAL** | **~$0.90** |

---

# PART 6: CAPABILITY MATRIX

## 6.1 IMAGE INPUT (Can the model SEE images?)
| Provider | Model | Can See Images |
|----------|-------|----------------|
| Google | gemini-* | ✅ Yes |
| OpenAI | gpt-5.*, gpt-4o | ✅ Yes |
| Anthropic | claude-* | ✅ Yes |
| xAI | grok-2-vision-1212 | ✅ Yes (this model only) |
| Perplexity | sonar-* | ❓ Unconfirmed |

## 6.2 IMAGE-TO-VIDEO (Reference images for video gen)
| Provider | Model | Supported | Max Images |
|----------|-------|-----------|------------|
| Google | veo-3.1-* | ✅ Yes | 3 |
| xAI | grok-imagine-video | ✅ Yes | TBD |

## 6.3 CONTEXT WINDOWS
| Model | Input Tokens |
|-------|--------------|
| `grok-4-1-fast-*` | **2,000,000** |
| `claude-opus-4-6` | **1,000,000** (beta) |
| `gemini-*` | **1,048,576** |
| `gpt-5.2` | ~128,000 |
| `sonar-pro` | 200,000 |

## 6.4 OUTPUT TOKENS
| Model | Max Output |
|-------|------------|
| `claude-opus-4-6` | **128,000** |
| `gemini-3-*` | 65,536 |
| `gpt-5.2` | ~16,000 |

---

# PART 7: QUICK REFERENCE

## 7.1 RECOMMENDED STACK (COPY THIS)
```
TRANSCRIPTION:    whisper-1
RESEARCH:         sonar-pro
STRUCTURE:        grok-4-1-fast-reasoning
WRITING:          claude-opus-4-6
HUMANIZE:         grok-4-1-fast-reasoning
SEO:              gemini-2.5-flash
EMBEDDINGS:       text-embedding-3-small
HERO IMAGE:       imagen-4.0-ultra-generate-001
BODY IMAGES:      imagen-4.0-fast-generate-001
HERO VIDEO:       veo-3.1-generate-preview
FALLBACK VIDEO:   grok-imagine-video
```

## 7.2 API ENDPOINTS (COPY THIS)
```
GOOGLE:      https://generativelanguage.googleapis.com/v1beta
OPENAI:      https://api.openai.com/v1
ANTHROPIC:   https://api.anthropic.com/v1
XAI:         https://api.x.ai/v1
PERPLEXITY:  https://api.perplexity.ai
```

## 7.3 KEY LOCATIONS
```
GOOGLE KEY:     Supabase credentials.google_generative_ai_key
OTHER KEYS:     Supabase credentials table (lcxxjftqaafukixdhfjg)
```

---

*Document compiled February 18, 2026*
*All models verified via direct API queries + Perplexity research*

---

# PART 7: NANO BANANA - REFERENCE IMAGE GENERATION

**Model:** `gemini-3-pro-image-preview` (aka Nano Banana)
**Best for:** Character consistency, exact style matching, scenes with specific characters

## 7.1 Why Nano Banana?

- **Reference images supported** - up to 5 humans, 6 objects
- **Maintains EXACT character appearance** - clothing, accessories, style
- **Better than Imagen** for character work (Imagen = text prompt only)

## 7.2 API Call Format

```bash
# Endpoint
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key={API_KEY}

# Request body
{
  "contents": [{
    "parts": [
      {"text": "Your prompt describing the scene with these characters..."},
      {"inline_data": {"mime_type": "image/jpeg", "data": "{BASE64_IMAGE_1}"}},
      {"inline_data": {"mime_type": "image/jpeg", "data": "{BASE64_IMAGE_2}"}},
      {"inline_data": {"mime_type": "image/jpeg", "data": "{BASE64_IMAGE_3}"}},
      {"inline_data": {"mime_type": "image/jpeg", "data": "{BASE64_IMAGE_4}"}}
    ]
  }],
  "generationConfig": {
    "responseModalities": ["TEXT", "IMAGE"]
  }
}
```

## 7.3 Response Handling

```bash
# Extract image from response
cat response.json | jq -r '.candidates[0].content.parts[] | select(.inlineData != null) | .inlineData.data' | base64 -d > output.png
```

## 7.4 When to Use What

| Scenario | Use This |
|----------|----------|
| Need EXACT characters from references | **Nano Banana** |
| Generic image, no character refs | Imagen 4 Ultra |
| Fast iterations, no refs | Imagen 4 Fast |
| Video from image | Veo 3.1 |

## 7.5 StepTen Character References

Stored at: `~/clawd/stepten-io/characters/`
- STEPHEN.jpg - trucker cap, cyan glasses, AirPods, laughing
- PINKY.jpg - grey rat, green glasses, gold earring, buck teeth
- CLARK.jpg - slicked hair, turtleneck, blazer, red pocket square
- REINA.jpg - purple streaks, green glasses, choker, piercings

**Always use these as reference images when generating StepTen content.**
