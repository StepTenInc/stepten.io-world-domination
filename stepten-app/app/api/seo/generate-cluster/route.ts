import { NextRequest, NextResponse } from "next/server";
import {
    generateContentCluster,
    generateClusterSummary,
    ClusterGenerationConfig,
} from "@/lib/cluster-generator";
import {
    CLUSTER_SIZE_MIN,
    CLUSTER_SIZE_MAX,
    SUPPORTING_ARTICLES_MIN,
    SUPPORTING_ARTICLES_MAX,
    PILLAR_WORD_COUNT,
} from "@/lib/constants";

/**
 * POST /api/seo/generate-cluster
 *
 * Generate a complete content cluster strategy from a main keyword
 *
 * Request body:
 * {
 *   "mainKeyword": "Next.js SEO",
 *   "config": {
 *     "minClusterSize": 5,
 *     "maxClusterSize": 7,
 *     "minSupportingArticles": 10,
 *     "maxSupportingArticles": 15,
 *     "pillarWordCount": 3500
 *   }
 * }
 *
 * Response:
 * {
 *   "cluster": ContentCluster,
 *   "summary": {
 *     "description": string,
 *     "keyMetrics": {...},
 *     "timeline": string,
 *     "strategy": string[]
 *   },
 *   "success": true
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { mainKeyword, config } = body;

        // Validate required fields
        if (!mainKeyword || typeof mainKeyword !== "string") {
            return NextResponse.json(
                {
                    error: "mainKeyword is required and must be a string",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Validate keyword length
        if (mainKeyword.trim().length < 2) {
            return NextResponse.json(
                {
                    error: "mainKeyword must be at least 2 characters",
                    success: false,
                },
                { status: 400 }
            );
        }

        if (mainKeyword.length > 100) {
            return NextResponse.json(
                {
                    error: "mainKeyword must be less than 100 characters",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Prepare cluster configuration with defaults from constants
        const clusterConfig: ClusterGenerationConfig = {
            minClusterSize: config?.minClusterSize ?? CLUSTER_SIZE_MIN,
            maxClusterSize: config?.maxClusterSize ?? CLUSTER_SIZE_MAX,
            minSupportingArticles:
                config?.minSupportingArticles ?? SUPPORTING_ARTICLES_MIN,
            maxSupportingArticles:
                config?.maxSupportingArticles ?? SUPPORTING_ARTICLES_MAX,
            pillarWordCount: config?.pillarWordCount ?? PILLAR_WORD_COUNT,
            clusterWordCount: config?.clusterWordCount ?? 2000,
            supportingWordCount: config?.supportingWordCount ?? 1200,
        };

        // Validate configuration ranges
        if (
            clusterConfig.minClusterSize &&
            clusterConfig.maxClusterSize &&
            clusterConfig.minClusterSize > clusterConfig.maxClusterSize
        ) {
            return NextResponse.json(
                {
                    error: "minClusterSize cannot be greater than maxClusterSize",
                    success: false,
                },
                { status: 400 }
            );
        }

        if (
            clusterConfig.minSupportingArticles &&
            clusterConfig.maxSupportingArticles &&
            clusterConfig.minSupportingArticles > clusterConfig.maxSupportingArticles
        ) {
            return NextResponse.json(
                {
                    error: "minSupportingArticles cannot be greater than maxSupportingArticles",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Validate word counts
        if (
            clusterConfig.pillarWordCount &&
            (clusterConfig.pillarWordCount < 1000 || clusterConfig.pillarWordCount > 10000)
        ) {
            return NextResponse.json(
                {
                    error: "pillarWordCount must be between 1000 and 10000",
                    success: false,
                },
                { status: 400 }
            );
        }

        console.log(`Generating content cluster for: ${mainKeyword}`);
        console.log("Configuration:", clusterConfig);

        // Generate the content cluster
        const cluster = await generateContentCluster(
            mainKeyword.trim(),
            clusterConfig
        );

        // Generate cluster summary with strategy
        const summary = generateClusterSummary(cluster);

        console.log(
            `Generated cluster with ${cluster.totalArticles} articles (${cluster.clusterArticles.length} clusters, ${cluster.supportingArticles.length} supporting)`
        );

        return NextResponse.json({
            cluster,
            summary,
            success: true,
        });
    } catch (error: any) {
        console.error("Generate cluster error:", error);

        // Handle specific error types
        if (error.name === "ValidationError") {
            return NextResponse.json(
                {
                    error: error.message,
                    success: false,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: error.message || "Failed to generate content cluster",
                details: process.env.NODE_ENV === "development" ? error.stack : undefined,
                success: false,
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/seo/generate-cluster?example=true
 *
 * Get an example cluster configuration (for documentation/testing)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const example = searchParams.get("example");

    if (example === "true") {
        return NextResponse.json({
            exampleRequest: {
                mainKeyword: "Next.js SEO optimization",
                config: {
                    minClusterSize: CLUSTER_SIZE_MIN,
                    maxClusterSize: CLUSTER_SIZE_MAX,
                    minSupportingArticles: SUPPORTING_ARTICLES_MIN,
                    maxSupportingArticles: SUPPORTING_ARTICLES_MAX,
                    pillarWordCount: PILLAR_WORD_COUNT,
                    clusterWordCount: 2000,
                    supportingWordCount: 1200,
                },
            },
            description:
                "Generate a complete content cluster with pillar, cluster, and supporting articles",
            usage: "POST /api/seo/generate-cluster with mainKeyword and optional config",
            constants: {
                CLUSTER_SIZE_MIN,
                CLUSTER_SIZE_MAX,
                SUPPORTING_ARTICLES_MIN,
                SUPPORTING_ARTICLES_MAX,
                PILLAR_WORD_COUNT,
            },
        });
    }

    return NextResponse.json(
        {
            error: "Method not allowed. Use POST to generate a cluster.",
            hint: "Add ?example=true to see example request",
        },
        { status: 405 }
    );
}
