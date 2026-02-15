import { NextRequest, NextResponse } from "next/server";
import { translateArticle, validateHtmlStructure } from "@/lib/translation";
import { localizeArticle, generateLocalizedSlug } from "@/lib/localization";
import { generateHreflangTags, validateLocaleCode } from "@/lib/hreflang";
import { MultiLanguageContent } from "@/lib/seo-types";
import { DEFAULT_LANGUAGE } from "@/lib/constants";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate request body
        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        const {
            title,
            metaDescription,
            content,
            keywords = [],
            slug,
            targetLanguages = [],
            sourceLanguage = DEFAULT_LANGUAGE,
            baseUrl,
            includeXDefault = true,
            culturalAdaptation = true,
            model = "claude",
        } = body;

        // Validate required fields
        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "Title is required and must be a string" },
                { status: 400 }
            );
        }

        if (!metaDescription || typeof metaDescription !== "string") {
            return NextResponse.json(
                { error: "Meta description is required and must be a string" },
                { status: 400 }
            );
        }

        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required and must be a string" },
                { status: 400 }
            );
        }

        if (!slug || typeof slug !== "string") {
            return NextResponse.json(
                { error: "Slug is required and must be a string" },
                { status: 400 }
            );
        }

        if (!Array.isArray(targetLanguages) || targetLanguages.length === 0) {
            return NextResponse.json(
                { error: "targetLanguages must be a non-empty array" },
                { status: 400 }
            );
        }

        if (!baseUrl || typeof baseUrl !== "string") {
            return NextResponse.json(
                { error: "baseUrl is required and must be a string" },
                { status: 400 }
            );
        }

        if (!Array.isArray(keywords)) {
            return NextResponse.json(
                { error: "keywords must be an array" },
                { status: 400 }
            );
        }

        // Validate all target languages
        const invalidLanguages = targetLanguages.filter(lang => !validateLocaleCode(lang));
        if (invalidLanguages.length > 0) {
            return NextResponse.json(
                {
                    error: `Invalid language codes: ${invalidLanguages.join(", ")}`,
                    invalidLanguages,
                },
                { status: 400 }
            );
        }

        // Validate HTML structure of source content
        if (!validateHtmlStructure(content)) {
            return NextResponse.json(
                {
                    error: "Invalid HTML structure in source content",
                    warning: "Content may have mismatched tags",
                },
                { status: 400 }
            );
        }

        // Process translations for all target languages
        const translations = [];
        const failedTranslations = [];
        let completedCount = 0;

        for (const targetLanguage of targetLanguages) {
            try {
                console.log(`Translating to ${targetLanguage}...`);

                // Step 1: Translate the article
                const translationResult = await translateArticle(
                    title,
                    metaDescription,
                    content,
                    keywords,
                    {
                        targetLanguage,
                        targetLocale: targetLanguage,
                        preserveHtml: true,
                        preserveBrandTerms: true,
                        culturalAdaptation,
                        model: model === "gemini" ? "gemini" : "claude",
                    }
                );

                // Validate translated HTML
                if (!validateHtmlStructure(translationResult.translatedContent)) {
                    throw new Error("Translation resulted in invalid HTML structure");
                }

                // Step 2: Generate localized slug
                const localizedSlug = generateLocalizedSlug(
                    translationResult.translatedTitle,
                    targetLanguage
                );

                // Step 3: Localize the content (dates, currency, measurements)
                const localizedArticle = await localizeArticle(
                    {
                        title: translationResult.translatedTitle,
                        metaDescription: translationResult.translatedMetaDescription,
                        content: translationResult.translatedContent,
                        keywords: translationResult.translatedKeywords,
                        slug: localizedSlug,
                        culturalAdaptations: translationResult.culturalAdaptations,
                    },
                    content,
                    {
                        language: targetLanguage,
                        locale: targetLanguage,
                        adaptDates: true,
                        adaptCurrency: true,
                        adaptMeasurements: true,
                        adaptCulturalReferences: culturalAdaptation,
                    }
                );

                translations.push(localizedArticle);
                completedCount++;

                console.log(`Successfully translated to ${targetLanguage}`);
            } catch (error: any) {
                console.error(`Failed to translate to ${targetLanguage}:`, error);
                failedTranslations.push({
                    language: targetLanguage,
                    error: error.message || "Translation failed",
                });
            }
        }

        // Step 4: Generate hreflang tags for all language versions
        const allLanguages = [sourceLanguage, ...translations.map(t => t.language)];
        const hreflangTags = generateHreflangTags({
            baseUrl,
            slug,
            languages: allLanguages,
            defaultLanguage: sourceLanguage,
            includeXDefault,
        });

        // Determine x-default URL
        const xDefaultTag = hreflangTags.find(tag => tag.hreflang === "x-default");
        const xDefault = xDefaultTag ? xDefaultTag.href : undefined;

        // Build response
        const response: MultiLanguageContent = {
            sourceLanguage,
            sourceArticle: {
                title,
                metaDescription,
                content,
                slug,
            },
            translations,
            hreflangTags,
            xDefault,
            supportedLanguages: allLanguages,
            translationMetadata: {
                totalLanguages: targetLanguages.length,
                completedTranslations: completedCount,
                failedTranslations: failedTranslations.length,
                modelUsed: model,
                translatedAt: new Date().toISOString(),
            },
        };

        // Return success response with warnings if some translations failed
        if (failedTranslations.length > 0) {
            return NextResponse.json({
                success: true,
                data: response,
                warnings: failedTranslations,
                message: `${completedCount}/${targetLanguages.length} translations completed successfully`,
            });
        }

        return NextResponse.json({
            success: true,
            data: response,
            message: `All ${completedCount} translations completed successfully`,
        });
    } catch (error: any) {
        console.error("Translation API error:", error);

        // Handle specific error types
        if (error.message?.includes("API key")) {
            return NextResponse.json(
                {
                    error: "Translation service not configured. Please check API keys.",
                    success: false,
                },
                { status: 500 }
            );
        }

        if (error.message?.includes("rate limit")) {
            return NextResponse.json(
                {
                    error: "Rate limit exceeded. Please try again later.",
                    success: false,
                },
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                error: error.message || "Failed to translate article",
                success: false,
            },
            { status: 500 }
        );
    }
}
