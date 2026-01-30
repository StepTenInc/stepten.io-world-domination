/**
 * Entity Extractor
 * Extracts and analyzes entities from article text using AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Entity } from "./seo-types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

/**
 * Entity extraction result from AI analysis
 */
interface EntityExtractionResult {
  entities: Array<{
    name: string;
    type: "Person" | "Organization" | "Concept" | "Product" | "Location" | "Event";
    mentions: number;
    importance: number;
  }>;
}

/**
 * Extracts entities from text using Claude AI
 * Identifies named entities and their types, mentions, and importance scores
 *
 * @param text - The article text to analyze
 * @param keyword - The main keyword/topic for context
 * @returns Array of extracted entities with metadata
 *
 * @example
 * const entities = await extractEntities(article, "React hooks");
 * // Returns: [{ name: "React", type: "Product", mentions: 12, ... }]
 */
export async function extractEntities(
  text: string,
  keyword: string
): Promise<Entity[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert NLP entity extractor. Analyze this article and extract all important entities.

## ARTICLE CONTEXT:
- Main Keyword: ${keyword}
- Word Count: ${text.split(/\s+/).length}

## ARTICLE TEXT:
${text.substring(0, 8000)}

## YOUR TASK:
Extract ALL important entities from the article and classify them:

### Entity Types:
1. **Person** - Individual people, authors, experts, historical figures
2. **Organization** - Companies, institutions, open-source projects, frameworks
3. **Concept** - Ideas, methodologies, principles, theories, techniques
4. **Product** - Software, tools, libraries, services, platforms
5. **Location** - Places, countries, cities, regions
6. **Event** - Conferences, releases, historical events, milestones

### Importance Scoring (1-100):
- 90-100: Central to the article's topic (e.g., main product/framework discussed)
- 70-89: Highly relevant, frequently mentioned
- 50-69: Supporting entities, moderately important
- 30-49: Context entities, occasionally mentioned
- 1-29: Minor mentions, tangential references

### Requirements:
1. Count exact mentions (including variations like "React" and "React.js")
2. Only include entities mentioned at least once
3. Assign realistic importance scores based on relevance to "${keyword}"
4. Extract 10-30 entities (focus on quality over quantity)
5. Include both explicit mentions and implied entities

## OUTPUT FORMAT (JSON only, no markdown):
{
  "entities": [
    {
      "name": "Entity Name",
      "type": "Person|Organization|Concept|Product|Location|Event",
      "mentions": 5,
      "importance": 85
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text_response = response.text();

    // Clean and parse JSON
    const cleanedText = text_response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed: EntityExtractionResult = JSON.parse(cleanedText);

    // Transform to Entity type with coverage analysis
    const entities: Entity[] = parsed.entities.map((entity) => ({
      name: entity.name,
      type: entity.type,
      mentions: entity.mentions,
      coverage: determineCoverageLevel(entity.mentions, text),
      importance: entity.importance,
      competitorMentions: 0, // Will be filled by topic coverage analyzer
    }));

    return entities;
  } catch (error) {
    console.error("Entity extraction error:", error);
    return [];
  }
}

/**
 * Analyzes competitor articles to extract their entities
 * Used to identify entity gaps in your content
 *
 * @param competitorTexts - Array of competitor article texts
 * @param keyword - Main keyword for context
 * @returns Map of entity names to their competitor mention counts
 *
 * @example
 * const competitorEntities = await extractCompetitorEntities(competitors, "React");
 * // Returns: Map { "Redux" => 15, "useState" => 23 }
 */
export async function extractCompetitorEntities(
  competitorTexts: string[],
  keyword: string
): Promise<Map<string, number>> {
  const entityMap = new Map<string, number>();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Combine competitor texts (limit to reasonable size)
    const combinedText = competitorTexts
      .map((text) => text.substring(0, 3000))
      .join("\n\n---\n\n");

    const prompt = `Analyze these competitor articles and extract the most frequently mentioned entities related to "${keyword}".

## COMPETITOR ARTICLES:
${combinedText.substring(0, 12000)}

## YOUR TASK:
1. Extract entities frequently mentioned across these competitor articles
2. Count total mentions across all articles
3. Focus on entities directly related to "${keyword}"
4. Return 15-30 top entities by frequency

## OUTPUT FORMAT (JSON only, no markdown):
{
  "entities": [
    {
      "name": "Entity Name",
      "totalMentions": 15
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

    const parsed: { entities: Array<{ name: string; totalMentions: number }> } =
      JSON.parse(cleanedText);

    // Build entity map
    parsed.entities.forEach((entity) => {
      entityMap.set(entity.name, entity.totalMentions);
    });

    return entityMap;
  } catch (error) {
    console.error("Competitor entity extraction error:", error);
    return entityMap;
  }
}

/**
 * Determines the coverage level of an entity based on mentions and context
 *
 * @param mentions - Number of times entity is mentioned
 * @param text - Full article text for context analysis
 * @returns Coverage level classification
 *
 * Coverage Levels:
 * - "missing": Entity not mentioned at all
 * - "mentioned": Entity mentioned but not explained (1-2 mentions)
 * - "explained": Entity mentioned and briefly explained (3-5 mentions)
 * - "detailed": Entity thoroughly covered with detail (6+ mentions)
 */
export function determineCoverageLevel(
  mentions: number,
  text: string
): "missing" | "mentioned" | "explained" | "detailed" {
  if (mentions === 0) {
    return "missing";
  } else if (mentions <= 2) {
    return "mentioned";
  } else if (mentions <= 5) {
    return "explained";
  } else {
    return "detailed";
  }
}

/**
 * Suggests natural placements for missing or under-covered entities
 *
 * @param entity - The entity to place
 * @param text - Article text with HTML headings
 * @param keyword - Main article keyword
 * @returns Suggested section and context for placement
 *
 * @example
 * const placement = await suggestEntityPlacement(
 *   { name: "Redux", type: "Product", ... },
 *   articleHtml,
 *   "React state management"
 * );
 * // Returns: { section: "State Management Tools", context: "When discussing..." }
 */
export async function suggestEntityPlacement(
  entity: Entity,
  text: string,
  keyword: string
): Promise<{ section: string; context: string } | undefined> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Extract headings from text
    const headings = extractHeadings(text);

    const prompt = `Suggest the best placement for this entity in the article.

## ARTICLE INFO:
- Main Keyword: ${keyword}
- Entity: ${entity.name} (${entity.type})
- Current Coverage: ${entity.coverage}
- Importance: ${entity.importance}/100

## ARTICLE HEADINGS:
${headings.map((h, i) => `${i + 1}. ${h}`).join("\n")}

## ARTICLE TEXT (first 3000 chars):
${text.substring(0, 3000)}

## YOUR TASK:
1. Identify the most natural section to mention "${entity.name}"
2. Provide context for how to introduce it naturally
3. Ensure it fits the article's flow and topic

## OUTPUT FORMAT (JSON only, no markdown):
{
  "section": "Exact heading name from the list above",
  "context": "Brief explanation of how to naturally introduce ${entity.name} in this section"
}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text_response = response.text();

    const cleanedText = text_response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed: { section: string; context: string } = JSON.parse(cleanedText);

    return parsed;
  } catch (error) {
    console.error("Entity placement suggestion error:", error);
    return undefined;
  }
}

/**
 * Extracts heading text from HTML content
 * Used for understanding article structure
 *
 * @param html - HTML content with heading tags
 * @returns Array of heading texts (h1, h2, h3)
 */
export function extractHeadings(html: string): string[] {
  const headingRegex = /<h[123][^>]*>([^<]+)<\/h[123]>/gi;
  const matches = [...html.matchAll(headingRegex)];
  return matches.map((m) => m[1].trim());
}

/**
 * Calculates entity mention frequency as percentage of total words
 *
 * @param entityName - Name of the entity to count
 * @param text - Article text to analyze
 * @returns Frequency as percentage (0-100)
 *
 * @example
 * const freq = calculateEntityFrequency("React", articleText);
 * // Returns: 2.4 (meaning 2.4% of words are "React")
 */
export function calculateEntityFrequency(
  entityName: string,
  text: string
): number {
  const words = text.toLowerCase().split(/\s+/).filter((w) => w.length > 0);
  const entityWords = entityName.toLowerCase().split(/\s+/);

  let count = 0;
  for (let i = 0; i <= words.length - entityWords.length; i++) {
    const phrase = words.slice(i, i + entityWords.length).join(" ");
    if (phrase === entityWords.join(" ")) {
      count++;
    }
  }

  return words.length > 0 ? (count / words.length) * 100 : 0;
}

/**
 * Merges your article's entities with competitor entities
 * Identifies gaps where competitors mention entities you don't
 *
 * @param yourEntities - Entities extracted from your article
 * @param competitorEntityMap - Map of competitor entity mentions
 * @returns Enhanced entities with competitor mention data
 *
 * @example
 * const merged = mergeEntityData(yourEntities, competitorMap);
 * // Entities now include competitorMentions field
 */
export function mergeEntityData(
  yourEntities: Entity[],
  competitorEntityMap: Map<string, number>
): Entity[] {
  const entityMap = new Map<string, Entity>();

  // Add your entities
  yourEntities.forEach((entity) => {
    entityMap.set(entity.name.toLowerCase(), {
      ...entity,
      competitorMentions: competitorEntityMap.get(entity.name.toLowerCase()) || 0,
    });
  });

  // Add competitor entities you're missing
  competitorEntityMap.forEach((mentions, name) => {
    const normalizedName = name.toLowerCase();
    if (!entityMap.has(normalizedName) && mentions >= 5) {
      // Only add if mentioned 5+ times
      entityMap.set(normalizedName, {
        name: name,
        type: "Concept", // Default type, will be refined by topic analyzer
        mentions: 0,
        coverage: "missing",
        importance: Math.min(mentions * 3, 100), // Estimate importance from frequency
        competitorMentions: mentions,
      });
    }
  });

  return Array.from(entityMap.values());
}
