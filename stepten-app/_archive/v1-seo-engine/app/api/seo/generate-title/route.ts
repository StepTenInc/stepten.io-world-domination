import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== "string") {
            return NextResponse.json(
                { error: "No text provided" },
                { status: 400 }
            );
        }

        // Use GPT-4o-mini to generate a compelling article title
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are an SEO expert. Generate a compelling, click-worthy article title based on the provided text.

The title should be:
- 50-60 characters long
- Engaging and actionable
- SEO-optimized with relevant keywords
- Clear about the article's value proposition

Return ONLY the title text, nothing else.`,
                },
                {
                    role: "user",
                    content: `Generate an article title for this idea:\n\n${text.substring(0, 500)}`,
                },
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        const title = completion.choices[0].message.content?.trim() || "";

        return NextResponse.json({
            title,
            success: true,
        });
    } catch (error: any) {
        console.error("Title generation error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to generate title",
                success: false,
            },
            { status: 500 }
        );
    }
}
