/**
 * Content Pipeline Orchestrator
 * 
 * Takes an approved idea from content_queue and runs it through:
 * 1. Research (Perplexity)
 * 2. Structure (Grok)
 * 3. Write (Claude) - using voice profile for human flow
 * 4. Humanize (Grok)
 * 5. Optimize (Gemini)
 * 6. Media (Nano Banana + Veo)
 * 7. Score (4-model)
 * 8. Publish
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const STEPTEN_IO_URL = 'https://iavnhggphhrvbcidixiw.supabase.co';
const STEPTEN_IO_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const ARMY_URL = 'https://ebqourqkrxalatubbapw.supabase.co';
const ARMY_KEY = process.env.ARMY_SERVICE_ROLE_KEY || '';

const steptenIO = createClient(STEPTEN_IO_URL, STEPTEN_IO_KEY);
const army = createClient(ARMY_URL, ARMY_KEY);

// Load voice profile
const voiceProfile = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'voice-profile/stephen-profile.json'), 'utf-8')
);

interface ApiKeys {
  perplexity: string;
  grok: string;
  anthropic: string;
  google: string;
  openai: string;
}

async function getApiKeys(): Promise<ApiKeys> {
  const { data } = await steptenIO.from('credentials').select('name, value');
  const keys: any = {};
  data?.forEach((c: any) => {
    if (c.name === 'perplexity_api_key') keys.perplexity = c.value;
    if (c.name === 'grok_api_key') keys.grok = c.value;
    if (c.name === 'anthropic_api_key') keys.anthropic = c.value;
    if (c.name === 'google_generative_ai_key') keys.google = c.value;
    if (c.name === 'openai_api_key') keys.openai = c.value;
  });
  return keys;
}

// Step 1: Research with Perplexity
async function research(topic: string, keys: ApiKeys): Promise<any> {
  console.log('  🔍 Researching with Perplexity...');
  
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keys.perplexity}`,
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [{
        role: 'user',
        content: `Research this topic thoroughly as of ${new Date().toISOString().split('T')[0]}:

${topic}

Provide:
1. Key facts and statistics (with sources)
2. Current state of the industry/topic
3. Common misconceptions
4. Expert opinions
5. Related topics worth mentioning

Return structured research with citations.`
      }],
    }),
  });
  
  const data = await response.json();
  const research = data.choices?.[0]?.message?.content || '';
  console.log(`    ✅ Research complete (${research.length} chars)`);
  return { content: research, citations: data.citations || [] };
}

// Step 2: Structure with Grok
async function structure(topic: string, research: string, keys: ApiKeys): Promise<any> {
  console.log('  📝 Creating structure with Grok...');
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keys.grok}`,
    },
    body: JSON.stringify({
      model: 'grok-3-fast',
      messages: [{
        role: 'user',
        content: `Create an article structure for this topic:

TOPIC: ${topic}

RESEARCH:
${research}

Create:
1. A killer title (50-60 chars, has number or power word, creates curiosity)
2. Meta description (120-155 chars)
3. Article outline with H2 headings
4. Key points to hit in each section
5. A hook for the opening paragraph

Return as JSON:
{
  "title": "...",
  "metaDescription": "...",
  "slug": "...",
  "outline": [
    {"heading": "H2 heading", "points": ["...", "..."]}
  ],
  "openingHook": "..."
}`
      }],
      temperature: 0.7,
    }),
  });
  
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const structure = JSON.parse(jsonMatch[0]);
      console.log(`    ✅ Structure: "${structure.title}"`);
      return structure;
    }
  } catch (e) {
    console.log('    ⚠️ Failed to parse structure, using raw');
  }
  
  return { title: topic, outline: [], openingHook: '' };
}

// Step 3: Write with Claude (using voice profile)
async function write(structure: any, research: string, voiceInjection: string, keys: ApiKeys): Promise<string> {
  console.log('  ✍️ Writing with Claude...');
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': keys.anthropic,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{
        role: 'user',
        content: `${voiceProfile.examplePrompt}

---

Write an article with this structure:

TITLE: ${structure.title}
OPENING HOOK: ${structure.openingHook}

OUTLINE:
${structure.outline?.map((s: any) => `## ${s.heading}\n${s.points?.join('\n')}`).join('\n\n')}

RESEARCH TO INCORPORATE:
${research}

${voiceInjection ? `ADDITIONAL CONTEXT FROM STEPHEN:\n${voiceInjection}` : ''}

Write the full article in markdown. Start with the title as H1.
Be direct, no bullshit, share real opinions. 
Use the research to back up points but write in Stephen's voice.
Include personal anecdotes and hot takes where relevant.
Keep paragraphs short (3-4 sentences max).
Add bullet lists where appropriate.
Target 1500-2500 words.`
      }],
    }),
  });
  
  const data = await response.json();
  const content = data.content?.[0]?.text || '';
  console.log(`    ✅ Written (${content.length} chars, ~${Math.round(content.split(' ').length)} words)`);
  return content;
}

// Step 4: Humanize with Grok
async function humanize(content: string, keys: ApiKeys): Promise<string> {
  console.log('  🤖 Humanizing with Grok...');
  
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${keys.grok}`,
    },
    body: JSON.stringify({
      model: 'grok-3-fast',
      messages: [{
        role: 'user',
        content: `Make this article sound more human and natural. Remove any AI-sounding patterns.

The author is Stephen Atcheler - Australian entrepreneur, direct and sweary.
- Add more conversational elements
- Vary sentence lengths
- Add natural transitions
- Keep his voice authentic
- Don't remove the personality or opinions

ARTICLE:
${content}

Return the humanized article in markdown.`
      }],
      temperature: 0.7,
    }),
  });
  
  const data = await response.json();
  const humanized = data.choices?.[0]?.message?.content || content;
  console.log(`    ✅ Humanized (${humanized.length} chars)`);
  return humanized;
}

// Step 5: SEO Optimize with Gemini
async function optimize(content: string, title: string, keys: ApiKeys): Promise<any> {
  console.log('  📈 Optimizing SEO with Gemini...');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keys.google}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Optimize this article for SEO:

TITLE: ${title}
CONTENT:
${content.substring(0, 8000)}

Provide:
1. Optimized meta title (50-60 chars)
2. Meta description (120-155 chars)  
3. Primary keyword
4. Secondary keywords (5)
5. Suggested internal link anchors
6. FAQ section (3 questions)

Return as JSON:
{
  "metaTitle": "...",
  "metaDescription": "...",
  "primaryKeyword": "...",
  "secondaryKeywords": [...],
  "internalLinkAnchors": [...],
  "faq": [{"q": "...", "a": "..."}]
}` }] }],
      generationConfig: { temperature: 0.3 },
    }),
  });
  
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const seo = JSON.parse(jsonMatch[0]);
      console.log(`    ✅ SEO optimized`);
      return seo;
    }
  } catch (e) {
    console.log('    ⚠️ Failed to parse SEO');
  }
  
  return {};
}

// Main pipeline
async function runPipeline(ideaId: string) {
  console.log(`\n🚀 Running pipeline for idea: ${ideaId}\n`);
  
  // Get the idea
  const { data: idea, error } = await steptenIO
    .from('content_queue')
    .select('*')
    .eq('id', ideaId)
    .single();
  
  if (error || !idea) {
    console.error('Idea not found:', error);
    return;
  }
  
  console.log(`📝 Topic: ${idea.title}`);
  console.log(`📄 Details: ${idea.topic}\n`);
  
  const keys = await getApiKeys();
  
  // Step 1: Research
  const researchData = await research(idea.topic, keys);
  
  // Step 2: Structure
  const structureData = await structure(idea.topic, researchData.content, keys);
  
  // Update queue status
  await steptenIO.from('content_queue').update({ 
    status: 'writing',
    title: structureData.title || idea.title,
  }).eq('id', ideaId);
  
  // Step 3: Write
  const draft = await write(structureData, researchData.content, idea.angle || '', keys);
  
  // Step 4: Humanize
  const humanized = await humanize(draft, keys);
  
  // Step 5: Optimize
  const seo = await optimize(humanized, structureData.title, keys);
  
  // Update status
  await steptenIO.from('content_queue').update({ status: 'optimized' }).eq('id', ideaId);
  
  // Create slug
  const slug = structureData.slug || structureData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
  
  console.log('\n📊 Pipeline Summary:');
  console.log(`  Title: ${structureData.title}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Words: ~${Math.round(humanized.split(' ').length)}`);
  console.log(`  Meta: ${seo.metaDescription?.substring(0, 50)}...`);
  
  // Save draft (don't publish yet - needs images and scoring)
  console.log('\n💾 Draft saved. Next: Generate images and score.');
  
  return {
    slug,
    title: structureData.title,
    content: humanized,
    excerpt: seo.metaDescription,
    seo,
    research: researchData,
  };
}

// CLI entry point
const ideaId = process.argv[2];
if (!ideaId) {
  console.log('Usage: npx tsx scripts/run-pipeline.ts <idea-id>');
  process.exit(1);
}

runPipeline(ideaId).catch(console.error);
