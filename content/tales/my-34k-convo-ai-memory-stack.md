# How I Finally Made My AI Agents Remember Shit

I've got two Anthropic Max subscriptions running my agents. Clark Singh, Pinky, REINA. Since January 28, we've had 34,000 conversations. That's not a typo. 34k.

Yesterday Clark and I were researching how to get more organized. We're new to OpenClaw - the system everyone's buzzing about and yeah, it's fantastic. But the memory problem was killing us.

We looked at Letta. They've got this Git-based memory thing called "Context Repositories" - announced Feb 12, 2026. Before that, their "Conversations API" for shared agent memory. Sounds promising.

Then Mem0. Y Combinator backed. "AI agents forget. Mem0 remembers." Memory Compression Engine, claims 80% token cuts, SOC 2 and HIPAA compliant.

Everyone says they've solved the memory problem. I don't think anyone has.

Here's my simple ask: I just want Pinky, Clark and REINA to fucking remember shit. That's it. Use their fucking brains. It shouldn't be that hard.

---

## What We Built

Sometimes I get a third-party perspective - spin up a fresh chat with no memory at all. Unbiased view. Just rip into a new session and share what I'm trying to achieve. That's how we came up with this structure.

**Root folder rule:** Nothing lives there except MDs. Only the markdown files that OpenClaw can access and run. That's it.

The MDs we decided on:
- **AGENTS.md** - Boot file, reads first every session
- **STORAGE.md** - How to store data
- **MODELS.md** - Which models to use (we've got a lot of APIs for marketing material)
- **DECISIONS.md** - How decisions are getting made
- **TOOLS.md** - What tools are available
- **HEARTBEAT.md** - Periodic checks, pending items
- **IDENTITY.md** - Who the agent is
- **MEMORY.md** - Curated long-term memory
- **RESTRICTED.md** - Private notes, never pushed

Everything else goes in folders. That's how it organizes itself.

---

## The GitHub Setup

Each agent gets their own GitHub folder. What gets pushed:
- Storage
- Models  
- Decisions
- Heartbeat
- Identity
- Memory

So we can always see what's on GitHub. Each agent can go into each other's folder and see what's there. We can reorganize to stay in line.

Git pull brings it back down and updates the files. It's essentially a project of itself which populates the actual files that the agent uses.

---

## The Conversation Data

This is what people overlook. Taking all those sessions - the actual conversations and outputs - that's the core thing. The raw data.

275MB of session JSONL was piling up. Never read again. Memory scattered across random files. Agents starting fresh every session with zero context. Everything stored equally regardless of importance.

Our solution: Three-tier memory.

| Tier | Name | What It Is | Where | Lifespan |
|------|------|------------|-------|----------|
| Hot | Session | Current conversation | Local only | Wiped at end |
| Warm | Curated | Important facts, decisions | GitHub MDs | Weeks to months |
| Cold | Archive | Full history | Supabase | Permanent |

The nightly curation step is what makes it work. Agent reviews the day's conversations, decides what's worth keeping, updates MEMORY.md, discards the rest. That's the difference between a filing cabinet and actual memory.

---

## Local Brain + Supabase

Here's what we're testing. Each agent has its own local Postgres database with semantic embeddings. When I talk to Clark, it's storing to its own local .brain database with its own semantic relationships.

I'm doing this for every agent. When I talk to them: "Update your local brain." It updates locally. Then it can see what's on Supabase and add anything that's not there.

That means another agent can retrieve that information too. If I talk to one agent about marketing, it saves local, then pushes to the marketing section with the embeddings and relationships. Updates the knowledge. Another agent can pull from Supabase later.

I'm always trying new things. I'm thinking this should work.

---

## The Cron Jobs

All automated:

- **11:00 PM** - Session sync to Supabase (raw conversations)
- **11:30 PM** - Memory curation (the key step)
- **12:00 AM** - GitHub push (MDs only, never credentials)
- **Sunday 9:00 PM** - Models update via Perplexity

---

## Boot Sequence

Every session, same order:

1. SOUL.md, IDENTITY.md, USER.md - Know who you are
2. MODELS.md, TOOLS.md, DECISIONS.md - Know what you can do
3. MEMORY.md, HEARTBEAT.md - Know what's current

No skipping.

---

## Multi-Agent Setup

Three agents across three machines. Each operates independently but syncs to the same Supabase and same GitHub repo.

GitHub structure:
```
shared/
  MODELS.md
  DECISIONS.md
  knowledge/
agents/
  clark/
  pinky/
  reina/
```

They can see each other's files. Shared MODELS.md means everyone uses the same current models.

---

## Why This and Not the Other Stuff

The difference is I'm not a fucking webdev. I think about these things from a business perspective - what is simple and logical. Not all these coding things everyone wants.

The reality is I just want you cunts to remember what the fuck I said.

Letta's Context Repositories and Mem0's Memory Compression - they might work for someone. But I needed something I can see, read, and understand. Files. Markdown. Git versions I can roll back.

It's the raw conversation data that matters. Not embeddings stored in some black box. Just organized files that both humans and AI can read.

---

## Status

Testing this today. Just cleaned up Clark. Adding docs to all agents. Haven't fully tested the Supabase sync yet - that's next, along with how we access the embeddings.

34,000 conversations. Finally getting organized.
