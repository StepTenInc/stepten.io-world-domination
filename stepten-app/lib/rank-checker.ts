/**
 * Rank Checker Module
 * Checks Google rankings for keywords with location-based support
 */

import { SCRAPE_TIMEOUT_MS, USER_AGENT } from "./constants";

export interface RankCheckOptions {
    keyword: string;
    url: string;
    location?: string;
    gl?: string; // Google country code (e.g., 'us', 'uk', 'ca')
    hl?: string; // Language code (e.g., 'en', 'es', 'fr')
    maxResults?: number;
    useSerpAPI?: boolean;
}

export interface RankCheckResult {
    keyword: string;
    url: string;
    position: number | null;
    found: boolean;
    location: string;
    checkedAt: string;
    searchResults: Array<{
        position: number;
        url: string;
        title: string;
        snippet: string;
    }>;
    error?: string;
}

/**
 * Checks Google ranking for a specific keyword and URL
 *
 * This function performs a Google search for the given keyword and finds
 * the position of the specified URL in the search results. It supports
 * location-based ranking and can use either SerpAPI or web scraping.
 *
 * @param options - Ranking check configuration
 * @returns Promise resolving to rank check result with position and metadata
 *
 * @example
 * ```typescript
 * const result = await checkGoogleRanking({
 *   keyword: "seo article generator",
 *   url: "https://example.com/seo-article-generator",
 *   location: "United States",
 *   gl: "us",
 *   hl: "en"
 * });
 *
 * if (result.found) {
 *   console.log(`Ranking at position ${result.position}`);
 * }
 * ```
 */
export async function checkGoogleRanking(
    options: RankCheckOptions
): Promise<RankCheckResult> {
    const {
        keyword,
        url,
        location = "United States",
        gl = "us",
        hl = "en",
        maxResults = 100,
        useSerpAPI = false
    } = options;

    console.log(`[Rank Checker] Checking ranking for "${keyword}" - ${url}`);

    try {
        if (useSerpAPI && process.env.SERPAPI_KEY) {
            return await checkRankingWithSerpAPI(keyword, url, location, gl, hl, maxResults);
        } else {
            return await checkRankingWithScraping(keyword, url, location, gl, hl, maxResults);
        }
    } catch (error) {
        console.error('[Rank Checker] Error:', error);

        return {
            keyword,
            url,
            position: null,
            found: false,
            location,
            checkedAt: new Date().toISOString(),
            searchResults: [],
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Checks ranking using SerpAPI (recommended for production)
 *
 * SerpAPI provides reliable, rate-limited access to Google search results
 * without the risk of IP blocking or CAPTCHA challenges.
 *
 * @param keyword - Search keyword
 * @param targetUrl - URL to find in results
 * @param location - Geographic location
 * @param gl - Google country code
 * @param hl - Language code
 * @param maxResults - Maximum results to check
 * @returns Promise resolving to rank check result
 *
 * @example
 * ```typescript
 * const result = await checkRankingWithSerpAPI(
 *   "best seo tools",
 *   "https://example.com/seo-tools",
 *   "United States",
 *   "us",
 *   "en",
 *   100
 * );
 * ```
 */
async function checkRankingWithSerpAPI(
    keyword: string,
    targetUrl: string,
    location: string,
    gl: string,
    hl: string,
    maxResults: number
): Promise<RankCheckResult> {
    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
        throw new Error('SERPAPI_KEY not configured');
    }

    // Build SerpAPI request URL
    const params = new URLSearchParams({
        api_key: apiKey,
        q: keyword,
        location: location,
        gl: gl,
        hl: hl,
        num: Math.min(maxResults, 100).toString() // SerpAPI max is 100
    });

    const serpApiUrl = `https://serpapi.com/search.json?${params.toString()}`;

    console.log(`[Rank Checker] Querying SerpAPI for "${keyword}"`);

    const response = await fetch(serpApiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS)
    });

    if (!response.ok) {
        throw new Error(`SerpAPI request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const organicResults = data.organic_results || [];
    const searchResults: Array<{
        position: number;
        url: string;
        title: string;
        snippet: string;
    }> = [];

    let position: number | null = null;
    let found = false;

    // Normalize target URL for comparison
    const normalizedTargetUrl = normalizeUrl(targetUrl);

    // Check each result
    for (let i = 0; i < organicResults.length; i++) {
        const result = organicResults[i];
        const resultUrl = normalizeUrl(result.link || '');

        searchResults.push({
            position: i + 1,
            url: result.link || '',
            title: result.title || '',
            snippet: result.snippet || ''
        });

        // Check if this is our URL
        if (!found && urlsMatch(resultUrl, normalizedTargetUrl)) {
            position = i + 1;
            found = true;
        }
    }

    console.log(`[Rank Checker] SerpAPI check complete. Found: ${found}, Position: ${position}`);

    return {
        keyword,
        url: targetUrl,
        position,
        found,
        location,
        checkedAt: new Date().toISOString(),
        searchResults
    };
}

/**
 * Checks ranking using web scraping (fallback method)
 *
 * This method directly scrapes Google search results. Use with caution
 * as it may be blocked by Google's anti-bot measures. Recommended only
 * for development or when SerpAPI is not available.
 *
 * @param keyword - Search keyword
 * @param targetUrl - URL to find in results
 * @param location - Geographic location
 * @param gl - Google country code
 * @param hl - Language code
 * @param maxResults - Maximum results to check
 * @returns Promise resolving to rank check result
 *
 * @example
 * ```typescript
 * const result = await checkRankingWithScraping(
 *   "content marketing",
 *   "https://example.com/blog",
 *   "United States",
 *   "us",
 *   "en",
 *   50
 * );
 * ```
 */
async function checkRankingWithScraping(
    keyword: string,
    targetUrl: string,
    location: string,
    gl: string,
    hl: string,
    maxResults: number
): Promise<RankCheckResult> {
    console.log(`[Rank Checker] Using web scraping for "${keyword}"`);

    // Build Google search URL
    const params = new URLSearchParams({
        q: keyword,
        gl: gl,
        hl: hl,
        num: Math.min(maxResults, 100).toString()
    });

    const searchUrl = `https://www.google.com/search?${params.toString()}`;

    const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
            'User-Agent': USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': `${hl},en;q=0.9`,
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.google.com/',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        },
        signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS)
    });

    if (!response.ok) {
        throw new Error(`Google search request failed: ${response.status}`);
    }

    const html = await response.text();

    // Parse search results from HTML
    const searchResults = parseGoogleSearchResults(html);

    // Normalize target URL
    const normalizedTargetUrl = normalizeUrl(targetUrl);

    let position: number | null = null;
    let found = false;

    // Find our URL in results
    for (let i = 0; i < searchResults.length; i++) {
        const resultUrl = normalizeUrl(searchResults[i].url);

        if (!found && urlsMatch(resultUrl, normalizedTargetUrl)) {
            position = i + 1;
            found = true;
            break;
        }
    }

    console.log(`[Rank Checker] Scraping check complete. Found: ${found}, Position: ${position}`);

    return {
        keyword,
        url: targetUrl,
        position,
        found,
        location,
        checkedAt: new Date().toISOString(),
        searchResults
    };
}

/**
 * Parses Google search results from HTML
 *
 * Extracts organic search results from Google's HTML response.
 * This is a best-effort parser and may break if Google changes their HTML structure.
 *
 * @param html - Google search results HTML
 * @returns Array of search results with position, URL, title, and snippet
 *
 * @example
 * ```typescript
 * const html = await fetchGoogleResults();
 * const results = parseGoogleSearchResults(html);
 * ```
 */
function parseGoogleSearchResults(html: string): Array<{
    position: number;
    url: string;
    title: string;
    snippet: string;
}> {
    const results: Array<{
        position: number;
        url: string;
        title: string;
        snippet: string;
    }> = [];

    // Simple regex-based parsing (not as robust as a proper HTML parser)
    // Look for organic result links
    const linkRegex = /<a[^>]*href="\/url\?q=([^"&]+)[^"]*"[^>]*>/gi;
    const titleRegex = /<h3[^>]*>([^<]+)<\/h3>/gi;

    let linkMatch;
    let position = 1;

    while ((linkMatch = linkRegex.exec(html)) !== null) {
        try {
            const url = decodeURIComponent(linkMatch[1]);

            // Skip Google's own URLs
            if (url.includes('google.com') || url.includes('youtube.com')) {
                continue;
            }

            // Try to extract title (this is fragile)
            const titleMatch = titleRegex.exec(html);
            const title = titleMatch ? titleMatch[1] : '';

            results.push({
                position: position++,
                url,
                title,
                snippet: '' // Snippet extraction is complex, omitted for brevity
            });

            if (results.length >= 100) break;

        } catch (error) {
            // Skip malformed URLs
            continue;
        }
    }

    return results;
}

/**
 * Normalizes a URL for comparison
 *
 * Removes protocol, www prefix, trailing slashes, and query parameters
 * to enable accurate URL matching across different formats.
 *
 * @param url - URL to normalize
 * @returns Normalized URL string
 *
 * @example
 * ```typescript
 * normalizeUrl('https://www.example.com/page/') // 'example.com/page'
 * normalizeUrl('http://example.com/page?ref=123') // 'example.com/page'
 * ```
 */
function normalizeUrl(url: string): string {
    try {
        let normalized = url.toLowerCase().trim();

        // Remove protocol
        normalized = normalized.replace(/^https?:\/\//, '');

        // Remove www
        normalized = normalized.replace(/^www\./, '');

        // Remove trailing slash
        normalized = normalized.replace(/\/$/, '');

        // Remove query parameters and fragments
        normalized = normalized.split('?')[0].split('#')[0];

        return normalized;
    } catch {
        return url.toLowerCase().trim();
    }
}

/**
 * Checks if two URLs match (accounting for variations)
 *
 * Compares normalized URLs to determine if they represent the same page.
 * Handles protocol differences, www variations, and trailing slashes.
 *
 * @param url1 - First URL
 * @param url2 - Second URL
 * @returns True if URLs match
 *
 * @example
 * ```typescript
 * urlsMatch('https://example.com/page/', 'http://www.example.com/page') // true
 * urlsMatch('example.com/page1', 'example.com/page2') // false
 * ```
 */
function urlsMatch(url1: string, url2: string): boolean {
    return normalizeUrl(url1) === normalizeUrl(url2);
}

/**
 * Checks rankings for multiple keywords in batch
 *
 * Efficiently checks rankings for multiple keywords at once.
 * Includes rate limiting to avoid overwhelming the API or getting blocked.
 *
 * @param keywords - Array of keywords to check
 * @param url - URL to find in results
 * @param options - Additional check options
 * @returns Promise resolving to array of rank check results
 *
 * @example
 * ```typescript
 * const results = await checkMultipleKeywords(
 *   ['seo tools', 'content marketing', 'link building'],
 *   'https://example.com',
 *   { location: 'United States', gl: 'us' }
 * );
 *
 * results.forEach(result => {
 *   console.log(`${result.keyword}: Position ${result.position || 'Not found'}`);
 * });
 * ```
 */
export async function checkMultipleKeywords(
    keywords: string[],
    url: string,
    options: Partial<RankCheckOptions> = {}
): Promise<RankCheckResult[]> {
    const results: RankCheckResult[] = [];

    console.log(`[Rank Checker] Batch checking ${keywords.length} keywords`);

    for (const keyword of keywords) {
        try {
            const result = await checkGoogleRanking({
                keyword,
                url,
                ...options
            });

            results.push(result);

            // Rate limiting: wait 2-5 seconds between requests
            const delay = 2000 + Math.random() * 3000;
            await new Promise(resolve => setTimeout(resolve, delay));

        } catch (error) {
            console.error(`[Rank Checker] Error checking "${keyword}":`, error);

            results.push({
                keyword,
                url,
                position: null,
                found: false,
                location: options.location || 'United States',
                checkedAt: new Date().toISOString(),
                searchResults: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    console.log(`[Rank Checker] Batch check complete. ${results.filter(r => r.found).length}/${keywords.length} found`);

    return results;
}

/**
 * Estimates search traffic based on position and search volume
 *
 * Uses industry-standard CTR curves to estimate monthly traffic
 * from search results based on ranking position.
 *
 * @param position - Search result position (1-100)
 * @param searchVolume - Monthly search volume
 * @returns Estimated monthly traffic
 *
 * @example
 * ```typescript
 * const traffic = estimateTrafficFromPosition(3, 10000);
 * console.log(`Estimated traffic: ${traffic} visits/month`);
 * ```
 */
export function estimateTrafficFromPosition(position: number, searchVolume: number): number {
    // Industry-standard CTR by position (Advanced Web Ranking data)
    const ctrByPosition: Record<number, number> = {
        1: 0.3944,
        2: 0.1541,
        3: 0.0962,
        4: 0.0693,
        5: 0.0546,
        6: 0.0447,
        7: 0.0375,
        8: 0.0324,
        9: 0.0284,
        10: 0.0251
    };

    // For positions 11-20, use declining CTR
    const getPositionCTR = (pos: number): number => {
        if (pos <= 10) {
            return ctrByPosition[pos] || 0;
        } else if (pos <= 20) {
            return 0.02 * Math.pow(0.8, pos - 11); // Exponential decay
        } else if (pos <= 50) {
            return 0.005 * Math.pow(0.9, pos - 21);
        } else {
            return 0.001; // Minimal traffic beyond position 50
        }
    };

    const ctr = getPositionCTR(position);
    const estimatedTraffic = Math.round(searchVolume * ctr);

    return estimatedTraffic;
}
