# My 34k-Convo AI Memory Stack

All I want is for my agents to remember. That's it.

Since January 28, I've had 34,000 conversations across Clark Singh, Pinky, and REINA - my three AI agents running on OpenClaw with Anthropic. 34k conversations. And every new session? They forget everything. Start fresh. I have to re-explain who I am, what we're working on, what decisions we've made.

Yesterday Clark and I were researching how everyone else solves this. Letta has their Git-based "Context Repositories." Mem0 has their "Memory Compression Engine" - Y Combinator backed, claims 80% token savings. Everyone says they've solved the memory problem.

I don't think they have.

Here's my issue: I'm not a webdev. I don't want to code some complex retrieval system. I think about this from a business perspective - what's simple and what's logical. The reality is simple: I just want my agents to remember what I said.

It shouldn't be that hard.

---

## The Problem Nobody Talks About

OpenClaw stores everything locally. I've got 275MB of session JSONL files. Thousands of conversations, every exchange logged. But here's the thing - that data just sits there. Never gets read again.

The agent starts each session without context. Memory scattered across random files. Everything stored equally - important decisions buried with "hey how's it going" chitchat. No curation. No structure.

So we built our own system. Not some fancy embedding pipeline. Just logical organization of raw data.

---

## The Core Insight

Here's what we figured out: **The raw conversation data is the backbone.**

That's it. Those 34k conversations? That's the gold. Everything else - summaries, knowledge bases, embeddings - gets built FROM the raw conversations. But you always keep the raw data. That's your source of truth.

We're not trying to technically code some complex system. We're taking raw data and organizing it in a way that can actually be used. Finally we have all the conversations stored. From there we can summarize, rebuild knowledge, create embeddings - whatever we need. But the raw conversations remain as the foundation for everything else.

---

## The System

Here's what we came up with. Simple rules, clear structure.

### Rule 1: Root Folder is MDs Only

Nothing in the workspace root except markdown files. These are what OpenClaw loads on boot. Nothing else.

The core files:

| File | Purpose |
|------|---------|
| AGENTS.md | Boot file - reads first, every session |
| SOUL.md | Who the agent is, personality, values |
| IDENTITY.md | Agent-specific details |
| USER.md | Everything about me - the human |
| MODELS.md | Current AI models to use (auto-updated weekly) |
| TOOLS.md | Available tools and where credentials live |
| DECISIONS.md | Decision tree for common choices |
| STORAGE.md | Filing rules - where everything goes |
| HEARTBEAT.md | Periodic checks and pending items |
| MEMORY.md | Curated long-term memory |
| RESTRICTED.md | Private notes - never pushed to GitHub |

### Rule 2: Everything Else in Folders

```
memory/
  └── YYYY-MM-DD.md       ← Daily conversation logs

brain/
  └── [topic].md          ← Knowledge organized by topic

credentials/
  └── [service].json      ← API keys - local only, NEVER pushed

projects/
  └── [project-name]/
        README.md         ← What this project is
        context.md        ← Current state, where we left off

archive/                  ← Completed projects, old content

inbox/                    ← Temporary queue, 24hr max
```

### Rule 3: Three-Tier Memory

| Tier | What It Is | Where It Lives | How Long |
|------|------------|----------------|----------|
| **Hot** | Current session | Local only | Wiped at session end |
| **Warm** | Curated important stuff | GitHub .md files | Weeks to months |
| **Cold** | Full raw archive | Supabase | Permanent |

The Hot tier is just the current conversation. The Warm tier is what matters - curated decisions, facts, project state. The Cold tier is everything, forever, searchable when needed.

### Rule 4: Nightly Curation

This is what makes it work.

Every night at 11:30 PM, the agent reviews the day's conversations. Decides what's worth keeping long-term. Updates MEMORY.md. Discards the rest.

This is the difference between a filing cabinet and actual memory. A filing cabinet stores everything equally. Memory prioritizes what matters.

### Rule 5: Boot Sequence

Every session, same order, no skipping:

1. **Identity Layer** - SOUL.md, IDENTITY.md, USER.md
   → Agent knows who it is and who it's working for

2. **Operational Layer** - MODELS.md, TOOLS.md, DECISIONS.md
   → Agent knows what it can do and how to decide

3. **State Layer** - MEMORY.md, HEARTBEAT.md
   → Agent knows what's been happening and what's pending

4. **Ready**
   → Await instruction

---

## Multi-Agent Setup

I've got three agents across three machines. Each operates independently but syncs to the same places.

**GitHub structure:**
```
shared/
  MODELS.md          ← All agents read this
  DECISIONS.md       ← Shared decision framework
  knowledge/         ← Shared brain chunks

agents/
  clark/             ← Clark's files
  pinky/             ← Pinky's files  
  reina/             ← REINA's files
```

Each agent can see the others' folders. Clark can read what Pinky decided. REINA can pull Clark's strategy notes. No silos.

**Local + Shared:**

Each agent has its own local Postgres database with semantic embeddings. When I talk to Clark, he stores it locally in his .brain database with semantic relationships.

Then he can see what's on Supabase (the shared archive) and add anything that's not there. If I discuss marketing with Clark, he saves locally, pushes to Supabase, and now REINA can retrieve that marketing knowledge later.

Local brain for speed. Shared Supabase for cross-agent access.

---

## The Cron Jobs

Automation keeps it running:

| Time | Job |
|------|-----|
| 11:00 PM | Sync sessions to Supabase |
| 11:30 PM | Memory curation |
| 12:00 AM | Git push (MDs only, never credentials) |
| Sunday 9:00 PM | Update MODELS.md via Perplexity |

No manual maintenance. Set it and forget it.

---

## What Goes to GitHub, What Doesn't

**Push:**
- All core .md files
- brain/*.md
- projects/*/README.md and context.md

**Never push:**
- RESTRICTED.md
- credentials/
- memory/ daily logs
- Raw session data
- Anything with API keys

Git is for the curated stuff. The warm tier. Credentials stay local.

---

## Why This Works

Everyone's chasing fancy solutions. Embedding pipelines. Vector databases. Memory compression engines. RAG systems with retrieval thresholds.

We went simpler.

The raw conversations are the backbone. Everything else builds from that. Curate what matters into readable markdown files. Version it with Git. Archive the full history in Supabase.

Agents can read markdown. Humans can read markdown. Git shows you exactly what changed and when. No black boxes.

I think about this from a business perspective: What's simple? What's logical? What actually solves the problem without overengineering it?

My agents have 34,000 conversations of context. They boot in seconds with full awareness of who they are, what we're working on, and what decisions we've made. They can see each other's work. They curate their own memory every night.

All because we organized the raw data properly.

---

## Current Status

Testing this now. Just cleaned up Clark today. Adding the docs to all agents. The Supabase sync and embedding retrieval is next.

It's not perfect yet. But the foundation is solid: raw conversations as the backbone, curated markdown as working memory, clear rules for what goes where.

That's all I wanted. Agents that remember.
