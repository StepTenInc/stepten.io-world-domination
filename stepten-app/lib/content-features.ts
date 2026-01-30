/**
 * Content Feature Extraction
 * Extracts 50+ quality metrics from article content for ML prediction
 */

import type { ContentFeatureVector } from './seo-types';

/**
 * Calculate Flesch Reading Ease score
 * Higher scores (90-100) indicate easier readability
 */
function calculateFleschReadingEase(
    totalWords: number,
    totalSentences: number,
    totalSyllables: number
): number {
    if (totalSentences === 0 || totalWords === 0) return 0;

    const avgWordsPerSentence = totalWords / totalSentences;
    const avgSyllablesPerWord = totalSyllables / totalWords;

    return 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
}

/**
 * Calculate Flesch-Kincaid Grade Level
 * Returns the US school grade level required to understand the text
 */
function calculateFleschKincaidGrade(
    totalWords: number,
    totalSentences: number,
    totalSyllables: number
): number {
    if (totalSentences === 0 || totalWords === 0) return 0;

    const avgWordsPerSentence = totalWords / totalSentences;
    const avgSyllablesPerWord = totalSyllables / totalWords;

    return 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
}

/**
 * Calculate SMOG (Simple Measure of Gobbledygook) Index
 * Estimates years of education needed to understand text
 */
function calculateSmogIndex(totalSentences: number, polysyllableCount: number): number {
    if (totalSentences === 0) return 0;

    return 1.0430 * Math.sqrt(polysyllableCount * (30 / totalSentences)) + 3.1291;
}

/**
 * Calculate Coleman-Liau Index
 * Based on characters per word and sentences per 100 words
 */
function calculateColemanLiauIndex(
    totalWords: number,
    totalSentences: number,
    totalCharacters: number
): number {
    if (totalWords === 0) return 0;

    const L = (totalCharacters / totalWords) * 100;
    const S = (totalSentences / totalWords) * 100;

    return 0.0588 * L - 0.296 * S - 15.8;
}

/**
 * Calculate Automated Readability Index (ARI)
 * Based on characters per word and words per sentence
 */
function calculateAutomatedReadabilityIndex(
    totalWords: number,
    totalSentences: number,
    totalCharacters: number
): number {
    if (totalSentences === 0 || totalWords === 0) return 0;

    return 4.71 * (totalCharacters / totalWords) + 0.5 * (totalWords / totalSentences) - 21.43;
}

/**
 * Count syllables in a word (approximation)
 */
function countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
}

/**
 * Check if a word is polysyllabic (3+ syllables)
 */
function isPolysyllabic(word: string): boolean {
    return countSyllables(word) >= 3;
}

/**
 * Extract text content from HTML, removing tags
 */
function stripHtml(html: string): string {
    return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Count HTML elements by tag name
 */
function countHtmlElements(html: string, tagName: string): number {
    const regex = new RegExp(`<${tagName}[^>]*>`, 'gi');
    const matches = html.match(regex);
    return matches ? matches.length : 0;
}

/**
 * Extract all words from text
 */
function extractWords(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 0);
}

/**
 * Calculate lexical diversity (unique words / total words)
 */
function calculateLexicalDiversity(words: string[]): number {
    if (words.length === 0) return 0;
    const uniqueWords = new Set(words);
    return uniqueWords.size / words.length;
}

/**
 * Calculate keyword density
 */
function calculateKeywordDensity(content: string, keyword: string): number {
    const text = stripHtml(content).toLowerCase();
    const words = extractWords(text);

    if (words.length === 0) return 0;

    const keywordWords = keyword.toLowerCase().split(/\s+/);
    const keywordLength = keywordWords.length;

    let occurrences = 0;

    for (let i = 0; i <= words.length - keywordLength; i++) {
        const phrase = words.slice(i, i + keywordLength).join(' ');
        if (phrase === keywordWords.join(' ')) {
            occurrences++;
        }
    }

    return (occurrences / words.length) * 100;
}

/**
 * Check if keyword appears in specific location
 */
function keywordInLocation(html: string, keyword: string, location: 'title' | 'first' | 'last'): boolean {
    const text = stripHtml(html).toLowerCase();
    const keywordLower = keyword.toLowerCase();

    if (location === 'title') {
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
        if (titleMatch) {
            return titleMatch[1].toLowerCase().includes(keywordLower);
        }
        const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
        if (h1Match) {
            return stripHtml(h1Match[1]).toLowerCase().includes(keywordLower);
        }
        return false;
    }

    const paragraphs = text.split(/\n\n+/);
    if (paragraphs.length === 0) return false;

    if (location === 'first') {
        return paragraphs[0].toLowerCase().includes(keywordLower);
    }

    if (location === 'last') {
        return paragraphs[paragraphs.length - 1].toLowerCase().includes(keywordLower);
    }

    return false;
}

/**
 * Count keyword appearances in headings
 */
function countKeywordInHeadings(html: string, keyword: string): number {
    const keywordLower = keyword.toLowerCase();
    const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
    const headings = html.match(headingRegex) || [];

    return headings.filter(heading =>
        stripHtml(heading).toLowerCase().includes(keywordLower)
    ).length;
}

/**
 * Extract links from HTML
 */
function extractLinks(html: string): Array<{ url: string; rel: string }> {
    const linkRegex = /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi;
    const links: Array<{ url: string; rel: string }> = [];

    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        const attributes = match[1];
        const url = match[2];
        const relMatch = attributes.match(/rel=["']([^"']+)["']/i);
        const rel = relMatch ? relMatch[1] : '';

        links.push({ url, rel });
    }

    return links;
}

/**
 * Categorize links as internal or external
 */
function categorizeLinks(links: Array<{ url: string; rel: string }>, domain: string): {
    internal: number;
    external: number;
    follow: number;
    nofollow: number;
} {
    let internal = 0;
    let external = 0;
    let follow = 0;
    let nofollow = 0;

    links.forEach(link => {
        const isInternal = link.url.includes(domain) || link.url.startsWith('/');
        if (isInternal) {
            internal++;
        } else {
            external++;
        }

        if (link.rel.toLowerCase().includes('nofollow')) {
            nofollow++;
        } else {
            follow++;
        }
    });

    return { internal, external, follow, nofollow };
}

/**
 * Calculate sentiment score (-1 to 1)
 * Positive sentiment = 1, Negative = -1, Neutral = 0
 */
function calculateSentimentScore(text: string): number {
    const positiveWords = [
        'good', 'great', 'excellent', 'amazing', 'best', 'wonderful', 'fantastic',
        'outstanding', 'superior', 'beneficial', 'advantage', 'success', 'effective',
        'efficient', 'powerful', 'innovative', 'revolutionary', 'perfect', 'ideal'
    ];

    const negativeWords = [
        'bad', 'poor', 'terrible', 'awful', 'worst', 'horrible', 'disappointing',
        'inferior', 'disadvantage', 'failure', 'ineffective', 'inefficient', 'weak',
        'problematic', 'flawed', 'broken', 'buggy', 'outdated'
    ];

    const words = extractWords(text);
    let score = 0;

    words.forEach(word => {
        if (positiveWords.includes(word)) score++;
        if (negativeWords.includes(word)) score--;
    });

    if (words.length === 0) return 0;
    return Math.max(-1, Math.min(1, score / words.length * 10));
}

/**
 * Calculate formality score (0 to 1)
 * Higher = more formal
 */
function calculateFormalityScore(text: string): number {
    const words = extractWords(text);
    if (words.length === 0) return 0.5;

    const informalIndicators = [
        'gonna', 'wanna', 'kinda', 'yeah', 'yep', 'nope', 'cool', 'awesome',
        'stuff', 'things', 'lots', 'pretty', 'really', 'very', 'super'
    ];

    const formalIndicators = [
        'therefore', 'furthermore', 'consequently', 'nevertheless', 'moreover',
        'accordingly', 'thus', 'hence', 'subsequently', 'specifically', 'particularly'
    ];

    let informalCount = 0;
    let formalCount = 0;

    words.forEach(word => {
        if (informalIndicators.includes(word)) informalCount++;
        if (formalIndicators.includes(word)) formalCount++;
    });

    const totalIndicators = informalCount + formalCount;
    if (totalIndicators === 0) return 0.5;

    return formalCount / totalIndicators;
}

/**
 * Count specific patterns in content
 */
function countPatterns(text: string, pattern: RegExp): number {
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
}

/**
 * Calculate estimated reading time in minutes
 */
function calculateReadingTime(wordCount: number): number {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extract all content features from HTML content
 * @param content - HTML content of the article
 * @param keyword - Target keyword for the article
 * @param title - Article title
 * @param metaDescription - Meta description
 * @param url - Article URL
 * @param competitorData - Optional competitor analysis data
 * @returns Complete feature vector for ML prediction
 */
export function extractContentFeatures(
    content: string,
    keyword: string,
    title: string = '',
    metaDescription: string = '',
    url: string = '',
    competitorData?: {
        avgWordCount: number;
        avgHeadings: number;
    }
): ContentFeatureVector {
    // Extract text content
    const text = stripHtml(content);
    const words = extractWords(text);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

    // Calculate syllables and polysyllables
    let totalSyllables = 0;
    let polysyllableCount = 0;
    words.forEach(word => {
        const syllables = countSyllables(word);
        totalSyllables += syllables;
        if (syllables >= 3) polysyllableCount++;
    });

    const totalCharacters = text.replace(/\s/g, '').length;
    const totalWords = words.length;
    const totalSentences = sentences.length;

    // Content metrics
    const wordCount = totalWords;
    const paragraphCount = paragraphs.length;
    const sentenceCount = totalSentences;
    const avgSentenceLength = totalSentences > 0 ? totalWords / totalSentences : 0;
    const avgParagraphLength = paragraphCount > 0 ? totalWords / paragraphCount : 0;

    // Readability metrics
    const fleschReadingEase = calculateFleschReadingEase(totalWords, totalSentences, totalSyllables);
    const fleschKincaidGrade = calculateFleschKincaidGrade(totalWords, totalSentences, totalSyllables);
    const smogIndex = calculateSmogIndex(totalSentences, polysyllableCount);
    const colemanLiauIndex = calculateColemanLiauIndex(totalWords, totalSentences, totalCharacters);
    const automatedReadabilityIndex = calculateAutomatedReadabilityIndex(totalWords, totalSentences, totalCharacters);

    // Keyword metrics
    const keywordDensity = calculateKeywordDensity(content, keyword);
    const keywordFrequency = Math.floor((keywordDensity / 100) * totalWords);
    const keywordInTitle = keywordInLocation(content, keyword, 'title') || title.toLowerCase().includes(keyword.toLowerCase());
    const keywordInFirstParagraph = keywordInLocation(content, keyword, 'first');
    const keywordInLastParagraph = keywordInLocation(content, keyword, 'last');
    const keywordInHeadings = countKeywordInHeadings(content, keyword);
    const semanticKeywordCoverage = 0.7; // Placeholder - would need semantic analysis

    // Structure metrics
    const h1Count = countHtmlElements(content, 'h1');
    const h2Count = countHtmlElements(content, 'h2');
    const h3Count = countHtmlElements(content, 'h3');
    const h4Count = countHtmlElements(content, 'h4');
    const totalHeadingCount = h1Count + h2Count + h3Count + h4Count;
    const listCount = countHtmlElements(content, 'ul') + countHtmlElements(content, 'ol');
    const tableCount = countHtmlElements(content, 'table');
    const imageCount = countHtmlElements(content, 'img');

    // Link metrics
    const links = extractLinks(content);
    const linkCategories = categorizeLinks(links, url);
    const internalLinkCount = linkCategories.internal;
    const externalLinkCount = linkCategories.external;
    const followLinkCount = linkCategories.follow;
    const nofollowLinkCount = linkCategories.nofollow;
    const avgLinkAuthority = 50; // Placeholder - would need actual DA lookup

    // Content quality metrics
    const uniqueWords = new Set(words);
    const uniqueWordRatio = totalWords > 0 ? uniqueWords.size / totalWords : 0;
    const lexicalDiversity = calculateLexicalDiversity(words);
    const contentDepth = Math.min(100, (wordCount / 1000) * 50 + (totalHeadingCount * 5));
    const questionCount = countPatterns(text, /\?/g);
    const statCount = countPatterns(text, /\d+%|\d+,\d+|\d+\.\d+/g);
    const quoteCount = countHtmlElements(content, 'blockquote');
    const codeBlockCount = countHtmlElements(content, 'code') + countHtmlElements(content, 'pre');

    // SEO metrics
    const titleLength = title.length;
    const metaDescriptionLength = metaDescription.length;
    const urlLength = url.length;
    const hasSchema = content.includes('application/ld+json') || content.includes('schema.org');
    const hasFAQ = content.toLowerCase().includes('faq') || content.toLowerCase().includes('frequently asked');
    const hasHowTo = content.toLowerCase().includes('how to') || content.toLowerCase().includes('step-by-step');

    // Engagement metrics
    const estimatedReadTime = calculateReadingTime(wordCount);
    const multimediaCount = imageCount + countHtmlElements(content, 'video') + countHtmlElements(content, 'audio');
    const interactiveElementCount = countHtmlElements(content, 'button') + countHtmlElements(content, 'form');
    const ctaCount = countPatterns(content, /download|subscribe|sign up|get started|learn more|buy now|try free/gi);

    // Advanced NLP metrics
    const entityDensity = 0.05; // Placeholder - would need NER
    const topicCoverage = 0.75; // Placeholder - would need topic modeling
    const sentimentScore = calculateSentimentScore(text);
    const formalityScore = calculateFormalityScore(text);

    // Competitive metrics
    const competitorAvgWordCount = competitorData?.avgWordCount || 1500;
    const competitorAvgHeadings = competitorData?.avgHeadings || 8;
    const contentGapScore = Math.max(0, 100 - Math.abs(wordCount - competitorAvgWordCount) / 50);
    const differentiationScore = Math.min(100, uniqueWordRatio * 100 + (totalHeadingCount > competitorAvgHeadings ? 20 : 0));

    return {
        // Content metrics
        wordCount,
        paragraphCount,
        sentenceCount,
        avgSentenceLength,
        avgParagraphLength,

        // Readability metrics
        fleschReadingEase,
        fleschKincaidGrade,
        smogIndex,
        colemanLiauIndex,
        automatedReadabilityIndex,

        // Keyword metrics
        keywordDensity,
        keywordFrequency,
        keywordInTitle,
        keywordInFirstParagraph,
        keywordInLastParagraph,
        keywordInHeadings,
        semanticKeywordCoverage,

        // Structure metrics
        h1Count,
        h2Count,
        h3Count,
        h4Count,
        totalHeadingCount,
        listCount,
        tableCount,
        imageCount,

        // Link metrics
        internalLinkCount,
        externalLinkCount,
        followLinkCount,
        nofollowLinkCount,
        avgLinkAuthority,

        // Content quality metrics
        uniqueWordRatio,
        lexicalDiversity,
        contentDepth,
        questionCount,
        statCount,
        quoteCount,
        codeBlockCount,

        // SEO metrics
        titleLength,
        metaDescriptionLength,
        urlLength,
        hasSchema,
        hasFAQ,
        hasHowTo,

        // Engagement metrics
        estimatedReadTime,
        multimediaCount,
        interactiveElementCount,
        ctaCount,

        // Advanced NLP metrics
        entityDensity,
        topicCoverage,
        sentimentScore,
        formalityScore,

        // Competitive metrics
        competitorAvgWordCount,
        competitorAvgHeadings,
        contentGapScore,
        differentiationScore,
    };
}

/**
 * Get feature importance scores
 * Returns the relative importance of each feature for ranking prediction
 */
export function getFeatureImportance(): Record<string, number> {
    return {
        // High importance features (0.8-1.0)
        wordCount: 0.95,
        keywordDensity: 0.90,
        fleschReadingEase: 0.88,
        contentDepth: 0.92,
        totalHeadingCount: 0.87,
        externalLinkCount: 0.89,
        keywordInTitle: 0.94,

        // Medium importance features (0.5-0.79)
        avgSentenceLength: 0.72,
        lexicalDiversity: 0.68,
        internalLinkCount: 0.75,
        imageCount: 0.65,
        metaDescriptionLength: 0.70,
        uniqueWordRatio: 0.66,
        topicCoverage: 0.78,

        // Lower importance features (0.3-0.49)
        paragraphCount: 0.45,
        listCount: 0.42,
        tableCount: 0.38,
        questionCount: 0.44,
        statCount: 0.46,
        multimediaCount: 0.40,

        // Supporting features (0.1-0.29)
        quoteCount: 0.25,
        codeBlockCount: 0.22,
        ctaCount: 0.28,
        formalityScore: 0.24,
        sentimentScore: 0.20,
    };
}

/**
 * Normalize feature values to 0-100 scale
 */
export function normalizeFeatures(features: ContentFeatureVector): Record<string, number> {
    return {
        wordCount: Math.min(100, (features.wordCount / 3000) * 100),
        readability: Math.max(0, Math.min(100, features.fleschReadingEase)),
        keywordOptimization: Math.min(100, features.keywordDensity * 50),
        structure: Math.min(100, (features.totalHeadingCount / 15) * 100),
        links: Math.min(100, ((features.internalLinkCount + features.externalLinkCount) / 10) * 100),
        engagement: Math.min(100, (features.multimediaCount / 5) * 100),
        seoBasics: (
            (features.keywordInTitle ? 25 : 0) +
            (features.titleLength >= 50 && features.titleLength <= 60 ? 25 : 0) +
            (features.metaDescriptionLength >= 140 && features.metaDescriptionLength <= 160 ? 25 : 0) +
            (features.hasSchema ? 25 : 0)
        ),
    };
}
