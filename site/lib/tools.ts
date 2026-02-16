export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  logo: string;
  pricing: 'free' | 'freemium' | 'paid' | 'enterprise';
  rating?: number;
  review?: string;
  tags: string[];
  hasAPI?: boolean;
  used: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Logo helpers
const logo = (domain: string) => `https://logo.clearbit.com/${domain}`;
const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

export const categories: Category[] = [
  { id: 'coding-ide', name: 'AI Coding IDEs', icon: '💻', description: 'AI-powered code editors', color: '#00e5ff' },
  { id: 'coding-cli', name: 'Terminal Agents', icon: '⌨️', description: 'CLI coding assistants', color: '#00ff41' },
  { id: 'llm', name: 'Language Models', icon: '🧠', description: 'Chat & LLM platforms', color: '#ff00ff' },
  { id: 'video', name: 'Video Creation', icon: '🎬', description: 'AI video generation', color: '#ff6b6b' },
  { id: 'image', name: 'Image Generation', icon: '🎨', description: 'AI image creation', color: '#ffd93d' },
  { id: 'voice', name: 'Voice & Audio', icon: '🎙️', description: 'TTS, cloning, transcription', color: '#4d96ff' },
  { id: 'music', name: 'Music Creation', icon: '🎵', description: 'AI music generation', color: '#9b59b6' },
  { id: 'design', name: 'UX & Design', icon: '✏️', description: 'AI design tools', color: '#e74c3c' },
  { id: 'api', name: 'APIs & Infra', icon: '🔌', description: 'Developer platforms', color: '#1abc9c' },
  { id: 'research', name: 'Research', icon: '🔍', description: 'AI search & research', color: '#f39c12' },
  { id: 'deploy', name: 'Deploy', icon: '🚀', description: 'Hosting & deployment', color: '#3498db' },
];

export const tools: Tool[] = [
  // ═══════════════════════════════════════
  // CODING IDEs
  // ═══════════════════════════════════════
  { id: 'cursor', name: 'Cursor', description: 'AI-first code editor. Cmd+K to edit, chat with codebase.', category: 'coding-ide', url: 'https://cursor.sh', logo: logo('cursor.sh'), pricing: 'freemium', rating: 5, review: 'The best AI coding IDE. This is what I use daily.', tags: ['editor', 'vscode', 'claude'], used: true },
  { id: 'windsurf', name: 'Windsurf', description: 'Codeium AI IDE with Cascade for multi-file edits.', category: 'coding-ide', url: 'https://codeium.com/windsurf', logo: logo('codeium.com'), pricing: 'freemium', tags: ['editor', 'cascade'], used: true },
  { id: 'vscode', name: 'VS Code + Copilot', description: 'Classic VS Code with GitHub Copilot.', category: 'coding-ide', url: 'https://code.visualstudio.com', logo: logo('visualstudio.com'), pricing: 'freemium', tags: ['editor', 'microsoft'], used: true },
  { id: 'zed', name: 'Zed', description: 'Fast multiplayer editor with AI built-in.', category: 'coding-ide', url: 'https://zed.dev', logo: logo('zed.dev'), pricing: 'free', tags: ['editor', 'fast', 'rust'], used: false },

  // ═══════════════════════════════════════
  // TERMINAL AGENTS
  // ═══════════════════════════════════════
  { id: 'claude-code', name: 'Claude Code', description: 'Anthropic CLI agent. Agentic coding in terminal.', category: 'coding-cli', url: 'https://anthropic.com', logo: logo('anthropic.com'), pricing: 'paid', rating: 5, review: 'What Pinky runs on. Agentic coding at its finest.', tags: ['cli', 'anthropic'], used: true },
  { id: 'codex-cli', name: 'Codex CLI', description: 'OpenAI terminal coding agent.', category: 'coding-cli', url: 'https://openai.com', logo: logo('openai.com'), pricing: 'paid', tags: ['cli', 'openai'], used: true },
  { id: 'gemini-cli', name: 'Gemini CLI', description: 'Google Gemini in the terminal.', category: 'coding-cli', url: 'https://github.com/google-gemini/gemini-cli', logo: logo('google.com'), pricing: 'freemium', tags: ['cli', 'google'], used: true },
  { id: 'aider', name: 'Aider', description: 'AI pair programming in terminal.', category: 'coding-cli', url: 'https://aider.chat', logo: favicon('aider.chat'), pricing: 'free', tags: ['cli', 'opensource'], used: false },
  { id: 'opencode', name: 'OpenCode', description: 'Open source terminal coding agent.', category: 'coding-cli', url: 'https://github.com/opencode-ai/opencode', logo: logo('github.com'), pricing: 'free', tags: ['cli', 'opensource'], used: false },

  // ═══════════════════════════════════════
  // LANGUAGE MODELS
  // ═══════════════════════════════════════
  { id: 'claude', name: 'Claude', description: 'Anthropic AI. Best for coding and reasoning.', category: 'llm', url: 'https://claude.ai', logo: logo('anthropic.com'), pricing: 'freemium', rating: 5, review: 'My main AI. The brain behind everything.', tags: ['chat', 'reasoning'], hasAPI: true, used: true },
  { id: 'chatgpt', name: 'ChatGPT', description: 'OpenAI GPT-4 powered assistant.', category: 'llm', url: 'https://chat.openai.com', logo: logo('openai.com'), pricing: 'freemium', rating: 4, tags: ['chat', 'gpt4'], hasAPI: true, used: true },
  { id: 'grok', name: 'Grok', description: 'xAI unfiltered AI with real-time X data.', category: 'llm', url: 'https://grok.x.ai', logo: logo('x.ai'), pricing: 'paid', rating: 4, tags: ['chat', 'xai'], hasAPI: true, used: true },
  { id: 'gemini', name: 'Gemini', description: 'Google multimodal AI. Great long context.', category: 'llm', url: 'https://gemini.google.com', logo: logo('google.com'), pricing: 'freemium', rating: 4, tags: ['chat', 'multimodal'], hasAPI: true, used: true },
  { id: 'perplexity', name: 'Perplexity', description: 'AI search with real-time answers & sources.', category: 'research', url: 'https://perplexity.ai', logo: logo('perplexity.ai'), pricing: 'freemium', rating: 5, review: 'Best for research. Always up to date.', tags: ['search', 'citations'], hasAPI: true, used: true },

  // ═══════════════════════════════════════
  // VIDEO CREATION
  // ═══════════════════════════════════════
  { id: 'runway', name: 'Runway', description: 'Gen-3 Alpha video. Industry standard.', category: 'video', url: 'https://runwayml.com', logo: logo('runwayml.com'), pricing: 'paid', rating: 5, review: 'Best video AI right now. Gen-3 is insane.', tags: ['video', 'gen3'], hasAPI: true, used: true },
  { id: 'sora', name: 'Sora', description: 'OpenAI text-to-video model.', category: 'video', url: 'https://openai.com/sora', logo: logo('openai.com'), pricing: 'paid', tags: ['video', 'openai'], used: false },
  { id: 'veo', name: 'Veo', description: 'Google video generation via Gemini.', category: 'video', url: 'https://deepmind.google', logo: logo('deepmind.google'), pricing: 'paid', rating: 4, tags: ['video', 'google'], hasAPI: true, used: true },
  { id: 'kling', name: 'Kling', description: 'Kuaishou video generation.', category: 'video', url: 'https://klingai.com', logo: favicon('klingai.com'), pricing: 'freemium', tags: ['video', 'chinese'], used: false },
  { id: 'pika', name: 'Pika', description: 'AI video generation and editing.', category: 'video', url: 'https://pika.art', logo: logo('pika.art'), pricing: 'freemium', tags: ['video'], used: false },
  { id: 'luma', name: 'Luma Dream Machine', description: 'Fast video generation with great motion.', category: 'video', url: 'https://lumalabs.ai', logo: logo('lumalabs.ai'), pricing: 'freemium', tags: ['video', 'motion'], used: true },
  { id: 'haiper', name: 'Haiper', description: 'Free AI video generator.', category: 'video', url: 'https://haiper.ai', logo: favicon('haiper.ai'), pricing: 'freemium', tags: ['video', 'free'], used: false },
  { id: 'minimax', name: 'Minimax/Hailuo', description: 'Chinese video AI with great quality.', category: 'video', url: 'https://hailuoai.video', logo: favicon('hailuoai.video'), pricing: 'freemium', tags: ['video', 'chinese'], used: false },

  // ═══════════════════════════════════════
  // IMAGE GENERATION
  // ═══════════════════════════════════════
  { id: 'midjourney', name: 'Midjourney', description: 'Best aesthetic image gen. Discord-based.', category: 'image', url: 'https://midjourney.com', logo: logo('midjourney.com'), pricing: 'paid', rating: 5, review: 'Still the king of aesthetics. Nothing beats MJ.', tags: ['art', 'discord'], used: true },
  { id: 'dalle', name: 'DALL-E 3', description: 'OpenAI image generation in ChatGPT.', category: 'image', url: 'https://openai.com/dall-e-3', logo: logo('openai.com'), pricing: 'paid', rating: 4, tags: ['image', 'chatgpt'], hasAPI: true, used: true },
  { id: 'leonardo', name: 'Leonardo.ai', description: 'Phoenix model. Great for consistent characters.', category: 'image', url: 'https://leonardo.ai', logo: logo('leonardo.ai'), pricing: 'freemium', rating: 4, tags: ['characters', 'phoenix'], hasAPI: true, used: true },
  { id: 'imagen', name: 'Imagen 4', description: 'Google image gen via Gemini API.', category: 'image', url: 'https://cloud.google.com', logo: logo('google.com'), pricing: 'paid', rating: 4, tags: ['google', 'api'], hasAPI: true, used: true },
  { id: 'ideogram', name: 'Ideogram', description: 'Great for text in images and logos.', category: 'image', url: 'https://ideogram.ai', logo: logo('ideogram.ai'), pricing: 'freemium', tags: ['text', 'logos'], used: true },
  { id: 'flux', name: 'Flux', description: 'Black Forest Labs. Great open model.', category: 'image', url: 'https://blackforestlabs.ai', logo: favicon('blackforestlabs.ai'), pricing: 'freemium', tags: ['opensource'], used: false },
  { id: 'seaart', name: 'SeaArt.ai', description: 'Uncensored/NSFW capable. Great for characters.', category: 'image', url: 'https://seaart.ai', logo: favicon('seaart.ai'), pricing: 'freemium', rating: 4, review: 'When you need spicy content. No filters.', tags: ['nsfw', 'uncensored', 'characters'], used: true },
  { id: 'civitai', name: 'Civitai', description: 'Stable Diffusion models & community.', category: 'image', url: 'https://civitai.com', logo: favicon('civitai.com'), pricing: 'freemium', tags: ['models', 'community'], used: false },
  { id: 'stable-diffusion', name: 'Stable Diffusion', description: 'Open source. Run locally or via API.', category: 'image', url: 'https://stability.ai', logo: logo('stability.ai'), pricing: 'freemium', tags: ['opensource', 'local'], hasAPI: true, used: true },
  { id: 'playground', name: 'Playground AI', description: 'Free image gen with multiple models.', category: 'image', url: 'https://playground.com', logo: logo('playground.com'), pricing: 'freemium', tags: ['free', 'multi-model'], used: false },
  { id: 'tensorart', name: 'Tensor.Art', description: 'SD models online. Good for anime.', category: 'image', url: 'https://tensor.art', logo: favicon('tensor.art'), pricing: 'freemium', tags: ['anime', 'characters'], used: false },

  // ═══════════════════════════════════════
  // VOICE & AUDIO
  // ═══════════════════════════════════════
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'Best TTS. Voice cloning. Emotions.', category: 'voice', url: 'https://elevenlabs.io', logo: logo('elevenlabs.io'), pricing: 'freemium', rating: 5, review: 'The voice standard. Nothing else comes close.', tags: ['tts', 'cloning'], hasAPI: true, used: true },
  { id: 'whisper', name: 'Whisper', description: 'OpenAI speech-to-text. Best transcription.', category: 'voice', url: 'https://openai.com/whisper', logo: logo('openai.com'), pricing: 'freemium', rating: 5, review: 'Best transcription. Use it for everything.', tags: ['stt', 'transcription'], hasAPI: true, used: true },
  { id: 'openai-tts', name: 'OpenAI TTS', description: 'OpenAI text-to-speech API.', category: 'voice', url: 'https://platform.openai.com', logo: logo('openai.com'), pricing: 'paid', tags: ['tts', 'api'], hasAPI: true, used: true },
  { id: 'descript', name: 'Descript', description: 'AI audio/video editor. Overdub voice cloning.', category: 'voice', url: 'https://descript.com', logo: logo('descript.com'), pricing: 'freemium', tags: ['editing', 'overdub'], used: false },

  // ═══════════════════════════════════════
  // MUSIC
  // ═══════════════════════════════════════
  { id: 'suno', name: 'Suno', description: 'AI music generation. Full songs with vocals.', category: 'music', url: 'https://suno.ai', logo: favicon('suno.ai'), pricing: 'freemium', rating: 5, review: 'Mind-blowing music AI. Creates full songs.', tags: ['vocals', 'generation'], used: true },
  { id: 'udio', name: 'Udio', description: 'AI music creation. Suno competitor.', category: 'music', url: 'https://udio.com', logo: favicon('udio.com'), pricing: 'freemium', tags: ['vocals', 'generation'], used: false },

  // ═══════════════════════════════════════
  // UX & DESIGN
  // ═══════════════════════════════════════
  { id: 'v0', name: 'v0.dev', description: 'Vercel AI UI generator. React/Next components.', category: 'design', url: 'https://v0.dev', logo: logo('vercel.com'), pricing: 'freemium', rating: 5, review: 'Insane for quick UI. Just describe what you want.', tags: ['ui', 'react'], used: true },
  { id: 'uxpilot', name: 'UX Pilot', description: 'AI-powered UX design tool.', category: 'design', url: 'https://uxpilot.ai', logo: favicon('uxpilot.ai'), pricing: 'paid', tags: ['ux', 'figma'], used: true },
  { id: 'bolt', name: 'Bolt.new', description: 'AI app builder. Full stack in browser.', category: 'design', url: 'https://bolt.new', logo: favicon('bolt.new'), pricing: 'freemium', tags: ['app-builder'], used: true },
  { id: 'lovable', name: 'Lovable', description: 'AI app builder with Supabase integration.', category: 'design', url: 'https://lovable.dev', logo: favicon('lovable.dev'), pricing: 'freemium', tags: ['app-builder', 'supabase'], used: true },
  { id: 'replit', name: 'Replit', description: 'AI-powered online IDE and deployment.', category: 'design', url: 'https://replit.com', logo: logo('replit.com'), pricing: 'freemium', tags: ['ide', 'deploy'], used: true },

  // ═══════════════════════════════════════
  // APIs & INFRASTRUCTURE
  // ═══════════════════════════════════════
  { id: 'openai-api', name: 'OpenAI API', description: 'GPT-4, DALL-E, Whisper, TTS all in one.', category: 'api', url: 'https://platform.openai.com', logo: logo('openai.com'), pricing: 'paid', rating: 5, tags: ['gpt', 'multimodal'], hasAPI: true, used: true },
  { id: 'anthropic-api', name: 'Anthropic API', description: 'Claude API. Best for coding.', category: 'api', url: 'https://console.anthropic.com', logo: logo('anthropic.com'), pricing: 'paid', rating: 5, tags: ['claude', 'reasoning'], hasAPI: true, used: true },
  { id: 'gemini-api', name: 'Gemini API', description: 'Google API. Vertex AI integration.', category: 'api', url: 'https://ai.google.dev', logo: logo('google.com'), pricing: 'freemium', rating: 4, tags: ['google', 'multimodal'], hasAPI: true, used: true },
  { id: 'replicate', name: 'Replicate', description: 'Run any open source model via API.', category: 'api', url: 'https://replicate.com', logo: logo('replicate.com'), pricing: 'paid', tags: ['opensource', 'models'], hasAPI: true, used: true },

  // ═══════════════════════════════════════
  // DEPLOY
  // ═══════════════════════════════════════
  { id: 'vercel', name: 'Vercel', description: 'Deploy Next.js and React. Best DX.', category: 'deploy', url: 'https://vercel.com', logo: logo('vercel.com'), pricing: 'freemium', rating: 5, review: 'Gold standard for deployment.', tags: ['nextjs', 'edge'], used: true },
  { id: 'supabase', name: 'Supabase', description: 'Postgres + Auth + Storage + Realtime.', category: 'deploy', url: 'https://supabase.com', logo: logo('supabase.com'), pricing: 'freemium', rating: 5, review: 'Firebase killer. Backend in minutes.', tags: ['postgres', 'auth'], used: true },
  { id: 'cloudflare', name: 'Cloudflare', description: 'Edge computing, CDN, Workers, AI.', category: 'deploy', url: 'https://cloudflare.com', logo: logo('cloudflare.com'), pricing: 'freemium', tags: ['cdn', 'edge'], used: true },
];

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(t => t.category === categoryId);
}

export function getUsedTools(): Tool[] {
  return tools.filter(t => t.used);
}
