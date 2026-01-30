/**
 * Link Extraction Utilities
 * Extracts and categorizes links from HTML content
 */

import { INTERNAL_DOMAINS } from "./constants";

export interface ExtractedLink {
    text: string;
    url: string;
}

export interface CategorizedLinks {
    internal: ExtractedLink[];
    outbound: ExtractedLink[];
}

/**
 * Extracts and categorizes links from HTML content
 *
 * @param html - HTML string to extract links from
 * @param additionalInternalDomains - Additional domains to treat as internal
 * @returns Object with categorized internal and outbound links
 *
 * @example
 * const { internal, outbound } = extractLinksFromHTML('<a href="https://example.com">Link</a>');
 */
export function extractLinksFromHTML(
    html: string,
    additionalInternalDomains: string[] = []
): CategorizedLinks {
    if (typeof window === "undefined") {
        return { internal: [], outbound: [] };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const anchors = Array.from(doc.querySelectorAll("a[href]")) as HTMLAnchorElement[];
    const origin = window.location.origin;

    // Combine default internal domains with any additional ones
    const internalHosts = new Set([
        new URL(origin).hostname,
        ...INTERNAL_DOMAINS,
        ...additionalInternalDomains,
    ]);

    const internal: ExtractedLink[] = [];
    const outbound: ExtractedLink[] = [];

    anchors.forEach((anchor) => {
        const href = anchor.getAttribute("href") || "";

        // Skip empty hrefs and hash-only links
        if (!href || href.startsWith("#")) {
            return;
        }

        let url: URL;
        try {
            // Try to parse as absolute URL, fall back to relative
            url = new URL(href, origin);
        } catch {
            // Invalid URL, skip it
            return;
        }

        const link: ExtractedLink = {
            text: anchor.textContent?.trim() || url.pathname,
            url: url.toString(),
        };

        // Categorize as internal or external
        if (internalHosts.has(url.hostname)) {
            internal.push(link);
        } else {
            outbound.push(link);
        }
    });

    return { internal, outbound };
}

/**
 * Validates if a URL is properly formatted
 *
 * @param url - URL string to validate
 * @returns True if URL is valid
 *
 * @example
 * isValidUrl("https://example.com") // true
 * isValidUrl("not-a-url") // false
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Extracts domain from a URL
 *
 * @param url - URL string
 * @returns Domain name or null if invalid
 *
 * @example
 * getDomain("https://www.example.com/path") // "www.example.com"
 */
export function getDomain(url: string): string | null {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}

/**
 * Checks if a link is internal based on domain
 *
 * @param url - URL to check
 * @param internalDomains - List of domains to treat as internal
 * @returns True if link is internal
 *
 * @example
 * isInternalLink("https://stepten.io/about", ["stepten.io"]) // true
 */
export function isInternalLink(url: string, internalDomains: string[] = INTERNAL_DOMAINS): boolean {
    const domain = getDomain(url);
    if (!domain) return false;

    return internalDomains.some((internalDomain) => domain.includes(internalDomain));
}

/**
 * Counts unique domains in a list of links
 *
 * @param links - Array of links to analyze
 * @returns Map of domain to count
 *
 * @example
 * countDomains([{ url: "https://a.com" }, { url: "https://a.com/2" }])
 * // Map { "a.com" => 2 }
 */
export function countDomains(links: ExtractedLink[]): Map<string, number> {
    const domainCounts = new Map<string, number>();

    links.forEach((link) => {
        const domain = getDomain(link.url);
        if (domain) {
            domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
        }
    });

    return domainCounts;
}

/**
 * Finds duplicate anchor texts in links
 *
 * @param links - Array of links to check
 * @returns Array of duplicate anchor texts
 *
 * @example
 * findDuplicateAnchors([
 *   { text: "Click here", url: "https://a.com" },
 *   { text: "Click here", url: "https://b.com" }
 * ]) // ["Click here"]
 */
export function findDuplicateAnchors(links: ExtractedLink[]): string[] {
    const anchorCounts = new Map<string, number>();

    links.forEach((link) => {
        const text = link.text.toLowerCase();
        anchorCounts.set(text, (anchorCounts.get(text) || 0) + 1);
    });

    return Array.from(anchorCounts.entries())
        .filter(([, count]) => count > 1)
        .map(([text]) => text);
}

/**
 * Calculates anchor text variety ratio
 *
 * @param links - Array of links to analyze
 * @returns Ratio of unique anchor texts to total links (0-1)
 *
 * @example
 * getAnchorVariety([
 *   { text: "Link 1", url: "https://a.com" },
 *   { text: "Link 2", url: "https://b.com" }
 * ]) // 1.0 (100% unique)
 */
export function getAnchorVariety(links: ExtractedLink[]): number {
    if (links.length === 0) return 0;

    const uniqueAnchors = new Set(links.map((link) => link.text.toLowerCase()));
    return uniqueAnchors.size / links.length;
}
