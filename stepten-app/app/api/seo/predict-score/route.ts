/**
 * API Route: Content Score Predictor
 * POST /api/seo/predict-score
 *
 * Analyzes article content and predicts performance, ranking potential, and traffic
 */

import { NextRequest, NextResponse } from "next/server";
import { predictContentScore, compareArticles } from "@/lib/score-predictor";
import { getErrorMessage } from "@/lib/error-handler";
import type { ContentScorePrediction } from "@/lib/seo-types";

interface PredictScoreRequest {
    content: string;
    keyword: string;
    title?: string;
    metaDescription?: string;
    url?: string;
    competitorData?: {
        avgWordCount: number;
        avgHeadings: number;
    };
}

interface CompareArticlesRequest {
    articles: Array<{
        content: string;
        keyword: string;
        title: string;
        metaDescription: string;
        url: string;
    }>;
}

interface PredictScoreResponse {
    success: boolean;
    data?: ContentScorePrediction;
    error?: string;
    timestamp?: string;
}

interface CompareArticlesResponse {
    success: boolean;
    data?: {
        predictions: ContentScorePrediction[];
        bestPerformer: number;
        averageScore: number;
        recommendations: string[];
    };
    error?: string;
    timestamp?: string;
}

/**
 * POST handler for content score prediction
 *
 * Analyzes article content and provides comprehensive performance prediction including:
 * - Overall quality score (0-100) with letter grade
 * - Ranking prediction for target keyword
 * - Traffic prediction with confidence intervals
 * - Feature scores (readability, SEO, content quality, engagement, competitiveness)
 * - Top strengths and weaknesses
 * - Actionable improvement recommendations
 * - Model metadata and confidence metrics
 *
 * @example
 * POST /api/seo/predict-score
 * {
 *   "content": "<html>...</html>",
 *   "keyword": "content marketing",
 *   "title": "The Ultimate Guide to Content Marketing",
 *   "metaDescription": "Learn proven content marketing strategies...",
 *   "url": "https://example.com/content-marketing-guide",
 *   "competitorData": {
 *     "avgWordCount": 2500,
 *     "avgHeadings": 12
 *   }
 * }
 */
export async function POST(
    request: NextRequest
): Promise<NextResponse<PredictScoreResponse | CompareArticlesResponse>> {
    try {
        // Parse and validate request body
        const body = await request.json();

        // Check if this is a comparison request
        if ('articles' in body) {
            return handleCompareArticles(body as CompareArticlesRequest);
        }

        // Handle single article prediction
        return handlePredictScore(body as PredictScoreRequest);

    } catch (error: unknown) {
        console.error('[Predict Score] Error:', error);

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
 * Handle single article prediction
 */
async function handlePredictScore(
    body: PredictScoreRequest
): Promise<NextResponse<PredictScoreResponse>> {
    // Validate required fields
    if (!body.content || typeof body.content !== "string") {
        return NextResponse.json(
            {
                success: false,
                error: "Content is required and must be a string"
            },
            { status: 400 }
        );
    }

    if (!body.keyword || typeof body.keyword !== "string") {
        return NextResponse.json(
            {
                success: false,
                error: "Keyword is required and must be a string"
            },
            { status: 400 }
        );
    }

    const content = body.content.trim();
    const keyword = body.keyword.trim();

    if (content.length === 0) {
        return NextResponse.json(
            {
                success: false,
                error: "Content cannot be empty"
            },
            { status: 400 }
        );
    }

    if (keyword.length === 0) {
        return NextResponse.json(
            {
                success: false,
                error: "Keyword cannot be empty"
            },
            { status: 400 }
        );
    }

    if (content.length < 100) {
        return NextResponse.json(
            {
                success: false,
                error: "Content is too short for meaningful analysis (minimum 100 characters)"
            },
            { status: 400 }
        );
    }

    if (keyword.length > 100) {
        return NextResponse.json(
            {
                success: false,
                error: "Keyword is too long (maximum 100 characters)"
            },
            { status: 400 }
        );
    }

    // Extract optional fields
    const title = body.title?.trim() || '';
    const metaDescription = body.metaDescription?.trim() || '';
    const url = body.url?.trim() || '';
    const competitorData = body.competitorData;

    console.log(`[Content Score Predictor] Starting prediction for keyword: "${keyword}"`);
    console.log(`[Content Score Predictor] Content length: ${content.length} characters`);

    // Perform prediction
    const prediction = await predictContentScore(
        content,
        keyword,
        title,
        metaDescription,
        url,
        competitorData
    );

    console.log(`[Content Score Predictor] Complete. Score: ${prediction.overallScore}/100 (${prediction.qualityGrade})`);
    console.log(`[Content Score Predictor] Predicted ranking: Position ${prediction.rankingPotential.predictedPosition}`);
    console.log(`[Content Score Predictor] Traffic estimate: ${prediction.trafficPrediction.estimatedMonthlyVisits} monthly visits`);

    return NextResponse.json(
        {
            success: true,
            data: prediction,
            timestamp: new Date().toISOString()
        },
        { status: 200 }
    );
}

/**
 * Handle multiple article comparison
 */
async function handleCompareArticles(
    body: CompareArticlesRequest
): Promise<NextResponse<CompareArticlesResponse>> {
    // Validate articles array
    if (!Array.isArray(body.articles)) {
        return NextResponse.json(
            {
                success: false,
                error: "Articles must be an array"
            },
            { status: 400 }
        );
    }

    if (body.articles.length === 0) {
        return NextResponse.json(
            {
                success: false,
                error: "Articles array cannot be empty"
            },
            { status: 400 }
        );
    }

    if (body.articles.length > 10) {
        return NextResponse.json(
            {
                success: false,
                error: "Cannot compare more than 10 articles at once"
            },
            { status: 400 }
        );
    }

    // Validate each article
    for (let i = 0; i < body.articles.length; i++) {
        const article = body.articles[i];

        if (!article.content || typeof article.content !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    error: `Article ${i + 1}: Content is required and must be a string`
                },
                { status: 400 }
            );
        }

        if (!article.keyword || typeof article.keyword !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    error: `Article ${i + 1}: Keyword is required and must be a string`
                },
                { status: 400 }
            );
        }
    }

    console.log(`[Article Comparison] Comparing ${body.articles.length} articles`);

    // Perform comparison
    const comparison = await compareArticles(body.articles);

    console.log(`[Article Comparison] Complete. Best performer: Article ${comparison.bestPerformer + 1}`);
    console.log(`[Article Comparison] Average score: ${Math.round(comparison.averageScore)}/100`);

    return NextResponse.json(
        {
            success: true,
            data: comparison,
            timestamp: new Date().toISOString()
        },
        { status: 200 }
    );
}

/**
 * GET handler - returns API documentation
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    return NextResponse.json({
        endpoint: "/api/seo/predict-score",
        method: "POST",
        description: "Predicts article performance using ML-based content analysis",
        requestBody: {
            single: {
                content: "string (required) - HTML content of the article",
                keyword: "string (required) - Target keyword for ranking",
                title: "string (optional) - Article title",
                metaDescription: "string (optional) - Meta description",
                url: "string (optional) - Article URL",
                competitorData: {
                    avgWordCount: "number (optional) - Average competitor word count",
                    avgHeadings: "number (optional) - Average competitor headings"
                }
            },
            comparison: {
                articles: "array (required) - Array of articles to compare (max 10)",
                articleStructure: {
                    content: "string (required) - HTML content",
                    keyword: "string (required) - Target keyword",
                    title: "string (required) - Article title",
                    metaDescription: "string (required) - Meta description",
                    url: "string (required) - Article URL"
                }
            }
        },
        responseFields: {
            overallScore: "Number 0-100 - Overall content quality score",
            qualityGrade: "Letter grade - A+, A, B+, B, C, D, F",
            rankingPotential: {
                keyword: "Target keyword",
                predictedPosition: "Predicted SERP position (1-100)",
                confidenceScore: "Prediction confidence (0-100)",
                timeframe: "Estimated time to achieve ranking",
                factors: "Breakdown of ranking factors with scores",
                recommendations: "Top 5 recommendations for improving ranking"
            },
            featureScores: {
                readability: "Score, grade, and recommendation",
                seoOptimization: "Score, grade, and recommendation",
                contentQuality: "Score, grade, and recommendation",
                engagement: "Score, grade, and recommendation",
                competitiveness: "Score, grade, and recommendation"
            },
            topStrengths: "Array of top 10 content strengths",
            topWeaknesses: "Array of top 10 weaknesses with improvement suggestions",
            trafficPrediction: {
                estimatedMonthlyVisits: "Predicted monthly organic visits",
                confidenceInterval: "Lower and upper bound estimates",
                timeToRank: "Time needed to achieve ranking",
                peakTrafficMonth: "Month when traffic peaks"
            },
            modelMetadata: {
                modelVersion: "ML model version used",
                trainingAccuracy: "Model accuracy baseline",
                confidence: "Overall prediction confidence",
                featuresUsed: "Number of features analyzed",
                predictionDate: "Timestamp of prediction"
            },
            improvements: "Prioritized action items with expected score increases"
        },
        features: [
            "50+ content quality metrics extracted and analyzed",
            "Readability scores: Flesch, Flesch-Kincaid, SMOG, Coleman-Liau, ARI",
            "Keyword optimization analysis",
            "Content structure and formatting evaluation",
            "Link quality and quantity assessment",
            "Engagement and multimedia analysis",
            "Competitive positioning",
            "Traffic and ranking predictions",
            "Actionable improvement recommendations"
        ],
        examples: {
            singleArticle: {
                content: "<html><h1>Complete Guide to SEO</h1><p>SEO is...</p></html>",
                keyword: "SEO guide",
                title: "Complete Guide to SEO in 2025",
                metaDescription: "Learn everything about SEO with our comprehensive guide",
                url: "https://example.com/seo-guide"
            },
            multipleArticles: {
                articles: [
                    {
                        content: "<html>...</html>",
                        keyword: "content marketing",
                        title: "Content Marketing Guide",
                        metaDescription: "Learn content marketing",
                        url: "https://example.com/article-1"
                    },
                    {
                        content: "<html>...</html>",
                        keyword: "content marketing",
                        title: "Content Marketing Strategy",
                        metaDescription: "Content marketing tips",
                        url: "https://example.com/article-2"
                    }
                ]
            }
        },
        notes: [
            "Predictions are based on content analysis and industry benchmarks",
            "Actual ranking depends on many external factors (domain authority, backlinks, competition)",
            "Use predictions as guidance for content optimization",
            "Traffic estimates assume moderate search volume - adjust based on actual keyword data",
            "Minimum content length: 100 characters for analysis",
            "Maximum keyword length: 100 characters",
            "Article comparison limited to 10 articles per request",
            "Model version: 1.0.0 (heuristic-based, ML training in progress)"
        ]
    });
}
