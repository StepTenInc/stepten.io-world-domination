import { createClient } from '@supabase/supabase-js';
import { tales } from '../lib/tales';

const SUPABASE_URL = 'https://iavnhggphhrvbcidixiw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function test() {
  // Get credentials
  const { data: creds, error } = await supabase.from('credentials').select('name, value');
  
  console.log('Credentials error:', error);
  console.log('Found credentials:', creds?.map(c => c.name));
  
  const keys: Record<string, string> = {};
  creds?.forEach((c: any) => {
    if (c.name === 'google_generative_ai_key') keys.google = c.value;
    if (c.name === 'anthropic_api_key') keys.anthropic = c.value;
    if (c.name === 'openai_api_key') keys.openai = c.value;
    if (c.name === 'grok_api_key') keys.grok = c.value;
  });
  
  console.log('\nKeys found:');
  console.log('- Google:', keys.google ? keys.google.substring(0, 20) + '...' : 'MISSING');
  console.log('- Anthropic:', keys.anthropic ? keys.anthropic.substring(0, 20) + '...' : 'MISSING');
  console.log('- OpenAI:', keys.openai ? keys.openai.substring(0, 20) + '...' : 'MISSING');
  console.log('- Grok:', keys.grok ? keys.grok.substring(0, 20) + '...' : 'MISSING');
}

test();
