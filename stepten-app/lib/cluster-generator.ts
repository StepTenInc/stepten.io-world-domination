/**
 * Content Cluster Generator
 * Generate complete content clusters with pillar, cluster, and supporting articles
 * including internal linking structure and ranking estimates
 */

import {
    ContentCluster,
    ClusterArticle,
    ContentClusterKeyword,
} from "./seo-types";
import {
    findRelatedKeywords,
    groupKeywordsBySimilarity,
    assignContentHierarchy,
    calculateKeywordMetrics,
} from "./keyword-clustering";

/**
 * Configuration for cluster generation
 */
export interface ClusterGenerationConfig {
    minClusterSize?: number;
    maxClusterSize?: number;
    minSupportingArticles?: number;
    maxSupportingArticles?: number;
    pillarWordCount?: number;
    clusterWordCount?: number;
    supportingWordCount?: number;
}

/**
 * Default cluster generation configuration
 */
const DEFAULT_CONFIG: Required<ClusterGenerationConfig> = {
    minClusterSize: 5,
    maxClusterSize: 7,
    minSupportingArticles: 10,
    maxSupportingArticles: 15,
    pillarWordCount: 3500,
    clusterWordCount: 2000,
    supportingWordCount: 1200,
};

/**
 * Generate a complete content cluster from a main keyword
 *
 * Creates a comprehensive content strategy with:
 * - 1 pillar article (comprehensive guide)
 * - 5-7 cluster articles (major subtopics)
 * - 10-15 supporting articles (specific topics)
 * - Automatic internal linking structure
 * - Estimated time to rank
 *
 * @param mainKeyword - The primary keyword for the cluster
 * @param config - Optional configuration overrides
 * @returns Complete content cluster with all articles and linking structure
 *
 * @example
 * ```ts
 * const cluster = await generateContentCluster("Next.js SEO");
 * console.log(cluster.totalArticles); // 18 (1 pillar + 6 clusters + 11 supporting)
 * console.log(cluster.estimatedTimeToRank); // "4-6 months"
 * ```
 */
export async function generateContentCluster(
    mainKeyword: string,
    config: ClusterGenerationConfig = {}
): Promise<ContentCluster> {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    // Step 1: Find related keywords
    const totalKeywordsNeeded =
        finalConfig.maxClusterSize + finalConfig.maxSupportingArticles;
    const relatedKeywords = await findRelatedKeywords(mainKeyword, totalKeywordsNeeded);

    // Step 2: Assign content hierarchy
    const hierarchy = assignContentHierarchy(relatedKeywords, mainKeyword);

    // Step 3: Create pillar article
    const pillarArticle = createPillarArticle(
        hierarchy.pillar,
        finalConfig.pillarWordCount
    );

    // Step 4: Create cluster articles (5-7)
    const clusterCount = Math.min(
        hierarchy.clusters.length,
        finalConfig.maxClusterSize
    );
    const clusterArticles = hierarchy.clusters
        .slice(0, clusterCount)
        .map((keyword, index) =>
            createClusterArticle(
                keyword,
                index,
                finalConfig.clusterWordCount,
                pillarArticle.id
            )
        );

    // Step 5: Create supporting articles (10-15)
    const supportingCount = Math.min(
        Math.max(
            hierarchy.supporting.length,
            finalConfig.minSupportingArticles
        ),
        finalConfig.maxSupportingArticles
    );
    const supportingArticles = hierarchy.supporting
        .slice(0, supportingCount)
        .map((keyword, index) =>
            createSupportingArticle(
                keyword,
                index,
                finalConfig.supportingWordCount,
                pillarArticle.id,
                clusterArticles
            )
        );

    // Step 6: Auto-assign internal linking structure
    assignInternalLinks(pillarArticle, clusterArticles, supportingArticles);

    // Step 7: Calculate estimated time to rank
    const allKeywords = [hierarchy.pillar, ...hierarchy.clusters, ...hierarchy.supporting];
    const metrics = calculateKeywordMetrics(allKeywords);
    const estimatedTimeToRank = calculateTimeToRank(
        metrics.avgDifficulty,
        clusterArticles.length + supportingArticles.length + 1
    );

    // Step 8: Create cluster object
    const cluster: ContentCluster = {
        id: generateClusterId(mainKeyword),
        name: `${mainKeyword} Content Cluster`,
        mainKeyword,
        pillarArticle,
        clusterArticles,
        supportingArticles,
        totalArticles: 1 + clusterArticles.length + supportingArticles.length,
        completedArticles: 0,
        estimatedTimeToRank,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    return cluster;
}

/**
 * Create a pillar article specification
 *
 * @param keyword - Pillar keyword
 * @param wordCount - Target word count
 * @returns Pillar article specification
 */
function createPillarArticle(
    keyword: ContentClusterKeyword,
    wordCount: number
): ClusterArticle {
    return {
        id: generateArticleId(keyword.keyword, "pillar"),
        keyword,
        type: "pillar",
        wordCount,
        status: "planned",
        linksTo: [], // Will be populated by assignInternalLinks
        depth: 0, // Pillar is at root level
        priority: 100, // Highest priority
    };
}

/**
 * Create a cluster article specification
 *
 * @param keyword - Cluster keyword
 * @param index - Index in cluster array
 * @param wordCount - Target word count
 * @param pillarId - ID of parent pillar article
 * @returns Cluster article specification
 */
function createClusterArticle(
    keyword: ContentClusterKeyword,
    index: number,
    wordCount: number,
    pillarId: string
): ClusterArticle {
    return {
        id: generateArticleId(keyword.keyword, "cluster"),
        keyword,
        type: "cluster",
        wordCount,
        status: "planned",
        linksTo: [pillarId], // Always links back to pillar
        depth: 1, // One level below pillar
        priority: 90 - index * 5, // Decreasing priority
    };
}

/**
 * Create a supporting article specification
 *
 * @param keyword - Supporting keyword
 * @param index - Index in supporting array
 * @param wordCount - Target word count
 * @param pillarId - ID of parent pillar article
 * @param clusterArticles - Related cluster articles
 * @returns Supporting article specification
 */
function createSupportingArticle(
    keyword: ContentClusterKeyword,
    index: number,
    wordCount: number,
    pillarId: string,
    clusterArticles: ClusterArticle[]
): ClusterArticle {
    // Find most relevant cluster article based on keyword similarity
    const relatedCluster = findMostRelatedCluster(keyword.keyword, clusterArticles);

    return {
        id: generateArticleId(keyword.keyword, "supporting"),
        keyword,
        type: "supporting",
        wordCount,
        status: "planned",
        linksTo: relatedCluster ? [relatedCluster.id, pillarId] : [pillarId],
        depth: 2, // Two levels below pillar
        priority: 50 - index * 2, // Lower priority
    };
}

/**
 * Assign internal linking structure across all articles
 *
 * Creates a hierarchical linking structure:
 * - Pillar links to all clusters
 * - Clusters link to pillar and relevant supporting articles
 * - Supporting articles link to related cluster and pillar
 *
 * @param pillarArticle - The pillar article
 * @param clusterArticles - All cluster articles
 * @param supportingArticles - All supporting articles
 */
function assignInternalLinks(
    pillarArticle: ClusterArticle,
    clusterArticles: ClusterArticle[],
    supportingArticles: ClusterArticle[]
): void {
    // Pillar links to all cluster articles
    pillarArticle.linksTo = clusterArticles.map((article) => article.id);

    // Cluster articles link to pillar and relevant supporting articles
    for (const clusterArticle of clusterArticles) {
        // Find supporting articles related to this cluster
        const relatedSupporting = supportingArticles.filter((supporting) =>
            isKeywordRelated(
                clusterArticle.keyword.keyword,
                supporting.keyword.keyword
            )
        );

        // Link to pillar + relevant supporting (max 3-5 supporting per cluster)
        clusterArticle.linksTo = [
            pillarArticle.id,
            ...relatedSupporting.slice(0, 5).map((article) => article.id),
        ];
    }

    // Supporting articles already have linksTo set in createSupportingArticle
    // But we can add cross-links to related supporting articles
    for (const supportingArticle of supportingArticles) {
        const relatedSupporting = supportingArticles
            .filter(
                (other) =>
                    other.id !== supportingArticle.id &&
                    isKeywordRelated(
                        supportingArticle.keyword.keyword,
                        other.keyword.keyword
                    )
            )
            .slice(0, 2); // Max 2 cross-links to other supporting articles

        supportingArticle.linksTo.push(
            ...relatedSupporting.map((article) => article.id)
        );
    }
}

/**
 * Calculate estimated time to rank based on difficulty and cluster size
 *
 * @param avgDifficulty - Average keyword difficulty
 * @param totalArticles - Total number of articles in cluster
 * @returns Estimated time range to rank (e.g., "4-6 months")
 */
export function calculateTimeToRank(
    avgDifficulty: number,
    totalArticles: number
): string {
    // Base time calculation
    let baseMonths = 3;

    // Adjust for difficulty
    if (avgDifficulty < 30) baseMonths = 2;
    else if (avgDifficulty < 50) baseMonths = 3;
    else if (avgDifficulty < 70) baseMonths = 5;
    else baseMonths = 8;

    // Adjust for cluster size (more articles = faster ranking)
    const clusterBonus = Math.floor(totalArticles / 5);
    baseMonths = Math.max(1, baseMonths - clusterBonus);

    // Create range
    const minMonths = Math.max(1, baseMonths - 1);
    const maxMonths = baseMonths + 2;

    if (minMonths === maxMonths) {
        return `${minMonths} month${minMonths > 1 ? "s" : ""}`;
    }

    return `${minMonths}-${maxMonths} months`;
}

/**
 * Find the most related cluster article for a supporting keyword
 *
 * @param supportingKeyword - The supporting article keyword
 * @param clusterArticles - All cluster articles
 * @returns Most related cluster article or null
 */
function findMostRelatedCluster(
    supportingKeyword: string,
    clusterArticles: ClusterArticle[]
): ClusterArticle | null {
    if (clusterArticles.length === 0) return null;

    // Calculate similarity scores
    const scores = clusterArticles.map((cluster) => ({
        cluster,
        score: calculateKeywordSimilarity(
            supportingKeyword,
            cluster.keyword.keyword
        ),
    }));

    // Return cluster with highest similarity
    const best = scores.reduce((prev, current) =>
        current.score > prev.score ? current : prev
    );

    return best.cluster;
}

/**
 * Check if two keywords are semantically related
 *
 * @param keyword1 - First keyword
 * @param keyword2 - Second keyword
 * @returns True if keywords share significant terms
 */
function isKeywordRelated(keyword1: string, keyword2: string): boolean {
    const words1 = keyword1.toLowerCase().split(" ");
    const words2 = keyword2.toLowerCase().split(" ");

    // Remove common stop words
    const stopWords = ["a", "an", "the", "is", "are", "was", "were", "to", "for", "of", "in", "on"];
    const filtered1 = words1.filter((w) => !stopWords.includes(w));
    const filtered2 = words2.filter((w) => !stopWords.includes(w));

    // Count shared words
    const sharedWords = filtered1.filter((w) => filtered2.includes(w));

    // Related if they share at least 2 significant words, or 50% of words
    return (
        sharedWords.length >= 2 ||
        sharedWords.length / Math.min(filtered1.length, filtered2.length) >= 0.5
    );
}

/**
 * Calculate similarity score between two keywords
 *
 * @param keyword1 - First keyword
 * @param keyword2 - Second keyword
 * @returns Similarity score (0-100)
 */
function calculateKeywordSimilarity(keyword1: string, keyword2: string): number {
    const words1 = new Set(keyword1.toLowerCase().split(" "));
    const words2 = new Set(keyword2.toLowerCase().split(" "));

    // Calculate Jaccard similarity
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    const similarity = (intersection.size / union.size) * 100;
    return Math.round(similarity);
}

/**
 * Generate unique cluster ID from main keyword
 *
 * @param mainKeyword - The main keyword
 * @returns Unique cluster ID
 */
function generateClusterId(mainKeyword: string): string {
    const slug = mainKeyword
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const timestamp = Date.now();
    return `cluster-${slug}-${timestamp}`;
}

/**
 * Generate unique article ID from keyword and type
 *
 * @param keyword - Article keyword
 * @param type - Article type
 * @returns Unique article ID
 */
function generateArticleId(
    keyword: string,
    type: "pillar" | "cluster" | "supporting"
): string {
    const slug = keyword
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    return `${type}-${slug}-${timestamp}-${random}`;
}

/**
 * Get cluster completion percentage
 *
 * @param cluster - Content cluster
 * @returns Completion percentage (0-100)
 *
 * @example
 * ```ts
 * const completion = getClusterCompletionPercentage(cluster);
 * console.log(`Cluster is ${completion}% complete`);
 * ```
 */
export function getClusterCompletionPercentage(cluster: ContentCluster): number {
    if (cluster.totalArticles === 0) return 0;
    return Math.round((cluster.completedArticles / cluster.totalArticles) * 100);
}

/**
 * Get articles by status from a cluster
 *
 * @param cluster - Content cluster
 * @param status - Article status to filter by
 * @returns Array of articles matching the status
 *
 * @example
 * ```ts
 * const published = getArticlesByStatus(cluster, "published");
 * const inProgress = getArticlesByStatus(cluster, "writing");
 * ```
 */
export function getArticlesByStatus(
    cluster: ContentCluster,
    status: ClusterArticle["status"]
): ClusterArticle[] {
    const allArticles = [
        cluster.pillarArticle,
        ...cluster.clusterArticles,
        ...cluster.supportingArticles,
    ];

    return allArticles.filter((article) => article.status === status);
}

/**
 * Get recommended publishing order for cluster articles
 *
 * Returns articles sorted by:
 * 1. Priority (pillar first)
 * 2. Type (clusters before supporting)
 * 3. Difficulty (easier articles first)
 *
 * @param cluster - Content cluster
 * @returns Sorted array of articles in recommended publishing order
 *
 * @example
 * ```ts
 * const publishOrder = getPublishingOrder(cluster);
 * publishOrder.forEach((article, index) => {
 *   console.log(`${index + 1}. ${article.keyword.keyword} (${article.type})`);
 * });
 * ```
 */
export function getPublishingOrder(cluster: ContentCluster): ClusterArticle[] {
    const allArticles = [
        cluster.pillarArticle,
        ...cluster.clusterArticles,
        ...cluster.supportingArticles,
    ];

    // Sort by priority (high to low), then by difficulty (low to high)
    return allArticles.sort((a, b) => {
        // First by priority
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        // Then by difficulty (easier first)
        return a.keyword.difficulty - b.keyword.difficulty;
    });
}

/**
 * Generate cluster strategy summary
 *
 * @param cluster - Content cluster
 * @returns Human-readable strategy summary
 *
 * @example
 * ```ts
 * const summary = generateClusterSummary(cluster);
 * console.log(summary.description);
 * ```
 */
export function generateClusterSummary(cluster: ContentCluster): {
    description: string;
    keyMetrics: {
        totalArticles: number;
        totalWords: number;
        avgDifficulty: number;
        estimatedTraffic: number;
    };
    timeline: string;
    strategy: string[];
} {
    const allArticles = [
        cluster.pillarArticle,
        ...cluster.clusterArticles,
        ...cluster.supportingArticles,
    ];

    const totalWords = allArticles.reduce((sum, a) => sum + a.wordCount, 0);
    const avgDifficulty = Math.round(
        allArticles.reduce((sum, a) => sum + a.keyword.difficulty, 0) /
            allArticles.length
    );
    const estimatedTraffic = allArticles.reduce(
        (sum, a) => sum + a.keyword.searchVolume,
        0
    );

    const description = `Complete content cluster for "${cluster.mainKeyword}" with ${cluster.totalArticles} articles (1 pillar, ${cluster.clusterArticles.length} clusters, ${cluster.supportingArticles.length} supporting). Expected to rank in ${cluster.estimatedTimeToRank}.`;

    const strategy = [
        `Start with the pillar article: "${cluster.pillarArticle.keyword.keyword}" (${cluster.pillarArticle.wordCount} words)`,
        `Publish ${cluster.clusterArticles.length} cluster articles covering major subtopics`,
        `Build out ${cluster.supportingArticles.length} supporting articles for long-tail keywords`,
        `Implement internal linking structure to create topic authority`,
        `Monitor rankings and optimize based on performance`,
    ];

    return {
        description,
        keyMetrics: {
            totalArticles: cluster.totalArticles,
            totalWords,
            avgDifficulty,
            estimatedTraffic,
        },
        timeline: cluster.estimatedTimeToRank,
        strategy,
    };
}
