/**
 * API Route: Ranking Alerts
 * GET /api/seo/ranking-alerts
 *
 * Retrieves and manages ranking alert conditions
 */

import { NextRequest, NextResponse } from "next/server";
import {
    calculatePositionChanges,
    detectRankingDrops,
    identifyRankingOpportunities,
    type RankingHistory,
    type RankingAlert
} from "@/lib/rank-analyzer";
import { getErrorMessage } from "@/lib/error-handler";
import { createClient } from "@supabase/supabase-js";
import type { RankingData } from "@/lib/seo-types";

interface RankingAlertsResponse {
    success: boolean;
    data?: {
        alerts?: RankingAlert[];
        opportunities?: any[];
        summary?: {
            totalAlerts: number;
            criticalAlerts: number;
            highAlerts: number;
            mediumAlerts: number;
            lowAlerts: number;
            totalOpportunities: number;
            highPriorityOpportunities: number;
        };
    };
    error?: string;
    timestamp?: string;
}

/**
 * GET handler for retrieving ranking alerts
 *
 * Analyzes recent ranking changes to detect drops and opportunities
 * that require attention. Returns actionable alerts with recommended actions.
 *
 * Query Parameters:
 * - articleId: Article UUID (optional)
 * - severity: Filter by severity level ('critical', 'high', 'medium', 'low') (optional)
 * - type: Alert type ('drops', 'opportunities', 'all') (default: 'all')
 * - days: Days of history to analyze (default: 7)
 *
 * @example
 * GET /api/seo/ranking-alerts?articleId=uuid&severity=critical&type=all
 * GET /api/seo/ranking-alerts?severity=high&days=30
 */
export async function GET(request: NextRequest): Promise<NextResponse<RankingAlertsResponse>> {
    try {
        // Parse query parameters
        const searchParams = request.nextUrl.searchParams;
        const articleId = searchParams.get('articleId');
        const severity = searchParams.get('severity') as 'critical' | 'high' | 'medium' | 'low' | null;
        const type = searchParams.get('type') || 'all';
        const days = parseInt(searchParams.get('days') || '7', 10);

        if (days < 1 || days > 90) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Days parameter must be between 1 and 90"
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

        console.log(`[Ranking Alerts] Analyzing alerts for ${articleId ? 'article ' + articleId : 'all articles'}`);

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

        const { data: rankings, error: fetchError } = await query;

        if (fetchError) {
            throw new Error(`Database query failed: ${fetchError.message}`);
        }

        if (!rankings || rankings.length === 0) {
            return NextResponse.json(
                {
                    success: true,
                    data: {
                        alerts: [],
                        opportunities: [],
                        summary: {
                            totalAlerts: 0,
                            criticalAlerts: 0,
                            highAlerts: 0,
                            mediumAlerts: 0,
                            lowAlerts: 0,
                            totalOpportunities: 0,
                            highPriorityOpportunities: 0
                        }
                    },
                    timestamp: new Date().toISOString()
                },
                { status: 200 }
            );
        }

        console.log(`[Ranking Alerts] Analyzing ${rankings.length} ranking records`);

        // Group rankings by keyword
        const keywordGroups = new Map<string, typeof rankings>();

        for (const ranking of rankings) {
            const kw = ranking.keyword;
            if (!keywordGroups.has(kw)) {
                keywordGroups.set(kw, []);
            }
            keywordGroups.get(kw)!.push(ranking);
        }

        // Analyze each keyword for alerts
        const allAlerts: RankingAlert[] = [];
        const currentRankings: RankingData[] = [];

        for (const [kw, rankingData] of keywordGroups.entries()) {
            const history: RankingHistory = {
                keyword: kw,
                url: rankingData[0].url,
                history: rankingData.map(r => ({
                    position: r.position,
                    checkedAt: r.checked_at,
                    searchVolume: r.search_volume || 1000,
                    estimatedTraffic: r.estimated_traffic || 0
                }))
            };

            // Calculate position changes
            const changes = calculatePositionChanges(history);

            // Detect ranking drops
            if (type === 'drops' || type === 'all') {
                const alerts = detectRankingDrops(changes);
                allAlerts.push(...alerts);
            }

            // Get current ranking for opportunity analysis
            if (type === 'opportunities' || type === 'all') {
                const sortedHistory = [...history.history].sort(
                    (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
                );

                if (sortedHistory.length > 0) {
                    const latest = sortedHistory[0];
                    currentRankings.push({
                        keyword: kw,
                        position: latest.position,
                        previousPosition: changes.daily?.previousPosition,
                        change: changes.daily?.change || 0,
                        url: history.url,
                        searchVolume: latest.searchVolume,
                        estimatedTraffic: latest.estimatedTraffic,
                        checkedAt: latest.checkedAt
                    });
                }
            }
        }

        // Filter alerts by severity if specified
        let filteredAlerts = allAlerts;
        if (severity) {
            filteredAlerts = allAlerts.filter(alert => alert.severity === severity);
        }

        // Identify ranking opportunities
        let opportunities: any[] = [];
        if (type === 'opportunities' || type === 'all') {
            opportunities = identifyRankingOpportunities(currentRankings);
        }

        // Calculate summary statistics
        const summary = {
            totalAlerts: filteredAlerts.length,
            criticalAlerts: filteredAlerts.filter(a => a.severity === 'critical').length,
            highAlerts: filteredAlerts.filter(a => a.severity === 'high').length,
            mediumAlerts: filteredAlerts.filter(a => a.severity === 'medium').length,
            lowAlerts: filteredAlerts.filter(a => a.severity === 'low').length,
            totalOpportunities: opportunities.length,
            highPriorityOpportunities: opportunities.filter(o => o.priority === 'high').length
        };

        console.log(`[Ranking Alerts] Found ${summary.totalAlerts} alerts and ${summary.totalOpportunities} opportunities`);

        // Save alerts to database for persistence
        if (filteredAlerts.length > 0) {
            try {
                const alertRecords = filteredAlerts.map(alert => ({
                    alert_id: alert.id,
                    article_id: articleId || null,
                    keyword: alert.keyword,
                    alert_type: alert.alertType,
                    severity: alert.severity,
                    message: alert.message,
                    current_position: alert.currentPosition,
                    previous_position: alert.previousPosition,
                    position_change: alert.change,
                    search_volume: alert.searchVolume,
                    estimated_traffic_loss: alert.estimatedTrafficLoss,
                    action_items: alert.actionItems,
                    triggered_at: alert.triggeredAt,
                    acknowledged: false
                }));

                const { error: insertError } = await supabase
                    .from('ranking_alerts')
                    .upsert(alertRecords, {
                        onConflict: 'alert_id',
                        ignoreDuplicates: false
                    });

                if (insertError) {
                    console.error('[Ranking Alerts] Alert save error:', insertError);
                } else {
                    console.log(`[Ranking Alerts] Saved ${alertRecords.length} alerts to database`);
                }
            } catch (dbError) {
                console.error('[Ranking Alerts] Database error:', dbError);
                // Continue even if database save fails
            }
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    alerts: filteredAlerts,
                    opportunities,
                    summary
                },
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Ranking Alerts] Error:', error);

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
 * POST handler for acknowledging or dismissing alerts
 *
 * Marks alerts as acknowledged or dismissed to prevent repeated notifications
 *
 * @example
 * POST /api/seo/ranking-alerts
 * {
 *   "alertIds": ["alert-id-1", "alert-id-2"],
 *   "action": "acknowledge"
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<RankingAlertsResponse>> {
    try {
        const body = await request.json();

        if (!body.alertIds || !Array.isArray(body.alertIds) || body.alertIds.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "alertIds array is required"
                },
                { status: 400 }
            );
        }

        const action = body.action || 'acknowledge';

        if (!['acknowledge', 'dismiss'].includes(action)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Action must be 'acknowledge' or 'dismiss'"
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

        console.log(`[Ranking Alerts] ${action === 'acknowledge' ? 'Acknowledging' : 'Dismissing'} ${body.alertIds.length} alerts`);

        // Update alerts in database
        const updates: any = {
            acknowledged: action === 'acknowledge',
            acknowledged_at: new Date().toISOString()
        };

        if (action === 'dismiss') {
            updates.dismissed = true;
            updates.dismissed_at = new Date().toISOString();
        }

        const { error: updateError } = await supabase
            .from('ranking_alerts')
            .update(updates)
            .in('alert_id', body.alertIds);

        if (updateError) {
            throw new Error(`Alert update failed: ${updateError.message}`);
        }

        console.log(`[Ranking Alerts] Successfully ${action === 'acknowledge' ? 'acknowledged' : 'dismissed'} alerts`);

        return NextResponse.json(
            {
                success: true,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Ranking Alerts] Error:', error);

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
 * DELETE handler for clearing old alerts
 *
 * Removes alerts older than specified days
 *
 * @example
 * DELETE /api/seo/ranking-alerts?days=30
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<RankingAlertsResponse>> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const days = parseInt(searchParams.get('days') || '30', 10);

        if (days < 7 || days > 365) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Days parameter must be between 7 and 365"
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

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        console.log(`[Ranking Alerts] Deleting alerts older than ${days} days`);

        const { error: deleteError } = await supabase
            .from('ranking_alerts')
            .delete()
            .lt('triggered_at', cutoffDate.toISOString());

        if (deleteError) {
            throw new Error(`Alert deletion failed: ${deleteError.message}`);
        }

        console.log('[Ranking Alerts] Successfully deleted old alerts');

        return NextResponse.json(
            {
                success: true,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Ranking Alerts] Error:', error);

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
