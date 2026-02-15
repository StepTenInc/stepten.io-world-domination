/**
 * Content Freshness Analyzer
 * Analyzes article content to detect outdated information and assess freshness
 */

import {
  FRESHNESS_THRESHOLD_DAYS,
  OUTDATED_YEAR_THRESHOLD,
} from "./constants";

/**
 * Result of analyzing article freshness
 */
export interface FreshnessScore {
  score: number; // 0-100, where 100 is perfectly fresh
  ageInDays: number;
  ageInMonths: number;
  isStale: boolean;
  factors: {
    ageScore: number;
    contentScore: number;
    dateScore: number;
    technologyScore: number;
  };
}

/**
 * Detected outdated content item
 */
export interface OutdatedItem {
  type: "year" | "date" | "statistic" | "technology" | "product";
  content: string;
  reason: string;
  confidence: "high" | "medium" | "low";
  location?: string;
}

/**
 * Complete freshness analysis result
 */
export interface FreshnessAnalysis {
  freshnessScore: FreshnessScore;
  outdatedItems: OutdatedItem[];
  recommendations: string[];
  needsUpdate: boolean;
}

/**
 * Analyzes the freshness of an article based on its last update date
 *
 * @param lastUpdated - ISO date string of when the article was last updated
 * @returns FreshnessScore object with detailed scoring breakdown
 *
 * @example
 * const score = analyzeArticleAge("2023-06-15T00:00:00Z");
 * console.log(score.score); // 45
 * console.log(score.isStale); // true
 */
export function analyzeArticleAge(lastUpdated: string): FreshnessScore {
  const lastUpdateDate = new Date(lastUpdated);
  const now = new Date();
  const ageInMs = now.getTime() - lastUpdateDate.getTime();
  const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
  const ageInMonths = Math.floor(ageInDays / 30);

  // Calculate age score (decays over time)
  // 0-90 days: 100 points
  // 90-180 days: 80-100 points (linear decay)
  // 180-365 days: 50-80 points (linear decay)
  // 365+ days: 0-50 points (linear decay)
  let ageScore = 100;
  if (ageInDays > 90 && ageInDays <= FRESHNESS_THRESHOLD_DAYS) {
    // 90-180 days: decay from 100 to 80
    ageScore = 100 - ((ageInDays - 90) / 90) * 20;
  } else if (ageInDays > FRESHNESS_THRESHOLD_DAYS && ageInDays <= 365) {
    // 180-365 days: decay from 80 to 50
    ageScore = 80 - ((ageInDays - FRESHNESS_THRESHOLD_DAYS) / 185) * 30;
  } else if (ageInDays > 365) {
    // 365+ days: decay from 50 to 0
    const yearsOld = ageInDays / 365;
    ageScore = Math.max(0, 50 - yearsOld * 15);
  }

  const isStale = ageInDays > FRESHNESS_THRESHOLD_DAYS;

  return {
    score: Math.round(ageScore),
    ageInDays,
    ageInMonths,
    isStale,
    factors: {
      ageScore: Math.round(ageScore),
      contentScore: 100, // Will be updated by content analysis
      dateScore: 100, // Will be updated by date detection
      technologyScore: 100, // Will be updated by technology detection
    },
  };
}

/**
 * Detects outdated years and dates in article content
 *
 * @param content - Article content (HTML or plain text)
 * @returns Array of outdated date references found
 *
 * @example
 * const items = detectOutdatedDates("<p>As of 2022, the market...</p>");
 * // Returns: [{ type: "year", content: "2022", reason: "Referenced year is 4 years old", ... }]
 */
export function detectOutdatedDates(content: string): OutdatedItem[] {
  const currentYear = new Date().getFullYear();
  const outdatedItems: OutdatedItem[] = [];

  // Remove HTML tags for text analysis
  const textContent = content.replace(/<[^>]*>/g, " ");

  // Pattern 1: Year references (e.g., "in 2022", "as of 2023")
  const yearPattern = /\b(20\d{2})\b/g;
  const yearMatches = textContent.matchAll(yearPattern);

  for (const match of yearMatches) {
    const year = parseInt(match[1], 10);
    const yearAge = currentYear - year;

    if (yearAge >= OUTDATED_YEAR_THRESHOLD) {
      outdatedItems.push({
        type: "year",
        content: match[1],
        reason: `Referenced year is ${yearAge} years old`,
        confidence: yearAge >= 3 ? "high" : "medium",
      });
    }
  }

  // Pattern 2: Month/Year dates (e.g., "January 2023", "March 2022")
  const monthYearPattern =
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(20\d{2})\b/gi;
  const monthYearMatches = textContent.matchAll(monthYearPattern);

  for (const match of monthYearMatches) {
    const year = parseInt(match[2], 10);
    const yearAge = currentYear - year;

    if (yearAge >= OUTDATED_YEAR_THRESHOLD) {
      outdatedItems.push({
        type: "date",
        content: match[0],
        reason: `Date reference is ${yearAge} years old`,
        confidence: "high",
      });
    }
  }

  // Pattern 3: "As of" statements (e.g., "As of 2023", "As of March 2022")
  const asOfPattern = /\b(?:as of|since|in)\s+([A-Za-z]+\s+)?20\d{2}\b/gi;
  const asOfMatches = textContent.matchAll(asOfPattern);

  for (const match of asOfMatches) {
    const yearMatch = match[0].match(/20\d{2}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0], 10);
      const yearAge = currentYear - year;

      if (yearAge >= OUTDATED_YEAR_THRESHOLD) {
        outdatedItems.push({
          type: "date",
          content: match[0],
          reason: `Temporal statement is ${yearAge} years old`,
          confidence: "high",
          location: "temporal reference",
        });
      }
    }
  }

  return outdatedItems;
}

/**
 * Detects outdated statistics and numerical data in content
 *
 * @param content - Article content to analyze
 * @returns Array of potentially outdated statistics
 *
 * @example
 * const stats = detectOutdatedStatistics("<p>70% of users prefer...</p>");
 * // Detects percentage claims, user counts, market share, etc.
 */
export function detectOutdatedStatistics(content: string): OutdatedItem[] {
  const outdatedItems: OutdatedItem[] = [];
  const textContent = content.replace(/<[^>]*>/g, " ");

  // Pattern 1: Percentage statistics
  const percentagePattern = /\b(\d+(?:\.\d+)?)\s*%\s+of\s+(\w+)/gi;
  const percentageMatches = textContent.matchAll(percentagePattern);

  for (const match of percentageMatches) {
    outdatedItems.push({
      type: "statistic",
      content: match[0],
      reason: "Percentage statistic may be outdated",
      confidence: "medium",
      location: "statistic",
    });
  }

  // Pattern 2: User/customer counts (e.g., "10 million users", "5M customers")
  const userCountPattern =
    /\b(\d+(?:\.\d+)?)\s*(million|billion|thousand|M|B|K)\s+(users|customers|subscribers|downloads|installs)\b/gi;
  const userCountMatches = textContent.matchAll(userCountPattern);

  for (const match of userCountMatches) {
    outdatedItems.push({
      type: "statistic",
      content: match[0],
      reason: "User/customer count may be outdated",
      confidence: "high",
      location: "metrics",
    });
  }

  // Pattern 3: Market share claims
  const marketSharePattern =
    /\b(\d+(?:\.\d+)?)\s*%\s+(?:market share|of the market)\b/gi;
  const marketShareMatches = textContent.matchAll(marketSharePattern);

  for (const match of marketShareMatches) {
    outdatedItems.push({
      type: "statistic",
      content: match[0],
      reason: "Market share data may be outdated",
      confidence: "high",
      location: "market data",
    });
  }

  // Pattern 4: Growth rate claims
  const growthPattern = /\b(\d+(?:\.\d+)?)\s*%\s+(?:growth|increase|decline)\b/gi;
  const growthMatches = textContent.matchAll(growthPattern);

  for (const match of growthMatches) {
    outdatedItems.push({
      type: "statistic",
      content: match[0],
      reason: "Growth rate may be outdated",
      confidence: "medium",
      location: "growth metrics",
    });
  }

  return outdatedItems;
}

/**
 * Detects outdated product names and technology references
 *
 * @param content - Article content to analyze
 * @returns Array of potentially outdated technology references
 *
 * @example
 * const tech = detectOutdatedTechnologies("<p>Using Angular 10...</p>");
 * // Detects version numbers, deprecated tools, old platform names
 */
export function detectOutdatedTechnologies(content: string): OutdatedItem[] {
  const outdatedItems: OutdatedItem[] = [];
  const textContent = content.replace(/<[^>]*>/g, " ");

  // Pattern 1: Version numbers (e.g., "React 16", "Python 3.8", "iOS 14")
  const versionPattern =
    /\b(React|Angular|Vue|Python|Java|Node|PHP|iOS|Android|Windows|macOS|Ubuntu)\s+(\d+(?:\.\d+)?)\b/gi;
  const versionMatches = textContent.matchAll(versionPattern);

  for (const match of versionMatches) {
    const version = parseFloat(match[2]);
    // Heuristic: if version number seems low, flag it
    let isLikelyOutdated = false;

    switch (match[1].toLowerCase()) {
      case "react":
        isLikelyOutdated = version < 17;
        break;
      case "angular":
        isLikelyOutdated = version < 15;
        break;
      case "vue":
        isLikelyOutdated = version < 3;
        break;
      case "python":
        isLikelyOutdated = version < 3.9;
        break;
      case "node":
        isLikelyOutdated = version < 16;
        break;
      case "ios":
        isLikelyOutdated = version < 15;
        break;
      case "android":
        isLikelyOutdated = version < 12;
        break;
    }

    if (isLikelyOutdated) {
      outdatedItems.push({
        type: "technology",
        content: match[0],
        reason: `Technology version may be outdated`,
        confidence: "medium",
        location: "technology reference",
      });
    }
  }

  // Pattern 2: Common deprecated technologies
  const deprecatedTerms = [
    "bower",
    "grunt",
    "gulp",
    "jQuery UI",
    "AngularJS",
    "Backbone.js",
    "CoffeeScript",
    "Flash",
    "Silverlight",
    "Internet Explorer",
    "IE11",
  ];

  for (const term of deprecatedTerms) {
    const regex = new RegExp(`\\b${term}\\b`, "gi");
    if (regex.test(textContent)) {
      outdatedItems.push({
        type: "technology",
        content: term,
        reason: `${term} is deprecated or outdated`,
        confidence: "high",
        location: "deprecated technology",
      });
    }
  }

  // Pattern 3: Old product names
  const oldProductNames: { [key: string]: string } = {
    "Google+": "Google Plus has been discontinued",
    "Hangouts": "Google Hangouts has been replaced by Google Chat/Meet",
    "Inbox by Gmail": "Inbox has been discontinued",
    "Twitter": "Platform has been rebranded to X (verify if still relevant)",
  };

  for (const [product, reason] of Object.entries(oldProductNames)) {
    const regex = new RegExp(`\\b${product}\\b`, "gi");
    if (regex.test(textContent)) {
      outdatedItems.push({
        type: "product",
        content: product,
        reason,
        confidence: "high",
        location: "product reference",
      });
    }
  }

  return outdatedItems;
}

/**
 * Calculates overall content freshness score based on detected issues
 *
 * @param articleAge - Result from analyzeArticleAge
 * @param contentLength - Total length of content in characters
 * @param outdatedItems - Array of all detected outdated items
 * @returns Overall freshness score (0-100)
 *
 * @example
 * const ageScore = analyzeArticleAge("2023-01-01T00:00:00Z");
 * const outdated = [...detectOutdatedDates(content), ...detectOutdatedStatistics(content)];
 * const score = calculateContentFreshnessScore(ageScore, 5000, outdated);
 */
export function calculateContentFreshnessScore(
  articleAge: FreshnessScore,
  contentLength: number,
  outdatedItems: OutdatedItem[]
): number {
  // Base score from article age
  let score = articleAge.score;

  // Penalize based on density of outdated items
  const outdatedDensity = outdatedItems.length / (contentLength / 1000); // per 1000 chars
  const outdatedPenalty = Math.min(30, outdatedDensity * 10);

  // Higher penalty for high-confidence items
  const highConfidenceItems = outdatedItems.filter(
    (item) => item.confidence === "high"
  ).length;
  const confidencePenalty = Math.min(20, highConfidenceItems * 5);

  // Calculate final score
  score = score - outdatedPenalty - confidencePenalty;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Performs complete freshness analysis on an article
 *
 * @param content - Article HTML content
 * @param lastUpdated - ISO date string of last update
 * @returns Complete FreshnessAnalysis with score, issues, and recommendations
 *
 * @example
 * const analysis = analyzeFreshness(articleHtml, "2023-06-15T00:00:00Z");
 * console.log(analysis.freshnessScore.score); // 65
 * console.log(analysis.needsUpdate); // true
 * console.log(analysis.recommendations); // ["Update statistics from 2022", ...]
 */
export function analyzeFreshness(
  content: string,
  lastUpdated: string
): FreshnessAnalysis {
  // Analyze article age
  const articleAge = analyzeArticleAge(lastUpdated);

  // Detect outdated content
  const outdatedDates = detectOutdatedDates(content);
  const outdatedStats = detectOutdatedStatistics(content);
  const outdatedTech = detectOutdatedTechnologies(content);

  // Combine all outdated items
  const allOutdatedItems = [
    ...outdatedDates,
    ...outdatedStats,
    ...outdatedTech,
  ];

  // Remove duplicates
  const uniqueOutdatedItems = allOutdatedItems.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.content === item.content)
  );

  // Calculate overall freshness score
  const overallScore = calculateContentFreshnessScore(
    articleAge,
    content.length,
    uniqueOutdatedItems
  );

  // Update article age with content-based factors
  articleAge.score = overallScore;
  articleAge.factors.contentScore = 100 - uniqueOutdatedItems.length * 5;
  articleAge.factors.dateScore = 100 - outdatedDates.length * 10;
  articleAge.factors.technologyScore = 100 - outdatedTech.length * 15;

  // Generate recommendations
  const recommendations: string[] = [];

  if (articleAge.ageInMonths > 6) {
    recommendations.push(
      `Article is ${articleAge.ageInMonths} months old - consider updating`
    );
  }

  if (outdatedDates.length > 0) {
    const years = [...new Set(outdatedDates.map((d) => d.content))];
    recommendations.push(
      `Update ${outdatedDates.length} outdated date reference(s): ${years.slice(0, 3).join(", ")}${years.length > 3 ? "..." : ""}`
    );
  }

  if (outdatedStats.length > 0) {
    recommendations.push(
      `Refresh ${outdatedStats.length} statistic(s) with current data`
    );
  }

  if (outdatedTech.length > 0) {
    const technologies = [
      ...new Set(outdatedTech.map((t) => t.content.split(" ")[0])),
    ];
    recommendations.push(
      `Update references to: ${technologies.slice(0, 3).join(", ")}${technologies.length > 3 ? "..." : ""}`
    );
  }

  if (overallScore < 50) {
    recommendations.push(
      "Overall freshness is low - consider a comprehensive content refresh"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("Content is fresh - no immediate updates needed");
  }

  const needsUpdate = overallScore < 70 || articleAge.isStale;

  return {
    freshnessScore: articleAge,
    outdatedItems: uniqueOutdatedItems,
    recommendations,
    needsUpdate,
  };
}
