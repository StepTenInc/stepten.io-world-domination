/**
 * API Route: Get Agent Task Queue
 * GET /api/seo/agent-queue
 *
 * Retrieves pending tasks and queue status for an agent
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { runAgentLoop } from "@/lib/agent-orchestrator";
import { getErrorMessage } from "@/lib/error-handler";
import type { SEOAgentTask } from "@/lib/seo-types";

interface AgentQueueResponse {
    success: boolean;
    tasks?: SEOAgentTask[];
    queueStatus?: {
        total: number;
        queued: number;
        running: number;
        completed: number;
        failed: number;
        review: number;
    };
    error?: string;
    timestamp?: string;
}

interface ProcessQueueResponse {
    success: boolean;
    processed?: number;
    message?: string;
    error?: string;
    timestamp?: string;
}

/**
 * GET handler for agent queue
 *
 * Retrieves all tasks for an agent, optionally filtered by status
 *
 * @example
 * GET /api/seo/agent-queue?agentId=agent-123&status=queued
 */
export async function GET(request: NextRequest): Promise<NextResponse<AgentQueueResponse>> {
    try {
        // Get query params
        const { searchParams } = new URL(request.url);
        const agentId = searchParams.get('agentId');
        const statusFilter = searchParams.get('status');

        if (!agentId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "agentId query parameter is required"
                },
                { status: 400 }
            );
        }

        console.log(`[Agent Queue] Fetching queue for agent ${agentId}`);

        const supabase = createServerClient();

        // Build query
        let query = supabase
            .from('agent_tasks')
            .select('*')
            .eq('data->agentId', agentId);

        // Apply status filter if provided
        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        // Order by priority (highest first) and created date
        query = query
            .order('priority', { ascending: false })
            .order('created_at', { ascending: true });

        const { data: tasks, error: tasksError } = await query;

        if (tasksError) {
            throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
        }

        // Calculate queue status
        const queueStatus = {
            total: tasks?.length || 0,
            queued: tasks?.filter(t => t.status === 'queued').length || 0,
            running: tasks?.filter(t => t.status === 'running').length || 0,
            completed: tasks?.filter(t => t.status === 'complete').length || 0,
            failed: tasks?.filter(t => t.status === 'failed').length || 0,
            review: tasks?.filter(t => t.status === 'review').length || 0
        };

        console.log(`[Agent Queue] Found ${tasks?.length || 0} tasks for agent ${agentId}`);
        console.log(`[Agent Queue] Queue status:`, queueStatus);

        return NextResponse.json(
            {
                success: true,
                tasks: tasks as SEOAgentTask[],
                queueStatus,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Agent Queue] Error:', error);

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
 * POST handler - processes queued tasks
 *
 * Runs the agent loop to process pending tasks
 *
 * @example
 * POST /api/seo/agent-queue
 * {
 *   "agentId": "agent-123",
 *   "maxTasks": 5
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<ProcessQueueResponse>> {
    try {
        const body = await request.json();

        if (!body.agentId) {
            return NextResponse.json(
                { success: false, error: "agentId is required" },
                { status: 400 }
            );
        }

        const agentId = body.agentId;
        const maxTasks = body.maxTasks || 5;

        console.log(`[Agent Queue] Processing queue for agent ${agentId}, max tasks: ${maxTasks}`);

        // Run agent loop
        const processed = await runAgentLoop(agentId, maxTasks);

        console.log(`[Agent Queue] Processed ${processed} tasks for agent ${agentId}`);

        return NextResponse.json(
            {
                success: true,
                processed,
                message: `Processed ${processed} task(s)`,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Agent Queue] Error:', error);

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

/**
 * DELETE handler - cancels a task
 *
 * Removes a task from the queue (only if queued or failed)
 *
 * @example
 * DELETE /api/seo/agent-queue?taskId=task-123
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const taskId = searchParams.get('taskId');

        if (!taskId) {
            return NextResponse.json(
                { success: false, error: "taskId query parameter is required" },
                { status: 400 }
            );
        }

        console.log(`[Agent Queue] Canceling task ${taskId}`);

        const supabase = createServerClient();

        // Get task first to check status
        const { data: task, error: fetchError } = await supabase
            .from('agent_tasks')
            .select('status')
            .eq('id', taskId)
            .single();

        if (fetchError || !task) {
            return NextResponse.json(
                { success: false, error: `Task not found: ${taskId}` },
                { status: 404 }
            );
        }

        // Only allow canceling queued or failed tasks
        if (!['queued', 'failed'].includes(task.status)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Cannot cancel task with status: ${task.status}. Only queued or failed tasks can be canceled.`
                },
                { status: 400 }
            );
        }

        // Delete the task
        const { error: deleteError } = await supabase
            .from('agent_tasks')
            .delete()
            .eq('id', taskId);

        if (deleteError) {
            throw new Error(`Failed to delete task: ${deleteError.message}`);
        }

        console.log(`[Agent Queue] Task ${taskId} canceled`);

        return NextResponse.json(
            {
                success: true,
                message: `Task ${taskId} canceled`,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Agent Queue] Error:', error);

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
