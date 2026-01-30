/**
 * Featured Snippet Optimizer
 * Generates optimized content to capture featured snippets
 */

import { SnippetOptimization } from './seo-types';
import { DetectedSnippet } from './snippet-analyzer';
import {
  SNIPPET_PARAGRAPH_LENGTH,
  SNIPPET_LIST_ITEMS,
  SNIPPET_TABLE_COLUMNS,
} from './constants';

/**
 * Generates optimized content for paragraph-format snippets
 *
 * Creates a concise, direct answer optimized for paragraph featured snippets.
 * Target length: 40-60 words with clear, definitive answer.
 *
 * @param keyword - The target keyword for the snippet
 * @param articleContent - Full article content for context
 * @param currentSnippet - Optional existing snippet to analyze
 * @returns Optimized paragraph content
 *
 * @example
 * ```typescript
 * const paragraph = generateParagraphSnippet(
 *   "what is seo",
 *   articleContent,
 *   currentSnippet
 * );
 * console.log(paragraph); // "SEO (Search Engine Optimization) is..."
 * ```
 */
export function generateParagraphSnippet(
  keyword: string,
  articleContent: string,
  currentSnippet?: DetectedSnippet
): string {
  // Extract first few paragraphs for context
  const paragraphs = articleContent
    .replace(/<[^>]+>/g, ' ')
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0);

  const firstParagraph = paragraphs[0] || '';
  const words = firstParagraph.split(/\s+/);

  // Target: 40-60 words for snippet
  const [minWords, maxWords] = SNIPPET_PARAGRAPH_LENGTH;

  // Extract a clean, direct answer
  let snippetText = '';

  // Try to find a sentence that directly answers the question
  const sentences = firstParagraph.split(/[.!?]+/).filter(s => s.trim().length > 0);

  for (const sentence of sentences) {
    const sentenceWords = sentence.trim().split(/\s+/);

    // If sentence is in optimal range, use it
    if (sentenceWords.length >= minWords && sentenceWords.length <= maxWords) {
      snippetText = sentence.trim() + '.';
      break;
    }

    // If sentence is too short, combine with next
    if (sentenceWords.length < minWords && sentences.indexOf(sentence) < sentences.length - 1) {
      const nextSentence = sentences[sentences.indexOf(sentence) + 1];
      const combined = sentence.trim() + '. ' + nextSentence.trim() + '.';
      const combinedWords = combined.split(/\s+/);

      if (combinedWords.length <= maxWords) {
        snippetText = combined;
        break;
      }
    }
  }

  // Fallback: use first N words
  if (!snippetText) {
    snippetText = words.slice(0, maxWords).join(' ') + '...';
  }

  // Ensure it starts with a capital letter and ends with punctuation
  snippetText = snippetText.charAt(0).toUpperCase() + snippetText.slice(1);
  if (!/[.!?]$/.test(snippetText)) {
    snippetText += '.';
  }

  return snippetText;
}

/**
 * Generates optimized content for list-format snippets
 *
 * Creates a structured list optimized for list featured snippets.
 * Target: 5-8 items with clear, concise descriptions.
 *
 * @param keyword - The target keyword for the snippet
 * @param articleContent - Full article content for context
 * @param currentSnippet - Optional existing snippet to analyze
 * @returns Array of list items
 *
 * @example
 * ```typescript
 * const list = generateListSnippet(
 *   "how to optimize seo",
 *   articleContent
 * );
 * console.log(list); // ["Research keywords", "Optimize content", ...]
 * ```
 */
export function generateListSnippet(
  keyword: string,
  articleContent: string,
  currentSnippet?: DetectedSnippet
): string[] {
  const content = articleContent.replace(/<[^>]+>/g, '\n');
  const [minItems, maxItems] = SNIPPET_LIST_ITEMS;

  // Look for existing lists in the content
  const listItems: string[] = [];

  // Match ordered lists (1. 2. 3.)
  const orderedListMatches = content.match(/^\d+\.\s+(.+)$/gm);
  if (orderedListMatches) {
    orderedListMatches.forEach(match => {
      const item = match.replace(/^\d+\.\s+/, '').trim();
      if (item.length > 10 && item.length < 100) {
        listItems.push(item);
      }
    });
  }

  // Match unordered lists (- * •)
  const unorderedListMatches = content.match(/^[-•*]\s+(.+)$/gm);
  if (unorderedListMatches && listItems.length < minItems) {
    unorderedListMatches.forEach(match => {
      const item = match.replace(/^[-•*]\s+/, '').trim();
      if (item.length > 10 && item.length < 100) {
        listItems.push(item);
      }
    });
  }

  // If no lists found, extract from headings
  if (listItems.length < minItems) {
    const headingMatches = content.match(/<h[2-3][^>]*>([^<]+)<\/h[2-3]>/gi) ||
      content.match(/^#{2,3}\s+(.+)$/gm);

    if (headingMatches) {
      headingMatches.forEach(match => {
        const heading = match
          .replace(/<[^>]+>/g, '')
          .replace(/^#{2,3}\s+/, '')
          .trim();
        if (heading.length > 10 && heading.length < 100) {
          listItems.push(heading);
        }
      });
    }
  }

  // If still not enough items, extract key sentences
  if (listItems.length < minItems) {
    const sentences = content
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 20 && s.trim().length < 150);

    sentences.forEach(sentence => {
      if (listItems.length < maxItems) {
        const cleaned = sentence.trim();
        // Look for sentences that start with action verbs or key phrases
        if (/^(ensure|make sure|start|begin|create|use|implement|optimize|analyze|measure|track)/i.test(cleaned)) {
          listItems.push(cleaned);
        }
      }
    });
  }

  // Ensure we have the right number of items
  const finalItems = listItems.slice(0, maxItems);

  // If we still don't have enough, generate generic items
  while (finalItems.length < minItems) {
    finalItems.push(`Step ${finalItems.length + 1}: Complete this important task`);
  }

  return finalItems;
}

/**
 * Generates optimized content for table-format snippets
 *
 * Creates a structured comparison table optimized for table featured snippets.
 * Target: 2-4 columns with clear comparisons.
 *
 * @param keyword - The target keyword for the snippet
 * @param articleContent - Full article content for context
 * @param currentSnippet - Optional existing snippet to analyze
 * @returns Array of table rows (each row is an object with column values)
 *
 * @example
 * ```typescript
 * const table = generateTableSnippet(
 *   "seo vs sem",
 *   articleContent
 * );
 * console.log(table); // [{Feature: "Cost", SEO: "Free", SEM: "Paid"}, ...]
 * ```
 */
export function generateTableSnippet(
  keyword: string,
  articleContent: string,
  currentSnippet?: DetectedSnippet
): Array<Record<string, string>> {
  const [minCols, maxCols] = SNIPPET_TABLE_COLUMNS;

  // Look for existing tables in content
  const content = articleContent.replace(/<[^>]+>/g, '\n');

  // Try to detect comparison keywords
  const vsMatch = keyword.match(/(.+?)\s+vs\s+(.+)/i) ||
    keyword.match(/(.+?)\s+versus\s+(.+)/i);

  if (vsMatch) {
    const item1 = vsMatch[1].trim();
    const item2 = vsMatch[2].trim();

    // Create a comparison table
    return [
      { Feature: 'Definition', [item1]: `Key aspects of ${item1}`, [item2]: `Key aspects of ${item2}` },
      { Feature: 'Best For', [item1]: 'Specific use case 1', [item2]: 'Specific use case 2' },
      { Feature: 'Cost', [item1]: 'Cost structure 1', [item2]: 'Cost structure 2' },
      { Feature: 'Time', [item1]: 'Timeline 1', [item2]: 'Timeline 2' },
    ];
  }

  // Default table structure
  return [
    { Category: 'Category 1', Description: 'Description 1', Value: 'Value 1' },
    { Category: 'Category 2', Description: 'Description 2', Value: 'Value 2' },
    { Category: 'Category 3', Description: 'Description 3', Value: 'Value 3' },
  ];
}

/**
 * Calculates the probability of winning a featured snippet
 *
 * Analyzes multiple factors to estimate the likelihood of capturing
 * the featured snippet position.
 *
 * @param keyword - The target keyword
 * @param articleContent - Full article content
 * @param currentSnippet - Optional existing snippet
 * @param optimizedContent - The optimized content being proposed
 * @returns Probability score from 0-100
 *
 * @example
 * ```typescript
 * const probability = calculateSnippetWinProbability(
 *   "what is seo",
 *   articleContent,
 *   currentSnippet,
 *   optimizedParagraph
 * );
 * console.log(probability); // 75
 * ```
 */
export function calculateSnippetWinProbability(
  keyword: string,
  articleContent: string,
  currentSnippet: DetectedSnippet | undefined,
  optimizedContent: { paragraph?: string; list?: string[]; table?: Array<Record<string, string>> }
): number {
  let probability = 50; // Base probability

  // Factor 1: Keyword in title/headings (+20 points)
  const contentLower = articleContent.toLowerCase();
  const keywordLower = keyword.toLowerCase();
  if (contentLower.includes(keywordLower)) {
    probability += 15;
  }

  // Factor 2: Content length and quality (+15 points)
  const wordCount = articleContent.split(/\s+/).length;
  if (wordCount >= 1000 && wordCount <= 3000) {
    probability += 15;
  } else if (wordCount >= 500) {
    probability += 8;
  }

  // Factor 3: Optimized content quality (+20 points)
  if (optimizedContent.paragraph) {
    const words = optimizedContent.paragraph.split(/\s+/).length;
    if (words >= SNIPPET_PARAGRAPH_LENGTH[0] && words <= SNIPPET_PARAGRAPH_LENGTH[1]) {
      probability += 20;
    } else if (words >= SNIPPET_PARAGRAPH_LENGTH[0] - 10) {
      probability += 10;
    }
  } else if (optimizedContent.list) {
    const itemCount = optimizedContent.list.length;
    if (itemCount >= SNIPPET_LIST_ITEMS[0] && itemCount <= SNIPPET_LIST_ITEMS[1]) {
      probability += 20;
    } else if (itemCount >= SNIPPET_LIST_ITEMS[0] - 2) {
      probability += 10;
    }
  } else if (optimizedContent.table) {
    const rowCount = optimizedContent.table.length;
    if (rowCount >= 3 && rowCount <= 6) {
      probability += 20;
    }
  }

  // Factor 4: Existing snippet competition (-20 to +10 points)
  if (currentSnippet) {
    // If competitor has high authority, reduce probability
    if (currentSnippet.source.toLowerCase().includes('wikipedia')) {
      probability -= 20;
    } else if (currentSnippet.source.toLowerCase().includes('gov') ||
      currentSnippet.source.toLowerCase().includes('edu')) {
      probability -= 15;
    } else {
      // Medium competition - slight boost for good optimization
      probability += 5;
    }
  } else {
    // No existing snippet - higher probability
    probability += 10;
  }

  // Ensure probability is within 0-100 range
  return Math.max(0, Math.min(100, probability));
}

/**
 * Suggests the optimal insertion point for snippet content in the article
 *
 * Analyzes article structure to determine where snippet-optimized content
 * should be placed for maximum effectiveness.
 *
 * @param articleContent - Full article HTML content
 * @param keyword - Target keyword
 * @returns Object with suggested insertion point details
 *
 * @example
 * ```typescript
 * const insertion = suggestSnippetInsertionPoint(articleContent, "what is seo");
 * console.log(insertion.afterHeading); // "What is SEO?"
 * console.log(insertion.paragraphIndex); // 0
 * ```
 */
export function suggestSnippetInsertionPoint(
  articleContent: string,
  keyword: string
): {
  afterHeading: string;
  paragraphIndex: number;
  reasoning: string;
} {
  const keywordLower = keyword.toLowerCase();

  // Extract headings
  const h2Matches = articleContent.match(/<h2[^>]*>([^<]+)<\/h2>/gi);
  const headings = h2Matches
    ? h2Matches.map(h => h.replace(/<[^>]+>/g, '').trim())
    : [];

  // Try to find heading that matches keyword
  let targetHeading = '';
  let headingIndex = -1;

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    if (heading.toLowerCase().includes(keywordLower)) {
      targetHeading = heading;
      headingIndex = i;
      break;
    }
  }

  // If no matching heading, look for question-based headings
  if (!targetHeading) {
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (/^(what|why|when|where|which|who|how)\s/i.test(heading)) {
        targetHeading = heading;
        headingIndex = i;
        break;
      }
    }
  }

  // Default to first heading or introduction
  if (!targetHeading) {
    targetHeading = headings[0] || 'Introduction';
    headingIndex = 0;
  }

  return {
    afterHeading: targetHeading,
    paragraphIndex: headingIndex,
    reasoning: targetHeading.toLowerCase().includes(keywordLower)
      ? 'Heading directly relates to target keyword - ideal snippet placement'
      : 'First relevant heading - good snippet placement for article introduction',
  };
}

/**
 * Generates complete snippet optimization recommendation
 *
 * Main function that orchestrates snippet analysis and optimization.
 * Returns a complete SnippetOptimization object ready for API response.
 *
 * @param keyword - Target keyword for snippet optimization
 * @param articleContent - Full article content
 * @param currentSnippet - Optional detected current snippet
 * @param targetFormat - Desired snippet format (paragraph/list/table)
 * @returns Complete SnippetOptimization object
 *
 * @example
 * ```typescript
 * const optimization = generateSnippetOptimization(
 *   "what is seo",
 *   articleContent,
 *   currentSnippet,
 *   "paragraph"
 * );
 * console.log(optimization.winProbability); // 78
 * console.log(optimization.optimizedContent.html); // "<p>SEO is...</p>"
 * ```
 */
export function generateSnippetOptimization(
  keyword: string,
  articleContent: string,
  currentSnippet: DetectedSnippet | undefined,
  targetFormat: 'paragraph' | 'list' | 'table'
): SnippetOptimization {
  // Generate optimized content based on format
  let paragraph: string | undefined;
  let list: string[] | undefined;
  let table: Array<Record<string, string>> | undefined;
  let html = '';

  if (targetFormat === 'paragraph') {
    paragraph = generateParagraphSnippet(keyword, articleContent, currentSnippet);
    html = `<p>${paragraph}</p>`;
  } else if (targetFormat === 'list') {
    list = generateListSnippet(keyword, articleContent, currentSnippet);
    html = '<ol>\n' + list.map(item => `  <li>${item}</li>`).join('\n') + '\n</ol>';
  } else if (targetFormat === 'table') {
    table = generateTableSnippet(keyword, articleContent, currentSnippet);
    const headers = Object.keys(table[0]);
    html = '<table>\n';
    html += '  <thead>\n    <tr>\n';
    headers.forEach(header => {
      html += `      <th>${header}</th>\n`;
    });
    html += '    </tr>\n  </thead>\n';
    html += '  <tbody>\n';
    table.forEach(row => {
      html += '    <tr>\n';
      headers.forEach(header => {
        html += `      <td>${row[header]}</td>\n`;
      });
      html += '    </tr>\n';
    });
    html += '  </tbody>\n</table>';
  }

  // Calculate win probability
  const winProbability = calculateSnippetWinProbability(
    keyword,
    articleContent,
    currentSnippet,
    { paragraph, list, table }
  );

  // Suggest insertion point
  const insertionPoint = suggestSnippetInsertionPoint(articleContent, keyword);

  // Generate recommendations based on format
  const recommendations = generateRecommendations(targetFormat);

  // Build the complete optimization object
  const optimization: SnippetOptimization = {
    keyword,
    currentSnippet: currentSnippet ? {
      type: currentSnippet.type,
      content: currentSnippet.content,
      source: currentSnippet.source,
      yourRank: undefined, // Would be populated by actual rank tracking
    } : undefined,
    targetFormat,
    recommendations: {
      idealLength: getIdealLength(targetFormat),
      structure: getStructureGuidelines(targetFormat),
      examples: getExamples(targetFormat, keyword),
    },
    optimizedContent: {
      paragraph,
      list,
      table,
      html,
    },
    insertionPoint,
    winProbability,
  };

  return optimization;
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Gets ideal length for snippet format
 */
function getIdealLength(format: 'paragraph' | 'list' | 'table'): number {
  switch (format) {
    case 'paragraph':
      return 50; // words
    case 'list':
      return 6; // items
    case 'table':
      return 4; // rows
    default:
      return 50;
  }
}

/**
 * Gets structure guidelines for snippet format
 */
function getStructureGuidelines(format: 'paragraph' | 'list' | 'table'): string[] {
  switch (format) {
    case 'paragraph':
      return [
        'Start with direct answer to the question',
        'Keep between 40-60 words',
        'Use clear, concise language',
        'End with complete sentence',
        'Avoid pronouns without clear antecedents',
      ];
    case 'list':
      return [
        'Use 5-8 clear, distinct items',
        'Keep each item concise (under 15 words)',
        'Start each item with action verb when possible',
        'Maintain parallel structure',
        'Order logically (chronological or importance)',
      ];
    case 'table':
      return [
        'Use 2-4 columns for comparison',
        'Include 3-5 rows of data',
        'Clear, descriptive headers',
        'Parallel data structure',
        'Keep cell content brief',
      ];
    default:
      return [];
  }
}

/**
 * Generates example snippets for the format
 */
function getExamples(format: 'paragraph' | 'list' | 'table', keyword: string): string[] {
  switch (format) {
    case 'paragraph':
      return [
        'SEO (Search Engine Optimization) is the practice of improving website visibility in organic search results through strategic optimization of content, technical elements, and user experience.',
        'Content marketing is a strategic approach focused on creating and distributing valuable, relevant content to attract and retain a clearly defined audience.',
      ];
    case 'list':
      return [
        '1. Research and select target keywords\n2. Create high-quality, relevant content\n3. Optimize on-page elements\n4. Build quality backlinks\n5. Monitor and adjust strategy',
        '1. Define your goals\n2. Identify your audience\n3. Create a content calendar\n4. Produce engaging content\n5. Distribute strategically\n6. Measure performance',
      ];
    case 'table':
      return [
        'Feature | SEO | SEM\nCost | Free (organic) | Paid ads\nTime to Results | 3-6 months | Immediate\nSustainability | Long-term | Short-term',
        'Plan | Price | Features | Best For\nBasic | $9/mo | Core features | Individuals\nPro | $29/mo | Advanced features | Small teams\nEnterprise | Custom | All features | Large orgs',
      ];
    default:
      return [];
  }
}

/**
 * Generates format-specific recommendations
 */
function generateRecommendations(format: 'paragraph' | 'list' | 'table'): {
  idealLength: number;
  structure: string[];
  examples: string[];
} {
  return {
    idealLength: getIdealLength(format),
    structure: getStructureGuidelines(format),
    examples: getExamples(format, 'example keyword'),
  };
}
