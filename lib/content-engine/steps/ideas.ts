/**
 * Step 8: Ideas Generator
 * 
 * Spawns 5 related article ideas for the content queue.
 */

import { config } from '../config';

const IDEAS_PROMPT = `Based on this article, generate 5 related article ideas that would:
1. Be valuable to the same audience
2. Create opportunities for internal linking
3. Cover related but distinct topics
4. Fill content gaps in this subject area

## THE ARTICLE

Title: {{TITLE}}
Topic: {{TOPIC}}

Content Summary:
{{CONTENT_SUMMARY}}

## REQUIREMENTS FOR EACH IDEA

1. Should be linkable TO from this article (contextually relevant)
2. Should be able to link BACK to this article
3. Different enough to not cannibalize this article's keywords
4. Specific enough to be actionable
5. Interesting enough that someone would want to read it

## OUTPUT FORMAT

Return as JSON array:

[
  {
    "title": "Suggested title with number and power word",
    "topic": "Brief description of what this article would cover",
    "angle": "The unique angle or perspective",
    "targetKeyword": "Primary keyword to target",
    "linkOpportunity": "How this connects to the original article",
    "suggestedAuthor": "stepten|pinky|reina|clark - who should write this",
    "priority": 1-5
  }
]

Make these genuinely good ideas - things that would actually rank and provide value.`;

export interface IdeaOutput {
  title: string;
  topic: string;
  angle: string;
  targetKeyword: string;
  linkOpportunity: string;
  suggestedAuthor: 'stepten' | 'pinky' | 'reina' | 'clark';
  priority: number;
}

export async function generateIdeas(
  title: string,
  topic: string,
  content: string,
  apiKey: string
): Promise<IdeaOutput[]> {
  // Create a summary of the content (first 500 words)
  const contentSummary = content.split(/\s+/).slice(0, 500).join(' ') + '...';

  const prompt = IDEAS_PROMPT
    .replace('{{TITLE}}', title)
    .replace('{{TOPIC}}', topic)
    .replace('{{CONTENT_SUMMARY}}', contentSummary);

  const response = await fetch(
    `${config.models.optimizer.endpoint}/models/${config.models.optimizer.model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7, // Higher for creativity
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Failed to generate ideas');
  }

  // Parse JSON array from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse ideas output');
  }

  return JSON.parse(jsonMatch[0]) as IdeaOutput[];
}
