# CODEX Step 6 Accuracy Report (SEO Optimization)

**Scope:** Step 6 UI + `/api/seo/analyze-seo` scoring logic  
**Environment:** `http://localhost:8262/admin/seo/articles/new/step-6-optimize`

---

## Executive Summary
Step 6 is **not hard-coded**, but the scoring is **not fully accurate** due to link parsing logic, schema scoring behavior, missing meta description scoring, and stale cached results on API failure. These issues can materially skew the total score and individual checks.

---

## Where the Scores Come From

### UI (Step 6)
- Runs analysis by calling: `POST /api/seo/analyze-seo`
- Takes `seoScore` and `checks[]` and displays them.
- Stores results in localStorage (Step 6 cache).

**File:**
- `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx`

### API (Scoring Engine)
- Deterministic scoring happens in `performBasicAnalysis()`.
- AI (Gemini) is used **only for suggestions** and **schema recommendations**, not the numeric score.

**File:**
- `app/api/seo/analyze-seo/route.ts`

---

## Accuracy Gaps (Findings)

### 1) Internal Link Count Often Incorrect
**Issue:** Internal link parsing only matches `href="/#..."` patterns, which excludes normal internal paths (`/articles/...`, `/blog/...`).

**Impact:** Internal link score is often **0**, lowering total score incorrectly.

**Location:**
- `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx:238`

---

### 2) Schema Score Is Always +25
**Issue:** Schema check always adds 25 points even if no schema is recommended or meaningful.

**Impact:** Total score is inflated regardless of actual schema coverage.

**Location:**
- `app/api/seo/analyze-seo/route.ts:1133`

---

### 3) Meta Description Has No Real Score
**Issue:** There is no explicit meta description scoring check (length + keyword). The UI implies meta matters, but the API does not score it.

**Impact:** SEO score misses a core on‑page signal; user perception doesn’t match scoring logic.

**Location:**
- `app/api/seo/analyze-seo/route.ts` (no meta description check in `performBasicAnalysis()`)

---

### 4) Stale Cached Scores After API Failure
**Issue:** If `/api/seo/analyze-seo` fails, cached Step 6 results remain visible.

**Impact:** Users see **old scores**, making results look “wrong” or inconsistent.

**Location:**
- `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx:144`

---

## What *Is* Actually Scored (Current Logic)

The current scoring checks include:
- Keyword in title
- Keyword in first 100 words
- Keyword density
- Readability (Flesch)
- Content length vs target
- Title length
- Image alt tags
- Internal links count
- Outbound links count
- Anchor text variety
- Header structure
- Keyword placement (title/H1/first paragraph)

**Scoring implementation:**
- `app/api/seo/analyze-seo/route.ts:398` → `app/api/seo/analyze-seo/route.ts:748`

---

## Why Scores Can Feel Inaccurate
- Internal links often appear as 0.
- Schema is always rewarded (+25).
- Meta description is ignored.
- Cached results persist if API fails.

---

## Recommended Fixes (Report‑Only)

1) **Fix internal link extraction** to count real internal URLs (DOM parser or broader URL handling).
2) **Make schema score conditional** on actual schema recommendations.
3) **Add meta description scoring** (length + keyword).
4) **Clear cached results on API failure** or label as stale.

---

## Proof / Verification Steps

1) Run Step 6 analysis on an article with internal links like `/articles/foo`.
2) Compare internal link count vs actual anchors in HTML.
3) Remove schema content and re-run; observe whether score still includes +25.
4) Remove meta description and confirm scoring does not change (current behavior).
5) Simulate API failure (remove `GOOGLE_GENERATIVE_AI_API_KEY`) and observe cached scores.

---

## File References
- `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx`
- `app/api/seo/analyze-seo/route.ts`

