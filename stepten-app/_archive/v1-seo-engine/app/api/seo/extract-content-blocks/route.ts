import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { article, title } = await request.json();

        if (!article) {
            return NextResponse.json(
                { error: "Article content is required" },
                { status: 400 }
            );
        }

        // Build comprehensive extraction prompt
        const prompt = `You are an expert content analyst. Analyze this article and extract compelling content blocks that will enhance reader engagement and comprehension.

## ARTICLE TITLE:
${title || "Untitled Article"}

## ARTICLE CONTENT:
${article}

---

## YOUR MISSION:
Extract and create the following content blocks from this article. Be intelligent about it - pull actual data, quotes, and insights from the article. If something doesn't exist in the article, generate it based on the article's context and themes.

## REQUIRED CONTENT BLOCKS:

### 1. KEY TAKEAWAY (1-2 sentences)
The single most important insight or lesson from this article. Make it punchy and memorable.
- Should capture the essence of the article
- Use active voice
- Make it quotable

### 2. EXPERT QUOTE
Either extract a great quote from the article OR generate one that sounds like an expert in this field would say it.
- Include attribution (real person if mentioned, or "Industry Expert" / field expert)
- 1-2 sentences max
- Should be insightful and authoritative

### 3. STATS HIGHLIGHT
Extract 2-3 key numbers/statistics from the article. Format as "X% Something | Y Number Another Thing | Z Metric Third Thing"
- Use actual numbers from the article if available
- If no stats exist, identify what COULD be measured
- Keep labels concise

### 4. ACTION CHECKLIST (3-5 items)
Practical, actionable steps the reader can take based on the article content.
- Start each item with an action verb
- Keep items specific and achievable
- Order from easiest to most involved

### 5. BEFORE/AFTER COMPARISON
Create a comparison table showing the transformation or improvement discussed in the article.
Format as: "Before: [situation] | After: [improved situation]"
If multiple comparisons, separate with newlines.
- Highlight the contrast
- Make it concrete and specific

### 6. FAQ (2-3 questions with answers)
Common questions readers would have about this topic, with concise answers.
- Questions should be specific and relevant
- Answers should be 1-2 sentences
- Pull from article content or logical extensions

---

## OUTPUT FORMAT:
Return ONLY valid JSON (no markdown, no code blocks) in this exact structure:

{
  "keyTakeaway": "The main insight...",
  "expertQuote": {
    "quote": "The actual quote text...",
    "attribution": "Dr. Jane Smith, AI Researcher"
  },
  "statsHighlight": [
    { "value": "40%", "label": "Productivity Gain" },
    { "value": "35%", "label": "Cost Reduction" },
    { "value": "3x", "label": "Faster Processing" }
  ],
  "actionChecklist": [
    "Identify your biggest operational bottleneck",
    "Research AI tools that address this pain point",
    "Sign up for free trials of 2-3 solutions",
    "Run a 30-day pilot program",
    "Measure and document results"
  ],
  "beforeAfter": {
    "before": [
      "Manual data entry taking 5 hours per day",
      "Human error rate of 15%",
      "Limited processing capacity"
    ],
    "after": [
      "Automated data processing in under 10 minutes",
      "Error rate reduced to less than 1%",
      "10x increase in processing capacity"
    ]
  },
  "faq": [
    {
      "question": "How much does it cost to get started?",
      "answer": "Most AI tools offer free trials, with paid plans starting around $20-50/month for small teams."
    },
    {
      "question": "Do I need technical expertise?",
      "answer": "Not for most modern AI tools - they're designed to be user-friendly with minimal setup required."
    },
    {
      "question": "How long until I see results?",
      "answer": "Many businesses see measurable improvements within 2-4 weeks of implementation."
    }
  ]
}

CRITICAL: Return ONLY the JSON object. No explanations, no markdown, no code blocks.`;

        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            temperature: 0.7, // Balanced for accuracy and creativity
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        let responseText = message.content[0].type === "text" ? message.content[0].text : "";

        // Clean up response - remove markdown code blocks if present
        responseText = responseText.trim();
        responseText = responseText.replace(/^```json\n?/g, "").replace(/^```\n?/g, "").replace(/\n?```$/g, "");

        // Parse JSON response
        let contentBlocks;
        try {
            contentBlocks = JSON.parse(responseText);
        } catch (parseError) {
            console.error("Failed to parse Claude response:", parseError);
            console.error("Raw response:", responseText);

            // Return fallback data if parsing fails
            return NextResponse.json(
                { error: "Failed to parse AI response", success: false },
                { status: 500 }
            );
        }

        // Validate structure
        if (!contentBlocks.keyTakeaway || !contentBlocks.expertQuote || !contentBlocks.statsHighlight ||
            !contentBlocks.actionChecklist || !contentBlocks.beforeAfter || !contentBlocks.faq) {
            console.error("Incomplete content blocks structure:", contentBlocks);
            return NextResponse.json(
                { error: "Incomplete content blocks extracted", success: false },
                { status: 500 }
            );
        }

        return NextResponse.json({
            contentBlocks,
            success: true,
        });
    } catch (error: any) {
        console.error("Content blocks extraction error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to extract content blocks",
                success: false,
            },
            { status: 500 }
        );
    }
}
