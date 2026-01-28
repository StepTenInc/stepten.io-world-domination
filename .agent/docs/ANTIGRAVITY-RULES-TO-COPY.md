# 📋 Antigravity Rules for StepTen.io

**Copy these files to your `.agent/rules/` folder in your project**

---

## File: `.agent/rules/stepten-project.md`

```markdown
# StepTen.io Project Rules

## Documentation First
* ALWAYS check `/StepTen Project Docs/QA-PROJECT-REFERENCE.md` before asking questions
* Update Q&A doc with timestamps when new decisions are made
* Save feature-related docs in `/StepTen Project Docs/Features/[feature-name]/`

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
* Use Tailwind design tokens from tailwind.config.ts

## File Organization
* Components: `/components/[category]/`
* DB Schema: `/lib/db/schema.ts`
* Supabase Client: `/lib/supabase/`
* Feature docs: `/StepTen Project Docs/Features/`
```

---

## File: `.agent/rules/code-style.md`

```markdown
# Code Style Rules

## TypeScript
* Use TypeScript for all code
* Define interfaces for all props
* Export prop types alongside components
* Use absolute imports with @ prefix
* No `any` types — use proper typing

## Naming Conventions
* Components: PascalCase (e.g., `StatusBadge.tsx`)
* Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
* Utilities: camelCase (e.g., `formatDate.ts`)
* CSS classes: kebab-case
* Constants: UPPER_SNAKE_CASE

## Import Order
1. React/Next.js imports
2. Third-party imports
3. Internal components (@/components)
4. Internal utilities (@/lib)
5. Types
6. Styles

## File Organization
* One component per file
* Co-locate tests with components
* Keep files under 300 lines — split if larger
```

---

## File: `.agent/rules/no-duplicates.md`

```markdown
# No Duplicates Rule

## Core Principle
NEVER create duplicate functionality. Always search first.

## Before Creating Anything
1. Search codebase for similar code
2. Check if functionality already exists
3. If exists → use it, extend it, or refactor it
4. If doesn't exist → create in appropriate location

## Search Commands
* Component: grep -r "ComponentName" components/
* Function: grep -r "functionName" lib/
* Hook: grep -r "useHookName" hooks/
```

---

## File: `.agent/rules/database-rules.md`

```markdown
# Database Rules

## ORM Strategy
* Drizzle ORM for complex queries (joins, transactions)
* Supabase client for simple queries, realtime, auth

## Before Any Database Operation
1. READ the current schema in /supabase/migrations/
2. CHECK /types/database.ts for generated types
3. CHECK /lib/db/schema.ts for Drizzle schema
4. VERIFY table and column names exist

## Schema Changes
1. Write migration file in /supabase/migrations/
2. Update Drizzle schema in /lib/db/schema.ts
3. Run: npx drizzle-kit generate:pg
4. Test affected features

## Never Do
* NEVER use Prisma - we use Drizzle
* NEVER modify production database directly
* NEVER skip migrations
* NEVER hardcode IDs or secrets
```

---

## How to Install

1. Create `.agent/rules/` folder in your project root
2. Create each file with the content above
3. Antigravity will automatically use these rules

---

*Created: 2026-01-10*
