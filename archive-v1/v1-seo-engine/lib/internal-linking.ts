/**
 * Internal Linking Engine
 * Analyzes article content and suggests semantically relevant internal links
 * Uses embeddings and Claude AI for intelligent link placement
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  generateEmbedding,
  calculateCosineSimilarity,
  findSimilarArticles,
  getOrGenerateEmbedding,
} from "./embeddings";
import { InternalLinkSuggestion, InternalLinkingAnalysis } from "./seo-types";
import {
  MAX_INTERNAL_LINK_SUGGESTIONS,
  MIN_RELEVANCE_SCORE,
  IDEAL_INTERNAL_LINKS_MIN,
  IDEAL_INTERNAL_LINKS_MAX,
} from "./constants";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Published article structure for internal linking analysis
 */
export interface PublishedArticle {
  id: string;
  slug: string;
  title: string;
  content: string;
  focusKeyword: string;
  metaDescription?: string;
  embedding?: number[];
}

/**
 * Strips HTML tags from content to get plain text
 *
 * @param html - HTML content
 * @returns Plain text without HTML tags
 *
 * @example
 * ```ts
 * const plainText = stripHtml("<p>Hello <strong>world</strong></p>");
 * // Returns: "Hello world"
 * ```
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Splits article content into paragraphs and sentences
 *
 * @param content - Article content (plain text)
 * @returns Array of paragraphs, each containing array of sentences
 *
 * @example
 * ```ts
 * const structure = parseArticleStructure("Para 1 sentence 1. Para 1 sentence 2.\n\nPara 2.");
 * // Returns: [["Para 1 sentence 1.", "Para 1 sentence 2."], ["Para 2."]]
 * ```
 */
function parseArticleStructure(content: string): string[][] {
  // Split by double newlines or paragraph tags
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Split each paragraph into sentences
  return paragraphs.map((paragraph) => {
    const sentences = paragraph
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    return sentences;
  });
}

/**
 * Analyzes article content to extract key topics and context
 *
 * @param content - Article content (plain text)
 * @param title - Article title
 * @param focusKeyword - Primary keyword
 * @returns Object containing topics, entities, and key phrases
 */
async function analyzeArticleContent(
  content: string,
  title: string,
  focusKeyword: string
): Promise<{
  topics: string[];
  entities: string[];
  keyPhrases: string[];
}> {
  try {
    // Use Claude to extract semantic information
    const prompt = `Analyze this article and extract key information for internal linking.

ARTICLE TITLE: ${title}
FOCUS KEYWORD: ${focusKeyword}

ARTICLE CONTENT (first 3000 chars):
${content.slice(0, 3000)}

Extract:
1. Main topics discussed (5-10 topics)
2. Key entities mentioned (people, products, concepts, technologies)
3. Important phrases that could be anchor text

Return JSON only:
{
  "topics": ["topic1", "topic2", ...],
  "entities": ["entity1", "entity2", ...],
  "keyPhrases": ["phrase1", "phrase2", ...]
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      temperature: 0.3,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      topics: parsed.topics || [],
      entities: parsed.entities || [],
      keyPhrases: parsed.keyPhrases || [],
    };
  } catch (error) {
    console.error("Error analyzing article content:", error);
    // Fallback to basic extraction
    return {
      topics: [focusKeyword],
      entities: [],
      keyPhrases: [focusKeyword],
    };
  }
}

/**
 * Uses Claude AI to suggest optimal anchor text and placement for internal links
 *
 * @param currentArticle - The article being analyzed
 * @param targetArticle - The article to link to
 * @param currentContent - Full content of current article
 * @param semanticSimilarity - Similarity score between articles (0-1)
 * @returns Internal link suggestion with placement details
 */
async function suggestLinkPlacement(
  currentArticle: { title: string; content: string; focusKeyword: string },
  targetArticle: PublishedArticle,
  currentContent: string,
  semanticSimilarity: number
): Promise<Omit<InternalLinkSuggestion, "id" | "status"> | null> {
  try {
    const structure = parseArticleStructure(currentContent);
    const contextSnippets: string[] = [];

    // Get context snippets from the article
    structure.forEach((paragraph, pIndex) => {
      paragraph.forEach((sentence, sIndex) => {
        if (contextSnippets.length < 5) {
          contextSnippets.push(
            `[P${pIndex}:S${sIndex}] ${sentence.slice(0, 200)}`
          );
        }
      });
    });

    const prompt = `You are an SEO expert analyzing internal linking opportunities.

CURRENT ARTICLE:
Title: ${currentArticle.title}
Focus Keyword: ${currentArticle.focusKeyword}
Content Preview: ${currentContent.slice(0, 1500)}

TARGET ARTICLE TO LINK TO:
Title: ${targetArticle.title}
Focus Keyword: ${targetArticle.focusKeyword}
Meta Description: ${targetArticle.metaDescription || "N/A"}

SEMANTIC SIMILARITY: ${(semanticSimilarity * 100).toFixed(1)}%

CONTEXT SNIPPETS FROM CURRENT ARTICLE:
${contextSnippets.join("\n")}

YOUR TASK:
Analyze where and how to add an internal link from the current article to the target article.

1. Determine the best anchor text (natural, contextual, not exact keyword match)
2. Identify the ideal placement (paragraph index and sentence index)
3. Calculate a relevance score (0-100) based on topic overlap and user value
4. Provide reasoning for why this link is valuable
5. Determine if this should be bidirectional (should target article link back?)

IMPORTANT:
- Anchor text should be natural and contextual (avoid "click here")
- The link should provide genuine value to readers
- Consider topic relevance and user intent
- Placement should be in the middle sections (avoid intro/conclusion unless perfect fit)

Return JSON only (no markdown):
{
  "anchorText": "natural anchor text here",
  "paragraphIndex": 0,
  "sentenceIndex": 0,
  "position": 50,
  "context": "surrounding sentence context",
  "relevanceScore": 85,
  "reasoning": "Why this link adds value",
  "bidirectional": true
}

If the link is NOT relevant or valuable, return:
{ "relevant": false, "reason": "explanation" }`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      temperature: 0.5,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // Check if Claude determined the link is not relevant
    if (parsed.relevant === false) {
      return null;
    }

    // Validate required fields
    if (
      !parsed.anchorText ||
      parsed.relevanceScore === undefined ||
      parsed.paragraphIndex === undefined ||
      parsed.sentenceIndex === undefined
    ) {
      return null;
    }

    return {
      targetArticle: {
        id: targetArticle.id,
        slug: targetArticle.slug,
        title: targetArticle.title,
        focusKeyword: targetArticle.focusKeyword,
        url: `/articles/${targetArticle.slug}`,
      },
      anchorText: parsed.anchorText,
      relevanceScore: Math.min(100, Math.max(0, parsed.relevanceScore)),
      semanticSimilarity: semanticSimilarity,
      placement: {
        paragraphIndex: parsed.paragraphIndex,
        sentenceIndex: parsed.sentenceIndex,
        position: parsed.position || 0,
        context: parsed.context || "",
      },
      reasoning: parsed.reasoning || "Contextually relevant link",
      bidirectional: parsed.bidirectional || false,
    };
  } catch (error) {
    console.error("Error suggesting link placement:", error);
    return null;
  }
}

/**
 * Generates internal link suggestions for an article
 *
 * @param currentArticleId - ID of the article to analyze
 * @param currentArticleContent - Full content of the current article
 * @param currentArticleMetadata - Metadata (title, keyword, etc.)
 * @param publishedArticles - Array of all published articles to consider
 * @param supabase - Supabase client for caching embeddings
 * @returns Promise resolving to InternalLinkingAnalysis
 *
 * @example
 * ```ts
 * const analysis = await generateInternalLinkSuggestions(
 *   "article-123",
 *   articleContent,
 *   { title: "My Article", focusKeyword: "SEO", ... },
 *   allPublishedArticles,
 *   supabaseClient
 * );
 * ```
 */
export async function generateInternalLinkSuggestions(
  currentArticleId: string,
  currentArticleContent: string,
  currentArticleMetadata: {
    title: string;
    focusKeyword: string;
    metaDescription?: string;
  },
  publishedArticles: PublishedArticle[],
  supabase: any
): Promise<InternalLinkingAnalysis> {
  try {
    // Strip HTML from current article
    const plainText = stripHtml(currentArticleContent);

    // Filter out current article from candidates
    const candidateArticles = publishedArticles.filter(
      (article) => article.id !== currentArticleId
    );

    if (candidateArticles.length === 0) {
      return {
        currentArticleId,
        suggestions: [],
        existingLinks: [],
        metrics: {
          totalInternalLinks: 0,
          optimalRange: [IDEAL_INTERNAL_LINKS_MIN, IDEAL_INTERNAL_LINKS_MAX],
          orphanedContent: true,
          topicClusterCoverage: 0,
        },
      };
    }

    // Generate or retrieve embedding for current article
    const currentEmbedding = await getOrGenerateEmbedding(
      supabase,
      currentArticleId,
      plainText
    );

    // Generate or retrieve embeddings for all candidate articles
    const candidatesWithEmbeddings = await Promise.all(
      candidateArticles.map(async (article) => {
        let embedding = article.embedding;
        if (!embedding) {
          const articlePlainText = stripHtml(article.content);
          embedding = await getOrGenerateEmbedding(
            supabase,
            article.id,
            articlePlainText
          );
        }
        return {
          ...article,
          embedding,
        };
      })
    );

    // Find semantically similar articles
    const similarArticles = findSimilarArticles(
      currentEmbedding,
      candidatesWithEmbeddings,
      MAX_INTERNAL_LINK_SUGGESTIONS * 2, // Get more candidates than needed
      0.3 // Lower threshold to get more candidates
    );

    if (similarArticles.length === 0) {
      return {
        currentArticleId,
        suggestions: [],
        existingLinks: [],
        metrics: {
          totalInternalLinks: 0,
          optimalRange: [IDEAL_INTERNAL_LINKS_MIN, IDEAL_INTERNAL_LINKS_MAX],
          orphanedContent: true,
          topicClusterCoverage: 0,
        },
      };
    }

    // Use Claude to suggest link placements for top candidates
    const suggestions: InternalLinkSuggestion[] = [];

    for (const similarArticle of similarArticles) {
      if (suggestions.length >= MAX_INTERNAL_LINK_SUGGESTIONS) {
        break;
      }

      const suggestion = await suggestLinkPlacement(
        {
          title: currentArticleMetadata.title,
          content: plainText,
          focusKeyword: currentArticleMetadata.focusKeyword,
        },
        similarArticle,
        plainText,
        similarArticle.similarityScore
      );

      if (
        suggestion &&
        suggestion.relevanceScore >= MIN_RELEVANCE_SCORE
      ) {
        suggestions.push({
          id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          ...suggestion,
          status: "suggested",
        });

        // Add small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // Sort by relevance score (highest first)
    suggestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Extract existing links from content
    const existingLinks = extractExistingInternalLinks(currentArticleContent);

    // Calculate metrics
    const totalInternalLinks = existingLinks.length + suggestions.length;
    const orphanedContent = totalInternalLinks === 0;
    const topicClusterCoverage = Math.min(
      100,
      (suggestions.length / MAX_INTERNAL_LINK_SUGGESTIONS) * 100
    );

    return {
      currentArticleId,
      suggestions,
      existingLinks,
      metrics: {
        totalInternalLinks,
        optimalRange: [IDEAL_INTERNAL_LINKS_MIN, IDEAL_INTERNAL_LINKS_MAX],
        orphanedContent,
        topicClusterCoverage,
      },
    };
  } catch (error: any) {
    console.error("Error generating internal link suggestions:", error);
    throw new Error(`Failed to generate internal link suggestions: ${error.message}`);
  }
}

/**
 * Extracts existing internal links from article content
 *
 * @param content - HTML content of the article
 * @returns Array of existing internal link references
 *
 * @example
 * ```ts
 * const existing = extractExistingInternalLinks(articleHtml);
 * console.log(existing); // [{ targetId: "123", anchorText: "related article" }]
 * ```
 */
function extractExistingInternalLinks(content: string): Array<{
  targetId: string;
  anchorText: string;
}> {
  const links: Array<{ targetId: string; anchorText: string }> = [];

  // Match internal links (assuming format: /articles/[slug] or data-article-id)
  const linkRegex = /<a[^>]*href=["']\/articles\/([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const slug = match[1];
    const anchorText = match[2];

    links.push({
      targetId: slug, // Using slug as ID for now
      anchorText,
    });
  }

  return links;
}

/**
 * Calculates a relevance score based on multiple factors
 *
 * @param semanticSimilarity - Cosine similarity score (0-1)
 * @param topicOverlap - Number of overlapping topics
 * @param keywordMatch - Boolean indicating keyword match
 * @returns Relevance score (0-100)
 */
export function calculateRelevanceScore(
  semanticSimilarity: number,
  topicOverlap: number,
  keywordMatch: boolean
): number {
  // Weighted scoring:
  // - 60% semantic similarity
  // - 30% topic overlap
  // - 10% keyword match

  const semanticScore = semanticSimilarity * 60;
  const topicScore = Math.min(30, topicOverlap * 6); // Max 5 topics = 30 points
  const keywordScore = keywordMatch ? 10 : 0;

  return Math.round(semanticScore + topicScore + keywordScore);
}
