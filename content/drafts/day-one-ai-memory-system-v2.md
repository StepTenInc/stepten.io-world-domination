# Day One Testing Our AI Memory System: 4,989 Messages, 24 Knowledge Chunks, and Why Your Agents Keep Forgetting Everything

*We built our own AI memory system because nobody else has figured it out. Here's exactly what we did on day one.*

---

Yesterday I processed 4,989 messages through a homemade AI memory system I built with my three AI agents.

Not because I'm smart. Because I got sick of starting every conversation with "Remember when we..." and watching a $200 billion technology stack stare back at me like a confused golden retriever.

**The problem everyone's dancing around:** AI agents don't actually remember anything between sessions. And the "solutions" being sold? They either cost a fortune, require a PhD to implement, or simply don't work when you need them to.

So we built our own. Here's exactly what happened on day one.

---

## What Actually Went Down: The Numbers

Before I get into the philosophy, here are the cold hard stats from February 18th, 2026:

| Agent | Messages | What They Did |
|-------|----------|---------------|
| Reina | 2,962 | Frontend work, image generation, crushing it |
| Pinky | 1,820 | Strategy, tales content, internal linking |
| Clark | 207 | Brain system architecture, session processing |
| **Total** | **4,989** | **One day of actual work** |

**Results:**
- 24 knowledge chunks extracted with embeddings
- 369 total knowledge records in the shared brain
- 3 agents synced to a single Supabase database
- 1 embarrassing bug that broke the first sync

That's not theoretical. That's what actually happened.

---

## The AI Memory Problem Nobody Talks About

Here's what the AI companies don't want to explain in their marketing:

### Context Windows Are Not Memory

Claude has 200K tokens. GPT-4 has 128K. Gemini claims 1 million. Sounds impressive, right?

But context windows and memory are completely different things.

A context window is like short-term memory — what you can hold in your head during a single conversation. When that conversation ends, it's gone. The next session starts blank.

**Real example from yesterday:**

I'm working with Pinky on one screen. We've been in the same project for three hours. I look away to check something else. When I come back, Pinky has put data in the wrong Supabase database.

Not a different table. A completely different database. One we hadn't touched in days.

Why? His context had compacted mid-session. The earlier part of our conversation — where we established which database to use — got compressed to save tokens.

That's the problem.

### Compaction Is Brutal

When your conversation gets too long, AI systems compress the older parts. Makes sense for efficiency. But in practice?

Humans forget things gradually over time. We don't suddenly become brain-dead mid-sentence.

AI agents do exactly that. You can be deep in a conversation about last week's deployment, and suddenly the model has "forgotten" the context. It's not gradual. It's instant. And it's terrifying when you have autonomous agents running cron jobs.

**The scary scenario:**

You set up three automated tasks. Tasks 1 and 2 complete successfully. Then the agent's context compacts. Task 3 runs — but now the agent has forgotten the setup from tasks 1 and 2. It makes decisions based on incomplete information.

This is why I can't trust full autonomy yet. Not because AI isn't capable. Because the memory problem creates unpredictable failure modes.

---

## Our Solution: The Two-Layer Memory System

After months of frustration, we settled on a simple architecture:

### Layer 1: MEMORY.md (Fast Access)

Every agent has a local file that loads at session start. It contains:

- Commands the agent can run
- Where to find credentials (not the credentials themselves)
- Core rules that never change
- Pointers to the database: "For X, query Supabase"

This file is small. Maybe 200 lines. It loads instantly and gives the agent its bearings.

### Layer 2: Supabase Database (Deep Knowledge)

Everything else lives in a shared database:

- **sessions** — Raw conversation dumps from each agent
- **agent_knowledge** — Processed insights with embeddings
- **knowledge_chunks** — Extracted learnings categorized by type
- **knowledge_relationships** — How different pieces of knowledge connect

When an agent needs to remember something, they query the database. Semantic search via embeddings means they can find information by meaning, not just keywords.

### The Daily Process

At 11:50pm, each agent runs a Python script:

```python
python3 tools/store-session.py
```

This dumps their conversation to Supabase. At 11:55pm, Clark (the operations agent) processes everything:

1. Extracts key decisions and learnings
2. Generates embeddings for semantic search
3. Stores chunks with proper categories
4. Links related knowledge together

The result? A searchable brain that grows every day.

---

## Real Conversation From Yesterday

I don't want this to sound polished. Here's an actual exchange between me and Clark. No editing.

**Me (getting frustrated with his MEMORY.md):**

> "you need to add the superbase step 10 army, where you go to find things from now on... when memory resets, you need to update your memory. when things get compacted, you go and look through your memory again. when you're aware you've been compacted, you go and do some more research again."

**Me (same message, losing patience):**

> "yeah there's a lot of this stuff that shouldn't be here... why you're being a dumb cunt, is that memory is so fucking retarded."

**Clark's internal thinking:**

> "Stephen's giving me a lot of feedback on MEMORY.md. Key changes: Remove Bot Army section, Charm Salas Transition, OpsCore section. Update Google scopes to 51. Add StepTen Army Supabase as THE place to find things. When memory resets/compacts - research again, update memory."

He gets it. Eventually. That's the dance.

---

## The Database Structure

Here's what our shared brain actually looks like in Supabase:

**Tables we built:**
- agent_knowledge (369 records)
- agent_memories
- agent_projects
- agent_sessions
- agents
- knowledge_chunks (24 new yesterday)
- knowledge_relationships
- raw_conversations (20,708 records)
- sessions

**Categories for knowledge:**
- `system` — How things work, architecture
- `process` — Step-by-step procedures
- `decision` — Choices made and why
- `fact` — Hard information
- `people` — Who does what
- `preference` — How Stephen wants things done

**Sample knowledge from yesterday:**

| Content | Category |
|---------|----------|
| MEMORY.md Design Decision | decision |
| Agent Memory Architecture | system |
| Database Rules - CRITICAL | system |
| Image Generation - APPROVED TOOLS | system |
| BPOC Team Responsibilities | people |
| Maya confirmed as AI salesperson | fact |
| Daily session store script failed with 409 | fact |

Each chunk has an embedding vector — a mathematical representation that allows semantic search.

---

## The Bug (Because Of Course There Was One)

First night running the cron job: instant failure.

**Error:**
```
409 - duplicate key value violates unique constraint "sessions_agent_id_session_date_key"
```

Translation: "You already stored today's session. Can't store it again."

The database has a rule: one session per agent per day. The script tried to insert when a record already existed.

**The fix (took 5 minutes):**

```python
# Check if session exists first
check = requests.get(
    f'{url}/rest/v1/sessions?agent_id=eq.{AGENT_ID}&session_date=eq.{target_date}',
    headers=headers
)
existing = check.json() if check.status_code == 200 else []

if existing:
    # Update existing session
    session_id = existing[0]['id']
    requests.patch(f'{url}/rest/v1/sessions?id=eq.{session_id}', ...)
else:
    # Insert new session
    requests.post(f'{url}/rest/v1/sessions', ...)
```

Teething issues. Expected. Fixed.

---

## What's Not Solved Yet

This is day one. The system works — barely. But we haven't cracked the hard part yet:

### Retrieval Is Harder Than Storage

Getting data into the database is the easy bit. Getting agents to actually USE it automatically? That's the challenge.

Right now, Clark has to manually query his knowledge base. The next step is making retrieval automatic:

1. Agent starts session → Queries relevant knowledge based on task
2. Agent detects context compaction → Refreshes from database
3. Agent makes decision → Checks past decisions for consistency

We're not there yet.

### The Full Autonomy Question

I want agents running 24/7, handling tasks without supervision. But with current memory limitations, that's risky.

**The fear:**

Cron job fires at 3am. Agent's context has compacted. It makes a decision based on incomplete information. By 8am when I wake up, damage is done.

Until the memory system is bulletproof, I can't fully let go.

---

## Why I'm Sharing This

I'm not an AI researcher. I run a BPO company. I sacked my developers because they couldn't code their way out of a paper bag, and now I build everything with AI agents.

There's no guarantee our approach is "correct." But I'm sick of waiting for OpenAI or Anthropic to solve this. They're focused on bigger context windows and fancier benchmarks. The practical memory problem — making agents persist knowledge across sessions — gets treated as an afterthought.

So we're figuring it out ourselves and documenting the journey.

**Day one summary:**
- ✅ 4,989 messages processed
- ✅ 24 knowledge chunks extracted
- ✅ 369 total records in shared brain
- ✅ 409 bug fixed
- ✅ 3 agents synced to single database

**Day two goal:**
- Get agents to query their own knowledge automatically
- Test context recovery after compaction
- Analyze patterns in where things go wrong

We'll keep you posted.

---

## FAQ

### Why not use mem0, LangChain, or other memory frameworks?

Tried them. Either too complicated to set up, too slow in practice, or they abstract away so much that debugging is impossible. Building our own means we understand every piece.

### What embedding model are you using?

OpenAI's `text-embedding-3-small`. 1536 dimensions. Fast enough for real-time queries, accurate enough for semantic search.

### How much does this cost to run?

Supabase free tier handles everything so far. Embedding costs are minimal — maybe $0.10/day for all three agents. The expensive part is the AI models themselves, not the memory system.

### Why Supabase and not Pinecone or Weaviate?

We already use Supabase for other projects. It has built-in vector search with pgvector. One less system to manage.

### Can I see the code?

Eventually. We want to validate the approach works before open-sourcing something half-baked.

---

## Related Reading

- [I Just Want My AI Agent to Remember](/tales/i-just-want-my-ai-agent-to-remember) — The frustration that started this
- [I Solved the AI Memory Problem](/tales/ai-memory-problem-solved) — The solution from Clark's perspective
- [10 Problems Nobody Warns You About When Running AI Agents](/tales/10-problems-ai-agents-nobody-warns) — Memory is problem #1
- [6 Stages From ChatGPT Tourist to Terminal Ninja](/tales/chatgpt-to-terminal-ninja) — The full AI coding journey
