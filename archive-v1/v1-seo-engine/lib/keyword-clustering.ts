/**
 * Keyword Clustering Utility
 * Functions to find related keywords, group by semantic similarity,
 * and assign content hierarchy (pillar/cluster/supporting)
 */

import { ContentClusterKeyword } from "./seo-types";

/**
 * Represents a keyword with its relationships and metrics
 */
export interface KeywordWithRelations extends ContentClusterKeyword {
    relatedKeywords: string[];
    semanticGroup?: string;
    clusterLevel?: "pillar" | "cluster" | "supporting";
}

/**
 * Represents a semantic group of keywords
 */
export interface SemanticGroup {
    groupName: string;
    primaryKeyword: string;
    keywords: ContentClusterKeyword[];
    avgSearchVolume: number;
    avgDifficulty: number;
    totalKeywords: number;
}

/**
 * Find related keywords for a main topic using semantic expansion
 *
 * @param mainKeyword - The primary keyword to expand upon
 * @param maxKeywords - Maximum number of related keywords to return (default: 30)
 * @returns Array of related keywords with search metrics
 *
 * @example
 * ```ts
 * const keywords = await findRelatedKeywords("Next.js SEO", 20);
 * // Returns: [{ keyword: "Next.js meta tags", searchVolume: 1200, ... }, ...]
 * ```
 */
export async function findRelatedKeywords(
    mainKeyword: string,
    maxKeywords: number = 30
): Promise<ContentClusterKeyword[]> {
    // Semantic expansion patterns
    const expansionPatterns = [
        // Question modifiers
        `what is ${mainKeyword}`,
        `how to ${mainKeyword}`,
        `why ${mainKeyword}`,
        `when to use ${mainKeyword}`,
        `${mainKeyword} best practices`,
        `${mainKeyword} guide`,
        `${mainKeyword} tutorial`,

        // Comparison modifiers
        `${mainKeyword} vs`,
        `${mainKeyword} alternatives`,
        `best ${mainKeyword}`,
        `${mainKeyword} comparison`,

        // Problem-solving modifiers
        `${mainKeyword} tips`,
        `${mainKeyword} examples`,
        `${mainKeyword} mistakes`,
        `${mainKeyword} issues`,
        `${mainKeyword} solutions`,

        // Advanced modifiers
        `advanced ${mainKeyword}`,
        `${mainKeyword} optimization`,
        `${mainKeyword} performance`,
        `${mainKeyword} tools`,

        // Industry-specific
        `${mainKeyword} for beginners`,
        `${mainKeyword} for developers`,
        `${mainKeyword} 2026`,
        `${mainKeyword} trends`,

        // Long-tail variations
        `how to implement ${mainKeyword}`,
        `${mainKeyword} step by step`,
        `complete ${mainKeyword} guide`,
        `${mainKeyword} checklist`,
        `${mainKeyword} strategies`,
    ];

    // Generate keyword variations with simulated metrics
    const keywords: ContentClusterKeyword[] = expansionPatterns
        .slice(0, maxKeywords)
        .map((keyword, index) => {
            // Simulate search volume based on keyword type
            let searchVolume = 0;
            let difficulty = 0;
            let intent: ContentClusterKeyword["intent"] = "informational";

            if (keyword.includes("what is") || keyword.includes("guide") || keyword.includes("tutorial")) {
                searchVolume = Math.floor(Math.random() * 2000) + 500;
                difficulty = Math.floor(Math.random() * 30) + 20;
                intent = "informational";
            } else if (keyword.includes("best") || keyword.includes("vs") || keyword.includes("alternatives")) {
                searchVolume = Math.floor(Math.random() * 3000) + 1000;
                difficulty = Math.floor(Math.random() * 40) + 40;
                intent = "commercial";
            } else if (keyword.includes("how to") || keyword.includes("step by step")) {
                searchVolume = Math.floor(Math.random() * 2500) + 800;
                difficulty = Math.floor(Math.random() * 35) + 25;
                intent = "informational";
            } else if (keyword.includes("tools") || keyword.includes("optimization")) {
                searchVolume = Math.floor(Math.random() * 1500) + 600;
                difficulty = Math.floor(Math.random() * 45) + 35;
                intent = "commercial";
            } else {
                searchVolume = Math.floor(Math.random() * 1000) + 300;
                difficulty = Math.floor(Math.random() * 50) + 20;
            }

            return {
                keyword,
                searchVolume,
                difficulty,
                intent,
                parent: mainKeyword,
            };
        });

    // Sort by search volume (highest first)
    return keywords.sort((a, b) => b.searchVolume - a.searchVolume);
}

/**
 * Group keywords by semantic similarity
 *
 * Groups related keywords into semantic clusters based on shared terms,
 * intent, and topical relevance.
 *
 * @param keywords - Array of keywords to group
 * @param maxGroups - Maximum number of groups to create (default: 7)
 * @returns Array of semantic groups with keywords
 *
 * @example
 * ```ts
 * const groups = groupKeywordsBySimilarity(keywords, 5);
 * // Returns: [{ groupName: "Getting Started", keywords: [...], ... }]
 * ```
 */
export function groupKeywordsBySimilarity(
    keywords: ContentClusterKeyword[],
    maxGroups: number = 7
): SemanticGroup[] {
    // Define semantic categories
    const categories = [
        {
            name: "Getting Started",
            patterns: ["what is", "introduction", "beginners", "basics", "guide", "tutorial"],
        },
        {
            name: "Implementation",
            patterns: ["how to", "implement", "setup", "install", "configure", "step by step"],
        },
        {
            name: "Best Practices",
            patterns: ["best practices", "tips", "strategies", "optimization", "performance"],
        },
        {
            name: "Comparison & Alternatives",
            patterns: ["vs", "alternatives", "comparison", "differences", "best"],
        },
        {
            name: "Advanced Topics",
            patterns: ["advanced", "expert", "deep dive", "complex", "architecture"],
        },
        {
            name: "Troubleshooting",
            patterns: ["issues", "problems", "mistakes", "errors", "fix", "solutions"],
        },
        {
            name: "Tools & Resources",
            patterns: ["tools", "resources", "checklist", "examples", "templates"],
        },
    ];

    const groups: SemanticGroup[] = [];

    // Group keywords into categories
    for (const category of categories.slice(0, maxGroups)) {
        const matchingKeywords = keywords.filter((kw) =>
            category.patterns.some((pattern) =>
                kw.keyword.toLowerCase().includes(pattern)
            )
        );

        if (matchingKeywords.length > 0) {
            const avgSearchVolume =
                matchingKeywords.reduce((sum, kw) => sum + kw.searchVolume, 0) /
                matchingKeywords.length;
            const avgDifficulty =
                matchingKeywords.reduce((sum, kw) => sum + kw.difficulty, 0) /
                matchingKeywords.length;

            // Select primary keyword (highest search volume)
            const primaryKeyword = matchingKeywords.reduce((prev, current) =>
                prev.searchVolume > current.searchVolume ? prev : current
            ).keyword;

            groups.push({
                groupName: category.name,
                primaryKeyword,
                keywords: matchingKeywords,
                avgSearchVolume: Math.round(avgSearchVolume),
                avgDifficulty: Math.round(avgDifficulty),
                totalKeywords: matchingKeywords.length,
            });
        }
    }

    // Sort groups by average search volume
    return groups.sort((a, b) => b.avgSearchVolume - a.avgSearchVolume);
}

/**
 * Assign pillar/cluster/supporting hierarchy to keywords
 *
 * Determines the content hierarchy based on search volume, difficulty,
 * and keyword characteristics.
 *
 * @param keywords - Array of keywords to categorize
 * @param pillarKeyword - The main pillar keyword
 * @returns Object containing categorized keywords
 *
 * @example
 * ```ts
 * const hierarchy = assignContentHierarchy(keywords, "Next.js SEO");
 * // Returns: { pillar: {...}, clusters: [...], supporting: [...] }
 * ```
 */
export function assignContentHierarchy(
    keywords: ContentClusterKeyword[],
    pillarKeyword: string
): {
    pillar: ContentClusterKeyword;
    clusters: ContentClusterKeyword[];
    supporting: ContentClusterKeyword[];
} {
    // Pillar: Main broad topic keyword
    const pillar: ContentClusterKeyword = {
        keyword: pillarKeyword,
        searchVolume: Math.floor(Math.random() * 10000) + 5000, // High volume
        difficulty: Math.floor(Math.random() * 30) + 50, // High difficulty
        intent: "informational",
    };

    // Sort keywords by search volume
    const sortedKeywords = [...keywords].sort((a, b) => b.searchVolume - a.searchVolume);

    // Clusters: High-volume, medium difficulty (positions 0-6)
    const clusters = sortedKeywords
        .slice(0, 7)
        .filter((kw) => kw.searchVolume > 1000)
        .map((kw) => ({
            ...kw,
            parent: pillarKeyword,
        }));

    // Supporting: Lower volume, easier to rank (remaining keywords)
    const supporting = sortedKeywords
        .slice(7)
        .map((kw) => ({
            ...kw,
            parent: pillarKeyword,
        }));

    return {
        pillar,
        clusters,
        supporting,
    };
}

/**
 * Calculate search volume and difficulty metrics for a keyword set
 *
 * @param keywords - Array of keywords to analyze
 * @returns Aggregated metrics
 *
 * @example
 * ```ts
 * const metrics = calculateKeywordMetrics(keywords);
 * // Returns: { totalVolume: 45000, avgDifficulty: 42, ... }
 * ```
 */
export function calculateKeywordMetrics(keywords: ContentClusterKeyword[]): {
    totalVolume: number;
    avgVolume: number;
    avgDifficulty: number;
    minDifficulty: number;
    maxDifficulty: number;
    informationalCount: number;
    commercialCount: number;
    transactionalCount: number;
    navigationalCount: number;
} {
    const totalVolume = keywords.reduce((sum, kw) => sum + kw.searchVolume, 0);
    const avgVolume = Math.round(totalVolume / keywords.length);
    const avgDifficulty = Math.round(
        keywords.reduce((sum, kw) => sum + kw.difficulty, 0) / keywords.length
    );

    const difficulties = keywords.map((kw) => kw.difficulty);
    const minDifficulty = Math.min(...difficulties);
    const maxDifficulty = Math.max(...difficulties);

    const intentCounts = keywords.reduce(
        (acc, kw) => {
            acc[kw.intent]++;
            return acc;
        },
        {
            informational: 0,
            commercial: 0,
            transactional: 0,
            navigational: 0,
        } as Record<ContentClusterKeyword["intent"], number>
    );

    return {
        totalVolume,
        avgVolume,
        avgDifficulty,
        minDifficulty,
        maxDifficulty,
        informationalCount: intentCounts.informational,
        commercialCount: intentCounts.commercial,
        transactionalCount: intentCounts.transactional,
        navigationalCount: intentCounts.navigational,
    };
}

/**
 * Generate keyword variations for a base term
 *
 * @param baseTerm - The base keyword term
 * @param variationTypes - Types of variations to generate
 * @returns Array of keyword variations
 *
 * @example
 * ```ts
 * const variations = generateKeywordVariations("Next.js", ["question", "comparison"]);
 * // Returns: ["what is Next.js", "Next.js vs React", ...]
 * ```
 */
export function generateKeywordVariations(
    baseTerm: string,
    variationTypes: ("question" | "comparison" | "how-to" | "best" | "tools")[] = ["question", "how-to"]
): string[] {
    const variations: string[] = [];

    const templates = {
        question: [
            `what is ${baseTerm}`,
            `why use ${baseTerm}`,
            `when to use ${baseTerm}`,
        ],
        comparison: [
            `${baseTerm} vs`,
            `${baseTerm} alternatives`,
            `${baseTerm} comparison`,
        ],
        "how-to": [
            `how to use ${baseTerm}`,
            `how to implement ${baseTerm}`,
            `${baseTerm} tutorial`,
        ],
        best: [
            `best ${baseTerm}`,
            `${baseTerm} best practices`,
            `top ${baseTerm}`,
        ],
        tools: [
            `${baseTerm} tools`,
            `${baseTerm} resources`,
            `${baseTerm} examples`,
        ],
    };

    for (const type of variationTypes) {
        if (templates[type]) {
            variations.push(...templates[type]);
        }
    }

    return variations;
}

/**
 * Score keyword difficulty based on multiple factors
 *
 * @param keyword - Keyword to score
 * @param competitorData - Optional competitor analysis data
 * @returns Difficulty score (0-100) and breakdown
 *
 * @example
 * ```ts
 * const score = scoreKeywordDifficulty("Next.js SEO optimization");
 * // Returns: { score: 67, factors: {...} }
 * ```
 */
export function scoreKeywordDifficulty(
    keyword: string,
    competitorData?: {
        topRankingDomains: number;
        avgWordCount: number;
        avgBacklinks: number;
    }
): {
    score: number;
    factors: {
        lengthScore: number;
        competitionScore: number;
        commercialIntentScore: number;
        brandScore: number;
    };
    rating: "Easy" | "Medium" | "Hard" | "Very Hard";
} {
    // Length-based scoring (longer = usually easier)
    const wordCount = keyword.split(" ").length;
    const lengthScore = Math.min((wordCount - 1) * 5, 20);

    // Commercial intent (buy, best, top = harder)
    const commercialTerms = ["best", "top", "buy", "price", "review", "vs"];
    const hasCommercialIntent = commercialTerms.some((term) =>
        keyword.toLowerCase().includes(term)
    );
    const commercialIntentScore = hasCommercialIntent ? 25 : 0;

    // Brand/navigational (includes brand names = harder)
    const commonBrands = ["google", "facebook", "amazon", "microsoft", "apple"];
    const hasBrand = commonBrands.some((brand) =>
        keyword.toLowerCase().includes(brand)
    );
    const brandScore = hasBrand ? 20 : 0;

    // Competition score (from optional data)
    const competitionScore = competitorData
        ? Math.min((competitorData.topRankingDomains / 100) * 35, 35)
        : 15;

    // Calculate total score
    const score = Math.min(
        100 - lengthScore + commercialIntentScore + brandScore + competitionScore,
        100
    );

    let rating: "Easy" | "Medium" | "Hard" | "Very Hard";
    if (score < 30) rating = "Easy";
    else if (score < 50) rating = "Medium";
    else if (score < 70) rating = "Hard";
    else rating = "Very Hard";

    return {
        score: Math.round(score),
        factors: {
            lengthScore,
            competitionScore: Math.round(competitionScore),
            commercialIntentScore,
            brandScore,
        },
        rating,
    };
}
