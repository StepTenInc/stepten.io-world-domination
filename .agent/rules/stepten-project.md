# StepTen.io Project Rules

## Development Port
* **ALWAYS use port 262** - This is the dedicated port for StepTen.io
* Run `npm run clear-port` before starting if port is in use
* Dev server: http://localhost:262

## Documentation Location
* ALL docs are in `/.agent/docs/` - this is the ONLY source of truth
* Check `/.agent/docs/QA-PROJECT-REFERENCE.md` before asking questions
* Update Q&A doc with timestamps when new decisions are made

## Tech Stack - FIRM DECISIONS
* ORM: Drizzle for complex queries, Supabase client for simple/realtime
* NO Prisma - ignore all Prisma tools completely
* NO Turborepo - simplified single Next.js project structure
* NO Calendly - build custom booking system

## AI Models (January 2026 - DO NOT CHANGE)
* Claude 4.5 Sonnet: `claude-sonnet-4-5-20250929`
* Claude 4.5 Opus: `claude-opus-4-5-20251101`
* GPT-5.2: `gpt-5.2`
* Gemini 3 Pro: `gemini-3-pro-preview`
* Grok 4.1: `grok-4-1-fast-reasoning`
* Perplexity: `sonar-reasoning-pro`
* DeepSeek V3.2: `deepseek-v3.2-maas`
* Whisper: `whisper-1`
* Embeddings: `text-embedding-005`

## URL Structure
* Articles: FLAT off root domain (`/my-article-slug`)
* Dashboard: Nested under `/dashboard/`
* Admin: Nested under `/admin/`
* Silos: Under `/topics/`

## Styling
* Dark mode ONLY - no light mode
* Colors: Background #0a0a0a, Primary #00FF41 (Matrix Green), Info #22D3EE
* Font: Space Grotesk (primary), JetBrains Mono (code)
* Use Tailwind design tokens from globals.css

## File Organization
* App code: `/stepten-app/`
* Components: `/stepten-app/components/[category]/`
* DB Schema: `/stepten-app/lib/db/schema.ts`
* Supabase Client: `/stepten-app/lib/supabase/`
* All docs: `/.agent/docs/`
