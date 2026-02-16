/**
 * Step 2: Writer (Claude)
 * 
 * Writes the article with proper structure, personality, and human voice injection.
 */

import { config, ArticleInput } from '../config';
import { personalities } from '../personalities';
import { ResearchOutput } from './research';

const WRITER_PROMPT = `You are writing an article as {{AUTHOR_NAME}} for StepTen.io.

## YOUR VOICE & PERSONALITY

{{PERSONALITY}}

## THE TOPIC

{{TOPIC}}

## RESEARCH TO USE

Here's the research you MUST incorporate (cite sources where appropriate):

Key Findings:
{{KEY_FINDINGS}}

Statistics to Include:
{{STATISTICS}}

Questions to Answer:
{{QUESTIONS}}

## HUMAN VOICE INJECTION (CRITICAL - USE ALL OF THESE)

This is what makes our content unique. These are REAL thoughts and experiences that CANNOT be found elsewhere on the internet. You MUST weave these into the article naturally:

{{#if PERSONAL_STORY}}
### Personal Story to Include:
{{PERSONAL_STORY}}
{{/if}}

{{#if HOT_TAKE}}
### Hot Take / Unpopular Opinion:
{{HOT_TAKE}}
{{/if}}

{{#if REAL_EXAMPLE}}
### Real-World Example:
{{REAL_EXAMPLE}}
{{/if}}

{{#if RAW_THOUGHTS}}
### Raw Thoughts to Incorporate:
{{RAW_THOUGHTS}}
{{/if}}

## ARTICLE STRUCTURE REQUIREMENTS

1. **TITLE** (separate line at top)
   - Must contain a number (not a year)
   - Must contain a power word (brutal, secret, shocking, proven, etc.)
   - Must create curiosity gap
   - 50-60 characters ideal

2. **OPENING** (first 2-3 paragraphs)
   - Hook immediately - no "In today's world" bullshit
   - State the problem or opportunity clearly
   - Promise what they'll learn
   - Include the author's perspective/stake

3. **H2 SECTIONS** (every 150-300 words)
   - Each H2 should be a question or clear topic
   - First sentence after H2 = DIRECT ANSWER (for AI extraction)
   - Include relevant statistics with citations
   - Use the human voice injection where it fits naturally
   - Short paragraphs (3-4 sentences max)
   - Use bullet lists for scanability

4. **CONTENT RULES**
   - Write until the topic is COMPLETE, not a word more
   - No filler, no padding
   - Every sentence should earn its place
   - Contractions are fine (don't vs do not)
   - Varied sentence length (short. Then longer flowing ones.)
   - Rhetorical questions to engage reader

5. **FAQ SECTION** (at the end)
   - 3-5 questions people actually ask
   - Direct, helpful answers
   - This helps with AI search visibility

6. **CLOSING**
   - Summarize the key takeaway
   - Clear call to action
   - End with personality (not generic "thanks for reading")

## FORMAT

Return the article in markdown format:

# [Title]

[Opening paragraphs]

## [First H2 - Question or Topic]

[Answer-first content...]

## [Second H2]

[Content...]

[Continue with H2s every 150-300 words]

## Frequently Asked Questions

### [Question 1]
[Answer]

### [Question 2]
[Answer]

[Closing]

---

Now write the article. Make it genuinely good - something that would rank AND that you'd actually want to read.`;

export interface WriterOutput {
  title: string;
  content: string;
  wordCount: number;
  h2Count: number;
  hasFaq: boolean;
}

export async function runWriter(
  input: ArticleInput,
  research: ResearchOutput,
  apiKey: string
): Promise<WriterOutput> {
  const personality = personalities[input.author];
  
  // Build the prompt with all injections
  let prompt = WRITER_PROMPT
    .replace('{{AUTHOR_NAME}}', personality.displayName)
    .replace('{{PERSONALITY}}', personality.voice)
    .replace('{{TOPIC}}', input.topic)
    .replace('{{KEY_FINDINGS}}', research.keyFindings.map(f => `- ${f}`).join('\n'))
    .replace('{{STATISTICS}}', research.statistics.map(s => `- ${s.stat} (${s.source}, ${s.year})`).join('\n'))
    .replace('{{QUESTIONS}}', research.questionsToAnswer.map(q => `- ${q}`).join('\n'));

  // Handle voice injections
  const vi = input.voiceInjection;
  prompt = prompt
    .replace('{{#if PERSONAL_STORY}}', vi.personalStory ? '' : '<!--')
    .replace('{{/if}}', vi.personalStory ? '' : '-->')
    .replace('{{PERSONAL_STORY}}', vi.personalStory || '')
    .replace('{{#if HOT_TAKE}}', vi.hotTake ? '' : '<!--')
    .replace('{{/if}}', vi.hotTake ? '' : '-->')
    .replace('{{HOT_TAKE}}', vi.hotTake || '')
    .replace('{{#if REAL_EXAMPLE}}', vi.realExample ? '' : '<!--')
    .replace('{{/if}}', vi.realExample ? '' : '-->')
    .replace('{{REAL_EXAMPLE}}', vi.realExample || '')
    .replace('{{#if RAW_THOUGHTS}}', vi.rawThoughts ? '' : '<!--')
    .replace('{{/if}}', vi.rawThoughts ? '' : '-->')
    .replace('{{RAW_THOUGHTS}}', vi.rawThoughts || '');

  const response = await fetch(config.models.writer.endpoint, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.models.writer.model,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await response.json();
  const content = data.content?.[0]?.text;

  if (!content) {
    throw new Error('Failed to generate article content');
  }

  // Extract title from content
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : 'Untitled';

  // Count words and H2s
  const wordCount = content.split(/\s+/).length;
  const h2Count = (content.match(/^##\s+/gm) || []).length;
  const hasFaq = /frequently asked questions/i.test(content);

  return {
    title,
    content,
    wordCount,
    h2Count,
    hasFaq,
  };
}
