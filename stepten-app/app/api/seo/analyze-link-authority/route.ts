import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { links } = await request.json();

        if (!links || !Array.isArray(links)) {
            return NextResponse.json(
                { error: "Links array is required" },
                { status: 400 }
            );
        }

        // Analyze all links in parallel with GPT-4o-mini
        const analysisPromises = links.map(async (link) => {
            try {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `You are an SEO expert deciding whether a link should be "follow" or "nofollow".

Google Guidelines:
- **follow**: High-quality editorial content, authoritative sources (.edu, .gov), reputable news sites
- **nofollow**: User-generated content (UGC), forums, comments, untrusted sources, commercial/affiliate links

Analyze the link and return ONLY valid JSON:
{
  "relation": "follow" or "nofollow",
  "reason": "brief explanation",
  "openInNewTab": true or false,
  "confidence": "high", "medium", or "low"
}`,
                        },
                        {
                            role: "user",
                            content: `Analyze this link:
URL: ${link.url}
Domain: ${link.domain}
Domain Authority: ${link.domainAuthority}
Context: ${link.relevance || "General reference"}

Should this be follow or nofollow?`,
                        },
                    ],
                    temperature: 0.3,
                    max_tokens: 200,
                });

                const responseText = completion.choices[0].message.content || "{}";

                try {
                    const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
                    const analysis = JSON.parse(cleaned);

                    return {
                        ...link,
                        recommendation: analysis,
                    };
                } catch (parseError) {
                    // Fallback logic if AI fails
                    return {
                        ...link,
                        recommendation: getFallbackRecommendation(link),
                    };
                }
            } catch (error) {
                return {
                    ...link,
                    recommendation: getFallbackRecommendation(link),
                };
            }
        });

        const analyzedLinks = await Promise.all(analysisPromises);

        return NextResponse.json({
            analyzedLinks,
            summary: {
                total: links.length,
                follow: analyzedLinks.filter((l) => l.recommendation?.relation === "follow").length,
                nofollow: analyzedLinks.filter((l) => l.recommendation?.relation === "nofollow").length,
            },
            success: true,
        });
    } catch (error: any) {
        console.error("Link analysis error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to analyze links",
                success: false,
            },
            { status: 500 }
        );
    }
}

function getFallbackRecommendation(link: any) {
    const domain = link.domain.toLowerCase();
    const da = link.domainAuthority || 0;

    // .edu, .gov, .org = follow
    if (domain.endsWith(".edu") || domain.endsWith(".gov")) {
        return {
            relation: "follow",
            reason: "Educational or government domain",
            openInNewTab: true,
            confidence: "high",
        };
    }

    // High DA editorial sites = follow
    if (da >= 90 && !isUGCDomain(domain)) {
        return {
            relation: "follow",
            reason: "High authority editorial site",
            openInNewTab: true,
            confidence: "high",
        };
    }

    // UGC sites = nofollow
    if (isUGCDomain(domain)) {
        return {
            relation: "nofollow",
            reason: "User-generated content",
            openInNewTab: true,
            confidence: "high",
        };
    }

    // Default: nofollow for safety
    return {
        relation: "nofollow",
        reason: "Default - safer for SEO",
        openInNewTab: true,
        confidence: "medium",
    };
}

function isUGCDomain(domain: string): boolean {
    const ugcDomains = [
        "reddit.com",
        "stackoverflow.com",
        "github.com", // Discussions/issues are UGC
        "twitter.com",
        "x.com",
        "facebook.com",
        "linkedin.com",
        "quora.com",
        "medium.com", // User content
    ];

    return ugcDomains.some((ugc) => domain.includes(ugc));
}
