/**
 * A/B Test Variant Generator
 * Generates multiple variants of article metadata for A/B testing
 */

import Anthropic from "@anthropic-ai/sdk";
import { logger } from "./logger";
import { handleError } from "./error-handler";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface VariantGenerationOptions {
  keyword: string;
  originalTitle: string;
  originalMetaDescription: string;
  originalIntro?: string;
  articleContent?: string;
  variantCount?: number;
}

export interface GeneratedVariant {
  title: string;
  metaDescription: string;
  introductionParagraph?: string;
  reasoning: string;
  approach: string;
}

export interface VariantGenerationResult {
  variants: GeneratedVariant[];
  original: GeneratedVariant;
  recommendations: string[];
}

/**
 * Generates multiple A/B test variants for article metadata
 * Creates title, meta description, and intro paragraph variants optimized for CTR
 *
 * @param options - Configuration for variant generation
 * @returns Promise with generated variants and the original
 * @throws Error if generation fails
 *
 * @example
 * ```typescript
 * const result = await generateVariants({
 *   keyword: "React hooks",
 *   originalTitle: "Understanding React Hooks",
 *   originalMetaDescription: "Learn about React hooks...",
 *   variantCount: 3
 * });
 * console.log(result.variants); // Array of 3 variants
 * ```
 */
export async function generateVariants(
  options: VariantGenerationOptions
): Promise<VariantGenerationResult> {
  try {
    logger.info("Generating A/B test variants", {
      keyword: options.keyword,
      variantCount: options.variantCount || 3,
    });

    const variantCount = Math.min(Math.max(options.variantCount || 3, 3), 5);

    const prompt = buildVariantGenerationPrompt(options, variantCount);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      temperature: 0.9, // Higher temperature for creative variations
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    const result = parseVariantResponse(content.text, options);

    logger.info("Successfully generated variants", {
      variantCount: result.variants.length,
    });

    return result;
  } catch (error) {
    logger.error("Failed to generate variants", { error });
    throw handleError(error, "generateVariants");
  }
}

/**
 * Builds the prompt for variant generation
 * Creates a detailed prompt that instructs Claude to generate diverse variants
 *
 * @param options - Variant generation options
 * @param variantCount - Number of variants to generate
 * @returns Formatted prompt string
 */
function buildVariantGenerationPrompt(
  options: VariantGenerationOptions,
  variantCount: number
): string {
  return `You are an expert SEO copywriter specializing in A/B testing for search engine results.

Generate ${variantCount} distinct variants of the article metadata that will be A/B tested for click-through rate (CTR) in search results.

**Original Content:**
- Keyword: ${options.keyword}
- Title: ${options.originalTitle}
- Meta Description: ${options.originalMetaDescription}
${options.originalIntro ? `- Introduction: ${options.originalIntro}` : ""}

**Requirements:**

1. **Title Variants (50-60 characters):**
   - Use different psychological triggers (curiosity, urgency, authority, specificity)
   - Include the keyword naturally
   - Test different formats (question, how-to, list, statement, power words)
   - Make each title distinctive and compelling

2. **Meta Description Variants (140-160 characters):**
   - Match the title's approach and tone
   - Include clear value proposition
   - Use action words and emotional triggers
   - End with a call-to-action when appropriate

${
  options.originalIntro
    ? `3. **Introduction Paragraph Variants (50-100 words):**
   - Hook the reader immediately
   - Match the promise made in the title
   - Create curiosity to continue reading
   - Establish relevance and value`
    : ""
}

**Different Approaches to Test:**
- Variant 1: Curiosity-driven with a question or intriguing statement
- Variant 2: Benefit-focused with specific outcomes
- Variant 3: Authority-based with expertise signals
${variantCount > 3 ? "- Variant 4: Urgency or timeliness angle" : ""}
${variantCount > 4 ? "- Variant 5: Simplicity or beginner-friendly approach" : ""}

Return your response as a JSON object with this exact structure:
{
  "variants": [
    {
      "title": "...",
      "metaDescription": "...",
      ${options.originalIntro ? '"introductionParagraph": "...",' : ""}
      "reasoning": "Why this variant should perform well",
      "approach": "curiosity|benefit|authority|urgency|simplicity"
    }
  ],
  "recommendations": [
    "Recommendation 1 for A/B testing strategy",
    "Recommendation 2 for measuring success",
    "Recommendation 3 for test duration"
  ]
}

Generate ${variantCount} truly distinct variants that test different psychological triggers and approaches.`;
}

/**
 * Parses the Claude API response into structured variant data
 * Extracts JSON from response and validates the structure
 *
 * @param responseText - Raw text response from Claude
 * @param options - Original options for fallback data
 * @returns Parsed variant generation result
 * @throws Error if parsing fails
 */
function parseVariantResponse(
  responseText: string,
  options: VariantGenerationOptions
): VariantGenerationResult {
  try {
    // Extract JSON from response (Claude sometimes wraps it in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!parsed.variants || !Array.isArray(parsed.variants)) {
      throw new Error("Invalid response structure: missing variants array");
    }

    // Create original variant for comparison
    const original: GeneratedVariant = {
      title: options.originalTitle,
      metaDescription: options.originalMetaDescription,
      introductionParagraph: options.originalIntro,
      reasoning: "Original baseline variant for comparison",
      approach: "baseline",
    };

    return {
      variants: parsed.variants,
      original,
      recommendations: parsed.recommendations || [],
    };
  } catch (error) {
    logger.error("Failed to parse variant response", { error, responseText });
    throw new Error("Failed to parse variant generation response");
  }
}

/**
 * Generates variants specifically optimized for title testing
 * Focuses only on title variations for rapid testing
 *
 * @param keyword - Target keyword
 * @param originalTitle - Original title to test against
 * @param count - Number of variants (3-5)
 * @returns Array of title variants with reasoning
 *
 * @example
 * ```typescript
 * const titles = await generateTitleVariants("React hooks", "Understanding React Hooks", 5);
 * titles.forEach(t => console.log(t.title));
 * ```
 */
export async function generateTitleVariants(
  keyword: string,
  originalTitle: string,
  count: number = 3
): Promise<Array<{ title: string; reasoning: string; approach: string }>> {
  try {
    const result = await generateVariants({
      keyword,
      originalTitle,
      originalMetaDescription: "", // Not needed for title-only testing
      variantCount: count,
    });

    return result.variants.map((v) => ({
      title: v.title,
      reasoning: v.reasoning,
      approach: v.approach,
    }));
  } catch (error) {
    throw handleError(error, "generateTitleVariants");
  }
}

/**
 * Generates variants specifically optimized for meta description testing
 * Focuses only on meta description variations
 *
 * @param keyword - Target keyword
 * @param title - Article title (for context)
 * @param originalMetaDescription - Original meta description
 * @param count - Number of variants (3-5)
 * @returns Array of meta description variants
 *
 * @example
 * ```typescript
 * const descriptions = await generateMetaDescriptionVariants(
 *   "React hooks",
 *   "Understanding React Hooks",
 *   "Learn about React hooks in this guide",
 *   4
 * );
 * ```
 */
export async function generateMetaDescriptionVariants(
  keyword: string,
  title: string,
  originalMetaDescription: string,
  count: number = 3
): Promise<Array<{ metaDescription: string; reasoning: string; approach: string }>> {
  try {
    const result = await generateVariants({
      keyword,
      originalTitle: title,
      originalMetaDescription,
      variantCount: count,
    });

    return result.variants.map((v) => ({
      metaDescription: v.metaDescription,
      reasoning: v.reasoning,
      approach: v.approach,
    }));
  } catch (error) {
    throw handleError(error, "generateMetaDescriptionVariants");
  }
}

/**
 * Generates complete variant sets for comprehensive A/B testing
 * Creates matched sets of title + meta description + intro
 *
 * @param options - Full variant generation options
 * @returns Complete variant generation result
 *
 * @example
 * ```typescript
 * const result = await generateCompleteVariants({
 *   keyword: "React hooks",
 *   originalTitle: "Understanding React Hooks",
 *   originalMetaDescription: "Learn React hooks",
 *   originalIntro: "React hooks are...",
 *   variantCount: 4
 * });
 * ```
 */
export async function generateCompleteVariants(
  options: VariantGenerationOptions
): Promise<VariantGenerationResult> {
  return generateVariants(options);
}

/**
 * Tracks variant performance metrics
 * Calculates CTR and other performance indicators for each variant
 *
 * @param variantId - Unique variant identifier
 * @param impressions - Number of times shown in search results
 * @param clicks - Number of clicks received
 * @returns Performance metrics object
 *
 * @example
 * ```typescript
 * const metrics = trackVariantPerformance("variant-123", 1000, 45);
 * console.log(metrics.ctr); // 4.5%
 * ```
 */
export function trackVariantPerformance(
  variantId: string,
  impressions: number,
  clicks: number
): {
  variantId: string;
  impressions: number;
  clicks: number;
  ctr: number;
  ctrPercent: string;
} {
  const ctr = impressions > 0 ? clicks / impressions : 0;
  const ctrPercent = `${(ctr * 100).toFixed(2)}%`;

  return {
    variantId,
    impressions,
    clicks,
    ctr,
    ctrPercent,
  };
}
