import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { DEFAULT_BASE_URL } from "@/lib/constants";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { originalIdea, originalResearch, userFeedback } = await request.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;

        if (!originalIdea || !userFeedback) {
            return NextResponse.json(
                { error: "Original idea and user feedback are required" },
                { status: 400 }
            );
        }

        const currentDate = new Date().toISOString().split("T")[0];

        // Step 1: Reinterpret the idea with user feedback using GPT-4o
        const reinterpretation = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an SEO research strategist. The user has completed initial research on their article idea but wants to refine the focus based on feedback.

Your task: Incorporate the user's feedback into the original idea and generate 7 NEW research queries that reflect this refinement.

Return ONLY valid JSON (no markdown):
{
  "refinedMainTopic": "updated topic incorporating feedback",
  "targetAudience": "refined audience if changed",
  "contentAngle": "adjusted angle based on feedback",
  "researchQueries": [
    "7 NEW queries incorporating the feedback",
    "Include 'latest' or '${currentDate.split("-")[0]}' for recency",
    "Each query should reflect the user's requested focus"
  ],
  "changeSummary": "Brief explanation of how feedback changed the research direction"
}`,
                },
                {
                    role: "user",
                    content: `Original Idea: "${originalIdea}"

User Feedback: "${userFeedback}"

Generate refined research queries that incorporate this feedback.`,
                },
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = reinterpretation.choices[0].message.content || "{}";
        let refinedDecomposition;

        try {
            const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            refinedDecomposition = JSON.parse(cleaned);
        } catch (parseError) {
            console.error("Failed to parse refinement:", parseError);
            return NextResponse.json(
                { error: "Failed to generate refined queries" },
                { status: 500 }
            );
        }

        // Step 2: Research each refined query with Perplexity (parallel)
        const researchPromises = refinedDecomposition.researchQueries.map((query: string) =>
            fetch(`${baseUrl}/api/seo/research-topic`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query,
                    context: `Refined topic: ${refinedDecomposition.refinedMainTopic}. User feedback: ${userFeedback}`,
                }),
            }).then((res) => res.json())
        );

        const refinedResearchResults = await Promise.all(researchPromises);

        // Step 3: Aggregate refined research
        const aggregatedInsights = aggregateResearchData(refinedResearchResults);

        return NextResponse.json({
            refinedResearch: {
                decomposition: {
                    mainTopic: refinedDecomposition.refinedMainTopic,
                    targetAudience: refinedDecomposition.targetAudience,
                    contentAngle: refinedDecomposition.contentAngle,
                    researchQueries: refinedDecomposition.researchQueries,
                    estimatedWordCount: originalResearch?.decomposition?.estimatedWordCount || 2500,
                    contentType: originalResearch?.decomposition?.contentType || "guide",
                },
                researchResults: refinedResearchResults,
                aggregatedInsights,
                timestamp: new Date().toISOString(),
            },
            feedback: userFeedback,
            changeSummary: refinedDecomposition.changeSummary,
            success: true,
        });
    } catch (error: any) {
        console.error("Research refinement error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to refine research",
                success: false,
            },
            { status: 500 }
        );
    }
}

function aggregateResearchData(results: any[]) {
    const allKeyFindings: any[] = [];
    const allSources = new Set<string>();
    const allKeywords = new Set<string>();
    const allOutboundLinks: any[] = [];
    const sourceBreakdown: Record<string, number> = {};

    let oldestDate = new Date().toISOString();
    let newestDate = new Date("2000-01-01").toISOString();

    results.forEach((result) => {
        if (!result.success) return;

        if (result.keyFindings) {
            result.keyFindings.forEach((finding: any) => {
                allKeyFindings.push({ ...finding, query: result.query });

                if (finding.date) {
                    if (finding.date < oldestDate) oldestDate = finding.date;
                    if (finding.date > newestDate) newestDate = finding.date;
                }

                if (finding.url) {
                    allSources.add(finding.url);

                    if (finding.url.includes("reddit")) {
                        sourceBreakdown.reddit = (sourceBreakdown.reddit || 0) + 1;
                    } else if (finding.url.includes("twitter") || finding.url.includes("x.com")) {
                        sourceBreakdown.twitter = (sourceBreakdown.twitter || 0) + 1;
                    } else if (finding.url.includes("news.ycombinator")) {
                        sourceBreakdown.hackerNews = (sourceBreakdown.hackerNews || 0) + 1;
                    } else if (finding.url.includes("github")) {
                        sourceBreakdown.githubDiscussions = (sourceBreakdown.githubDiscussions || 0) + 1;
                    } else {
                        sourceBreakdown.blogs = (sourceBreakdown.blogs || 0) + 1;
                    }
                }
            });
        }

        if (result.trendingTopics) {
            result.trendingTopics.forEach((topic: string) => allKeywords.add(topic));
        }

        if (result.expertOpinions) {
            result.expertOpinions.forEach((opinion: any) => {
                if (opinion.source) {
                    const domain = new URL(opinion.source).hostname;
                    const da = estimateDomainAuthority(domain);

                    allOutboundLinks.push({
                        url: opinion.source,
                        title: `${opinion.expert} on ${result.query}`,
                        domain: domain.replace("www.", ""),
                        domainAuthority: da,
                        relevance: "expert opinion",
                    });
                }
            });
        }
    });

    const topKeywords = Array.from(allKeywords).slice(0, 3);
    const titleSuggestions = topKeywords.length > 0 ? [
        `${topKeywords[0]}: The Complete Guide for 2026`,
        `Mastering ${topKeywords[0]} - ${topKeywords[1] || "Expert Insights"}`,
        `${topKeywords[0]} vs ${topKeywords[1] || "Alternatives"}: Which is Better?`
    ] : [];

    const topOutboundLinks = allOutboundLinks
        .sort((a, b) => b.domainAuthority - a.domainAuthority)
        .slice(0, 10);

    return {
        totalSources: allSources.size,
        sourceBreakdown,
        dateRange: {
            oldest: oldestDate,
            newest: newestDate,
        },
        topKeywords: Array.from(allKeywords).slice(0, 10),
        recommendedOutboundLinks: topOutboundLinks,
        semanticKeywords: Array.from(allKeywords),
        titleSuggestions,
        totalFindings: allKeyFindings.length,
    };
}

function estimateDomainAuthority(domain: string): number {
    const highAuthDomains: Record<string, number> = {
        "reddit.com": 92,
        "stackoverflow.com": 95,
        "github.com": 96,
        "medium.com": 91,
        "twitter.com": 94,
        "x.com": 94,
        "news.ycombinator.com": 89,
    };

    if (domain.endsWith(".edu")) return 95;
    if (domain.endsWith(".org")) return 85;
    if (domain.endsWith(".gov")) return 98;

    return highAuthDomains[domain] || 70;
}
