import { createClient } from '@supabase/supabase-js';
import { tales } from '../lib/tales';

const SUPABASE_URL = 'https://iavnhggphhrvbcidixiw.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncContent() {
  const slug = process.argv[2];
  const tale = tales.find(t => t.slug === slug);
  
  if (!tale) {
    console.error(`Tale not found: ${slug}`);
    process.exit(1);
  }
  
  console.log(`Syncing content for: ${tale.title}`);
  console.log(`Content length: ${tale.content.length} chars`);
  
  const { error } = await supabase.from('tales').update({
    content: tale.content,
    title: tale.title,
    excerpt: tale.excerpt,
  }).eq('slug', slug);
  
  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }
  
  console.log('✅ Content synced!');
}

syncContent();
