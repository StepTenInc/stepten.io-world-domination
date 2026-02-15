import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ draftId: string }> }
) {
    try {
        const { draftId } = await params;

        if (!draftId) {
            return NextResponse.json(
                { error: "Draft ID is required" },
                { status: 400 }
            );
        }

        const supabase = createServerClient();
        const { data, error } = await supabase
            .from("article_drafts")
            .select("*")
            .eq("draft_id", draftId)
            .single();

        if (error) {
            console.error("Draft fetch error:", error);
            return NextResponse.json(
                { error: "Draft not found", details: error.message },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            draft: data
        });
    } catch (error: any) {
        console.error("Draft fetch error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
