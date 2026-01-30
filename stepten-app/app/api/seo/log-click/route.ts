/**
 * API Route: Log A/B Test Click
 * POST /api/seo/log-click
 *
 * Logs a click event when a user clicks on an article variant in search results
 */

import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/error-handler";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface LogClickRequest {
  testId: string;
  variantId: string;
  impressionId?: string; // Links click to specific impression
  sessionId?: string;
  timeOnPage?: number; // Time spent on page in seconds
  bounced?: boolean; // Did user bounce (leave quickly)?
  converted?: boolean; // Did user complete desired action?
}

interface LogClickResponse {
  success: boolean;
  data?: {
    clickId: string;
    variantId: string;
    timestamp: string;
  };
  error?: string;
}

/**
 * POST handler for logging clicks
 *
 * Records when a user clicks on an article variant from search results
 *
 * @example
 * POST /api/seo/log-click
 * {
 *   "testId": "test-123",
 *   "variantId": "variant-456",
 *   "impressionId": "impression-789",
 *   "sessionId": "session-abc",
 *   "timeOnPage": 120,
 *   "bounced": false
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<LogClickResponse>> {
  try {
    // Parse and validate request body
    const body: LogClickRequest = await request.json();

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

    const timestamp = new Date().toISOString();

    // Log click to database
    const { data: clickData, error: clickError } = await supabase
      .from("ab_clicks")
      .insert({
        test_id: body.testId,
        variant_id: body.variantId,
        impression_id: body.impressionId || null,
        session_id: body.sessionId || null,
        time_on_page: body.timeOnPage || null,
        bounced: body.bounced || false,
        converted: body.converted || false,
        timestamp,
      })
      .select()
      .single();

    if (clickError || !clickData) {
      console.error("[Log Click] Database error:", clickError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to log click",
        },
        { status: 500 }
      );
    }

    // Update variant click count and metrics
    const { error: updateError } = await supabase.rpc("increment_variant_clicks", {
      variant_id_param: body.variantId,
      time_on_page_param: body.timeOnPage || null,
      bounced_param: body.bounced || false,
    });

    if (updateError) {
      console.error("[Log Click] Error updating variant metrics:", updateError);
      // Don't fail the request - click is logged
    }

    // Update CTR in variant
    const { data: variantData } = await supabase
      .from("ab_variants")
      .select("impressions, clicks")
      .eq("id", body.variantId)
      .single();

    if (variantData) {
      const ctr = variantData.impressions > 0
        ? variantData.clicks / variantData.impressions
        : 0;

      await supabase
        .from("ab_variants")
        .update({ ctr })
        .eq("id", body.variantId);
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          clickId: clickData.id,
          variantId: body.variantId,
          timestamp,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Log Click] Error:", error);

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
    endpoint: "/api/seo/log-click",
    method: "POST",
    description: "Logs a click event when a user clicks on an article variant from search results",
    requestBody: {
      testId: "string (required) - The A/B test ID",
      variantId: "string (required) - The variant ID that was clicked",
      impressionId: "string (optional) - Links click to a specific impression event",
      sessionId: "string (optional) - User session identifier",
      timeOnPage: "number (optional) - Time spent on page in seconds",
      bounced: "boolean (optional) - Whether user bounced (left quickly)",
      converted: "boolean (optional) - Whether user completed desired action",
    },
    responseFields: {
      clickId: "Unique click record ID",
      variantId: "The variant that was clicked",
      timestamp: "Click timestamp",
    },
    example: {
      testId: "test-123",
      variantId: "variant-456",
      impressionId: "impression-789",
      sessionId: "session-abc",
      timeOnPage: 120,
      bounced: false,
      converted: false,
    },
    notes: [
      "Call this endpoint when a user clicks on a variant in search results",
      "Optionally call again when user leaves to update timeOnPage and bounced",
      "Clicks are used to calculate CTR (clicks / impressions)",
      "impressionId links click to specific impression for accurate attribution",
      "Session ID helps identify return visitors vs new clicks",
    ],
  });
}
