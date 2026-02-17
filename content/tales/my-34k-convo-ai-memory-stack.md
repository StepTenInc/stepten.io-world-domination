# My 34k-Convo AI Memory Stack

Yesterday Clark and I sat down to figure out why the hell our AI agents can't remember anything. We've been running OpenClaw with Anthropic subscriptions, and between Clark, Pinky, and REINA, we've got 34,000 conversations logged since January 28. But every new session? Blank slate. I have to re-explain everything.

We researched Letta and Mem0 - everyone claims they've solved the memory problem. Bullshit. They're over-engineered solutions for a simple problem. I just want my agents to remember what I said last week.

So we built our own system. Simple file organization, cron jobs, and a clear structure. Here's exactly what we came up with.

---

## The Problem

OpenClaw stores everything locally but retrieves almost nothing intelligently. We had:
- 275MB of session JSONL that never gets read again
- Memory scattered across random files
- Agents starting fresh every session with zero context
- No way to see what the agent actually "knows"

The core issue: everything is stored equally, regardless of importance. No curation. Just a filing cabinet that keeps getting fuller.

---

## Our Solution: Three-Tier Memory

| Tier | Name | What It Is | Where It Lives | How Long |
|------|------|------------|----------------|----------|
| Hot | Session Memory | Current conversation | Local session only | Wiped at session end |
| Warm | Curated Memory | Important facts, decisions, project state | GitHub `.md` files | Weeks to months |
| Cold | Raw Archive | Full conversation history | Supabase | Permanent |

The key is the **nightly curation step**. Each night, the agent reviews the day's conversations, decides what's worth keeping, updates MEMORY.md, and discards the rest. This is the difference between a filing cabinet and actual memory.

---

## File Structure

Root folder has ONLY markdown files - nothing else:

```
AGENTS.md          ← Boot file - reads first every session
SOUL.md            ← Who the agent is / personality
IDENTITY.md        ← Agent details (Clark, Pinky, REINA)
USER.md            ← About me and my preferences
MODELS.md          ← Current AI models - auto-updated weekly
TOOLS.md           ← All tools + where credentials live
DECISIONS.md       ← Decision tree for tools, models, tasks
STORAGE.md         ← Filing rules - where everything goes
HEARTBEAT.md       ← Periodic checks + pending items
MEMORY.md          ← Curated long-term memory
RESTRICTED.md      ← Private notes - never pushed to GitHub
```

Everything else goes in folders:

```
memory/            ← Daily logs (YYYY-MM-DD.md)
brain/             ← Knowledge chunks by topic
credentials/       ← Local API keys - NEVER pushed
projects/          ← Each project gets README.md + context.md
archive/           ← Completed projects
inbox/             ← Temporary queue - 24hr max
```

**Rule:** Nothing lives in the workspace root except core `.md` files. credentials/ never leaves the local machine. inbox/ is a queue, not storage.

---

## The Boot Sequence

Every session, every time, in this order:

**Step 1 — Identity**
- Read SOUL.md
- Read IDENTITY.md  
- Read USER.md
- → Agent knows who it is and who it's working for

**Step 2 — Operational Rules**
- Read MODELS.md → Only use models listed here
- Read TOOLS.md → What tools are available
- Read DECISIONS.md → How to decide what to do

**Step 3 — Current State**
- Read MEMORY.md → What's been happening
- Read HEARTBEAT.md → What's pending

**Step 4 — Ready**
- Await instruction

No skipping. No shortcuts.

---

## Cron Jobs

All automated, no manual bullshit:

**11:00 PM Daily — Session Sync**
- Parse new session JSONL
- Push conversations to Supabase
- Update last sync timestamp

**11:30 PM Daily — Memory Curation**
- Review today's memory/YYYY-MM-DD.md
- What's worth keeping long-term?
- Update MEMORY.md
- Clear inbox/

**12:00 AM Daily — GitHub Push**
- Push all core .md files
- Push brain/*.md
- Push projects/*/README.md + context.md
- Never push credentials or raw sessions

**Sunday 9:00 PM — Models Update**
- Query Perplexity for latest models
- Update MODELS.md
- Push to GitHub

---

## What Gets Pushed to GitHub

✅ Push:
```
AGENTS.md, SOUL.md, IDENTITY.md, USER.md
MODELS.md, TOOLS.md, DECISIONS.md, STORAGE.md
HEARTBEAT.md, MEMORY.md
brain/*.md
projects/[name]/README.md
projects/[name]/context.md
```

❌ Never push:
```
RESTRICTED.md
credentials/
memory/
inbox/
Any file with API keys
```

---

## Supabase Cold Storage

| Table | Source | What It Contains |
|-------|--------|------------------|
| raw_conversations | sessions/*.jsonl | Full conversation history |
| raw_outputs | sessions/*.jsonl | Agent outputs extracted |
| credentials | Manual entry | Shared API keys |
| cron_runs | Cron logs | What ran, when, result |

Sync is append-only. Nothing gets deleted.

---

## Multi-Agent Setup

Three agents across three machines (Mac Mini 1, Mac Mini 2, MacBook). Each operates independently but syncs to:
- Same Supabase project
- Same GitHub repository

GitHub folder structure:
```
agent-army/
  shared/
    MODELS.md          ← All agents read this
    DECISIONS.md       ← Shared decision framework
    knowledge/         ← Shared brain/ chunks
  agents/
    clark-mini1/       ← Mac Mini 1 agent
    clark-mini2/       ← Mac Mini 2 agent
    clark-macbook/     ← MacBook agent
```

Each agent can see the others' files. Shared MODELS.md means everyone uses the same, current models.

---

## The Rules

These apply every session, no exceptions:

**Models:**
- Only use models listed in MODELS.md
- Never use a model from training memory
- If MODELS.md is older than 7 days, flag it

**Filing:**
- Nothing in workspace root except core MDs
- Every project gets its own folder
- inbox/ clears within 24hrs
- credentials/ never leaves local machine

**GitHub:**
- Only push MDs and brain/ files
- Never push credentials
- Commit every night at midnight

**Memory:**
- Curate nightly
- Daily logs stay local
- Only curated summary goes to GitHub

---

## Why This Works

The insight we discovered: it's the raw conversation data that matters. Not embeddings. Not vector databases. Just organized files that both humans and AI can read.

I'm not a webdev. I think business logic - what's simple and what's logical. This is what that looks like.

34,000 conversations since January 28. The agents finally remember what I said.
