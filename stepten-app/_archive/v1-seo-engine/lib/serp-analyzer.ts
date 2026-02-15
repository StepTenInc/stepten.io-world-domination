/**
 * SERP Analysis Utility
 * Fetches and analyzes Google Search Engine Results Pages (SERP)
 */

import { SERP_RESULTS_COUNT, SCRAPE_TIMEOUT_MS, USER_AGENT, SCRAPE_RETRY_ATTEMPTS } from "./constants";
import type { SERPAnalysis, SERPArticle } from "./seo-types";

interface GoogleSearchResult {
    position: number;
    title: string;
    url: string;
    snippet: string;
    displayedUrl?: string;
}

interface FeaturedSnippet {
    type: 'paragraph' | 'list' | 'table' | 'video';
    content: string;
    source: string;
    position: number;
}

interface PeopleAlsoAsk {
    question: string;
    answer: string;
    source: string;
}

/**
 * Fetches SERP data for a given keyword from Google Search
 *
 * @param keyword - The search keyword to analyze
 * @returns Array of search results
 *
 * @example
 * const results = await fetchGoogleSERP("best seo practices 2026");
 */
export async function fetchGoogleSERP(keyword: string): Promise<GoogleSearchResult[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);

    try {
        // In production, you would use a SERP API service like:
        // - SerpAPI (https://serpapi.com/)
        // - ScraperAPI (https://www.scraperapi.com/)
        // - DataForSEO (https://dataforseo.com/)

        // For now, we'll simulate with mock data
        // In real implementation, replace this with actual API call
        const mockResults: GoogleSearchResult[] = generateMockSERPResults(keyword);

        clearTimeout(timeoutId);
        return mockResults;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`SERP fetch timeout after ${SCRAPE_TIMEOUT_MS}ms`);
        }

        throw new Error(`Failed to fetch SERP data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Extracts featured snippet from SERP if present
 *
 * @param keyword - The search keyword
 * @returns Featured snippet data or undefined
 */
export async function extractFeaturedSnippet(keyword: string): Promise<FeaturedSnippet | undefined> {
    try {
        // In production, parse from SERP HTML or API response
        // This is a mock implementation
        const hasSnippet = Math.random() > 0.5; // 50% chance for demo

        if (!hasSnippet) return undefined;

        return {
            type: 'paragraph',
            content: `Featured snippet content for "${keyword}". This would be extracted from actual SERP data.`,
            source: 'https://example.com/featured-article',
            position: 0
        };
    } catch (error) {
        console.error('Failed to extract featured snippet:', error);
        return undefined;
    }
}

/**
 * Extracts "People Also Ask" questions from SERP
 *
 * @param keyword - The search keyword
 * @returns Array of related questions
 */
export async function extractPeopleAlsoAsk(keyword: string): Promise<PeopleAlsoAsk[]> {
    try {
        // In production, parse from SERP HTML or API response
        // This is a mock implementation
        const questions: PeopleAlsoAsk[] = [
            {
                question: `What is ${keyword}?`,
                answer: `${keyword} refers to...`,
                source: 'https://example.com/what-is'
            },
            {
                question: `How to use ${keyword}?`,
                answer: 'You can use it by...',
                source: 'https://example.com/how-to'
            },
            {
                question: `Why is ${keyword} important?`,
                answer: 'It is important because...',
                source: 'https://example.com/importance'
            },
            {
                question: `When should you use ${keyword}?`,
                answer: 'You should use it when...',
                source: 'https://example.com/when'
            }
        ];

        return questions;
    } catch (error) {
        console.error('Failed to extract People Also Ask:', error);
        return [];
    }
}

/**
 * Extracts related searches from SERP
 *
 * @param keyword - The search keyword
 * @returns Array of related search terms
 */
export async function extractRelatedSearches(keyword: string): Promise<string[]> {
    try {
        // In production, parse from SERP HTML or API response
        // This is a mock implementation
        const baseKeyword = keyword.toLowerCase();

        return [
            `${baseKeyword} guide`,
            `${baseKeyword} best practices`,
            `${baseKeyword} tutorial`,
            `${baseKeyword} tips`,
            `${baseKeyword} examples`,
            `${baseKeyword} vs alternatives`,
            `how to implement ${baseKeyword}`,
            `${baseKeyword} for beginners`
        ];
    } catch (error) {
        console.error('Failed to extract related searches:', error);
        return [];
    }
}

/**
 * Performs comprehensive SERP analysis for a keyword
 *
 * @param keyword - The target keyword to analyze
 * @param searchVolume - Optional search volume (default: 1000)
 * @param difficulty - Optional keyword difficulty (default: 50)
 * @returns Complete SERP analysis data
 *
 * @example
 * const analysis = await analyzeSERP("content marketing strategy");
 * console.log(analysis.topRankingArticles);
 * console.log(analysis.recommendations);
 */
export async function analyzeSERP(
    keyword: string,
    searchVolume: number = 1000,
    difficulty: number = 50
): Promise<SERPAnalysis> {
    try {
        // Fetch all SERP components in parallel
        const [searchResults, featuredSnippet, peopleAlsoAsk, relatedSearches] = await Promise.all([
            fetchGoogleSERP(keyword),
            extractFeaturedSnippet(keyword),
            extractPeopleAlsoAsk(keyword),
            extractRelatedSearches(keyword)
        ]);

        // Convert search results to SERPArticle format
        const topRankingArticles: SERPArticle[] = searchResults.slice(0, SERP_RESULTS_COUNT).map(result => ({
            position: result.position,
            url: result.url,
            title: result.title,
            snippet: result.snippet,
            wordCount: estimateWordCount(result.snippet),
            headings: extractHeadingsFromTitle(result.title),
            topics: extractTopicsFromSnippet(result.snippet),
            entities: extractEntitiesFromSnippet(result.snippet),
            contentType: determineContentType(result.title),
            hasVideo: result.title.toLowerCase().includes('video') || result.snippet.toLowerCase().includes('video'),
            hasFAQ: result.snippet.toLowerCase().includes('faq') || result.snippet.toLowerCase().includes('question'),
            hasTable: result.snippet.toLowerCase().includes('table') || result.snippet.toLowerCase().includes('comparison'),
            domainAuthority: 50 + Math.floor(Math.random() * 40), // Mock DA
            backlinks: Math.floor(Math.random() * 10000) // Mock backlinks
        }));

        // Calculate common patterns across top results
        const commonPatterns = calculateCommonPatterns(topRankingArticles);

        // Generate recommendations based on SERP analysis
        const recommendations = generateRecommendations(topRankingArticles, commonPatterns, featuredSnippet);

        return {
            keyword,
            searchVolume,
            difficulty,
            topRankingArticles,
            featuredSnippet,
            peopleAlsoAsk,
            relatedSearches,
            commonPatterns,
            recommendations,
            analyzedAt: new Date().toISOString()
        };

    } catch (error) {
        throw new Error(`SERP analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Calculates common patterns across top-ranking articles
 */
function calculateCommonPatterns(articles: SERPArticle[]) {
    const totalArticles = articles.length;

    if (totalArticles === 0) {
        return {
            avgWordCount: 0,
            avgHeadings: 0,
            commonHeadings: [],
            sharedTopics: [],
            contentGaps: [],
            commonContentTypes: {}
        };
    }

    // Calculate averages
    const avgWordCount = Math.floor(
        articles.reduce((sum, a) => sum + a.wordCount, 0) / totalArticles
    );

    const avgHeadings = Math.floor(
        articles.reduce((sum, a) => sum + a.headings.length, 0) / totalArticles
    );

    // Find common headings (appearing in 30%+ of articles)
    const headingCounts: Record<string, number> = {};
    articles.forEach(article => {
        article.headings.forEach(heading => {
            const normalized = heading.toLowerCase();
            headingCounts[normalized] = (headingCounts[normalized] || 0) + 1;
        });
    });

    const commonHeadings = Object.entries(headingCounts)
        .filter(([_, count]) => count >= totalArticles * 0.3)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 10)
        .map(([heading]) => heading);

    // Find shared topics (appearing in 40%+ of articles)
    const topicCounts: Record<string, number> = {};
    articles.forEach(article => {
        article.topics.forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
    });

    const sharedTopics = Object.entries(topicCounts)
        .filter(([_, count]) => count >= totalArticles * 0.4)
        .sort(([_, a], [__, b]) => b - a)
        .map(([topic]) => topic);

    // Identify content gaps (topics in some but not all)
    const contentGaps = Object.entries(topicCounts)
        .filter(([_, count]) => count < totalArticles * 0.5 && count >= 2)
        .sort(([_, a], [__, b]) => b - a)
        .slice(0, 5)
        .map(([topic]) => topic);

    // Content type distribution
    const contentTypeCounts: Record<string, number> = {};
    articles.forEach(article => {
        contentTypeCounts[article.contentType] = (contentTypeCounts[article.contentType] || 0) + 1;
    });

    return {
        avgWordCount,
        avgHeadings,
        commonHeadings,
        sharedTopics,
        contentGaps,
        commonContentTypes: contentTypeCounts
    };
}

/**
 * Generates actionable recommendations based on SERP analysis
 */
function generateRecommendations(
    articles: SERPArticle[],
    patterns: ReturnType<typeof calculateCommonPatterns>,
    featuredSnippet?: FeaturedSnippet
) {
    // Determine target word count (aim for top quartile)
    const wordCounts = articles.map(a => a.wordCount).sort((a, b) => b - a);
    const topQuartileWordCount = wordCounts[Math.floor(wordCounts.length * 0.25)] || 1500;
    const targetWordCount = Math.max(topQuartileWordCount, patterns.avgWordCount * 1.1);

    // Must-have topics (those appearing in majority of top results)
    const mustHaveTopics = patterns.sharedTopics.slice(0, 8);

    // Suggested headings from common patterns
    const suggestedHeadings = patterns.commonHeadings.slice(0, 6);

    // Determine content angle based on what's ranking
    const contentTypeEntries = Object.entries(patterns.commonContentTypes);
    const dominantType = contentTypeEntries.length > 0
        ? contentTypeEntries.sort(([_, a], [__, b]) => b - a)[0][0]
        : 'article';

    const contentAngle = `Focus on a ${dominantType} format with comprehensive coverage of: ${mustHaveTopics.slice(0, 3).join(', ')}`;

    // Check snippet opportunity
    const snippetOpportunity = !featuredSnippet ||
        (featuredSnippet && articles.findIndex(a => a.url === featuredSnippet.source) > 3);

    return {
        targetWordCount: Math.floor(targetWordCount),
        mustHaveTopics,
        suggestedHeadings,
        contentAngle,
        snippetOpportunity
    };
}

// Helper functions

function estimateWordCount(text: string): number {
    // For mock data, generate realistic word counts
    return 1000 + Math.floor(Math.random() * 2000);
}

function extractHeadingsFromTitle(title: string): string[] {
    // Extract potential heading topics from title
    const headings: string[] = [];

    // Common patterns
    if (title.includes(':')) {
        const parts = title.split(':');
        headings.push(...parts.map(p => p.trim()));
    }

    if (title.includes('|')) {
        const parts = title.split('|');
        headings.push(parts[0].trim());
    }

    // Add the title itself as main heading
    headings.push(title.split('|')[0].split('-')[0].trim());

    return headings.filter(h => h.length > 0);
}

function extractTopicsFromSnippet(snippet: string): string[] {
    // Extract key topics/keywords from snippet
    const topics: string[] = [];
    const words = snippet.toLowerCase().split(/\s+/);

    // Common SEO-related topics for demo
    const commonTopics = [
        'seo', 'optimization', 'keywords', 'content', 'ranking',
        'strategy', 'marketing', 'analytics', 'backlinks', 'traffic'
    ];

    commonTopics.forEach(topic => {
        if (snippet.toLowerCase().includes(topic)) {
            topics.push(topic);
        }
    });

    return [...new Set(topics)];
}

function extractEntitiesFromSnippet(snippet: string): string[] {
    // Extract named entities (simplified version)
    const entities: string[] = [];

    // Look for capitalized words (potential entities)
    const capitalizedWords = snippet.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    entities.push(...capitalizedWords.slice(0, 5));

    return [...new Set(entities)];
}

function determineContentType(title: string): SERPArticle['contentType'] {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.match(/\b\d+\s+(best|top|ways|tips|reasons)/)) {
        return 'listicle';
    }
    if (lowerTitle.includes('guide') || lowerTitle.includes('how to')) {
        return 'guide';
    }
    if (lowerTitle.includes('review')) {
        return 'review';
    }
    if (lowerTitle.includes('vs') || lowerTitle.includes('versus') || lowerTitle.includes('comparison')) {
        return 'comparison';
    }

    return 'article';
}

/**
 * Generates mock SERP results for development/testing
 * In production, this would be replaced with actual SERP API data
 */
function generateMockSERPResults(keyword: string): GoogleSearchResult[] {
    const results: GoogleSearchResult[] = [];
    const contentTypes = ['guide', 'listicle', 'article', 'review', 'comparison'];

    for (let i = 1; i <= SERP_RESULTS_COUNT; i++) {
        const contentType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
        const year = 2024 + Math.floor(Math.random() * 2);

        results.push({
            position: i,
            title: `${keyword} - ${contentType === 'listicle' ? `${Math.floor(Math.random() * 10) + 5} Best` : contentType === 'guide' ? 'Complete Guide' : contentType === 'review' ? 'Review & Analysis' : contentType === 'comparison' ? 'Comparison & Alternatives' : 'Ultimate Resource'} (${year})`,
            url: `https://example${i}.com/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `Learn everything about ${keyword}. This comprehensive ${contentType} covers SEO optimization, best practices, and proven strategies to improve your ${keyword} implementation. Updated ${year}.`,
            displayedUrl: `example${i}.com`
        });
    }

    return results;
}
