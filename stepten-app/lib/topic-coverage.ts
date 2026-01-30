/**
 * Topic Coverage Analyzer
 * Analyzes semantic completeness and topic coverage against competitors
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { TopicCoverage, Entity } from "./seo-types";
import {
  extractEntities,
  extractCompetitorEntities,
  mergeEntityData,
  suggestEntityPlacement,
} from "./entity-extractor";
import {
  MIN_ENTITY_MENTIONS,
  TARGET_TOPIC_COMPLETENESS,
  MAX_COMPETITORS_TO_ANALYZE,
} from "./constants";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

/**
 * Semantic keyword data from analysis
 */
interface SemanticKeywordData {
  keyword: string;
  relevance: number;
  present: boolean;
  frequency: number;
  suggestedFrequency: number;
}

/**
 * Subtopic coverage data
 */
interface SubtopicData {
  topic: string;
  covered: boolean;
  depth: "shallow" | "medium" | "deep";
  competitorCoverage: number;
}

/**
 * Analyzes topic coverage of an article against competitors
 * Main entry point for topic coverage analysis
 *
 * @param articleContent - Your article's HTML content
 * @param keyword - Main keyword/topic
 * @param competitorArticles - Array of competitor article contents (optional)
 * @returns Complete topic coverage analysis
 *
 * @example
 * const coverage = await analyzeTopicCoverage(
 *   myArticle,
 *   "React hooks",
 *   [competitor1, competitor2]
 * );
 * console.log(`Completeness: ${coverage.completeness}%`);
 */
export async function analyzeTopicCoverage(
  articleContent: string,
  keyword: string,
  competitorArticles: string[] = []
): Promise<TopicCoverage> {
  try {
    // Limit competitors to avoid API timeouts
    const limitedCompetitors = competitorArticles.slice(0, MAX_COMPETITORS_TO_ANALYZE);

    // Extract plain text from HTML
    const plainText = stripHtml(articleContent);

    // 1. Extract entities from your article
    const yourEntities = await extractEntities(plainText, keyword);

    // 2. Extract entities from competitor articles
    let competitorEntityMap = new Map<string, number>();
    if (limitedCompetitors.length > 0) {
      const competitorPlainTexts = limitedCompetitors.map(stripHtml);
      competitorEntityMap = await extractCompetitorEntities(competitorPlainTexts, keyword);
    }

    // 3. Merge entity data
    const mergedEntities = mergeEntityData(yourEntities, competitorEntityMap);

    // 4. Analyze required subtopics
    const requiredSubtopics = await analyzeRequiredSubtopics(
      plainText,
      keyword,
      limitedCompetitors.map(stripHtml)
    );

    // 5. Extract semantic keywords
    const semanticKeywords = await extractSemanticKeywords(plainText, keyword, limitedCompetitors);

    // 6. Calculate completeness score
    const completeness = calculateCompletenessScore(
      mergedEntities,
      requiredSubtopics,
      semanticKeywords
    );

    // 7. Calculate competitor average
    const competitorAverage = calculateCompetitorAverage(requiredSubtopics);

    // 8. Add suggested placements for missing entities
    const entitiesWithPlacements = await addSuggestedPlacements(
      mergedEntities,
      articleContent,
      keyword
    );

    return {
      mainTopic: keyword,
      requiredSubtopics,
      semanticKeywords,
      entities: entitiesWithPlacements,
      completeness,
      competitorAverage,
    };
  } catch (error) {
    console.error("Topic coverage analysis error:", error);
    // Return minimal valid response
    return {
      mainTopic: keyword,
      requiredSubtopics: [],
      semanticKeywords: [],
      entities: [],
      completeness: 0,
      competitorAverage: 0,
    };
  }
}

/**
 * Analyzes competitor articles to identify required subtopics
 *
 * @param yourText - Your article's plain text
 * @param keyword - Main keyword
 * @param competitorTexts - Competitor article texts
 * @returns Array of subtopics with coverage analysis
 */
async function analyzeRequiredSubtopics(
  yourText: string,
  keyword: string,
  competitorTexts: string[]
): Promise<SubtopicData[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const competitorSample = competitorTexts
      .map((text, i) => `## Competitor ${i + 1}:\n${text.substring(0, 2000)}`)
      .join("\n\n");

    const prompt = `Analyze these articles about "${keyword}" and identify required subtopics.

## YOUR ARTICLE (first 3000 words):
${yourText.substring(0, 3000)}

## COMPETITOR ARTICLES:
${competitorSample}

## YOUR TASK:
1. Identify 8-15 essential subtopics that should be covered when writing about "${keyword}"
2. For each subtopic, determine:
   - Is it covered in YOUR article?
   - How deeply is it covered? (shallow/medium/deep)
   - What percentage of competitors cover this subtopic?
3. Focus on substantive subtopics, not minor details

### Depth Definitions:
- **shallow**: Briefly mentioned, no explanation (1-2 sentences)
- **medium**: Explained with some detail (1-2 paragraphs)
- **deep**: Thoroughly explained with examples, code, or detailed analysis (3+ paragraphs)

## OUTPUT FORMAT (JSON only, no markdown):
{
  "subtopics": [
    {
      "topic": "Subtopic name",
      "covered": true,
      "depth": "shallow|medium|deep",
      "competitorCoverage": 85
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text_response = response.text();

    const cleanedText = text_response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed: { subtopics: SubtopicData[] } = JSON.parse(cleanedText);

    return parsed.subtopics || [];
  } catch (error) {
    console.error("Subtopic analysis error:", error);
    return [];
  }
}

/**
 * Extracts semantic keywords related to the main topic
 * Identifies LSI keywords and natural language variations
 *
 * @param yourText - Your article's text
 * @param keyword - Main keyword
 * @param competitorArticles - Competitor articles for context
 * @returns Array of semantic keywords with metrics
 */
async function extractSemanticKeywords(
  yourText: string,
  keyword: string,
  competitorArticles: string[]
): Promise<SemanticKeywordData[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const competitorSample =
      competitorArticles.length > 0
        ? competitorArticles
            .slice(0, 3)
            .map((text) => text.substring(0, 1500))
            .join("\n\n")
        : "No competitor data available";

    const prompt = `Extract semantic keywords and LSI (Latent Semantic Indexing) keywords for "${keyword}".

## YOUR ARTICLE:
${yourText.substring(0, 3000)}

## COMPETITOR SAMPLES:
${competitorSample}

## YOUR TASK:
1. Identify 15-25 semantic keywords related to "${keyword}"
2. Include:
   - LSI keywords (terms frequently co-occurring with main keyword)
   - Natural language variations
   - Related technical terms
   - Common questions/phrases
3. For each keyword, determine:
   - Relevance score (1-100)
   - Is it present in YOUR article?
   - Current frequency (count)
   - Suggested frequency based on article length

### Relevance Scoring:
- 90-100: Core semantic keywords, essential to the topic
- 70-89: Highly relevant supporting keywords
- 50-69: Moderately relevant context keywords
- 30-49: Tangentially related keywords

## OUTPUT FORMAT (JSON only, no markdown):
{
  "keywords": [
    {
      "keyword": "semantic keyword phrase",
      "relevance": 85,
      "present": true,
      "frequency": 3,
      "suggestedFrequency": 5
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text_response = response.text();

    const cleanedText = text_response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed: { keywords: SemanticKeywordData[] } = JSON.parse(cleanedText);

    return parsed.keywords || [];
  } catch (error) {
    console.error("Semantic keyword extraction error:", error);
    return [];
  }
}

/**
 * Calculates overall topic completeness score (0-100)
 * Based on entity coverage, subtopic coverage, and semantic keyword usage
 *
 * @param entities - Merged entity data
 * @param subtopics - Required subtopics
 * @param keywords - Semantic keywords
 * @returns Completeness score (0-100)
 */
function calculateCompletenessScore(
  entities: Entity[],
  subtopics: SubtopicData[],
  keywords: SemanticKeywordData[]
): number {
  if (entities.length === 0 && subtopics.length === 0 && keywords.length === 0) {
    return 0;
  }

  // 1. Entity Coverage Score (40% of total)
  const importantEntities = entities.filter((e) => e.importance >= 50);
  const coveredEntities = importantEntities.filter(
    (e) => e.coverage === "explained" || e.coverage === "detailed"
  );
  const entityScore =
    importantEntities.length > 0 ? (coveredEntities.length / importantEntities.length) * 40 : 0;

  // 2. Subtopic Coverage Score (40% of total)
  const coveredSubtopics = subtopics.filter(
    (s) => s.covered && (s.depth === "medium" || s.depth === "deep")
  );
  const subtopicScore = subtopics.length > 0 ? (coveredSubtopics.length / subtopics.length) * 40 : 0;

  // 3. Semantic Keyword Score (20% of total)
  const relevantKeywords = keywords.filter((k) => k.relevance >= 50);
  const presentKeywords = relevantKeywords.filter((k) => k.present && k.frequency >= k.suggestedFrequency * 0.6);
  const keywordScore =
    relevantKeywords.length > 0 ? (presentKeywords.length / relevantKeywords.length) * 20 : 0;

  const totalScore = entityScore + subtopicScore + keywordScore;

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

/**
 * Calculates average completeness of competitor articles
 *
 * @param subtopics - Subtopic data with competitor coverage
 * @returns Average completeness percentage (0-100)
 */
function calculateCompetitorAverage(subtopics: SubtopicData[]): number {
  if (subtopics.length === 0) {
    return 0;
  }

  const totalCoverage = subtopics.reduce((sum, subtopic) => sum + subtopic.competitorCoverage, 0);
  return Math.round(totalCoverage / subtopics.length);
}

/**
 * Adds suggested placement information to missing or under-covered entities
 *
 * @param entities - Entity array
 * @param articleHtml - Article HTML content
 * @param keyword - Main keyword
 * @returns Entities with suggested placements
 */
async function addSuggestedPlacements(
  entities: Entity[],
  articleHtml: string,
  keyword: string
): Promise<Entity[]> {
  const enhancedEntities: Entity[] = [];

  for (const entity of entities) {
    // Only suggest placements for missing or under-covered important entities
    if (
      (entity.coverage === "missing" || entity.coverage === "mentioned") &&
      entity.importance >= 50
    ) {
      const placement = await suggestEntityPlacement(entity, articleHtml, keyword);
      enhancedEntities.push({
        ...entity,
        suggestedPlacement: placement,
      });
    } else {
      enhancedEntities.push(entity);
    }
  }

  return enhancedEntities;
}

/**
 * Identifies missing subtopics that competitors cover
 *
 * @param coverage - Complete topic coverage analysis
 * @returns Array of missing subtopic names
 *
 * @example
 * const missing = identifyMissingSubtopics(coverage);
 * // Returns: ["Error Handling", "Performance Optimization"]
 */
export function identifyMissingSubtopics(coverage: TopicCoverage): string[] {
  return coverage.requiredSubtopics
    .filter((subtopic) => !subtopic.covered && subtopic.competitorCoverage >= 50)
    .map((subtopic) => subtopic.topic);
}

/**
 * Identifies under-utilized semantic keywords
 * Keywords that should appear more frequently
 *
 * @param coverage - Complete topic coverage analysis
 * @returns Array of keyword recommendations
 *
 * @example
 * const keywords = identifyUnderUtilizedKeywords(coverage);
 * // Returns: [{ keyword: "state management", current: 2, suggested: 5 }]
 */
export function identifyUnderUtilizedKeywords(
  coverage: TopicCoverage
): Array<{ keyword: string; current: number; suggested: number }> {
  return coverage.semanticKeywords
    .filter((kw) => kw.present && kw.frequency < kw.suggestedFrequency * 0.6 && kw.relevance >= 60)
    .map((kw) => ({
      keyword: kw.keyword,
      current: kw.frequency,
      suggested: kw.suggestedFrequency,
    }));
}

/**
 * Identifies missing semantic keywords not present in article
 *
 * @param coverage - Complete topic coverage analysis
 * @returns Array of missing keywords sorted by relevance
 *
 * @example
 * const missing = identifyMissingKeywords(coverage);
 * // Returns: ["useEffect", "component lifecycle", "dependency array"]
 */
export function identifyMissingKeywords(coverage: TopicCoverage): string[] {
  return coverage.semanticKeywords
    .filter((kw) => !kw.present && kw.relevance >= 60)
    .sort((a, b) => b.relevance - a.relevance)
    .map((kw) => kw.keyword);
}

/**
 * Calculates coverage gaps compared to competitors
 *
 * @param coverage - Complete topic coverage analysis
 * @returns Gap analysis object
 *
 * @example
 * const gaps = calculateCoverageGaps(coverage);
 * // Returns: { missingEntities: 5, missingSubtopics: 3, scoreGap: -15 }
 */
export function calculateCoverageGaps(coverage: TopicCoverage): {
  missingEntities: number;
  missingSubtopics: number;
  missingKeywords: number;
  scoreGap: number;
} {
  const missingEntities = coverage.entities.filter(
    (e) => e.coverage === "missing" && e.competitorMentions >= MIN_ENTITY_MENTIONS
  ).length;

  const missingSubtopics = coverage.requiredSubtopics.filter(
    (s) => !s.covered && s.competitorCoverage >= 50
  ).length;

  const missingKeywords = coverage.semanticKeywords.filter(
    (k) => !k.present && k.relevance >= 60
  ).length;

  const scoreGap = coverage.completeness - coverage.competitorAverage;

  return {
    missingEntities,
    missingSubtopics,
    missingKeywords,
    scoreGap,
  };
}

/**
 * Generates actionable recommendations for improving topic coverage
 *
 * @param coverage - Complete topic coverage analysis
 * @returns Array of prioritized recommendations
 *
 * @example
 * const recs = generateCoverageRecommendations(coverage);
 * // Returns: ["Add section on Error Handling (80% of competitors cover this)", ...]
 */
export function generateCoverageRecommendations(coverage: TopicCoverage): string[] {
  const recommendations: string[] = [];
  const gaps = calculateCoverageGaps(coverage);

  // Overall completeness
  if (coverage.completeness < TARGET_TOPIC_COMPLETENESS) {
    const gap = TARGET_TOPIC_COMPLETENESS - coverage.completeness;
    recommendations.push(
      `Improve overall topic completeness by ${gap}% to reach target of ${TARGET_TOPIC_COMPLETENESS}%`
    );
  }

  // Missing subtopics
  const missingSubtopics = identifyMissingSubtopics(coverage);
  if (missingSubtopics.length > 0) {
    const topMissing = missingSubtopics.slice(0, 3);
    recommendations.push(
      `Add sections on: ${topMissing.join(", ")} (covered by most competitors)`
    );
  }

  // Shallow coverage
  const shallowTopics = coverage.requiredSubtopics.filter(
    (s) => s.covered && s.depth === "shallow" && s.competitorCoverage >= 60
  );
  if (shallowTopics.length > 0) {
    recommendations.push(
      `Expand coverage of: ${shallowTopics
        .slice(0, 3)
        .map((s) => s.topic)
        .join(", ")}`
    );
  }

  // Missing entities
  const missingEntities = coverage.entities.filter(
    (e) => e.coverage === "missing" && e.importance >= 70
  );
  if (missingEntities.length > 0) {
    const topEntities = missingEntities.slice(0, 3).map((e) => e.name);
    recommendations.push(`Mention important entities: ${topEntities.join(", ")}`);
  }

  // Under-utilized keywords
  const underUtilized = identifyUnderUtilizedKeywords(coverage);
  if (underUtilized.length > 0) {
    const topKeywords = underUtilized.slice(0, 2).map((k) => k.keyword);
    recommendations.push(`Increase usage of semantic keywords: ${topKeywords.join(", ")}`);
  }

  // Missing keywords
  const missingKeywords = identifyMissingKeywords(coverage);
  if (missingKeywords.length > 0) {
    const topKeywords = missingKeywords.slice(0, 3);
    recommendations.push(`Incorporate missing semantic keywords: ${topKeywords.join(", ")}`);
  }

  // Competitor comparison
  if (gaps.scoreGap < -10) {
    recommendations.push(
      `Your article scores ${Math.abs(gaps.scoreGap)}% below competitor average - focus on content gaps`
    );
  } else if (gaps.scoreGap > 10) {
    recommendations.push(
      `Your article scores ${gaps.scoreGap}% above competitor average - maintain quality`
    );
  }

  return recommendations;
}

/**
 * Strips HTML tags from content to get plain text
 *
 * @param html - HTML content
 * @returns Plain text without HTML tags
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
