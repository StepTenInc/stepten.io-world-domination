/**
 * API Route: Get Agent Status & Metrics
 * GET /api/seo/agent-status
 *
 * Retrieves agent status, metrics, and performance data
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { monitorAgentMetrics } from "@/lib/agent-orchestrator";
import { getErrorMessage } from "@/lib/error-handler";
import type { SEOAgent } from "@/lib/seo-types";

interface AgentStatusResponse {
    success: boolean;
    agent?: SEOAgent & {
        performance?: {
            successRate: number;
            avgQualityScore: number;
            avgExecutionTime: number;
            articlesInReview: number;
            failedTasks: number;
        };
        queueStatus?: {
            queued: number;
            running: number;
            completed: number;
            failed: number;
            review: number;
        };
    };
    error?: string;
    timestamp?: string;
}

/**
 * GET handler for agent status
 *
 * Retrieves comprehensive agent status including:
 * - Agent configuration and settings
 * - Performance metrics (success rate, quality scores)
 * - Task queue status
 * - Article statistics
 *
 * @example
 * GET /api/seo/agent-status?agentId=agent-123
 */
export async function GET(request: NextRequest): Promise<NextResponse<AgentStatusResponse>> {
    try {
        // Get agent ID from query params
        const { searchParams } = new URL(request.url);
        const agentId = searchParams.get('agentId');

        if (!agentId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "agentId query parameter is required"
                },
                { status: 400 }
            );
        }

        console.log(`[Agent Status] Fetching status for agent ${agentId}`);

        const supabase = createServerClient();

        // Get agent from database
        const { data: agent, error: agentError } = await supabase
            .from('seo_agents')
            .select('*')
            .eq('id', agentId)
            .single();

        if (agentError || !agent) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Agent not found: ${agentId}`
                },
                { status: 404 }
            );
        }

        // Get performance metrics
        console.log(`[Agent Status] Fetching performance metrics...`);
        const performance = await monitorAgentMetrics(agentId);

        // Get queue status
        console.log(`[Agent Status] Fetching queue status...`);
        const { data: tasks, error: tasksError } = await supabase
            .from('agent_tasks')
            .select('status')
            .eq('data->agentId', agentId);

        if (tasksError) {
            console.error('[Agent Status] Error fetching tasks:', tasksError);
        }

        const queueStatus = {
            queued: tasks?.filter(t => t.status === 'queued').length || 0,
            running: tasks?.filter(t => t.status === 'running').length || 0,
            completed: tasks?.filter(t => t.status === 'complete').length || 0,
            failed: tasks?.filter(t => t.status === 'failed').length || 0,
            review: tasks?.filter(t => t.status === 'review').length || 0
        };

        // Get article statistics
        console.log(`[Agent Status] Fetching article statistics...`);
        const { data: articles, error: articlesError } = await supabase
            .from('agent_articles')
            .select('status, quality_score')
            .eq('agent_id', agentId);

        if (articlesError) {
            console.error('[Agent Status] Error fetching articles:', articlesError);
        }

        const articlesCreated = articles?.length || 0;
        const articlesPublished = articles?.filter(a => a.status === 'published').length || 0;
        const avgQualityScore = articles && articles.length > 0
            ? Math.round(articles.reduce((sum, a) => sum + (a.quality_score || 0), 0) / articles.length)
            : 0;

        // Update agent metrics
        const updatedMetrics = {
            articlesCreated,
            articlesPublished,
            keywordsCovered: articlesCreated, // Each article = 1 keyword
            avgQualityScore,
            estimatedMonthlyTraffic: articlesPublished * 500 // Rough estimate
        };

        await supabase
            .from('seo_agents')
            .update({ metrics: updatedMetrics })
            .eq('id', agentId);

        const agentWithMetrics: any = {
            ...agent,
            metrics: updatedMetrics,
            performance,
            queueStatus
        };

        console.log(`[Agent Status] Agent ${agentId}:`, {
            status: agent.status,
            articlesCreated,
            successRate: performance.successRate,
            queuedTasks: queueStatus.queued
        });

        return NextResponse.json(
            {
                success: true,
                agent: agentWithMetrics,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Agent Status] Error:', error);

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
 * POST handler - updates agent status (start/pause/stop)
 *
 * @example
 * POST /api/seo/agent-status
 * {
 *   "agentId": "agent-123",
 *   "status": "paused"
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();

        if (!body.agentId) {
            return NextResponse.json(
                { success: false, error: "agentId is required" },
                { status: 400 }
            );
        }

        if (!body.status || !['active', 'paused', 'stopped'].includes(body.status)) {
            return NextResponse.json(
                { success: false, error: "status must be one of: active, paused, stopped" },
                { status: 400 }
            );
        }

        console.log(`[Agent Status] Updating agent ${body.agentId} status to ${body.status}`);

        const supabase = createServerClient();

        const { error } = await supabase
            .from('seo_agents')
            .update({ status: body.status })
            .eq('id', body.agentId);

        if (error) {
            throw new Error(`Failed to update agent status: ${error.message}`);
        }

        return NextResponse.json(
            {
                success: true,
                message: `Agent status updated to ${body.status}`,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Agent Status] Error:', error);

        return NextResponse.json(
            {
                success: false,
                error: getErrorMessage(error),
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
