/**
 * Hreflang Tag Generator
 * Generates proper hreflang link tags for multi-language SEO
 */

import { HreflangTag } from "./seo-types";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "./constants";

export interface HreflangOptions {
    baseUrl: string;
    slug: string;
    languages: string[];
    defaultLanguage?: string;
    includeXDefault?: boolean;
}

/**
 * Generate hreflang link tags for all language versions of an article
 *
 * @param options - Hreflang generation options
 * @returns Array of hreflang link tag objects
 *
 * @example
 * const tags = generateHreflangTags({
 *   baseUrl: "https://example.com",
 *   slug: "how-to-write-seo-content",
 *   languages: ["en", "es", "fr"],
 *   includeXDefault: true
 * });
 */
export function generateHreflangTags(options: HreflangOptions): HreflangTag[] {
    const tags: HreflangTag[] = [];
    const defaultLang = options.defaultLanguage || DEFAULT_LANGUAGE;
    const baseUrl = options.baseUrl.replace(/\/$/, ""); // Remove trailing slash

    // Validate all languages
    const validLanguages = options.languages.filter(lang => validateLocaleCode(lang));

    if (validLanguages.length === 0) {
        throw new Error("No valid language codes provided");
    }

    // Generate hreflang tag for each language version
    validLanguages.forEach(language => {
        const href = buildLanguageUrl(baseUrl, language, options.slug);
        tags.push({
            rel: "alternate",
            hreflang: language,
            href,
        });
    });

    // Add x-default tag if requested (points to default language version)
    if (options.includeXDefault) {
        const defaultHref = buildLanguageUrl(baseUrl, defaultLang, options.slug);
        tags.push({
            rel: "alternate",
            hreflang: "x-default",
            href: defaultHref,
        });
    }

    return tags;
}

/**
 * Build URL for a specific language version
 *
 * @param baseUrl - Base URL of the site
 * @param language - Language code
 * @param slug - Article slug
 * @returns Complete URL for the language version
 */
function buildLanguageUrl(baseUrl: string, language: string, slug: string): string {
    // Use subdirectory structure: /en/slug, /es/slug, etc.
    return `${baseUrl}/${language}/${slug}`;
}

/**
 * Validate locale code format
 * Supports both ISO 639-1 (e.g., "en") and full locale codes (e.g., "en-US")
 *
 * @param code - Locale code to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * validateLocaleCode("en"); // true
 * validateLocaleCode("en-US"); // true
 * validateLocaleCode("invalid"); // false
 */
export function validateLocaleCode(code: string): boolean {
    if (!code || typeof code !== "string") {
        return false;
    }

    // Check if it's in our supported languages list
    if (SUPPORTED_LANGUAGES.includes(code)) {
        return true;
    }

    // Validate format: either "xx" or "xx-XX"
    const localePattern = /^[a-z]{2}(-[A-Z]{2})?$/;
    return localePattern.test(code);
}

/**
 * Generate HTML link tags for hreflang
 * Converts hreflang objects to HTML link tags for insertion in <head>
 *
 * @param tags - Array of hreflang tag objects
 * @returns HTML string with link tags
 *
 * @example
 * const html = generateHreflangHtml(tags);
 * // Returns: <link rel="alternate" hreflang="en" href="..." />
 */
export function generateHreflangHtml(tags: HreflangTag[]): string {
    return tags
        .map(tag => `<link rel="${tag.rel}" hreflang="${tag.hreflang}" href="${tag.href}" />`)
        .join("\n");
}

/**
 * Generate Next.js Link component format for hreflang
 * Useful for Next.js applications using next/head
 *
 * @param tags - Array of hreflang tag objects
 * @returns JSX-compatible string
 *
 * @example
 * const jsx = generateHreflangNextJs(tags);
 */
export function generateHreflangNextJs(tags: HreflangTag[]): string {
    return tags
        .map(tag => `<link rel="${tag.rel}" hreflang="${tag.hreflang}" href="${tag.href}" />`)
        .join("\n        ");
}

/**
 * Validate hreflang implementation
 * Checks for common issues in hreflang setup
 *
 * @param tags - Array of hreflang tags to validate
 * @param currentUrl - Current page URL
 * @returns Validation result with errors and warnings
 *
 * @example
 * const validation = validateHreflangImplementation(tags, currentUrl);
 * if (!validation.isValid) {
 *   console.error(validation.errors);
 * }
 */
export function validateHreflangImplementation(
    tags: HreflangTag[],
    currentUrl: string
): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
} {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check 1: Must have at least 2 language versions (including current)
    if (tags.length < 2) {
        errors.push("Hreflang requires at least 2 language versions (including current page)");
    }

    // Check 2: Current page URL should be in hreflang tags
    const currentUrlNormalized = currentUrl.replace(/\/$/, "");
    const hasCurrentUrl = tags.some(tag => tag.href.replace(/\/$/, "") === currentUrlNormalized);
    if (!hasCurrentUrl) {
        warnings.push("Current page URL not found in hreflang tags (self-referential tag recommended)");
    }

    // Check 3: No duplicate hreflang values (except x-default)
    const hreflangValues = tags.map(tag => tag.hreflang);
    const uniqueValues = new Set(hreflangValues.filter(h => h !== "x-default"));
    if (uniqueValues.size !== hreflangValues.filter(h => h !== "x-default").length) {
        errors.push("Duplicate hreflang values detected (excluding x-default)");
    }

    // Check 4: x-default should only appear once
    const xDefaultCount = hreflangValues.filter(h => h === "x-default").length;
    if (xDefaultCount > 1) {
        errors.push("Multiple x-default tags found (only one allowed)");
    }

    // Check 5: All URLs should use same protocol (http/https)
    const protocols = tags.map(tag => new URL(tag.href).protocol);
    const uniqueProtocols = new Set(protocols);
    if (uniqueProtocols.size > 1) {
        warnings.push("Mixed protocols (http/https) detected in hreflang URLs");
    }

    // Check 6: All URLs should be absolute, not relative
    const hasRelativeUrls = tags.some(tag => !tag.href.startsWith("http"));
    if (hasRelativeUrls) {
        errors.push("Hreflang URLs must be absolute (include domain)");
    }

    // Check 7: Validate locale code formats
    tags.forEach(tag => {
        if (tag.hreflang !== "x-default" && !validateLocaleCode(tag.hreflang)) {
            errors.push(`Invalid locale code: ${tag.hreflang}`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

/**
 * Get language name from locale code
 * Useful for displaying language options to users
 *
 * @param localeCode - Locale code (e.g., "en", "es-MX")
 * @returns Human-readable language name
 *
 * @example
 * getLanguageDisplayName("en"); // "English"
 * getLanguageDisplayName("es-MX"); // "Spanish (Mexico)"
 */
export function getLanguageDisplayName(localeCode: string): string {
    const languageNames: Record<string, string> = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "it": "Italian",
        "pt": "Portuguese",
        "pt-BR": "Portuguese (Brazil)",
        "nl": "Dutch",
        "pl": "Polish",
        "ru": "Russian",
        "ja": "Japanese",
        "ko": "Korean",
        "zh": "Chinese (Simplified)",
        "zh-TW": "Chinese (Traditional)",
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

    return languageNames[localeCode] || localeCode;
}

/**
 * Generate sitemap entries for multi-language content
 * Creates proper sitemap XML entries with xhtml:link elements
 *
 * @param baseUrl - Base URL of the site
 * @param slug - Article slug
 * @param languages - Array of language codes
 * @param lastmod - Last modification date (ISO format)
 * @returns Sitemap XML entries for all language versions
 *
 * @example
 * const sitemapEntries = generateSitemapEntries(
 *   "https://example.com",
 *   "my-article",
 *   ["en", "es", "fr"],
 *   "2024-01-15"
 * );
 */
export function generateSitemapEntries(
    baseUrl: string,
    slug: string,
    languages: string[],
    lastmod?: string
): string {
    const entries: string[] = [];
    const cleanBaseUrl = baseUrl.replace(/\/$/, "");

    languages.forEach(lang => {
        const url = buildLanguageUrl(cleanBaseUrl, lang, slug);
        let entry = `  <url>\n    <loc>${url}</loc>\n`;

        if (lastmod) {
            entry += `    <lastmod>${lastmod}</lastmod>\n`;
        }

        // Add xhtml:link elements for all language alternatives
        languages.forEach(altLang => {
            const altUrl = buildLanguageUrl(cleanBaseUrl, altLang, slug);
            entry += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${altUrl}" />\n`;
        });

        entry += `  </url>`;
        entries.push(entry);
    });

    return entries.join("\n");
}

/**
 * Extract language from URL
 * Detects language code from URL path
 *
 * @param url - Full URL or path
 * @returns Language code or null if not found
 *
 * @example
 * extractLanguageFromUrl("/es/my-article"); // "es"
 * extractLanguageFromUrl("https://example.com/fr/page"); // "fr"
 */
export function extractLanguageFromUrl(url: string): string | null {
    try {
        // Handle both full URLs and paths
        const path = url.startsWith("http") ? new URL(url).pathname : url;

        // Match language code at start of path: /xx/ or /xx-XX/
        const match = path.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)\//);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

/**
 * Generate canonical URL for language version
 * Determines the canonical URL for a multi-language page
 *
 * @param baseUrl - Base URL of the site
 * @param slug - Article slug
 * @param language - Language code
 * @returns Canonical URL
 */
export function generateCanonicalUrl(baseUrl: string, slug: string, language: string): string {
    return buildLanguageUrl(baseUrl.replace(/\/$/, ""), language, slug);
}
