import { Langfuse } from "langfuse";

/**
 * Langfuse LLM Observability Client
 * Tracks AI model calls, costs, and performance
 *
 * Setup:
 * 1. Create account at https://langfuse.com
 * 2. Add LANGFUSE_PUBLIC_KEY and LANGFUSE_SECRET_KEY to .env
 */

// Singleton instance
let langfuseClient: Langfuse | null = null;

/**
 * Get or create Langfuse client
 */
export function getLangfuse(): Langfuse | null {
    // Only initialize if keys are set
    if (
        !process.env.LANGFUSE_PUBLIC_KEY ||
        !process.env.LANGFUSE_SECRET_KEY
    ) {
        return null;
    }

    if (!langfuseClient) {
        langfuseClient = new Langfuse({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_BASE_URL || "https://cloud.langfuse.com",
        });
    }

    return langfuseClient;
}

/**
 * Track an LLM generation call
 *
 * @example
 * const trace = startTrace("article-generation", { articleId: "123" });
 * const generation = trace.generation({
 *   name: "gpt-4-write-article",
 *   model: "gpt-4",
 *   input: prompt,
 * });
 * // ... make API call ...
 * generation.end({ output: response, usage: { promptTokens: 100, completionTokens: 500 } });
 * trace.update({ output: { success: true } });
 */
export function startTrace(name: string, metadata?: Record<string, unknown>) {
    const langfuse = getLangfuse();
    if (!langfuse) {
        // Return a mock trace if Langfuse isn't configured
        return {
            generation: () => ({
                end: () => { },
                update: () => { },
            }),
            span: () => ({
                end: () => { },
                update: () => { },
            }),
            update: () => { },
            end: () => { },
        };
    }

    return langfuse.trace({
        name,
        metadata,
    });
}

/**
 * Simple wrapper to track a single LLM call
 *
 * @example
 * await trackLLMCall({
 *   name: "humanize-article",
 *   model: "grok-4-1-fast-reasoning",
 *   input: { prompt: "...", systemPrompt: "..." },
 *   output: response,
 *   usage: { promptTokens: 100, completionTokens: 500 },
 *   metadata: { articleId: "123" }
 * });
 */
export async function trackLLMCall(params: {
    name: string;
    model: string;
    input: unknown;
    output?: unknown;
    usage?: {
        promptTokens?: number;
        completionTokens?: number;
        totalTokens?: number;
    };
    metadata?: Record<string, unknown>;
    durationMs?: number;
    error?: string;
}) {
    const langfuse = getLangfuse();
    if (!langfuse) return;

    const trace = langfuse.trace({
        name: params.name,
        metadata: params.metadata,
    });

    trace.generation({
        name: params.name,
        model: params.model,
        input: params.input,
        output: params.output,
        usage: params.usage,
        metadata: {
            durationMs: params.durationMs,
            error: params.error,
        },
    });

    // Flush to ensure data is sent
    await langfuse.flushAsync();
}

/**
 * Shutdown Langfuse (call on app exit)
 */
export async function shutdownLangfuse() {
    if (langfuseClient) {
        await langfuseClient.shutdownAsync();
        langfuseClient = null;
    }
}
