# Human Flow (Stephen's Articles)

Articles written FOR Stephen using his voice profile.

## Trigger
- Daily: System scans Stephen's conversations → generates ideas
- Manual: Stephen records an idea via voice input

## Pipeline

```
1. IDEA CAPTURE
   └── From conversations OR voice recording
   └── Store in content_queue (status: 'idea')
   └── Create army_task (assigned: Pinky, status: 'pending')

2. RESEARCH + TITLE (Grok + Perplexity)
   └── Grok: Generate killer title + outline from idea
   └── Check tales table for cannibalization
   └── Perplexity: Research with today's date
   └── Update content_queue (status: 'researched')

3. WRITE (Claude claude-opus-4-6)
   └── Load Stephen's voice profile (scripts/voice-profile/stephen-profile.json)
   └── Input: idea + research + outline
   └── Query raw_conversations for real Stephen quotes on topic
   └── Claude writes article in Stephen's voice
   └── Update content_queue (status: 'written')

4. HUMANIZE (Grok grok-4-1-fast-reasoning)
   └── Remove any AI patterns
   └── Add more conversational elements
   └── Ensure Stephen's voice is consistent

5. OPTIMIZE (Gemini gemini-2.5-flash)
   └── SEO optimization
   └── Generate meta title/description
   └── Find internal link opportunities
   └── Generate schema markup

6. MEDIA (Nano Banana + Veo)
   └── Hero image with characters (Nano Banana)
   └── Hero video (Veo 3.1)
   └── 3 body images (Nano Banana)

7. SCORE (4-model consensus)
   └── Gemini 3 Flash, Claude Sonnet 4, GPT-4o, Grok 3
   └── Calculate StepTen Score
   └── Store in tale_scores

8. PUBLISH
   └── Insert into tales table
   └── Create relationships
   └── Mark army_task complete
```

## Stephen's Options
- **Record**: Add voice context → enriches the article
- **Approve**: Auto-generate using voice profile
- **Skip**: Leave in queue
- **Inject Later**: Add context to published articles
