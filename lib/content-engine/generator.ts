/**
 * StepTen Content Engine - Main Generator
 * 
 * Orchestrates the full content generation pipeline.
 * 
 * Usage:
 *   const engine = new ContentEngine(apiKeys);
 *   const article = await engine.generate({
 *     topic: 'Why AI agents are replacing BPO workers',
 *     author: 'stepten',
 *     voiceInjection: {
 *       personalStory: 'I sacked 12 people and replaced them with AI...',
 *       hotTake: 'The BPO industry deserves to die...',
 *     }
 *   });
 */

import { config, ArticleInput, ArticleOutput, Author } from './config';
import { runResearch, ResearchOutput } from './steps/research';
import { runWriter, WriterOutput } from './steps/writer';
import { runHumanizer, HumanizerOutput } from './steps/humanizer';
import { runOptimizer, OptimizerOutput } from './steps/optimizer';
import { runScorer, ScorerOutput } from './steps/scorer';
import { generateIdeas, IdeaOutput } from './steps/ideas';

export interface ApiKeys {
  perplexity: string;
  anthropic: string;
  grok: string;
  google: string;
  openai: string;
}

export interface GenerationProgress {
  step: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  message?: string;
}

export interface GenerationResult {
  success: boolean;
  article?: ArticleOutput;
  intermediate?: {
    research: ResearchOutput;
    draft: WriterOutput;
    humanized: HumanizerOutput;
    optimized: OptimizerOutput;
    score: ScorerOutput;
    ideas: IdeaOutput[];
  };
  error?: string;
}

export class ContentEngine {
  private keys: ApiKeys;
  private onProgress?: (progress: GenerationProgress) => void;

  constructor(keys: ApiKeys, onProgress?: (progress: GenerationProgress) => void) {
    this.keys = keys;
    this.onProgress = onProgress;
  }

  private progress(step: string, status: GenerationProgress['status'], message?: string) {
    if (this.onProgress) {
      this.onProgress({ step, status, message });
    }
  }

  /**
   * Generate a full article through the pipeline
   */
  async generate(input: ArticleInput): Promise<GenerationResult> {
    const intermediate: GenerationResult['intermediate'] = {} as any;

    try {
      // Step 1: Research
      this.progress('research', 'running', 'Researching topic with Perplexity...');
      intermediate.research = await runResearch(input, this.keys.perplexity);
      this.progress('research', 'complete', `Found ${intermediate.research.sources.length} sources`);

      // Step 2: Write
      this.progress('writer', 'running', 'Writing article with Claude...');
      intermediate.draft = await runWriter(input, intermediate.research, this.keys.anthropic);
      this.progress('writer', 'complete', `Draft: ${intermediate.draft.wordCount} words, ${intermediate.draft.h2Count} sections`);

      // Step 3: Humanize
      this.progress('humanizer', 'running', 'Humanizing with Grok...');
      intermediate.humanized = await runHumanizer(
        intermediate.draft.content,
        input.author,
        this.keys.grok
      );
      this.progress('humanizer', 'complete', 'Content humanized');

      // Step 4: Optimize SEO
      this.progress('optimizer', 'running', 'Optimizing SEO with Gemini...');
      const existingArticles: Array<{ slug: string; title: string; excerpt: string }> = []; // TODO: Load from DB
      intermediate.optimized = await runOptimizer(
        intermediate.draft.title,
        intermediate.humanized.content,
        existingArticles,
        this.keys.google
      );
      this.progress('optimizer', 'complete', `Generated meta, schema, ${intermediate.optimized.internalLinks.length} internal links`);

      // Step 5: Score
      this.progress('scorer', 'running', 'Scoring against StepTen methodology...');
      intermediate.score = await runScorer(
        intermediate.draft.title,
        intermediate.humanized.content,
        this.keys.google
      );
      this.progress('scorer', 'complete', `Score: ${intermediate.score.weightedScore.toFixed(1)} (${intermediate.score.rating})`);

      // Step 6: Generate Ideas
      this.progress('ideas', 'running', 'Generating related article ideas...');
      intermediate.ideas = await generateIdeas(
        intermediate.draft.title,
        input.topic,
        intermediate.humanized.content,
        this.keys.google
      );
      this.progress('ideas', 'complete', `Generated ${intermediate.ideas.length} related ideas`);

      // Assemble final output
      const article: ArticleOutput = {
        slug: intermediate.optimized.meta.slug,
        title: intermediate.draft.title,
        content: intermediate.humanized.content,
        excerpt: intermediate.humanized.content.split('\n\n')[1]?.slice(0, 200) + '...',
        meta: {
          title: intermediate.optimized.meta.title,
          description: intermediate.optimized.meta.description,
          keywords: [
            intermediate.optimized.keywords.primary,
            ...intermediate.optimized.keywords.secondary,
          ],
          schema: intermediate.optimized.schema,
        },
        research: {
          sources: intermediate.research.sources,
          statistics: intermediate.research.statistics.map(s => s.stat),
          gaps: intermediate.research.competitorGaps,
        },
        seo: {
          internalLinks: intermediate.optimized.internalLinks.map(l => ({
            text: l.insertAfter,
            url: `/tales/${l.targetArticle}`,
            anchor: l.anchorText,
          })),
          externalLinks: intermediate.research.suggestedOutboundLinks.map(l => ({
            url: l.url,
            authority: 'verified',
          })),
          breadcrumbs: intermediate.optimized.breadcrumbs,
        },
        visuals: {
          featuredImage: '', // TODO: Generate with Imagen
          sectionImages: [],
        },
        score: {
          total: intermediate.score.weightedScore,
          breakdown: {
            titlePower: intermediate.score.scores.titlePower.score,
            humanVoice: intermediate.score.scores.humanVoice.score,
            contentQuality: intermediate.score.scores.contentQuality.score,
            visualEngagement: intermediate.score.scores.visualEngagement.score,
            technicalSeo: intermediate.score.scores.technicalSeo.score,
            internalEcosystem: intermediate.score.scores.internalEcosystem.score,
            aiVisibility: intermediate.score.scores.aiVisibility.score,
          },
          suggestions: intermediate.score.prioritizedImprovements.map(i => i.action),
        },
        relatedIdeas: intermediate.ideas.map(i => i.title),
        wordCount: intermediate.draft.wordCount,
        readTime: Math.ceil(intermediate.draft.wordCount / 200),
      };

      return {
        success: true,
        article,
        intermediate,
      };

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: message,
        intermediate,
      };
    }
  }

  /**
   * Analyze existing content (no generation)
   */
  async analyze(title: string, content: string): Promise<ScorerOutput> {
    return runScorer(title, content, this.keys.google);
  }
}

/**
 * Quick function to generate an article
 */
export async function generateArticle(
  input: ArticleInput,
  keys: ApiKeys
): Promise<GenerationResult> {
  const engine = new ContentEngine(keys);
  return engine.generate(input);
}

/**
 * Quick function to analyze content
 */
export async function analyzeArticle(
  title: string,
  content: string,
  googleKey: string
): Promise<ScorerOutput> {
  return runScorer(title, content, googleKey);
}
