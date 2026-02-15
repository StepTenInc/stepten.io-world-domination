import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { article, feedback, framework } = await request.json();

        if (!article || !feedback) {
            return NextResponse.json(
                { error: "Article and feedback are required" },
                { status: 400 }
            );
        }

        // Step 1: Analyze what needs to change using GPT-4o
        const analysisCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are analyzing user feedback on an article. Identify specific changes needed.

Return ONLY valid JSON:
{
  "changeSummary": "Brief summary of what user wants changed",
  "specificChanges": [
    {
      "section": "Which section/paragraph (use heading or first few words)",
      "currentIssue": "What's wrong currently",
      "requestedChange": "What user wants instead",
      "priority": "high/medium/low"
    }
  ],
  "globalChanges": {
    "tone": "any tone adjustments",
    "style": "any style changes",
    "content": "any content additions/removals"
  }
}`,
                },
                {
                    role: "user",
                    content: `Article excerpt:
${article.substring(0, 3000)}...

User Feedback:
"${feedback}"

What specific changes are needed?`,
                },
            ],
            temperature: 0.3,
            max_tokens: 1500,
        });

        const analysisText = analysisCompletion.choices[0].message.content || "{}";
        let changeAnalysis;

        try {
            const cleaned = analysisText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            changeAnalysis = JSON.parse(cleaned);
        } catch (parseError) {
            return NextResponse.json(
                { error: "Failed to analyze feedback" },
                { status: 500 }
            );
        }

        // Step 2: Apply changes using Claude
        const revisionMessage = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 16000,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: `You are revising an article based on user feedback.

## ORIGINAL ARTICLE:
${article}

## USER FEEDBACK:
"${feedback}"

## CHANGE ANALYSIS:
${JSON.stringify(changeAnalysis, null, 2)}

## YOUR TASK:
Revise the article incorporating the user's feedback. Maintain the overall structure and quality, but make the specific changes requested.

**CRITICAL:** To mark changes for highlighting, wrap ONLY the changed portions in <mark> tags. Do NOT wrap the entire article.

Example:
BEFORE: <p>This is the old sentence.</p>
AFTER: <p><mark>This is the improved sentence.</mark></p>

Output the COMPLETE revised article with <mark> tags around changes.`,
                },
            ],
        });

        const revisedArticle = revisionMessage.content[0].type === "text" ? revisionMessage.content[0].text : "";

        return NextResponse.json({
            originalArticle: article,
            revisedArticle,
            changeAnalysis,
            changesCount: (revisedArticle.match(/<mark>/g) || []).length,
            success: true,
        });
    } catch (error: any) {
        console.error("Article revision error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to revise article",
                success: false,
            },
            { status: 500 }
        );
    }
}
