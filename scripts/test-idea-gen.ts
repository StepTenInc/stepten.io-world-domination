import { createClient } from '@supabase/supabase-js';

const STEPTEN_IO_URL = 'https://iavnhggphhrvbcidixiw.supabase.co';
const STEPTEN_IO_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ARMY_URL = 'https://ebqourqkrxalatubbapw.supabase.co';
const ARMY_KEY = process.env.ARMY_SERVICE_ROLE_KEY || '';

const steptenIO = createClient(STEPTEN_IO_URL, STEPTEN_IO_KEY);
const army = createClient(ARMY_URL, ARMY_KEY);

async function test() {
  // Get API keys
  const { data: creds } = await steptenIO.from('credentials').select('name, value');
  const grokKey = creds?.find((c: any) => c.name === 'grok_api_key')?.value;
  
  // Get conversations (no date filter)
  const { data: convos } = await army
    .from('raw_conversations')
    .select('content')
    .eq('role', 'user')
    .limit(50);
  
  const messages = convos
    ?.filter((c: any) => c.content?.includes('[Telegram'))
    .map((c: any) => {
      const match = c.content?.match(/\] ([\s\S]+?)(?:\[message_id|$)/);
      return match ? match[1].trim() : '';
    })
    .filter((c: any) => c.length > 50)
    .slice(0, 8);
  
  console.log(`Found ${messages?.length} messages`);
  console.log('Sample:', messages?.[0]?.substring(0, 100));
  
  // Get existing titles
  const { data: tales } = await steptenIO.from('tales').select('title');
  const existingTitles = tales?.map((t: any) => t.title) || [];
  
  // Call Grok
  console.log('\nCalling Grok for ideas...');
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${grokKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3-fast',
      messages: [{ role: 'user', content: `Generate 2 article ideas from these conversations:\n\n${messages?.join('\n\n')}\n\nExisting titles to avoid:\n${existingTitles.join('\n')}\n\nReturn JSON array: [{"title": "...", "topic": "...", "angle": "..."}]` }],
      temperature: 0.7,
    }),
  });
  
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  console.log('\nGrok ideas:', text);
}

test();
