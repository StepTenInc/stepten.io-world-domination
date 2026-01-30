# CODEX Full Audit Report — SEO Article Engine (Steps 1–8)

**Scope:** Admin flow `stepten-app/app/(admin)/admin/seo/articles/new/step-1-idea` through `step-8-publish`, API routes under `app/api/seo`, shared libs `lib/seo-*.ts` and hooks.  
**Server noted by user:** `http://localhost:8262`

---

## Executive Summary
- The engine relies on **real AI APIs** for most steps, but there are **several hardcoded or heuristic fallbacks** that can mislead users.
- **Publishing is not truly live**: the public site reads from localStorage, and the publish flow uses a localhost URL and falls back to localStorage when API fails.
- **Persistence is primarily localStorage**, with limited server persistence; cross‑device resume is not supported.
- Several **environment defaults still reference `localhost:262`**, which mismatches the current server (`8262`).

---

## Step-by-Step Audit (Findings + Behavior)

### Step 1 — Idea Capture
**UI:** `app/(admin)/admin/seo/articles/new/step-1-idea/page.tsx`
**APIs:**
- `POST /api/seo/transcribe`
- `POST /api/seo/suggest-corrections`
- `POST /api/seo/generate-title`
- `POST /api/seo/extract-document`

**Behavior:**
- Uses AI for transcription, corrections, and title generation.
- Stores data in localStorage via `seoStorage`.

**Issues / Hardcoded:**
- Alerts for validation; no server-side validation.
- Input methods and UX are hardcoded (expected).

---

### Step 2 — Research & Planning
**UI:** `app/(admin)/admin/seo/articles/new/step-2-research/page.tsx`
**APIs:**
- `POST /api/seo/research-comprehensive`
- `POST /api/seo/refine-research`
- `POST /api/seo/verify-links`
- `POST /api/seo/analyze-link-authority`

**Behavior:**
- Calls Perplexity for research (`research-topic`) and aggregates results.
- Link verification and authority analysis use AI + fallback heuristics.

**Hardcoded / Heuristic Logic:**
- **Domain authority is estimated with hardcoded values**.
  - `app/api/seo/research-comprehensive/route.ts:131`
- **Title suggestions are synthetic / hardcoded** (derived from keywords).
  - `app/api/seo/research-comprehensive/route.ts:98`
- Link authority fallback logic is rule-based (UGC domain list, DA thresholds).
  - `app/api/seo/analyze-link-authority/route.ts:100`

**Environment Issue:**
- Internal calls default to `http://localhost:262` when `NEXT_PUBLIC_BASE_URL` is missing.
  - `app/api/seo/research-comprehensive/route.ts:16`
  - `app/api/seo/refine-research/route.ts:73`

---

### Step 3 — Framework
**UI:** `app/(admin)/admin/seo/articles/new/step-3-framework/page.tsx`
**API:** `POST /api/seo/generate-framework`

**Behavior:**
- Uses AI for framework generation.

**Hardcoded / Placeholder:**
- **Framework prompt includes placeholders like `[ADD PERSONAL EXPERIENCE HERE]`.**
  - `app/api/seo/generate-framework/route.ts:90`

---

### Step 4 — Writing & Analysis
**UI:** `app/(admin)/admin/seo/articles/new/step-4-writing/page.tsx`
**APIs:**
- `POST /api/seo/write-article`
- `POST /api/seo/analyze-article`
- `POST /api/seo/revise-article`

**Behavior:**
- Uses AI for writing and revision.
- Performs local HTML formatting for preview.

**Issues / Risks:**
- HTML parsing is manual and can be brittle for complex markdown/HTML.

---

### Step 5 — Humanization
**UI:** `app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`
**API:** `POST /api/seo/humanize-article`

**Behavior:**
- Uses Grok (OpenAI‑compatible) for humanization.
- Sentence‑level diffing is heuristic; may not preserve all HTML structure.

**Issues / Risks:**
- Reconstruction from sentence diffs can still distort markup in edge cases.

---

### Step 6 — SEO Optimization
**UI:** `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx`
**API:** `POST /api/seo/analyze-seo`

**Behavior:**
- Deterministic scoring + AI suggestions.

**Accuracy Gaps:**
- Internal link counting can be inaccurate (regex misses typical internal URLs).
  - `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx:238`
- Meta description is **not explicitly scored** in API.
  - `app/api/seo/analyze-seo/route.ts`
- Schema score is always added as a flat value.
  - `app/api/seo/analyze-seo/route.ts:1133`
- Stale cached results can appear after API failures.
  - `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx:144`

---

### Step 7 — Styling & Media
**UI:** `app/(admin)/admin/seo/articles/new/step-7-styling/page.tsx`
**APIs:**
- `POST /api/seo/generate-images`
- `POST /api/seo/extract-content-blocks`

**Behavior:**
- AI generates hero + section images and content blocks.

**Hardcoded / Placeholder:**
- Content block inputs use manual placeholders until user fills them.
- Typography defaults are fixed.

---

### Step 8 — Review & Publish
**UI:** `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`
**API:** `POST /api/articles/publish`

**Behavior:**
- Attempts to publish to Supabase, but **falls back to localStorage** if API fails.
- Uses localStorage as the primary source for published articles.

**Publish Flow Is Not Truly Live:**
- The public articles hub reads from **localStorage**, not Supabase.
  - `app/(public)/articles/page.tsx:11`
- The publish URL is hardcoded to `http://localhost:262` (not `8262`).
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx:368`

**Hardcoded / Placeholder:**
- Humanization score defaults to `92` in publish payload.
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx:383`
- Author name/avatar are fixed.
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx:401`
- Scheduling only changes status; there is **no scheduler/cron** to publish later.

---

## API Route Audit (Hardcoded / Heuristic Logic)

### `app/api/seo/research-comprehensive/route.ts`
- Hardcoded **domain authority estimation** and **title suggestions**.
- Uses `localhost:262` fallback for internal calls.

### `app/api/seo/analyze-link-authority/route.ts`
- GPT‑4o mini call with **hardcoded UGC domain list** + DA heuristics fallback.

### `app/api/seo/analyze-seo/route.ts`
- Deterministic scoring; does **not** score meta description.
- Schema score is **always added**.
- Keyword placement ignores meta description and slug.

---

## Publish Flow (Why It’s Broken)

**Current behavior:**
- Publish API is optional; on failure it still writes to localStorage and shows success.
- Public site reads from localStorage, not Supabase.
- URLs are generated with `http://localhost:262` (wrong for `8262`).
- Scheduling is not implemented (no background job).

**Consequence:**
- Articles do not reliably become “live” outside the current browser.
- Publish flow is effectively **local-only**.

---

## Data Persistence

- Primary persistence is localStorage (`seo-article-data`, `seo-published-articles`, `seo-draft-articles`).
- Supabase is used for publish API, but not used by the frontend articles hub.

---

## Error Handling

- Most steps use `alert()` or `toast()`; server errors may fall back silently.
- API failures can lead to stale cached data (notably Step 6).

---

## Hardcoded / Placeholder List (Quick Index)

- Localhost base URL defaults to `http://localhost:262`.
  - `app/api/seo/research-comprehensive/route.ts`
  - `app/api/seo/refine-research/route.ts`
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`
- Domain authority estimator uses hardcoded values.
  - `app/api/seo/research-comprehensive/route.ts`
- Title suggestions are synthetic.
  - `app/api/seo/research-comprehensive/route.ts`
- UGC domain list is hardcoded.
  - `app/api/seo/analyze-link-authority/route.ts`
- Humanization score default `92` in publish payload.
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`
- Author name/avatar are fixed.
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`
- Public articles page uses mock views.
  - `app/(public)/articles/page.tsx:56`

---

## End‑to‑End Verification Status
- **Not executed** in this report. No live API calls or browser tests were run.

---

## Summary: What Needs Attention (No Changes Applied)
1) Replace localStorage publish flow with Supabase-backed frontend queries.
2) Fix `localhost:262` references (use `8262` or env var).
3) Remove hardcoded schema scoring and add meta description scoring.
4) Implement actual scheduling (cron/queue) if schedule mode must work.
5) Replace mock view counts with real analytics.

---

## Files Referenced
- `app/(admin)/admin/seo/articles/new/step-1-idea/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-2-research/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-3-framework/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-4-writing/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-7-styling/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`
- `app/(public)/articles/page.tsx`
- `app/api/seo/research-comprehensive/route.ts`
- `app/api/seo/refine-research/route.ts`
- `app/api/seo/research-topic/route.ts`
- `app/api/seo/analyze-link-authority/route.ts`
- `app/api/seo/analyze-seo/route.ts`
- `app/api/articles/publish/route.ts`

