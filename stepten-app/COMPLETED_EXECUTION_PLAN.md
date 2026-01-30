# Completed Work + Executable Items (SEO Engine Steps 1–8)

## What I Actually Completed (Code Changes Applied)

### Critical Fixes
- Step 1 data-loss guard: only clears downstream steps when idea changes, with confirm dialog.
  - `app/(admin)/admin/seo/articles/new/step-1-idea/page.tsx`
- Step 3 missing `setTitle` state fixed + title input synced.
  - `app/(admin)/admin/seo/articles/new/step-3-framework/page.tsx`
- Step 2 link verification persistence (store verified links + selections into Step 2).
  - `app/(admin)/admin/seo/articles/new/step-2-research/page.tsx`
- Step 4 formatting race fixed with timeout cancellation.
  - `app/(admin)/admin/seo/articles/new/step-4-writing/page.tsx`
- Step 4 revision data consistency (store as `step4.original` / `step4.revised`).
  - `app/(admin)/admin/seo/articles/new/step-4-writing/page.tsx`
- Draft storage key mismatch fixed (`seo-draft-articles`).
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`

### Shared Infrastructure (New)
- Central step validation helper.
  - `lib/seo-step-validator.ts`
- Error boundary for all steps.
  - `components/seo/StepErrorBoundary.tsx`
- Draft autosave hook (60s interval) + wired into Steps 1–8.
  - `hooks/useDraftAutosave.ts`
- Debounced save utility.
  - `hooks/useDebouncedSave.ts`
- Version history (snapshots + restore) used in Steps 4 & 5.
  - `lib/seo-version-history.ts`

### Draft Autosave (Server + DB)
- Draft autosave endpoint.
  - `app/api/articles/draft/autosave/route.ts`
- Supabase migration for `article_drafts` table.
  - `supabase/migrations/002_create_article_drafts_table.sql`

### Step 5 Humanization
- Preserve sentence separators to reduce HTML mangling.
  - `app/api/seo/humanize-article/route.ts`
  - `app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`
- Bulk actions: accept modifications/additions + reject deletions.
  - `app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`
- Version history restore UI for Step 5.
  - `app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`

### Step 7 Styling + Media
- IndexedDB image storage (avoid localStorage quota) + recovery logic.
  - `lib/image-storage.ts`
  - `lib/seo-storage.ts`
  - `app/(admin)/admin/seo/articles/new/step-7-styling/page.tsx`
- Parallel section image generation.
  - `app/(admin)/admin/seo/articles/new/step-7-styling/page.tsx`

### Step 8 Publish
- Word-count memoization.
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`
- Hero image retrieval from IndexedDB for publishing payload.
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`

### Sanitization
- Added basic HTML sanitization for admin previews.
  - `lib/sanitize-html.ts`
  - `app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`
  - `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`

### Resume Draft UX
- “Resume draft” card on SEO dashboard.
  - `app/(admin)/admin/seo/page.tsx`


## Executable Items (Run These)

### 1) Supabase: Apply Migration for Draft Autosave
Run the migration in Supabase SQL editor:
- `supabase/migrations/002_create_article_drafts_table.sql`

This creates `public.article_drafts` and policies for autosave.

### 2) Verify Local Build
Suggested commands (run in repo root):
```bash
npm run lint
npm run test
```

### 3) Manual QA
- Step 1 -> edit idea -> confirm dialog appears
- Step 2 -> verify links -> refresh -> verification persists
- Step 3 -> load saved framework -> no crash
- Step 4 -> toggle versions rapidly -> no formatting glitches
- Step 5 -> bulk actions + restore history
- Step 7 -> images persist after reload
- Step 8 -> draft saves to `seo-draft-articles`


## Supabase MCP Instructions (Exact Platform + Project)

IMPORTANT: I do not have access to your Supabase MCP configuration here, so I cannot verify the workspace or project. The IDE agent should connect to the existing Supabase organization and project you referenced:
- Organization: **step10.io Inc**
- Project: use the existing project in that org (ask the agent to select it explicitly)

### MCP Agent Steps (Copy/Paste)
1) Connect to Supabase MCP and select org `step10.io Inc`.
2) Select the correct project under that org (existing project used by StepTen.io).
3) Open SQL editor for that project.
4) Execute the migration in:
   - `supabase/migrations/002_create_article_drafts_table.sql`
5) Confirm table exists:
   - `article_drafts` in `public` schema
6) Confirm policies:
   - “Authenticated users can manage drafts”
   - “Service role has full access to drafts”

If the agent needs credentials or the project URL/keys, use the existing Supabase env values already in the repo or configured in your deployment environment.


## Files Changed (For Reference)
- `app/(admin)/admin/seo/articles/new/step-1-idea/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-2-research/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-3-framework/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-4-writing/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-5-humanize/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-6-optimize/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-7-styling/page.tsx`
- `app/(admin)/admin/seo/articles/new/step-8-publish/page.tsx`
- `app/(admin)/admin/seo/page.tsx`
- `app/api/articles/draft/autosave/route.ts`
- `app/api/seo/humanize-article/route.ts`
- `components/seo/StepErrorBoundary.tsx`
- `hooks/useDebouncedSave.ts`
- `hooks/useDraftAutosave.ts`
- `lib/image-storage.ts`
- `lib/sanitize-html.ts`
- `lib/seo-step-validator.ts`
- `lib/seo-storage.ts`
- `lib/seo-types.ts`
- `lib/seo-version-history.ts`
- `supabase/migrations/002_create_article_drafts_table.sql`

