import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { draftId, data } = body || {};

        if (!draftId || !data) {
            return NextResponse.json(
                { error: "Missing required fields: draftId, data" },
                { status: 400 }
            );
        }

        const supabase = createServerClient();
        const { error } = await supabase
            .from("article_drafts")
            .upsert({
                draft_id: draftId,
                data,
            });

        if (error) {
            console.error("Draft autosave error:", error);
            return NextResponse.json(
                { error: "Failed to autosave draft", details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Draft autosave error:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}
