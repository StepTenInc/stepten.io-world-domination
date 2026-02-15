import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { ideaText } = await request.json();

        if (!ideaText || typeof ideaText !== "string") {
            return NextResponse.json(
                { error: "No idea text provided" },
                { status: 400 }
            );
        }

        // Use GPT-4o for premium quality idea decomposition
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert SEO research strategist. Analyze the user's article idea and break it down into specific, targeted research queries.

Your goal: Generate 7 highly specific research queries that will produce the most comprehensive, current, and valuable information for writing an exceptional SEO article.

Consider:
- Current trends and recent developments (last 4 weeks especially)
- Different angles: overview, comparisons, techniques, controversies, expert opinions
- Practical examples and real-world use cases
- Technical depth appropriate for the audience
- Emerging topics and cutting-edge developments

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "mainTopic": "clear focused topic statement",
  "targetAudience": "specific audience description",
  "contentAngle": "unique perspective or approach",
  "researchQueries": [
    "specific query 1 (include 'latest' or '2026' for recency)",
    "specific query 2 (comparison or vs query)",
    "specific query 3 (technique or how-to focused)",
    "specific query 4 (expert opinions or best practices)",
    "specific query 5 (challenges or limitations)",
    "specific query 6 (real-world examples or case studies)",
    "specific query 7 (emerging trends or future outlook)"
  ],
  "estimatedWordCount": 2500,
  "contentType": "tutorial"
}`,
                },
                {
                    role: "user",
                    content: `Break down this article idea into research queries:\n\n"${ideaText}"`,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0].message.content || "{}";

        // Parse the JSON response
        let decomposition;
        try {
            const cleanedResponse = responseText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            decomposition = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Failed to parse decomposition:", parseError);
            return NextResponse.json(
                { error: "Failed to decompose idea into research queries" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            decomposition,
            success: true,
        });
    } catch (error: any) {
        console.error("Idea decomposition error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to decompose idea",
                success: false,
            },
            { status: 500 }
        );
    }
}
