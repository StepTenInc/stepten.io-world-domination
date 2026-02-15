/**
 * API Route: Ranking History
 * GET /api/seo/ranking-history
 *
 * Retrieves historical ranking data and performs trend analysis
 */

import { NextRequest, NextResponse } from "next/server";
import {
    calculatePositionChanges,
    analyzeRankingTrend,
    generateRankingReport,
    type RankingHistory
} from "@/lib/rank-analyzer";
import { getErrorMessage } from "@/lib/error-handler";
import { createClient } from "@supabase/supabase-js";

interface RankingHistoryResponse {
    success: boolean;
    data?: {
        history?: RankingHistory;
        changes?: {
            daily: any;
            weekly: any;
            monthly: any;
        };
        trend?: any;
        report?: any;
        keywords?: any[]; // For batch keyword analysis
    };
    error?: string;
    timestamp?: string;
}

/**
 * GET handler for retrieving ranking history
 *
 * Retrieves historical ranking data from the database and performs
 * comprehensive analysis including position changes, trends, and reports.
 *
 * Query Parameters:
 * - articleId: Article UUID (optional)
 * - keyword: Specific keyword to analyze (optional)
 * - days: Number of days of history to retrieve (default: 30)
 * - analysis: Type of analysis ('changes', 'trend', 'report', 'all') (default: 'all')
 *
 * @example
 * GET /api/seo/ranking-history?articleId=uuid&days=30&analysis=all
 * GET /api/seo/ranking-history?keyword=seo+tools&days=90&analysis=trend
 */
export async function GET(request: NextRequest): Promise<NextResponse<RankingHistoryResponse>> {
    try {
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const articleId = searchParams.get('articleId');
        const keyword = searchParams.get('keyword');
        const days = parseInt(searchParams.get('days') || '30', 10);
        const analysis = searchParams.get('analysis') || 'all';

        // Validate parameters
        if (!articleId && !keyword) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Either articleId or keyword parameter is required"
                },
                { status: 400 }
            );
        }

        if (days < 1 || days > 365) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Days parameter must be between 1 and 365"
                },
                { status: 400 }
            );
        }

        // Initialize Supabase client
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Database not configured"
                },
                { status: 500 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        console.log(`[Ranking History] Fetching history for ${articleId ? 'article ' + articleId : 'keyword ' + keyword}`);

        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Build query
        let query = supabase
            .from('keyword_rankings')
            .select('*')
            .gte('checked_at', startDate.toISOString())
            .order('checked_at', { ascending: true });

        if (articleId) {
            query = query.eq('article_id', articleId);
        }

        if (keyword) {
            query = query.eq('keyword', keyword);
        }

        const { data: rankings, error: fetchError } = await query;

        if (fetchError) {
            throw new Error(`Database query failed: ${fetchError.message}`);
        }

        if (!rankings || rankings.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No ranking history found for the specified criteria"
                },
                { status: 404 }
            );
        }

        console.log(`[Ranking History] Found ${rankings.length} ranking records`);

        // Process data based on requested analysis type
        if (keyword) {
            // Single keyword analysis
            const history: RankingHistory = {
                keyword,
                url: rankings[0].url,
                history: rankings.map(r => ({
                    position: r.position,
                    checkedAt: r.checked_at,
                    searchVolume: r.search_volume || 1000,
                    estimatedTraffic: r.estimated_traffic || 0
                }))
            };

            const responseData: any = { history };

            if (analysis === 'changes' || analysis === 'all') {
                responseData.changes = calculatePositionChanges(history);
                console.log('[Ranking History] Calculated position changes');
            }

            if (analysis === 'trend' || analysis === 'all') {
                responseData.trend = analyzeRankingTrend(history, 'month');
                console.log('[Ranking History] Analyzed ranking trend');
            }

            return NextResponse.json(
                {
                    success: true,
                    data: responseData,
                    timestamp: new Date().toISOString()
                },
                { status: 200 }
            );

        } else {
            // Multiple keywords (article-based) analysis
            // Group rankings by keyword
            const keywordGroups = new Map<string, typeof rankings>();

            for (const ranking of rankings) {
                const kw = ranking.keyword;
                if (!keywordGroups.has(kw)) {
                    keywordGroups.set(kw, []);
                }
                keywordGroups.get(kw)!.push(ranking);
            }

            // Create history objects for each keyword
            const histories: RankingHistory[] = [];

            for (const [kw, rankingData] of keywordGroups.entries()) {
                histories.push({
                    keyword: kw,
                    url: rankingData[0].url,
                    history: rankingData.map(r => ({
                        position: r.position,
                        checkedAt: r.checked_at,
                        searchVolume: r.search_volume || 1000,
                        estimatedTraffic: r.estimated_traffic || 0
                    }))
                });
            }

            if (analysis === 'report' || analysis === 'all') {
                const report = generateRankingReport(histories);
                console.log('[Ranking History] Generated comprehensive ranking report');

                return NextResponse.json(
                    {
                        success: true,
                        data: { report },
                        timestamp: new Date().toISOString()
                    },
                    { status: 200 }
                );
            } else {
                // Return individual analyses for each keyword
                const keywordAnalyses = histories.map(history => {
                    const result: any = { keyword: history.keyword };

                    if (analysis === 'changes' || analysis === 'all') {
                        result.changes = calculatePositionChanges(history);
                    }

                    if (analysis === 'trend' || analysis === 'all') {
                        result.trend = analyzeRankingTrend(history, 'month');
                    }

                    return result;
                });

                return NextResponse.json(
                    {
                        success: true,
                        data: { keywords: keywordAnalyses },
                        timestamp: new Date().toISOString()
                    },
                    { status: 200 }
                );
            }
        }

    } catch (error: unknown) {
        console.error('[Ranking History] Error:', error);

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
 * POST handler for batch history retrieval
 *
 * Retrieves ranking history for multiple keywords at once
 *
 * @example
 * POST /api/seo/ranking-history
 * {
 *   "keywords": ["seo tools", "content marketing"],
 *   "days": 30,
 *   "analysis": "all"
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<RankingHistoryResponse>> {
    try {
        const body = await request.json();

        if (!body.keywords || !Array.isArray(body.keywords) || body.keywords.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Keywords array is required"
                },
                { status: 400 }
            );
        }

        const keywords = body.keywords;
        const days = body.days || 30;
        const analysis = body.analysis || 'all';

        if (keywords.length > 100) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Maximum 100 keywords allowed per request"
                },
                { status: 400 }
            );
        }

        // Initialize Supabase client
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Database not configured"
                },
                { status: 500 }
            );
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        console.log(`[Ranking History] Batch fetching history for ${keywords.length} keywords`);

        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Fetch all rankings for specified keywords
        const { data: rankings, error: fetchError } = await supabase
            .from('keyword_rankings')
            .select('*')
            .in('keyword', keywords)
            .gte('checked_at', startDate.toISOString())
            .order('checked_at', { ascending: true });

        if (fetchError) {
            throw new Error(`Database query failed: ${fetchError.message}`);
        }

        if (!rankings || rankings.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "No ranking history found for the specified keywords"
                },
                { status: 404 }
            );
        }

        console.log(`[Ranking History] Found ${rankings.length} total ranking records`);

        // Group rankings by keyword
        const keywordGroups = new Map<string, typeof rankings>();

        for (const ranking of rankings) {
            const kw = ranking.keyword;
            if (!keywordGroups.has(kw)) {
                keywordGroups.set(kw, []);
            }
            keywordGroups.get(kw)!.push(ranking);
        }

        // Create history objects for each keyword
        const histories: RankingHistory[] = [];

        for (const [kw, rankingData] of keywordGroups.entries()) {
            histories.push({
                keyword: kw,
                url: rankingData[0].url,
                history: rankingData.map(r => ({
                    position: r.position,
                    checkedAt: r.checked_at,
                    searchVolume: r.search_volume || 1000,
                    estimatedTraffic: r.estimated_traffic || 0
                }))
            });
        }

        // Generate report
        const report = generateRankingReport(histories);

        console.log('[Ranking History] Generated comprehensive ranking report');

        return NextResponse.json(
            {
                success: true,
                data: { report },
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Ranking History] Error:', error);

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
