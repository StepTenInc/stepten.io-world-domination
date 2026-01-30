/**
 * API Route: Create A/B Test
 * POST /api/seo/create-test
 *
 * Creates a new A/B test for article variants
 */

import { NextRequest, NextResponse } from "next/server";
import { generateVariants } from "@/lib/variant-generator";
import { getErrorMessage } from "@/lib/error-handler";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CreateTestRequest {
  articleId: string;
  metric: "CTR" | "time_on_page" | "bounce_rate" | "conversions";
  keyword: string;
  originalTitle: string;
  originalMetaDescription: string;
  originalIntro?: string;
  variantCount?: number;
  trafficSplit?: number[]; // Array of percentages that sum to 100
  duration?: number; // Test duration in days
}

interface CreateTestResponse {
  success: boolean;
  data?: {
    testId: string;
    variants: Array<{
      id: string;
      name: string;
      title: string;
      metaDescription: string;
      introductionParagraph?: string;
      traffic: number;
    }>;
    status: string;
    startDate: string;
    estimatedEndDate: string;
  };
  error?: string;
  timestamp?: string;
}

/**
 * POST handler for creating A/B tests
 *
 * Generates variants and creates test configuration in database
 *
 * @example
 * POST /api/seo/create-test
 * {
 *   "articleId": "article-123",
 *   "metric": "CTR",
 *   "keyword": "React hooks",
 *   "originalTitle": "Understanding React Hooks",
 *   "originalMetaDescription": "Learn about React hooks...",
 *   "variantCount": 3,
 *   "duration": 14
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateTestResponse>> {
  try {
    // Parse and validate request body
    const body: CreateTestRequest = await request.json();

    // Validation
    if (!body.articleId || typeof body.articleId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "articleId is required and must be a string",
        },
        { status: 400 }
      );
    }

    if (!body.metric || !["CTR", "time_on_page", "bounce_rate", "conversions"].includes(body.metric)) {
      return NextResponse.json(
        {
          success: false,
          error: "metric is required and must be one of: CTR, time_on_page, bounce_rate, conversions",
        },
        { status: 400 }
      );
    }

    if (!body.keyword || typeof body.keyword !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "keyword is required and must be a string",
        },
        { status: 400 }
      );
    }

    if (!body.originalTitle || typeof body.originalTitle !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "originalTitle is required and must be a string",
        },
        { status: 400 }
      );
    }

    if (!body.originalMetaDescription || typeof body.originalMetaDescription !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "originalMetaDescription is required and must be a string",
        },
        { status: 400 }
      );
    }

    const variantCount = body.variantCount || 3;
    const duration = body.duration || 14; // Default 14 days

    console.log(`[Create Test] Generating ${variantCount} variants for article ${body.articleId}`);

    // Generate variants using AI
    const variantResult = await generateVariants({
      keyword: body.keyword,
      originalTitle: body.originalTitle,
      originalMetaDescription: body.originalMetaDescription,
      originalIntro: body.originalIntro,
      variantCount,
    });

    // Calculate traffic split (equal distribution by default)
    const totalVariants = variantResult.variants.length + 1; // +1 for original
    const defaultTrafficSplit = new Array(totalVariants).fill(
      Math.floor(100 / totalVariants)
    );
    const trafficSplit = body.trafficSplit || defaultTrafficSplit;

    // Validate traffic split
    const trafficSum = trafficSplit.reduce((sum, val) => sum + val, 0);
    if (Math.abs(trafficSum - 100) > 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Traffic split must sum to 100%",
        },
        { status: 400 }
      );
    }

    // Create test in database
    const startDate = new Date().toISOString();
    const estimatedEndDate = new Date(
      Date.now() + duration * 24 * 60 * 60 * 1000
    ).toISOString();

    const { data: testData, error: testError } = await supabase
      .from("ab_tests")
      .insert({
        article_id: body.articleId,
        metric: body.metric,
        status: "running",
        start_date: startDate,
        duration,
        confidence: 0.95,
      })
      .select()
      .single();

    if (testError || !testData) {
      console.error("[Create Test] Database error:", testError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create test in database",
        },
        { status: 500 }
      );
    }

    console.log(`[Create Test] Created test ${testData.id}`);

    // Create variants in database
    const variants = [];

    // Add original as control variant
    const { data: controlVariant, error: controlError } = await supabase
      .from("ab_variants")
      .insert({
        test_id: testData.id,
        name: "Control (Original)",
        title: variantResult.original.title,
        meta_description: variantResult.original.metaDescription,
        introduction_paragraph: variantResult.original.introductionParagraph,
        traffic: trafficSplit[0],
        impressions: 0,
        clicks: 0,
        ctr: 0,
        avg_time_on_page: 0,
        bounce_rate: 0,
      })
      .select()
      .single();

    if (controlError || !controlVariant) {
      console.error("[Create Test] Error creating control variant:", controlError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create control variant",
        },
        { status: 500 }
      );
    }

    variants.push({
      id: controlVariant.id,
      name: controlVariant.name,
      title: controlVariant.title,
      metaDescription: controlVariant.meta_description,
      introductionParagraph: controlVariant.introduction_paragraph,
      traffic: controlVariant.traffic,
    });

    // Add generated variants
    for (let i = 0; i < variantResult.variants.length; i++) {
      const variant = variantResult.variants[i];
      const { data: variantData, error: variantError } = await supabase
        .from("ab_variants")
        .insert({
          test_id: testData.id,
          name: `Variant ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
          title: variant.title,
          meta_description: variant.metaDescription,
          introduction_paragraph: variant.introductionParagraph,
          traffic: trafficSplit[i + 1],
          impressions: 0,
          clicks: 0,
          ctr: 0,
          avg_time_on_page: 0,
          bounce_rate: 0,
        })
        .select()
        .single();

      if (variantError || !variantData) {
        console.error(`[Create Test] Error creating variant ${i}:`, variantError);
        continue;
      }

      variants.push({
        id: variantData.id,
        name: variantData.name,
        title: variantData.title,
        metaDescription: variantData.meta_description,
        introductionParagraph: variantData.introduction_paragraph,
        traffic: variantData.traffic,
      });
    }

    console.log(`[Create Test] Created ${variants.length} variants`);

    return NextResponse.json(
      {
        success: true,
        data: {
          testId: testData.id,
          variants,
          status: testData.status,
          startDate,
          estimatedEndDate,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Create Test] Error:", error);

    const errorMessage = getErrorMessage(error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
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
    endpoint: "/api/seo/create-test",
    method: "POST",
    description: "Creates a new A/B test with AI-generated variants",
    requestBody: {
      articleId: "string (required) - The article to test",
      metric: "string (required) - Metric to optimize: CTR, time_on_page, bounce_rate, conversions",
      keyword: "string (required) - Target keyword for variants",
      originalTitle: "string (required) - Original article title",
      originalMetaDescription: "string (required) - Original meta description",
      originalIntro: "string (optional) - Original introduction paragraph",
      variantCount: "number (optional) - Number of variants to generate (3-5, default: 3)",
      trafficSplit: "number[] (optional) - Traffic percentage for each variant (must sum to 100)",
      duration: "number (optional) - Test duration in days (default: 14)",
    },
    responseFields: {
      testId: "Unique test identifier",
      variants: "Array of test variants including control",
      status: "Test status (running, completed, paused)",
      startDate: "Test start timestamp",
      estimatedEndDate: "Estimated test end date",
    },
    example: {
      articleId: "article-123",
      metric: "CTR",
      keyword: "React hooks",
      originalTitle: "Understanding React Hooks",
      originalMetaDescription: "Learn about React hooks and how to use them effectively",
      variantCount: 3,
      duration: 14,
    },
  });
}
