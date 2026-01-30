/**
 * Content Refresh Suggester
 * Generates actionable recommendations for updating stale content
 */

import { RefreshAnalysis, RankingData } from "./seo-types";
import {
  FreshnessAnalysis,
  OutdatedItem,
} from "./freshness-analyzer";
import {
  HIGH_PRIORITY_TRAFFIC_DROP,
} from "./constants";

/**
 * Section identified as needing updates
 */
export interface SectionUpdate {
  section: string;
  reason: string;
  priority: "high" | "medium" | "low";
  suggestions: string[];
}

/**
 * Suggested new data or statistics to add
 */
export interface DataSuggestion {
  type: "statistic" | "example" | "case-study" | "tool" | "resource";
  description: string;
  rationale: string;
  priority: number; // 1-10
}

/**
 * Suggested new section based on trends
 */
export interface SectionSuggestion {
  title: string;
  description: string;
  keywords: string[];
  estimatedWordCount: number;
  rationale: string;
}

/**
 * Identifies sections of content that need updates
 *
 * @param content - Article HTML content
 * @param outdatedItems - Array of detected outdated items
 * @returns Array of sections needing updates with specific recommendations
 *
 * @example
 * const sections = identifySectionsNeedingUpdate(html, outdatedItems);
 * // Returns sections grouped by heading with specific update suggestions
 */
export function identifySectionsNeedingUpdate(
  content: string,
  outdatedItems: OutdatedItem[]
): SectionUpdate[] {
  const sectionUpdates: SectionUpdate[] = [];

  // Parse content to find sections (headings)
  const headingPattern = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
  const headings = [...content.matchAll(headingPattern)];

  // If no headings found, treat entire content as one section
  if (headings.length === 0) {
    const suggestions: string[] = [];
    const highPriorityItems = outdatedItems.filter(
      (item) => item.confidence === "high"
    );

    if (highPriorityItems.length > 0) {
      suggestions.push(
        `Update ${highPriorityItems.length} high-priority outdated reference(s)`
      );
    }

    if (outdatedItems.some((item) => item.type === "statistic")) {
      suggestions.push("Refresh statistics with current data");
    }

    if (outdatedItems.some((item) => item.type === "technology")) {
      suggestions.push("Update technology versions and references");
    }

    sectionUpdates.push({
      section: "Main Content",
      reason: "Contains outdated information",
      priority: highPriorityItems.length > 3 ? "high" : "medium",
      suggestions,
    });

    return sectionUpdates;
  }

  // Analyze each section
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const headingText = heading[1].replace(/<[^>]*>/g, "").trim();

    // Extract section content (from this heading to next heading or end)
    const startIndex = heading.index || 0;
    const endIndex =
      i < headings.length - 1 ? headings[i + 1].index || content.length : content.length;
    const sectionContent = content.substring(
      startIndex,
      endIndex
    );

    // Find outdated items in this section
    const sectionOutdated = outdatedItems.filter((item) =>
      sectionContent.includes(item.content)
    );

    if (sectionOutdated.length > 0) {
      const suggestions: string[] = [];
      const highPriorityCount = sectionOutdated.filter(
        (item) => item.confidence === "high"
      ).length;

      // Group by type
      const dateItems = sectionOutdated.filter(
        (item) => item.type === "date" || item.type === "year"
      );
      const statItems = sectionOutdated.filter(
        (item) => item.type === "statistic"
      );
      const techItems = sectionOutdated.filter(
        (item) => item.type === "technology" || item.type === "product"
      );

      if (dateItems.length > 0) {
        const years = [...new Set(dateItems.map((d) => d.content))];
        suggestions.push(
          `Update date references: ${years.slice(0, 2).join(", ")}${years.length > 2 ? ", etc." : ""}`
        );
      }

      if (statItems.length > 0) {
        suggestions.push(
          `Refresh ${statItems.length} statistic(s) with current data from 2026`
        );
      }

      if (techItems.length > 0) {
        suggestions.push(
          `Update technology references to current versions`
        );
      }

      // Determine priority
      let priority: "high" | "medium" | "low" = "low";
      if (highPriorityCount >= 3 || statItems.length >= 2) {
        priority = "high";
      } else if (highPriorityCount >= 1 || sectionOutdated.length >= 3) {
        priority = "medium";
      }

      sectionUpdates.push({
        section: headingText,
        reason: `Contains ${sectionOutdated.length} outdated reference(s)`,
        priority,
        suggestions,
      });
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  sectionUpdates.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return sectionUpdates;
}

/**
 * Suggests new statistics and data to add to the article
 *
 * @param keyword - Main topic/keyword of the article
 * @param currentYear - Current year for context
 * @returns Array of data suggestions with rationale
 *
 * @example
 * const suggestions = suggestNewData("React hooks tutorial", 2026);
 * // Returns suggestions for current statistics, examples, and resources
 */
export function suggestNewData(
  keyword: string,
  currentYear: number = new Date().getFullYear()
): DataSuggestion[] {
  const suggestions: DataSuggestion[] = [];

  // Suggest current year statistics
  suggestions.push({
    type: "statistic",
    description: `Add ${currentYear} usage statistics or market data for ${keyword}`,
    rationale: "Fresh statistics improve credibility and SEO value",
    priority: 9,
  });

  // Suggest recent examples
  suggestions.push({
    type: "example",
    description: `Include ${currentYear} real-world examples or case studies`,
    rationale: "Recent examples demonstrate current relevance",
    priority: 8,
  });

  // Suggest updated tools/resources
  suggestions.push({
    type: "tool",
    description: `Add current tools and resources related to ${keyword}`,
    rationale: "Updated tool recommendations increase article value",
    priority: 7,
  });

  // Suggest recent case studies
  suggestions.push({
    type: "case-study",
    description: `Feature success stories or implementations from ${currentYear - 1}-${currentYear}`,
    rationale: "Fresh case studies show practical application",
    priority: 7,
  });

  // Suggest additional resources
  suggestions.push({
    type: "resource",
    description: `Link to recent documentation, guides, or authoritative sources (${currentYear})`,
    rationale: "Current resources maintain link quality and trust",
    priority: 6,
  });

  return suggestions.sort((a, b) => b.priority - a.priority);
}

/**
 * Recommends new sections to add based on recent trends
 *
 * @param keyword - Main topic/keyword
 * @param existingHeadings - Array of existing section headings
 * @returns Array of suggested new sections
 *
 * @example
 * const sections = recommendNewSections("React hooks", ["Introduction", "useState Hook"]);
 * // Returns suggestions like "Best Practices 2026", "Common Mistakes", etc.
 */
export function recommendNewSections(
  keyword: string,
  existingHeadings: string[]
): SectionSuggestion[] {
  const suggestions: SectionSuggestion[] = [];
  const currentYear = new Date().getFullYear();

  // Normalize existing headings for comparison
  const normalizedHeadings = existingHeadings.map((h) =>
    h.toLowerCase().trim()
  );

  // Common valuable sections that might be missing
  const commonSections = [
    {
      title: `Best Practices (${currentYear})`,
      description: "Current best practices and recommended approaches",
      keywords: ["best practices", "recommendations", "guidelines"],
      estimatedWordCount: 400,
      rationale: "Best practices evolve; adding current year shows freshness",
      checkExists: ["best practice", "recommendation", "guideline"],
    },
    {
      title: "Common Mistakes to Avoid",
      description: "Frequently encountered issues and how to prevent them",
      keywords: ["mistakes", "errors", "pitfalls", "avoid"],
      estimatedWordCount: 350,
      rationale: "Helps readers avoid common pitfalls",
      checkExists: ["mistake", "error", "pitfall", "avoid"],
    },
    {
      title: `Tools & Resources (${currentYear})`,
      description: "Up-to-date tools, libraries, and resources",
      keywords: ["tools", "resources", "libraries", "frameworks"],
      estimatedWordCount: 300,
      rationale: "Current tools section adds practical value",
      checkExists: ["tool", "resource", "library"],
    },
    {
      title: "Frequently Asked Questions (FAQ)",
      description: "Common questions and answers about the topic",
      keywords: ["faq", "questions", "answers"],
      estimatedWordCount: 400,
      rationale: "FAQs improve SEO and user experience",
      checkExists: ["faq", "frequently asked", "question"],
    },
    {
      title: `Real-World Examples (${currentYear})`,
      description: "Practical examples and use cases",
      keywords: ["examples", "use cases", "real-world", "practical"],
      estimatedWordCount: 450,
      rationale: "Fresh examples demonstrate current applicability",
      checkExists: ["example", "use case", "real-world"],
    },
    {
      title: "Performance Optimization",
      description: "Tips for improving performance and efficiency",
      keywords: ["performance", "optimization", "speed", "efficiency"],
      estimatedWordCount: 400,
      rationale: "Performance is always relevant and valued",
      checkExists: ["performance", "optimization", "optimize"],
    },
    {
      title: "Future Trends",
      description: "Upcoming developments and future directions",
      keywords: ["future", "trends", "upcoming", "roadmap"],
      estimatedWordCount: 300,
      rationale: "Shows forward-thinking and industry awareness",
      checkExists: ["future", "trend", "upcoming"],
    },
  ];

  // Check which sections are missing
  for (const section of commonSections) {
    const exists = section.checkExists.some((keyword) =>
      normalizedHeadings.some((h) => h.includes(keyword))
    );

    if (!exists) {
      suggestions.push({
        title: section.title,
        description: section.description,
        keywords: section.keywords,
        estimatedWordCount: section.estimatedWordCount,
        rationale: section.rationale,
      });
    }
  }

  return suggestions;
}

/**
 * Calculates refresh priority based on multiple factors
 *
 * @param freshnessScore - Score from freshness analysis (0-100)
 * @param rankingDecline - Percentage decline in rankings (0-1)
 * @param ageInMonths - Age of article in months
 * @param outdatedItemCount - Number of outdated items detected
 * @returns Priority level: "urgent", "high", "medium", or "low"
 *
 * @example
 * const priority = calculateRefreshPriority(45, 0.25, 18, 12);
 * // Returns "urgent" (low freshness, significant ranking drop, old content)
 */
export function calculateRefreshPriority(
  freshnessScore: number,
  rankingDecline: number,
  ageInMonths: number,
  outdatedItemCount: number
): "urgent" | "high" | "medium" | "low" {
  // Weight different factors
  let priorityScore = 0;

  // Freshness score (inverted - lower score = higher priority)
  if (freshnessScore < 30) {
    priorityScore += 40;
  } else if (freshnessScore < 50) {
    priorityScore += 30;
  } else if (freshnessScore < 70) {
    priorityScore += 20;
  } else {
    priorityScore += 10;
  }

  // Ranking decline
  if (rankingDecline >= HIGH_PRIORITY_TRAFFIC_DROP) {
    priorityScore += 30;
  } else if (rankingDecline >= 0.15) {
    priorityScore += 20;
  } else if (rankingDecline >= 0.1) {
    priorityScore += 10;
  }

  // Age factor
  if (ageInMonths >= 24) {
    priorityScore += 20;
  } else if (ageInMonths >= 12) {
    priorityScore += 15;
  } else if (ageInMonths >= 6) {
    priorityScore += 10;
  }

  // Outdated items count
  if (outdatedItemCount >= 10) {
    priorityScore += 10;
  } else if (outdatedItemCount >= 5) {
    priorityScore += 5;
  }

  // Determine priority level
  if (priorityScore >= 70) {
    return "urgent";
  } else if (priorityScore >= 50) {
    return "high";
  } else if (priorityScore >= 30) {
    return "medium";
  } else {
    return "low";
  }
}

/**
 * Generates complete refresh analysis with actionable recommendations
 *
 * @param articleId - Unique identifier for the article
 * @param articleSlug - URL slug of the article
 * @param publishedAt - ISO date string of publication
 * @param lastUpdated - ISO date string of last update
 * @param content - Article HTML content
 * @param keyword - Main keyword/topic
 * @param currentRankings - Optional current ranking data
 * @returns Complete RefreshAnalysis object
 *
 * @example
 * const analysis = generateRefreshAnalysis(
 *   "abc123",
 *   "react-hooks-guide",
 *   "2022-06-15T00:00:00Z",
 *   "2023-01-10T00:00:00Z",
 *   articleHtml,
 *   "React hooks tutorial"
 * );
 */
export function generateRefreshAnalysis(
  articleId: string,
  articleSlug: string,
  publishedAt: string,
  lastUpdated: string,
  content: string,
  keyword: string,
  currentRankings: RankingData[] = [],
  freshnessAnalysis: FreshnessAnalysis
): RefreshAnalysis {
  const lastUpdateDate = new Date(lastUpdated);
  const now = new Date();
  const ageInMonths = Math.floor(
    (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  // Calculate ranking decline
  let rankingDecline = 0;
  if (currentRankings.length > 0) {
    const rankingsWithHistory = currentRankings.filter(
      (r) => r.previousPosition !== undefined
    );
    if (rankingsWithHistory.length > 0) {
      const avgChange =
        rankingsWithHistory.reduce((sum, r) => sum + r.change, 0) /
        rankingsWithHistory.length;
      // Positive change means decline (went from position 5 to 10 = +5)
      rankingDecline = avgChange > 0 ? avgChange / 10 : 0; // Normalize to 0-1
    }
  }

  // Identify sections needing updates
  const sectionsNeedingUpdate = identifySectionsNeedingUpdate(
    content,
    freshnessAnalysis.outdatedItems
  );

  // Extract existing headings
  const headingPattern = /<h[2-3][^>]*>(.*?)<\/h[2-3]>/gi;
  const existingHeadings = [...content.matchAll(headingPattern)].map((m) =>
    m[1].replace(/<[^>]*>/g, "").trim()
  );

  // Generate new section suggestions
  const newSectionSuggestions = recommendNewSections(keyword, existingHeadings);

  // Generate data suggestions
  const dataSuggestions = suggestNewData(keyword);

  // Calculate refresh priority
  const refreshPriority = calculateRefreshPriority(
    freshnessAnalysis.freshnessScore.score,
    rankingDecline,
    ageInMonths,
    freshnessAnalysis.outdatedItems.length
  );

  // Compile reasons for refresh
  const reasons: string[] = [];

  if (ageInMonths >= 12) {
    reasons.push(`Content is ${ageInMonths} months old`);
  }

  if (freshnessAnalysis.freshnessScore.score < 70) {
    reasons.push(
      `Low freshness score: ${freshnessAnalysis.freshnessScore.score}/100`
    );
  }

  if (rankingDecline >= HIGH_PRIORITY_TRAFFIC_DROP) {
    reasons.push(
      `Significant ranking decline detected (${Math.round(rankingDecline * 100)}%)`
    );
  }

  if (freshnessAnalysis.outdatedItems.length > 0) {
    reasons.push(
      `Contains ${freshnessAnalysis.outdatedItems.length} outdated reference(s)`
    );
  }

  if (sectionsNeedingUpdate.length > 0) {
    reasons.push(
      `${sectionsNeedingUpdate.length} section(s) need updates`
    );
  }

  // Generate suggested updates
  const suggestedUpdates: Array<{
    type: "content" | "stats" | "links" | "images" | "keywords";
    description: string;
    priority: number;
  }> = [];

  // Add section updates
  sectionsNeedingUpdate.forEach((section, index) => {
    suggestedUpdates.push({
      type: "content",
      description: `Update "${section.section}": ${section.suggestions.join("; ")}`,
      priority: section.priority === "high" ? 10 : section.priority === "medium" ? 7 : 5,
    });
  });

  // Add data suggestions
  dataSuggestions.forEach((suggestion) => {
    suggestedUpdates.push({
      type: suggestion.type === "statistic" ? "stats" : "content",
      description: suggestion.description,
      priority: suggestion.priority,
    });
  });

  // Add section suggestions
  if (newSectionSuggestions.length > 0) {
    newSectionSuggestions.slice(0, 3).forEach((section) => {
      suggestedUpdates.push({
        type: "content",
        description: `Add new section: "${section.title}" - ${section.description}`,
        priority: 6,
      });
    });
  }

  // Suggest link refresh
  if (ageInMonths >= 12) {
    suggestedUpdates.push({
      type: "links",
      description: "Review and update external links for broken/outdated URLs",
      priority: 7,
    });
  }

  // Suggest image refresh
  if (ageInMonths >= 18) {
    suggestedUpdates.push({
      type: "images",
      description: "Consider updating screenshots and images to reflect current UI/designs",
      priority: 5,
    });
  }

  // Suggest keyword refresh
  if (ageInMonths >= 6) {
    suggestedUpdates.push({
      type: "keywords",
      description: "Research current search trends and update target keywords",
      priority: 6,
    });
  }

  // Sort by priority
  suggestedUpdates.sort((a, b) => b.priority - a.priority);

  // Determine if refresh is needed
  const needsRefresh =
    refreshPriority === "urgent" ||
    refreshPriority === "high" ||
    freshnessAnalysis.needsUpdate;

  // Build final analysis
  const analysis: RefreshAnalysis = {
    articleId,
    articleSlug,
    publishedAt,
    lastUpdated,
    ageInMonths,
    currentRankings,
    rankingDecline: Math.round(rankingDecline * 100) / 100,
    needsRefresh,
    refreshPriority,
    reasons,
    suggestedUpdates,
    competitorChanges: {
      newCompetitors: 0, // Would be populated by SERP analysis
      contentUpdates: 0, // Would be populated by competitor tracking
    },
    outdatedInfo: freshnessAnalysis.outdatedItems.map((item) => ({
      section: item.location || "Unknown section",
      content: item.content,
      reason: item.reason,
    })),
  };

  return analysis;
}
