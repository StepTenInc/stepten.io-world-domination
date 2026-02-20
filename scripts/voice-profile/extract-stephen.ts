/**
 * Extract Stephen's voice profile from:
 * 1. Published articles (polished voice)
 * 2. Raw conversations (authentic voice)
 * 
 * Output: A voice profile that can be injected into writing prompts
 */

import { createClient } from '@supabase/supabase-js';

const STEPTEN_IO_URL = 'https://iavnhggphhrvbcidixiw.supabase.co';
const STEPTEN_IO_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const ARMY_URL = 'https://ebqourqkrxalatubbapw.supabase.co';
const ARMY_KEY = process.env.ARMY_SERVICE_ROLE_KEY || '';

const steptenIO = createClient(STEPTEN_IO_URL, STEPTEN_IO_KEY);
const army = createClient(ARMY_URL, ARMY_KEY);

// Stephen's author ID
const STEPHEN_AUTHOR_ID = 'b3149e8b-257f-47db-b6bf-653e9ef5eb61';
// Stephen's agent ID in Army
const STEPHEN_AGENT_ID = '4ff87193-d4bf-4628-a2cb-48501dc1e437';

interface VoiceProfile {
  authorId: string;
  name: string;
  extractedAt: string;
  
  // From articles
  articleExcerpts: string[];
  writingPatterns: {
    openingStyles: string[];
    transitionPhrases: string[];
    closingStyles: string[];
  };
  
  // From conversations
  conversationExcerpts: string[];
  commonPhrases: string[];
  
  // Combined
  voiceDescription: string;
  examplePrompt: string;
}

async function extractFromArticles(): Promise<{excerpts: string[], patterns: any}> {
  console.log('📚 Extracting from published articles...');
  
  const { data: articles, error } = await steptenIO
    .from('tales')
    .select('slug, title, content')
    .eq('author_id', STEPHEN_AUTHOR_ID)
    .limit(10);
  
  if (error || !articles?.length) {
    console.log('No articles found:', error);
    return { excerpts: [], patterns: {} };
  }
  
  console.log(`Found ${articles.length} articles`);
  
  const excerpts: string[] = [];
  const openings: string[] = [];
  
  for (const article of articles) {
    if (!article.content) continue;
    
    // Get first paragraph (opening style)
    const firstPara = article.content.split('\n\n')[0]?.substring(0, 500);
    if (firstPara && firstPara.length > 100) {
      openings.push(firstPara);
      excerpts.push(`[From "${article.title}"]\n${firstPara}`);
    }
  }
  
  return {
    excerpts: excerpts.slice(0, 5),
    patterns: {
      openingStyles: openings.slice(0, 3),
      transitionPhrases: [],
      closingStyles: [],
    }
  };
}

async function extractFromConversations(): Promise<{excerpts: string[], phrases: string[]}> {
  console.log('💬 Extracting from conversations...');
  
  const { data: convos, error } = await army
    .from('raw_conversations')
    .select('content, created_at')
    .eq('role', 'user')
    .order('created_at', { ascending: false })
    .limit(100);
  
  if (error || !convos?.length) {
    console.log('No conversations found:', error);
    return { excerpts: [], phrases: [] };
  }
  
  console.log(`Found ${convos.length} messages`);
  
  // Filter for substantial messages (not just short commands)
  const substantial = convos.filter(c => 
    c.content && 
    c.content.length > 100 && 
    !c.content.startsWith('/') &&
    !c.content.includes('[message_id:') // Skip metadata
  );
  
  const excerpts = substantial.slice(0, 10).map(c => {
    // Clean up the content
    let content = c.content;
    // Remove Telegram metadata if present
    content = content.replace(/\[Telegram.*?\]/g, '').trim();
    return content.substring(0, 300);
  });
  
  // Extract common phrases
  const allText = substantial.map(c => c.content).join(' ').toLowerCase();
  const phrases: string[] = [];
  
  // Look for Stephen's common expressions
  const patterns = [
    /fuck(ing)?/gi,
    /mate/gi,
    /bloody/gi,
    /reckon/gi,
    /bullshit/gi,
    /you get me/gi,
    /do you feel me/gi,
  ];
  
  patterns.forEach(p => {
    const matches = allText.match(p);
    if (matches && matches.length > 2) {
      phrases.push(matches[0]);
    }
  });
  
  return { excerpts, phrases };
}

async function buildProfile(): Promise<VoiceProfile> {
  const [articleData, convoData] = await Promise.all([
    extractFromArticles(),
    extractFromConversations(),
  ]);
  
  const profile: VoiceProfile = {
    authorId: STEPHEN_AUTHOR_ID,
    name: 'Stephen Atcheler',
    extractedAt: new Date().toISOString(),
    
    articleExcerpts: articleData.excerpts,
    writingPatterns: articleData.patterns,
    
    conversationExcerpts: convoData.excerpts,
    commonPhrases: convoData.phrases,
    
    voiceDescription: `Stephen Atcheler - Australian entrepreneur, direct and no-bullshit. 
Swears naturally ("fuck", "bloody", "bullshit"). Uses Australian casual speech ("mate", "reckon").
Shares real stories - wins AND failures. States opinions directly, no hedging.
Calls out industry bullshit. References real numbers and experiences.
Never sounds like a LinkedIn influencer or corporate drone.`,
    
    examplePrompt: `Write as Stephen Atcheler. Use his actual voice:
- Direct, no bullshit
- Australian casual (mate, reckon, bloody)
- Swears naturally when emphasizing points
- Shares real experiences, not generic advice
- Has opinions and states them
- Calls out industry bullshit

REAL EXCERPTS FROM STEPHEN'S WRITING:
${articleData.excerpts.slice(0, 2).join('\n\n')}

REAL EXCERPTS FROM STEPHEN'S CONVERSATIONS:
${convoData.excerpts.slice(0, 3).join('\n\n')}`,
  };
  
  return profile;
}

async function main() {
  console.log('🎤 Extracting Stephen\'s Voice Profile\n');
  
  const profile = await buildProfile();
  
  console.log('\n✅ Profile built!\n');
  console.log('Voice Description:', profile.voiceDescription);
  console.log('\nArticle Excerpts:', profile.articleExcerpts.length);
  console.log('Conversation Excerpts:', profile.conversationExcerpts.length);
  console.log('Common Phrases:', profile.commonPhrases);
  
  // Save to file
  const fs = await import('fs');
  fs.writeFileSync(
    'scripts/voice-profile/stephen-profile.json',
    JSON.stringify(profile, null, 2)
  );
  console.log('\n💾 Saved to scripts/voice-profile/stephen-profile.json');
  
  // Also update the authors table with the voice profile
  const { error } = await steptenIO
    .from('authors')
    .update({ personality: profile.examplePrompt })
    .eq('id', STEPHEN_AUTHOR_ID);
  
  if (error) {
    console.log('Error updating authors table:', error);
  } else {
    console.log('✅ Updated authors.personality in database');
  }
}

main().catch(console.error);
