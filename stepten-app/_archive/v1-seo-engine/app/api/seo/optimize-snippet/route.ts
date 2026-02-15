import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { SnippetOptimization } from "@/lib/seo-types";
import { detectFeaturedSnippet, analyzeSnippetFormat } from "@/lib/snippet-analyzer";
import { generateSnippetOptimization } from "@/lib/snippet-optimizer";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

/**
 * Request body interface for snippet optimization
 */
interface OptimizeSnippetRequest {
  keyword: string;
  articleContent: string;
  targetFormat?: 'paragraph' | 'list' | 'table';
}

/**
 * Enhanced response with AI-powered recommendations
 */
interface OptimizeSnippetResponse extends SnippetOptimization {
  analysis?: {
    snippetOpportunity: 'high' | 'medium' | 'low';
    competitorAnalysis: string;
    recommendations: string[];
  };
}

/**
 * POST /api/seo/optimize-snippet
 *
 * Analyzes current featured snippet for a keyword and generates optimized
 * content to capture the snippet position.
 *
 * @param request - Contains keyword, articleContent, and optional targetFormat
 * @returns SnippetOptimization object with optimized content and recommendations
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/seo/optimize-snippet', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     keyword: 'what is seo',
 *     articleContent: '<p>Full article HTML...</p>',
 *     targetFormat: 'paragraph'
 *   })
 * });
 * const optimization = await response.json();
 * ```
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as OptimizeSnippetRequest;
    const { keyword, articleContent, targetFormat } = body;

    // Validate required fields
    if (!keyword || !articleContent) {
      return NextResponse.json(
        { error: "Missing required fields: keyword and articleContent are required" },
        { status: 400 }
      );
    }

    if (!keyword.trim() || keyword.length < 2) {
      return NextResponse.json(
        { error: "Keyword must be at least 2 characters long" },
        { status: 400 }
      );
    }

    if (!articleContent.trim() || articleContent.length < 100) {
      return NextResponse.json(
        { error: "Article content must be at least 100 characters long" },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Google AI API key not configured" },
        { status: 500 }
      );
    }

    // Step 1: Detect existing featured snippet
    console.log(`[Snippet Optimizer] Analyzing keyword: ${keyword}`);
    const snippetDetection = await detectFeaturedSnippet(keyword, articleContent);

    // Step 2: Determine target format
    let finalTargetFormat: 'paragraph' | 'list' | 'table' = targetFormat || 'paragraph';

    // If no target format specified, use the existing snippet format or infer from keyword
    if (!targetFormat) {
      if (snippetDetection.hasSnippet && snippetDetection.snippet) {
        finalTargetFormat = snippetDetection.snippet.type === 'video'
          ? 'paragraph'
          : snippetDetection.snippet.type;
      } else {
        // Infer format from keyword
        finalTargetFormat = inferSnippetFormat(keyword);
      }
    }

    console.log(`[Snippet Optimizer] Target format: ${finalTargetFormat}`);

    // Step 3: Generate optimized snippet content
    const optimization = generateSnippetOptimization(
      keyword,
      articleContent,
      snippetDetection.snippet,
      finalTargetFormat
    );

    // Step 4: Enhance with AI-powered analysis
    const enhancedOptimization = await enhanceWithAIAnalysis(
      optimization,
      snippetDetection,
      keyword,
      articleContent
    );

    console.log(`[Snippet Optimizer] Win probability: ${enhancedOptimization.winProbability}%`);

    return NextResponse.json(enhancedOptimization);

  } catch (error: any) {
    console.error("[Snippet Optimizer] Error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to optimize snippet",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Infers the best snippet format based on keyword patterns
 *
 * @param keyword - The target keyword
 * @returns Recommended snippet format
 */
function inferSnippetFormat(keyword: string): 'paragraph' | 'list' | 'table' {
  const keywordLower = keyword.toLowerCase();

  // List formats
  if (
    keywordLower.match(/^how\s(to|do|can)/i) ||
    keywordLower.match(/^(best|top|greatest)\s/i) ||
    keywordLower.includes('step') ||
    keywordLower.includes('ways to') ||
    keywordLower.includes('tips')
  ) {
    return 'list';
  }

  // Table formats
  if (
    keywordLower.includes('vs') ||
    keywordLower.includes('versus') ||
    keywordLower.includes('compare') ||
    keywordLower.includes('comparison') ||
    keywordLower.includes('difference between')
  ) {
    return 'table';
  }

  // Default to paragraph for questions and definitions
  return 'paragraph';
}

/**
 * Enhances snippet optimization with AI-powered competitive analysis
 *
 * @param optimization - Base optimization object
 * @param snippetDetection - Detected snippet information
 * @param keyword - Target keyword
 * @param articleContent - Full article content
 * @returns Enhanced optimization with AI analysis
 */
async function enhanceWithAIAnalysis(
  optimization: SnippetOptimization,
  snippetDetection: any,
  keyword: string,
  articleContent: string
): Promise<OptimizeSnippetResponse> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are a featured snippet optimization expert. Analyze this snippet optimization strategy and provide competitive insights.

## KEYWORD:
${keyword}

## TARGET SNIPPET FORMAT:
${optimization.targetFormat}

## EXISTING SNIPPET:
${snippetDetection.hasSnippet && snippetDetection.snippet
  ? `Yes - Type: ${snippetDetection.snippet.type}, Source: ${snippetDetection.snippet.source}`
  : 'No existing snippet detected'
}

## OPTIMIZED CONTENT:
${optimization.optimizedContent.html}

## ARTICLE PREVIEW (first 500 chars):
${articleContent.substring(0, 500).replace(/<[^>]+>/g, ' ')}

## YOUR TASKS:

### 1. COMPETITIVE ANALYSIS
Analyze the competitive landscape for this snippet:
- Current holder strength (if applicable)
- Difficulty to capture this snippet
- Unique opportunities to differentiate

### 2. STRATEGIC RECOMMENDATIONS
Provide 3-5 specific, actionable recommendations to increase snippet capture probability:
- Content improvements
- Structural optimizations
- Keyword placement strategies
- Authority-building tactics

### 3. OPPORTUNITY ASSESSMENT
Rate the snippet opportunity as 'high', 'medium', or 'low' based on:
- Keyword intent and search volume potential
- Competition level
- Article readiness
- Format optimization quality

## OUTPUT FORMAT (JSON only, no markdown):
{
  "snippetOpportunity": "high" | "medium" | "low",
  "competitorAnalysis": "Detailed analysis of competition and current snippet holder (2-3 sentences)",
  "recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ]
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean and parse JSON
    const cleanedText = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const analysis = JSON.parse(cleanedText);

    return {
      ...optimization,
      analysis: {
        snippetOpportunity: analysis.snippetOpportunity || snippetDetection.opportunity,
        competitorAnalysis: analysis.competitorAnalysis || snippetDetection.reasoning,
        recommendations: analysis.recommendations || [],
      },
    };

  } catch (error) {
    console.error("[Snippet Optimizer] AI analysis error:", error);

    // Return base optimization with fallback analysis
    return {
      ...optimization,
      analysis: {
        snippetOpportunity: snippetDetection.opportunity,
        competitorAnalysis: snippetDetection.reasoning,
        recommendations: generateFallbackRecommendations(optimization.targetFormat),
      },
    };
  }
}

/**
 * Generates fallback recommendations if AI analysis fails
 *
 * @param format - Target snippet format
 * @returns Array of generic but useful recommendations
 */
function generateFallbackRecommendations(format: 'paragraph' | 'list' | 'table'): string[] {
  const baseRecommendations = [
    "Place optimized snippet content immediately after the most relevant H2 heading",
    "Ensure the focus keyword appears in the heading directly above the snippet content",
    "Add schema markup to increase snippet capture probability",
  ];

  const formatSpecific: Record<string, string[]> = {
    paragraph: [
      "Keep the answer between 40-60 words for optimal snippet length",
      "Start with a direct, definitive answer to the question",
      "Use simple, clear language without jargon",
    ],
    list: [
      "Use ordered list (numbered) format for procedural steps",
      "Keep each list item under 15 words for better snippet display",
      "Start each item with an action verb when possible",
    ],
    table: [
      "Use clear, descriptive column headers",
      "Limit to 2-4 columns for mobile-friendly display",
      "Keep table data concise and scannable",
    ],
  };

  return [...baseRecommendations, ...formatSpecific[format]];
}
