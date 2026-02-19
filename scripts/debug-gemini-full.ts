import { tales } from '../lib/tales';

const GEMINI_KEY = 'AIzaSyBu6lKtUbUtuh5rDBXNAkhAeE_-KvsArF8';
const tale = tales.find(t => t.slug === 'chronicles-ai-rat-amnesia');

// This is the actual SCORER_PROMPT from the script
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

const fullPrompt = SCORER_PROMPT.replace('{{TITLE}}', tale?.title || '').replace('{{CONTENT}}', tale?.content || '');
console.log('Full prompt length:', fullPrompt.length, 'chars');
console.log('Estimated tokens:', Math.ceil(fullPrompt.length / 4));

async function test() {
  console.log('\nCalling Gemini with full prompt...');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 4000 },
    }),
  });
  
  const data = await response.json();
  console.log('Response status:', response.status);
  
  if (data.error) {
    console.log('ERROR:', JSON.stringify(data.error, null, 2));
    return;
  }
  
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('\nExtracted text length:', text.length);
  console.log('Text preview:', text.substring(0, 500));
}

test();
