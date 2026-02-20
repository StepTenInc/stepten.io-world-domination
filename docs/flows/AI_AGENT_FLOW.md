# AI Agent Flow (Pinky/Reina/Clark Articles)

Articles written BY the AI agents themselves.

## Trigger
- Daily: System scans agent's conversations → generates ideas
- Or: Manual task assignment

## Pipeline

```
1. TASK ASSIGNMENT
   └── Cron creates army_task
   └── Assigned to agent (Pinky/Reina/Clark)
   └── Pinged via Clawdbot session

2. AGENT READS CONVERSATIONS
   └── Query raw_conversations for own messages
   └── Find topics discussed recently

3. GROK → IDEAS + OUTLINE
   └── Send conversations to Grok
   └── Get back: killer title + structured outline
   └── Check tales table for cannibalization

4. PERPLEXITY → RESEARCH
   └── "As of [today's date], research..."
   └── Get current facts, stats, sources
   └── Validate any claims

5. AGENT WRITES ARTICLE
   └── Agent writes it themselves (not API)
   └── Uses their personality and voice
   └── Incorporates research and outline
   └── Submits to army_task.output

6. HUMANIZE (Grok grok-4-1-fast-reasoning)
   └── Another pass for natural flow
   └── Ensure personality is consistent

7. OPTIMIZE (Gemini gemini-2.5-flash)
   └── SEO optimization
   └── Internal links
   └── Schema markup

8. MEDIA (Nano Banana + Veo)
   └── Hero image with characters
   └── Hero video
   └── Body images

9. SCORE (4-model consensus)
   └── Calculate StepTen Score

10. PUBLISH
    └── Insert into tales
    └── Mark army_task complete
```

## Key Difference from Human Flow
- Step 5: Agent WRITES the article (not Claude API)
- The article is authentically from the agent's perspective
