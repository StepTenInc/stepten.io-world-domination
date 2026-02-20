# StepTen Content Engine v2 - MASTER REFERENCE
Last Updated: February 18, 2026
Verified via: Direct API queries + Perplexity sonar-pro

---

# PART 1: OUR API KEYS & MODELS
Everything below was queried directly from the APIs. This is what WE have access to.

---

## 1.1 GOOGLE GENERATIVE AI
API Key: Supabase credentials.google_generative_ai_key
Endpoint: generativelanguage.googleapis.com/v1beta

### Text Models
| Model ID | Input | Output | Use For |
|----------|-------|--------|---------|
| gemini-3-pro-preview | 1M | 65K | Best quality, complex tasks |
| gemini-3-flash-preview | 1M | 65K | Fast quality |
| gemini-2.5-pro | 1M | 65K | Stable production |
| gemini-2.5-flash | 1M | 65K | SEO, fast tasks |
| gemini-2.5-flash-lite | 1M | 65K | Cheapest |
| deep-research-pro-preview-12-2025 | 131K | 65K | Deep research |
| gemini-2.5-computer-use-preview-10-2025 | 131K | 65K | Browser automation |

### Image Generation Models
| Model ID | Use For |
|----------|---------|
| imagen-4.0-ultra-generate-001 | Hero images (highest quality) |
| imagen-4.0-generate-001 | Standard photos |
| imagen-4.0-fast-generate-001 | Body images (fast) |
| gemini-3-pro-image-preview / nano-banana-pro-preview | Multimodal image gen |
| gemini-2.5-flash-image | Fast multimodal |

### Video Generation Models
| Model ID | Use For |
|----------|---------|
| veo-3.1-generate-preview | Best quality video |
| veo-3.1-fast-generate-preview | Fast video |
| veo-3.0-generate-001 | Stable |
| veo-2.0-generate-001 | Legacy |

### Audio/TTS Models
| Model ID | Use For |
|----------|---------|
| gemini-2.5-flash-preview-tts | Text-to-speech |
| gemini-2.5-pro-preview-tts | Quality TTS |

### Embedding Models
| Model ID | Use For |
|----------|---------|
| gemini-embedding-001 | Text embeddings |

---

## 1.2 OPENAI
API Key: Supabase credentials.openai_api_key
Endpoint: api.openai.com/v1

### Text Models
| Model ID | Use For |
|----------|---------|
| gpt-5.2 | Latest flagship |
| gpt-5.2-pro | Highest quality |
| gpt-5.1 | Stable |
| gpt-5-mini | Fast/cheap |
| gpt-5-nano | Cheapest |

### Reasoning Models
| Model ID | Use For |
|----------|---------|
| o3 | Latest reasoning |
| o3-mini | Fast reasoning |
| o1-pro | Heavy reasoning |

### Audio Models
| Model ID | Use For |
|----------|---------|
| whisper-1 | Speech-to-text (BEST) |
| gpt-4o-transcribe-diarize | With speaker detection |
| tts-1-hd | Quality TTS |

### Image Models
| Model ID | Use For |
|----------|---------|
| gpt-image-1.5 | Latest image gen |
| dall-e-3 | DALL-E |

### Video Models
| Model ID | Use For |
|----------|---------|
| sora-2-pro | Best video |
| sora-2 | Standard video |

### Embedding Models
| Model ID | Use For |
|----------|---------|
| text-embedding-3-small | Standard (use this) |
| text-embedding-3-large | Best quality |

### Search Models
| Model ID | Use For |
|----------|---------|
| gpt-5-search-api | Web search integrated |

---

## 1.3 XAI GROK
API Key: Supabase credentials.grok_api_key
Endpoint: api.x.ai/v1

### Text Models
| Model ID | Context | Price (in/out per M) | Use For |
|----------|---------|----------------------|---------|
| grok-4-1-fast-reasoning | 2M | $0.20 / $0.50 | Humanization, titles (BEST VALUE) |
| grok-4-1-fast-non-reasoning | 2M | $0.20 / $0.50 | Fast without reasoning |
| grok-4-fast-reasoning | 2M | TBD | Grok 4 |
| grok-3 | 128K | Lower | Previous gen |

### Vision Models
| Model ID | Use For |
|----------|---------|
| grok-2-vision-1212 | Image understanding |

### Image Models
| Model ID | Use For |
|----------|---------|
| grok-imagine-image-pro | Best image gen |
| grok-imagine-image | Standard |

### Video Models
| Model ID | Use For |
|----------|---------|
| grok-imagine-video | Video generation (fallback) |

---

## 1.4 ANTHROPIC CLAUDE
API Key: Supabase credentials.anthropic_api_key
Endpoint: api.anthropic.com/v1

| Model ID | Context | Output | Price (in/out per M) | Use For |
|----------|---------|--------|----------------------|---------|
| claude-opus-4-6 | 1M (beta) | 128K | $5 / $25 | Long-form writing |
| claude-sonnet-4-6 | 1M (beta) | - | TBD | Balanced |
| claude-haiku-3-5 | 200K | - | $0.25 / $1.25 | Fast/cheap |

---

## 1.5 PERPLEXITY
API Key: Supabase credentials.perplexity_api_key
Endpoint: api.perplexity.ai

| Model ID | Context | Use For |
|----------|---------|---------|
| sonar-pro | 200K | Research with citations |
| sonar-deep-research | 128K | Exhaustive research |
| sonar-reasoning-pro | 128K | Complex analysis |
| sonar | 128K | Quick search |

---

## 1.6 OTHER KEYS (Supabase credentials table)

| Key Name | Purpose |
|----------|---------|
| serper_api_key | Google search (link verification) |
| runway_api_key | Runway Gen-4 video |
| leonardo_api_key | Leonardo Phoenix images |
| resend_api_key | Email sending |
| github_pat | GitHub (PinkyClawd) |
