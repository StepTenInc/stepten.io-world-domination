/**
 * AI SEO Agent - Autonomous Writer
 * Automatically researches, writes, and optimizes articles end-to-end
 */

import Anthropic from "@anthropic-ai/sdk";
import type {
    ArticleData,
    ArticleIdea,
    ArticleResearch,
    Step3Framework,
    ArticleContent,
    Step5Humanization,
    Step6Optimization,
    SERPAnalysis,
    InternalLinkSuggestion,
    SnippetOptimization
} from "./seo-types";
import { analyzeSERP } from "./serp-analyzer";
import { generateSnippetOptimization } from "./snippet-optimizer";
import { generateInternalLinkSuggestions } from "./internal-linking";
import { createServerClient } from "./supabase/server";
import { DEFAULT_BASE_URL } from "./constants";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

interface AutoWriteResult {
    articleData: ArticleData;
    draftId: string;
    status: 'review' | 'failed';
    qualityScore: number;
    humanScore: number;
    seoScore: number;
    error?: string;
}

/**
 * Automatically researches a keyword using SERP analysis
 *
 * @param keyword - Target keyword to research
 * @param searchVolume - Monthly search volume estimate
 * @param difficulty - Keyword difficulty (0-100)
 * @returns Research data with SERP insights, competitors, and content gaps
 *
 * @example
 * const research = await autoResearchKeyword("AI content writing", 5000, 45);
 */
export async function autoResearchKeyword(
    keyword: string,
    searchVolume: number = 1000,
    difficulty: number = 50
): Promise<{ step2: ArticleResearch; serpAnalysis: SERPAnalysis }> {
    console.log(`[Agent Writer] Auto-researching keyword: "${keyword}"`);

    try {
        // Perform SERP analysis
        const serpAnalysis = await analyzeSERP(keyword, searchVolume, difficulty);

        // Create article idea from keyword
        const idea: ArticleIdea = {
            inputMethod: "text",
            ideaText: keyword,
            articleTitle: serpAnalysis.recommendations.contentAngle,
            timestamp: new Date().toISOString()
        };

        // Build research decomposition using SERP insights
        const decompositionPrompt = `You are an SEO content strategist analyzing a keyword for article creation.

**Keyword:** ${keyword}
**Search Volume:** ${searchVolume}/month
**Difficulty:** ${difficulty}/100

**SERP Analysis Insights:**
- Featured Snippet Present: ${serpAnalysis.featuredSnippet ? 'Yes' : 'No'}
- Common Content Types: ${Object.entries(serpAnalysis.commonPatterns.commonContentTypes).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([type, count]) => `${type} (${count})`).join(', ')}
- Average Competitor Word Count: ${serpAnalysis.commonPatterns.avgWordCount}
- Top Topics: ${serpAnalysis.commonPatterns.sharedTopics.slice(0, 5).join(', ')}
- Content Gaps: ${serpAnalysis.commonPatterns.contentGaps.slice(0, 3).join(', ')}

**People Also Ask:**
${serpAnalysis.peopleAlsoAsk.slice(0, 5).map(q => `- ${q.question}`).join('\n')}

**Related Searches:**
${serpAnalysis.relatedSearches.slice(0, 5).join(', ')}

**Task:** Create a strategic research decomposition for this article.

Return as JSON:
{
  "mainTopic": "Clear description of the main topic",
  "targetAudience": "Who this article is for",
  "contentAngle": "Unique angle that fills content gaps",
  "researchQueries": ["query 1", "query 2", "query 3", "query 4"],
  "estimatedWordCount": ${serpAnalysis.recommendations.targetWordCount},
  "contentType": "article|guide|listicle|comparison|review"
}

Output ONLY valid JSON, no markdown.`;

        const decompMessage = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            temperature: 0.7,
            messages: [{ role: "user", content: decompositionPrompt }]
        });

        const decompText = decompMessage.content[0].type === "text" ? decompMessage.content[0].text : "{}";
        const jsonMatch = decompText.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : decompText;
        const decomposition = JSON.parse(jsonText);

        // Build research results from SERP data
        const researchResults = [
            {
                query: keyword,
                summary: `Analysis of top ${serpAnalysis.topRankingArticles.length} ranking articles for "${keyword}"`,
                keyFindings: serpAnalysis.topRankingArticles.slice(0, 3).map(article => ({
                    finding: `${article.title} - ${article.wordCount} words, covers: ${article.topics.slice(0, 2).join(', ')}`,
                    source: article.url,
                    relevance: "Competitor analysis",
                    date: article.lastUpdated || new Date().toISOString(),
                    url: article.url
                })),
                trendingTopics: serpAnalysis.commonPatterns.sharedTopics,
                controversies: [],
                practicalExamples: [],
                expertOpinions: [],
                relatedTools: [],
                commonQuestions: serpAnalysis.peopleAlsoAsk.map(q => q.question),
                researchedAt: new Date().toISOString()
            }
        ];

        // Build aggregated insights
        const aggregatedInsights = {
            totalSources: serpAnalysis.topRankingArticles.length,
            sourceBreakdown: {},
            dateRange: {
                oldest: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
                newest: new Date().toISOString()
            },
            topKeywords: serpAnalysis.relatedSearches,
            recommendedOutboundLinks: [],
            semanticKeywords: serpAnalysis.commonPatterns.sharedTopics,
            titleSuggestions: [
                serpAnalysis.recommendations.contentAngle,
                ...serpAnalysis.topRankingArticles.slice(0, 2).map(a => a.title)
            ],
            totalFindings: serpAnalysis.topRankingArticles.length
        };

        const step2: ArticleResearch = {
            versions: {
                original: {
                    decomposition,
                    researchResults,
                    aggregatedInsights,
                    timestamp: new Date().toISOString()
                }
            },
            activeVersion: "original",
            hasRefined: false,
            timestamp: new Date().toISOString()
        };

        console.log(`[Agent Writer] Research complete for "${keyword}"`);

        return { step2, serpAnalysis };

    } catch (error) {
        console.error("[Agent Writer] Error in auto-research:", error);
        throw new Error(`Failed to research keyword: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Generates an article outline using the framework builder
 *
 * @param step2 - Research data
 * @param serpAnalysis - SERP analysis insights
 * @param keyword - Target keyword
 * @returns Complete Step 3 framework with outline and guidelines
 *
 * @example
 * const framework = await autoGenerateOutline(research, serpAnalysis, "AI content writing");
 */
export async function autoGenerateOutline(
    step2: ArticleResearch,
    serpAnalysis: SERPAnalysis,
    keyword: string
): Promise<Step3Framework> {
    console.log(`[Agent Writer] Auto-generating outline for "${keyword}"`);

    const research = step2.versions[step2.activeVersion];
    if (!research) {
        throw new Error("Research version not found");
    }

    try {
        // Call the existing framework generation logic
        const frameworkPrompt = `You are an expert SEO content strategist creating an article framework.

**Keyword:** ${keyword}
**Target Word Count:** ${research.decomposition.estimatedWordCount}
**Content Type:** ${research.decomposition.contentType}
**Target Audience:** ${research.decomposition.targetAudience}
**Content Angle:** ${research.decomposition.contentAngle}

**SERP Insights:**
- Recommended headings: ${serpAnalysis.recommendations.suggestedHeadings.join(', ')}
- Must-have topics: ${serpAnalysis.recommendations.mustHaveTopics.join(', ')}
- Featured snippet opportunity: ${serpAnalysis.recommendations.snippetOpportunity}

**Common Questions to Address:**
${research.researchResults[0].commonQuestions.slice(0, 5).map(q => `- ${q}`).join('\n')}

**Task:** Create a comprehensive article framework optimized for SEO and user engagement.

Return as JSON with this structure:
{
  "metadata": {
    "title": "SEO-optimized title with keyword",
    "slug": "url-friendly-slug",
    "metaDescription": "Compelling 150-160 char description",
    "focusKeyword": "${keyword}",
    "mainKeyword": "${keyword}",
    "wordCountTarget": ${research.decomposition.estimatedWordCount},
    "readingLevel": "8th-10th grade",
    "silo": "primary-topic-area"
  },
  "outline": [
    {
      "type": "h1",
      "text": "Main title",
      "instructions": "Hook strategy"
    },
    {
      "type": "introduction",
      "text": "Introduction",
      "wordCount": 150,
      "instructions": "Opening hook and promise",
      "mustInclude": ["pain point", "value proposition"]
    },
    {
      "type": "h2",
      "text": "Section heading",
      "wordCount": 300,
      "subsections": [
        {
          "text": "Subsection",
          "instructions": "What to cover"
        }
      ]
    },
    {
      "type": "conclusion",
      "text": "Conclusion",
      "wordCount": 150,
      "instructions": "Summary and CTA"
    }
  ],
  "seoChecklist": {
    "keywordInTitle": true,
    "keywordInFirstParagraph": true,
    "keywordInSubheadings": true,
    "metaDescriptionOptimized": true
  },
  "writingGuidelines": {
    "tone": "professional but conversational",
    "style": "clear and actionable",
    "voice": "second person (you)",
    "perspective": "expert guide",
    "targetReadingLevel": "8th-10th grade"
  }
}

Output ONLY valid JSON, no markdown.`;

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            temperature: 0.7,
            messages: [{ role: "user", content: frameworkPrompt }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "{}";
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : responseText;

        const framework = JSON.parse(jsonText) as Step3Framework;
        framework.timestamp = new Date().toISOString();

        console.log(`[Agent Writer] Outline generated with ${framework.outline.length} sections`);

        return framework;

    } catch (error) {
        console.error("[Agent Writer] Error generating outline:", error);
        throw new Error(`Failed to generate outline: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Writes the complete article using AI (calls all 8 steps)
 *
 * @param keyword - Target keyword
 * @param searchVolume - Monthly search volume
 * @param difficulty - Keyword difficulty
 * @returns Complete article data with all steps executed
 *
 * @example
 * const result = await autoWriteArticle("AI content writing", 5000, 45);
 * // Returns: { articleData, draftId, status: 'review', qualityScore: 85 }
 */
export async function autoWriteArticle(
    keyword: string,
    searchVolume: number = 1000,
    difficulty: number = 50
): Promise<AutoWriteResult> {
    console.log(`[Agent Writer] Starting autonomous article writing for "${keyword}"`);

    try {
        const supabase = createServerClient();

        // Step 1: Create article idea
        const step1: ArticleIdea = {
            inputMethod: "text",
            ideaText: keyword,
            timestamp: new Date().toISOString()
        };

        // Step 2: Auto-research keyword
        const { step2, serpAnalysis } = await autoResearchKeyword(keyword, searchVolume, difficulty);

        // Step 3: Generate outline/framework
        const step3 = await autoGenerateOutline(step2, serpAnalysis, keyword);

        // Step 4: Write article (import the actual writing function)
        console.log(`[Agent Writer] Writing article content...`);
        const writeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL}/api/seo/write-article`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                framework: step3,
                research: step2,
                idea: step1
            })
        });

        if (!writeResponse.ok) {
            throw new Error('Failed to write article');
        }

        const writeData = await writeResponse.json();
        const articleContent = writeData.article;

        const step4: ArticleContent = {
            original: articleContent,
            wordCount: writeData.wordCount,
            timestamp: new Date().toISOString()
        };

        // Step 5: Humanize article
        console.log(`[Agent Writer] Humanizing article...`);
        const humanizeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL}/api/seo/humanize-article`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ article: articleContent })
        });

        if (!humanizeResponse.ok) {
            throw new Error('Failed to humanize article');
        }

        const humanizeData = await humanizeResponse.json();
        const step5: Step5Humanization = {
            original: articleContent,
            humanized: humanizeData.humanized,
            humanScore: humanizeData.humanScore,
            changeSummary: humanizeData.changeSummary,
            aiDetection: humanizeData.aiDetection,
            timestamp: new Date().toISOString()
        };

        // Step 6: SEO optimization
        console.log(`[Agent Writer] Optimizing SEO...`);
        const finalContent = humanizeData.humanized || articleContent;
        const seoResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL}/api/seo/analyze-seo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                article: finalContent,
                framework: step3
            })
        });

        if (!seoResponse.ok) {
            throw new Error('Failed to optimize SEO');
        }

        const seoData = await seoResponse.json();
        const step6: Step6Optimization = {
            metaTitle: seoData.metaTitle || step3.metadata.title,
            metaDescription: seoData.metaDescription || step3.metadata.metaDescription,
            articleSlug: step3.metadata.slug,
            seoScore: seoData.seoScore || 0,
            overallScore: seoData.overallScore || 0,
            seoChecks: seoData.seoChecks || [],
            jsonLD: seoData.jsonLD,
            schemaRecommendations: seoData.schemaRecommendations,
            timestamp: new Date().toISOString()
        };

        // Auto-optimize for featured snippets
        console.log(`[Agent Writer] Optimizing for featured snippets...`);
        let snippetOptimization: SnippetOptimization | null = null;

        if (serpAnalysis.recommendations.snippetOpportunity) {
            try {
                // Note: generateSnippetOptimization expects DetectedSnippet which requires 'url',
                // but serpAnalysis.featuredSnippet doesn't have it, so we pass undefined
                // Also, filter out 'video' type as it's not supported for generation
                const snippetType = serpAnalysis.featuredSnippet?.type;
                const targetFormat: 'paragraph' | 'list' | 'table' =
                    (snippetType === 'paragraph' || snippetType === 'list' || snippetType === 'table')
                        ? snippetType
                        : 'paragraph';

                snippetOptimization = await generateSnippetOptimization(
                    keyword,
                    finalContent,
                    undefined, // currentSnippet - we don't have full DetectedSnippet data
                    targetFormat
                );
            } catch (snippetError) {
                console.warn('[Agent Writer] Snippet optimization failed:', snippetError);
            }
        }

        // Auto-add internal links
        console.log(`[Agent Writer] Generating internal links...`);
        let internalLinks: InternalLinkSuggestion[] = [];

        try {
            // Fetch published articles for internal linking
            const supabase = createServerClient();
            const { data: publishedArticles } = await supabase
                .from('published_articles')
                .select('*')
                .eq('status', 'published')
                .limit(50);

            if (publishedArticles && publishedArticles.length > 0) {
                const linkAnalysis = await generateInternalLinkSuggestions(
                    `temp-${Date.now()}`, // temporary article ID
                    finalContent,
                    {
                        title: step3.metadata?.title || keyword,
                        focusKeyword: keyword,
                        metaDescription: step6.metaDescription
                    },
                    publishedArticles,
                    supabase
                );
                internalLinks = linkAnalysis.suggestions.filter(s => s.relevanceScore >= 70).slice(0, 5);
            }
        } catch (linkError) {
            console.warn('[Agent Writer] Internal linking failed:', linkError);
        }

        // Calculate quality scores
        const qualityScore = calculateQualityScore(step4, step5, step6);
        const humanScore = step5.humanScore || 75;
        const seoScore = step6.seoScore || 0;

        // Build complete article data
        const articleData: ArticleData = {
            step1,
            step2,
            step3,
            step4,
            step5,
            step6,
            step7: {
                timestamp: new Date().toISOString()
            },
            step8: {
                publishStatus: 'draft',
                timestamp: new Date().toISOString()
            },
            currentStep: 8,
            lastUpdated: new Date().toISOString()
        };

        // Save draft to database
        const draftId = `agent-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const { error: saveError } = await supabase
            .from('article_drafts')
            .insert({
                draft_id: draftId,
                data: articleData
            });

        if (saveError) {
            console.error('[Agent Writer] Error saving draft:', saveError);
        }

        console.log(`[Agent Writer] Article writing complete for "${keyword}"`);
        console.log(`[Agent Writer] - Quality Score: ${qualityScore}`);
        console.log(`[Agent Writer] - Human Score: ${humanScore}`);
        console.log(`[Agent Writer] - SEO Score: ${seoScore}`);
        console.log(`[Agent Writer] - Internal Links: ${internalLinks.length}`);

        return {
            articleData,
            draftId,
            status: 'review',
            qualityScore,
            humanScore,
            seoScore
        };

    } catch (error) {
        console.error("[Agent Writer] Error in auto-write:", error);

        return {
            articleData: {} as ArticleData,
            draftId: '',
            status: 'failed',
            qualityScore: 0,
            humanScore: 0,
            seoScore: 0,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}

/**
 * Calculates overall quality score based on multiple factors
 *
 * @param step4 - Article content data
 * @param step5 - Humanization data
 * @param step6 - SEO optimization data
 * @returns Quality score (0-100)
 */
function calculateQualityScore(
    step4: ArticleContent,
    step5: Step5Humanization,
    step6: Step6Optimization
): number {
    // Quality score = weighted average of:
    // - Human score (40%)
    // - SEO score (40%)
    // - Content completeness (20%)

    const humanScore = step5.humanScore || 75;
    const seoScore = step6.seoScore || 0;

    // Content completeness: check word count
    const wordCount = step4.wordCount || 0;
    const completenessScore = Math.min(100, (wordCount / 1500) * 100);

    const qualityScore = Math.round(
        (humanScore * 0.4) +
        (seoScore * 0.4) +
        (completenessScore * 0.2)
    );

    return qualityScore;
}
