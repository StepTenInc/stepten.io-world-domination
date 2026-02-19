/**
 * Multi-Model Tale Scorer
 * 
 * Runs 4 different AI models against each tale and stores their scores.
 * Shows the differences in how each model evaluates content.
 * 
 * Models:
 * - Gemini (Google)
 * - Claude (Anthropic)
 * - GPT-4 (OpenAI)
 * - Grok (xAI)
 * 
 * Usage:
 *   npx tsx scripts/score-tales.ts
 *   npx tsx scripts/score-tales.ts --tale=chatgpt-to-terminal-ninja
 */

import { createClient } from '@supabase/supabase-js';

// Load env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iavnhggphhrvbcidixiw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Scoring prompt (same criteria for all models)
const SCORER_PROMPT = `You are scoring content against the StepTen methodology. Be critical but constructive.

## CONTENT TO ANALYZE

Title: {{TITLE}}

Content:
{{CONTENT}}

## SCORING CRITERIA (0-100 each)

### 1. TITLE POWER (10% weight)
- Has number (not year): +20
- Has power word (brutal, secret, shocking): +25
- Creates curiosity: +25
- 50-60 chars: +15
- Keyword near start: +15

### 2. HUMAN VOICE (25% weight)
- Personal story: +25
- Hot take/opinion: +25
- Real example: +20
- Unique thoughts: +15
- Conversational: +15

### 3. CONTENT QUALITY (20% weight)
- Topic fully covered: +25
- Unique insights: +25
- Proper H1→H2→H3: +15
- Headings every 150-300 words: +15
- Short paragraphs: +10
- Bullet lists: +10

### 4. VISUAL ENGAGEMENT (15% weight)
- Hero video: +30
- Custom image: +25
- Infographic: +20
- Alt text: +15
- Visual hierarchy: +10

### 5. TECHNICAL SEO (15% weight)
- Title tag optimized: +20
- Meta description: +20
- Short URL slug: +15
- Schema markup: +25
- No broken links: +10
- Publish date: +10

### 6. INTERNAL ECOSYSTEM (10% weight)
- 2-3 internal links: +35
- 1-2 external links: +25
- Part of silo: +20
- Breadcrumbs: +10
- Related ideas: +10

### 7. AI VISIBILITY (5% weight)
- Answer-first format: +40
- FAQ section: +30
- Self-contained sections: +20
- Clear entities: +10

## OUTPUT (JSON only)

{
  "scores": {
    "titlePower": {"score": 85, "feedback": "Strong but 68 chars"},
    "humanVoice": {"score": 90, "feedback": "Great personal story"},
    "contentQuality": {"score": 80, "feedback": "Well structured"},
    "visualEngagement": {"score": 60, "feedback": "Missing hero video"},
    "technicalSeo": {"score": 75, "feedback": "Good meta, no schema"},
    "internalEcosystem": {"score": 50, "feedback": "Needs more links"},
    "aiVisibility": {"score": 70, "feedback": "Good but no FAQ"}
  },
  "weightedScore": 76.5,
  "rating": "GOOD",
  "topStrengths": ["Personal voice", "Unique insights"],
  "topWeaknesses": ["Missing video", "Few internal links"],
  "improvements": [
    {"priority": 1, "action": "Add hero video", "impact": "High"},
    {"priority": 2, "action": "Add 2 internal links", "impact": "Medium"}
  ]
}

Return ONLY valid JSON.`;

interface ModelConfig {
  name: string;
  provider: string;
  endpoint: string;
  model: string;
  apiKeyEnv: string;
}

const MODELS: ModelConfig[] = [
  {
    name: 'gemini-2.5-flash',
    provider: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    model: 'gemini-2.5-flash',
    apiKeyEnv: 'GOOGLE_API_KEY',
  },
  {
    name: 'claude-sonnet-4',
    provider: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-sonnet-4-20250514',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
  },
  {
    name: 'gpt-4o',
    provider: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  {
    name: 'grok-3',
    provider: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    model: 'grok-3',
    apiKeyEnv: 'GROK_API_KEY',
  },
];

async function scoreWithGemini(title: string, content: string, apiKey: string): Promise<any> {
  // Truncate content to avoid token limits
  const truncatedContent = content.length > 6000 ? content.substring(0, 6000) + '...[truncated]' : content;
  const prompt = SCORER_PROMPT.replace('{{TITLE}}', title).replace('{{CONTENT}}', truncatedContent);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
      },
    }),
  });
  
  const data = await response.json();
  if (data.error) {
    console.log(`    Gemini error: ${JSON.stringify(data.error)}`);
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const finishReason = data.candidates?.[0]?.finishReason;
  if (!text) {
    console.log(`    Gemini empty response. Full data: ${JSON.stringify(data).substring(0, 500)}`);
  }
  const parsed = parseJson(text);
  if (!parsed && text) {
  }
  return { raw: text, parsed };
}

async function scoreWithClaude(title: string, content: string, apiKey: string): Promise<any> {
  const prompt = SCORER_PROMPT.replace('{{TITLE}}', title).replace('{{CONTENT}}', content);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  
  const data = await response.json();
  const text = data.content?.[0]?.text || '';
  return { raw: text, parsed: parseJson(text) };
}

async function scoreWithGPT(title: string, content: string, apiKey: string): Promise<any> {
  const prompt = SCORER_PROMPT.replace('{{TITLE}}', title).replace('{{CONTENT}}', content);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });
  
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  return { raw: text, parsed: parseJson(text) };
}

async function scoreWithGrok(title: string, content: string, apiKey: string): Promise<any> {
  const prompt = SCORER_PROMPT.replace('{{TITLE}}', title).replace('{{CONTENT}}', content);
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });
  
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  return { raw: text, parsed: parseJson(text) };
}

function parseJson(text: string): any {
  try {
    // Try direct parse
    return JSON.parse(text);
  } catch {
    // Try to extract JSON from markdown code block (greedy match)
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch (e) {
        // Try to find the last complete JSON object in the code block
        const jsonInBlock = codeBlockMatch[1].match(/\{[\s\S]*\}/);
        if (jsonInBlock) {
          try { return JSON.parse(jsonInBlock[0]); } catch {}
        }
      }
    }
    // Try to find JSON object in text (greedy)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // Try to repair common JSON issues
        let fixed = jsonMatch[0]
          .replace(/,\s*}/g, '}')  // trailing commas
          .replace(/,\s*]/g, ']')  // trailing commas in arrays
          .replace(/(['"])?([a-zA-Z_][a-zA-Z0-9_]*)\1\s*:/g, '"$2":'); // unquoted keys
        try { return JSON.parse(fixed); } catch {}
      }
    }
    return null;
  }
}

async function scoreTale(tale: { id: string; slug: string; title: string; content: string }) {
  console.log(`\n📝 Scoring: ${tale.title}`);
  console.log('─'.repeat(60));
  
  const results: any[] = [];
  
  // Get API keys from credentials table
  const { data: creds } = await supabase.from('credentials').select('name, value');
  const keys: Record<string, string> = {};
  creds?.forEach((c: any) => {
    if (c.name === 'google_generative_ai_key') keys.google = c.value;
    if (c.name === 'anthropic_api_key') keys.anthropic = c.value;
    if (c.name === 'openai_api_key') keys.openai = c.value;
    if (c.name === 'grok_api_key') keys.grok = c.value;
  });
  
  // Score with each model
  const scorers = [
    { name: 'gemini-3-flash', provider: 'google', fn: scoreWithGemini, key: keys.google },
    { name: 'claude-sonnet-4', provider: 'anthropic', fn: scoreWithClaude, key: keys.anthropic },
    { name: 'gpt-4o', provider: 'openai', fn: scoreWithGPT, key: keys.openai },
    { name: 'grok-3', provider: 'xai', fn: scoreWithGrok, key: keys.grok },
  ];
  
  for (const scorer of scorers) {
    if (!scorer.key) {
      console.log(`  ⏭️  ${scorer.name}: No API key`);
      continue;
    }
    
    try {
      console.log(`  🔄 ${scorer.name}...`);
      const result = await scorer.fn(tale.title, tale.content, scorer.key);
      
      if (result.parsed) {
        const score = result.parsed.weightedScore || 0;
        console.log(`  ✅ ${scorer.name}: ${score.toFixed(1)} (${result.parsed.rating || 'N/A'})`);
        
        // Save to database
        await supabase.from('tale_scores').upsert({
          tale_id: tale.id,
          model: scorer.name,
          provider: scorer.provider,
          weighted_score: score,
          rating: result.parsed.rating,
          breakdown: result.parsed.scores,
          top_strengths: result.parsed.topStrengths,
          top_weaknesses: result.parsed.topWeaknesses,
          improvements: result.parsed.improvements,
          raw_response: result.raw,
          scored_at: new Date().toISOString(),
        }, { onConflict: 'tale_id,model' });
        
        results.push({ model: scorer.name, score, rating: result.parsed.rating });
      } else {
        console.log(`  ❌ ${scorer.name}: Failed to parse response`);
      }
    } catch (error: any) {
      console.log(`  ❌ ${scorer.name}: ${error.message}`);
    }
  }
  
  // Calculate average and update tale
  if (results.length > 0) {
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    console.log(`\n  📊 Average: ${avgScore.toFixed(1)} (${results.length} models)`);
    
    // Update tale with average score
    await supabase.from('tales').update({
      stepten_score: avgScore,
      score_breakdown: {
        models: results,
        average: avgScore,
        scored_at: new Date().toISOString(),
      },
    }).eq('id', tale.id);
  }
  
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const taleSlug = args.find(a => a.startsWith('--tale='))?.split('=')[1];
  
  // Get tales to score
  let query = supabase.from('tales').select('id, slug, title, content').eq('status', 'published');
  if (taleSlug) {
    query = query.eq('slug', taleSlug);
  }
  
  const { data: tales, error } = await query;
  
  if (error || !tales?.length) {
    console.error('No tales found:', error);
    return;
  }
  
  console.log(`\n🎯 Scoring ${tales.length} tale(s) with 4 models...\n`);
  
  for (const tale of tales) {
    await scoreTale(tale);
  }
  
  console.log('\n✅ Done!\n');
}

main().catch(console.error);
