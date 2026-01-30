import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = createServerClient();

        // Get the most recent draft (within last 24 hours)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from("article_drafts")
            .select("draft_id, updated_at")
            .gte("updated_at", oneDayAgo)
            .order("updated_at", { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            // No recent draft found
            return NextResponse.json({ draftId: null });
        }

        return NextResponse.json({
            success: true,
            draftId: data.draft_id,
            lastUpdated: data.updated_at
        });
    } catch (error: any) {
        console.error("Recent draft fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
