import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { idea, research, selectedKeywords, selectedLinks, mainKeyword } = await request.json();

        if (!idea || !research || !mainKeyword) {
            return NextResponse.json(
                { error: "Idea, research, and main keyword are required" },
                { status: 400 }
            );
        }

        // Get active research version
        const activeResearch = research.activeVersion === "refined" && research.versions.refined
            ? research.versions.refined
            : research.versions.original;

        const targetWordCount = activeResearch.decomposition.estimatedWordCount || 2500;

        // Build comprehensive prompt for Claude 4.5
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 8000,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: `You are an SEO expert creating an article framework that scores 100/100 on Rank Math.

## USER'S ARTICLE IDEA:
"${idea}"

## FOCUS KEYWORD:
"${mainKeyword}"

## TARGET WORD COUNT:
${targetWordCount} words (based on competition analysis)

## RESEARCH INSIGHTS:
Main Topic: ${activeResearch.decomposition.mainTopic}
Target Audience: ${activeResearch.decomposition.targetAudience}
Content Angle: ${activeResearch.decomposition.contentAngle}
Content Type: ${activeResearch.decomposition.contentType}

## SEMANTIC KEYWORDS TO INCORPORATE:
${selectedKeywords?.join(", ") || "N/A"}

## VERIFIED OUTBOUND LINKS TO INCLUDE:
${selectedLinks?.map((link: any, i: number) => `
${i + 1}. [${link.relation}] ${link.title}
   URL: ${link.url}
   DA: ${link.domainAuthority}
   Anchor suggestion: "${link.title.split(":")[0]}"
`).join("\n") || "No links provided"}

## YOUR TASK:
Create a comprehensive article framework optimized for Rank Math 100/100 score.

## RANK MATH 100/100 REQUIREMENTS:
1. Focus keyword in H1 title
2. Focus keyword in first 100 words
3. Focus keyword density 0.5-2.5%
4. Minimum ${targetWordCount} words
5. At least 3 outbound links (from provided list)
6. Proper heading hierarchy (H1 → H2 → H3)
7. Semantic keywords throughout
8. Short paragraphs (max 150 words)
9. Short sentences (avg 15-20 words)
10. Readability: 8th grade or below

## CONTENT STRUCTURE RULES:
- **H1**: ONE only, must contain focus keyword
- **H2**: 5-7 main sections
- **H3**: 2-4 subsections per H2
- **Paragraphs**: 2-4 sentences, max 150 words
- **Lists**: Every 300-400 words
- **Examples**: 2-3 practical examples
- **Statistics**: 3-5 statistics (from research)
- **Expert Quotes**: 1-2 expert opinions

## ANTI-AI DETECTION STRATEGIES:
1. Vary sentence structure (mix 5-10 word and 15-20 word sentences)
2. Use contractions ("don't", "can't", "it's")
3. Include placeholders for personal anecdotes: [ADD PERSONAL EXPERIENCE HERE]
4. Occasional sentence fragments for emphasis
5. Colloquialisms and industry slang
6. Light humor and personality
7. Unexpected transitions (avoid "Furthermore", "Moreover")
8. Questions to reader ("Have you ever...?")
9. Varied paragraph lengths (don't make all same length)
10. Human emotions (excitement, frustration, curiosity)

## PLAGIARISM PREVENTION:
- Unique angles on the topic
- Original examples and analogies
- Personal voice and opinions
- Custom structure (not copied from competitors)
- Synthesize research, don't copy

## OUTPUT FORMAT:
Return ONLY valid JSON (no markdown code blocks):

{
  "metadata": {
    "title": "SEO title with focus keyword (50-60 chars)",
    "metaDescription": "Compelling description with keyword and CTA (150-160 chars)",
    "slug": "url-friendly-slug-with-keyword",
    "focusKeyword": "${mainKeyword}",
    "wordCountTarget": ${targetWordCount},
    "readingLevel": "8th grade",
    "estimatedReadTime": "X minutes"
  },
  "outline": [
    {
      "type": "h1",
      "text": "Main Title (must include focus keyword)",
      "instructions": "Hook: Start with surprising stat or provocative question"
    },
    {
      "type": "introduction",
      "paragraphs": 2,
      "wordCount": 150,
      "mustInclude": ["focus keyword in first 100 words", "what reader will learn"],
      "instructions": "Set context, preview value"
    },
    {
      "type": "h2",
      "text": "Section Title",
      "subsections": [
        {
          "type": "h3",
          "text": "Subsection Title",
          "content": {
            "paragraphs": 2,
            "wordCount": 250,
            "elements": ["2-3 bullet points", "practical example"],
            "linkPlacements": [
              {
                "url": "${selectedLinks?.[0]?.url || '[INSERT LINK]'}",
                "anchorText": "natural anchor text suggestion",
                "relation": "${selectedLinks?.[0]?.recommendation?.relation || 'nofollow'}",
                "placement": "in paragraph 1 naturally"
              }
            ]
          },
          "instructions": "Specific writing guidance for this section"
        }
      ]
    },
    {
      "type": "conclusion",
      "paragraphs": 2,
      "wordCount": 150,
      "mustInclude": ["summarize key points", "actionable CTA"],
      "instructions": "End with clear next step for reader"
    }
  ],
  "seoChecklist": {
    "focusKeywordInTitle": true,
    "focusKeywordInFirst100Words": true,
    "minimumWordCount": ${targetWordCount},
    "outboundLinksPlanned": 3,
    "internalLinksPlanned": 2,
    "imagesPlanned": 4,
    "listsPlanned": 5,
    "examplesPlanned": 3
  },
  "writingGuidelines": {
    "tone": "conversational yet authoritative",
    "perspective": "second person (you/your)",
    "voiceCharacteristics": [
      "Use contractions liberally",
      "Ask 3-5 rhetorical questions",
      "Include 2-3 personal opinions",
      "Vary sentence length: 40% short (5-10 words), 50% medium (11-20), 10% long (21+)"
    ],
    "antiAITactics": [
      "Start paragraphs with questions occasionally",
      "Use em dashes for emphasis—like this",
      "Include incomplete sentences. For dramatic effect.",
      "Mix formal and casual language throughout",
      "Add unexpected metaphors or analogies",
      "Use industry-specific jargon naturally"
    ],
    "keywordIntegration": {
      "focusKeyword": "${mainKeyword}",
      "targetDensity": "1.5%",
      "semanticKeywords": ${JSON.stringify(selectedKeywords || [])},
      "placement": "Natural integration, avoid keyword stuffing"
    }
  }
}

Generate this framework now, optimized for Rank Math 100/100.`,
                },
            ],
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "";

        // Parse the framework
        let framework;
        try {
            const cleaned = responseText
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            framework = JSON.parse(cleaned);
        } catch (parseError) {
            console.error("Failed to parse framework:", parseError);
            console.error("Raw response:", responseText);
            return NextResponse.json(
                {
                    error: "Failed to generate framework",
                    rawResponse: responseText
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            framework,
            success: true,
        });
    } catch (error: any) {
        console.error("Framework generation error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to generate framework",
                success: false,
            },
            { status: 500 }
        );
    }
}
