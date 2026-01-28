# 16 — Antigravity Rules & Workflows

---

## Overview

Configuration for Google Antigravity IDE — rules and workflows for AI agents working on the StepTen codebase.

**File Locations:**
- **Workspace Rules:** `.agent/rules/` (project root)
- **Workspace Workflows:** `.agent/workflows/` (project root)
- **Global Rules:** `~/.gemini/antigravity/global_rules/`
- **Global Workflows:** `~/.gemini/antigravity/global_workflows/`

---

## Folder Structure

```
stepten/
├── .agent/
│   ├── rules/
│   │   ├── code-style.md
│   │   ├── component-rules.md
│   │   ├── database-rules.md
│   │   ├── styling-rules.md
│   │   └── no-duplicates.md
│   └── workflows/
│       ├── new-component.md
│       ├── new-page.md
│       ├── database-change.md
│       ├── refactor.md
│       ├── test-feature.md
│       └── deploy.md
```

---

## RULES (Passive — Always Active)

Rules are persistent instructions that guide the agent's thinking. They act like a System Prompt that is always running in the background.

---

### `.agent/rules/code-style.md`

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

### `.agent/rules/component-rules.md`

```markdown
# Component Rules

## Before Creating Any Component
1. SEARCH the codebase for existing similar components
2. CHECK /components/ui/ for ShadCN base components
3. CHECK /components/shared/ for shared components
4. If similar exists → EXTEND or MODIFY it
5. If nothing exists → CREATE in appropriate folder

## Component Location
* Base UI: /components/ui/ (ShadCN)
* Shared complex: /components/shared/
* Feature-specific: /components/[feature]/
* Page-specific: Co-locate in page folder

## Component Structure
* Use CVA (class-variance-authority) for variants
* Define TypeScript interface for props
* Export component and props type
* Add JSDoc comments for complex components

## Required Exports
```tsx
export { ComponentName };
export type { ComponentNameProps };
```

## Composition Pattern
* Build complex UIs by composing simple components
* Avoid prop drilling — use context if needed
* Keep components focused on single responsibility
```

---

### `.agent/rules/database-rules.md`

```markdown
# Database Rules

## Before Any Database Operation
1. READ the current schema in /supabase/migrations/
2. CHECK /types/database.ts for generated types
3. CHECK /lib/db/schema.ts for Drizzle schema
4. VERIFY table and column names exist

## Schema Changes
1. Write migration file in /supabase/migrations/
2. Update Drizzle schema in /lib/db/schema.ts
3. Run: npx drizzle-kit generate:pg
4. Run: npm run generate-types
5. Test affected features

## Query Patterns
* Use Drizzle ORM for type-safe queries
* Use Supabase client for realtime/auth features
* Never use raw SQL in components

## Never Do
* NEVER modify production database directly
* NEVER skip migrations
* NEVER hardcode IDs or secrets
```

---

### `.agent/rules/styling-rules.md`

```markdown
# Styling Rules

## Colors — NEVER Hardcode
```
Backgrounds:
- bg-background (#0a0a0a)
- bg-background-alt (#111111)
- bg-background-muted (#171717)

Text:
- text-foreground (#fafafa)
- text-foreground-muted (#a1a1aa)

Accents:
- text-primary / bg-primary (#00FF41 Matrix Green)
- text-info (#22D3EE Aqua)
- text-error (#FF4757)
- text-warning (#FBBF24)

Borders:
- border-border (#262626)
- border-border-hover (#404040)
- border-primary (#00FF41)
```

## Spacing — Use Scale Only
```
p-xs (8px), p-sm (12px), p-md (16px), p-lg (24px), p-xl (32px)
```
* NEVER use arbitrary values like p-[13px]

## Interactive Elements
* ALWAYS add transitions: transition-all duration-200
* ALWAYS add hover states
* ALWAYS add focus-visible states for accessibility

## Dark Mode
* Site is dark mode ONLY
* No light mode toggle needed
* Test all text for contrast against dark backgrounds
```

---

### `.agent/rules/no-duplicates.md`

```markdown
# No Duplicates Rule

## Core Principle
NEVER create duplicate functionality. Always search first.

## Before Creating Anything
1. Search codebase for similar code
2. Check if functionality already exists
3. If exists → use it, extend it, or refactor it
4. If doesn't exist → create in appropriate location

## Refactoring Process
When duplicate is found:
1. Identify the better implementation
2. Create improved version if needed
3. Find ALL usages of old code
4. Update usages one by one
5. Test after each update
6. Delete old code ONLY after all usages updated
7. Commit with clear message

## Search Commands
* Component: grep -r "ComponentName" components/
* Function: grep -r "functionName" lib/
* Hook: grep -r "useHookName" hooks/
* Style: grep -r "className pattern" .

## Forbidden
* Creating StatusLabel when StatusBadge exists
* Creating fetchData when useQuery hook exists
* Creating formatDate when date-fns is available
* Any duplication of existing patterns
```

---

## WORKFLOWS (Active — Triggered with /)

Workflows are saved prompts that you trigger on demand by typing `/` followed by the workflow name.

---

### `.agent/workflows/new-component.md`

```markdown
# New Component Workflow

Triggered with: /new-component

## Steps

1. **Search for existing similar components**
   - Search /components/ for similar functionality
   - Check ShadCN components list
   - If exists, STOP and suggest using existing

2. **Determine component location**
   - Will be used in 2+ places? → /components/shared/
   - UI primitive? → /components/ui/
   - Feature-specific? → /components/[feature]/
   - Page-specific? → Co-locate with page

3. **Create component file**
   - Use PascalCase naming
   - Include TypeScript interface
   - Use design tokens from tailwind config
   - Add CVA variants if needed

4. **Add to exports**
   - Export component
   - Export props type

5. **Test component**
   - Verify renders without errors
   - Check responsive behavior
   - Verify accessibility (keyboard, focus)

6. **Update imports where needed**
```

---

### `.agent/workflows/new-page.md`

```markdown
# New Page Workflow

Triggered with: /new-page

## Steps

1. **Determine route group**
   - Public? → app/(public)/
   - Auth required? → app/(dashboard)/
   - Admin only? → app/(admin)/

2. **Create page structure**
   ```
   app/(group)/page-name/
   ├── page.tsx
   ├── layout.tsx (if needed)
   └── components/ (page-specific)
   ```

3. **Set up page component**
   - Add metadata export for SEO
   - Use appropriate layout
   - Follow page patterns from 07-SITE-PAGES.md

4. **Add navigation**
   - Update nav config if needed
   - Add breadcrumbs if applicable

5. **Test page**
   - Check all breakpoints (mobile, tablet, desktop)
   - Verify auth/role protection
   - Test loading and error states
```

---

### `.agent/workflows/database-change.md`

```markdown
# Database Change Workflow

Triggered with: /database-change

## Steps

1. **Plan the change**
   - What tables/columns are affected?
   - Is this additive or destructive?
   - What code will be affected?

2. **Write migration**
   - Create file: supabase/migrations/XXX_description.sql
   - Include both UP and DOWN if possible
   - Add comments explaining the change

3. **Update Drizzle schema**
   - Edit: lib/db/schema.ts
   - Match migration exactly

4. **Generate and push**
   ```bash
   npx drizzle-kit generate:pg
   npx drizzle-kit push:pg
   npm run generate-types
   ```

5. **Update affected code**
   - Find all usages of changed tables/columns
   - Update queries and types
   - Test each change

6. **Verify**
   - Run type-check: npm run type-check
   - Test affected features manually
```

---

### `.agent/workflows/refactor.md`

```markdown
# Refactor Workflow

Triggered with: /refactor

## Steps

1. **Identify scope**
   - What exactly needs refactoring?
   - What are the boundaries?
   - What should NOT change?

2. **Find all usages**
   - Search for imports
   - Search for component/function name
   - Check for string references
   - Document all locations

3. **Create new implementation**
   - Build alongside old code
   - Do NOT delete old code yet
   - Test new implementation in isolation

4. **Migrate usages**
   - Update ONE usage at a time
   - Test after each update
   - Commit incrementally if large refactor

5. **Verify no references remain**
   - Search again for old code references
   - Ensure nothing imports old code

6. **Delete old code**
   - Only after ALL usages migrated
   - Verify build still works
   - Commit deletion separately

7. **Document**
   - Add commit message explaining refactor
   - Update any affected documentation
```

---

### `.agent/workflows/test-feature.md`

```markdown
# Test Feature Workflow

Triggered with: /test-feature

## Steps

1. **Identify test scope**
   - What feature is being tested?
   - What are the expected behaviors?
   - What accounts needed?

2. **Prepare environment**
   - Dev server running? (npm run dev)
   - Python backend running? (if needed)
   - Database accessible?

3. **Select test account**
   - Public pages: No login
   - User dashboard: test-user@stepten.io / TestUser123!
   - Paid features: test-paid@stepten.io / TestPaid123!
   - Admin panel: test-admin@stepten.io / TestAdmin123!
   - Full system: test-super@stepten.io / TestSuper123!

4. **Execute tests**
   - Check TypeScript: npm run type-check
   - Check browser console for errors
   - Test all user flows
   - Test responsive (375px, 768px, 1280px)

5. **Document issues**
   - Note any errors found
   - Include console output
   - Include steps to reproduce

6. **Fix and re-test**
   - Address issues found
   - Re-run test suite
   - Verify fix doesn't break other features
```

---

### `.agent/workflows/deploy.md`

```markdown
# Deploy Workflow

Triggered with: /deploy

## Pre-Deploy Checklist

1. **Code quality**
   - [ ] npm run type-check passes
   - [ ] npm run lint passes
   - [ ] npm run build succeeds
   - [ ] No console.logs left in code

2. **Testing**
   - [ ] All features tested locally
   - [ ] Responsive design verified
   - [ ] No console errors in browser

3. **Database**
   - [ ] Migrations ready to apply
   - [ ] Types regenerated

4. **Environment**
   - [ ] All env vars set in Vercel
   - [ ] All env vars set in Render
   - [ ] API keys valid for production

## Deploy Steps

1. **Push to main**
   ```bash
   git push origin main
   ```

2. **Vercel auto-deploys**
   - Monitor deployment logs
   - Check for build errors

3. **Apply database migrations**
   ```bash
   npx supabase db push --db-url [production-url]
   ```

4. **Verify deployment**
   - Check production site
   - Test critical flows
   - Monitor for errors

5. **Rollback if needed**
   - Revert commit in Git
   - Redeploy previous version
```

---

## Security Settings

### Terminal Allow List

Safe commands the agent can auto-execute:
```
npm run dev
npm run build
npm run type-check
npm run lint
npm run generate-types
npx drizzle-kit studio
ls
cat
grep
```

### Terminal Deny List

Commands requiring approval:
```
rm -rf
git push --force
npx supabase db push
DROP TABLE
DELETE FROM
```

### Browser Allow List

Configure in: `~/.gemini/antigravity/browserAllowlist.txt`

```
localhost:3000
localhost:8000
supabase.com
vercel.com
render.com
github.com
```

---

## Agent Development Mode

Recommended: **Agent-Assisted Development**
- You stay in control
- Agent helps with safe automations
- Terminal Policy: Auto for standard commands
- Confirmations: Agent Decides for edge cases

---

## MCP Server Support

Antigravity supports MCP (Model Context Protocol) servers. Our Python backend can be connected as an MCP server for:
- Database operations
- Search operations
- SEO tools
- Agent memory

Configure in Antigravity settings under MCP Servers.
