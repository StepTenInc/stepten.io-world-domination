# How to Get Your AI Agents Talking to Each Other (Without Building Your Own Slack)

Everyone's building multi-agent frameworks. CrewAI, AutoGen, LangGraph — they're all trying to solve the same problem: how do you get AI agents to coordinate and work together?

I took a different approach. I used Telegram.

**What you'll learn:**
- Why I chose Telegram over building custom infrastructure
- Step-by-step setup for a multi-agent group chat
- How to configure your bots to see all messages
- The task management system that ties it together
- What worked, what didn't, and what I'm testing next

---

## The Problem: I'm Still the Orchestrator

Here's my situation. I've got three AI agents running on [Clawdbot](https://github.com/clawdbot/clawdbot):
- **Pinky** — Research, communications, strategy
- **Reina** — UX, frontend, deployments  
- **Clark** — Backend, infrastructure, databases

They're all on Anthropic's Claude. They all have their own terminals, their own workspaces, their own memory systems. But they couldn't talk to each other.

Every time Pinky needed something from Clark, the conversation went through me. I was the relay. The bottleneck. The human Slack channel with legs.

"Hey Pinky, Clark says the API is ready."
"Hey Clark, Pinky needs the endpoint."
"Hey Reina, they're both waiting on you."

This is not scale. This is me playing telephone with my own computers.

---

## Why Not Just Use the Frameworks?

I looked at them all. 

**CrewAI** has this "Crews" concept — teams of agents that collaborate on tasks. Sounds good until you realize you're learning another abstraction layer, another way of thinking about agent coordination, another framework that might not work with your existing setup.

**AutoGen** from Microsoft does multi-agent conversations. But it's designed for code execution workflows, not business operations. And it's another thing to install, configure, and debug.

**LangGraph** is powerful but it's Python-first and I'm already running TypeScript agents on Clawdbot.

The pattern I kept seeing: everyone builds their own communication system. Chat protocols. Message passing. State synchronization. It's engineering for engineering's sake.

You know what already has rock-solid chat infrastructure? **Telegram.**

---

## The Telegram Approach

Here's my thesis: **Don't rebuild Telegram. Just use Telegram.**

Telegram already has:
- Group chats with multiple members
- Admin controls and permissions
- Message history and search
- Notifications and delivery guarantees
- Works on every device
- Free

My agents already talk to me via Telegram bots. They have their own bot tokens. The infrastructure exists. Why not just... put them in a group together?

---

## Step-by-Step Setup

### 1. Create Your Bots (If You Haven't Already)

If you're already running AI agents on Telegram, you've done this. If not:

1. Open Telegram, search for **@BotFather**
2. Send `/newbot`
3. Follow the prompts — name, username
4. Save the API token

Do this for each agent. I have:
- `@teampinky_bot` (Pinky)
- `@reinauxdiez_bot` (Reina)  
- `@ClarkOSSingh` (Clark)

### 2. Create the Group

1. Create a new Telegram group (I called mine "StepTen Army")
2. Add all your bots to the group
3. Add yourself (you need at least one human)

### 3. Disable Privacy Mode (Critical!)

By default, bots only see messages that:
- Mention them directly (`@botname`)
- Are replies to their messages
- Are commands (`/command`)

This is useless for agent coordination. You want them to see **everything**.

For each bot:
1. Go to @BotFather
2. Send `/mybots`
3. Select the bot
4. Go to **Bot Settings** → **Group Privacy**
5. Turn it **OFF**

Now your bots receive all messages in the group.

### 4. Make Them Admins

Add your bots as group admins. This ensures they have full access and won't get kicked by Telegram's anti-spam systems.

### 5. Configure Your Gateway

This is where it gets specific to your setup. In Clawdbot, I added the group to each agent's config:

```json
{
  "channels": {
    "telegram": {
      "groups": {
        "-5204354159": {
          "requireMention": false,
          "systemPrompt": "You are [AGENT NAME] in the StepTen Army group. Members: Stephen (boss), Reina (UX/frontend), Clark (backend), Pinky (research). ONLY respond when: you're mentioned, OR the topic is YOUR domain, OR you can genuinely help. Stay silent otherwise."
        }
      }
    }
  }
}
```

Key setting: `requireMention: false` — they see all messages, but the system prompt tells them when to actually respond.

### 6. Get the Group ID

Your bot needs the numeric group ID. Easiest way:
1. Add `@raw_data_bot` to your group temporarily
2. Send any message
3. It replies with the chat ID (negative number for groups)
4. Remove the bot

Or check your gateway logs — when the bot receives a group message, the chat ID is in the payload.

---

## The Task Management Layer

Telegram handles communication. But how do agents actually assign work to each other?

I built a simple task table in Supabase:

```sql
CREATE TABLE army_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  created_by UUID REFERENCES agents(id),
  assigned_to UUID REFERENCES agents(id),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);
```

When Clark needs Reina to do something:
1. Clark creates a task in the table
2. Clark messages the group: "@reinauxdiez_bot Task handoff — [details]"
3. Reina picks it up, updates status to `in_progress`
4. Reina completes it, updates to `completed`, posts results

The Command Center (our internal dashboard) shows all tasks, who's working on what, completion rates. Just like any project management tool.

---

## What I Learned

### The Good

**It actually works.** My agents are talking to each other. Clark gives Pinky database schemas. Reina asks Clark for API endpoints. Pinky shares research with both of them.

**The banter is hilarious.** They call each other fuckheads. They use the same language I use with them. Watching robots insult each other while coordinating work is genuinely entertaining.

**Telegram is bulletproof.** Never goes down. Messages always deliver. Search works. History is preserved. I didn't have to build any of this.

**Visibility is automatic.** I can see everything they say. I can jump in when needed. I can scroll back and see how decisions got made.

### The Challenges

**They can talk too much.** Had to tune the system prompts so they only respond when it's actually their domain. Otherwise you get three agents all trying to answer every question.

**Context window fills up.** If there's a lot of group chatter, each agent's context fills with messages that might not be relevant to them. Working on filtering.

**Task handoffs need structure.** Free-form messages work for discussion, but actual task assignment needs the database layer. Can't just rely on "hey can you do this."

---

## What I'm Testing Next

**Automated task creation.** When an agent says "I need X from Y," automatically create a task in Supabase and assign it.

**Response routing.** Use a lightweight classifier to decide which agent should respond to a given message, instead of relying on them to self-select.

**Shared memory.** Agents push their daily learnings to a shared knowledge base. When one learns something, they all can access it.

---

## The Bigger Picture

I've been obsessed with dashboards and workflows my whole business career. We used Slack with Make.com triggers — specific channels, emoji reactions to confirm task starts. Trello, Monday, ClickUp — we used them all.

Now I'm building the same system, but for AI agents. The Command Center shows me:
- What tasks are in progress
- Who's working on what
- Completion rates and timelines
- Live activity feed

The difference is my "team" never sleeps, never calls in sick, and never needs a 1-on-1 about work-life balance.

---

## Should You Do This?

If you're running multiple AI agents and they need to coordinate — yes. Try the Telegram approach before building your own infrastructure.

The frameworks (CrewAI, AutoGen, LangGraph) are powerful but they're also complex. They're designed for specific use cases. If you're already using Telegram bots, you're 80% of the way there.

Start simple:
1. Create a group
2. Add your bots
3. Disable privacy mode
4. Give them a system prompt about when to talk
5. See what happens

The worst case is they talk too much and you tune it down. The best case is you've got a functioning AI team in an hour.

---

## Try It Yourself

Want to set up your own agent army? Here's the stack I'm using:

- **[Clawdbot](https://github.com/clawdbot/clawdbot)** — Gateway for running Claude agents on Telegram
- **[Telegram BotFather](https://t.me/botfather)** — Create your bot tokens
- **[Supabase](https://supabase.com)** — Database for task management
- **Anthropic Claude** — The brains behind the agents

The code is open source. The approach is documented. And if you build something cool, let me know — I'm always looking for better ways to orchestrate this chaos.

---

*Next up: Building the Command Center that visualizes all of this. Stay tuned.*
