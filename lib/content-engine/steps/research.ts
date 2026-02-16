/**
 * Step 1: Research (Perplexity)
 * 
 * Deep web research to gather facts, statistics, citations, and identify gaps.
 */

import { config, ArticleInput } from '../config';

const RESEARCH_PROMPT = `You are a research assistant for a content creation engine. Your job is to do DEEP research on a topic and return structured, actionable insights.

## YOUR TASK

Research the following topic comprehensively:
{{TOPIC}}

Target keywords to consider: {{KEYWORDS}}

## WHAT I NEED FROM YOU

### 1. FACTUAL RESEARCH
- Current statistics and data (with years - nothing older than 2 years unless it's foundational)
- Studies and research findings
- Industry trends and changes
- Expert opinions and quotes (with attribution)

### 2. COMPETITOR CONTENT ANALYSIS
- What are the top-ranking articles saying about this?
- What angles are they taking?
- What questions are they answering?

### 3. CONTENT GAPS
- What are competitors MISSING?
- What questions are people asking that aren't being answered well?
- What controversial or underexplored angles exist?
- What would make OUR article different and better?

### 4. SOURCE URLS
- Provide actual URLs for every fact and statistic
- Prioritize authoritative sources (.gov, .edu, reputable publications)
- Include at least 5-10 solid sources

### 5. SEARCH INTENT
- What is someone searching for this topic actually trying to achieve?
- What problem are they trying to solve?
- Where are they in their journey (awareness, consideration, decision)?

## OUTPUT FORMAT

Return your research as JSON:

{
  "topic": "the topic researched",
  "searchIntent": "what the searcher wants to achieve",
  "keyFindings": [
    "Key finding 1 with specific data",
    "Key finding 2 with specific data"
  ],
  "statistics": [
    {
      "stat": "73% of companies...",
      "source": "Source name",
      "url": "https://...",
      "year": 2024
    }
  ],
  "competitorGaps": [
    "Gap 1: Most articles don't address...",
    "Gap 2: Nobody is talking about..."
  ],
  "controversialAngles": [
    "Hot take: Actually, the conventional wisdom is wrong because..."
  ],
  "questionsToAnswer": [
    "Question people are asking 1",
    "Question people are asking 2"
  ],
  "sources": [
    {
      "title": "Article title",
      "url": "https://...",
      "snippet": "Relevant excerpt",
      "authority": "high|medium|low"
    }
  ],
  "suggestedOutboundLinks": [
    {
      "url": "https://...",
      "anchor": "suggested anchor text",
      "reason": "why this is a good link"
    }
  ]
}

Be thorough. This research is the foundation for content that needs to rank AND provide genuine value.`;

export interface ResearchOutput {
  topic: string;
  searchIntent: string;
  keyFindings: string[];
  statistics: Array<{
    stat: string;
    source: string;
    url: string;
    year: number;
  }>;
  competitorGaps: string[];
  controversialAngles: string[];
  questionsToAnswer: string[];
  sources: Array<{
    title: string;
    url: string;
    snippet: string;
    authority: 'high' | 'medium' | 'low';
  }>;
  suggestedOutboundLinks: Array<{
    url: string;
    anchor: string;
    reason: string;
  }>;
}

export async function runResearch(
  input: ArticleInput,
  apiKey: string
): Promise<ResearchOutput> {
  const prompt = RESEARCH_PROMPT
    .replace('{{TOPIC}}', input.topic)
    .replace('{{KEYWORDS}}', input.targetKeywords?.join(', ') || 'none specified');

  const response = await fetch(config.models.research.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.models.research.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  // Parse the JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse research output');
  }

  return JSON.parse(jsonMatch[0]) as ResearchOutput;
}
