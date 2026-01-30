/**
 * API Route: Check Current Rankings
 * POST /api/seo/check-rankings
 *
 * Checks current Google rankings for specified keywords and stores results
 */

import { NextRequest, NextResponse } from "next/server";
import { checkGoogleRanking, checkMultipleKeywords, estimateTrafficFromPosition } from "@/lib/rank-checker";
import { handleError, getErrorMessage } from "@/lib/error-handler";
import { createClient } from "@supabase/supabase-js";

interface CheckRankingsRequest {
    keywords: string[];
    url: string;
    articleId?: string;
    location?: string;
    gl?: string;
    hl?: string;
    saveToDatabase?: boolean;
}

interface CheckRankingsResponse {
    success: boolean;
    data?: {
        rankings: Array<{
            keyword: string;
            position: number | null;
            found: boolean;
            searchVolume: number;
            estimatedTraffic: number;
            checkedAt: string;
        }>;
        summary: {
            totalKeywords: number;
            foundKeywords: number;
            notFoundKeywords: number;
            averagePosition: number;
            topTenCount: number;
            totalEstimatedTraffic: number;
        };
    };
    error?: string;
    timestamp?: string;
}

/**
 * POST handler for checking current rankings
 *
 * Checks Google rankings for one or more keywords and optionally saves
 * the results to the database for historical tracking.
 *
 * @example
 * POST /api/seo/check-rankings
 * {
 *   "keywords": ["seo tools", "content marketing"],
 *   "url": "https://example.com/blog/seo-tools",
 *   "articleId": "uuid-here",
 *   "location": "United States",
 *   "gl": "us",
 *   "hl": "en",
 *   "saveToDatabase": true
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<CheckRankingsResponse>> {
    try {
        // Parse and validate request body
        const body: CheckRankingsRequest = await request.json();

        if (!body.keywords || !Array.isArray(body.keywords) || body.keywords.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Keywords array is required and must contain at least one keyword"
                },
                { status: 400 }
            );
        }

        if (!body.url || typeof body.url !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    error: "URL is required and must be a string"
                },
                { status: 400 }
            );
        }

        if (body.keywords.length > 50) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Maximum 50 keywords allowed per request"
                },
                { status: 400 }
            );
        }

        const keywords = body.keywords.map(k => k.trim()).filter(k => k.length > 0);
        const url = body.url.trim();
        const location = body.location || "United States";
        const gl = body.gl || "us";
        const hl = body.hl || "en";
        const saveToDatabase = body.saveToDatabase !== false; // Default to true

        console.log(`[Check Rankings] Checking ${keywords.length} keywords for ${url}`);

        // Check rankings for all keywords
        const results = await checkMultipleKeywords(keywords, url, {
            location,
            gl,
            hl
        });

        // Process results
        const rankings = results.map(result => ({
            keyword: result.keyword,
            position: result.position,
            found: result.found,
            searchVolume: 1000, // TODO: Integrate with keyword research API for actual volume
            estimatedTraffic: result.position
                ? estimateTrafficFromPosition(result.position, 1000)
                : 0,
            checkedAt: result.checkedAt
        }));

        // Calculate summary statistics
        const foundRankings = rankings.filter(r => r.found && r.position !== null);
        const positions = foundRankings.map(r => r.position!);
        const averagePosition = positions.length > 0
            ? positions.reduce((sum, p) => sum + p, 0) / positions.length
            : 0;

        const topTenCount = foundRankings.filter(r => r.position! <= 10).length;
        const totalEstimatedTraffic = rankings.reduce((sum, r) => sum + r.estimatedTraffic, 0);

        const summary = {
            totalKeywords: keywords.length,
            foundKeywords: foundRankings.length,
            notFoundKeywords: keywords.length - foundRankings.length,
            averagePosition: Math.round(averagePosition * 100) / 100,
            topTenCount,
            totalEstimatedTraffic
        };

        // Save to database if requested
        if (saveToDatabase && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            try {
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY
                );

                // Save individual ranking records
                const rankingRecords = rankings
                    .filter(r => r.found && r.position !== null)
                    .map(r => ({
                        article_id: body.articleId || null,
                        keyword: r.keyword,
                        position: r.position,
                        url: url,
                        search_volume: r.searchVolume,
                        estimated_traffic: r.estimatedTraffic,
                        location: location,
                        checked_at: r.checkedAt
                    }));

                if (rankingRecords.length > 0) {
                    const { error: insertError } = await supabase
                        .from('keyword_rankings')
                        .insert(rankingRecords);

                    if (insertError) {
                        console.error('[Check Rankings] Database save error:', insertError);
                    } else {
                        console.log(`[Check Rankings] Saved ${rankingRecords.length} ranking records to database`);
                    }
                }

                // Save ranking snapshot
                if (body.articleId) {
                    const { error: snapshotError } = await supabase
                        .from('ranking_snapshots')
                        .insert({
                            article_id: body.articleId,
                            total_keywords: summary.totalKeywords,
                            found_keywords: summary.foundKeywords,
                            average_position: summary.averagePosition,
                            top_ten_count: summary.topTenCount,
                            estimated_traffic: summary.totalEstimatedTraffic,
                            checked_at: new Date().toISOString()
                        });

                    if (snapshotError) {
                        console.error('[Check Rankings] Snapshot save error:', snapshotError);
                    }
                }

            } catch (dbError) {
                console.error('[Check Rankings] Database error:', dbError);
                // Continue even if database save fails
            }
        }

        console.log(`[Check Rankings] Complete. Found ${foundRankings.length}/${keywords.length} keywords`);

        return NextResponse.json(
            {
                success: true,
                data: {
                    rankings,
                    summary
                },
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Check Rankings] Error:', error);

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
        endpoint: "/api/seo/check-rankings",
        method: "POST",
        description: "Checks current Google rankings for specified keywords and optionally saves to database",
        requestBody: {
            keywords: "string[] (required) - Array of keywords to check (max 50)",
            url: "string (required) - The URL to find in search results",
            articleId: "string (optional) - Article ID for database association",
            location: "string (optional) - Geographic location (default: 'United States')",
            gl: "string (optional) - Google country code (default: 'us')",
            hl: "string (optional) - Language code (default: 'en')",
            saveToDatabase: "boolean (optional) - Whether to save results to database (default: true)"
        },
        responseFields: {
            rankings: "Array of ranking results for each keyword",
            summary: {
                totalKeywords: "Total number of keywords checked",
                foundKeywords: "Number of keywords found in results",
                notFoundKeywords: "Number of keywords not found",
                averagePosition: "Average ranking position",
                topTenCount: "Number of keywords in top 10",
                totalEstimatedTraffic: "Total estimated monthly traffic"
            }
        },
        example: {
            keywords: ["seo tools", "content marketing", "keyword research"],
            url: "https://example.com/blog/seo-tools",
            articleId: "123e4567-e89b-12d3-a456-426614174000",
            location: "United States",
            gl: "us",
            hl: "en",
            saveToDatabase: true
        },
        notes: [
            "Rankings are checked in real-time against Google",
            "Large keyword lists may take several minutes to process",
            "Rate limiting is applied to avoid API blocks",
            "Results are automatically saved to database if configured",
            "Search volume data requires integration with keyword research API"
        ]
    });
}
