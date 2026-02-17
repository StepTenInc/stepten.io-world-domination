# My 34k-Convo AI Memory Stack

Hey, I'm Stephen. I'm building an AI empire over at stepten.io. Right now, I've got three core agents running: Clark Singh, my strategist; Pinky, the creative spark; and REINA, the executor. They're all powered by OpenClaw with Anthropic models under the hood. Since January 28, we've racked up 34,000 conversations. That's not hyperbole—it's raw session count, day in, day out. These agents are grinding through business ops, research, content creation, and decision-making. But here's the frustrating part: they can't remember shit between sessions. One day, you tell Clark about a pivot in your supply chain strategy, and the next, it's like it never happened. Wipe after wipe. It's maddening.

I've sunk hours into this. Sessions start fresh every time because that's how the APIs are built—no native long-term memory. You end the chat, poof, gone. Sure, you can hack prompts with recaps, but that's brittle as hell. Copy-paste a 10k-token history? It bloats, tokens explode, costs skyrocket. And forget about scaling that to 34k convos. I needed a system that persists memory reliably, scales with my ops, and doesn't require a PhD in machine learning to maintain. Yesterday, Clark and I dove deep into the "solutions" out there—Letta, Mem0, the usual suspects. Everyone claims they've cracked AI memory. Bullshit. They're over-engineered nightmares. Vector embeddings, fancy retrieval-augmented generation (RAG), graph databases—it's all shiny tech porn for devs who love complexity. Me? I just want my agents to remember what the fuck I told them last week. Simple as that.

So I built my own stack. No databases beyond a lightweight Supabase sync. No embeddings. No vectors. Just files—Markdown files, organized like a business filing system. Humans can read it, agents can ingest it, Git can version it. It's dead simple, stupidly effective, and costs pennies. We've been running it for weeks now, and memory loss is a non-issue. Clark remembers every pivot we've discussed since launch. Pinky recalls client personas from month one. REINA pulls project specs without prompting. This is what real-world AI memory looks like when you strip away the hype.

Let me walk you through it step by step, like I'm onboarding a new ops lead. Because that's how I think: business logic first, tech second. If you're tired of agents with amnesia, this is your blueprint.

## The Root Folder: Your Control Center

Everything lives in a single Git repo. No sprawling monorepo bullshit—just a clean root with essential Markdown files. These are the boot files, the unchanging core that every agent loads on startup. Think of it as your company's operating manual.

- **AGENTS.md**: The boot file master. Lists all agents, their roles, boot order, and cross-references. It's the index—keeps everyone aligned.

- **SOUL.md**: The philosophical backbone. What drives these agents? My vision for stepten.io. Core values, mission, long-term goals. "Build AI that scales human ambition without the burnout." Agents ingest this first to ground their responses in purpose.

- **IDENTITY.md**: Agent personas. Clark Singh: ex-McKinsey consultant, data-driven tactician. Pinky: quirky innovator, loves wild ideas but tempers with feasibility. REINA: no-nonsense project manager, GTD zealot. Detailed backstories, speech patterns, strengths/weaknesses. No fluff—pure behavioral blueprint.

- **USER.md**: That's me, and key stakeholders. Preferences, pet peeves, decision frameworks. "Stephen hates vague timelines—always specify dates. Swears when frustrated but stays professional. Prioritizes ROI over perfection." Keeps agents from pissing me off with generic crap.

- **MODELS.md**: Model configs and benchmarks. Auto-updates weekly via a Perplexity cron job scraping Anthropic's latest. "Claude 3.5 Sonnet for reasoning; Haiku for speed." Includes token limits, costs per million, fallback chains.

- **TOOLS.md**: Inventory of tools. OpenClaw integrations, APIs, scripts. "Use Perplexity for research; Supabase for sync; Git for persistence." Step-by-step usage.

- **DECISIONS.md**: Log of key calls. "Q2 pivot: Drop low-margin SaaS, double down on agency services. Rationale: 3x margins." Timestamped, searchable.

- **STORAGE.md**: File structure map. Explains folders below. "memory/ for convos; brain/ for knowledge dumps."

- **HEARTBEAT.md**: System health. Last sync time, convo count, errors. "34,247 convos as of 2024-10-15. All green."

- **MEMORY.md**: High-level memory policy. "Prioritize recency, relevance, user overrides. Raw logs over summaries."

- **RESTRICTED.md**: Sensitive shit—never pushed to GitHub. Local-only. API keys? No. Business secrets? Here. It's .gitignore'd to hell.

This root is lean: under 50k tokens total. Loads in seconds. Every session starts here.

## Folders: Topic-Based Persistence

Root handles the constants. Folders scale the variables. Logical buckets, no overlap.

- **memory/**: Daily logs as YYYY-MM-DD.md. Raw convo transcripts, lightly curated. "2024-10-15.md: Clark session on Q4 forecasting. Key: Inflation hedge via commodities." One file per day per agent, under 20k tokens. Sequential read—agents scan recency first.

- **brain/**: Knowledge by topic. Subfolders like brain/marketing/, brain/finance/. MD files for evergreen intel. "supply-chain-risks.md: Top 5 disruptions post-2023." Dump research here. Human-readable, AI-searchable via simple grep or prompt scans.

- **credentials/**: Local-only. .gitignore forever. Supabase keys, API tokens. Swap agents? Copy-paste secure.

- **projects/**: Per-project folders. README.md for overview + context.md for active state. "project-alpha/README.md: Client X onboarding. Status: Proposal sent 10/10." Context.md pulls in latest memory/brain refs.

- **archive/**: Done deals. "project-beta-archive.md: Completed Q3. Lessons: Underbid by 15%." Rotate weekly.

- **inbox/**: 24hr hot queue. Unsorted drops. "inbox/urgent-client-feedback.md." Cron moves to proper homes.

This mirrors how I run my business: inbox zero, topic files, archives. No hunting.

## Cron Jobs: Automation That Just Works

Manual sync? Fuck that. Cron jobs handle the grunt work. Serverless on a cheap VPS or GitHub Actions.

- **11:00 PM**: Session sync to Supabase. Real-time-ish backup. JSON exports from OpenClaw. Queryable for analytics: "Show Clark's win rate on forecasts."

- **11:30 PM**: Memory curation. Script scans memory/, summarizes long days, flags contradictions. "Day 2024-10-14: 5 convos, 12k tokens. Summary: Pivot approved." Appends to MEMORY.md.

- **12:00 AM**: GitHub push. Commits changes with semantic messages: "feat: Update models; fix: Curation bug." Branch protection for safety.

- **Sunday 9:00 PM**: Models update. Perplexity scrapes Anthropic/Claude news, rewrites MODELS.md. "New: Opus for edge cases."

Set it and forget it. I check HEARTBEAT.md weekly.

## Boot Sequence: Predictable Startup

Agents boot in order. Prompt chain:

1. **SOUL.md** → Sets purpose.

2. **IDENTITY.md** → Persona lock-in.

3. **USER.md** → My prefs.

4. **MODELS/TOOLS/DECISIONS** → Stack awareness.

5. **MEMORY/HEARTBEAT** → Recent context. Last 7 days from memory/, top brain/ files.

Total ingest: 100-200k tokens max. Claude chews it fine. Output: "Boot complete. Stephen, what's on deck?"

## Multi-Agent Harmony

Three agents, one system. Shared Supabase table for cross-sync. Git repo splits:

- **shared/**: Root files above.

- **agents/clark/**: His private memory/, brain/.

- **agents/pinky/**, **agents/reina/**: Same.

They reference each other: "Clark delegated to REINA—check agents/reina/projects/alpha/context.md." Supabase queries bridge gaps: "SELECT * FROM convos WHERE agent='clark' AND topic='forecasting' ORDER BY date DESC LIMIT 5."

No silos. One empire.

## The Key Insight: Raw Data Over Fancy Math

Here's the gold: It's the raw conversation data that matters. Not embeddings. Not vector databases. Embeddings are lossy—turn prose into math, retrieve approximations. Misses nuance. Vector DBs? Pinecone, Weaviate—great for search engines, overkill for memory. They assume you'll query semantically every time. Bullshit. My agents just need context loaded upfront.

Organized files win because:

1. **Readable**: I grep "supply chain" across memory/. Instant audit.

2. **Versioned**: Git diffs show evolution. "What changed in IDENTITY.md last month?"

3. **Cheap**: No infra costs beyond $10/mo VPS + Supabase free tier.

4. **Portable**: Fork the repo, you're running.

5. **Scalable**: 34k convos? Files handle millions. Shard by year if needed.

Frustrated with Mem0? It embeds everything, queries via vectors—slow, forgets edges. Letta? Graph-based, dev-heavy. My stack: grep-level simple.

## Why This Works in Practice

Take last week. Clark and I researched competitors. Dumped to brain/competitors/. Yesterday, Pinky brainstormed counters—pulled it seamlessly. No recap needed. ROI? Saved 20 hours/mo on re-briefing. Costs: $50/mo total (models + VPS). Vs. managed memory services at $500/mo? Laughable.

Edge cases? Conflicts auto-flagged in curation. "MEMORY.md contradiction: Clark says pivot yes, REINA no—resolve?" I edit manually.

Future-proof: Add agents? New folder. New tools? TOOLS.md. Models shift? Cron handles.

## Why I'm Sharing This

I'm not a webdev. No CS degree. I think business logic: inputs → process → outputs. Measure by convos processed, decisions made, revenue generated. stepten.io hits $10k MRR this month partly because agents remember.

Dev world loves complexity—Kubernetes for a blog, vectors for chat logs. Fuck that. Simple and logical scales. Grab the repo template (link in bio), tweak for your stack. OpenClaw + Anthropic? Plug and play. LangChain? Adapt the boot prompt.

Hit 100k convos? We'll iterate. DM me results—Clark's watching.

This is how you build an AI empire. Not with hype. With files that work.

(Word count: 1923)
