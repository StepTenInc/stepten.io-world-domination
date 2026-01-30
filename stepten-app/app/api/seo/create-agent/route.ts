/**
 * API Route: Create SEO Agent
 * POST /api/seo/create-agent
 *
 * Configures and initializes a new autonomous SEO agent
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generateAgentStrategy, getExistingKeywords } from "@/lib/agent-strategy";
import { scheduleAgentTasks } from "@/lib/agent-orchestrator";
import { handleError, getErrorMessage } from "@/lib/error-handler";
import type { SEOAgent, SEOAgentStrategy } from "@/lib/seo-types";

interface CreateAgentRequest {
    name: string;
    niche: string;
    articlesPerWeek: number;
    durationDays?: number;
    autonomy?: {
        autoResearch?: boolean;
        autoWrite?: boolean;
        autoOptimize?: boolean;
        autoPublish?: boolean;
        autoInternalLink?: boolean;
        autoRefresh?: boolean;
    };
    strategy?: Partial<SEOAgentStrategy>;
}

interface CreateAgentResponse {
    success: boolean;
    agent?: SEOAgent;
    tasksScheduled?: number;
    error?: string;
    timestamp?: string;
}

/**
 * POST handler for agent creation
 *
 * Creates a new SEO agent with:
 * - Custom strategy based on niche and goals
 * - Autonomy settings (what the agent can do automatically)
 * - Initial content calendar and task queue
 *
 * @example
 * POST /api/seo/create-agent
 * {
 *   "name": "AI Content Agent",
 *   "niche": "artificial intelligence and machine learning",
 *   "articlesPerWeek": 3,
 *   "durationDays": 90,
 *   "autonomy": {
 *     "autoResearch": true,
 *     "autoWrite": true,
 *     "autoOptimize": true,
 *     "autoPublish": false,
 *     "autoInternalLink": true,
 *     "autoRefresh": true
 *   }
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<CreateAgentResponse>> {
    try {
        // Parse request body
        const body: CreateAgentRequest = await request.json();

        // Validate required fields
        if (!body.name || typeof body.name !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Agent name is required and must be a string"
                },
                { status: 400 }
            );
        }

        if (!body.niche || typeof body.niche !== "string") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Niche is required and must be a string"
                },
                { status: 400 }
            );
        }

        if (!body.articlesPerWeek || body.articlesPerWeek < 1 || body.articlesPerWeek > 10) {
            return NextResponse.json(
                {
                    success: false,
                    error: "articlesPerWeek must be between 1 and 10"
                },
                { status: 400 }
            );
        }

        const name = body.name.trim();
        const niche = body.niche.trim();
        const articlesPerWeek = body.articlesPerWeek;
        const durationDays = body.durationDays || 90;

        console.log(`[Create Agent] Creating agent "${name}" for niche "${niche}"`);

        // Get existing keywords to avoid duplication
        const existingKeywords = await getExistingKeywords();

        // Generate agent strategy
        console.log(`[Create Agent] Generating strategy for ${durationDays} days...`);
        const strategyAnalysis = await generateAgentStrategy(
            niche,
            articlesPerWeek,
            durationDays,
            existingKeywords
        );

        // Build agent strategy
        const strategy: SEOAgentStrategy = {
            niche,
            articlesPerWeek,
            targetKeywords: strategyAnalysis.contentGaps.missingKeywords.length,
            focusFormats: body.strategy?.focusFormats || ['pillar', 'cluster', 'supporting', 'listicle', 'comparison'],
            qualityThreshold: body.strategy?.qualityThreshold || 75,
            contentClusterSize: body.strategy?.contentClusterSize || 5
        };

        // Build autonomy settings
        const autonomy = {
            autoResearch: body.autonomy?.autoResearch ?? true,
            autoWrite: body.autonomy?.autoWrite ?? true,
            autoOptimize: body.autonomy?.autoOptimize ?? true,
            autoPublish: body.autonomy?.autoPublish ?? false, // Default false for safety
            autoInternalLink: body.autonomy?.autoInternalLink ?? true,
            autoRefresh: body.autonomy?.autoRefresh ?? true
        };

        // Create agent in database
        const supabase = createServerClient();

        const agentId = `agent-${Date.now()}-${Math.random().toString(36).substring(7)}`;

        const agentData: Partial<SEOAgent> = {
            id: agentId,
            name,
            strategy,
            autonomy,
            status: 'active',
            metrics: {
                articlesCreated: 0,
                articlesPublished: 0,
                keywordsCovered: 0,
                avgQualityScore: 0,
                estimatedMonthlyTraffic: 0
            },
            tasks: [],
            createdAt: new Date().toISOString()
        };

        const { data: agent, error: insertError } = await supabase
            .from('seo_agents')
            .insert(agentData)
            .select()
            .single();

        if (insertError) {
            throw new Error(`Failed to create agent: ${insertError.message}`);
        }

        console.log(`[Create Agent] Agent created: ${agentId}`);

        // Schedule initial tasks
        console.log(`[Create Agent] Scheduling initial tasks...`);
        const taskIds = await scheduleAgentTasks(agent, strategyAnalysis.calendar);

        console.log(`[Create Agent] Scheduled ${taskIds.length} tasks`);

        // Update agent with task count
        await supabase
            .from('seo_agents')
            .update({
                metrics: {
                    ...agent.metrics,
                    tasksScheduled: taskIds.length
                }
            })
            .eq('id', agentId);

        const finalAgent: SEOAgent = {
            ...agent,
            tasks: []
        };

        return NextResponse.json(
            {
                success: true,
                agent: finalAgent,
                tasksScheduled: taskIds.length,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Create Agent] Error:', error);

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
        endpoint: "/api/seo/create-agent",
        method: "POST",
        description: "Creates and configures a new autonomous SEO agent",
        requestBody: {
            name: "string (required) - Agent name",
            niche: "string (required) - Content niche/topic area",
            articlesPerWeek: "number (required) - Target publishing frequency (1-10)",
            durationDays: "number (optional) - Planning horizon in days (default: 90)",
            autonomy: {
                autoResearch: "boolean (optional) - Auto-research keywords (default: true)",
                autoWrite: "boolean (optional) - Auto-write articles (default: true)",
                autoOptimize: "boolean (optional) - Auto-optimize SEO (default: true)",
                autoPublish: "boolean (optional) - Auto-publish without review (default: false)",
                autoInternalLink: "boolean (optional) - Auto-add internal links (default: true)",
                autoRefresh: "boolean (optional) - Auto-refresh old content (default: true)"
            },
            strategy: {
                focusFormats: "string[] (optional) - Content types to focus on",
                qualityThreshold: "number (optional) - Minimum quality score (default: 75)",
                contentClusterSize: "number (optional) - Articles per cluster (default: 5)"
            }
        },
        responseFields: {
            agent: {
                id: "Generated agent ID",
                name: "Agent name",
                strategy: "Agent strategy configuration",
                autonomy: "Autonomy settings",
                status: "Agent status (active/paused/stopped)",
                metrics: "Initial metrics (all zeros)",
                createdAt: "Creation timestamp"
            },
            tasksScheduled: "Number of tasks scheduled in initial queue"
        },
        example: {
            name: "AI Content Agent",
            niche: "artificial intelligence and machine learning",
            articlesPerWeek: 3,
            durationDays: 90,
            autonomy: {
                autoResearch: true,
                autoWrite: true,
                autoOptimize: true,
                autoPublish: false,
                autoInternalLink: true,
                autoRefresh: true
            }
        },
        notes: [
            "Agent will analyze content gaps and build a strategic calendar",
            "Initial tasks are scheduled but not executed until agent is run",
            "autoPublish defaults to false for safety - articles require human approval",
            "Quality threshold determines minimum score for auto-approval"
        ]
    });
}
