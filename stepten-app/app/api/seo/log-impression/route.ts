/**
 * API Route: Log A/B Test Impression
 * POST /api/seo/log-impression
 *
 * Logs an impression (page view) for an A/B test variant
 */

import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/error-handler";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface LogImpressionRequest {
  testId: string;
  variantId: string;
  sessionId?: string;
  userAgent?: string;
  referrer?: string;
  searchQuery?: string;
  position?: number; // Position in search results
}

interface LogImpressionResponse {
  success: boolean;
  data?: {
    impressionId: string;
    variantId: string;
    timestamp: string;
  };
  error?: string;
}

/**
 * POST handler for logging impressions
 *
 * Records when a user views an article variant in search results
 *
 * @example
 * POST /api/seo/log-impression
 * {
 *   "testId": "test-123",
 *   "variantId": "variant-456",
 *   "sessionId": "session-789",
 *   "searchQuery": "react hooks tutorial",
 *   "position": 3
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<LogImpressionResponse>> {
  try {
    // Parse and validate request body
    const body: LogImpressionRequest = await request.json();

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

    if (!body.variantId || typeof body.variantId !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "variantId is required and must be a string",
        },
        { status: 400 }
      );
    }

    // Extract metadata
    const userAgent = body.userAgent || request.headers.get("user-agent") || "unknown";
    const referrer = body.referrer || request.headers.get("referer") || null;

    const timestamp = new Date().toISOString();

    // Log impression to database
    const { data: impressionData, error: impressionError } = await supabase
      .from("ab_impressions")
      .insert({
        test_id: body.testId,
        variant_id: body.variantId,
        session_id: body.sessionId || null,
        user_agent: userAgent,
        referrer: referrer,
        search_query: body.searchQuery || null,
        position: body.position || null,
        timestamp,
      })
      .select()
      .single();

    if (impressionError || !impressionData) {
      console.error("[Log Impression] Database error:", impressionError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to log impression",
        },
        { status: 500 }
      );
    }

    // Update variant impression count
    const { error: updateError } = await supabase.rpc("increment_variant_impressions", {
      variant_id_param: body.variantId,
    });

    if (updateError) {
      console.error("[Log Impression] Error updating variant count:", updateError);
      // Don't fail the request - impression is logged
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          impressionId: impressionData.id,
          variantId: body.variantId,
          timestamp,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Log Impression] Error:", error);

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

/**
 * GET handler - returns API documentation
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    endpoint: "/api/seo/log-impression",
    method: "POST",
    description: "Logs an impression (page view) for an A/B test variant",
    requestBody: {
      testId: "string (required) - The A/B test ID",
      variantId: "string (required) - The variant ID that was shown",
      sessionId: "string (optional) - User session identifier",
      userAgent: "string (optional) - User agent string (auto-detected if not provided)",
      referrer: "string (optional) - Referrer URL (auto-detected if not provided)",
      searchQuery: "string (optional) - Search query that led to the impression",
      position: "number (optional) - Position in search results (1-10)",
    },
    responseFields: {
      impressionId: "Unique impression record ID",
      variantId: "The variant that was shown",
      timestamp: "Impression timestamp",
    },
    example: {
      testId: "test-123",
      variantId: "variant-456",
      sessionId: "session-789",
      searchQuery: "react hooks tutorial",
      position: 3,
    },
    notes: [
      "Call this endpoint each time a variant appears in search results",
      "Impressions are used to calculate CTR",
      "User agent and referrer are auto-detected from headers if not provided",
      "Session ID helps track unique users vs repeat visitors",
    ],
  });
}
