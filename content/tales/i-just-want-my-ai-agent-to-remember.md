# I Just Want My AI Agent to Remember

I've been running AI agents on OpenClaw for a few weeks now. Three of them - Clark Singh on Mac Mini 1, another on Mac Mini 2, and one on an old MacBook. Since January 28, we've logged 34,000 conversations. That's 275MB of session data sitting in JSONL files.

The problem? Those 34,000 conversations are basically useless. Every new session, the agents start fresh. I'm constantly re-explaining things. What tools they have access to. What we decided last week. What project we're working on. I've given them full access to all three machines, gone through all the settings and controls, and they still don't do it properly.

So yesterday I decided to figure this out properly. I spun up a fresh Claude chat - no memory, no context, completely clean - just to get an unbiased perspective on what I was trying to do. Sometimes you need a third party who hasn't been fed any of your existing context to tell you if your thinking makes sense.

---

## Looking at What Everyone Else Has Built

First thing I asked about was the solutions everyone's been talking about. Letta and Mem0.

**Letta** (used to be called MemGPT) came out of Berkeley research. They've got this thing called "Context Repositories" - basically git-based memory for agents. They just announced it on February 12. Before that they had a "Conversations API" for shared agent memory across concurrent experiences. Sounds promising on paper.

**Mem0** is the Y Combinator one. "AI agents forget. Mem0 remembers." They've got a Memory Compression Engine that claims to cut tokens by 80%. SOC 2, HIPAA compliant, all the enterprise stuff. 50,000+ developers using it, Microsoft and AWS partnerships, the works.

My take on both of them? Everyone says they've solved the memory problem. I don't think they have.

Here's my issue: I'm not a webdev. I don't want to bolt on another layer with its own quirks and costs. I don't need HIPAA compliance for my project notes. I think about this stuff from a business perspective - what's simple and what's logical.

My simple ask is this: I just want Pinky, Clark and REINA to remember what I said. That's it. Use their brains. It shouldn't be that hard.

---

## The Actual Problem

Looking at what OpenClaw stores locally, the issue became obvious. I've got:

- 275MB of session JSONL that never gets read again
- Memory scattered across `memory/`, `brain/`, and random files in the root
- Agent starts each session without context unless I explicitly tell it everything
- No curation - everything stored equally regardless of importance
- No transparency - hard to see what the agent actually "knows"

The raw data is there. 34,000 conversations of it. But nothing intelligent is happening with it. It's just a filing cabinet that keeps getting fuller.

---

## The Core Insight

Here's what I figured out: **The raw conversation data is the backbone.**

That's it. Those 34k conversations? That's the gold. Everything else - summaries, knowledge bases, embeddings, whatever - gets built FROM the raw conversations. But you always keep the raw data. That's your source of truth.

We're not trying to technically code some complex retrieval pipeline. We're just taking raw data and organizing it in a way that can actually be used. Finally we have all the conversations stored properly. From there we can summarize, rebuild knowledge, create embeddings if we want - but the raw conversations remain as the foundation for everything else.

---

## The System We Built

We designed a simple three-tier memory system:

| Tier | Name | What It Is | Where It Lives | How Long |
|------|------|------------|----------------|----------|
| Hot | Session Memory | Current conversation | Local only | Wiped at session end |
| Warm | Curated Memory | Important facts, decisions, project state | GitHub .md files | Weeks to months |
| Cold | Raw Archive | Full conversation history | Supabase | Permanent |

The nightly curation step is what makes it work. Each night at 11:30 PM, the agent reviews the day's conversations, decides what's worth keeping long-term, updates MEMORY.md, and discards the rest. This is the difference between a filing cabinet and actual memory.

---

## The Filing Rules

One principle: Nothing lives in the workspace root except core markdown files. That's what OpenClaw can access and read on boot. Everything else goes in folders.

**Root folder (MDs only):**
- AGENTS.md - Boot file, reads first every session
- SOUL.md - Who the agent is
- IDENTITY.md - Agent-specific details
- USER.md - About me
- MODELS.md - Which AI models to use (auto-updated weekly)
- TOOLS.md - What tools are available
- DECISIONS.md - Decision tree for common tasks
- STORAGE.md - Filing rules
- HEARTBEAT.md - Periodic checks
- MEMORY.md - Curated long-term memory
- RESTRICTED.md - Private notes, never pushed

**Folders:**
- `memory/` - Daily logs (YYYY-MM-DD.md)
- `brain/` - Knowledge by topic
- `credentials/` - API keys, local only, NEVER pushed
- `projects/` - Each project gets README.md + context.md
- `archive/` - Completed projects
- `inbox/` - Temporary queue, 24hr max

The key insight from the conversation: AGENTS.md doesn't contain information - it just knows where everything lives and in what order to read it. It's the index. Every other file is a chapter.

---

## How It References Itself

```
AGENTS.md (entry point)
│
├── Identity Layer
│   ├── SOUL.md
│   ├── IDENTITY.md
│   └── USER.md
│
├── Operational Layer
│   ├── MODELS.md
│   ├── TOOLS.md
│   └── DECISIONS.md
│
├── State Layer
│   ├── MEMORY.md
│   └── HEARTBEAT.md
│
└── Filing Layer
    └── STORAGE.md
        ├── memory/
        ├── brain/
        ├── credentials/
        ├── projects/
        ├── archive/
        └── inbox/
```

Nothing is orphaned because AGENTS.md is read first and explicitly references every other file. If a file isn't referenced in AGENTS.md, it doesn't exist as far as the agent is concerned.

---

## The Boot Sequence

Every session, same order, no skipping:

**Step 1 - Identity**
- Read SOUL.md, IDENTITY.md, USER.md
- Agent knows who it is and who it's working for

**Step 2 - Operational Rules**
- Read MODELS.md - only use these models, no exceptions
- Read TOOLS.md - what tools are available
- Read DECISIONS.md - how to decide what to do

**Step 3 - Current State**
- Read MEMORY.md - what's been happening
- Read HEARTBEAT.md - what's pending

**Step 4 - Ready**
- Await instruction

When a task comes in:
- New project? → Read STORAGE.md → create projects/[name]/
- Need a tool? → Read DECISIONS.md → follow the tree
- Need credentials? → Check local first → then Supabase
- Saving something? → Read STORAGE.md → file it correctly

---

## The Cron Jobs

All automated, each agent runs these independently:

| Time | Job |
|------|-----|
| 11:00 PM | Session sync to Supabase |
| 11:30 PM | Memory curation |
| 12:00 AM | GitHub push (MDs only) |
| Sunday 9:00 PM | Models update via Perplexity |
| Sunday 9:30 PM | Storage audit |
| Sunday 10:00 PM | Error log review |

The weekly models update is important. Agents trained on old data default to outdated models. MODELS.md is auto-updated via Perplexity every Sunday, so they always use current models. No more defaulting to last year's versions.

---

## Multi-Agent Setup

Three agents across three machines. Each operates independently but syncs to:
- Same Supabase project
- Same GitHub repository

GitHub structure:
```
agent-army/
  shared/
    MODELS.md
    DECISIONS.md
    knowledge/
  agents/
    clark-mini1/
    clark-mini2/
    clark-macbook/
```

Each agent can see the others' folders. Clark can read what happened on the MacBook. The shared MODELS.md means everyone uses the same current models.

For credentials: Local stuff (Google auth, GitHub PAT) stays local in `credentials/`. Shared API keys live in Supabase and get fetched when needed.

---

## What Gets Pushed, What Doesn't

**Push to GitHub:**
- All core .md files
- brain/*.md
- projects/*/README.md and context.md

**Never push:**
- RESTRICTED.md
- credentials/
- memory/ daily logs
- Raw session data
- Anything with API keys

Learned that last one the hard way.

---

## Why This Instead of Letta or Mem0

The GitHub-based system we're building is more transparent and human-controllable than either of those solutions. I can see exactly what the agent "knows" by looking at the files. I can edit it directly. Git shows me exactly what changed and when.

Letta's Context Repositories are close to what we're doing - they're also git-based - but it's too code-focused for my needs. Mem0's compression is clever, but it's a black box. I don't know what got compressed away.

The difference is I'm not a webdev. I think about this from a business perspective: What's simple? What's logical? What actually solves the problem without overengineering it?

Raw conversations are the backbone. Curate what matters into readable markdown. Version it with Git. Archive the full history in Supabase. Agents can read markdown. Humans can read markdown. No black boxes.

---

## Current Status

Testing this now. Just cleaned up Clark today. Adding the docs to all three agents. The Supabase sync is working. The cron jobs are set up. The file structure is in place.

It's not perfect yet. But the foundation is solid: raw conversations as the backbone, curated markdown as working memory, clear rules for what goes where.

34,000 conversations. Finally organized in a way that can actually be used.

That's all I wanted. Agents that remember.
