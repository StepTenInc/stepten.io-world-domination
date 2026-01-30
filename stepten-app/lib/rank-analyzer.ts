/**
 * Rank Analyzer Module
 * Analyzes ranking changes, detects drops, and identifies opportunities
 */

import type { RankingData } from "./seo-types";
import { ALERT_POSITION_DROP, TOP_POSITION_THRESHOLD } from "./constants";

export interface RankingHistory {
    keyword: string;
    url: string;
    history: Array<{
        position: number;
        checkedAt: string;
        searchVolume: number;
        estimatedTraffic: number;
    }>;
}

export interface PositionChange {
    keyword: string;
    currentPosition: number;
    previousPosition: number;
    change: number;
    changePercentage: number;
    trend: 'up' | 'down' | 'stable';
    severity: 'major' | 'moderate' | 'minor' | 'none';
    searchVolume: number;
    trafficImpact: number;
}

export interface RankingAlert {
    id: string;
    keyword: string;
    alertType: 'drop' | 'opportunity' | 'achievement' | 'lost';
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    currentPosition: number;
    previousPosition: number;
    change: number;
    searchVolume: number;
    estimatedTrafficLoss: number;
    triggeredAt: string;
    actionItems: string[];
}

export interface RankingOpportunity {
    keyword: string;
    currentPosition: number;
    distanceFromPageOne: number;
    searchVolume: number;
    potentialTraffic: number;
    difficulty: number;
    priority: 'high' | 'medium' | 'low';
    reasoning: string;
    suggestions: string[];
}

export interface RankingTrend {
    keyword: string;
    period: 'day' | 'week' | 'month' | 'quarter' | 'year';
    startPosition: number;
    endPosition: number;
    change: number;
    trend: 'improving' | 'declining' | 'stable' | 'volatile';
    volatility: number;
    averagePosition: number;
    bestPosition: number;
    worstPosition: number;
    dataPoints: number;
}

/**
 * Calculates position changes over different time periods
 *
 * Analyzes ranking data to determine how positions have changed
 * over the last day, week, and month. Provides trend analysis and
 * severity assessment for each change.
 *
 * @param history - Historical ranking data for a keyword
 * @returns Position change analysis for different time periods
 *
 * @example
 * ```typescript
 * const changes = calculatePositionChanges({
 *   keyword: 'seo tools',
 *   url: 'https://example.com',
 *   history: [
 *     { position: 5, checkedAt: '2024-01-15T10:00:00Z', searchVolume: 5000, estimatedTraffic: 273 },
 *     { position: 3, checkedAt: '2024-01-14T10:00:00Z', searchVolume: 5000, estimatedTraffic: 481 }
 *   ]
 * });
 *
 * console.log(`Daily change: ${changes.daily.change} positions`);
 * ```
 */
export function calculatePositionChanges(history: RankingHistory): {
    daily: PositionChange | null;
    weekly: PositionChange | null;
    monthly: PositionChange | null;
} {
    const now = new Date();

    // Sort history by date (newest first)
    const sortedHistory = [...history.history].sort(
        (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
    );

    if (sortedHistory.length === 0) {
        return { daily: null, weekly: null, monthly: null };
    }

    const current = sortedHistory[0];

    // Find positions at different time periods
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const dailyComparison = findClosestHistoricalPosition(sortedHistory, oneDayAgo);
    const weeklyComparison = findClosestHistoricalPosition(sortedHistory, oneWeekAgo);
    const monthlyComparison = findClosestHistoricalPosition(sortedHistory, oneMonthAgo);

    return {
        daily: dailyComparison
            ? createPositionChange(history.keyword, current, dailyComparison)
            : null,
        weekly: weeklyComparison
            ? createPositionChange(history.keyword, current, weeklyComparison)
            : null,
        monthly: monthlyComparison
            ? createPositionChange(history.keyword, current, monthlyComparison)
            : null
    };
}

/**
 * Finds the closest historical position to a target date
 *
 * Searches through historical data to find the position entry
 * that is closest to the specified target date.
 *
 * @param history - Sorted array of historical positions
 * @param targetDate - Target date to find nearest position for
 * @returns Closest historical position entry or null
 */
function findClosestHistoricalPosition(
    history: Array<{ position: number; checkedAt: string; searchVolume: number; estimatedTraffic: number }>,
    targetDate: Date
): { position: number; checkedAt: string; searchVolume: number; estimatedTraffic: number } | null {
    if (history.length === 0) return null;

    let closest = history[0];
    let minDiff = Math.abs(new Date(history[0].checkedAt).getTime() - targetDate.getTime());

    for (const entry of history) {
        const diff = Math.abs(new Date(entry.checkedAt).getTime() - targetDate.getTime());
        if (diff < minDiff) {
            minDiff = diff;
            closest = entry;
        }
    }

    return closest;
}

/**
 * Creates a position change object from current and previous positions
 *
 * Calculates the change metrics and determines trend and severity.
 *
 * @param keyword - Keyword being analyzed
 * @param current - Current position data
 * @param previous - Previous position data
 * @returns Position change analysis
 */
function createPositionChange(
    keyword: string,
    current: { position: number; searchVolume: number; estimatedTraffic: number },
    previous: { position: number; searchVolume: number; estimatedTraffic: number }
): PositionChange {
    const change = previous.position - current.position; // Positive = improvement
    const changePercentage = previous.position > 0
        ? (change / previous.position) * 100
        : 0;

    const trend: 'up' | 'down' | 'stable' = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';

    // Determine severity
    const absChange = Math.abs(change);
    let severity: 'major' | 'moderate' | 'minor' | 'none';

    if (absChange >= 10) {
        severity = 'major';
    } else if (absChange >= 5) {
        severity = 'moderate';
    } else if (absChange >= 2) {
        severity = 'minor';
    } else {
        severity = 'none';
    }

    const trafficImpact = current.estimatedTraffic - previous.estimatedTraffic;

    return {
        keyword,
        currentPosition: current.position,
        previousPosition: previous.position,
        change,
        changePercentage,
        trend,
        severity,
        searchVolume: current.searchVolume,
        trafficImpact
    };
}

/**
 * Detects ranking drops that require alerts
 *
 * Analyzes position changes to identify significant drops that should
 * trigger alerts. Uses configurable thresholds to determine severity.
 *
 * @param changes - Position changes to analyze
 * @param thresholds - Custom alert thresholds (optional)
 * @returns Array of ranking alerts for significant drops
 *
 * @example
 * ```typescript
 * const alerts = detectRankingDrops({
 *   daily: { keyword: 'seo', currentPosition: 10, previousPosition: 3, change: -7, ... },
 *   weekly: null,
 *   monthly: null
 * });
 *
 * alerts.forEach(alert => {
 *   console.log(`ALERT: ${alert.message}`);
 *   alert.actionItems.forEach(action => console.log(`- ${action}`));
 * });
 * ```
 */
export function detectRankingDrops(
    changes: {
        daily: PositionChange | null;
        weekly: PositionChange | null;
        monthly: PositionChange | null;
    },
    thresholds?: {
        criticalDrop?: number;
        highDrop?: number;
        mediumDrop?: number;
    }
): RankingAlert[] {
    const alerts: RankingAlert[] = [];

    const criticalThreshold = thresholds?.criticalDrop || 10;
    const highThreshold = thresholds?.highDrop || 5;
    const mediumThreshold = thresholds?.mediumDrop || ALERT_POSITION_DROP;

    // Check daily changes
    if (changes.daily && changes.daily.trend === 'down') {
        const absChange = Math.abs(changes.daily.change);

        if (absChange >= criticalThreshold) {
            alerts.push(createRankingAlert(changes.daily, 'critical', 'daily'));
        } else if (absChange >= highThreshold) {
            alerts.push(createRankingAlert(changes.daily, 'high', 'daily'));
        } else if (absChange >= mediumThreshold) {
            alerts.push(createRankingAlert(changes.daily, 'medium', 'daily'));
        }
    }

    // Check weekly changes
    if (changes.weekly && changes.weekly.trend === 'down') {
        const absChange = Math.abs(changes.weekly.change);

        if (absChange >= criticalThreshold && !hasAlertForKeyword(alerts, changes.weekly.keyword)) {
            alerts.push(createRankingAlert(changes.weekly, 'high', 'weekly'));
        }
    }

    // Check monthly changes
    if (changes.monthly && changes.monthly.trend === 'down') {
        const absChange = Math.abs(changes.monthly.change);

        if (absChange >= criticalThreshold && !hasAlertForKeyword(alerts, changes.monthly.keyword)) {
            alerts.push(createRankingAlert(changes.monthly, 'medium', 'monthly'));
        }
    }

    // Check for complete ranking loss (fell off first 100 positions)
    if (changes.daily && changes.daily.currentPosition > 100 && changes.daily.previousPosition <= 50) {
        alerts.push({
            id: `alert-${changes.daily.keyword}-lost-${Date.now()}`,
            keyword: changes.daily.keyword,
            alertType: 'lost',
            severity: 'critical',
            message: `Keyword "${changes.daily.keyword}" has fallen out of top 100 results (was #${changes.daily.previousPosition})`,
            currentPosition: changes.daily.currentPosition,
            previousPosition: changes.daily.previousPosition,
            change: changes.daily.change,
            searchVolume: changes.daily.searchVolume,
            estimatedTrafficLoss: changes.daily.trafficImpact,
            triggeredAt: new Date().toISOString(),
            actionItems: [
                'Immediately review article content quality',
                'Check for technical SEO issues (indexing, crawlability)',
                'Analyze competitor content that may have overtaken you',
                'Consider content refresh or complete rewrite',
                'Review backlink profile for lost links'
            ]
        });
    }

    return alerts;
}

/**
 * Creates a ranking alert from a position change
 */
function createRankingAlert(
    change: PositionChange,
    severity: 'critical' | 'high' | 'medium' | 'low',
    period: 'daily' | 'weekly' | 'monthly'
): RankingAlert {
    const absChange = Math.abs(change.change);

    const actionItems: string[] = [];

    if (severity === 'critical') {
        actionItems.push(
            'Urgently review content - major ranking loss detected',
            'Check Google Search Console for manual actions or penalties',
            'Analyze SERP to identify new competitors',
            'Review recent site changes or updates',
            'Consider emergency content optimization'
        );
    } else if (severity === 'high') {
        actionItems.push(
            'Review content freshness and relevance',
            'Analyze top-ranking competitors for content gaps',
            'Check for technical issues (speed, mobile-friendliness)',
            'Update content with latest information',
            'Consider adding more depth or multimedia'
        );
    } else {
        actionItems.push(
            'Monitor trend over next few days',
            'Compare with competitor movements',
            'Review user engagement metrics',
            'Consider minor content updates'
        );
    }

    return {
        id: `alert-${change.keyword}-${period}-${Date.now()}`,
        keyword: change.keyword,
        alertType: 'drop',
        severity,
        message: `Keyword "${change.keyword}" dropped ${absChange} positions in the last ${period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month'} (#${change.previousPosition} → #${change.currentPosition})`,
        currentPosition: change.currentPosition,
        previousPosition: change.previousPosition,
        change: change.change,
        searchVolume: change.searchVolume,
        estimatedTrafficLoss: Math.abs(change.trafficImpact),
        triggeredAt: new Date().toISOString(),
        actionItems
    };
}

/**
 * Checks if an alert already exists for a keyword
 */
function hasAlertForKeyword(alerts: RankingAlert[], keyword: string): boolean {
    return alerts.some(alert => alert.keyword === keyword);
}

/**
 * Identifies ranking opportunities (keywords near page 1)
 *
 * Analyzes current rankings to find keywords that are close to
 * ranking on page 1 (positions 11-20). These represent quick wins
 * where small improvements could yield significant traffic gains.
 *
 * @param rankings - Current ranking data
 * @param options - Configuration for opportunity detection
 * @returns Array of ranking opportunities prioritized by potential
 *
 * @example
 * ```typescript
 * const opportunities = identifyRankingOpportunities([
 *   { keyword: 'seo tools', position: 12, searchVolume: 5000, ... },
 *   { keyword: 'content marketing', position: 8, searchVolume: 3000, ... }
 * ]);
 *
 * opportunities.forEach(opp => {
 *   console.log(`${opp.keyword}: ${opp.potentialTraffic} potential monthly visits`);
 * });
 * ```
 */
export function identifyRankingOpportunities(
    rankings: RankingData[],
    options?: {
        minSearchVolume?: number;
        maxPosition?: number;
        minPosition?: number;
    }
): RankingOpportunity[] {
    const minSearchVolume = options?.minSearchVolume || 100;
    const maxPosition = options?.maxPosition || 20; // Top of page 2
    const minPosition = options?.minPosition || 11; // Just off page 1

    const opportunities: RankingOpportunity[] = [];

    for (const ranking of rankings) {
        // Skip if not in opportunity range
        if (ranking.position < minPosition || ranking.position > maxPosition) {
            continue;
        }

        // Skip low search volume keywords
        if (ranking.searchVolume < minSearchVolume) {
            continue;
        }

        const distanceFromPageOne = ranking.position - TOP_POSITION_THRESHOLD;

        // Calculate potential traffic if we reach position 10
        const currentTraffic = ranking.estimatedTraffic;
        const potentialTraffic = Math.round(ranking.searchVolume * 0.0251); // CTR for position 10

        const trafficGain = potentialTraffic - currentTraffic;

        // Determine priority
        let priority: 'high' | 'medium' | 'low';

        if (ranking.position <= 15 && ranking.searchVolume >= 1000) {
            priority = 'high';
        } else if (ranking.position <= 18 && ranking.searchVolume >= 500) {
            priority = 'medium';
        } else {
            priority = 'low';
        }

        const suggestions: string[] = [];

        // Add specific suggestions based on position
        if (ranking.position >= 11 && ranking.position <= 13) {
            suggestions.push(
                'Add more comprehensive content (aim for 20-30% more depth)',
                'Update with latest statistics and data',
                'Add FAQ section targeting related queries',
                'Improve internal linking to this page'
            );
        } else if (ranking.position >= 14 && ranking.position <= 16) {
            suggestions.push(
                'Expand content significantly - analyze top 5 competitors',
                'Add multimedia content (videos, infographics)',
                'Build 3-5 high-quality backlinks',
                'Optimize for featured snippet opportunity'
            );
        } else {
            suggestions.push(
                'Complete content audit against top 10 competitors',
                'Add unique data, research, or case studies',
                'Improve E-E-A-T signals (author bio, credentials)',
                'Build authority backlinks from relevant sites'
            );
        }

        opportunities.push({
            keyword: ranking.keyword,
            currentPosition: ranking.position,
            distanceFromPageOne,
            searchVolume: ranking.searchVolume,
            potentialTraffic: trafficGain,
            difficulty: estimateKeywordDifficulty(ranking.position),
            priority,
            reasoning: `Currently ranking #${ranking.position} with ${ranking.searchVolume} monthly searches. Moving to page 1 could add ${trafficGain} monthly visits.`,
            suggestions
        });
    }

    // Sort by potential traffic (highest first)
    opportunities.sort((a, b) => b.potentialTraffic - a.potentialTraffic);

    return opportunities;
}

/**
 * Estimates keyword difficulty based on current ranking
 */
function estimateKeywordDifficulty(position: number): number {
    // If we're already ranking on page 2, difficulty is lower than average
    if (position <= 20) return 45;
    if (position <= 30) return 55;
    if (position <= 50) return 65;
    return 75;
}

/**
 * Analyzes ranking trends over time
 *
 * Examines historical ranking data to identify trends and patterns.
 * Calculates volatility and provides trend classification.
 *
 * @param history - Historical ranking data
 * @param period - Time period to analyze
 * @returns Trend analysis with metrics
 *
 * @example
 * ```typescript
 * const trend = analyzeRankingTrend(rankingHistory, 'month');
 * console.log(`Trend: ${trend.trend}, Volatility: ${trend.volatility}`);
 * ```
 */
export function analyzeRankingTrend(
    history: RankingHistory,
    period: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month'
): RankingTrend | null {
    const sortedHistory = [...history.history].sort(
        (a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
    );

    if (sortedHistory.length < 2) {
        return null;
    }

    const now = new Date();
    let periodStart: Date;

    switch (period) {
        case 'day':
            periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'week':
            periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            periodStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case 'quarter':
            periodStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
        case 'year':
            periodStart = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
    }

    // Filter data within period
    const periodData = sortedHistory.filter(
        entry => new Date(entry.checkedAt) >= periodStart
    );

    if (periodData.length < 2) {
        return null;
    }

    const startPosition = periodData[0].position;
    const endPosition = periodData[periodData.length - 1].position;
    const change = startPosition - endPosition; // Positive = improved

    // Calculate statistics
    const positions = periodData.map(d => d.position);
    const averagePosition = positions.reduce((sum, p) => sum + p, 0) / positions.length;
    const bestPosition = Math.min(...positions);
    const worstPosition = Math.max(...positions);

    // Calculate volatility (standard deviation)
    const variance = positions.reduce((sum, p) => sum + Math.pow(p - averagePosition, 2), 0) / positions.length;
    const volatility = Math.sqrt(variance);

    // Determine trend
    let trend: 'improving' | 'declining' | 'stable' | 'volatile';

    if (volatility > 5) {
        trend = 'volatile';
    } else if (change > 2) {
        trend = 'improving';
    } else if (change < -2) {
        trend = 'declining';
    } else {
        trend = 'stable';
    }

    return {
        keyword: history.keyword,
        period,
        startPosition,
        endPosition,
        change,
        trend,
        volatility: Math.round(volatility * 100) / 100,
        averagePosition: Math.round(averagePosition * 100) / 100,
        bestPosition,
        worstPosition,
        dataPoints: periodData.length
    };
}

/**
 * Generates a comprehensive ranking report
 *
 * Combines all ranking analysis functions to create a complete
 * overview of ranking performance, including changes, alerts,
 * opportunities, and trends.
 *
 * @param histories - Array of ranking histories to analyze
 * @returns Comprehensive ranking report
 *
 * @example
 * ```typescript
 * const report = generateRankingReport(allKeywordHistories);
 * console.log(`Total alerts: ${report.alerts.length}`);
 * console.log(`Opportunities: ${report.opportunities.length}`);
 * ```
 */
export function generateRankingReport(histories: RankingHistory[]): {
    totalKeywords: number;
    averagePosition: number;
    topTenCount: number;
    pageOneCount: number;
    changes: {
        improvements: number;
        declines: number;
        stable: number;
    };
    alerts: RankingAlert[];
    opportunities: RankingOpportunity[];
    trends: RankingTrend[];
    generatedAt: string;
} {
    const allChanges: PositionChange[] = [];
    const allAlerts: RankingAlert[] = [];
    const currentRankings: RankingData[] = [];
    const allTrends: RankingTrend[] = [];

    for (const history of histories) {
        // Calculate changes
        const changes = calculatePositionChanges(history);

        if (changes.daily) allChanges.push(changes.daily);

        // Detect alerts
        const alerts = detectRankingDrops(changes);
        allAlerts.push(...alerts);

        // Get current ranking
        if (history.history.length > 0) {
            const latest = [...history.history].sort(
                (a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime()
            )[0];

            currentRankings.push({
                keyword: history.keyword,
                position: latest.position,
                previousPosition: changes.daily?.previousPosition,
                change: changes.daily?.change || 0,
                url: history.url,
                searchVolume: latest.searchVolume,
                estimatedTraffic: latest.estimatedTraffic,
                checkedAt: latest.checkedAt
            });
        }

        // Analyze trends
        const trend = analyzeRankingTrend(history, 'month');
        if (trend) allTrends.push(trend);
    }

    // Identify opportunities
    const opportunities = identifyRankingOpportunities(currentRankings);

    // Calculate summary statistics
    const positions = currentRankings.map(r => r.position);
    const averagePosition = positions.length > 0
        ? positions.reduce((sum, p) => sum + p, 0) / positions.length
        : 0;

    const topTenCount = currentRankings.filter(r => r.position <= 10).length;
    const pageOneCount = currentRankings.filter(r => r.position <= TOP_POSITION_THRESHOLD).length;

    const improvements = allChanges.filter(c => c.trend === 'up').length;
    const declines = allChanges.filter(c => c.trend === 'down').length;
    const stable = allChanges.filter(c => c.trend === 'stable').length;

    return {
        totalKeywords: currentRankings.length,
        averagePosition: Math.round(averagePosition * 100) / 100,
        topTenCount,
        pageOneCount,
        changes: {
            improvements,
            declines,
            stable
        },
        alerts: allAlerts,
        opportunities,
        trends: allTrends,
        generatedAt: new Date().toISOString()
    };
}
