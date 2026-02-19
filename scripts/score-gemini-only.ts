import { createClient } from '@supabase/supabase-js';
import { tales } from '../lib/tales';

const SUPABASE_URL = 'https://iavnhggphhrvbcidixiw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SCORER_PROMPT = `You are scoring content against the StepTen methodology. Return ONLY valid JSON.

## CONTENT TO ANALYZE
Title: {{TITLE}}
Content (truncated): {{CONTENT}}

## OUTPUT FORMAT
{
  "scores": {
    "titlePower": {"score": 85, "feedback": "..."},
    "humanVoice": {"score": 90, "feedback": "..."},
    "contentQuality": {"score": 80, "feedback": "..."},
    "visualEngagement": {"score": 60, "feedback": "..."},
    "technicalSeo": {"score": 75, "feedback": "..."},
    "internalEcosystem": {"score": 50, "feedback": "..."},
    "aiVisibility": {"score": 70, "feedback": "..."}
  },
  "weightedScore": 76.5,
  "rating": "GOOD",
  "topStrengths": ["...", "..."],
  "topWeaknesses": ["...", "..."]
}`;

function parseJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try { return JSON.parse(match[1].trim()); } catch {}
    }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch {}
    }
    return null;
  }
}

async function test() {
  const { data: creds } = await supabase.from('credentials').select('name, value');
  const googleKey = creds?.find(c => c.name === 'google_generative_ai_key')?.value;
  
  const tale = tales.find(t => t.slug === 'chronicles-ai-rat-amnesia');
  const prompt = SCORER_PROMPT
    .replace('{{TITLE}}', tale?.title || '')
    .replace('{{CONTENT}}', tale?.content?.substring(0, 3000) || '');
  
  console.log('Calling Gemini...');
  console.log('Prompt length:', prompt.length);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${googleKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4000 },
    }),
  });
  
  const data = await response.json();
  console.log('Status:', response.status);
  
  if (data.error) {
    console.log('ERROR:', data.error);
    return;
  }
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('\nRaw text:', text.substring(0, 300));
  
  const parsed = parseJson(text);
  console.log('\nParsed:', parsed ? 'SUCCESS' : 'FAILED');
  if (parsed) {
    console.log('Weighted score:', parsed.weightedScore);
    console.log('Rating:', parsed.rating);
  }
}

test();
