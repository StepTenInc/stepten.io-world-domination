/**
 * Step 3: Humanizer (Grok)
 * 
 * Makes the content sound human, removes AI patterns, adds personality.
 */

import { config } from '../config';
import { personalities, PersonalityKey } from '../personalities';

const HUMANIZER_PROMPT = `You are a humanization editor. Your job is to take AI-written content and make it sound like a real human wrote it.

## THE AUTHOR

This was written by {{AUTHOR_NAME}}. Their personality:
{{PERSONALITY_QUIRKS}}

## THE CONTENT TO HUMANIZE

{{CONTENT}}

## YOUR TASK

Edit this content to:

### 1. REMOVE AI PATTERNS
- "In today's fast-paced world" → DELETE
- "It's no secret that" → DELETE  
- "Let's dive in" → DELETE or replace with something better
- Overly perfect grammar → Add natural imperfections occasionally
- Repetitive sentence structure → Vary it up
- Every sentence starting the same way → Mix it up

### 2. ADD HUMAN ELEMENTS
- Conversational asides ("look, here's the thing...")
- Rhetorical questions
- Short punchy sentences. Then longer flowing ones that make a point.
- Contractions (don't, won't, can't - not do not, will not)
- Occasional incomplete sentences for emphasis. Like this.
- Personal pronouns (I, we, you)

### 3. INJECT PERSONALITY
- Add personality quirks from the author description
- Make opinions stronger, not hedged
- If something is bullshit, call it bullshit
- Add occasional humor where appropriate
- Make it sound like something you'd SAY, not just write

### 4. MAINTAIN QUALITY
- Keep all the valuable information
- Don't dumb it down
- Don't remove statistics or citations
- Don't change the structure significantly
- Keep the FAQ section intact

### 5. THE "OVER BEERS" TEST
Would you talk like this if explaining to a friend over beers? If a sentence sounds too formal or robotic for that context, fix it.

## OUTPUT

Return the humanized content in the same markdown format. Preserve all headings, lists, and structure. Just make it sound more human.

Only output the humanized content, no explanations or meta-commentary.`;

export interface HumanizerOutput {
  content: string;
  changesDescription: string;
}

export async function runHumanizer(
  content: string,
  author: PersonalityKey,
  apiKey: string
): Promise<HumanizerOutput> {
  const personality = personalities[author];
  
  const prompt = HUMANIZER_PROMPT
    .replace('{{AUTHOR_NAME}}', personality.displayName)
    .replace('{{PERSONALITY_QUIRKS}}', personality.quirks.map(q => `- ${q}`).join('\n'))
    .replace('{{CONTENT}}', content);

  const response = await fetch(config.models.humanizer.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.models.humanizer.model,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const humanizedContent = data.choices?.[0]?.message?.content;

  if (!humanizedContent) {
    throw new Error('Failed to humanize content');
  }

  return {
    content: humanizedContent,
    changesDescription: 'Content humanized with personality injection and AI pattern removal',
  };
}
