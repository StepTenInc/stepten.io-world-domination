# 18 — StepTen Learning Guide

---

## Overview

This is your master learning document for all technologies used in StepTen. Feed this to NotebookLLM for interactive learning. Update this document as you learn new things.

---

# PART 1: GOOGLE ANTIGRAVITY IDE

## What is Antigravity?

Google Antigravity is Google's free AI-powered IDE that lets developers build software using autonomous agents instead of writing code line by line. Powered by Gemini 3 Pro, it features an Agent Manager for orchestrating tasks, a built-in browser for testing, and support for multi-agent collaboration.

You can think of Antigravity as a new agentic development platform that evolves the traditional IDE into an agent-first experience. Unlike standard coding assistants that just autocomplete lines, Antigravity provides a "Mission Control" for managing autonomous agents that can plan, code, and even browse the web to help you build.

## Why It's Different

Traditional IDE: You write code, AI suggests next line
Antigravity: You describe the task, AI builds the whole thing

Antigravity isn't just an editor—it's a development platform that combines a familiar, AI-powered coding experience with a new agent-first interface. This allows you to deploy agents that autonomously plan, execute, and verify complex tasks across your editor, terminal, and browser.

## Two Main Views

### 1. Editor View
- Looks like VS Code
- Tab completions
- Inline AI commands
- Use this for hands-on coding

### 2. Manager View (Agent Manager)
Upon launching Antigravity, the user is typically greeted not by a file tree, but by the Agent Manager. This interface acts as a Mission Control dashboard. It is designed for high-level orchestration, allowing developers to spawn, monitor, and interact with multiple agents operating asynchronously across different workspaces or tasks.

## Development Modes

Antigravity doesn't force one workflow on you:
- **Agent-Driven**: The agent takes complete autonomy. You define the goal, the agent plans and executes without interruption. Best for greenfield scaffolding and clear-cut tasks.
- **Agent-Assisted**: The sweet spot. The agent makes decisions, pauses for verification checkpoints, then continues. You provide tactical guidance without stopping the workflow.
- **Review-Driven**: You retain strict control. The agent proposes everything; you approve each step. Ideal for critical paths (payment systems, auth).

**Recommendation for StepTen:** Start with Agent-Assisted mode.

## Artifacts

Delegating work to an agent requires trust, but scrolling through raw tool calls is tedious. Antigravity solves this by having agents generate Artifacts—tangible deliverables like task lists, implementation plans, screenshots, and browser recordings. These Artifacts allow you to verify the agent's logic at a glance.

Artifacts in Antigravity are dynamic intermediates like screen recordings, diagrams, or markdown to communicate agent progress. Provide asynchronous feedback directly on the artifact to guide the agent without interrupting its flow.

## Rules & Workflows

### Rules (Always Active)
Rules help guide the behavior of the agent. These are guidelines you can provide to make sure the agent follows as it generates code and tests. For example, you might want the agent to follow a certain code style, or to always document methods. You can add these as rules and the agent will take them into account.

**Location:** `.agent/rules/` in your project

### Workflows (Triggered with /)
Workflows are saved prompts that you can trigger on demand with /, as you interact with the agent. They also guide the behavior of the agent but they're triggered by the user on demand. A good analogy is that Rules are more like system instructions whereas Workflows are more like saved prompts that you can choose on demand.

**Location:** `.agent/workflows/` in your project

## Browser Extension

Google Antigravity installs a dedicated Chrome extension for AI agents that allows it to launch a window, scroll, type, click, and inspect console logs autonomously.

This means Antigravity can:
- Open your app in browser
- Click buttons
- Fill forms
- Take screenshots
- Record videos
- Test your UI automatically

## Security Settings

### Terminal Allow/Deny Lists
Giving an AI agent access to your terminal and browser is a double-edged sword. It enables autonomous debugging and deployment but also opens vectors for Prompt Injection and Data Exfiltration. Antigravity addresses this through a granular permission system revolving around Terminal Command Auto Execution policies, Allow Lists, and Deny Lists.

### Browser Allow List
Configure trusted domains the agent can access in:
`~/.gemini/antigravity/browserAllowlist.txt`

## Tips for Using Antigravity

Use Agent Manager for vibe coding: multiple workspaces for parallel projects, playground for experiments, inbox for session views, conversation view for real-time agent actions, browser subagent for operations with screenshots, panes for files/artifacts, review changes/source control, changes sidebar, terminal, and files for comments.

Before writing code, Antigravity generates an Implementation Plan. The killer feature here is the ability to highlight text in the plan (or code) and leave comments, just like Google Docs.

## Download

Download at: https://antigravity.google/download

---

# PART 2: NEXT.JS 15

## What is Next.js?

Next.js is a React framework for building full-stack web applications. It handles:
- Routing (file-based)
- Server-side rendering
- API routes
- Static site generation
- And much more

## App Router vs Pages Router

Next.js has two routing systems:
- **App Router** (NEW - what we use): `/app` directory
- **Pages Router** (OLD): `/pages` directory

We use App Router because it's the modern approach with better features.

## Key Concepts

### File-Based Routing

Next.js uses a file and folder structure to create web page routes: Folders Define Routes - Each folder represents a different page or part of your website. Files Create Content - Inside these folders, files contain the actual content or user interface (UI) for each page or section.

```
app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
├── products/
│   └── [id]/
│       └── page.tsx  → /products/123
```

### Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | The UI for a route |
| `layout.tsx` | Shared UI for a segment and its children |
| `loading.tsx` | Loading UI |
| `error.tsx` | Error UI |
| `not-found.tsx` | 404 UI |

### Server Components vs Client Components

**Server Components (default):**
- Render on the server
- Can fetch data directly
- Cannot use browser APIs or React hooks

**Client Components:**
- Add `"use client"` at top of file
- Can use useState, useEffect, etc.
- Run in the browser

```tsx
// Server Component (default)
export default function Page() {
  return <div>Server rendered</div>
}

// Client Component
"use client"
import { useState } from "react"
export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Route Groups

Use parentheses to organize routes without affecting the URL:

```
app/
├── (public)/         → No URL segment
│   ├── page.tsx      → /
│   └── about/
│       └── page.tsx  → /about
├── (dashboard)/
│   └── settings/
│       └── page.tsx  → /settings
```

### Dynamic Routes

Use brackets for dynamic segments:

```
app/
├── products/
│   └── [id]/
│       └── page.tsx  → /products/123, /products/456, etc.
```

Access the parameter:
```tsx
export default function Product({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>
}
```

### API Routes

Create API endpoints in `app/api/`:

```tsx
// app/api/hello/route.ts
export async function GET(request: Request) {
  return Response.json({ message: "Hello" })
}

export async function POST(request: Request) {
  const data = await request.json()
  return Response.json({ received: data })
}
```

## Common Commands

```bash
# Create new project
npx create-next-app@latest

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Learning Resources

- Official Tutorial: https://nextjs.org/learn
- Documentation: https://nextjs.org/docs

---

# PART 3: DRIZZLE ORM

## What is Drizzle?

Drizzle is a TypeScript ORM designed for developer productivity. It supports every PostgreSQL, MySQL and SQLite database, including serverless ones like Supabase. It works in every major JavaScript runtime like NodeJS, Bun, Deno, Cloudflare Workers, and even in browsers.

## Why Drizzle (Not Prisma)?

| Drizzle | Prisma |
|---------|--------|
| Lightweight | Heavy |
| Faster cold starts | Slower cold starts |
| SQL-like syntax | Custom syntax |
| No binary | Requires Rust binary |

## Setting Up with Supabase

This tutorial demonstrates how to use Drizzle ORM with Supabase Database. Every Supabase project comes with a full Postgres database.

### Install

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Configure

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### Define Schema

```typescript
// lib/db/schema.ts
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Connect

If you decide to use connection pooling via Supabase and have "Transaction" pool mode enabled, then ensure to turn off prepare, as prepared statements are not supported.

```typescript
// lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client, { schema });
```

### Queries

```typescript
// SELECT
const allUsers = await db.select().from(users);
const user = await db.select().from(users).where(eq(users.id, 1));

// INSERT
await db.insert(users).values({ name: 'John', email: 'john@example.com' });

// UPDATE
await db.update(users).set({ name: 'Jane' }).where(eq(users.id, 1));

// DELETE
await db.delete(users).where(eq(users.id, 1));

// JOIN
const postsWithUsers = await db
  .select()
  .from(posts)
  .leftJoin(users, eq(posts.userId, users.id));
```

### Migrations

```bash
# Generate migration from schema
npx drizzle-kit generate:pg

# Push schema to database
npx drizzle-kit push:pg

# Open Drizzle Studio (visual database browser)
npx drizzle-kit studio
```

## Learning Resources

- Documentation: https://orm.drizzle.team/docs
- Supabase Guide: https://orm.drizzle.team/docs/tutorials/drizzle-with-supabase

---

# PART 4: SUPABASE

## What is Supabase?

Supabase is an open-source Firebase alternative. It provides:
- PostgreSQL database
- Authentication
- Real-time subscriptions
- Storage (files)
- Edge Functions
- Vector embeddings (pgvector)

## Key Features for StepTen

### Database
- Full PostgreSQL
- Row Level Security (RLS)
- Real-time subscriptions

### Auth
- Email/password
- OAuth (Google, GitHub, etc.)
- Magic links
- Session management

### Storage
- File uploads
- Image transformations
- CDN delivery

### pgvector
- Store embeddings
- Semantic search
- RAG applications

## Setting Up

### Install

```bash
npm install @supabase/supabase-js
```

### Client Setup

```typescript
// lib/supabase/client.ts (browser)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts (server)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set(name, value, options) },
        remove(name, options) { cookieStore.set(name, '', options) },
      },
    }
  );
}
```

### Basic Queries

```typescript
const supabase = createClient();

// Select
const { data, error } = await supabase.from('users').select('*');

// Select with filter
const { data } = await supabase
  .from('posts')
  .select('*')
  .eq('user_id', userId);

// Insert
const { data, error } = await supabase
  .from('users')
  .insert({ name: 'John', email: 'john@example.com' });

// Update
const { data, error } = await supabase
  .from('users')
  .update({ name: 'Jane' })
  .eq('id', 1);

// Delete
const { error } = await supabase
  .from('users')
  .delete()
  .eq('id', 1);
```

### Authentication

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

// Sign out
await supabase.auth.signOut();

// Get user
const { data: { user } } = await supabase.auth.getUser();
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own posts
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own posts
CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Learning Resources

- Documentation: https://supabase.com/docs
- Dashboard: https://supabase.com/dashboard

---

# PART 5: TAILWIND CSS

## What is Tailwind?

Tailwind is a utility-first CSS framework. Instead of writing CSS:

```css
.button {
  background-color: blue;
  padding: 8px 16px;
  border-radius: 4px;
}
```

You use utility classes:

```html
<button class="bg-blue-500 px-4 py-2 rounded">Click me</button>
```

## Core Concepts

### Utility Classes

| Category | Examples |
|----------|----------|
| Colors | `bg-red-500`, `text-blue-700` |
| Spacing | `p-4`, `m-2`, `px-8`, `my-4` |
| Sizing | `w-full`, `h-screen`, `max-w-lg` |
| Flexbox | `flex`, `justify-center`, `items-center` |
| Grid | `grid`, `grid-cols-3`, `gap-4` |
| Typography | `text-xl`, `font-bold`, `text-center` |
| Borders | `border`, `rounded-lg`, `border-gray-300` |

### Responsive Design

Use breakpoint prefixes:

```html
<div class="w-full md:w-1/2 lg:w-1/3">
  <!-- Full width on mobile, half on medium, third on large -->
</div>
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### State Modifiers

```html
<button class="bg-blue-500 hover:bg-blue-700 focus:ring-2">
  <!-- Different styles on hover and focus -->
</button>
```

Common modifiers:
- `hover:` - On hover
- `focus:` - On focus
- `active:` - On click
- `disabled:` - When disabled
- `dark:` - In dark mode

### Custom Configuration

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#00FF41',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
}
```

## Learning Resources

- Documentation: https://tailwindcss.com/docs
- Playground: https://play.tailwindcss.com

---

# PART 6: TYPESCRIPT

## What is TypeScript?

TypeScript is JavaScript with types. It catches errors before runtime.

## Basic Types

```typescript
// Primitives
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: string[] = ["John", "Jane"];

// Objects
let user: { name: string; age: number } = {
  name: "John",
  age: 30,
};
```

## Interfaces

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@example.com",
};
```

## Type vs Interface

```typescript
// Type - good for unions, primitives
type Status = "pending" | "approved" | "rejected";
type ID = string | number;

// Interface - good for objects, can be extended
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}
```

## Functions

```typescript
// Function with types
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}
```

## Generics

```typescript
// Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const num = first([1, 2, 3]); // number
const str = first(["a", "b"]); // string

// Generic interface
interface Response<T> {
  data: T;
  error: string | null;
}
```

## React with TypeScript

```typescript
// Component props
interface ButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ text, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

// useState with types
const [count, setCount] = useState<number>(0);
const [user, setUser] = useState<User | null>(null);
```

## Learning Resources

- Documentation: https://www.typescriptlang.org/docs
- Playground: https://www.typescriptlang.org/play

---

# PART 7: SHADCN/UI

## What is ShadCN?

ShadCN/ui is a collection of reusable components. Unlike component libraries, you own the code — components are copied into your project.

## Installing Components

```bash
# Initialize ShadCN
npx shadcn@latest init

# Add components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

Components go to `/components/ui/`.

## Using Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

## Customization

Since you own the code, edit components directly:

```tsx
// components/ui/button.tsx
// Modify variants, colors, sizes as needed
```

## Learning Resources

- Documentation: https://ui.shadcn.com
- Components: https://ui.shadcn.com/docs/components

---

# PART 8: FRAMER MOTION

## What is Framer Motion?

Framer Motion is a React animation library. It makes animations simple with declarative syntax.

## Basic Animation

```tsx
import { motion } from "framer-motion";

function Example() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Fades in
    </motion.div>
  );
}
```

## Common Patterns

### Fade Up on Load

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Fade Up on Scroll

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Animates when scrolled into view
</motion.div>
```

### Hover Animation

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

### Stagger Children

```tsx
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } },
  }}
>
  {items.map((item) => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

## Learning Resources

- Documentation: https://www.framer.com/motion

---

# PART 9: GIT BASICS

## What is Git?

Git is version control. It tracks changes to your code and lets you collaborate.

## Essential Commands

```bash
# Clone a repository
git clone https://github.com/user/repo.git

# Check status
git status

# Add files to staging
git add .                  # All files
git add filename.tsx       # Specific file

# Commit changes
git commit -m "feat: add login page"

# Push to remote
git push

# Pull latest changes
git pull

# Create branch
git checkout -b feat/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feat/new-feature
```

## Commit Message Convention

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructuring
- style: Formatting
- docs: Documentation
- test: Adding tests
- chore: Maintenance

Examples:
feat(auth): add login page
fix(dashboard): resolve loading issue
refactor(components): consolidate buttons
```

---

# PART 10: QUICK REFERENCE

## StepTen Tech Stack Summary

| Technology | Purpose | Learn First |
|------------|---------|-------------|
| Antigravity | IDE with AI agents | Download, try tutorials |
| Next.js 15 | React framework | Official tutorial |
| TypeScript | Type-safe JavaScript | Basic types, interfaces |
| Drizzle | Database ORM | Schema, queries |
| Supabase | Database + Auth | Dashboard, basic queries |
| Tailwind | CSS styling | Utility classes |
| ShadCN | UI components | Install, use |
| Framer Motion | Animations | Basic animations |

## File Locations

| What | Where |
|------|-------|
| Pages | `/app/(group)/page.tsx` |
| Components | `/components/` |
| Database schema | `/lib/db/schema.ts` |
| Supabase client | `/lib/supabase/` |
| Hooks | `/hooks/` |
| Types | `/types/` |
| Antigravity rules | `/.agent/rules/` |
| Antigravity workflows | `/.agent/workflows/` |

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run type-check       # Check TypeScript

# Database
npx drizzle-kit generate:pg  # Generate migration
npx drizzle-kit push:pg      # Push to database
npx drizzle-kit studio       # Open visual browser

# Components
npx shadcn@latest add [component]
```

---

## Learning Path

1. **Week 1:** Download Antigravity, complete official tutorial
2. **Week 2:** Next.js official learn course
3. **Week 3:** TypeScript basics
4. **Week 4:** Supabase + Drizzle database
5. **Ongoing:** Build StepTen features, learn as you go

---

## Notes & Updates

*Add your own notes here as you learn:*

```
[DATE] - What I learned
---
```
