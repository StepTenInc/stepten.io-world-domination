/**
 * API Route: Approve Agent Article
 * POST /api/seo/approve-article
 *
 * Human approval for agent-generated articles
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/error-handler";

interface ApproveArticleRequest {
    articleId: string;
    action: 'approve' | 'reject' | 'request-revisions';
    feedback?: string;
    revisionInstructions?: string;
}

interface ApproveArticleResponse {
    success: boolean;
    article?: any;
    message?: string;
    error?: string;
    timestamp?: string;
}

/**
 * POST handler for article approval
 *
 * Allows humans to:
 * - Approve articles for publishing
 * - Reject articles (with feedback)
 * - Request revisions (with specific instructions)
 *
 * @example
 * POST /api/seo/approve-article
 * {
 *   "articleId": "article-123",
 *   "action": "approve",
 *   "feedback": "Great article, ready to publish!"
 * }
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApproveArticleResponse>> {
    try {
        // Parse request body
        const body: ApproveArticleRequest = await request.json();

        // Validate required fields
        if (!body.articleId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "articleId is required"
                },
                { status: 400 }
            );
        }

        if (!body.action || !['approve', 'reject', 'request-revisions'].includes(body.action)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "action must be one of: approve, reject, request-revisions"
                },
                { status: 400 }
            );
        }

        if (body.action === 'request-revisions' && !body.revisionInstructions) {
            return NextResponse.json(
                {
                    success: false,
                    error: "revisionInstructions is required when requesting revisions"
                },
                { status: 400 }
            );
        }

        const { articleId, action, feedback, revisionInstructions } = body;

        console.log(`[Approve Article] ${action} article ${articleId}`);

        const supabase = createServerClient();

        // Get article from agent_articles
        const { data: article, error: fetchError } = await supabase
            .from('agent_articles')
            .select('*')
            .eq('id', articleId)
            .single();

        if (fetchError || !article) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Article not found: ${articleId}`
                },
                { status: 404 }
            );
        }

        // Check current status
        if (article.status !== 'review') {
            return NextResponse.json(
                {
                    success: false,
                    error: `Article is not in review status (current: ${article.status})`
                },
                { status: 400 }
            );
        }

        let updatedArticle: any;

        switch (action) {
            case 'approve':
                // Approve article - create publish task
                console.log(`[Approve Article] Approving article ${articleId}`);

                // Update article status
                const { data: approved, error: approveError } = await supabase
                    .from('agent_articles')
                    .update({
                        status: 'approved',
                        approved_at: new Date().toISOString(),
                        feedback
                    })
                    .eq('id', articleId)
                    .select()
                    .single();

                if (approveError) {
                    throw new Error(`Failed to approve article: ${approveError.message}`);
                }

                // Create publish task
                const publishTaskId = `task-${Date.now()}-${Math.random().toString(36).substring(7)}`;

                await supabase
                    .from('agent_tasks')
                    .insert({
                        id: publishTaskId,
                        type: 'publish',
                        status: 'queued',
                        priority: 10, // High priority
                        data: {
                            agentId: article.agent_id,
                            articleId: articleId
                        },
                        created_at: new Date().toISOString()
                    });

                updatedArticle = approved;

                console.log(`[Approve Article] Article approved, publish task created: ${publishTaskId}`);
                break;

            case 'reject':
                // Reject article
                console.log(`[Approve Article] Rejecting article ${articleId}`);

                const { data: rejected, error: rejectError } = await supabase
                    .from('agent_articles')
                    .update({
                        status: 'rejected',
                        rejected_at: new Date().toISOString(),
                        feedback
                    })
                    .eq('id', articleId)
                    .select()
                    .single();

                if (rejectError) {
                    throw new Error(`Failed to reject article: ${rejectError.message}`);
                }

                updatedArticle = rejected;

                console.log(`[Approve Article] Article rejected`);
                break;

            case 'request-revisions':
                // Request revisions - update article and create revision task
                console.log(`[Approve Article] Requesting revisions for article ${articleId}`);

                const { data: revisionRequested, error: revisionError } = await supabase
                    .from('agent_articles')
                    .update({
                        status: 'revisions-requested',
                        revision_instructions: revisionInstructions,
                        feedback,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', articleId)
                    .select()
                    .single();

                if (revisionError) {
                    throw new Error(`Failed to request revisions: ${revisionError.message}`);
                }

                // Create optimize task for revisions
                const revisionTaskId = `task-${Date.now()}-${Math.random().toString(36).substring(7)}`;

                await supabase
                    .from('agent_tasks')
                    .insert({
                        id: revisionTaskId,
                        type: 'optimize',
                        status: 'queued',
                        priority: 8, // Medium-high priority
                        data: {
                            agentId: article.agent_id,
                            articleId: articleId,
                            instructions: revisionInstructions
                        },
                        created_at: new Date().toISOString()
                    });

                updatedArticle = revisionRequested;

                console.log(`[Approve Article] Revisions requested, task created: ${revisionTaskId}`);
                break;
        }

        return NextResponse.json(
            {
                success: true,
                article: updatedArticle,
                message: getActionMessage(action),
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Approve Article] Error:', error);

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
 * GET handler - retrieves articles pending approval
 *
 * @example
 * GET /api/seo/approve-article?agentId=agent-123
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const agentId = searchParams.get('agentId');
        const status = searchParams.get('status') || 'review';

        console.log(`[Approve Article] Fetching articles with status: ${status}`);

        const supabase = createServerClient();

        let query = supabase
            .from('agent_articles')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        // Filter by agent if provided
        if (agentId) {
            query = query.eq('agent_id', agentId);
        }

        const { data: articles, error } = await query;

        if (error) {
            throw new Error(`Failed to fetch articles: ${error.message}`);
        }

        console.log(`[Approve Article] Found ${articles?.length || 0} articles`);

        return NextResponse.json(
            {
                success: true,
                articles: articles || [],
                count: articles?.length || 0,
                timestamp: new Date().toISOString()
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error('[Approve Article] Error:', error);

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
 * Helper function to get action message
 */
function getActionMessage(action: string): string {
    switch (action) {
        case 'approve':
            return 'Article approved and queued for publishing';
        case 'reject':
            return 'Article rejected';
        case 'request-revisions':
            return 'Revisions requested - article will be optimized based on feedback';
        default:
            return 'Action completed';
    }
}
