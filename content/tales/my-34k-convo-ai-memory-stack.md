# My 34k-Convo AI Memory Stack

G'day. Stephen here. I run ShoreAgents, a BPO outfit in the Philippines, and I've been balls-deep in building AI agent systems since early this year. Today I want to tell you about something that's been doing my head in for months – AI memory.

See, I've got three AI agents running 24/7: Clark (my operations guy), Pinky (handles client communications), and Raina (data analysis and research). They're all running on OpenClaw with Anthropic subscriptions, and between the three of them, they've had over 34,000 conversations since January 28th. 

That's a shitload of data.

But here's the thing that drives me absolutely mental – every time you start a new session with an AI agent, it's like they've had a bloody lobotomy. They forget everything. All those conversations, all that context, all the stuff they've learned about your business – gone.

It's like hiring someone brilliant, training them for months, then giving them amnesia every morning. Fucking useless.

## The Problem That's Keeping Me Up At Night

Let me paint you a picture. Clark might spend three hours on Tuesday working through a complex client onboarding process, figuring out all their quirks and requirements. Come Wednesday morning, he's asking me who the client is again. 

Meanwhile, Raina could do a deep dive into our recruitment metrics, identify patterns, suggest improvements – brilliant stuff. Next session? She's back to square one like she's never seen our data before.

And don't get me started on coordination between agents. Pinky might have a conversation with a client where they mention changing their service requirements, but Clark (who actually manages the operations) has no bloody clue because he can't see what Pinky discussed.

With 34,000 conversations in the bank, I was sitting on a goldmine of context and learning, but my agents couldn't access any of it. It was like having a library where all the books disappear every time you leave the building.

## What The "Experts" Are Peddling

So naturally, I went looking for solutions. Everyone and their dog claims they've solved AI memory. 

First stop was Letta (letta.com). These guys talk a big game about self-editing memory blocks and multi-agent sharing. Their architecture is complex as hell – they've got core memory, archival memory, recall memory, and probably memory's cousin twice removed. Look, I'm sure it works for some people, but Christ, you need a PhD just to understand their documentation.

Then I checked out Mem0 (mem0.ai). They're all about graph stores and vector stores and "intelligent filtering." Fancy stuff. They promise semantic memory and contextual understanding and a bunch of other buzzwords that make my eyes glaze over.

Both solutions probably work fine if you're Google or OpenAI and you've got a team of ML engineers sitting around eating free lunch and debugging vector databases all day. But I'm running a business here, not a research lab.

I just want my agents to remember shit. Is that too much to ask?

## My Simple Solution (That Actually Works)

After wasting weeks on fancy solutions that were overkill, I decided to build something simple. And you know what? Simple fucking works.

Here's my three-tier memory system:

**Hot Memory**: Current session data. Everything that's happening right now.

**Warm Memory**: Curated markdown files with the important stuff. This is the good shit – distilled knowledge, key decisions, important context.

**Cold Storage**: Everything archived in Supabase. Raw conversations, outputs, the works.

The magic happens in how these three tiers talk to each other.

## The File Structure That Changed Everything

I keep things dead simple in my root directory. Only the essential files live there:

- **AGENTS.md** - Who's who and what they do
- **SOUL.md** - The core personality and values for each agent
- **IDENTITY.md** - How they identify themselves and their role
- **USER.md** - Everything about me and how I like to work
- **MODELS.md** - Current model capabilities and updates
- **TOOLS.md** - Available functions and how to use them
- **DECISIONS.md** - Key decisions and why we made them
- **STORAGE.md** - How our data systems work
- **HEARTBEAT.md** - System status and health checks
- **MEMORY.md** - The curated gold – key learnings and context

Everything else gets organized into folders:
- memory/ (archived important stuff)
- brain/ (processing and temp files)
- credentials/ (well, not really – more on that later)
- projects/ (active work)
- archive/ (old conversations)
- inbox/ (new stuff to process)

Clean. Simple. No bullshit.

## The Nightly Ritual That Makes It All Work

Here's where the magic happens. Every night at 11pm, my system runs through this sequence:

**11:00 PM - Session Sync**: All the day's conversations and outputs get dumped to Supabase. Raw, unfiltered, everything.

**11:30 PM - Memory Curation**: This is the big one. The system reviews the day's conversations and decides what's worth keeping in warm memory. Not everything makes the cut – most conversations are routine shit that doesn't need to be remembered forever. But the good stuff? The insights, the new client requirements, the process improvements? That gets distilled and added to MEMORY.md.

**12:00 AM - GitHub Push**: All the core markdown files get pushed to GitHub. This means each agent can see what the others have been up to.

**Sunday 9:00 PM - Models Update**: MODELS.md gets refreshed via Perplexity so my agents always know about the latest AI capabilities. Can't have them recommending GPT-3 when GPT-4 is available, right?

## The Insight Everyone's Missing

Here's what all these fancy vector database solutions don't get – it's not about the fucking embeddings. It's about the raw session data.

When Clark has a conversation with me about a client problem, the value isn't in some semantic embedding of that conversation. The value is in the actual conversation itself – the context, the back-and-forth, the specific details, the tone.

Sure, I need to be able to search through it and find relevant stuff quickly. But at the end of the day, organized files beat fancy databases every time. 

You know why? Because I can understand files. I can edit them. I can debug them when they break. I can back them up with rsync if I want to. Try doing that with your fancy graph database when it shits itself at 2am on a Sunday.

## How My Agents Boot Up

Every session starts with a boot sequence. It's like a morning coffee routine, but for AI:

1. **Read SOUL.md** - Remember who you are and what you stand for
2. **Read IDENTITY.md** - Remember your role and responsibilities  
3. **Read USER.md** - Remember who you're working for and how they tick
4. **Read MODELS.md** - Check what capabilities you've got available
5. **Read TOOLS.md** - Refresh on what functions you can use
6. **Read DECISIONS.md** - Get up to speed on key decisions and context
7. **Read MEMORY.md** - This is the big one - all the important stuff from previous sessions
8. **Read HEARTBEAT.md** - Check system status and any urgent updates

Takes about 30 seconds, and boom – my agent is back up to speed with months of context.

## Multi-Agent Coordination That Actually Works

The beauty of this system is how my three agents can work together. They all share the same Supabase project, so they can access each other's conversation history when needed.

The GitHub repo has a shared/ folder with common files, plus individual agents/clark/, agents/pinky/, and agents/raina/ folders for agent-specific stuff.

So when Pinky has a conversation with a client about changing their service requirements, that conversation gets synced to Supabase. When Clark boots up the next morning, he can see in MEMORY.md that there's been a service change, and he can pull the full conversation from cold storage if he needs the details.

No complex message passing. No fancy coordination protocols. Just simple file sharing that works.

## The Security Bit (Without Being Paranoid)

One thing I learned early – never put credentials in files. Ever. Even if the files are private, even if they're encrypted, even if your repo is locked down tighter than Fort Knox. Just don't.

All credentials get fetched from Supabase at runtime. The agents know how to authenticate and grab what they need, but the actual keys and passwords never touch the file system.

It's a simple rule that saves you from a world of hurt later.

## What I'd Do Differently (And What You Should Steal)

If I was starting over, here's what I'd do:

**Start with the files first.** Don't get distracted by fancy vector databases and embedding models. Get your file structure right, get your boot sequence working, get your agents reading and writing markdown files reliably. You can always add the fancy shit later.

**Keep the root directory clean.** I see people with 50+ files in their root directory and wonder how they find anything. Ten core files, max. Everything else goes in folders.

**Curation is everything.** The nightly memory curation is what makes this whole system work. Without it, you're just hoarding data. With it, you're building institutional knowledge.

**Make it debuggable.** When something goes wrong (and it will), you want to be able to trace exactly what happened. Files you can read beat black box systems you can't.

**Test the boot sequence religiously.** If your agent can't reliably boot up with full context, none of the rest matters.

## The Bottom Line

Look, I'm not saying my system is perfect. I'm not saying it scales to a billion users or handles every edge case. But it works. My agents remember things. They build on previous conversations. They coordinate with each other. And I can understand and debug every part of it.

After 34,000 conversations, I can tell you that simple beats fancy every time. Files beat databases. Curation beats hoarding. And understanding your system beats having a system you don't understand.

If you're building AI agents and dealing with the memory problem, start simple. Get the basics working. Then add complexity only when you need it, not because some blog post told you to.

And for fuck's sake, remember that the goal isn't to build the fanciest memory system – it's to build agents that remember the right things at the right time.

That's it. Now stop reading about memory systems and go build one.
