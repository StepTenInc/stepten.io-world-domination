/**
 * API Route: Analyze A/B Test
 * POST /api/seo/analyze-test
 *
 * Analyzes A/B test results and determines statistical significance
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeTest } from "@/lib/test-analyzer";
import { getErrorMessage } from "@/lib/error-handler";
import { createClient } from "@supabase/supabase-js";
import type { ABTestVariant } from "@/lib/seo-types";
import type { TestResults } from "@/lib/test-analyzer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AnalyzeTestRequest {
  testId: string;
  confidenceLevel?: number; // 0.90, 0.95, 0.99
  minSampleSize?: number;
}

interface AnalyzeTestResponse {
  success: boolean;
  data?: TestResults;
  error?: string;
  timestamp?: string;
}

/**
 * POST handler for analyzing A/B tests
 *
 * Performs statistical analysis on test results and identifies winner
 *
 * @example
 * POST /api/seo/analyze-test
 * {
 *   "testId": "test-123",
 *   "confidenceLevel": 0.95,
 *   "minSampleSize": 100
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalyzeTestResponse>> {
  try {
    // Parse and validate request body
    const body: AnalyzeTestRequest = await request.json();

    // Validation
    if (!body.testId || typeof body.testId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "testId is required and must be a string",
        },
        { status: 400 }
      );
    }

    const confidenceLevel = body.confidenceLevel || 0.95;
    const minSampleSize = body.minSampleSize || 100;

    // Validate confidence level
    if (confidenceLevel < 0.8 || confidenceLevel > 0.99) {
      return NextResponse.json(
        {
          success: false,
          error: "confidenceLevel must be between 0.8 and 0.99",
        },
        { status: 400 }
      );
    }

    console.log(`[Analyze Test] Analyzing test ${body.testId}`);

    // Fetch test data from database
    const { data: testData, error: testError } = await supabase
      .from("ab_tests")
      .select("*")
      .eq("id", body.testId)
      .single();

    if (testError || !testData) {
      console.error("[Analyze Test] Test not found:", testError);
      return NextResponse.json(
        {
          success: false,
          error: "Test not found",
        },
        { status: 404 }
      );
    }

    // Fetch variants for this test
    const { data: variantsData, error: variantsError } = await supabase
      .from("ab_variants")
      .select("*")
      .eq("test_id", body.testId);

    if (variantsError || !variantsData || variantsData.length === 0) {
      console.error("[Analyze Test] Variants not found:", variantsError);
      return NextResponse.json(
        {
          success: false,
          error: "No variants found for this test",
        },
        { status: 404 }
      );
    }

    // Transform database variants to ABTestVariant format
    const variants: ABTestVariant[] = variantsData.map((v) => ({
      id: v.id,
      name: v.name,
      title: v.title,
      metaDescription: v.meta_description,
      heroImage: v.hero_image || undefined,
      traffic: v.traffic,
      impressions: v.impressions,
      clicks: v.clicks,
      ctr: v.ctr,
      avgTimeOnPage: v.avg_time_on_page,
      bounceRate: v.bounce_rate,
    }));

    console.log(
      `[Analyze Test] Found ${variants.length} variants with total ${variants.reduce((sum, v) => sum + v.impressions, 0)} impressions`
    );

    // Perform statistical analysis
    const results = await analyzeTest({
      testId: body.testId,
      variants,
      startDate: testData.start_date,
      confidenceLevel,
      minSampleSize,
    });

    // Update test status in database if completed
    if (results.status === "completed" && results.winner) {
      await supabase
        .from("ab_tests")
        .update({
          status: "completed",
          winner: results.winner.variantId,
          end_date: results.endDate,
          confidence: results.winner.confidence,
        })
        .eq("id", body.testId);

      console.log(
        `[Analyze Test] Test completed. Winner: ${results.winner.variantName}`
      );
    } else if (results.status === "inconclusive") {
      await supabase
        .from("ab_tests")
        .update({
          status: "paused",
        })
        .eq("id", body.testId);

      console.log(`[Analyze Test] Test inconclusive after ${results.testDuration} days`);
    }

    return NextResponse.json(
      {
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Analyze Test] Error:", error);

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
 * GET handler for fetching test results by ID
 *
 * Returns current test status and results without re-analyzing
 *
 * @example
 * GET /api/seo/analyze-test?testId=test-123
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const testId = searchParams.get("testId");

    if (!testId) {
      return NextResponse.json(
        {
          endpoint: "/api/seo/analyze-test",
          methods: ["POST", "GET"],
          description: "Analyzes A/B test results with statistical significance calculations",
          postRequestBody: {
            testId: "string (required) - The A/B test ID to analyze",
            confidenceLevel: "number (optional) - Required confidence level (0.8-0.99, default: 0.95)",
            minSampleSize: "number (optional) - Minimum sample size per variant (default: 100)",
          },
          getQueryParams: {
            testId: "string (required) - The A/B test ID to fetch results for",
          },
          responseFields: {
            testId: "The test identifier",
            status: "Test status: running, completed, or inconclusive",
            variants: "Array of variant statistics (impressions, clicks, CTR, etc.)",
            winner: "Winning variant information (if test is complete)",
            comparisons: "Statistical comparisons between all variant pairs",
            recommendations: "Actionable recommendations based on results",
            sampleSize: "Total impressions across all variants",
            minSampleSizeReached: "Whether minimum sample size is reached",
            testDuration: "Duration in days since test started",
          },
          example: {
            testId: "test-123",
            confidenceLevel: 0.95,
            minSampleSize: 100,
          },
          notes: [
            "Uses z-test for proportions to determine statistical significance",
            "Automatically updates test status when winner is determined",
            "Provides recommendations even if no clear winner exists",
            "Confidence level of 0.95 means 95% confidence in results",
          ],
        },
        { status: 200 }
      );
    }

    // Fetch test and variants
    const { data: testData, error: testError } = await supabase
      .from("ab_tests")
      .select("*")
      .eq("id", testId)
      .single();

    if (testError || !testData) {
      return NextResponse.json(
        {
          success: false,
          error: "Test not found",
        },
        { status: 404 }
      );
    }

    const { data: variantsData, error: variantsError } = await supabase
      .from("ab_variants")
      .select("*")
      .eq("test_id", testId);

    if (variantsError || !variantsData) {
      return NextResponse.json(
        {
          success: false,
          error: "Variants not found",
        },
        { status: 404 }
      );
    }

    // Return current test data without re-analyzing
    return NextResponse.json(
      {
        success: true,
        data: {
          testId: testData.id,
          articleId: testData.article_id,
          metric: testData.metric,
          status: testData.status,
          startDate: testData.start_date,
          endDate: testData.end_date,
          duration: testData.duration,
          winner: testData.winner,
          confidence: testData.confidence,
          variants: variantsData.map((v) => ({
            id: v.id,
            name: v.name,
            title: v.title,
            metaDescription: v.meta_description,
            traffic: v.traffic,
            impressions: v.impressions,
            clicks: v.clicks,
            ctr: v.ctr,
            ctrPercent: `${(v.ctr * 100).toFixed(2)}%`,
            avgTimeOnPage: v.avg_time_on_page,
            bounceRate: v.bounce_rate,
          })),
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Get Test] Error:", error);

    const errorMessage = getErrorMessage(error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
