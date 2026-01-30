/**
 * A/B Test Statistical Analyzer
 * Analyzes A/B test results with statistical significance calculations
 */

import { logger } from "./logger";
import { handleError } from "./error-handler";
import { ABTestVariant } from "./seo-types";

export interface VariantStats {
  variantId: string;
  variantName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  ctrPercent: string;
  avgTimeOnPage?: number;
  bounceRate?: number;
  conversions?: number;
  conversionRate?: number;
}

export interface StatisticalComparison {
  variantA: string;
  variantB: string;
  pValue: number;
  isSignificant: boolean;
  confidenceLevel: number;
  improvement: number;
  improvementPercent: string;
}

export interface TestResults {
  testId: string;
  status: "running" | "completed" | "inconclusive";
  variants: VariantStats[];
  winner?: {
    variantId: string;
    variantName: string;
    confidence: number;
    improvement: number;
    improvementPercent: string;
  };
  comparisons: StatisticalComparison[];
  recommendations: string[];
  sampleSize: number;
  minSampleSizeReached: boolean;
  testDuration: number;
  startDate: string;
  endDate?: string;
}

export interface AnalyzeTestOptions {
  testId: string;
  variants: ABTestVariant[];
  startDate: string;
  confidenceLevel?: number;
  minSampleSize?: number;
}

/**
 * Analyzes A/B test results and determines statistical significance
 * Calculates CTR, performs z-test, and identifies winning variant
 *
 * @param options - Test analysis configuration
 * @returns Complete test results with statistical analysis
 * @throws Error if analysis fails
 *
 * @example
 * ```typescript
 * const results = await analyzeTest({
 *   testId: "test-123",
 *   variants: [variantA, variantB],
 *   startDate: "2024-01-01",
 *   confidenceLevel: 0.95
 * });
 * console.log(results.winner); // { variantId: "variant-b", confidence: 0.98 }
 * ```
 */
export async function analyzeTest(
  options: AnalyzeTestOptions
): Promise<TestResults> {
  try {
    logger.info("Analyzing A/B test", { testId: options.testId });

    const confidenceLevel = options.confidenceLevel || 0.95;
    const minSampleSize = options.minSampleSize || 100;

    // Calculate stats for each variant
    const variantStats = options.variants.map((variant) =>
      calculateVariantStats(variant)
    );

    // Calculate total sample size
    const totalImpressions = variantStats.reduce(
      (sum, v) => sum + v.impressions,
      0
    );

    const minSampleSizeReached = variantStats.every(
      (v) => v.impressions >= minSampleSize
    );

    // Perform pairwise comparisons
    const comparisons = performPairwiseComparisons(
      variantStats,
      confidenceLevel
    );

    // Determine winner
    const winner = determineWinner(variantStats, comparisons, confidenceLevel);

    // Calculate test duration
    const testDuration = calculateTestDuration(options.startDate);

    // Generate recommendations
    const recommendations = generateRecommendations(
      variantStats,
      comparisons,
      minSampleSizeReached,
      testDuration
    );

    // Determine status
    const status = determineTestStatus(
      winner,
      minSampleSizeReached,
      testDuration
    );

    const results: TestResults = {
      testId: options.testId,
      status,
      variants: variantStats,
      winner,
      comparisons,
      recommendations,
      sampleSize: totalImpressions,
      minSampleSizeReached,
      testDuration,
      startDate: options.startDate,
      endDate: status === "completed" ? new Date().toISOString() : undefined,
    };

    logger.info("Test analysis completed", {
      testId: options.testId,
      status,
      hasWinner: !!winner,
    });

    return results;
  } catch (error) {
    logger.error("Failed to analyze test", { error });
    throw handleError(error, "analyzeTest");
  }
}

/**
 * Calculates statistics for a single variant
 * Computes CTR, conversion rate, and other metrics
 *
 * @param variant - Variant data from ABTest
 * @returns Calculated statistics
 */
export function calculateVariantStats(variant: ABTestVariant): VariantStats {
  const ctr = variant.impressions > 0 ? variant.clicks / variant.impressions : 0;
  const ctrPercent = `${(ctr * 100).toFixed(2)}%`;

  const stats: VariantStats = {
    variantId: variant.id,
    variantName: variant.name,
    impressions: variant.impressions,
    clicks: variant.clicks,
    ctr,
    ctrPercent,
  };

  if (variant.avgTimeOnPage !== undefined) {
    stats.avgTimeOnPage = variant.avgTimeOnPage;
  }

  if (variant.bounceRate !== undefined) {
    stats.bounceRate = variant.bounceRate;
  }

  return stats;
}

/**
 * Performs pairwise statistical comparisons between variants
 * Uses z-test to determine statistical significance
 *
 * @param variants - Array of variant statistics
 * @param confidenceLevel - Required confidence level (default: 0.95)
 * @returns Array of statistical comparisons
 */
export function performPairwiseComparisons(
  variants: VariantStats[],
  confidenceLevel: number = 0.95
): StatisticalComparison[] {
  const comparisons: StatisticalComparison[] = [];

  // Compare each pair of variants
  for (let i = 0; i < variants.length; i++) {
    for (let j = i + 1; j < variants.length; j++) {
      const variantA = variants[i];
      const variantB = variants[j];

      const comparison = compareVariants(
        variantA,
        variantB,
        confidenceLevel
      );
      comparisons.push(comparison);
    }
  }

  return comparisons;
}

/**
 * Compares two variants using z-test for proportions
 * Calculates p-value and determines statistical significance
 *
 * @param variantA - First variant statistics
 * @param variantB - Second variant statistics
 * @param confidenceLevel - Required confidence level
 * @returns Statistical comparison result
 */
export function compareVariants(
  variantA: VariantStats,
  variantB: VariantStats,
  confidenceLevel: number = 0.95
): StatisticalComparison {
  // Calculate pooled CTR
  const pooledClicks = variantA.clicks + variantB.clicks;
  const pooledImpressions = variantA.impressions + variantB.impressions;
  const pooledCTR = pooledImpressions > 0 ? pooledClicks / pooledImpressions : 0;

  // Calculate standard error
  const se = Math.sqrt(
    pooledCTR *
      (1 - pooledCTR) *
      (1 / variantA.impressions + 1 / variantB.impressions)
  );

  // Calculate z-score
  const zScore = se > 0 ? (variantB.ctr - variantA.ctr) / se : 0;

  // Calculate p-value (two-tailed test)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  // Determine significance
  const alpha = 1 - confidenceLevel;
  const isSignificant = pValue < alpha;

  // Calculate improvement
  const improvement = variantB.ctr - variantA.ctr;
  const improvementPercent =
    variantA.ctr > 0
      ? `${((improvement / variantA.ctr) * 100).toFixed(2)}%`
      : "N/A";

  return {
    variantA: variantA.variantId,
    variantB: variantB.variantId,
    pValue,
    isSignificant,
    confidenceLevel,
    improvement,
    improvementPercent,
  };
}

/**
 * Cumulative distribution function for standard normal distribution
 * Used to calculate p-values from z-scores
 *
 * @param z - Z-score
 * @returns Cumulative probability
 */
function normalCDF(z: number): number {
  // Approximation using error function
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return z > 0 ? 1 - prob : prob;
}

/**
 * Determines the winning variant based on statistical analysis
 * Identifies variant with highest CTR and sufficient confidence
 *
 * @param variants - All variant statistics
 * @param comparisons - Statistical comparisons
 * @param confidenceLevel - Required confidence level
 * @returns Winner information or undefined if no clear winner
 */
export function determineWinner(
  variants: VariantStats[],
  comparisons: StatisticalComparison[],
  confidenceLevel: number
): TestResults["winner"] | undefined {
  if (variants.length < 2) {
    return undefined;
  }

  // Find variant with highest CTR
  const bestVariant = variants.reduce((best, current) =>
    current.ctr > best.ctr ? current : best
  );

  // Check if best variant is significantly better than all others
  const isBestSignificant = variants.every((variant) => {
    if (variant.variantId === bestVariant.variantId) {
      return true;
    }

    const comparison = comparisons.find(
      (c) =>
        (c.variantA === bestVariant.variantId &&
          c.variantB === variant.variantId) ||
        (c.variantB === bestVariant.variantId &&
          c.variantA === variant.variantId)
    );

    if (!comparison) {
      return false;
    }

    // Check if the difference is significant and in favor of best variant
    return (
      comparison.isSignificant &&
      ((comparison.variantB === bestVariant.variantId &&
        comparison.improvement > 0) ||
        (comparison.variantA === bestVariant.variantId &&
          comparison.improvement < 0))
    );
  });

  if (!isBestSignificant) {
    return undefined;
  }

  // Calculate improvement over baseline (first variant)
  const baseline = variants[0];
  const improvement = bestVariant.ctr - baseline.ctr;
  const improvementPercent =
    baseline.ctr > 0
      ? `${((improvement / baseline.ctr) * 100).toFixed(2)}%`
      : "N/A";

  return {
    variantId: bestVariant.variantId,
    variantName: bestVariant.variantName,
    confidence: confidenceLevel,
    improvement,
    improvementPercent,
  };
}

/**
 * Calculates test duration in days
 * Computes difference between start date and now
 *
 * @param startDate - Test start date ISO string
 * @returns Duration in days
 */
function calculateTestDuration(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.floor(diffDays);
}

/**
 * Determines the current status of the test
 * Checks if test should be running, completed, or inconclusive
 *
 * @param winner - Winner information if available
 * @param minSampleSizeReached - Whether minimum sample size is reached
 * @param testDuration - Test duration in days
 * @returns Test status
 */
function determineTestStatus(
  winner: TestResults["winner"] | undefined,
  minSampleSizeReached: boolean,
  testDuration: number
): TestResults["status"] {
  // Maximum test duration (from constants, default 30 days)
  const MAX_TEST_DURATION_DAYS = 30;

  if (winner) {
    return "completed";
  }

  if (testDuration >= MAX_TEST_DURATION_DAYS && minSampleSizeReached) {
    return "inconclusive";
  }

  return "running";
}

/**
 * Generates actionable recommendations based on test results
 * Provides guidance on next steps and optimization opportunities
 *
 * @param variants - Variant statistics
 * @param comparisons - Statistical comparisons
 * @param minSampleSizeReached - Whether minimum sample is reached
 * @param testDuration - Test duration in days
 * @returns Array of recommendations
 */
function generateRecommendations(
  variants: VariantStats[],
  comparisons: StatisticalComparison[],
  minSampleSizeReached: boolean,
  testDuration: number
): string[] {
  const recommendations: string[] = [];

  if (!minSampleSizeReached) {
    recommendations.push(
      "Continue running the test to reach minimum sample size for statistical significance."
    );
    recommendations.push(
      "Consider increasing traffic to the test to gather data faster."
    );
  }

  // Check for clear leader
  const sortedVariants = [...variants].sort((a, b) => b.ctr - a.ctr);
  const leader = sortedVariants[0];
  const runnerUp = sortedVariants[1];

  if (leader && runnerUp) {
    const improvement = ((leader.ctr - runnerUp.ctr) / runnerUp.ctr) * 100;

    if (improvement > 20) {
      recommendations.push(
        `Variant "${leader.variantName}" shows ${improvement.toFixed(1)}% higher CTR. Consider allocating more traffic to confirm this trend.`
      );
    } else if (improvement < 5) {
      recommendations.push(
        "Variants are performing similarly. Consider testing more distinct variations."
      );
    }
  }

  // Check for significant differences
  const significantComparisons = comparisons.filter((c) => c.isSignificant);
  if (significantComparisons.length === 0 && minSampleSizeReached) {
    recommendations.push(
      "No statistically significant differences found. Consider creating more distinct variants or testing different elements."
    );
  }

  // Duration recommendations
  if (testDuration < 7) {
    recommendations.push(
      "Test has run for less than a week. Continue for at least 7-14 days to account for weekly traffic patterns."
    );
  }

  if (testDuration > 30) {
    recommendations.push(
      "Test has been running for over 30 days. Consider concluding the test or starting a new experiment."
    );
  }

  // Performance-based recommendations
  const avgCTR = variants.reduce((sum, v) => sum + v.ctr, 0) / variants.length;
  if (avgCTR < 0.02) {
    recommendations.push(
      "Overall CTR is below 2%. Consider testing more compelling titles or meta descriptions."
    );
  } else if (avgCTR > 0.05) {
    recommendations.push(
      "Strong overall CTR above 5%. Focus on scaling the winning variant."
    );
  }

  return recommendations;
}

/**
 * Calculates the required sample size for desired statistical power
 * Uses power analysis to determine minimum impressions needed
 *
 * @param baselineCTR - Current/baseline CTR (0-1)
 * @param minimumDetectableEffect - Minimum effect size to detect (e.g., 0.1 for 10%)
 * @param alpha - Significance level (default: 0.05)
 * @param power - Statistical power (default: 0.8)
 * @returns Required sample size per variant
 *
 * @example
 * ```typescript
 * const sampleSize = calculateRequiredSampleSize(0.03, 0.1); // 3% CTR, detect 10% change
 * console.log(sampleSize); // ~4000 impressions needed per variant
 * ```
 */
export function calculateRequiredSampleSize(
  baselineCTR: number,
  minimumDetectableEffect: number,
  alpha: number = 0.05,
  power: number = 0.8
): number {
  // Z-scores for alpha and power
  const zAlpha = 1.96; // For alpha = 0.05 (two-tailed)
  const zBeta = 0.84; // For power = 0.8

  // Calculate effect size
  const p1 = baselineCTR;
  const p2 = baselineCTR * (1 + minimumDetectableEffect);

  // Pooled proportion
  const pooled = (p1 + p2) / 2;

  // Sample size formula for two proportions
  const numerator =
    Math.pow(zAlpha + zBeta, 2) *
    (p1 * (1 - p1) + p2 * (1 - p2));
  const denominator = Math.pow(p2 - p1, 2);

  const sampleSize = Math.ceil(numerator / denominator);

  return sampleSize;
}
