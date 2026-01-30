/**
 * API Route: SERP Analysis & Competitor Intelligence
 * POST /api/seo/analyze-serp
 *
 * Analyzes Google SERP for a keyword and performs competitor analysis
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeSERP } from "@/lib/serp-analyzer";
import { analyzeCompetitors } from "@/lib/competitor-analyzer";
import { handleError, getErrorMessage } from "@/lib/error-handler";
import type { SERPAnalysis } from "@/lib/seo-types";

interface AnalyzeSERPRequest {
    keyword: string;
    searchVolume?: number;
    difficulty?: number;
    includeCompetitorAnalysis?: boolean;
}

interface AnalyzeSERPResponse {
    success: boolean;
    data?: SERPAnalysis;
    error?: string;
    timestamp?: string;
}

/**
 * POST handler for SERP analysis
 *
 * Accepts a keyword and returns comprehensive SERP analysis including:
 * - Top 10 ranking articles
 * - Featured snippet data
 * - People Also Ask questions
 * - Related searches
 * - Competitor analysis (word count, headings, topics, content gaps)
 * - Actionable recommendations
 *
 * @example
 * POST /api/seo/analyze-serp
 * {
 *   "keyword": "content marketing strategy",
 *   "searchVolume": 5000,
 *   "difficulty": 65,
 *   "includeCompetitorAnalysis": true
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeSERPResponse>> {
    try {
        // Parse and validate request body
        const body: AnalyzeSERPRequest = await request.json();

        if (!body.keyword || typeof body.keyword !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Keyword is required and must be a string"
                },
                { status: 400 }
            );
        }

        const keyword = body.keyword.trim();

        if (keyword.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Keyword cannot be empty"
                },
                { status: 400 }
            );
        }

        if (keyword.length > 200) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Keyword is too long (max 200 characters)"
                },
                { status: 400 }
            );
        }

        const searchVolume = body.searchVolume ?? 1000;
        const difficulty = body.difficulty ?? 50;
        const includeCompetitorAnalysis = body.includeCompetitorAnalysis ?? true;

        // Perform SERP analysis
        console.log(`[SERP Analysis] Starting analysis for keyword: "${keyword}"`);

        const serpAnalysis = await analyzeSERP(keyword, searchVolume, difficulty);

        console.log(`[SERP Analysis] Found ${serpAnalysis.topRankingArticles.length} ranking articles`);

        // Perform competitor analysis if requested
        if (includeCompetitorAnalysis && serpAnalysis.topRankingArticles.length > 0) {
            console.log(`[Competitor Analysis] Analyzing top ${serpAnalysis.topRankingArticles.length} competitors`);

            try {
                const competitorAnalysis = await analyzeCompetitors(serpAnalysis.topRankingArticles);

                // Enhance recommendations with competitor insights
                serpAnalysis.recommendations = {
                    ...serpAnalysis.recommendations,
                    targetWordCount: competitorAnalysis.medianWordCount,
                    mustHaveTopics: competitorAnalysis.commonTopics.slice(0, 8).map(t => t.topic),
                    suggestedHeadings: competitorAnalysis.commonHeadings.slice(0, 6).map(h => h.heading)
                };

                // Add competitor analysis data to common patterns
                serpAnalysis.commonPatterns = {
                    ...serpAnalysis.commonPatterns,
                    avgWordCount: competitorAnalysis.averageWordCount,
                    commonHeadings: competitorAnalysis.commonHeadings.map(h => h.heading),
                    sharedTopics: competitorAnalysis.commonTopics.map(t => t.topic),
                    contentGaps: competitorAnalysis.contentGaps
                };

                console.log(`[Competitor Analysis] Complete. Average word count: ${competitorAnalysis.averageWordCount}`);

            } catch (competitorError) {
                console.error('[Competitor Analysis] Failed:', competitorError);
                // Continue without competitor analysis rather than failing completely
                console.log('[SERP Analysis] Continuing with basic SERP analysis only');
            }
        }

        console.log(`[SERP Analysis] Complete for keyword: "${keyword}"`);

        return NextResponse.json(
            {
                success: true,
                data: serpAnalysis,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[SERP Analysis] Error:', error);

        const errorMessage = getErrorMessage(error);

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

/**
 * GET handler - returns API documentation
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    return NextResponse.json({
        endpoint: "/api/seo/analyze-serp",
        method: "POST",
        description: "Analyzes Google SERP for a keyword and performs competitor intelligence",
        requestBody: {
            keyword: "string (required) - The target keyword to analyze",
            searchVolume: "number (optional) - Monthly search volume (default: 1000)",
            difficulty: "number (optional) - Keyword difficulty 0-100 (default: 50)",
            includeCompetitorAnalysis: "boolean (optional) - Whether to include deep competitor analysis (default: true)"
        },
        responseFields: {
            keyword: "The analyzed keyword",
            searchVolume: "Monthly search volume",
            difficulty: "Keyword difficulty score",
            topRankingArticles: "Array of top 10 ranking articles with metadata",
            featuredSnippet: "Featured snippet data if present",
            peopleAlsoAsk: "Array of People Also Ask questions",
            relatedSearches: "Array of related search terms",
            commonPatterns: {
                avgWordCount: "Average word count across competitors",
                avgHeadings: "Average number of headings",
                commonHeadings: "Headings appearing in multiple articles",
                sharedTopics: "Topics covered by most competitors",
                contentGaps: "Opportunities to stand out",
                commonContentTypes: "Distribution of content types (article, guide, listicle, etc.)"
            },
            recommendations: {
                targetWordCount: "Recommended word count target",
                mustHaveTopics: "Essential topics to cover",
                suggestedHeadings: "Recommended heading structure",
                contentAngle: "Suggested content approach",
                snippetOpportunity: "Whether there's an opportunity to win the featured snippet"
            },
            analyzedAt: "Timestamp of analysis"
        },
        example: {
            keyword: "content marketing strategy",
            searchVolume: 5000,
            difficulty: 65,
            includeCompetitorAnalysis: true
        },
        notes: [
            "SERP data is fetched in real-time",
            "Competitor analysis includes scraping and parsing top articles",
            "Results are not cached - each request performs fresh analysis",
            "Rate limiting applies - use sparingly in production"
        ]
    });
}
