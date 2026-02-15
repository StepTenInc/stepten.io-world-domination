/**
 * AI SEO Agent - Strategy Planner
 * Analyzes content gaps, identifies opportunities, and builds content calendars
 */

import Anthropic from "@anthropic-ai/sdk";
import type { SEOAgentStrategy, ContentClusterKeyword } from "./seo-types";
import { createServerClient } from "./supabase/server";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ContentGapAnalysis {
    missingKeywords: ContentClusterKeyword[];
    underservedTopics: string[];
    competitorGaps: Array<{
        topic: string;
        opportunity: string;
        estimatedTraffic: number;
    }>;
    seasonalOpportunities: Array<{
        keyword: string;
        season: string;
        peakMonth: string;
    }>;
}

interface ContentCalendarEntry {
    keyword: string;
    title: string;
    type: 'pillar' | 'cluster' | 'supporting' | 'listicle' | 'comparison';
    priority: number;
    estimatedWordCount: number;
    targetPublishDate: string;
    clusterId?: string;
    reasoning: string;
}

interface StrategyAnalysis {
    contentGaps: ContentGapAnalysis;
    calendar: ContentCalendarEntry[];
    recommendations: {
        focusAreas: string[];
        quickWins: string[];
        longTermGoals: string[];
    };
}

/**
 * Analyzes a site's current content to identify gaps and opportunities
 *
 * @param niche - The site's primary niche or topic area
 * @param existingKeywords - Keywords already covered by existing content
 * @param competitorDomains - List of competitor domains to analyze
 * @returns Comprehensive content gap analysis
 *
 * @example
 * const gaps = await analyzeContentGaps(
 *   "AI and machine learning",
 *   ["neural networks", "deep learning basics"],
 *   ["towardsdatascience.com", "machinelearningmastery.com"]
 * );
 */
export async function analyzeContentGaps(
    niche: string,
    existingKeywords: string[] = [],
    competitorDomains: string[] = []
): Promise<ContentGapAnalysis> {
    console.log(`[Agent Strategy] Analyzing content gaps for niche: "${niche}"`);

    const prompt = `You are an expert SEO strategist analyzing content opportunities.

**Niche:** ${niche}

**Already Covered Keywords:**
${existingKeywords.length > 0 ? existingKeywords.join(", ") : "None yet - this is a new site"}

**Competitor Sites:**
${competitorDomains.length > 0 ? competitorDomains.join(", ") : "None provided"}

**Task:** Identify high-value content gaps and keyword opportunities.

Analyze:
1. **Missing Keywords** - High-value keywords in this niche not yet covered
2. **Underserved Topics** - Topics with low competition but decent search volume
3. **Competitor Gaps** - Topics competitors are missing or poorly covering
4. **Seasonal Opportunities** - Time-sensitive content opportunities

For each missing keyword, estimate:
- Search volume (monthly)
- Difficulty (0-100)
- Intent (informational/commercial/transactional/navigational)

Return as JSON:
{
  "missingKeywords": [
    {
      "keyword": "specific keyword phrase",
      "searchVolume": 5000,
      "difficulty": 45,
      "intent": "informational",
      "parent": "optional-parent-keyword"
    }
  ],
  "underservedTopics": ["topic 1", "topic 2"],
  "competitorGaps": [
    {
      "topic": "topic name",
      "opportunity": "why this is an opportunity",
      "estimatedTraffic": 3000
    }
  ],
  "seasonalOpportunities": [
    {
      "keyword": "seasonal keyword",
      "season": "summer",
      "peakMonth": "June"
    }
  ]
}

**Focus on:**
- Long-tail keywords (3+ words)
- Question-based keywords
- "How to" and tutorial opportunities
- Comparison and review opportunities
- Emerging trends in the niche

Output ONLY valid JSON, no markdown formatting.`;

    try {
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "{}";

        // Clean JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        const jsonText = jsonMatch ? jsonMatch[0] : responseText;

        const analysis = JSON.parse(jsonText) as ContentGapAnalysis;

        console.log(`[Agent Strategy] Found ${analysis.missingKeywords.length} keyword opportunities`);

        return analysis;

    } catch (error) {
        console.error("[Agent Strategy] Error analyzing content gaps:", error);
        throw new Error(`Failed to analyze content gaps: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Identifies high-opportunity keywords based on search volume, difficulty, and ROI potential
 *
 * @param keywords - List of keywords to evaluate
 * @param maxDifficulty - Maximum keyword difficulty to consider (0-100)
 * @param minSearchVolume - Minimum monthly search volume to consider
 * @returns Sorted list of high-opportunity keywords
 *
 * @example
 * const opportunities = identifyHighOpportunityKeywords(
 *   gapAnalysis.missingKeywords,
 *   65,
 *   500
 * );
 */
export function identifyHighOpportunityKeywords(
    keywords: ContentClusterKeyword[],
    maxDifficulty: number = 70,
    minSearchVolume: number = 500
): ContentClusterKeyword[] {
    // Filter by difficulty and volume
    const filtered = keywords.filter(kw =>
        kw.difficulty <= maxDifficulty &&
        kw.searchVolume >= minSearchVolume
    );

    // Calculate opportunity score (higher search volume, lower difficulty = better)
    const scored = filtered.map(kw => ({
        ...kw,
        opportunityScore: (kw.searchVolume / 100) * (100 - kw.difficulty)
    }));

    // Sort by opportunity score descending
    scored.sort((a, b) => (b as any).opportunityScore - (a as any).opportunityScore);

    console.log(`[Agent Strategy] Identified ${scored.length} high-opportunity keywords from ${keywords.length} total`);

    return scored;
}

/**
 * Builds a content calendar for the next 30-90 days
 *
 * @param strategy - The agent's strategy configuration
 * @param keywords - List of keywords to schedule
 * @param startDate - Starting date for the calendar
 * @param durationDays - Number of days to plan (30, 60, or 90)
 * @returns Prioritized content calendar with publishing schedule
 *
 * @example
 * const calendar = await buildContentCalendar(
 *   agentStrategy,
 *   highOpportunityKeywords,
 *   new Date(),
 *   90
 * );
 */
export async function buildContentCalendar(
    strategy: SEOAgentStrategy,
    keywords: ContentClusterKeyword[],
    startDate: Date = new Date(),
    durationDays: number = 90
): Promise<ContentCalendarEntry[]> {
    console.log(`[Agent Strategy] Building ${durationDays}-day content calendar`);

    const articlesPerWeek = strategy.articlesPerWeek;
    const totalArticles = Math.floor((durationDays / 7) * articlesPerWeek);

    // Take top keywords based on total articles needed
    const selectedKeywords = keywords.slice(0, Math.min(totalArticles, keywords.length));

    const prompt = `You are an SEO content strategist creating a publishing calendar.

**Strategy:**
- Articles per week: ${articlesPerWeek}
- Target keywords: ${strategy.targetKeywords}
- Focus formats: ${strategy.focusFormats.join(", ")}
- Quality threshold: ${strategy.qualityThreshold}

**Keywords to Schedule:**
${selectedKeywords.map((kw, i) => `${i + 1}. "${kw.keyword}" - Volume: ${kw.searchVolume}, Difficulty: ${kw.difficulty}, Intent: ${kw.intent}`).join("\n")}

**Duration:** ${durationDays} days (approximately ${totalArticles} articles)

**Task:** Create a strategic publishing calendar that:
1. Prioritizes by ROI (search volume vs difficulty)
2. Balances content types (pillar, cluster, supporting, listicle, comparison)
3. Groups related topics into clusters
4. Considers seasonal timing
5. Spaces out publishing dates evenly

For each article, provide:
- Compelling title (optimized for CTR and SEO)
- Content type (pillar/cluster/supporting/listicle/comparison)
- Priority (1-10, 10 being highest)
- Estimated word count
- Target publish date (YYYY-MM-DD format, starting from ${startDate.toISOString().split('T')[0]})
- Cluster ID (if part of a topic cluster)
- Reasoning (why this keyword/timing)

Return as JSON array:
[
  {
    "keyword": "original keyword",
    "title": "SEO-optimized article title",
    "type": "pillar",
    "priority": 9,
    "estimatedWordCount": 3500,
    "targetPublishDate": "2026-01-25",
    "clusterId": "ai-fundamentals-cluster",
    "reasoning": "High volume, low competition, foundation topic"
  }
]

**Guidelines:**
- Pillar articles: 3000-5000 words, cornerstone content
- Cluster articles: 2000-3000 words, support pillars
- Supporting articles: 1500-2500 words, specific topics
- Listicles: 1500-2000 words, easy to rank
- Comparisons: 2000-3000 words, high commercial intent

Output ONLY valid JSON array, no markdown formatting.`;

    try {
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 6000,
            temperature: 0.7,
            messages: [{ role: "user", content: prompt }]
        });

        const responseText = message.content[0].type === "text" ? message.content[0].text : "[]";

        // Clean JSON response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        const jsonText = jsonMatch ? jsonMatch[0] : responseText;

        const calendar = JSON.parse(jsonText) as ContentCalendarEntry[];

        console.log(`[Agent Strategy] Created calendar with ${calendar.length} articles`);

        return calendar;

    } catch (error) {
        console.error("[Agent Strategy] Error building content calendar:", error);
        throw new Error(`Failed to build content calendar: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}

/**
 * Prioritizes topics by ROI potential (estimated traffic vs effort)
 *
 * @param calendar - Content calendar entries to prioritize
 * @returns Calendar sorted by ROI with priority scores
 *
 * @example
 * const prioritized = prioritizeTopicsByROI(calendar);
 * const topPriority = prioritized.slice(0, 10); // Get top 10 highest ROI topics
 */
export function prioritizeTopicsByROI(calendar: ContentCalendarEntry[]): ContentCalendarEntry[] {
    // Calculate ROI score for each entry
    const scored = calendar.map(entry => {
        // ROI = (Priority * 10) / (Estimated Word Count / 1000)
        // Higher priority and lower word count = better ROI
        const effortScore = entry.estimatedWordCount / 1000;
        const roiScore = (entry.priority * 10) / effortScore;

        return {
            ...entry,
            roiScore
        };
    });

    // Sort by ROI descending
    scored.sort((a, b) => (b as any).roiScore - (a as any).roiScore);

    console.log(`[Agent Strategy] Prioritized ${scored.length} topics by ROI`);

    return scored;
}

/**
 * Generates a complete SEO agent strategy with content gaps, opportunities, and calendar
 *
 * @param niche - The site's primary niche
 * @param articlesPerWeek - Target publishing frequency
 * @param durationDays - Planning horizon in days
 * @param existingKeywords - Keywords already covered
 * @returns Complete strategy including gaps, calendar, and recommendations
 *
 * @example
 * const strategy = await generateAgentStrategy(
 *   "AI and machine learning",
 *   3,
 *   90,
 *   ["neural networks", "deep learning"]
 * );
 */
export async function generateAgentStrategy(
    niche: string,
    articlesPerWeek: number = 3,
    durationDays: number = 90,
    existingKeywords: string[] = []
): Promise<StrategyAnalysis> {
    console.log(`[Agent Strategy] Generating complete strategy for "${niche}"`);

    // Step 1: Analyze content gaps
    const contentGaps = await analyzeContentGaps(niche, existingKeywords);

    // Step 2: Identify high-opportunity keywords
    const highOpportunityKeywords = identifyHighOpportunityKeywords(
        contentGaps.missingKeywords,
        70, // max difficulty
        500 // min search volume
    );

    // Step 3: Build strategy config
    const strategyConfig: SEOAgentStrategy = {
        niche,
        articlesPerWeek,
        targetKeywords: highOpportunityKeywords.length,
        focusFormats: ['pillar', 'cluster', 'supporting', 'listicle', 'comparison'],
        qualityThreshold: 75,
        contentClusterSize: 5
    };

    // Step 4: Build content calendar
    const calendar = await buildContentCalendar(
        strategyConfig,
        highOpportunityKeywords,
        new Date(),
        durationDays
    );

    // Step 5: Prioritize by ROI
    const prioritizedCalendar = prioritizeTopicsByROI(calendar);

    // Step 6: Generate strategic recommendations
    const recommendations = {
        focusAreas: contentGaps.underservedTopics.slice(0, 5),
        quickWins: prioritizedCalendar.slice(0, 10).map(c => c.title),
        longTermGoals: contentGaps.competitorGaps.slice(0, 5).map(g => g.topic)
    };

    console.log(`[Agent Strategy] Strategy generation complete`);
    console.log(`[Agent Strategy] - Content gaps identified: ${contentGaps.missingKeywords.length} keywords`);
    console.log(`[Agent Strategy] - Calendar entries: ${prioritizedCalendar.length} articles`);
    console.log(`[Agent Strategy] - Focus areas: ${recommendations.focusAreas.length}`);

    return {
        contentGaps,
        calendar: prioritizedCalendar,
        recommendations
    };
}

/**
 * Fetches existing keywords from the database to avoid duplication
 *
 * @param userId - User ID to fetch keywords for
 * @returns Array of keywords already covered by published articles
 *
 * @example
 * const covered = await getExistingKeywords("user-123");
 * // Returns: ["neural networks", "deep learning", ...]
 */
export async function getExistingKeywords(userId?: string): Promise<string[]> {
    try {
        const supabase = createServerClient();

        const { data: articles, error } = await supabase
            .from('articles')
            .select('main_keyword')
            .eq('status', 'published');

        if (error) {
            console.error('[Agent Strategy] Error fetching existing keywords:', error);
            return [];
        }

        const keywords = articles
            ?.map(a => a.main_keyword)
            .filter((k): k is string => k !== null && k !== undefined) || [];

        console.log(`[Agent Strategy] Found ${keywords.length} existing keywords`);

        return keywords;

    } catch (error) {
        console.error('[Agent Strategy] Error in getExistingKeywords:', error);
        return [];
    }
}
