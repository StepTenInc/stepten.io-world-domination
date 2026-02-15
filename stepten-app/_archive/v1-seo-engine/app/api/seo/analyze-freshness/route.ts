import { NextRequest, NextResponse } from "next/server";
import { analyzeFreshness } from "@/lib/freshness-analyzer";
import { generateRefreshAnalysis } from "@/lib/refresh-suggester";
import { RefreshAnalysis, RankingData } from "@/lib/seo-types";

/**
 * Request body for freshness analysis
 */
interface AnalyzeFreshnessRequest {
  articleId: string;
  articleSlug: string;
  articleContent: string;
  keyword: string;
  publishedAt: string;
  lastUpdated: string;
  currentRankings?: RankingData[];
}

/**
 * Response for freshness analysis
 */
interface AnalyzeFreshnessResponse {
  refreshAnalysis: RefreshAnalysis;
  summary: {
    freshnessScore: number;
    needsRefresh: boolean;
    refreshPriority: "urgent" | "high" | "medium" | "low";
    ageInMonths: number;
    outdatedItemsCount: number;
    highPriorityUpdates: number;
    estimatedRefreshTime: string;
  };
}

/**
 * POST /api/seo/analyze-freshness
 *
 * Analyzes article content for freshness and generates refresh recommendations
 * Detects outdated statistics, dates, technologies, and suggests updates
 *
 * Request Body:
 * - articleId: Unique identifier for the article
 * - articleSlug: URL slug of the article
 * - articleContent: HTML content of the article
 * - keyword: Main keyword/topic of the article
 * - publishedAt: ISO date string of original publication
 * - lastUpdated: ISO date string of last update
 * - currentRankings: Optional array of current ranking data
 *
 * Response:
 * - refreshAnalysis: Complete RefreshAnalysis with recommendations
 * - summary: Quick metrics for dashboard display
 *
 * @example
 * POST /api/seo/analyze-freshness
 * {
 *   "articleId": "abc123",
 *   "articleSlug": "react-hooks-guide",
 *   "articleContent": "<h1>React Hooks Guide</h1>...",
 *   "keyword": "React hooks tutorial",
 *   "publishedAt": "2022-06-15T00:00:00Z",
 *   "lastUpdated": "2023-01-10T00:00:00Z",
 *   "currentRankings": [...]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: AnalyzeFreshnessRequest = await request.json();
    const {
      articleId,
      articleSlug,
      articleContent,
      keyword,
      publishedAt,
      lastUpdated,
      currentRankings = [],
    } = body;

    // Validate required fields
    if (!articleId || typeof articleId !== "string") {
      return NextResponse.json(
        {
          error: "Missing or invalid 'articleId' field",
          details: "articleId must be a non-empty string",
        },
        { status: 400 }
      );
    }

    if (!articleSlug || typeof articleSlug !== "string") {
      return NextResponse.json(
        {
          error: "Missing or invalid 'articleSlug' field",
          details: "articleSlug must be a non-empty string",
        },
        { status: 400 }
      );
    }

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

    if (!publishedAt || typeof publishedAt !== "string") {
      return NextResponse.json(
        {
          error: "Missing or invalid 'publishedAt' field",
          details: "publishedAt must be an ISO date string",
        },
        { status: 400 }
      );
    }

    if (!lastUpdated || typeof lastUpdated !== "string") {
      return NextResponse.json(
        {
          error: "Missing or invalid 'lastUpdated' field",
          details: "lastUpdated must be an ISO date string",
        },
        { status: 400 }
      );
    }

    // Validate dates
    const publishDate = new Date(publishedAt);
    const updateDate = new Date(lastUpdated);

    if (isNaN(publishDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid 'publishedAt' date format",
          details: "publishedAt must be a valid ISO date string",
        },
        { status: 400 }
      );
    }

    if (isNaN(updateDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid 'lastUpdated' date format",
          details: "lastUpdated must be a valid ISO date string",
        },
        { status: 400 }
      );
    }

    // Validate content length
    if (articleContent.trim().length < 100) {
      return NextResponse.json(
        {
          error: "Article content too short",
          details: "Article must be at least 100 characters long for meaningful analysis",
        },
        { status: 400 }
      );
    }

    // Validate rankings if provided
    if (currentRankings && !Array.isArray(currentRankings)) {
      return NextResponse.json(
        {
          error: "Invalid 'currentRankings' field",
          details: "currentRankings must be an array of RankingData objects",
        },
        { status: 400 }
      );
    }

    // Step 1: Analyze content freshness
    const freshnessAnalysis = analyzeFreshness(articleContent, lastUpdated);

    // Step 2: Generate refresh recommendations
    const refreshAnalysis = generateRefreshAnalysis(
      articleId,
      articleSlug,
      publishedAt,
      lastUpdated,
      articleContent,
      keyword,
      currentRankings,
      freshnessAnalysis
    );

    // Calculate summary metrics
    const highPriorityUpdates = refreshAnalysis.suggestedUpdates.filter(
      (update) => update.priority >= 8
    ).length;

    // Estimate refresh time based on number of updates and complexity
    const totalUpdates = refreshAnalysis.suggestedUpdates.length;
    let estimatedHours = 0;

    if (refreshAnalysis.refreshPriority === "urgent") {
      estimatedHours = Math.max(4, totalUpdates * 0.5);
    } else if (refreshAnalysis.refreshPriority === "high") {
      estimatedHours = Math.max(3, totalUpdates * 0.4);
    } else if (refreshAnalysis.refreshPriority === "medium") {
      estimatedHours = Math.max(2, totalUpdates * 0.3);
    } else {
      estimatedHours = Math.max(1, totalUpdates * 0.2);
    }

    const estimatedRefreshTime =
      estimatedHours < 2
        ? `${Math.round(estimatedHours * 60)} minutes`
        : estimatedHours < 8
          ? `${Math.round(estimatedHours)} hours`
          : `${Math.round(estimatedHours / 8)} day${estimatedHours >= 16 ? "s" : ""}`;

    // Prepare summary
    const summary = {
      freshnessScore: freshnessAnalysis.freshnessScore.score,
      needsRefresh: refreshAnalysis.needsRefresh,
      refreshPriority: refreshAnalysis.refreshPriority,
      ageInMonths: refreshAnalysis.ageInMonths,
      outdatedItemsCount: freshnessAnalysis.outdatedItems.length,
      highPriorityUpdates,
      estimatedRefreshTime,
    };

    // Prepare response
    const response: AnalyzeFreshnessResponse = {
      refreshAnalysis,
      summary,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Freshness analysis error:", error);

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

    if (error.message?.includes("date") || error.message?.includes("Date")) {
      return NextResponse.json(
        {
          error: "Date parsing error",
          details: "One or more date fields contain invalid format",
        },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Freshness analysis failed",
        details: error.message || "An unexpected error occurred during analysis",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/seo/analyze-freshness
 *
 * Returns API documentation and usage information
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: "Content Freshness Analysis API",
    version: "1.0.0",
    description:
      "Analyzes article content for freshness, detects outdated information, and generates refresh recommendations",
    endpoints: {
      POST: {
        description: "Analyze article freshness and generate refresh recommendations",
        requestBody: {
          articleId: "string (required) - Unique identifier for the article",
          articleSlug: "string (required) - URL slug of the article",
          articleContent: "string (required) - HTML content of the article",
          keyword: "string (required) - Main keyword/topic of the article",
          publishedAt: "string (required) - ISO date string of publication",
          lastUpdated: "string (required) - ISO date string of last update",
          currentRankings: "RankingData[] (optional) - Current ranking data for the article",
        },
        response: {
          refreshAnalysis: "RefreshAnalysis object with complete recommendations",
          summary: "object - Quick metrics summary for dashboard",
        },
        example: {
          request: {
            articleId: "abc123",
            articleSlug: "react-hooks-guide",
            articleContent: "<h1>React Hooks Guide</h1><p>As of 2022, React hooks...</p>",
            keyword: "React hooks tutorial",
            publishedAt: "2022-06-15T00:00:00Z",
            lastUpdated: "2023-01-10T00:00:00Z",
            currentRankings: [
              {
                keyword: "react hooks",
                position: 8,
                previousPosition: 5,
                change: 3,
                url: "https://example.com/react-hooks-guide",
                searchVolume: 12000,
                estimatedTraffic: 450,
                checkedAt: "2026-01-15T00:00:00Z",
              },
            ],
          },
          response: {
            refreshAnalysis: {
              articleId: "abc123",
              articleSlug: "react-hooks-guide",
              publishedAt: "2022-06-15T00:00:00Z",
              lastUpdated: "2023-01-10T00:00:00Z",
              ageInMonths: 36,
              needsRefresh: true,
              refreshPriority: "high",
              reasons: [
                "Content is 36 months old",
                "Low freshness score: 45/100",
                "Contains 8 outdated reference(s)",
              ],
              suggestedUpdates: [
                {
                  type: "stats",
                  description: "Add 2026 usage statistics or market data",
                  priority: 9,
                },
                {
                  type: "content",
                  description: "Update section on useState Hook with current examples",
                  priority: 8,
                },
              ],
              currentRankings: "...",
              rankingDecline: 0.3,
              competitorChanges: {
                newCompetitors: 0,
                contentUpdates: 0,
              },
              outdatedInfo: [
                {
                  section: "Introduction",
                  content: "2022",
                  reason: "Referenced year is 4 years old",
                },
              ],
            },
            summary: {
              freshnessScore: 45,
              needsRefresh: true,
              refreshPriority: "high",
              ageInMonths: 36,
              outdatedItemsCount: 8,
              highPriorityUpdates: 4,
              estimatedRefreshTime: "4 hours",
            },
          },
        },
      },
    },
    features: [
      "Detects outdated years, dates, and temporal references",
      "Identifies stale statistics and numerical data",
      "Flags outdated technology versions and product names",
      "Analyzes ranking decline and traffic impact",
      "Generates section-specific update recommendations",
      "Suggests new sections based on content gaps",
      "Recommends fresh statistics and data sources",
      "Calculates refresh priority (urgent/high/medium/low)",
      "Estimates time required for content refresh",
    ],
    errors: {
      400: "Bad Request - Invalid or missing required fields",
      500: "Internal Server Error - Server error during analysis",
    },
    rateLimits: {
      recommendation:
        "Can be called as frequently as needed - no external API dependencies",
    },
    bestPractices: [
      "Run freshness analysis every 3-6 months for active content",
      "Prioritize 'urgent' and 'high' priority articles first",
      "Update statistics with current year data when refreshing",
      "Review and update all outdated technology references",
      "Consider adding new sections suggested by the analysis",
      "Update meta descriptions to include current year",
      "Verify external links still work after refresh",
    ],
  });
}
