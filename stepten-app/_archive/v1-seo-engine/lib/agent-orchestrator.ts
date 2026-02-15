/**
 * AI SEO Agent - Orchestrator
 * Manages task queue, scheduling, monitoring, and auto-adjustment
 */

import type { SEOAgent, SEOAgentTask, SEOAgentStrategy } from "./seo-types";
import { createServerClient } from "./supabase/server";
import { autoWriteArticle } from "./agent-writer";
import { generateAgentStrategy, getExistingKeywords } from "./agent-strategy";
import { AGENT_TASK_LIMIT, AGENT_QUALITY_THRESHOLD } from "./constants";

interface TaskExecutionResult {
    taskId: string;
    status: 'complete' | 'failed' | 'review';
    articleId?: string;
    draftId?: string;
    qualityScore?: number;
    error?: string;
    completedAt: string;
}

interface AgentMetrics {
    successRate: number;
    avgQualityScore: number;
    avgExecutionTime: number;
    articlesInReview: number;
    failedTasks: number;
}

/**
 * Executes a single agent task from the queue
 *
 * @param task - The task to execute
 * @returns Execution result with status and metadata
 *
 * @example
 * const result = await executeAgentTask(task);
 * if (result.status === 'complete') {
 *   console.log(`Article created: ${result.draftId}`);
 * }
 */
export async function executeAgentTask(task: SEOAgentTask): Promise<TaskExecutionResult> {
    console.log(`[Agent Orchestrator] Executing task ${task.id} (type: ${task.type})`);

    const startTime = Date.now();

    try {
        const supabase = createServerClient();

        // Update task status to running
        await supabase
            .from('agent_tasks')
            .update({ status: 'running' })
            .eq('id', task.id);

        let result: TaskExecutionResult;

        switch (task.type) {
            case 'write':
                result = await executeWriteTask(task);
                break;

            case 'research':
                result = await executeResearchTask(task);
                break;

            case 'optimize':
                result = await executeOptimizeTask(task);
                break;

            case 'link':
                result = await executeLinkTask(task);
                break;

            case 'refresh':
                result = await executeRefreshTask(task);
                break;

            case 'publish':
                result = await executePublishTask(task);
                break;

            default:
                throw new Error(`Unknown task type: ${task.type}`);
        }

        const executionTime = Date.now() - startTime;

        // Update task in database
        await supabase
            .from('agent_tasks')
            .update({
                status: result.status,
                data: {
                    ...task.data,
                    executionTime,
                    result
                },
                completed_at: result.completedAt,
                error: result.error
            })
            .eq('id', task.id);

        // Record metrics
        await recordTaskMetrics(task.id, executionTime, result);

        console.log(`[Agent Orchestrator] Task ${task.id} completed with status: ${result.status}`);

        return result;

    } catch (error) {
        console.error(`[Agent Orchestrator] Task ${task.id} failed:`, error);

        const result: TaskExecutionResult = {
            taskId: task.id,
            status: 'failed',
            error: error instanceof Error ? error.message : "Unknown error",
            completedAt: new Date().toISOString()
        };

        // Update task with error
        const supabase = createServerClient();
        await supabase
            .from('agent_tasks')
            .update({
                status: 'failed',
                error: result.error,
                completed_at: result.completedAt
            })
            .eq('id', task.id);

        return result;
    }
}

/**
 * Executes a write task - creates a complete article autonomously
 */
async function executeWriteTask(task: SEOAgentTask): Promise<TaskExecutionResult> {
    const { keyword, searchVolume, difficulty } = task.data;

    console.log(`[Agent Orchestrator] Writing article for keyword: "${keyword}"`);

    const writeResult = await autoWriteArticle(keyword, searchVolume, difficulty);

    if (writeResult.status === 'failed') {
        return {
            taskId: task.id,
            status: 'failed',
            error: writeResult.error,
            completedAt: new Date().toISOString()
        };
    }

    // Check quality threshold
    if (writeResult.qualityScore < AGENT_QUALITY_THRESHOLD) {
        console.warn(`[Agent Orchestrator] Quality score ${writeResult.qualityScore} below threshold ${AGENT_QUALITY_THRESHOLD}`);
        // Still send to review, just flag it
    }

    // Save to agent_articles table
    const supabase = createServerClient();
    const { data: agentArticle, error } = await supabase
        .from('agent_articles')
        .insert({
            agent_id: task.data.agentId,
            task_id: task.id,
            draft_id: writeResult.draftId,
            keyword,
            title: writeResult.articleData.step3?.metadata.title,
            quality_score: writeResult.qualityScore,
            human_score: writeResult.humanScore,
            seo_score: writeResult.seoScore,
            word_count: writeResult.articleData.step4?.wordCount,
            status: 'review',
            article_data: writeResult.articleData
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to save article: ${error.message}`);
    }

    return {
        taskId: task.id,
        status: 'review',
        articleId: agentArticle.id,
        draftId: writeResult.draftId,
        qualityScore: writeResult.qualityScore,
        completedAt: new Date().toISOString()
    };
}

/**
 * Executes a research task - analyzes keywords and builds strategy
 */
async function executeResearchTask(task: SEOAgentTask): Promise<TaskExecutionResult> {
    // Research tasks are handled by the strategy planner
    // This is a placeholder for future expansion
    console.log(`[Agent Orchestrator] Research task not yet implemented`);

    return {
        taskId: task.id,
        status: 'complete',
        completedAt: new Date().toISOString()
    };
}

/**
 * Executes an optimize task - improves existing article SEO
 */
async function executeOptimizeTask(task: SEOAgentTask): Promise<TaskExecutionResult> {
    // Optimization tasks are handled separately
    console.log(`[Agent Orchestrator] Optimize task not yet implemented`);

    return {
        taskId: task.id,
        status: 'complete',
        completedAt: new Date().toISOString()
    };
}

/**
 * Executes a link task - adds internal links to articles
 */
async function executeLinkTask(task: SEOAgentTask): Promise<TaskExecutionResult> {
    // Internal linking tasks
    console.log(`[Agent Orchestrator] Link task not yet implemented`);

    return {
        taskId: task.id,
        status: 'complete',
        completedAt: new Date().toISOString()
    };
}

/**
 * Executes a refresh task - updates old content
 */
async function executeRefreshTask(task: SEOAgentTask): Promise<TaskExecutionResult> {
    // Content refresh tasks
    console.log(`[Agent Orchestrator] Refresh task not yet implemented`);

    return {
        taskId: task.id,
        status: 'complete',
        completedAt: new Date().toISOString()
    };
}

/**
 * Executes a publish task - publishes approved articles
 */
async function executePublishTask(task: SEOAgentTask): Promise<TaskExecutionResult> {
    const { articleId } = task.data;

    console.log(`[Agent Orchestrator] Publishing article ${articleId}`);

    const supabase = createServerClient();

    // Get article data from agent_articles
    const { data: agentArticle, error: fetchError } = await supabase
        .from('agent_articles')
        .select('*')
        .eq('id', articleId)
        .single();

    if (fetchError || !agentArticle) {
        throw new Error(`Article not found: ${articleId}`);
    }

    // Create published article in articles table
    const articleData = agentArticle.article_data;
    const { error: publishError } = await supabase
        .from('articles')
        .insert({
            title: agentArticle.title,
            slug: articleData.step3?.metadata.slug,
            content: articleData.step5?.humanized || articleData.step4?.original,
            main_keyword: agentArticle.keyword,
            status: 'published',
            word_count: agentArticle.word_count,
            seo_score: agentArticle.seo_score,
            human_score: agentArticle.human_score,
            meta_title: articleData.step6?.metaTitle,
            meta_description: articleData.step6?.metaDescription,
            published_at: new Date().toISOString()
        });

    if (publishError) {
        throw new Error(`Failed to publish article: ${publishError.message}`);
    }

    // Update agent_articles status
    await supabase
        .from('agent_articles')
        .update({
            status: 'published',
            published_at: new Date().toISOString()
        })
        .eq('id', articleId);

    return {
        taskId: task.id,
        status: 'complete',
        articleId,
        completedAt: new Date().toISOString()
    };
}

/**
 * Records task execution metrics
 */
async function recordTaskMetrics(
    taskId: string,
    executionTime: number,
    result: TaskExecutionResult
): Promise<void> {
    try {
        const supabase = createServerClient();

        await supabase
            .from('agent_metrics')
            .insert({
                task_id: taskId,
                execution_time: executionTime,
                status: result.status,
                quality_score: result.qualityScore,
                error: result.error,
                recorded_at: new Date().toISOString()
            });

    } catch (error) {
        console.error('[Agent Orchestrator] Error recording metrics:', error);
        // Don't throw - metrics failure shouldn't break task execution
    }
}

/**
 * Schedules tasks for an agent based on its strategy
 *
 * @param agent - The agent to schedule tasks for
 * @param calendar - Content calendar entries
 * @returns Array of created task IDs
 *
 * @example
 * const taskIds = await scheduleAgentTasks(agent, calendar);
 * console.log(`Scheduled ${taskIds.length} tasks`);
 */
export async function scheduleAgentTasks(
    agent: SEOAgent,
    calendar: Array<{
        keyword: string;
        targetPublishDate: string;
        type: string;
        priority: number;
        estimatedWordCount: number;
    }>
): Promise<string[]> {
    console.log(`[Agent Orchestrator] Scheduling tasks for agent ${agent.id}`);

    const supabase = createServerClient();
    const taskIds: string[] = [];

    // Limit tasks based on AGENT_TASK_LIMIT
    const tasksToSchedule = calendar.slice(0, AGENT_TASK_LIMIT);

    for (const entry of tasksToSchedule) {
        const taskData: Partial<SEOAgentTask> = {
            id: `task-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            type: 'write',
            status: 'queued',
            priority: entry.priority,
            data: {
                agentId: agent.id,
                keyword: entry.keyword,
                searchVolume: 1000, // Default, would come from keyword research
                difficulty: 50,
                targetPublishDate: entry.targetPublishDate,
                contentType: entry.type,
                wordCountTarget: entry.estimatedWordCount
            },
            createdAt: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('agent_tasks')
            .insert(taskData)
            .select()
            .single();

        if (error) {
            console.error('[Agent Orchestrator] Error creating task:', error);
            continue;
        }

        taskIds.push(data.id);
    }

    console.log(`[Agent Orchestrator] Scheduled ${taskIds.length} tasks`);

    return taskIds;
}

/**
 * Monitors agent success and failure rates
 *
 * @param agentId - Agent ID to monitor
 * @returns Agent metrics including success rate and quality scores
 *
 * @example
 * const metrics = await monitorAgentMetrics("agent-123");
 * console.log(`Success rate: ${metrics.successRate}%`);
 */
export async function monitorAgentMetrics(agentId: string): Promise<AgentMetrics> {
    console.log(`[Agent Orchestrator] Monitoring metrics for agent ${agentId}`);

    const supabase = createServerClient();

    // Get completed tasks
    const { data: completedTasks, error: completedError } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('data->agentId', agentId)
        .in('status', ['complete', 'review', 'failed']);

    if (completedError) {
        throw new Error(`Failed to fetch tasks: ${completedError.message}`);
    }

    const totalTasks = completedTasks?.length || 0;
    const successfulTasks = completedTasks?.filter(t => t.status === 'complete' || t.status === 'review').length || 0;
    const failedTasks = completedTasks?.filter(t => t.status === 'failed').length || 0;
    const reviewTasks = completedTasks?.filter(t => t.status === 'review').length || 0;

    const successRate = totalTasks > 0 ? (successfulTasks / totalTasks) * 100 : 0;

    // Get quality scores
    const { data: articles, error: articlesError } = await supabase
        .from('agent_articles')
        .select('quality_score')
        .eq('agent_id', agentId);

    if (articlesError) {
        console.error('[Agent Orchestrator] Error fetching articles:', articlesError);
    }

    const qualityScores = articles?.map(a => a.quality_score).filter((s): s is number => s !== null) || [];
    const avgQualityScore = qualityScores.length > 0
        ? qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
        : 0;

    // Get execution times
    const { data: metrics, error: metricsError } = await supabase
        .from('agent_metrics')
        .select('execution_time')
        .in('task_id', completedTasks?.map(t => t.id) || []);

    if (metricsError) {
        console.error('[Agent Orchestrator] Error fetching metrics:', metricsError);
    }

    const executionTimes = metrics?.map(m => m.execution_time).filter((t): t is number => t !== null) || [];
    const avgExecutionTime = executionTimes.length > 0
        ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
        : 0;

    const agentMetrics: AgentMetrics = {
        successRate: Math.round(successRate),
        avgQualityScore: Math.round(avgQualityScore),
        avgExecutionTime: Math.round(avgExecutionTime),
        articlesInReview: reviewTasks,
        failedTasks
    };

    console.log(`[Agent Orchestrator] Agent ${agentId} metrics:`, agentMetrics);

    return agentMetrics;
}

/**
 * Auto-adjusts agent strategy based on performance results
 *
 * @param agentId - Agent ID to adjust
 * @param metrics - Current agent metrics
 * @returns Updated strategy
 *
 * @example
 * const newStrategy = await autoAdjustStrategy("agent-123", metrics);
 * // Strategy adjusted based on performance
 */
export async function autoAdjustStrategy(
    agentId: string,
    metrics: AgentMetrics
): Promise<SEOAgentStrategy> {
    console.log(`[Agent Orchestrator] Auto-adjusting strategy for agent ${agentId}`);

    const supabase = createServerClient();

    // Get current agent
    const { data: agent, error } = await supabase
        .from('seo_agents')
        .select('*')
        .eq('id', agentId)
        .single();

    if (error || !agent) {
        throw new Error(`Agent not found: ${agentId}`);
    }

    const currentStrategy = agent.strategy as SEOAgentStrategy;
    const newStrategy = { ...currentStrategy };

    // Adjust based on metrics
    if (metrics.successRate < 60) {
        // Low success rate - reduce output, increase quality threshold
        console.log('[Agent Orchestrator] Low success rate detected, reducing output');
        newStrategy.articlesPerWeek = Math.max(1, currentStrategy.articlesPerWeek - 1);
        newStrategy.qualityThreshold = Math.min(90, currentStrategy.qualityThreshold + 5);
    } else if (metrics.successRate > 85 && metrics.avgQualityScore > 80) {
        // High success rate and quality - increase output
        console.log('[Agent Orchestrator] High performance detected, increasing output');
        newStrategy.articlesPerWeek = Math.min(7, currentStrategy.articlesPerWeek + 1);
    }

    if (metrics.avgQualityScore < AGENT_QUALITY_THRESHOLD) {
        // Low quality - increase threshold
        console.log('[Agent Orchestrator] Low quality detected, raising threshold');
        newStrategy.qualityThreshold = Math.min(90, currentStrategy.qualityThreshold + 10);
    }

    // Update agent in database
    await supabase
        .from('seo_agents')
        .update({ strategy: newStrategy })
        .eq('id', agentId);

    console.log('[Agent Orchestrator] Strategy adjusted:', newStrategy);

    return newStrategy;
}

/**
 * Runs the agent orchestrator loop - processes queued tasks
 *
 * @param agentId - Agent ID to run
 * @param maxTasks - Maximum number of tasks to process in this run
 * @returns Number of tasks processed
 *
 * @example
 * const processed = await runAgentLoop("agent-123", 5);
 * console.log(`Processed ${processed} tasks`);
 */
export async function runAgentLoop(agentId: string, maxTasks: number = AGENT_TASK_LIMIT): Promise<number> {
    console.log(`[Agent Orchestrator] Running agent loop for ${agentId}`);

    const supabase = createServerClient();

    // Get agent
    const { data: agent, error: agentError } = await supabase
        .from('seo_agents')
        .select('*')
        .eq('id', agentId)
        .single();

    if (agentError || !agent || agent.status !== 'active') {
        console.log(`[Agent Orchestrator] Agent ${agentId} not active or not found`);
        return 0;
    }

    // Get queued tasks, ordered by priority
    const { data: tasks, error: tasksError } = await supabase
        .from('agent_tasks')
        .select('*')
        .eq('data->agentId', agentId)
        .eq('status', 'queued')
        .order('priority', { ascending: false })
        .limit(maxTasks);

    if (tasksError) {
        throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
    }

    if (!tasks || tasks.length === 0) {
        console.log(`[Agent Orchestrator] No queued tasks for agent ${agentId}`);
        return 0;
    }

    console.log(`[Agent Orchestrator] Processing ${tasks.length} tasks for agent ${agentId}`);

    let processed = 0;

    for (const task of tasks) {
        try {
            await executeAgentTask(task as SEOAgentTask);
            processed++;
        } catch (error) {
            console.error(`[Agent Orchestrator] Error processing task ${task.id}:`, error);
            // Continue with next task
        }
    }

    // Update agent last run time
    await supabase
        .from('seo_agents')
        .update({ last_run_at: new Date().toISOString() })
        .eq('id', agentId);

    // Monitor metrics and auto-adjust if needed
    const metrics = await monitorAgentMetrics(agentId);

    if (processed >= 5) {
        // Only auto-adjust after processing at least 5 tasks
        await autoAdjustStrategy(agentId, metrics);
    }

    console.log(`[Agent Orchestrator] Processed ${processed} tasks for agent ${agentId}`);

    return processed;
}
