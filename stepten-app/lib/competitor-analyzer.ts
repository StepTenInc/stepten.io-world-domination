/**
 * Competitor Analysis Utility
 * Scrapes and analyzes top-ranking competitor articles
 */

import {
    SCRAPE_TIMEOUT_MS,
    USER_AGENT,
    MAX_COMPETITOR_ARTICLES,
    MIN_CONTENT_LENGTH,
    SCRAPE_RETRY_ATTEMPTS
} from "./constants";
import type { SERPArticle, Entity, TopicCoverage } from "./seo-types";

interface CompetitorContent {
    url: string;
    title: string;
    wordCount: number;
    headings: string[];
    paragraphs: string[];
    topics: string[];
    entities: Entity[];
    hasVideo: boolean;
    hasFAQ: boolean;
    hasTable: boolean;
    internalLinks: number;
    externalLinks: number;
    images: number;
    lastModified?: string;
}

interface CompetitorAnalysis {
    averageWordCount: number;
    medianWordCount: number;
    wordCountRange: { min: number; max: number };
    commonHeadings: Array<{ heading: string; frequency: number }>;
    commonTopics: Array<{ topic: string; frequency: number }>;
    commonEntities: Entity[];
    contentGaps: string[];
    structurePatterns: {
        avgHeadings: number;
        avgParagraphs: number;
        avgInternalLinks: number;
        avgExternalLinks: number;
        avgImages: number;
        videoPercentage: number;
        faqPercentage: number;
        tablePercentage: number;
    };
    topicCoverage: TopicCoverage;
}

/**
 * Fetches and parses content from a competitor URL
 *
 * @param url - The URL to scrape
 * @param retries - Number of retry attempts
 * @returns Parsed competitor content
 *
 * @example
 * const content = await scrapeCompetitorContent("https://example.com/article");
 * console.log(content.wordCount, content.headings);
 */
export async function scrapeCompetitorContent(
    url: string,
    retries: number = SCRAPE_RETRY_ATTEMPTS
): Promise<CompetitorContent> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);

    try {
        // In production, use a scraping service like:
        // - ScrapingBee (https://www.scrapingbee.com/)
        // - ScraperAPI (https://www.scraperapi.com/)
        // - Apify (https://apify.com/)

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();

        if (html.length < MIN_CONTENT_LENGTH) {
            throw new Error('Content too short or blocked');
        }

        // Parse the HTML content
        const content = parseHTML(html, url);

        return content;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Scrape timeout after ${SCRAPE_TIMEOUT_MS}ms`);
        }

        // Retry logic
        if (retries > 0) {
            console.warn(`Scraping ${url} failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
            return scrapeCompetitorContent(url, retries - 1);
        }

        throw new Error(`Failed to scrape ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Parses HTML content and extracts structured data
 *
 * @param html - Raw HTML string
 * @param url - Source URL
 * @returns Structured content data
 */
function parseHTML(html: string, url: string): CompetitorContent {
    // In a real implementation, use a proper HTML parser like:
    // - cheerio (Node.js)
    // - jsdom (Node.js)
    // - DOMParser (Browser)

    // For this implementation, we'll use basic regex and string parsing
    // This is a simplified version - production code should use proper HTML parsing

    const title = extractTitle(html);
    const headings = extractHeadings(html);
    const paragraphs = extractParagraphs(html);
    const wordCount = calculateWordCount(paragraphs.join(' '));
    const topics = extractTopics(html);
    const entities = extractEntities(html);
    const links = extractLinks(html, url);

    return {
        url,
        title,
        wordCount,
        headings,
        paragraphs,
        topics,
        entities,
        hasVideo: html.toLowerCase().includes('<video') || html.toLowerCase().includes('youtube.com') || html.toLowerCase().includes('vimeo.com'),
        hasFAQ: html.toLowerCase().includes('faq') || html.includes('itemtype="https://schema.org/FAQPage"'),
        hasTable: html.toLowerCase().includes('<table'),
        internalLinks: links.internal,
        externalLinks: links.external,
        images: (html.match(/<img/gi) || []).length,
        lastModified: extractLastModified(html)
    };
}

/**
 * Analyzes multiple competitor articles to identify patterns
 *
 * @param articles - Array of SERP articles to analyze
 * @param maxArticles - Maximum number of articles to analyze
 * @returns Comprehensive competitor analysis
 *
 * @example
 * const analysis = await analyzeCompetitors(topRankingArticles);
 * console.log(analysis.averageWordCount);
 * console.log(analysis.contentGaps);
 */
export async function analyzeCompetitors(
    articles: SERPArticle[],
    maxArticles: number = MAX_COMPETITOR_ARTICLES
): Promise<CompetitorAnalysis> {
    const articlesToAnalyze = articles.slice(0, maxArticles);

    // Scrape content from competitor URLs
    const scrapedContent: CompetitorContent[] = [];

    for (const article of articlesToAnalyze) {
        try {
            const content = await scrapeCompetitorContent(article.url);
            scrapedContent.push(content);
        } catch (error) {
            console.error(`Failed to scrape ${article.url}:`, error);
            // Use fallback data from SERP snippet
            scrapedContent.push(createFallbackContent(article));
        }
    }

    // Calculate statistics
    const wordCounts = scrapedContent.map(c => c.wordCount).sort((a, b) => a - b);
    const averageWordCount = Math.floor(
        wordCounts.reduce((sum, wc) => sum + wc, 0) / wordCounts.length
    );
    const medianWordCount = wordCounts[Math.floor(wordCounts.length / 2)] || 1500;

    // Find common headings
    const headingCounts: Record<string, number> = {};
    scrapedContent.forEach(content => {
        content.headings.forEach(heading => {
            const normalized = normalizeHeading(heading);
            if (normalized) {
                headingCounts[normalized] = (headingCounts[normalized] || 0) + 1;
            }
        });
    });

    const commonHeadings = Object.entries(headingCounts)
        .map(([heading, frequency]) => ({ heading, frequency }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 15);

    // Find common topics
    const topicCounts: Record<string, number> = {};
    scrapedContent.forEach(content => {
        content.topics.forEach(topic => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
    });

    const commonTopics = Object.entries(topicCounts)
        .map(([topic, frequency]) => ({ topic, frequency }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 20);

    // Aggregate entities
    const entityMap: Record<string, Entity> = {};
    scrapedContent.forEach(content => {
        content.entities.forEach(entity => {
            if (entityMap[entity.name]) {
                entityMap[entity.name].mentions += entity.mentions;
                entityMap[entity.name].competitorMentions += 1;
            } else {
                entityMap[entity.name] = {
                    ...entity,
                    competitorMentions: 1
                };
            }
        });
    });

    const commonEntities = Object.values(entityMap)
        .sort((a, b) => b.competitorMentions - a.competitorMentions)
        .slice(0, 10);

    // Identify content gaps
    const contentGaps = identifyContentGaps(commonTopics, commonHeadings);

    // Calculate structure patterns
    const structurePatterns = calculateStructurePatterns(scrapedContent);

    // Generate topic coverage analysis
    const topicCoverage = generateTopicCoverage(commonTopics, commonEntities, scrapedContent.length);

    return {
        averageWordCount,
        medianWordCount,
        wordCountRange: {
            min: wordCounts[0] || 0,
            max: wordCounts[wordCounts.length - 1] || 0
        },
        commonHeadings,
        commonTopics,
        commonEntities,
        contentGaps,
        structurePatterns,
        topicCoverage
    };
}

/**
 * Identifies content gaps and opportunities
 */
function identifyContentGaps(
    topics: Array<{ topic: string; frequency: number }>,
    headings: Array<{ heading: string; frequency: number }>
): string[] {
    const gaps: string[] = [];

    // Topics mentioned in some articles but not all (opportunity to stand out)
    topics.forEach(({ topic, frequency }) => {
        if (frequency >= 2 && frequency <= 5) {
            gaps.push(`Underexplored topic: ${topic}`);
        }
    });

    // Headings that could be added
    headings.forEach(({ heading, frequency }) => {
        if (frequency >= 3 && frequency <= 6) {
            gaps.push(`Potential heading: ${heading}`);
        }
    });

    return gaps.slice(0, 10);
}

/**
 * Calculates structure patterns across competitors
 */
function calculateStructurePatterns(content: CompetitorContent[]) {
    const total = content.length;

    if (total === 0) {
        return {
            avgHeadings: 0,
            avgParagraphs: 0,
            avgInternalLinks: 0,
            avgExternalLinks: 0,
            avgImages: 0,
            videoPercentage: 0,
            faqPercentage: 0,
            tablePercentage: 0
        };
    }

    return {
        avgHeadings: Math.floor(content.reduce((sum, c) => sum + c.headings.length, 0) / total),
        avgParagraphs: Math.floor(content.reduce((sum, c) => sum + c.paragraphs.length, 0) / total),
        avgInternalLinks: Math.floor(content.reduce((sum, c) => sum + c.internalLinks, 0) / total),
        avgExternalLinks: Math.floor(content.reduce((sum, c) => sum + c.externalLinks, 0) / total),
        avgImages: Math.floor(content.reduce((sum, c) => sum + c.images, 0) / total),
        videoPercentage: (content.filter(c => c.hasVideo).length / total) * 100,
        faqPercentage: (content.filter(c => c.hasFAQ).length / total) * 100,
        tablePercentage: (content.filter(c => c.hasTable).length / total) * 100
    };
}

/**
 * Generates topic coverage analysis
 */
function generateTopicCoverage(
    topics: Array<{ topic: string; frequency: number }>,
    entities: Entity[],
    totalCompetitors: number
): TopicCoverage {
    return {
        mainTopic: topics[0]?.topic || 'Unknown',
        requiredSubtopics: topics.slice(0, 10).map(t => ({
            topic: t.topic,
            covered: false, // Will be checked against user's content
            depth: t.frequency > totalCompetitors * 0.7 ? 'deep' : t.frequency > totalCompetitors * 0.4 ? 'medium' : 'shallow',
            competitorCoverage: (t.frequency / totalCompetitors) * 100
        })),
        semanticKeywords: topics.slice(0, 15).map(t => ({
            keyword: t.topic,
            relevance: t.frequency / totalCompetitors,
            present: false, // Will be checked against user's content
            frequency: 0, // User's current frequency
            suggestedFrequency: Math.ceil(t.frequency / 2)
        })),
        entities,
        completeness: 0, // Will be calculated when comparing with user content
        competitorAverage: 100 // Baseline
    };
}

/**
 * Creates fallback content when scraping fails
 */
function createFallbackContent(article: SERPArticle): CompetitorContent {
    return {
        url: article.url,
        title: article.title,
        wordCount: article.wordCount,
        headings: article.headings,
        paragraphs: [article.snippet],
        topics: article.topics,
        entities: article.entities.map(name => ({
            name,
            type: 'Concept',
            mentions: 1,
            coverage: 'mentioned',
            importance: 50,
            competitorMentions: 1
        })),
        hasVideo: article.hasVideo,
        hasFAQ: article.hasFAQ,
        hasTable: article.hasTable,
        internalLinks: 5, // Estimated
        externalLinks: 3, // Estimated
        images: 3 // Estimated
    };
}

// Helper functions for HTML parsing

function extractTitle(html: string): string {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) return titleMatch[1].trim();

    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) return h1Match[1].replace(/<[^>]+>/g, '').trim();

    return 'Untitled';
}

function extractHeadings(html: string): string[] {
    const headings: string[] = [];

    // Extract h2, h3, h4 headings
    const h2Matches = html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi);
    const h3Matches = html.matchAll(/<h3[^>]*>(.*?)<\/h3>/gi);
    const h4Matches = html.matchAll(/<h4[^>]*>(.*?)<\/h4>/gi);

    for (const match of h2Matches) {
        const heading = match[1].replace(/<[^>]+>/g, '').trim();
        if (heading) headings.push(heading);
    }

    for (const match of h3Matches) {
        const heading = match[1].replace(/<[^>]+>/g, '').trim();
        if (heading) headings.push(heading);
    }

    for (const match of h4Matches) {
        const heading = match[1].replace(/<[^>]+>/g, '').trim();
        if (heading) headings.push(heading);
    }

    return headings;
}

function extractParagraphs(html: string): string[] {
    const paragraphs: string[] = [];
    const pMatches = html.matchAll(/<p[^>]*>(.*?)<\/p>/gi);

    for (const match of pMatches) {
        const text = match[1].replace(/<[^>]+>/g, '').trim();
        if (text.length > 50) { // Only meaningful paragraphs
            paragraphs.push(text);
        }
    }

    return paragraphs;
}

function calculateWordCount(text: string): number {
    const cleaned = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    return words.length;
}

function extractTopics(html: string): string[] {
    const text = html.toLowerCase();
    const topics: string[] = [];

    // Common SEO and content topics
    const topicKeywords = [
        'seo', 'optimization', 'content', 'marketing', 'strategy',
        'keyword', 'ranking', 'traffic', 'analytics', 'conversion',
        'backlinks', 'organic', 'search', 'google', 'algorithm'
    ];

    topicKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
            topics.push(keyword);
        }
    });

    return [...new Set(topics)];
}

function extractEntities(html: string): Entity[] {
    const entities: Entity[] = [];
    const text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Extract capitalized phrases (potential entities)
    const matches = text.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g);
    const entityCounts: Record<string, number> = {};

    for (const match of matches) {
        const entity = match[1];
        entityCounts[entity] = (entityCounts[entity] || 0) + 1;
    }

    // Convert to Entity objects
    Object.entries(entityCounts).forEach(([name, mentions]) => {
        if (mentions > 1) { // Only entities mentioned multiple times
            entities.push({
                name,
                type: 'Concept', // Simplified - would use NER in production
                mentions,
                coverage: mentions > 5 ? 'detailed' : mentions > 2 ? 'explained' : 'mentioned',
                importance: Math.min(mentions * 10, 100),
                competitorMentions: 0 // Will be aggregated later
            });
        }
    });

    return entities.slice(0, 10);
}

function extractLinks(html: string, baseUrl: string): { internal: number; external: number } {
    const linkMatches = html.matchAll(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi);
    let internal = 0;
    let external = 0;

    const baseDomain = new URL(baseUrl).hostname;

    for (const match of linkMatches) {
        const url = match[1];
        try {
            if (url.startsWith('http')) {
                const linkDomain = new URL(url).hostname;
                if (linkDomain === baseDomain) {
                    internal++;
                } else {
                    external++;
                }
            } else if (url.startsWith('/')) {
                internal++;
            }
        } catch {
            // Invalid URL, skip
        }
    }

    return { internal, external };
}

function extractLastModified(html: string): string | undefined {
    // Try to find meta tags or structured data
    const metaMatch = html.match(/<meta[^>]*property=["']article:modified_time["'][^>]*content=["']([^"']+)["']/i);
    if (metaMatch) return metaMatch[1];

    const schemaMatch = html.match(/"dateModified":\s*"([^"]+)"/);
    if (schemaMatch) return schemaMatch[1];

    return undefined;
}

function normalizeHeading(heading: string): string {
    // Remove numbers, special chars, normalize casing
    return heading
        .toLowerCase()
        .replace(/^\d+\.\s*/, '') // Remove leading numbers
        .replace(/[^\w\s-]/g, '') // Remove special chars
        .trim();
}
