# 17 — Development Workflow

---

## Overview

How to set up, develop, test, and deploy StepTen.

---

## Initial Setup

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Python 3.11+
- Git
- Supabase account
- Vercel account
- Render account (for Python backend)

### Clone & Install

```bash
# Clone repository
git clone https://github.com/yourusername/stepten.git
cd stepten

# Install Next.js dependencies
cd apps/web
npm install

# Install Python dependencies
cd ../python
pip install -r requirements.txt
```

### Environment Setup

```bash
# Copy example env file
cp .env.example .env.local

# Fill in your values:
# - Supabase URL and keys
# - AI API keys
# - Stripe keys (test mode)
```

### Database Setup

```bash
# Link to Supabase project
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push

# Generate TypeScript types
npm run generate-types
```

### Create Test Accounts

1. Go to Supabase Dashboard > Authentication > Users
2. Add users (disable email confirmation first):
   - test-user@stepten.io / TestUser123!
   - test-paid@stepten.io / TestPaid123!
   - test-admin@stepten.io / TestAdmin123!
   - test-super@stepten.io / TestSuper123!
3. Run SQL to set roles (see 15-TESTING-GUIDE.md)

---

## Daily Development

### Start Dev Servers

```bash
# Terminal 1: Next.js
cd apps/web
npm run dev
# → http://localhost:3000

# Terminal 2: Python (if working on agents/MCP)
cd apps/python
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000
```

### Development Cycle

```
1. Pick a task
2. Create feature branch: git checkout -b feat/feature-name
3. Make changes
4. Test locally
5. Commit with clear message
6. Push branch
7. Create PR (if using PRs)
8. Merge to main
9. Vercel auto-deploys from main
```

---

## Branch Strategy

### Branch Types

| Branch | Purpose | Naming |
|--------|---------|--------|
| `main` | Production-ready code | — |
| `feat/*` | New features | `feat/seo-engine` |
| `fix/*` | Bug fixes | `fix/auth-redirect` |
| `refactor/*` | Code restructuring | `refactor/button-component` |
| `docs/*` | Documentation | `docs/api-readme` |

### Workflow

```bash
# Start new feature
git checkout main
git pull
git checkout -b feat/my-feature

# Work on feature...
git add .
git commit -m "feat(scope): description"

# Push and create PR
git push -u origin feat/my-feature

# After review, merge to main
# Vercel auto-deploys
```

---

## Database Workflow

### Making Schema Changes

```bash
# 1. Write migration
# Create file: supabase/migrations/XXX_description.sql

# 2. Test locally
npx supabase db push

# 3. Update Drizzle schema
# Edit: lib/db/schema.ts

# 4. Generate Drizzle migration
npx drizzle-kit generate:pg

# 5. Regenerate types
npm run generate-types

# 6. Test affected features

# 7. Commit all changes together
git add .
git commit -m "feat(db): add new_table for feature"
```

### Drizzle Commands

```bash
# Generate migration from schema changes
npx drizzle-kit generate:pg

# Push schema to database
npx drizzle-kit push:pg

# View database in browser
npx drizzle-kit studio

# Check for drift between schema and DB
npx drizzle-kit check:pg
```

---

## Component Development

### Creating a New Component

```bash
# 1. Check if similar exists
grep -r "ComponentName" components/

# 2. Check ShadCN
npx shadcn@latest add [component]

# 3. Create in appropriate folder
touch components/shared/MyComponent.tsx

# 4. Implement following patterns in 14-COMPONENT-LIBRARY.md

# 5. Test in isolation
# Create test page or use Storybook

# 6. Use in actual pages

# 7. Document if complex
```

### Using ShadCN Components

```bash
# Add a component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Components added to /components/ui/
# Customize as needed following style guide
```

---

## AI Agent Development

### Testing Agents Locally

```bash
# 1. Start Python backend
cd apps/python
uvicorn app.main:app --reload --port 8000

# 2. Check health
curl http://localhost:8000/health

# 3. Test chat endpoint
curl -X POST http://localhost:8000/agents/chat \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "sales", "message": "Hello"}'
```

### Agent Development Cycle

```
1. Modify agent config in /apps/python/app/agents/
2. Update system prompt
3. Test via API calls
4. Test via frontend chat widget
5. Check memory persistence
6. Check tool usage
```

---

## Deployment

### Vercel (Next.js)

```bash
# Automatic deployment on push to main
# Or manual deploy:
vercel --prod
```

**Environment Variables in Vercel:**
- All NEXT_PUBLIC_* variables
- Server-side secrets
- API keys

### Render (Python Backend)

```bash
# Connect GitHub repo to Render
# Set environment variables in Render dashboard
# Auto-deploys on push to main
```

**Render Settings:**
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Supabase

```bash
# Push migrations to production
npx supabase db push --db-url your-production-url

# Or via dashboard
# Supabase Dashboard > Database > Migrations
```

---

## Debugging Production Issues

### Vercel Logs

```bash
# View logs
vercel logs

# Or in dashboard
# Vercel > Project > Deployments > [deployment] > Logs
```

### Render Logs

```bash
# View in Render dashboard
# Render > Service > Logs
```

### Supabase Logs

```
# Dashboard > Logs > API
# Dashboard > Logs > Postgres
# Dashboard > Logs > Auth
```

---

## Common Tasks

### Adding a New Page

```bash
# 1. Create page file
mkdir -p app/(public)/new-page
touch app/(public)/new-page/page.tsx

# 2. Implement page component
# 3. Add to navigation if needed
# 4. Test locally
# 5. Commit and push
```

### Adding a New API Route

```bash
# 1. Create route file
mkdir -p app/api/feature
touch app/api/feature/route.ts

# 2. Implement handlers
export async function GET(request: Request) {}
export async function POST(request: Request) {}

# 3. Test via browser/curl
# 4. Connect frontend
```

### Adding a Database Table

```bash
# 1. Write migration
# 2. Update Drizzle schema
# 3. Generate types
# 4. Create API routes if needed
# 5. Create UI components
# 6. Test full flow
```

---

## Checklist: Before Pushing

```
□ No TypeScript errors: npm run type-check
□ No ESLint errors: npm run lint
□ Build succeeds: npm run build
□ Feature tested locally
□ Responsive design checked
□ No console errors
□ Commit message follows convention
□ No secrets in code
□ No console.logs left in
□ Updated relevant docs
```

---

## Checklist: Before Deploying to Production

```
□ All tests passing
□ Feature tested on staging (if available)
□ Database migrations ready
□ Environment variables set in Vercel/Render
□ No breaking changes to API
□ Rollback plan if needed
□ Team notified of deployment
```

---

## Quick Reference

### Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Production build
npm run type-check       # Check TypeScript
npm run lint             # Run ESLint

# Database
npm run generate-types   # Regenerate Supabase types
npx drizzle-kit studio   # Open Drizzle Studio

# Python
uvicorn app.main:app --reload  # Start dev server
pip install -r requirements.txt  # Install deps

# Git
git checkout -b feat/name  # New feature branch
git push -u origin HEAD    # Push current branch
```

### Useful Links

| Resource | URL |
|----------|-----|
| Local Dev | http://localhost:3000 |
| Python Backend | http://localhost:8000 |
| Supabase Dashboard | https://supabase.com/dashboard |
| Vercel Dashboard | https://vercel.com/dashboard |
| Render Dashboard | https://dashboard.render.com |
| Drizzle Studio | http://localhost:4983 |
