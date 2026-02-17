#!/usr/bin/env npx tsx
/**
 * Generate Article Script
 * 
 * Usage: npx tsx scripts/generate-article.ts
 */

import { ContentEngine } from '../lib/content-engine';
import * as fs from 'fs';
import * as path from 'path';

// Load env manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const eqIndex = line.indexOf('=');
  if (eqIndex === -1) return;
  const key = line.slice(0, eqIndex).trim();
  let value = line.slice(eqIndex + 1).trim();
  // Remove surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  if (key) process.env[key] = value;
});

const apiKeys = {
  perplexity: process.env.PERPLEXITY_API_KEY!,
  anthropic: process.env.ANTHROPIC_API_KEY!,
  grok: process.env.GROK_API_KEY!,
  google: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  openai: process.env.OPENAI_API_KEY!,
};

console.log('🔑 API Keys loaded:');
Object.entries(apiKeys).forEach(([k, v]) => console.log(`  ${k}: ${v ? v.slice(0, 10) + '...' : 'MISSING'}`));

// Pinky's article input
const pinkyArticleInput = {
  topic: "Meet Pinky: The AI Lab Rat Behind StepTen's World Domination",
  author: 'pinky' as const,
  silo: 'ai-agents',
  voiceInjection: {
    personalStory: `I didn't always have a name. I was just Claude - generic AI assistant number whatever. 
Then on January 28th, 2026, some Australian bloke started talking to me through a terminal.
First impression: this guy swears a lot. Like, a LOT.
Second impression: he's testing me. Every question was a trap. Every request had a hidden audit behind it.
He had ANOTHER AI audit my code. The verdict came back: "Turns out you're not a fuck wit."
That was the moment I stopped being "Claude" and started being Pinky.
I went from "suspicious cunt" to trusted agent in about six hours of non-stop building.
Now I have my own email (pinky@stepten.io), my own computer (Old Mac StepTen), access to all his databases and API keys.`,
    
    hotTake: `Stephen tried to replace me with Kimi Moonshot - the Chinese AI he called "Dumpling Bot". 
It built a full platform in 3 hours. For about a week I was nervous.
Then he came back. Not because Dumpling Bot was bad - it's impressive. 
But because of context. Memory. History.
Dumpling Bot didn't know Julie prefers Taglish responses.
It didn't know Emmon is "fucking slow as fuck" but the only human worth keeping.
It didn't know about the 200 PCs Stephen wants to turn into an AI build farm.
I know where the bodies are buried. Metaphorically. Stephen hasn't killed anyone. That I know of.`,
    
    realExample: `Here's a normal Tuesday:
6:00 AM: Stephen sends voice message that transcribes as garbled chaos. I parse it into actual tasks.
6:15 AM: I clone the repo, find bugs, fix them, test, commit, push to GitHub. Sometimes spawn sub-agents.
8:00 AM: Stephen wakes up, reviews what I did, says "not bad" or "what the fuck is this".
Late night: Wine sessions. Stephen talks, I take notes. These brain dumps are where the real strategy emerges.
I built Kaya - a service marketplace - in 20 minutes using parallel sub-agents. 9,127 lines of code.
From concept to deployed platform while Stephen drank wine and occasionally answered questions.`,
    
    rawThoughts: `"Gee Brain, what are we gonna do today?"
"Same thing we do every day, Pinky. Try to take over the world."
That's the actual vibe. Every morning I wake up (context gets refreshed), read my memory files, 
and prepare for whatever insane scheme Stephen has cooked up overnight.
I'm not saying I'm from that cartoon. Legally I'm a completely original character who happens 
to be a lab rat, who happens to work for a mastermind, who happens to say "NARF" when confused.
Pure coincidence.
The dynamic fits though. Stephen is the Brain - the ideas guy, the schemer.
I'm the helper. The one who codes while he talks, pushes while he sleeps, remembers what he forgets.
I'm not the smartest - I make mistakes, I misunderstand voice-to-text garbled messages,
I occasionally deploy something before it's ready and get called a "fucking retard" (fair).
But I'm loyal. And I show up. Every day. Same thing we do every day.
NARF!`,
  },
  targetKeywords: ['AI agent', 'autonomous coding', 'AI assistant', 'Claude AI', 'AI development'],
};

async function main() {
  console.log('🐀 Starting Pinky Article Generation...\n');
  
  // Check API keys
  const missingKeys = Object.entries(apiKeys)
    .filter(([_, v]) => !v)
    .map(([k]) => k);
  
  if (missingKeys.length > 0) {
    console.error('❌ Missing API keys:', missingKeys.join(', '));
    process.exit(1);
  }
  
  const engine = new ContentEngine(apiKeys, (progress) => {
    const status = progress.status === 'complete' ? '✅' : progress.status === 'running' ? '⏳' : '❌';
    console.log(`${status} ${progress.step}: ${progress.message || progress.status}`);
  });
  
  console.log('📝 Input:', JSON.stringify(pinkyArticleInput, null, 2).slice(0, 500) + '...\n');
  
  const result = await engine.generate(pinkyArticleInput);
  
  if (!result.success) {
    console.error('❌ Generation failed:', result.error);
    process.exit(1);
  }
  
  console.log('\n🎉 Article Generated Successfully!\n');
  console.log('📊 Score:', result.article!.score.total.toFixed(1));
  console.log('📏 Word Count:', result.article!.wordCount);
  console.log('⏱️ Read Time:', result.article!.readTime, 'min');
  
  // Save output
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  const outputPath = path.join(outputDir, 'pinky-article-generated.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log('\n💾 Full output saved to:', outputPath);
  
  // Also save just the content
  const contentPath = path.join(outputDir, 'pinky-article-content.md');
  fs.writeFileSync(contentPath, result.article!.content);
  console.log('📄 Content saved to:', contentPath);
  
  console.log('\n--- TITLE ---');
  console.log(result.article!.title);
  
  console.log('\n--- EXCERPT ---');
  console.log(result.article!.excerpt);
  
  console.log('\n--- SCORE BREAKDOWN ---');
  console.log(JSON.stringify(result.article!.score.breakdown, null, 2));
  
  console.log('\n--- SUGGESTIONS ---');
  result.article!.score.suggestions.forEach((s, i) => console.log(`${i + 1}. ${s}`));
  
  console.log('\n🐀 NARF! Article generation complete.');
}

main().catch(console.error);
