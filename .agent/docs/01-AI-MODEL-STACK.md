# 01 — AI Model Stack Reference

---

## 1. Google Gemini 3 (The Context King)

- **API IDs:** `gemini-3-pro-preview`, `gemini-3-flash-preview`
- **Cost:** ~$2.00 (Input) / $12.00 (Output) per 1M tokens
- **Embeddings:** `text-embedding-005` (SOTA for long-document retrieval)
- **Fine-Tuning:** Available via Google AI Studio

**Best For:**
- Languages: Python, Go (best-in-class), deep Google Cloud integration
- Logic: Native multimodal reasoning — can "watch" a 1-hour video and write code based on visual UI
- LangChain: Excellent for RAG (Retrieval Augmented Generation) with 1M context window
- Design: Best for design work

---

## 2. OpenAI GPT-5 (The Logic Specialist)

- **API IDs:** `gpt-5.2` (Reasoning), `gpt-5.2-pro` (Scientific), `gpt-5-mini` (Fast)
- **Cost:** ~$1.75 (Input) / $14.00 (Output) per 1M tokens
- **Embeddings:** `text-embedding-3-large` (Highly efficient)
- **Fine-Tuning:** Yes, for `gpt-5-mini` and legacy `gpt-4.1`

**Best For:**
- Languages: TypeScript, SQL, Rust — very strict JSON schema adherence
- Logic: Highest score on PhD-level science and law benchmarks
- Feature: `reasoning.effort` parameter to trade speed for "Thinking" depth

---

## 3. Anthropic Claude 4.5 (The Agent Specialist)

- **API IDs:** `claude-opus-4-5-20251101`, `claude-sonnet-4-5-20250929`
- **Cost:** ~$5.00 (Input) / $25.00 (Output) per 1M tokens (Opus)
- **Embeddings:** Integrated via Voyage AI partnership
- **Fine-Tuning:** No (limited to Enterprise/White-glove service)

**Best For:**
- Languages: React/Frontend, Python — creates highly functional "Artifacts" (UI components)
- Logic: "Computer Use" API — Claude can literally move a cursor and click buttons to execute tasks
- Marketing: Least "AI-sounding" voice — best for professional SEO content

---

## 4. xAI Grok 4.1 (The Real-Time Specialist)

- **API IDs:** `grok-4-1-fast-reasoning`, `grok-4`
- **Cost:** ~$0.20 (Input) / $0.50 (Output) — hyper-competitive pricing
- **Embeddings:** Not currently a public focus for xAI
- **Fine-Tuning:** No

**Best For:**
- Languages: C++ and System Programming
- Logic: Breaking news analysis — uses Live Search to bypass knowledge cutoff
- SEO: Analyzing trending topics on social media in real-time

---

## 5. DeepSeek V3.2 (The Coding Value Leader)

- **API ID:** `deepseek-v3.2-maas`
- **Cost:** ~$0.20 per 1M tokens (approx. 90% cheaper than GPT-5)

**Best For:**
- Rivals GPT-5.2 in coding benchmarks
- Massive automation projects in Python or JavaScript
- Background logic to save thousands on API costs

---

## 6. Perplexity Sonar (The SEO Research King)

- **API ID:** `sonar-reasoning-pro`
- **Cost:** ~$1.00 per 1,000 requests (Query-based pricing)

**Best For:**
- Only API that returns citations and live URLs
- Essential for SEO tools needing today's rankings
- Verifying if a news event is real

---

## Usage Matrix

| Use Case | Model |
|----------|-------|
| Website Chat Agent | Claude 4.5 Sonnet |
| Lead Qualification | Claude 4.5 Sonnet |
| Code Generation (Backend) | DeepSeek V3.2 |
| Code Generation (Frontend) | Claude 4.5 |
| RAG / Document Analysis | Gemini 3 Pro |
| Newsletter Auto-Draft | Perplexity Sonar |
| SEO Content Writing | Claude 4.5 |
| Trending/Real-time Analysis | Grok 4.1 Fast |
| Complex Reasoning/Logic | GPT-5.2 |
| Embeddings (Quality) | Gemini `text-embedding-005` |
| Embeddings (Volume) | OpenAI `text-embedding-3-large` |
| Design Work | Gemini 3 |
| Humanization | Grok 4.1 |
| Code Optimization | Gemini 3 Pro |

---

## Cost Optimization Strategy

```
User Query → Router Agent (cheap model like Grok Fast or DeepSeek)
    ↓
Classifies: Simple? Complex? Code? Research? Sales?
    ↓
Routes to appropriate model
```

This saves 60-80% on API costs vs throwing everything at Claude Opus or GPT-5 Pro.
