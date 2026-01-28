# 10 — MCP Architecture

---

## Overview

Custom MCP (Model Context Protocol) server built in Python with FastAPI, providing tools for AI agents to interact with the system.

---

## Tech Stack

- **Server:** Python FastAPI
- **Agent Framework:** LlamaIndex + LangChain
- **Database:** Supabase (via Python client)
- **Deployment:** Render

---

## MCP Server Structure

```
apps/python/
├── app/
│   ├── mcp/
│   │   ├── server.py           # MCP server implementation
│   │   ├── tools/
│   │   │   ├── database.py     # Database operations
│   │   │   ├── search.py       # Search operations
│   │   │   ├── email.py        # Email operations
│   │   │   ├── analytics.py    # Analytics operations
│   │   │   └── calendar.py     # Calendar operations
│   │   └── resources/
│   │       └── ...
```

---

## Available Tools

### Database Tools

```python
# Query articles with filters
query_articles(
    status: str = None,        # idea, draft, published, etc
    silo_id: str = None,
    limit: int = 10
) -> List[Article]

# Query products with filters
query_products(
    status: str = None,        # draft, active, archived
    category: str = None,
    limit: int = 10
) -> List[Product]

# Query users with filters
query_users(
    role: str = None,
    subscription_tier: str = None,
    limit: int = 10
) -> List[User]

# Create a new lead
create_lead(
    name: str,
    email: str,
    company: str = None,
    lead_type: str,            # consulting, dev_project, partnership, etc
    budget_range: str = None,
    timeline: str = None,
    project_description: str = None,
    source_page: str = None,
    conversation_id: str = None
) -> Lead

# Update user data
update_user(
    user_id: str,
    data: dict
) -> User
```

### Search Tools

```python
# Semantic search across knowledge base
semantic_search(
    query: str,
    source_type: str = None,   # article, product, course, faq, custom
    limit: int = 5
) -> List[SearchResult]

# Keyword search
keyword_search(
    query: str,
    table: str,                # articles, products, etc
    limit: int = 10
) -> List[SearchResult]

# Search web (via Perplexity)
search_web(
    query: str
) -> WebSearchResult

# Search competitors for keyword
search_competitors(
    keyword: str,
    limit: int = 10
) -> List[CompetitorResult]
```

### Email Tools

```python
# Send email
send_email(
    to: str,
    subject: str,
    body: str,
    template: str = None
) -> EmailResult

# Add to newsletter
add_to_newsletter(
    email: str,
    source: str = None
) -> NewsletterResult
```

### Analytics Tools

```python
# Get user activity
get_user_activity(
    user_id: str,
    days: int = 30
) -> UserActivity

# Track event
track_event(
    event_name: str,
    data: dict,
    user_id: str = None,
    session_id: str = None
) -> EventResult
```

### Calendar Tools

```python
# Get available slots
get_available_slots(
    days_ahead: int = 14
) -> List[TimeSlot]

# Book meeting
book_meeting(
    name: str,
    email: str,
    slot: str,
    meeting_type: str,         # consultation, support, etc
    notes: str = None
) -> BookingResult
```

### SEO Tools

```python
# Analyze keyword
analyze_keyword(
    keyword: str
) -> KeywordAnalysis

# Check cannibalization
check_cannibalization(
    article_id: str = None,
    keyword: str = None,
    title: str = None
) -> CannibalizationResult

# Get internal link suggestions
get_internal_link_suggestions(
    article_id: str
) -> List[LinkSuggestion]

# Get silo info
get_silo_info(
    silo_id: str
) -> SiloInfo
```

---

## LlamaIndex Integration

### Query Engines

```python
# apps/python/app/llama_index/query_engines.py

# Article Query Engine
# For searching and retrieving article content
ArticleQueryEngine:
    - Index: article_embeddings
    - Returns: Relevant article chunks with metadata

# Product Query Engine
# For searching product information
ProductQueryEngine:
    - Index: knowledge_base (source_type='product')
    - Returns: Product info chunks

# User Memory Engine
# For retrieving user-specific memories
UserMemoryEngine:
    - Index: agent_memories
    - Filter: user_id
    - Returns: Relevant memories for user

# Full Knowledge Engine
# Combined search across everything
FullKnowledgeEngine:
    - Index: knowledge_base + agent_memories
    - Returns: Best matches from all sources
```

### Retrievers

```python
# apps/python/app/llama_index/retrievers.py

# Hybrid Retriever
# Combines semantic + keyword search
HybridRetriever:
    - Vector similarity search
    - BM25 keyword search
    - Re-ranking with cross-encoder

# Contextual Retriever
# Adds conversation context
ContextualRetriever:
    - Takes conversation history
    - Expands query with context
    - Returns contextually relevant results
```

---

## Memory System

### Conversation Memory

```python
# apps/python/app/memory/conversation.py

class ConversationMemory:
    def add_message(conversation_id, role, content):
        # Store message in agent_messages
        
    def get_history(conversation_id, limit=20):
        # Get recent messages
        
    def extract_facts(conversation_id, messages):
        # Use AI to extract key facts
        # Store in agent_memories with embedding
```

### Memory Summarizer

```python
# apps/python/app/memory/summarizer.py

class MemorySummarizer:
    def summarize_conversation(conversation_id):
        # Get all messages
        # Generate summary
        # Extract key facts
        # Store summary in conversation_summaries
        # Archive original messages
        
    def run_monthly_summarization():
        # CRON job
        # Find conversations > 30 days
        # Summarize each
        # Clean up old messages
```

### Memory Retrieval

```python
# apps/python/app/memory/retrieval.py

class MemoryRetrieval:
    def get_relevant_memories(user_id, query, limit=10):
        # Embed query
        # Search agent_memories for user
        # Return ranked results
        
    def get_user_context(user_id):
        # Get all memories for user
        # Get recent conversation summaries
        # Compile into context object
```

---

## API Routes

```python
# apps/python/app/api/routes/mcp.py

# MCP endpoint (called from Next.js)
POST /mcp/execute
{
    "tool": "semantic_search",
    "params": {
        "query": "how to use SEO engine",
        "limit": 5
    }
}

# Response
{
    "success": true,
    "result": [...]
}
```

```python
# apps/python/app/api/routes/agents.py

# Chat endpoint
POST /agents/chat
{
    "agent_id": "sales",
    "conversation_id": "...",
    "message": "I want to book a consultation",
    "user_id": null,  # or user ID if authenticated
    "context": {
        "current_page": "/services",
        "session_id": "..."
    }
}

# Response (streamed)
{
    "conversation_id": "...",
    "message": "...",
    "tool_calls": [...],
    "memories_updated": [...]
}
```

```python
# apps/python/app/api/routes/seo.py

# Research endpoint
POST /seo/research
{
    "article_id": "...",
    "topic": "AI automation for businesses",
    "personality_id": "..."
}

# Write endpoint
POST /seo/write
{
    "article_id": "...",
    "framework": {...},
    "plan": {...}
}

# Humanize endpoint
POST /seo/humanize
{
    "article_id": "...",
    "content": "..."
}

# Optimize endpoint
POST /seo/optimize
{
    "article_id": "...",
    "content": "..."
}
```

---

## Authentication

### From Next.js to Python

```python
# Next.js API route calls Python backend
# Passes Supabase JWT token

headers = {
    "Authorization": f"Bearer {supabase_token}",
    "X-User-ID": user_id,
    "X-User-Role": user_role
}
```

### Python Verification

```python
# Verify Supabase JWT
# Extract user info
# Check permissions for requested tool
```

---

## Deployment

### Environment Variables

```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
XAI_API_KEY=
PERPLEXITY_API_KEY=
DEEPSEEK_API_KEY=
```

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Scaling

- Stateless design (all state in Supabase)
- Can run multiple instances
- Use Redis for rate limiting if needed
