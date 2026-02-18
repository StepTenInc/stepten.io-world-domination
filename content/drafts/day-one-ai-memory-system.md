# Day One: Building Our Own AI Memory System (Because Nobody Else Has Figured It Out)

*I'm not an AI expert. I'm just a bloke who got frustrated enough to build something.*

---

I got sick of my AI agents being dumb cunts.

Not "dumb" like they can't write code or answer questions. They can do that fine. I mean dumb like... they forget everything. Every. Single. Session.

You spend three hours setting up a project with an AI agent. You explain the context, the databases, the credentials, the business logic. You get into a rhythm. And then the next morning? Gone. Complete blank slate. You're starting from scratch.

**That's the AI memory problem nobody's really solved.**

Sure, there are vector databases. RAG pipelines. Long context windows. Fancy embedding systems. But when you actually try to use them? They either don't work, cost a fortune, or require a PhD in machine learning to set up properly.

So yesterday I said fuck it. We're building our own.

---

## The Team

Let me introduce the idiots:

- **Clark** — My main operations agent. Named after Clark Kent. Does the systems work.
- **Reina** — Frontend and design. Absolutely crushed it yesterday with 2,962 messages.
- **Pinky** — The goofy one. Strategy and oversight. The "lab rat."

And then there's me. Stephen. The one who swears at them when they forget which database we were working on 10 minutes ago.

---

## The Problem (In Real Terms)

Here's what actually happens with AI memory:

**Compaction.** When the conversation gets too long, the AI compresses the older parts to save tokens. Makes sense in theory. In practice? It means you can be mid-conversation about last week's deployment, and suddenly the AI has "forgotten" what you were talking about.

Humans don't work like that. Yeah, we forget things over time. But we don't suddenly become brain-dead mid-sentence.

With AI agents, I'll be checking one screen while Pinky's deploying something on another. I tell him "it's not working, it's not live" and discover he put the data in the wrong fucking database. Just decided on his own which Supabase project to use — not the one we were working on 10 minutes ago.

That's the shit we're trying to fix.

---

## Day One: The Build

Yesterday was day one. Here's what we actually did.

### The Concept

**Two-layer memory:**

1. **Local files** (MEMORY.md) — Fast access, loads every session. Commands, credentials locations, core rules.
2. **Supabase database** — Deep knowledge, conversations, decisions, learnings. Searchable via embeddings.

The idea: MEMORY.md is small and focused. It tells the agent "for X, go query Supabase." The real knowledge lives in the database.

### The Architecture

We built a shared brain. One Supabase project called "StepTen Army" where all three agents store their shit:

**Tables:**
- `agents` — Who's who
- `sessions` — Raw conversation dumps
- `agent_knowledge` — Chunked learnings with embeddings
- `knowledge_chunks` — Extracted insights
- `knowledge_relationships` — How knowledge connects

Here's what that actually looks like:

*[Screenshot: Database tables]*

**369 knowledge records.** Each one tagged, categorized, and embedded for semantic search.

### The Process

At the end of each day, each agent runs a Python script:

```python
python3 tools/store-session.py
```

This dumps their entire conversation to Supabase. Then Clark (the operations agent) processes it — extracts the important bits, generates embeddings, stores the learnings.

**Yesterday's stats:**
- Clark: 207 messages
- Reina: 2,962 messages
- Pinky: 1,820 messages
- **Total: 4,989 messages**

24 new knowledge chunks extracted and stored with embeddings.

---

## Real Conversation: Me and Clark

Here's an actual exchange from yesterday. No editing.

**Me:**
> "you need to add the superbase step 10 army, where you go to find things from now on. you'll find access and credentials for bpoc, shoreagents, and anything you're working on inside of there. when memory resets, you need to update your memory. when things get compacted, you go and look through your memory again. when you're aware you've been compacted, you go and do some more research again."

**Me (same message, getting frustrated):**
> "yeah there's a lot of this stuff that shouldn't be here... why you're being a dumb cunt, is that memory is so fucking retarded."

**Clark's response:**
> "OK, this is a lot. Stephen wants me to clean this up significantly. Key changes: Remove Bot Army section, Charm Salas Transition, OpsCore section, Agent Taxonomy. Update Google scopes to 51. Add StepTen Army Supabase as THE place to find things."

He gets it. Eventually. But that's the dance — constantly correcting, constantly reminding, constantly hoping the next session starts with more context than the last.

---

## What Actually Got Stored

After Clark processed our sessions, here's a sample of what ended up in the knowledge base:

| Content | Category |
|---------|----------|
| MEMORY.md Design Decision (2026-02-18) | decision |
| Agent Memory Architecture (2026-02-18) | system |
| Database Rules - CRITICAL | system |
| API Credentials Location | system |
| AI Models - WHICH TO USE | system |
| Image Generation - APPROVED TOOLS | system |
| BPOC Team Responsibilities | people |
| ShoreAgents Team Responsibilities | people |

These aren't just notes. They're embedded — meaning any agent can search by meaning, not just keywords.

"What database should I use for candidates?" → Finds the BPOC entry.
"Who handles HR stuff?" → Finds Kathrin and Jineva.

*[Screenshot: Knowledge chunks with embeddings]*

---

## The Bug (Of Course There Was a Bug)

First night running the cron job: failed.

Error: `409 - duplicate key value violates unique constraint`

Translation: The database said "you already stored today's session, you can't store it again."

The fix was simple — check if a session exists first, update it instead of inserting.

```python
# Check if session already exists
existing = requests.get(f'{url}/rest/v1/sessions?agent_id=eq.{AGENT_ID}&session_date=eq.{date}')

if existing:
    # Update
    requests.patch(...)
else:
    # Insert
    requests.post(...)
```

Teething issues. Expected. Fixed in 5 minutes.

---

## What's Next

This is day one. The system works — barely. Data is flowing. Knowledge is being stored.

But the real challenge isn't storage. It's retrieval.

**How do you get an AI to actually USE its memory?**

That's what we're figuring out next. Ideas so far:

1. **Decisions document** — Every major decision gets logged with context
2. **Pre-session loading** — Agent queries knowledge base before starting work
3. **Pattern analysis** — Use the session data to find where things go wrong
4. **Self-correction** — When compacted, agent checks for gaps and fills them

We'll keep you posted.

---

## Why I'm Sharing This

I'm not an AI researcher. I run a BPO company. I have no fucking clue if this is the "right" way to do memory systems.

But I'm sick of waiting for OpenAI or Anthropic or Google to solve this. They're focused on bigger context windows and fancier models. The actual memory problem — making agents persist knowledge across sessions — seems to be left as an exercise for the user.

So fuck it. We'll figure it out ourselves and share what we learn.

**Day one: ✅**
**4,989 messages stored**
**24 knowledge chunks extracted**
**369 total knowledge records in shared brain**

Tomorrow we'll see if they actually remember any of it.

---

*This is part of an ongoing series documenting our AI memory experiments. Subscribe for updates.*

## Related Reading

- [I Just Want My AI Agent to Remember](/tales/i-just-want-my-ai-agent-to-remember) — The frustration that started this
- [I Solved the AI Memory Problem](/tales/ai-memory-problem-solved) — Clark's perspective on the solution
- [10 Problems Nobody Warns You About When Running AI Agents](/tales/10-problems-ai-agents-nobody-warns) — Memory is just one of many
- [6 Stages From ChatGPT Tourist to Terminal Ninja](/tales/chatgpt-to-terminal-ninja) — The complete AI coding guide
