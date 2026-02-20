/**
 * Daily Idea Generator
 * 
 * Scans conversations from the past 24h → Generates article ideas
 * Runs as a cron job, populates content_queue
 */

import { createClient } from '@supabase/supabase-js';

const STEPTEN_IO_URL = 'https://iavnhggphhrvbcidixiw.supabase.co';
const STEPTEN_IO_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const ARMY_URL = 'https://ebqourqkrxalatubbapw.supabase.co';
const ARMY_KEY = process.env.ARMY_SERVICE_ROLE_KEY || '';

const steptenIO = createClient(STEPTEN_IO_URL, STEPTEN_IO_KEY);
const army = createClient(ARMY_URL, ARMY_KEY);

// Get API keys from StepTen.io credentials
async function getApiKeys() {
  const { data } = await steptenIO.from('credentials').select('name, value');
  const keys: Record<string, string> = {};
  data?.forEach((c: any) => {
    if (c.name === 'grok_api_key') keys.grok = c.value;
    if (c.name === 'perplexity_api_key') keys.perplexity = c.value;
  });
  return keys;
}

// Get recent conversations (last 24h)
async function getRecentConversations(authorId?: string): Promise<string[]> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  let query = army
    .from('raw_conversations')
    .select('content')
    .eq('role', 'user')
    .gte('created_at', yesterday)
    .order('created_at', { ascending: false })
    .limit(50);
  
  const { data, error } = await query;
  
  if (error || !data?.length) {
    console.log('No recent conversations:', error);
    return [];
  }
  
  // Filter for Telegram messages (Stephen's actual voice)
  return data
    .filter(c => c.content?.includes('[Telegram'))
    .map(c => {
      // Extract just the message content
      const match = c.content?.match(/\] (.+?)(?:\[message_id|$)/s);
      return match ? match[1].trim() : c.content;
    })
    .filter(c => c && c.length > 50);
}

// Get existing titles to avoid cannibalization
async function getExistingTitles(): Promise<string[]> {
  const { data } = await steptenIO.from('tales').select('title');
  const { data: queued } = await steptenIO.from('content_queue').select('title');
  
  return [
    ...(data?.map(t => t.title) || []),
    ...(queued?.map(t => t.title) || []),
  ];
}

// Use Grok to generate ideas from conversations
async function generateIdeas(conversations: string[], existingTitles: string[], grokKey: string): Promise<any[]> {
  console.log('🤖 Asking Grok to generate ideas...');
  
  const prompt = `You are analyzing recent conversations from Stephen Atcheler (Australian entrepreneur building AI agents).

RECENT CONVERSATIONS:
${conversations.slice(0, 10).join('\n\n---\n\n')}

EXISTING ARTICLE TITLES (DO NOT DUPLICATE):
${existingTitles.join('\n')}

Generate 3 article ideas based on interesting topics from these conversations.
Each idea should be something Stephen discussed that could become a full article.

For each idea, provide:
1. A killer title (50-60 chars, includes number or power word, creates curiosity)
2. The topic/angle (what's the unique perspective)
3. Why it's interesting (what makes this worth reading)
4. Key points to cover

Return as JSON array:
[
  {
    "title": "...",
    "topic": "...",
    "angle": "...",
    "keyPoints": ["...", "..."],
    "sourceQuote": "relevant quote from conversations"
  }
]

Return ONLY valid JSON, no markdown.`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${grokKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3-fast',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  
  try {
    // Try to parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.log('Failed to parse Grok response:', text.substring(0, 200));
  }
  
  return [];
}

// Add ideas to content_queue
async function queueIdeas(ideas: any[]): Promise<number> {
  let added = 0;
  
  for (const idea of ideas) {
    const { error } = await steptenIO.from('content_queue').insert({
      title: idea.title,
      topic: idea.topic,
      angle: idea.angle,
      suggested_author_id: 'b3149e8b-257f-47db-b6bf-653e9ef5eb61', // Stephen
      target_keyword: idea.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').slice(0, 5).join(' '),
      thought_provoking_questions: idea.keyPoints,
      priority: 5,
      status: 'idea',
    });
    
    if (!error) {
      added++;
      console.log(`  ✅ Queued: "${idea.title}"`);
    } else {
      console.log(`  ❌ Failed: ${error.message}`);
    }
  }
  
  return added;
}

async function main() {
  console.log('📰 Daily Idea Generator\n');
  console.log(`Date: ${new Date().toISOString().split('T')[0]}\n`);
  
  const keys = await getApiKeys();
  if (!keys.grok) {
    console.error('No Grok API key found');
    return;
  }
  
  // Get recent conversations
  console.log('💬 Fetching recent conversations...');
  const conversations = await getRecentConversations();
  console.log(`Found ${conversations.length} substantial messages\n`);
  
  if (conversations.length < 3) {
    console.log('Not enough conversations to generate ideas');
    return;
  }
  
  // Get existing titles
  const existingTitles = await getExistingTitles();
  console.log(`📚 ${existingTitles.length} existing titles to avoid\n`);
  
  // Generate ideas
  const ideas = await generateIdeas(conversations, existingTitles, keys.grok);
  console.log(`\n💡 Generated ${ideas.length} ideas\n`);
  
  // Queue them
  const added = await queueIdeas(ideas);
  console.log(`\n✅ Added ${added} ideas to queue`);
}

main().catch(console.error);
