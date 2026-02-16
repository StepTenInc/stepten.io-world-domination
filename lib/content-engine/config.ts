/**
 * StepTen Content Engine - Configuration
 * 
 * All models, endpoints, and scoring weights defined here.
 * Change models here, not in individual step files.
 */

export const config = {
  // Model Configuration
  models: {
    research: {
      provider: 'perplexity',
      model: 'sonar-pro',
      endpoint: 'https://api.perplexity.ai/chat/completions',
    },
    writer: {
      provider: 'anthropic',
      model: 'claude-opus-4-6',
      endpoint: 'https://api.anthropic.com/v1/messages',
    },
    humanizer: {
      provider: 'xai',
      model: 'grok-4-1-fast-reasoning',
      endpoint: 'https://api.x.ai/v1/chat/completions',
    },
    optimizer: {
      provider: 'google',
      model: 'gemini-2.5-flash',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    },
    video: {
      provider: 'google',
      model: 'veo-3.1-generate-preview',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    },
    image: {
      provider: 'google',
      model: 'imagen-4.0-generate-001',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    },
    embedding: {
      provider: 'openai',
      model: 'text-embedding-3-small',
      dimensions: 1536,
      endpoint: 'https://api.openai.com/v1/embeddings',
    },
  },

  // Scoring Weights
  scoring: {
    titlePower: 0.10,
    humanVoice: 0.25,
    contentQuality: 0.20,
    visualEngagement: 0.15,
    technicalSeo: 0.15,
    internalEcosystem: 0.10,
    aiVisibility: 0.05,
  },

  // Content Requirements
  requirements: {
    minWordCount: 1000,
    maxWordCount: 4000,
    titleLength: { min: 50, max: 60 },
    metaDescLength: { min: 120, max: 155 },
    headingInterval: { min: 150, max: 300 }, // words between H2s
    paragraphMaxSentences: 4,
    internalLinksMin: 2,
    externalLinksMin: 1,
  },

  // Power words for titles
  powerWords: {
    urgency: ['brutal', 'urgent', 'critical', 'essential', 'must-know'],
    emotion: ['shocking', 'heartbreaking', 'inspiring', 'infuriating'],
    curiosity: ['secret', 'hidden', 'surprising', 'strange', 'nobody-talks-about'],
    authority: ['proven', 'research-backed', 'expert', 'definitive'],
    benefit: ['simple', 'easy', 'quick', 'guaranteed', 'effortless'],
  },
} as const;

export type Author = 'stepten' | 'pinky' | 'reina' | 'clark';

export interface ArticleInput {
  topic: string;
  author: Author;
  silo?: string;
  voiceInjection: {
    personalStory?: string;
    hotTake?: string;
    realExample?: string;
    rawThoughts?: string;
  };
  targetKeywords?: string[];
}

export interface ArticleOutput {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
    schema: object;
  };
  research: {
    sources: Array<{ url: string; title: string; snippet: string }>;
    statistics: string[];
    gaps: string[];
  };
  seo: {
    internalLinks: Array<{ text: string; url: string; anchor: string }>;
    externalLinks: Array<{ url: string; authority: string }>;
    breadcrumbs: Array<{ name: string; url: string }>;
  };
  visuals: {
    heroVideo?: string;
    featuredImage: string;
    sectionImages: string[];
  };
  score: {
    total: number;
    breakdown: Record<string, number>;
    suggestions: string[];
  };
  relatedIdeas: string[];
  wordCount: number;
  readTime: number;
}
