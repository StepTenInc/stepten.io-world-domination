/**
 * API Route: Suggest Internal Links
 * POST /api/seo/suggest-internal-links
 *
 * Analyzes article content and suggests relevant internal links
 * using semantic embeddings and AI-powered placement suggestions
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateInternalLinkSuggestions, PublishedArticle } from "@/lib/internal-linking";
import { InternalLinkingAnalysis } from "@/lib/seo-types";

/**
 * Request body interface
 */
interface SuggestLinksRequest {
  articleId: string;
  articleContent: string;
  metadata: {
    title: string;
    focusKeyword: string;
    metaDescription?: string;
    slug?: string;
  };
}

/**
 * Error response helper
 */
function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Validates the request body
 */
function validateRequest(body: any): body is SuggestLinksRequest {
  if (!body.articleId || typeof body.articleId !== "string") {
    return false;
  }

  if (!body.articleContent || typeof body.articleContent !== "string") {
    return false;
  }

  if (!body.metadata || typeof body.metadata !== "object") {
    return false;
  }

  if (!body.metadata.title || typeof body.metadata.title !== "string") {
    return false;
  }

  if (!body.metadata.focusKeyword || typeof body.metadata.focusKeyword !== "string") {
    return false;
  }

  return true;
}

/**
 * Fetches all published articles from Supabase
 */
async function fetchPublishedArticles(supabase: any): Promise<PublishedArticle[]> {
  try {
    const { data, error } = await supabase
      .from("published_articles")
      .select("id, slug, title, content, focus_keyword, meta_description")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching articles:", error);
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map database fields to PublishedArticle interface
    return data.map((article: any) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      content: article.content,
      focusKeyword: article.focus_keyword || "",
      metaDescription: article.meta_description || undefined,
    }));
  } catch (error: any) {
    console.error("Error fetching published articles:", error);
    throw error;
  }
}

/**
 * Fetches embeddings for published articles if they exist
 */
async function enrichArticlesWithEmbeddings(
  supabase: any,
  articles: PublishedArticle[]
): Promise<PublishedArticle[]> {
  try {
    const articleIds = articles.map((a) => a.id);

    const { data, error } = await supabase
      .from("article_embeddings")
      .select("article_id, embedding")
      .in("article_id", articleIds);

    if (error || !data) {
      console.warn("Could not fetch embeddings, will generate on-demand");
      return articles;
    }

    // Create a map of article_id -> embedding
    const embeddingsMap = new Map<string, number[]>();
    data.forEach((row: any) => {
      embeddingsMap.set(row.article_id, row.embedding);
    });

    // Enrich articles with embeddings
    return articles.map((article) => ({
      ...article,
      embedding: embeddingsMap.get(article.id),
    }));
  } catch (error) {
    console.warn("Error enriching articles with embeddings:", error);
    return articles;
  }
}

/**
 * POST handler for internal link suggestions
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request
    if (!validateRequest(body)) {
      return errorResponse(
        "Invalid request body. Required: articleId, articleContent, metadata { title, focusKeyword }",
        400
      );
    }

    const { articleId, articleContent, metadata } = body as SuggestLinksRequest;

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return errorResponse(
        "Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
        500
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return errorResponse(
        "OpenAI API key not configured. Please set OPENAI_API_KEY environment variable",
        500
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return errorResponse(
        "Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable",
        500
      );
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Fetch all published articles
    console.log("Fetching published articles...");
    let publishedArticles = await fetchPublishedArticles(supabase);

    if (publishedArticles.length === 0) {
      console.warn("No published articles found in database");
      return NextResponse.json<InternalLinkingAnalysis>({
        currentArticleId: articleId,
        suggestions: [],
        existingLinks: [],
        metrics: {
          totalInternalLinks: 0,
          optimalRange: [3, 10],
          orphanedContent: true,
          topicClusterCoverage: 0,
        },
      });
    }

    console.log(`Found ${publishedArticles.length} published articles`);

    // Enrich articles with cached embeddings if available
    publishedArticles = await enrichArticlesWithEmbeddings(supabase, publishedArticles);

    // Generate internal link suggestions
    console.log("Generating internal link suggestions...");
    const analysis = await generateInternalLinkSuggestions(
      articleId,
      articleContent,
      metadata,
      publishedArticles,
      supabase
    );

    console.log(`Generated ${analysis.suggestions.length} suggestions`);

    // Return the analysis
    return NextResponse.json<InternalLinkingAnalysis>(analysis, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error in suggest-internal-links API:", error);

    // Determine error type and return appropriate response
    if (error.message?.includes("Failed to fetch articles")) {
      return errorResponse(
        "Database error: Unable to fetch published articles. Please check Supabase configuration.",
        500
      );
    }

    if (error.message?.includes("Failed to generate embedding")) {
      return errorResponse(
        "OpenAI API error: Unable to generate embeddings. Please check your API key and quota.",
        500
      );
    }

    if (error.message?.includes("Failed to generate internal link suggestions")) {
      return errorResponse(
        "Internal linking engine error: " + error.message,
        500
      );
    }

    // Generic error response
    return errorResponse(
      error.message || "An unexpected error occurred while generating internal link suggestions",
      500
    );
  }
}

/**
 * GET handler - returns API documentation
 */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: "/api/seo/suggest-internal-links",
      method: "POST",
      description:
        "Analyzes article content and suggests relevant internal links using semantic embeddings and AI",
      requestBody: {
        articleId: "string (required) - Unique identifier for the article",
        articleContent: "string (required) - Full HTML content of the article",
        metadata: {
          title: "string (required) - Article title",
          focusKeyword: "string (required) - Primary SEO keyword",
          metaDescription: "string (optional) - Meta description",
          slug: "string (optional) - URL slug",
        },
      },
      responseBody: {
        currentArticleId: "string - ID of the analyzed article",
        suggestions: [
          {
            id: "string - Unique suggestion ID",
            targetArticle: {
              id: "string - Target article ID",
              slug: "string - Target article slug",
              title: "string - Target article title",
              focusKeyword: "string - Target article keyword",
              url: "string - Target article URL",
            },
            anchorText: "string - Suggested anchor text",
            relevanceScore: "number - Relevance score (0-100)",
            semanticSimilarity: "number - Semantic similarity (0-1)",
            placement: {
              paragraphIndex: "number - Paragraph to insert link",
              sentenceIndex: "number - Sentence to insert link",
              position: "number - Character position",
              context: "string - Surrounding context",
            },
            reasoning: "string - Why this link is suggested",
            bidirectional: "boolean - Should target link back?",
            status: "string - 'suggested' | 'accepted' | 'rejected'",
          },
        ],
        existingLinks: [
          {
            targetId: "string - Target article ID/slug",
            anchorText: "string - Current anchor text",
          },
        ],
        metrics: {
          totalInternalLinks: "number - Total internal links",
          optimalRange: "[number, number] - Ideal range",
          orphanedContent: "boolean - Has no internal links",
          topicClusterCoverage: "number - Coverage percentage",
        },
      },
      requiredEnvVars: [
        "NEXT_PUBLIC_SUPABASE_URL",
        "SUPABASE_SERVICE_ROLE_KEY",
        "OPENAI_API_KEY",
        "ANTHROPIC_API_KEY",
      ],
    },
    { status: 200 }
  );
}
