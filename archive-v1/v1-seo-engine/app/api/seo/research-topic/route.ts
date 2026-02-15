import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { query, context = "" } = await request.json();

        if (!query || typeof query !== "string") {
            return NextResponse.json(
                { error: "No research query provided" },
                { status: 400 }
            );
        }

        const currentDate = new Date().toISOString().split("T")[0];

        const apiKey = process.env.PERPLEXITY_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Perplexity API key not configured" },
                { status: 500 }
            );
        }

        const callPerplexity = async (model: string) => {
            return fetch("https://api.perplexity.ai/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model,
                messages: [
                    {
                        role: "system",
                        content: `You are a world-class research assistant. Today's date is ${currentDate}.

SEARCH ACROSS ALL SOURCES:
- Reddit discussions and posts (especially recent trending topics)
- Twitter/X conversations and viral threads  
- Developer forums (Stack Overflow, GitHub Discussions, HackerNews)
- Technical blogs and documentation
- Social media posts and community discussions
- Recent articles, news, and industry publications
- Academic papers and research when relevant

PRIORITIZE RECENCY: Focus heavily on information from the last 4 weeks. If a topic has recent developments, feature them prominently.

DEPTH OVER BREADTH: Find specific examples, code snippets, expert quotes, real metrics, and concrete use cases.

Return findings in this EXACT JSON format (no markdown, no code blocks):
{
  "summary": "2-3 sentence comprehensive overview of what you found",
  "keyFindings": [
    {
      "finding": "specific insight or fact with details",
      "source": "platform and context (e.g., 'Reddit r/Programming')",
      "relevance": "why this matters for the article",
      "date": "YYYY-MM-DD when published/discussed",
      "url": "exact source URL"
    }
  ],
  "trendingTopics": ["topic1", "topic2", "topic3"],
  "controversies": ["debate point or concern"],
  "practicalExamples": [
    {
      "example": "detailed description of real example",
      "source": "URL",
      "useCase": "when/how to apply this"
    }
  ],
  "expertOpinions": [
    {
      "opinion": "direct quote or detailed paraphrase",
      "expert": "name, title, or handle with follower count if relevant",
      "source": "URL"
    }
  ],
  "relatedTools": ["tool1", "tool2"],
  "commonQuestions": ["question1", "question2"],
  "metrics": {
    "userCount": "number if mentioned",
    "growthRate": "percentage if mentioned",
    "marketShare": "info if available"
  }
}

Include minimum 5 keyFindings, 3 practicalExamples, and 2 expertOpinions. More is better.`,
                    },
                    {
                        role: "user",
                        content: `${context ? `Context: ${context}\n\n` : ""}Research this query in depth:\n\n"${query}"`,
                    },
                ],
                temperature: 0.2, // Factual, not creative
                max_tokens: 4000,
                search_domain_filter: [
                    "reddit.com",
                    "twitter.com",
                    "x.com",
                    "news.ycombinator.com",
                    "stackoverflow.com",
                    "github.com",
                    "medium.com",
                    "dev.to",
                ],
                search_recency_filter: "month", // Focus on last month
                }),
            });
        };

        // Call Perplexity Sonar-Pro, fallback to Sonar if model access is restricted
        let response = await callPerplexity("sonar-pro");
        if (response.status === 401 || response.status === 403) {
            response = await callPerplexity("sonar");
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Perplexity API error:", errorText);
            return NextResponse.json(
                { error: `Perplexity API failed: ${response.statusText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        const messageContent = data.choices?.[0]?.message?.content || "{}";

        // Parse the research results
        let researchData;
        try {
            const cleanedContent = messageContent
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            researchData = JSON.parse(cleanedContent);
        } catch (parseError) {
            console.error("Failed to parse Perplexity response:", parseError);
            console.error("Raw response:", messageContent);

            // Return partial data if parsing fails
            return NextResponse.json({
                query,
                summary: messageContent,
                keyFindings: [],
                rawResponse: messageContent,
                success: true,
                parsingFailed: true,
            });
        }

        return NextResponse.json({
            query,
            ...researchData,
            researchedAt: new Date().toISOString(),
            success: true,
        });
    } catch (error: any) {
        console.error("Research topic error:", error);
        return NextResponse.json(
            {
                error: error.message || "Failed to research topic",
                success: false,
            },
            { status: 500 }
        );
    }
}
