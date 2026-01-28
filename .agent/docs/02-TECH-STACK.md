# 02 — Tech Stack (2026)

---

## Overview

This document defines all technologies used in StepTen.io and serves as a learning guide for Google Antigravity agents. Each technology includes what it is, why we use it, and how to use it.

---

## Core Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **IDE** | Google Antigravity | Agent-first development |
| **Framework** | Next.js 15 (App Router) | Full-stack React |
| **Language** | TypeScript | Type-safe JavaScript |
| **ORM** | Drizzle | Type-safe database queries |
| **Database** | Supabase (Postgres + pgvector) | Database, auth, storage |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Animations** | Framer Motion | React animations |
| **UI Components** | ShadCN + Aceternity UI + Magic UI | Component libraries |
| **Python Backend** | FastAPI | AI agents, MCP server |
| **Payments** | Stripe | Subscriptions, one-time |
| **Deployment** | Vercel + Render | Frontend + Backend hosting |

---

# FRONTEND

---

## Next.js 15 (App Router)

### What It Is
Next.js is a React framework for building full-stack web applications. Version 15 with App Router is the latest (2026) approach.

### Why We Use It
- File-based routing (folders = URLs)
- Server Components (faster, less JavaScript)
- Server Actions (form handling without API routes)
- Built-in optimization (images, fonts, scripts)
- Vercel deployment (instant)

### Key Concepts

**File-Based Routing:**
```
app/
├── page.tsx              → /
├── about/page.tsx        → /about
├── products/[id]/page.tsx → /products/123
```

**Route Groups (Parentheses):**
```
app/
├── (public)/             → No URL effect, just organization
│   ├── page.tsx          → /
│   └── about/page.tsx    → /about
├── (dashboard)/
│   └── settings/page.tsx → /settings (requires auth)
```

**Special Files:**
| File | Purpose |
|------|---------|
| `page.tsx` | The UI for this route |
| `layout.tsx` | Shared wrapper (persists across navigation) |
| `loading.tsx` | Loading state |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |

**Server vs Client Components:**
```tsx
// Server Component (default) - runs on server
export default function Page() {
  // Can fetch data directly, no useState/useEffect
  return <div>Server rendered</div>
}

// Client Component - runs in browser
"use client"
import { useState } from "react"
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

**When to use Client Components:**
- useState, useEffect, or other hooks
- Browser APIs (window, document)
- Event handlers (onClick, onChange)
- Interactive UI

### Commands
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Run production build
npm run type-check   # Check TypeScript errors
```

### Links
- Docs: https://nextjs.org/docs
- Learn: https://nextjs.org/learn

---

## TypeScript

### What It Is
TypeScript is JavaScript with types. It catches errors before you run the code.

### Why We Use It
- Catches bugs at compile time
- Better autocomplete in IDE
- Self-documenting code
- Required for Drizzle type safety

### Key Concepts

**Basic Types:**
```typescript
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let items: string[] = ["a", "b", "c"];
```

**Interfaces (for objects):**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;  // Optional (?)
}

const user: User = {
  id: "1",
  name: "John",
  email: "john@example.com"
};
```

**Type (for unions, primitives):**
```typescript
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

let status: Status = "pending";  // Only these 3 values allowed
```

**Function Types:**
```typescript
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;
```

**React Component Props:**
```typescript
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ text, onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{text}</button>
}
```

### Links
- Docs: https://www.typescriptlang.org/docs
- Playground: https://www.typescriptlang.org/play

---

## Tailwind CSS

### What It Is
Tailwind is utility-first CSS. Instead of writing CSS files, you use classes directly in HTML.

### Why We Use It
- No CSS files to manage
- Consistent spacing/colors via config
- Responsive design built-in
- Dark mode support
- Works great with React/Next.js

### Key Concepts

**Instead of this CSS:**
```css
.card {
  background-color: #111;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #262626;
}
```

**You write this:**
```html
<div class="bg-background-alt p-lg rounded-lg border border-border">
```

**Common Classes:**

| Category | Classes |
|----------|---------|
| **Background** | `bg-background`, `bg-background-alt`, `bg-primary` |
| **Text** | `text-foreground`, `text-foreground-muted`, `text-primary` |
| **Spacing** | `p-4`, `px-6`, `py-2`, `m-4`, `mx-auto`, `gap-4` |
| **Size** | `w-full`, `h-screen`, `max-w-7xl`, `min-h-[100px]` |
| **Flex** | `flex`, `flex-col`, `items-center`, `justify-between` |
| **Grid** | `grid`, `grid-cols-3`, `gap-6` |
| **Border** | `border`, `border-border`, `rounded-lg`, `rounded-full` |
| **Effects** | `shadow-lg`, `opacity-50`, `blur-sm` |

**Responsive Prefixes:**
```html
<!-- Full width on mobile, half on medium screens, third on large -->
<div class="w-full md:w-1/2 lg:w-1/3">
```

| Prefix | Screen Size |
|--------|-------------|
| (none) | All screens (mobile-first) |
| `sm:` | 640px+ |
| `md:` | 768px+ |
| `lg:` | 1024px+ |
| `xl:` | 1280px+ |

**State Modifiers:**
```html
<button class="bg-primary hover:bg-primary-muted focus:ring-2 active:scale-95">
```

### StepTen Custom Classes (from tailwind.config.ts)
```
bg-background       → #0a0a0a (main dark)
bg-background-alt   → #111111 (cards)
bg-background-muted → #171717 (inputs)
text-foreground     → #fafafa (white text)
text-foreground-muted → #a1a1aa (gray text)
text-primary        → #00FF41 (Matrix green)
text-info           → #22D3EE (Aqua)
border-border       → #262626 (default border)
```

### Links
- Docs: https://tailwindcss.com/docs
- Cheatsheet: https://nerdcave.com/tailwind-cheat-sheet

---

## Framer Motion

### What It Is
Framer Motion is a React animation library. Makes animations declarative and simple.

### Why We Use It
- Easy syntax
- Scroll-triggered animations
- Gesture support (hover, tap, drag)
- Layout animations
- Exit animations

### Key Concepts

**Basic Animation:**
```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0 }}      // Starting state
  animate={{ opacity: 1 }}      // End state
  transition={{ duration: 0.5 }} // How long
>
  Fades in
</motion.div>
```

**Fade Up (common pattern):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Slides up and fades in
</motion.div>
```

**On Scroll (whileInView):**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}  // Only animate once
  transition={{ duration: 0.5 }}
>
  Animates when scrolled into view
</motion.div>
```

**Hover/Tap:**
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

**Stagger Children:**
```tsx
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Links
- Docs: https://www.framer.com/motion

---

## ShadCN/ui

### What It Is
ShadCN is a collection of copy-paste React components. You own the code — it's copied into your project, not installed as a package.

### Why We Use It
- Full control (code in your repo)
- Accessible by default
- Tailwind-based styling
- Highly customizable
- Great TypeScript support

### How to Use

**Add a component:**
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

Components are added to `/components/ui/`.

**Use in code:**
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Content here</p>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  )
}
```

**Customize:**
Edit the component files directly in `/components/ui/`.

### Links
- Docs: https://ui.shadcn.com
- Components: https://ui.shadcn.com/docs/components

---

## Aceternity UI + Magic UI

### What They Are
Additional animated component libraries with futuristic effects. Copy-paste like ShadCN.

### Why We Use Them
- Hero sections with particle effects
- Animated cards
- 3D effects
- Gradient borders
- Spotlight effects
- Grid backgrounds

### When to Use
- Hero sections
- Landing pages
- Feature showcases
- "Wow" moments

### Links
- Aceternity: https://ui.aceternity.com
- Magic UI: https://magicui.design

---

# DATABASE

---

## Supabase

### What It Is
Supabase is an open-source Firebase alternative built on PostgreSQL. It provides database, authentication, storage, and real-time features.

### Why We Use It
- Full PostgreSQL (not NoSQL)
- Built-in auth
- Row Level Security (RLS)
- Real-time subscriptions
- File storage
- pgvector for embeddings
- Great free tier

### Key Concepts

**Setup:**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Basic Queries:**
```typescript
const supabase = createClient()

// SELECT all
const { data, error } = await supabase.from('users').select('*')

// SELECT with filter
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false })

// INSERT
const { data, error } = await supabase
  .from('users')
  .insert({ name: 'John', email: 'john@example.com' })

// UPDATE
const { error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', userId)

// DELETE
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', userId)
```

**Authentication:**
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()

// Sign out
await supabase.auth.signOut()
```

**Row Level Security (RLS):**
```sql
-- Users can only see their own data
CREATE POLICY "Users see own data" ON profiles
  FOR SELECT USING (auth.uid() = id);
```

### Links
- Docs: https://supabase.com/docs
- Dashboard: https://supabase.com/dashboard

---

## Drizzle ORM

### What It Is
Drizzle is a TypeScript ORM (Object-Relational Mapper). It lets you write database queries in TypeScript with full type safety.

### Why We Use It (Not Prisma)
- Lightweight (no binary)
- Faster cold starts (better for serverless)
- SQL-like syntax (easier to understand)
- Works great with Supabase

### Key Concepts

**Schema Definition:**
```typescript
// lib/db/schema.ts
import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').default('user'),
  createdAt: timestamp('created_at').defaultNow()
})

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content'),
  authorId: uuid('author_id').references(() => users.id),
  status: text('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow()
})
```

**Connection:**
```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
export const db = drizzle(client, { schema })
```

**Queries:**
```typescript
import { db } from '@/lib/db'
import { users, articles } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

// SELECT all
const allUsers = await db.select().from(users)

// SELECT with filter
const publishedArticles = await db
  .select()
  .from(articles)
  .where(eq(articles.status, 'published'))
  .orderBy(desc(articles.createdAt))

// SELECT specific columns
const names = await db.select({ name: users.name }).from(users)

// INSERT
await db.insert(users).values({
  name: 'John',
  email: 'john@example.com'
})

// UPDATE
await db.update(users)
  .set({ name: 'Jane' })
  .where(eq(users.id, userId))

// DELETE
await db.delete(users).where(eq(users.id, userId))

// JOIN
const articlesWithAuthors = await db
  .select()
  .from(articles)
  .leftJoin(users, eq(articles.authorId, users.id))
```

**Migrations:**
```bash
# Generate migration from schema changes
npx drizzle-kit generate:pg

# Push schema to database (dev only)
npx drizzle-kit push:pg

# Open visual database browser
npx drizzle-kit studio
```

### Links
- Docs: https://orm.drizzle.team/docs
- Supabase Guide: https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase

---

# BACKEND

---

## Python FastAPI

### What It Is
FastAPI is a modern Python web framework for building APIs. We use it for AI agent orchestration and MCP server.

### Why We Use It
- Fast (async by default)
- Automatic API docs
- Type hints with Pydantic
- Great for AI/ML workloads
- Python ecosystem (LangChain, LlamaIndex)

### Key Concepts

**Basic API:**
```python
# app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    return {"user_id": user_id}

@app.post("/users")
async def create_user(name: str, email: str):
    return {"name": name, "email": email}
```

**Run:**
```bash
uvicorn app.main:app --reload --port 8000
```

### Links
- Docs: https://fastapi.tiangolo.com

---

## Supabase Python Client

### What It Is
Official Python client for Supabase. Used in our FastAPI backend.

### Why We Use It
- Simple API
- Matches JS client patterns
- Auth support
- Storage support

### Key Concepts

```python
from supabase import create_client

supabase = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_SERVICE_KEY")
)

# SELECT
data = supabase.table("users").select("*").execute()

# INSERT
supabase.table("users").insert({"name": "John"}).execute()

# UPDATE
supabase.table("users").update({"name": "Jane"}).eq("id", user_id).execute()
```

### Links
- Docs: https://supabase.com/docs/reference/python/introduction

---

# AI SERVICES

---

## AI Model Usage (January 2026)

| Task | Model | API ID | Why |
|------|-------|--------|-----|
| **SEO Content Writing** | Claude 4.5 Sonnet | `claude-sonnet-4-5-20250929` | Least AI-sounding, best quality |
| **Chat Agents** | Claude 4.5 Sonnet | `claude-sonnet-4-5-20250929` | Great reasoning, tool use |
| **Research** | Perplexity Sonar | `sonar-reasoning-pro` | Live citations, real-time |
| **Humanization** | Grok 4.1 | `grok-4-1-fast-reasoning` | Fast, removes AI patterns |
| **Code Optimization** | Gemini 3 Pro | `gemini-3-pro-preview` | Best for code, 1M context |
| **Embeddings** | Gemini | `text-embedding-005` | SOTA for long docs |
| **Voice Transcription** | OpenAI Whisper | `whisper-1` | Best accuracy |
| **Image Generation** | Gemini Imagen / Flux | — | High quality |
| **Video Generation** | Google Veo | — | Best quality video |
| **Budget Coding** | DeepSeek V3.2 | `deepseek-v3.2-maas` | 90% cheaper, rivals GPT-5 |

---

# INFRASTRUCTURE

---

## Deployment

| Service | What | URL |
|---------|------|-----|
| **Vercel** | Next.js hosting | vercel.com |
| **Render** | Python backend hosting | render.com |
| **Supabase** | Database + Auth | supabase.com |
| **Stripe** | Payments | stripe.com |

### Vercel Deployment
- Auto-deploys from GitHub
- Push to `main` → production
- Environment variables in dashboard

### Render Deployment
- Connects to GitHub repo
- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

# DEVELOPMENT TOOLS

---

## Google Antigravity IDE (2026)

### What It Is
Google Antigravity is an AI-powered IDE released November 2025. It lets you build software using autonomous agents instead of writing code line by line. Powered by Gemini 3 Pro.

### Key Features
- **Editor View:** Traditional IDE with AI sidebar
- **Manager View:** Control multiple agents in parallel
- **Browser Extension:** Agent can click, type, take screenshots
- **Artifacts:** Agents produce plans, screenshots, recordings
- **Rules:** Always-on instructions for agents (`.agent/rules/`)
- **Workflows:** Saved prompts triggered with `/` (`.agent/workflows/`)

### Development Modes
| Mode | Description | Use When |
|------|-------------|----------|
| **Agent-Driven** | Full autonomy, agent does everything | Scaffolding, boilerplate |
| **Agent-Assisted** | Agent works, pauses for checkpoints | **RECOMMENDED** |
| **Review-Driven** | You approve every action | Auth, payments, critical code |

### Our Configuration
- Rules in: `.agent/rules/`
- Workflows in: `.agent/workflows/`
- See `16-ANTIGRAVITY-RULES.md` for full setup

### Download
https://antigravity.google/download

---

## Git

### Essential Commands
```bash
git clone [url]              # Clone repo
git status                   # Check status
git add .                    # Stage all changes
git commit -m "message"      # Commit
git push                     # Push to remote
git pull                     # Pull latest
git checkout -b feat/name    # Create branch
git checkout main            # Switch to main
git merge feat/name          # Merge branch
```

### Commit Convention
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructuring
- style: Formatting
- docs: Documentation
- chore: Maintenance

Examples:
feat(auth): add login page
fix(dashboard): resolve loading bug
refactor(components): consolidate buttons
```

---

# DESIGN

---

## Color Palette

| Name | Hex | Tailwind Class |
|------|-----|----------------|
| Background | `#0a0a0a` | `bg-background` |
| Background Alt | `#111111` | `bg-background-alt` |
| Background Muted | `#171717` | `bg-background-muted` |
| Foreground | `#fafafa` | `text-foreground` |
| Foreground Muted | `#a1a1aa` | `text-foreground-muted` |
| Primary (Matrix Green) | `#00FF41` | `text-primary` / `bg-primary` |
| Info (Aqua) | `#22D3EE` | `text-info` |
| Error | `#FF4757` | `text-error` |
| Warning | `#FBBF24` | `text-warning` |
| Border | `#262626` | `border-border` |

## Typography

- **Primary Font:** Space Grotesk
- **Monospace:** JetBrains Mono

## Style

- Dark mode only
- Futuristic 2030 aesthetic
- Subtle glows and gradients
- Smooth scroll animations
- Particle effects on hero sections only

---

# QUICK REFERENCE

## File Locations

| What | Where |
|------|-------|
| Pages | `app/(group)/page.tsx` |
| Components | `components/` |
| UI Components | `components/ui/` |
| Database Schema | `lib/db/schema.ts` |
| Supabase Client | `lib/supabase/` |
| Hooks | `hooks/` |
| Types | `types/` |
| Antigravity Rules | `.agent/rules/` |
| Antigravity Workflows | `.agent/workflows/` |

## Common Commands

```bash
# Next.js
npm run dev              # Start dev server
npm run build            # Build
npm run type-check       # TypeScript check

# Database
npx drizzle-kit generate:pg  # Generate migration
npx drizzle-kit push:pg      # Push to DB
npx drizzle-kit studio       # Visual browser

# Components
npx shadcn@latest add [name]  # Add component

# Python
uvicorn app.main:app --reload  # Start backend
```

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# AI APIs
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_API_KEY=
XAI_API_KEY=
PERPLEXITY_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Backend
PYTHON_BACKEND_URL=http://localhost:8000
```
