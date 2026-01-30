import { NextRequest, NextResponse } from "next/server";
import { analyzeTopicCoverage, generateCoverageRecommendations } from "@/lib/topic-coverage";
import { TopicCoverage } from "@/lib/seo-types";

/**
 * Request body for entity analysis
 */
interface AnalyzeEntitiesRequest {
  articleContent: string;
  keyword: string;
  competitorArticles?: string[];
}

/**
 * Response for entity analysis
 */
interface AnalyzeEntitiesResponse {
  topicCoverage: TopicCoverage;
  recommendations: string[];
  summary: {
    completeness: number;
    competitorAverage: number;
    scoreGap: number;
    totalEntities: number;
    missingEntities: number;
    totalSubtopics: number;
    missingSubtopics: number;
    totalKeywords: number;
    missingKeywords: number;
  };
}

/**
 * POST /api/seo/analyze-entities
 *
 * Analyzes article content for entity coverage and topic completeness
 * Compares against competitor articles to identify content gaps
 *
 * Request Body:
 * - articleContent: HTML content of your article
 * - keyword: Main keyword/topic for the article
 * - competitorArticles: Optional array of competitor article HTML (max 5)
 *
 * Response:
 * - topicCoverage: Complete TopicCoverage analysis
 * - recommendations: Array of actionable improvement suggestions
 * - summary: Quick metrics for dashboard display
 *
 * @example
 * POST /api/seo/analyze-entities
 * {
 *   "articleContent": "<h1>React Hooks Guide</h1>...",
 *   "keyword": "React hooks tutorial",
 *   "competitorArticles": ["<article>...</article>", ...]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: AnalyzeEntitiesRequest = await request.json();
    const { articleContent, keyword, competitorArticles = [] } = body;

    // Validate required fields
    if (!articleContent || typeof articleContent !== "string") {
      return NextResponse.json(
        {
          error: "Missing or invalid 'articleContent' field",
          details: "articleContent must be a non-empty string containing HTML content",
        },
        { status: 400 }
      );
    }

    if (!keyword || typeof keyword !== "string") {
      return NextResponse.json(
        {
          error: "Missing or invalid 'keyword' field",
          details: "keyword must be a non-empty string",
        },
        { status: 400 }
      );
    }

    // Validate competitor articles
    if (competitorArticles && !Array.isArray(competitorArticles)) {
      return NextResponse.json(
        {
          error: "Invalid 'competitorArticles' field",
          details: "competitorArticles must be an array of HTML strings",
        },
        { status: 400 }
      );
    }

    // Validate article content length
    if (articleContent.trim().length < 100) {
      return NextResponse.json(
        {
          error: "Article content too short",
          details: "Article must be at least 100 characters long",
        },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          error: "Google AI API key not configured",
          details: "Server is not properly configured. Contact administrator.",
        },
        { status: 500 }
      );
    }

    // Perform topic coverage analysis
    const topicCoverage = await analyzeTopicCoverage(
      articleContent,
      keyword,
      competitorArticles
    );

    // Generate actionable recommendations
    const recommendations = generateCoverageRecommendations(topicCoverage);

    // Calculate summary metrics
    const missingEntities = topicCoverage.entities.filter(
      (e) => e.coverage === "missing" && e.competitorMentions >= 2
    ).length;

    const missingSubtopics = topicCoverage.requiredSubtopics.filter(
      (s) => !s.covered
    ).length;

    const missingKeywords = topicCoverage.semanticKeywords.filter(
      (k) => !k.present && k.relevance >= 60
    ).length;

    const scoreGap = topicCoverage.completeness - topicCoverage.competitorAverage;

    const summary = {
      completeness: topicCoverage.completeness,
      competitorAverage: topicCoverage.competitorAverage,
      scoreGap: Math.round(scoreGap),
      totalEntities: topicCoverage.entities.length,
      missingEntities,
      totalSubtopics: topicCoverage.requiredSubtopics.length,
      missingSubtopics,
      totalKeywords: topicCoverage.semanticKeywords.length,
      missingKeywords,
    };

    // Prepare response
    const response: AnalyzeEntitiesResponse = {
      topicCoverage,
      recommendations,
      summary,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Entity analysis error:", error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: error.message,
        },
        { status: 400 }
      );
    }

    if (error.message?.includes("API key")) {
      return NextResponse.json(
        {
          error: "API authentication failed",
          details: "Invalid or missing API key",
        },
        { status: 401 }
      );
    }

    if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      return NextResponse.json(
        {
          error: "API rate limit exceeded",
          details: "Please try again in a few moments",
        },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Entity analysis failed",
        details: error.message || "An unexpected error occurred during analysis",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo/analyze-entities
 *
 * Returns API documentation and usage information
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: "Entity & Topic Coverage Analysis API",
    version: "1.0.0",
    description:
      "Analyzes article content for NLP entities, semantic keywords, and topic completeness",
    endpoints: {
      POST: {
        description: "Analyze article entity coverage and topic completeness",
        requestBody: {
          articleContent: "string (required) - HTML content of your article",
          keyword: "string (required) - Main keyword/topic",
          competitorArticles: "string[] (optional) - Array of competitor article HTML (max 5)",
        },
        response: {
          topicCoverage: "TopicCoverage object with complete analysis",
          recommendations: "string[] - Actionable improvement suggestions",
          summary: "object - Quick metrics summary",
        },
        example: {
          request: {
            articleContent: "<h1>React Hooks Guide</h1><p>React hooks are...</p>",
            keyword: "React hooks tutorial",
            competitorArticles: ["<article>Competitor 1 content...</article>"],
          },
          response: {
            topicCoverage: {
              mainTopic: "React hooks tutorial",
              completeness: 78,
              competitorAverage: 72,
              entities: "...",
              requiredSubtopics: "...",
              semanticKeywords: "...",
            },
            recommendations: [
              "Add sections on: useEffect, useState, custom hooks",
              "Mention important entities: React DevTools, hooks API",
            ],
            summary: {
              completeness: 78,
              competitorAverage: 72,
              scoreGap: 6,
              totalEntities: 15,
              missingEntities: 3,
            },
          },
        },
      },
    },
    errors: {
      400: "Bad Request - Invalid or missing required fields",
      401: "Unauthorized - API authentication failed",
      429: "Too Many Requests - Rate limit exceeded",
      500: "Internal Server Error - Server error during analysis",
    },
    rateLimits: {
      requests: "Depends on Google AI API quota",
      recommendation: "Cache results and avoid analyzing the same content repeatedly",
    },
  });
}
