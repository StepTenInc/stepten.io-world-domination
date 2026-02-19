# StepTen Content Engine v2 - SKILL

Use this skill for:
- Blog articles, marketing content, SEO copy
- Image and video generation for content
- Research and fact-checking
- Audio/video transcription
- Content optimization

---

## API Keys

**ALL KEYS IN SUPABASE** - Project `lcxxjftqaafukixdhfjg`, Table `credentials`

| Key Name | Provider | Use For |
|----------|----------|---------|
| `google_generative_ai_key` | Google | Gemini, Imagen, Veo |
| `openai_api_key` | OpenAI | GPT, Whisper, Embeddings, Sora |
| `grok_api_key` | xAI | Grok text/vision/image/video |
| `anthropic_api_key` | Anthropic | Claude |
| `perplexity_api_key` | Perplexity | Sonar research |
| `serper_api_key` | Serper | Google search |

**⚠️ NEVER hardcode keys. NEVER commit keys to git.**

---

## Model Selection

### Text Generation

| Task | Model | Provider | Why |
|------|-------|----------|-----|
| **Transcription** | `whisper-1` | OpenAI | Best accuracy |
| **Research** | `sonar-pro` | Perplexity | Built-in citations |
| **Structure/Titles** | `grok-4-1-fast-reasoning` | xAI | 2M context, $0.20/M |
| **Long-form Writing** | `claude-opus-4-6` | Anthropic | 1M context, 128K output |
| **Humanization** | `grok-4-1-fast-reasoning` | xAI | Natural, conversational |
| **SEO** | `gemini-2.5-flash` | Google | Fast, cheap, Google-native |
| **Embeddings** | `text-embedding-3-small` | OpenAI | 1536 dimensions |

### Image Generation

| Task | Model | Provider |
|------|-------|----------|
| **With Reference Images** | `gemini-3-pro-image-preview` (Nano Banana) | Google |
| **Hero Image (no ref)** | `imagen-4.0-ultra-generate-001` | Google |
| **Body Images (no ref)** | `imagen-4.0-fast-generate-001` | Google |
| **Alternative** | `grok-imagine-image-pro` | xAI |

**🍌 NANO BANANA - USE THIS FOR CHARACTER CONSISTENCY:**
- Supports up to 5 human reference images
- Supports up to 6 object reference images  
- Pass images as base64 in request
- Maintains EXACT character appearance
- Use `generateContent` endpoint with `responseModalities: ["TEXT", "IMAGE"]`
- **ALWAYS use `"imageConfig": {"aspectRatio": "16:9"}` for content images!**

### Video Generation

| Task | Model | Provider |
|------|-------|----------|
| **Hero Video** | `veo-3.1-generate-preview` | Google |
| **Fallback** | `grok-imagine-video` | xAI |

---

## API Endpoints

```
GOOGLE:      https://generativelanguage.googleapis.com/v1beta
OPENAI:      https://api.openai.com/v1
ANTHROPIC:   https://api.anthropic.com/v1
XAI:         https://api.x.ai/v1
PERPLEXITY:  https://api.perplexity.ai
```

---

## The 10-Stage Pipeline

```
1. TRANSCRIPTION     → whisper-1
2. RESEARCH          → sonar-pro
3. VERIFY LINKS      → serper + HEAD requests
4. STRUCTURE/TITLES  → grok-4-1-fast-reasoning
5. WRITE DRAFT       → claude-opus-4-6
6. HUMANIZE          → grok-4-1-fast-reasoning
7. SEO OPTIMIZE      → gemini-2.5-flash
8. INTERNAL LINKS    → text-embedding-3-small
9. IMAGES            → imagen-4.0-ultra (hero) / fast (body)
10. VIDEO            → veo-3.1-generate-preview
```

---

## WRONG vs RIGHT Models

| ❌ WRONG (Outdated) | ✅ RIGHT (Current) |
|--------------------|-------------------|
| `gpt-4o` | `gpt-5.2` or `claude-opus-4-6` |
| `gpt-4-turbo` | `gpt-5.2` |
| `claude-3.5-sonnet` | `claude-opus-4-6` |
| `claude-3-opus` | `claude-opus-4-6` |
| `gemini-1.5-pro` | `gemini-3-pro-preview` or `gemini-2.5-flash` |
| `gemini-pro` | `gemini-2.5-flash` |
| `dall-e-3` | `imagen-4.0-ultra-generate-001` |
| `veo-2` | `veo-3.1-generate-preview` |

---

## Cost Estimates

| Component | Est. Cost |
|-----------|-----------|
| Transcription (5 min) | ~$0.01 |
| Research | ~$0.05 |
| Structure | ~$0.02 |
| Writing | ~$0.15 |
| Humanization | ~$0.02 |
| SEO | ~$0.001 |
| Embeddings | ~$0.001 |
| Hero image | $0.06 |
| Body images x4 | $0.08 |
| Hero video | ~$0.50 |
| **TOTAL/ARTICLE** | **~$0.90** |

---

## Capability Matrix

### Image Input (Vision)
| Provider | Models | Can See Images |
|----------|--------|----------------|
| Google | `gemini-*` | ✅ Yes |
| OpenAI | `gpt-5.*`, `gpt-4o` | ✅ Yes |
| Anthropic | `claude-*` | ✅ Yes |
| xAI | `grok-2-vision-1212` only | ✅ This model only |

### Image-to-Video
| Provider | Model | Supported |
|----------|-------|-----------|
| Google | `veo-3.1-*` | ✅ Yes (up to 3 images) |
| xAI | `grok-imagine-video` | ✅ Yes |

### Context Windows
| Model | Tokens |
|-------|--------|
| `grok-4-1-fast-*` | 2,000,000 |
| `claude-opus-4-6` | 1,000,000 |
| `gemini-*` | 1,048,576 |

### Output Limits
| Model | Max Output |
|-------|------------|
| `claude-opus-4-6` | 128,000 |
| `gemini-3-*` | 65,536 |

---

## Rules

1. **NEVER hardcode API keys** - fetch from Supabase credentials table
2. **NEVER commit keys to git** - reference Supabase locations only
3. **NEVER guess model names from training data** - use this list or query API
4. **ALWAYS use Perplexity** for research needing current information
5. **ALWAYS verify links** before including in content
6. **ALWAYS humanize** - run through Grok after Claude writes

---

## Full Reference

See `MASTER.md` in this directory for:
- Complete model lists from each API
- Detailed prompting techniques
- Full API parameters
- Pricing details
