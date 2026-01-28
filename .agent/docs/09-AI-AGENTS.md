# 09 — AI Agents

---

## Overview

Three AI agents with persistent memory, RAG retrieval, and conversation tracking.

---

## Agent 1: Sales Agent (Public)

**Location:** Public site chat widget (all pages)

**Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)

**Purpose:**
- Greet visitors
- Answer questions about products/services
- Qualify leads
- Capture contact info
- Book calls via Calendly
- Upsell/cross-sell

**Access:**
- Public (no auth required)
- Anonymous session tracking

**Has Access To:**
- Public knowledge base (articles, products, pricing)
- Lead capture tools
- Calendly booking
- Basic visitor context (page visited, referrer)

**Behavior:**
- Friendly, professional
- Proactive but not pushy
- Qualifies before booking
- Captures leads to database

---

## Agent 2: Onboarding Agent (Free Users)

**Location:** User dashboard

**Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)

**Purpose:**
- Help users get started
- Explain features and tools
- Guide through setup
- Answer product questions
- Suggest upgrades when relevant

**Access:**
- Authenticated users only
- Free and paid users

**Has Access To:**
- Full knowledge base
- User's profile & progress
- Product catalog
- User's conversation history
- User's memories

**Behavior:**
- Helpful, educational
- Remembers user context
- Guides step by step
- Suggests relevant features

---

## Agent 3: Support Agent (Paid Users)

**Location:** User dashboard (paid users only)

**Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)

**Purpose:**
- Technical support
- Business advice
- Implementation help
- Priority responses
- Deep assistance

**Access:**
- Paid users only (subscription check)

**Has Access To:**
- Full knowledge base
- User's full history
- User's conversation memories
- User's products & courses
- User's progress data
- Escalation tools (notify admin)

**Behavior:**
- Expert-level help
- Proactive problem solving
- Remembers everything about user
- Can escalate to human if needed

---

## Memory System

### Conversation Storage

```
User sends message
        ↓
Message stored in agent_messages
        ↓
Response generated
        ↓
Response stored in agent_messages
        ↓
Key facts extracted → agent_memories (with embedding)
```

### Memory Types

| Type | Description | Expires |
|------|-------------|---------|
| `fact` | Factual info about user | Never |
| `preference` | User preferences | Never |
| `summary` | Conversation summary | Never |
| `insight` | Derived insights | Optional |

### Monthly Summarization (CRON Job)

```
Conversations > 30 days old
        ↓
Summarize key points
        ↓
Extract important facts → agent_memories
        ↓
Store summary in conversation_summaries
        ↓
Archive/delete original messages
        ↓
Important memories persist forever
```

---

## RAG Retrieval Flow

```
User asks question
        ↓
Query embedded (Gemini text-embedding-005)
        ↓
Parallel search:
  ├── knowledge_base (articles, products, courses, FAQ)
  ├── agent_memories (user-specific facts)
  └── conversation_summaries (user history)
        ↓
Results ranked by relevance
        ↓
Top results combined into context
        ↓
Context injected into system prompt
        ↓
Agent responds with full context
```

### Knowledge Base Sources

| Source | Content |
|--------|---------|
| Articles | All published articles |
| Products | Product descriptions, features, pricing |
| Courses | Course content, module descriptions |
| FAQ | Common questions and answers |
| Custom | Any additional content added |

---

## Lead Capture Flow (Sales Agent)

```
User: "I want to work with you on a project"
        ↓
Agent: Asks qualifying questions
  - What's the project?
  - Timeline?
  - Budget range?
  - Company/name?
  - Email?
        ↓
Agent: Captures to leads table
  - lead_type: 'dev_project'
  - All collected info
  - conversation_id linked
        ↓
Agent: Books Calendly if qualified
        ↓
Notification sent (email/Slack)
```

---

## Agent Configuration

### Database Schema

```sql
-- Each agent has a config record
agents:
  - name: "Sales Agent"
  - slug: "sales"
  - type: "sales"
  - model: "claude-sonnet-4-5-20250929"
  - system_prompt: "You are a helpful sales assistant..."
  - personality: { friendly: true, professional: true }
  - is_public: true
  - requires_auth: false
  - temperature: 0.7
  - max_tokens: 4096
```

### System Prompt Structure

```
[Base Instructions]
You are {agent_name} for StepTen.io...

[Personality]
{personality_traits}

[Knowledge Context]
{RAG_retrieved_context}

[User Context]
{user_memories}
{conversation_history}

[Tools Available]
{available_tools}

[Current Conversation]
{messages}
```

---

## Tools Available to Agents

### Sales Agent Tools
- `search_knowledge_base` — Search articles, products, FAQ
- `capture_lead` — Save lead info to database
- `book_meeting` — Trigger Calendly booking
- `get_product_info` — Get specific product details
- `get_pricing` — Get pricing information

### Onboarding Agent Tools
- `search_knowledge_base` — Search all content
- `get_user_progress` — Check user's progress
- `get_user_products` — Check user's purchased products
- `suggest_next_step` — Recommend next action
- `get_feature_guide` — Get feature documentation

### Support Agent Tools
- All onboarding tools plus:
- `search_user_history` — Deep search user's past conversations
- `get_user_memories` — Get stored facts about user
- `escalate_to_human` — Flag for human review
- `create_support_ticket` — Create ticket if needed

---

## Chat Widget Component

### UI Elements
- Floating button (bottom right)
- Chat window (expandable)
- Message history
- Input field
- Voice input button (Whisper)
- Typing indicator
- Agent avatar

### Features
- Persistent across pages
- Remembers conversation in session
- Shows agent "thinking" state
- Handles voice input
- Mobile responsive

---

## Conversation Context

### What's Sent with Each Message

```javascript
{
  // Current message
  message: "User's question",
  
  // Conversation history (last N messages)
  history: [...],
  
  // User context (if authenticated)
  user: {
    id: "...",
    name: "...",
    subscription_tier: "pro",
    // etc
  },
  
  // RAG context
  knowledge_context: [...retrieved_chunks],
  
  // User memories
  memories: [...relevant_memories],
  
  // Page context
  current_page: "/products/seo-engine",
  referrer: "google.com"
}
```

---

## Performance Considerations

### Token Limits
- Keep conversation history to last 10-20 messages
- Summarize older messages
- Limit RAG context to top 5-10 chunks
- Total context < 16k tokens typically

### Latency
- Stream responses for better UX
- Pre-fetch likely context
- Cache common queries
- Use faster models for routing

### Cost
- Use Claude Sonnet (not Opus) for agents
- Route simple queries to cheaper models
- Summarize rather than store full history
- Batch embedding operations
