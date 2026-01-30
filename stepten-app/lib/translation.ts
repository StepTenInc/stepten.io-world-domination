/**
 * Translation Engine
 * Handles article translation using AI models (Claude/Gemini)
 * Preserves HTML formatting, links, and brand terms
 */

import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PRESERVE_BRAND_TERMS } from "./constants";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface TranslationOptions {
    targetLanguage: string;
    targetLocale: string;
    preserveHtml: boolean;
    preserveBrandTerms: boolean;
    culturalAdaptation: boolean;
    model?: "claude" | "gemini";
}

export interface TranslationResult {
    translatedTitle: string;
    translatedMetaDescription: string;
    translatedContent: string;
    translatedKeywords: string[];
    culturalAdaptations: Array<{
        original: string;
        adapted: string;
        reason: string;
    }>;
    detectedIdioms: string[];
}

/**
 * Translate an article to a target language while preserving formatting and brand terms
 *
 * @param title - Article title to translate
 * @param metaDescription - Meta description to translate
 * @param content - HTML content to translate
 * @param keywords - Keywords to translate
 * @param options - Translation configuration options
 * @returns Translation result with all translated content
 */
export async function translateArticle(
    title: string,
    metaDescription: string,
    content: string,
    keywords: string[],
    options: TranslationOptions
): Promise<TranslationResult> {
    const model = options.model || "claude";

    if (model === "claude") {
        return translateWithClaude(title, metaDescription, content, keywords, options);
    } else {
        return translateWithGemini(title, metaDescription, content, keywords, options);
    }
}

/**
 * Translate article using Claude (Anthropic)
 *
 * @param title - Article title
 * @param metaDescription - Meta description
 * @param content - HTML content
 * @param keywords - Keywords array
 * @param options - Translation options
 * @returns Translation result
 */
async function translateWithClaude(
    title: string,
    metaDescription: string,
    content: string,
    keywords: string[],
    options: TranslationOptions
): Promise<TranslationResult> {
    const targetLanguageName = getLanguageName(options.targetLanguage);
    const brandTermsList = PRESERVE_BRAND_TERMS.join(", ");

    const prompt = buildTranslationPrompt(
        title,
        metaDescription,
        content,
        keywords,
        targetLanguageName,
        brandTermsList,
        options
    );

    const message = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 16000,
        temperature: 0.3, // Lower temperature for accuracy
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
    });

    const response = message.content[0].type === "text" ? message.content[0].text : "";
    return parseTranslationResponse(response);
}

/**
 * Translate article using Gemini (Google)
 *
 * @param title - Article title
 * @param metaDescription - Meta description
 * @param content - HTML content
 * @param keywords - Keywords array
 * @param options - Translation options
 * @returns Translation result
 */
async function translateWithGemini(
    title: string,
    metaDescription: string,
    content: string,
    keywords: string[],
    options: TranslationOptions
): Promise<TranslationResult> {
    const targetLanguageName = getLanguageName(options.targetLanguage);
    const brandTermsList = PRESERVE_BRAND_TERMS.join(", ");

    const prompt = buildTranslationPrompt(
        title,
        metaDescription,
        content,
        keywords,
        targetLanguageName,
        brandTermsList,
        options
    );

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return parseTranslationResponse(response);
}

/**
 * Build comprehensive translation prompt
 *
 * @param title - Article title
 * @param metaDescription - Meta description
 * @param content - HTML content
 * @param keywords - Keywords array
 * @param targetLanguage - Target language name
 * @param brandTerms - Comma-separated brand terms
 * @param options - Translation options
 * @returns Complete prompt string
 */
function buildTranslationPrompt(
    title: string,
    metaDescription: string,
    content: string,
    keywords: string[],
    targetLanguage: string,
    brandTerms: string,
    options: TranslationOptions
): string {
    return `You are a professional translator specializing in SEO content localization.

## YOUR MISSION:
Translate this SEO article from English to ${targetLanguage} while maintaining:
1. HTML structure and formatting
2. Link URLs and attributes
3. Brand terminology
4. SEO effectiveness
5. Cultural appropriateness

## CRITICAL RULES:

### 1. HTML Preservation:
- Keep ALL HTML tags exactly as they are: <h1>, <h2>, <p>, <a>, <strong>, <em>, <ul>, <li>, etc.
- DO NOT translate HTML tag names or attributes
- Preserve all link URLs unchanged
- Maintain rel="nofollow" and target="_blank" attributes
- Keep the exact same structure

### 2. Brand Terms (DO NOT TRANSLATE):
${brandTerms}

Keep these EXACTLY as written. Do not translate, transliterate, or modify them.

### 3. Cultural Adaptation:
${options.culturalAdaptation ? `
- Adapt idioms and cultural references to ${targetLanguage} equivalents
- Replace culture-specific examples with locally relevant ones
- Adjust metaphors and analogies for cultural context
- Use natural phrasing that a native speaker would use
- Consider regional preferences and sensitivities
` : `
- Translate literally and accurately
- Maintain original idioms and references
- Keep examples as-is
`}

### 4. SEO Optimization:
- Translate keywords naturally for ${targetLanguage} search intent
- Maintain keyword placement in titles and headings
- Ensure meta description remains compelling in target language
- Use natural, search-friendly phrasing

### 5. Quality Standards:
- Professional, native-level translation
- Grammatically correct in target language
- Natural flow and readability
- Appropriate tone for the audience
- SEO-friendly while human-readable

## CONTENT TO TRANSLATE:

**TITLE:**
${title}

**META DESCRIPTION:**
${metaDescription}

**KEYWORDS:**
${keywords.join(", ")}

**HTML CONTENT:**
${content}

## OUTPUT FORMAT:

Return ONLY a JSON object with this exact structure:

{
  "translatedTitle": "translated title here",
  "translatedMetaDescription": "translated meta description here",
  "translatedContent": "complete HTML content with all tags preserved",
  "translatedKeywords": ["keyword1", "keyword2", ...],
  "culturalAdaptations": [
    {
      "original": "original phrase or idiom",
      "adapted": "culturally adapted translation",
      "reason": "explanation of why it was adapted"
    }
  ],
  "detectedIdioms": ["list of idioms or cultural references found"]
}

**IMPORTANT:**
- Return ONLY valid JSON, no markdown, no explanations
- Ensure all HTML tags are preserved in translatedContent
- Include all cultural adaptations you made
- List any idioms or cultural references you detected

Start translation now:`;
}

/**
 * Parse the AI model's translation response
 *
 * @param response - Raw response from AI model
 * @returns Parsed translation result
 */
function parseTranslationResponse(response: string): TranslationResult {
    try {
        // Clean the response
        let cleaned = response.trim();

        // Remove markdown code blocks if present
        cleaned = cleaned.replace(/^```json\n?/g, "").replace(/^```\n?/g, "").replace(/\n?```$/g, "");

        // Parse JSON
        const parsed = JSON.parse(cleaned);

        return {
            translatedTitle: parsed.translatedTitle || "",
            translatedMetaDescription: parsed.translatedMetaDescription || "",
            translatedContent: parsed.translatedContent || "",
            translatedKeywords: parsed.translatedKeywords || [],
            culturalAdaptations: parsed.culturalAdaptations || [],
            detectedIdioms: parsed.detectedIdioms || [],
        };
    } catch (error) {
        console.error("Failed to parse translation response:", error);
        throw new Error("Invalid translation response format");
    }
}

/**
 * Get full language name from language code
 *
 * @param code - ISO language code (e.g., "es", "fr", "pt-BR")
 * @returns Full language name
 */
export function getLanguageName(code: string): string {
    const languageMap: Record<string, string> = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "pt-BR": "Brazilian Portuguese",
        "nl": "Dutch",
        "pl": "Polish",
        "ru": "Russian",
        "ja": "Japanese",
        "ko": "Korean",
        "zh": "Simplified Chinese",
        "zh-TW": "Traditional Chinese",
        "ar": "Arabic",
        "hi": "Hindi",
        "tr": "Turkish",
        "sv": "Swedish",
        "da": "Danish",
        "no": "Norwegian",
        "fi": "Finnish",
        "cs": "Czech",
        "el": "Greek",
        "he": "Hebrew",
        "th": "Thai",
        "vi": "Vietnamese",
        "id": "Indonesian",
    };

    return languageMap[code] || code;
}

/**
 * Validate HTML structure after translation
 * Ensures opening and closing tags match
 *
 * @param html - HTML content to validate
 * @returns True if HTML structure is valid
 */
export function validateHtmlStructure(html: string): boolean {
    // Simple validation: count opening and closing tags
    const openTags = html.match(/<([a-z][a-z0-9]*)\b[^>]*>/gi) || [];
    const closeTags = html.match(/<\/([a-z][a-z0-9]*)>/gi) || [];

    // Self-closing tags don't need closing tags
    const selfClosing = ["br", "img", "hr", "input", "meta", "link"];
    const openTagsFiltered = openTags.filter(tag => {
        const tagName = tag.match(/<([a-z][a-z0-9]*)/i)?.[1]?.toLowerCase();
        return tagName && !selfClosing.includes(tagName);
    });

    // Basic check: should have similar number of opening and closing tags
    return Math.abs(openTagsFiltered.length - closeTags.length) <= 2;
}

/**
 * Preserve brand terms in content by protecting them from translation
 * This is a pre-processing step before sending to translation
 *
 * @param content - Content containing brand terms
 * @returns Content with brand terms marked for preservation
 */
export function protectBrandTerms(content: string): string {
    let protectedContent = content;

    PRESERVE_BRAND_TERMS.forEach((term, index) => {
        const regex = new RegExp(`\\b${term}\\b`, "g");
        protectedContent = protectedContent.replace(regex, `__BRAND_${index}__`);
    });

    return protectedContent;
}

/**
 * Restore brand terms after translation
 *
 * @param content - Translated content with brand placeholders
 * @returns Content with brand terms restored
 */
export function restoreBrandTerms(content: string): string {
    let restored = content;

    PRESERVE_BRAND_TERMS.forEach((term, index) => {
        const placeholder = `__BRAND_${index}__`;
        const regex = new RegExp(placeholder, "g");
        restored = restored.replace(regex, term);
    });

    return restored;
}
