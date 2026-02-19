import { tales } from '../lib/tales';

const GEMINI_KEY = 'AIzaSyBu6lKtUbUtuh5rDBXNAkhAeE_-KvsArF8';
const tale = tales.find(t => t.slug === 'chronicles-ai-rat-amnesia');

const SCORER_PROMPT = `Score this content. Return ONLY valid JSON.

Title: ${tale?.title}
Content: ${tale?.content?.substring(0, 2000)}...

Return JSON:
{
  "scores": {"titlePower": {"score": 85}, "humanVoice": {"score": 90}},
  "weightedScore": 75.5,
  "rating": "GOOD"
}`;

async function test() {
  console.log('Testing Gemini with scoring prompt...');
  console.log('Content length:', tale?.content?.length);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: SCORER_PROMPT }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4000 },
    }),
  });
  
  const data = await response.json();
  console.log('\nResponse status:', response.status);
  console.log('\nFull response:', JSON.stringify(data, null, 2).substring(0, 2000));
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('\nExtracted text:', text.substring(0, 500));
}

test();
