/**
 * StepTen Content Engine
 * 
 * A multi-AI content generation pipeline that produces articles
 * following the StepTen methodology.
 * 
 * @example
 * ```ts
 * import { ContentEngine, generateArticle, analyzeArticle } from '@/lib/content-engine';
 * 
 * // Full generation
 * const result = await generateArticle({
 *   topic: 'Why AI agents are replacing BPO workers',
 *   author: 'stepten',
 *   voiceInjection: {
 *     personalStory: 'I sacked 12 people...',
 *     hotTake: 'The BPO industry deserves to die',
 *   }
 * }, apiKeys);
 * 
 * // Just analyze existing content
 * const score = await analyzeArticle('Title', content, googleKey);
 * ```
 */

// Main exports
export { ContentEngine, generateArticle, analyzeArticle } from './generator';
export type { ApiKeys, GenerationProgress, GenerationResult } from './generator';

// Config and types
export { config } from './config';
export type { ArticleInput, ArticleOutput, Author } from './config';

// Personalities
export { personalities } from './personalities';
export type { PersonalityKey } from './personalities';

// Individual steps (for advanced usage)
export { runResearch } from './steps/research';
export type { ResearchOutput } from './steps/research';

export { runWriter } from './steps/writer';
export type { WriterOutput } from './steps/writer';

export { runHumanizer } from './steps/humanizer';
export type { HumanizerOutput } from './steps/humanizer';

export { runOptimizer } from './steps/optimizer';
export type { OptimizerOutput } from './steps/optimizer';

export { runScorer, analyzeContent } from './steps/scorer';
export type { ScorerOutput, ScoreBreakdown } from './steps/scorer';

export { generateIdeas } from './steps/ideas';
export type { IdeaOutput } from './steps/ideas';
