/**
 * Localization Utility
 * Adapts content for different locales (dates, currency, measurements, cultural references)
 */

import { LocalizedArticle } from "./seo-types";

export interface LocalizationOptions {
    language: string;
    locale: string;
    adaptDates: boolean;
    adaptCurrency: boolean;
    adaptMeasurements: boolean;
    adaptCulturalReferences: boolean;
}

export interface LocalizationResult {
    localizedContent: string;
    localizedDates: Record<string, string>;
    localizedCurrency: Record<string, string>;
    localizedMeasurements: Record<string, string>;
    culturalAdaptations: Array<{
        original: string;
        adapted: string;
        reason: string;
    }>;
}

/**
 * Localize article content for a specific locale
 *
 * @param translatedArticle - Translated article content
 * @param originalContent - Original content for reference
 * @param options - Localization options
 * @returns Localized article with all adaptations
 */
export async function localizeArticle(
    translatedArticle: {
        title: string;
        metaDescription: string;
        content: string;
        keywords: string[];
        slug: string;
        culturalAdaptations: Array<{
            original: string;
            adapted: string;
            reason: string;
        }>;
    },
    originalContent: string,
    options: LocalizationOptions
): Promise<LocalizedArticle> {
    let localizedContent = translatedArticle.content;
    const localizedDates: Record<string, string> = {};
    const localizedCurrency: Record<string, string> = {};
    const localizedMeasurements: Record<string, string> = {};

    // Adapt dates to locale format
    if (options.adaptDates) {
        const dateResult = adaptDates(localizedContent, options.locale);
        localizedContent = dateResult.content;
        Object.assign(localizedDates, dateResult.conversions);
    }

    // Adapt currency to locale
    if (options.adaptCurrency) {
        const currencyResult = adaptCurrency(localizedContent, options.locale);
        localizedContent = currencyResult.content;
        Object.assign(localizedCurrency, currencyResult.conversions);
    }

    // Adapt measurements to locale
    if (options.adaptMeasurements) {
        const measurementResult = adaptMeasurements(localizedContent, options.locale);
        localizedContent = measurementResult.content;
        Object.assign(localizedMeasurements, measurementResult.conversions);
    }

    return {
        language: options.language,
        locale: options.locale,
        title: translatedArticle.title,
        metaDescription: translatedArticle.metaDescription,
        content: localizedContent,
        keywords: translatedArticle.keywords,
        slug: translatedArticle.slug,
        culturalAdaptations: translatedArticle.culturalAdaptations,
        localizedDates,
        localizedCurrency,
        localizedMeasurements,
        translatedAt: new Date().toISOString(),
    };
}

/**
 * Adapt date formats to locale conventions
 *
 * @param content - Content containing dates
 * @param locale - Target locale (e.g., "en-US", "fr-FR", "ja-JP")
 * @returns Content with localized dates and conversion map
 */
export function adaptDates(
    content: string,
    locale: string
): { content: string; conversions: Record<string, string> } {
    const conversions: Record<string, string> = {};
    let adaptedContent = content;

    // Common date patterns to detect
    const datePatterns = [
        // MM/DD/YYYY (US format)
        /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g,
        // Month DD, YYYY
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\b/gi,
        // DD Month YYYY
        /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi,
    ];

    datePatterns.forEach(pattern => {
        const matches = content.matchAll(pattern);
        for (const match of matches) {
            const originalDate = match[0];
            try {
                const parsedDate = parseFlexibleDate(originalDate);
                if (parsedDate) {
                    const localizedDate = formatDateForLocale(parsedDate, locale);
                    conversions[originalDate] = localizedDate;
                    adaptedContent = adaptedContent.replace(originalDate, localizedDate);
                }
            } catch (error) {
                // Skip dates that can't be parsed
                console.warn(`Could not parse date: ${originalDate}`);
            }
        }
    });

    return { content: adaptedContent, conversions };
}

/**
 * Parse flexible date formats into Date object
 *
 * @param dateString - Date string in various formats
 * @returns Parsed Date object or null
 */
function parseFlexibleDate(dateString: string): Date | null {
    try {
        // Try direct parsing first
        let date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return date;
        }

        // Try MM/DD/YYYY format
        const mmddyyyy = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (mmddyyyy) {
            const [, month, day, year] = mmddyyyy;
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            if (!isNaN(date.getTime())) return date;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Format date according to locale conventions
 *
 * @param date - Date object to format
 * @param locale - Target locale
 * @returns Formatted date string
 */
export function formatDateForLocale(date: Date, locale: string): string {
    try {
        return new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    } catch {
        // Fallback to ISO format
        return date.toISOString().split("T")[0];
    }
}

/**
 * Adapt currency values to locale conventions
 *
 * @param content - Content containing currency values
 * @param locale - Target locale
 * @returns Content with localized currency and conversion map
 */
export function adaptCurrency(
    content: string,
    locale: string
): { content: string; conversions: Record<string, string> } {
    const conversions: Record<string, string> = {};
    let adaptedContent = content;

    const targetCurrency = getCurrencyForLocale(locale);
    const exchangeRates = getExchangeRates(); // In production, fetch real rates

    // Detect USD amounts
    const usdPattern = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g;
    const matches = content.matchAll(usdPattern);

    for (const match of matches) {
        const originalAmount = match[0];
        const amountValue = parseFloat(match[1].replace(/,/g, ""));

        if (!isNaN(amountValue)) {
            const convertedAmount = convertCurrency(amountValue, "USD", targetCurrency, exchangeRates);
            const formattedAmount = formatCurrencyForLocale(convertedAmount, targetCurrency, locale);

            conversions[originalAmount] = formattedAmount;
            adaptedContent = adaptedContent.replace(originalAmount, formattedAmount);
        }
    }

    return { content: adaptedContent, conversions };
}

/**
 * Get appropriate currency for locale
 *
 * @param locale - Target locale code
 * @returns Currency code (e.g., "USD", "EUR", "JPY")
 */
export function getCurrencyForLocale(locale: string): string {
    const currencyMap: Record<string, string> = {
        "en-US": "USD",
        "en-GB": "GBP",
        "en": "USD",
        "es": "EUR",
        "es-ES": "EUR",
        "es-MX": "MXN",
        "fr": "EUR",
        "fr-FR": "EUR",
        "de": "EUR",
        "de-DE": "EUR",
        "it": "EUR",
        "it-IT": "EUR",
        "pt": "EUR",
        "pt-PT": "EUR",
        "pt-BR": "BRL",
        "nl": "EUR",
        "pl": "PLN",
        "ru": "RUB",
        "ja": "JPY",
        "ko": "KRW",
        "zh": "CNY",
        "zh-CN": "CNY",
        "zh-TW": "TWD",
        "ar": "AED",
        "hi": "INR",
        "tr": "TRY",
        "sv": "SEK",
        "da": "DKK",
        "no": "NOK",
        "fi": "EUR",
        "cs": "CZK",
        "el": "EUR",
        "he": "ILS",
        "th": "THB",
        "vi": "VND",
        "id": "IDR",
    };

    return currencyMap[locale] || "USD";
}

/**
 * Get exchange rates (simplified - in production, use real API)
 *
 * @returns Exchange rates relative to USD
 */
function getExchangeRates(): Record<string, number> {
    // Simplified fixed rates - in production, fetch from API
    return {
        "USD": 1.00,
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 149.50,
        "CNY": 7.24,
        "INR": 83.12,
        "BRL": 4.97,
        "MXN": 17.08,
        "KRW": 1320.00,
        "RUB": 92.50,
        "TRY": 32.15,
        "PLN": 4.02,
        "SEK": 10.45,
        "NOK": 10.71,
        "DKK": 6.86,
        "CZK": 22.85,
        "ILS": 3.65,
        "THB": 34.50,
        "VND": 24500.00,
        "IDR": 15750.00,
        "TWD": 31.50,
        "AED": 3.67,
    };
}

/**
 * Convert currency amount using exchange rates
 *
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param rates - Exchange rate map
 * @returns Converted amount
 */
function convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    rates: Record<string, number>
): number {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
}

/**
 * Format currency for locale
 *
 * @param amount - Numeric amount
 * @param currency - Currency code
 * @param locale - Target locale
 * @returns Formatted currency string
 */
export function formatCurrencyForLocale(amount: number, currency: string, locale: string): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch {
        // Fallback to simple formatting
        return `${currency} ${amount.toFixed(2)}`;
    }
}

/**
 * Adapt measurements to locale conventions (imperial vs metric)
 *
 * @param content - Content containing measurements
 * @param locale - Target locale
 * @returns Content with localized measurements and conversion map
 */
export function adaptMeasurements(
    content: string,
    locale: string
): { content: string; conversions: Record<string, string> } {
    const conversions: Record<string, string> = {};
    let adaptedContent = content;

    const useMetric = shouldUseMetric(locale);

    if (useMetric) {
        // Convert imperial to metric
        const imperialPatterns = [
            { pattern: /(\d+(?:\.\d+)?)\s*(?:miles?|mi)\b/gi, convert: milesToKm },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:feet|ft)\b/gi, convert: feetToMeters },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:inches?|in)\b/gi, convert: inchesToCm },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:pounds?|lbs?)\b/gi, convert: poundsToKg },
            { pattern: /(\d+(?:\.\d+)?)\s*(?:ounces?|oz)\b/gi, convert: ouncesToGrams },
            { pattern: /(\d+(?:\.\d+)?)\s*°F\b/gi, convert: fahrenheitToCelsius },
        ];

        imperialPatterns.forEach(({ pattern, convert }) => {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                const original = match[0];
                const value = parseFloat(match[1]);
                if (!isNaN(value)) {
                    const converted = convert(value);
                    conversions[original] = converted;
                    adaptedContent = adaptedContent.replace(original, converted);
                }
            }
        });
    }

    return { content: adaptedContent, conversions };
}

/**
 * Determine if locale uses metric system
 *
 * @param locale - Target locale
 * @returns True if metric system should be used
 */
function shouldUseMetric(locale: string): boolean {
    // Only US, UK (partially), and a few others use imperial
    const imperialLocales = ["en-US", "en-GB"];
    return !imperialLocales.includes(locale);
}

/**
 * Convert miles to kilometers
 *
 * @param miles - Miles value
 * @returns Formatted kilometers string
 */
function milesToKm(miles: number): string {
    const km = miles * 1.60934;
    return `${km.toFixed(1)} km`;
}

/**
 * Convert feet to meters
 *
 * @param feet - Feet value
 * @returns Formatted meters string
 */
function feetToMeters(feet: number): string {
    const meters = feet * 0.3048;
    return `${meters.toFixed(1)} meters`;
}

/**
 * Convert inches to centimeters
 *
 * @param inches - Inches value
 * @returns Formatted centimeters string
 */
function inchesToCm(inches: number): string {
    const cm = inches * 2.54;
    return `${cm.toFixed(1)} cm`;
}

/**
 * Convert pounds to kilograms
 *
 * @param pounds - Pounds value
 * @returns Formatted kilograms string
 */
function poundsToKg(pounds: number): string {
    const kg = pounds * 0.453592;
    return `${kg.toFixed(1)} kg`;
}

/**
 * Convert ounces to grams
 *
 * @param ounces - Ounces value
 * @returns Formatted grams string
 */
function ouncesToGrams(ounces: number): string {
    const grams = ounces * 28.3495;
    return `${grams.toFixed(0)} grams`;
}

/**
 * Convert Fahrenheit to Celsius
 *
 * @param fahrenheit - Fahrenheit value
 * @returns Formatted Celsius string
 */
function fahrenheitToCelsius(fahrenheit: number): string {
    const celsius = (fahrenheit - 32) * 5 / 9;
    return `${celsius.toFixed(1)}°C`;
}

/**
 * Generate localized slug from title
 *
 * @param title - Article title in target language
 * @param locale - Target locale
 * @returns URL-friendly slug
 */
export function generateLocalizedSlug(title: string, locale: string): string {
    let slug = title.toLowerCase();

    // Transliterate non-Latin characters for certain languages
    if (["ru", "ar", "he", "ja", "ko", "zh", "zh-TW", "th", "hi"].includes(locale)) {
        slug = transliterateToLatin(slug, locale);
    }

    // Remove special characters and replace spaces with hyphens
    slug = slug
        .normalize("NFD") // Decompose combined characters
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace multiple hyphens with single

    return slug;
}

/**
 * Transliterate non-Latin scripts to Latin characters
 *
 * @param text - Text to transliterate
 * @param locale - Source locale
 * @returns Transliterated text
 */
function transliterateToLatin(text: string, locale: string): string {
    // Simplified transliteration - in production, use proper transliteration library
    // For now, just remove non-Latin characters and replace with hyphens
    return text.replace(/[^\x00-\x7F]/g, "-");
}
