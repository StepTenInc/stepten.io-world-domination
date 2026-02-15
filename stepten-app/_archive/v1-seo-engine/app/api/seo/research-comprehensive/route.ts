import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_BASE_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
    try {
        const { ideaText } = await request.json();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || DEFAULT_BASE_URL;

        if (!ideaText || typeof ideaText !== "string") {
            return NextResponse.json(
                { error: "No idea text provided" },
                { status: 400 }
            );
        }

        // Step 1: Decompose the idea into research queries
        const decomposeResponse = await fetch(
            `${baseUrl}/api/seo/decompose-idea`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ideaText }),
            }
        );

        if (!decomposeResponse.ok) {
            throw new Error("Failed to decompose idea");
        }

        const { decomposition } = await decomposeResponse.json();

        // Step 2: Research each query in parallel for maximum speed
        const researchPromises = decomposition.researchQueries.map((query: string) =>
            fetch(
                `${baseUrl}/api/seo/research-topic`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        query,
                        context: `Main topic: ${decomposition.mainTopic}. Target audience: ${decomposition.targetAudience}.`,
                    }),
                }
            ).then((res) => res.json())
        );

        const researchResults = await Promise.all(researchPromises);

        // Step 3: Aggregate insights
        const aggregatedInsights = aggregateResearchData(researchResults);

        return NextResponse.json({
            articleIdea: ideaText,
            decomposition,
            researchResults,
            aggregatedInsights,
            researchedAt: new Date().toISOString(),
            success: true,
        });
    } catch (error: any) {
        console.error("Comprehensive research error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to complete research",
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
    const allTitleSuggestions: string[] = [];
    const sourceBreakdown: Record<string, number> = {};

    let oldestDate = new Date().toISOString();
    let newestDate = new Date("2000-01-01").toISOString();

    results.forEach((result) => {
        if (!result.success) return;

        // Collect key findings
        if (result.keyFindings) {
            result.keyFindings.forEach((finding: any) => {
                allKeyFindings.push({
                    ...finding,
                    query: result.query,
                });

                // Track dates
                if (finding.date) {
                    if (finding.date < oldestDate) oldestDate = finding.date;
                    if (finding.date > newestDate) newestDate = finding.date;
                }

                // Track sources
                if (finding.url) {
                    allSources.add(finding.url);

                    // Count source types
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

        // Collect trending topics as keywords
        if (result.trendingTopics) {
            result.trendingTopics.forEach((topic: string) => allKeywords.add(topic));
        }

        // Collect expert opinions as potential outbound links
        if (result.expertOpinions) {
            result.expertOpinions.forEach((opinion: any) => {
                if (opinion.source) {
                    try {
                        const domain = new URL(opinion.source).hostname;
                        const da = estimateDomainAuthority(domain);

                        allOutboundLinks.push({
                            url: opinion.source,
                            title: `${opinion.expert} on ${result.query}`,
                            domain: domain.replace("www.", ""),
                            domainAuthority: da,
                            relevance: "expert opinion",
                        });
                    } catch (error) {
                        // Skip invalid URLs (e.g., "LinkedIn technical discussion thread")
                        console.log(`Skipping invalid URL: ${opinion.source}`);
                    }
                }
            });
        }
    });

    // Generate title suggestions based on trending topics
    if (allKeywords.size > 0) {
        const topKeywords = Array.from(allKeywords).slice(0, 3);
        allTitleSuggestions.push(
            `${topKeywords[0]}: The Complete Guide for 2026`,
            `Mastering ${topKeywords[0]} - ${topKeywords[1]} Explained`,
            `${topKeywords[0]} vs ${topKeywords[1]}: Which is Better?`
        );
    }

    // Sort outbound links by DA
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
        titleSuggestions: allTitleSuggestions,
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
        "anthropic.com": 85,
        "openai.com": 88,
        "google.com": 100,
        "microsoft.com": 98,
        "github.blog": 88,
        "dev.to": 81,
    };

    // Check for .edu or .org
    if (domain.endsWith(".edu")) return 95;
    if (domain.endsWith(".org")) return 85;
    if (domain.endsWith(".gov")) return 98;

    return highAuthDomains[domain] || 70;
}
