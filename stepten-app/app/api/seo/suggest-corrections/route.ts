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

        // Use GPT-4o-mini for cost-effective correction suggestions
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a text correction assistant. Analyze the provided text and identify:
1. Non-English words (that are clearly mistakes, not proper nouns)
2. Spelling mistakes
3. Words that don't exist in English

Return ONLY a JSON array of corrections in this exact format:
[
  {
    "original": "the incorrect word",
    "suggestion": "the corrected word",
    "position": 0,
    "reason": "spelling mistake"
  }
]

If no corrections are needed, return an empty array: []

Do not include explanations or markdown formatting, ONLY the JSON array.`,
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            temperature: 0.3,
            max_tokens: 500,
        });

        const responseText = completion.choices[0].message.content || "[]";

        // Parse the JSON response
        let corrections = [];
        try {
            // Remove any markdown code blocks if present
            const cleanedResponse = responseText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            corrections = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Failed to parse corrections:", parseError);
            corrections = [];
        }

        return NextResponse.json({
            corrections,
            success: true,
        });
    } catch (error: any) {
        console.error("Text correction error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to suggest corrections",
                success: false,
            },
            { status: 500 }
        );
    }
}
