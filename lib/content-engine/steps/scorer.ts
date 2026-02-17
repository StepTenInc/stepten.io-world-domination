/**
 * Step 7: Scorer (StepTen Analyzer)
 * 
 * Scores content against the StepTen methodology.
 * Can analyze any content - not just engine-generated.
 */

import { config } from '../config';

const SCORER_PROMPT = `You are the StepTen Content Analyzer. Your job is to score content against our methodology and provide actionable feedback.

## THE CONTENT TO ANALYZE

Title: {{TITLE}}

Content:
{{CONTENT}}

## SCORING CRITERIA

Score each category from 0-100 based on these criteria:

### 1. TITLE POWER (Weight: 10%)
- Contains a number (not a year): +20
- Contains a power word (brutal, secret, shocking, proven, etc.): +25
- Creates curiosity gap: +25
- 50-60 characters: +15
- Keyword near start: +15

### 2. HUMAN VOICE (Weight: 25%)
- Personal story/experience present: +25
- Unpopular opinion/hot take present: +25
- Specific real-world example: +20
- Thoughts NOT findable via research: +15
- Conversational tone throughout: +15

### 3. CONTENT QUALITY (Weight: 20%)
- Topic fully covered (not padded): +25
- Unique insights not found elsewhere: +25
- Proper H1→H2→H3 hierarchy: +15
- Headings every 150-300 words: +15
- Short paragraphs (3-4 sentences max): +10
- Bullet lists where appropriate: +10

### 4. VISUAL ENGAGEMENT (Weight: 15%)
- Hero video present: +30
- Featured image (custom): +25
- Infographic/diagram: +20
- All images have alt text: +15
- Good visual hierarchy: +10

### 5. TECHNICAL SEO (Weight: 15%)
- Title tag 50-60 chars with keyword: +20
- Meta description 120-155 chars: +20
- URL slug short and descriptive: +15
- Schema markup present: +25
- No broken links: +10
- Publish date visible: +10

### 6. INTERNAL ECOSYSTEM (Weight: 10%)
- 2-3 internal links with enriched anchors: +35
- 1-2 external links to authorities: +25
- Part of a content silo: +20
- Breadcrumb navigation: +10
- Spawned related ideas: +10

### 7. AI VISIBILITY (Weight: 5%)
- Answer-first format used: +40
- FAQ section included: +30
- Self-contained sections: +20
- Clear entity definitions: +10

## OUTPUT FORMAT

Return as JSON:

{
  "scores": {
    "titlePower": {
      "score": 85,
      "maxPossible": 100,
      "breakdown": {
        "hasNumber": true,
        "hasPowerWord": true,
        "createsCuriosity": true,
        "correctLength": false,
        "keywordPosition": true
      },
      "feedback": "Strong title but slightly too long at 68 characters"
    },
    "humanVoice": {
      "score": 70,
      "maxPossible": 100,
      "breakdown": {
        "personalStory": true,
        "hotTake": false,
        "realExample": true,
        "uniqueThoughts": true,
        "conversationalTone": false
      },
      "feedback": "Good personal elements but missing a strong opinion/hot take"
    },
    "contentQuality": { /* same structure */ },
    "visualEngagement": { /* same structure */ },
    "technicalSeo": { /* same structure */ },
    "internalEcosystem": { /* same structure */ },
    "aiVisibility": { /* same structure */ }
  },
  "totalScore": 78,
  "weightedScore": 76.5,
  "rating": "GOOD",
  "topStrengths": [
    "Strong human voice with personal stories",
    "Well-structured with proper heading hierarchy"
  ],
  "topWeaknesses": [
    "Missing hero video",
    "No FAQ section for AI visibility"
  ],
  "prioritizedImprovements": [
    {
      "priority": 1,
      "category": "visualEngagement",
      "action": "Add a hero video to increase engagement",
      "impact": "High - video increases time on page by 88%"
    },
    {
      "priority": 2,
      "category": "aiVisibility",
      "action": "Add FAQ section with 3-5 common questions",
      "impact": "Medium - improves chances of AI citation"
    }
  ]
}

Be critical but constructive. The goal is to help improve the content, not just assign a number.`;

export interface ScoreBreakdown {
  score: number;
  maxPossible: number;
  breakdown: Record<string, boolean>;
  feedback: string;
}

export interface ScorerOutput {
  scores: {
    titlePower: ScoreBreakdown;
    humanVoice: ScoreBreakdown;
    contentQuality: ScoreBreakdown;
    visualEngagement: ScoreBreakdown;
    technicalSeo: ScoreBreakdown;
    internalEcosystem: ScoreBreakdown;
    aiVisibility: ScoreBreakdown;
  };
  totalScore: number;
  weightedScore: number;
  rating: 'EXCEPTIONAL' | 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'REQUIRES_REVISION';
  topStrengths: string[];
  topWeaknesses: string[];
  prioritizedImprovements: Array<{
    priority: number;
    category: string;
    action: string;
    impact: string;
  }>;
}

export async function runScorer(
  title: string,
  content: string,
  apiKey: string
): Promise<ScorerOutput> {
  const prompt = SCORER_PROMPT
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', content);

  // Use Gemini for analysis (fast and good at structured output)
  const response = await fetch(
    `${config.models.optimizer.endpoint}/models/${config.models.optimizer.model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2, // Lower for more consistent scoring
          maxOutputTokens: 4000,
          responseMimeType: 'application/json', // Force JSON output
        },
      }),
    }
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Failed to score content');
  }

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Scorer output (no JSON found):', text.slice(0, 500));
    throw new Error('Failed to parse scorer output - no JSON found');
  }

  let result: ScorerOutput;
  try {
    result = JSON.parse(jsonMatch[0]) as ScorerOutput;
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    console.error('Attempted to parse:', jsonMatch[0].slice(0, 500));
    throw new Error(`Failed to parse scorer JSON: ${parseError}`);
  }

  // Calculate weighted score if not provided
  if (!result.weightedScore) {
    const weights = config.scoring;
    result.weightedScore = 
      (result.scores.titlePower.score * weights.titlePower) +
      (result.scores.humanVoice.score * weights.humanVoice) +
      (result.scores.contentQuality.score * weights.contentQuality) +
      (result.scores.visualEngagement.score * weights.visualEngagement) +
      (result.scores.technicalSeo.score * weights.technicalSeo) +
      (result.scores.internalEcosystem.score * weights.internalEcosystem) +
      (result.scores.aiVisibility.score * weights.aiVisibility);
  }

  // Assign rating based on weighted score
  if (result.weightedScore >= 90) result.rating = 'EXCEPTIONAL';
  else if (result.weightedScore >= 80) result.rating = 'EXCELLENT';
  else if (result.weightedScore >= 70) result.rating = 'GOOD';
  else if (result.weightedScore >= 60) result.rating = 'NEEDS_WORK';
  else result.rating = 'REQUIRES_REVISION';

  return result;
}

/**
 * Standalone analyzer - can score any URL or content
 */
export async function analyzeContent(
  content: string,
  title: string,
  apiKey: string
): Promise<ScorerOutput> {
  return runScorer(title, content, apiKey);
}
