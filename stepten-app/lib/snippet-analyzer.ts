/**
 * Featured Snippet Analyzer
 * Detects and analyzes current featured snippets for target keywords
 */

/**
 * Represents a detected featured snippet from search results
 */
export interface DetectedSnippet {
  type: 'paragraph' | 'list' | 'table' | 'video';
  content: string;
  source: string;
  url: string;
  position: number;
}

/**
 * Result of snippet detection analysis
 */
export interface SnippetDetectionResult {
  hasSnippet: boolean;
  snippet?: DetectedSnippet;
  competitorRank?: number;
  opportunity: 'high' | 'medium' | 'low';
  reasoning: string;
}

/**
 * Detects if there is a featured snippet for the given keyword
 *
 * This function analyzes search results to identify if a featured snippet exists
 * and determines the opportunity level for capturing it.
 *
 * @param keyword - The target keyword to check for featured snippets
 * @param articleContent - Optional current article content to check if you already own the snippet
 * @returns Promise<SnippetDetectionResult> Detection result with snippet details and opportunity level
 *
 * @example
 * ```typescript
 * const result = await detectFeaturedSnippet("what is seo");
 * if (result.hasSnippet) {
 *   console.log(`Snippet type: ${result.snippet.type}`);
 *   console.log(`Current owner: ${result.snippet.source}`);
 * }
 * ```
 */
export async function detectFeaturedSnippet(
  keyword: string,
  articleContent?: string
): Promise<SnippetDetectionResult> {
  // In a production environment, this would make actual SERP API calls
  // For now, we'll simulate snippet detection based on keyword patterns

  const keywordLower = keyword.toLowerCase();

  // Determine snippet type based on keyword intent
  let snippetType: 'paragraph' | 'list' | 'table' | 'video' = 'paragraph';
  let hasSnippet = false;
  let opportunity: 'high' | 'medium' | 'low' = 'medium';
  let reasoning = '';

  // Question-based keywords often have paragraph snippets
  if (keywordLower.match(/^(what|why|when|where|which|who|whose)\s/)) {
    snippetType = 'paragraph';
    hasSnippet = true;
    opportunity = 'high';
    reasoning = 'Question-based keyword typically triggers paragraph snippets. High opportunity to capture with direct answer.';
  }
  // How-to and step keywords trigger list snippets
  else if (keywordLower.match(/^how\s(to|do|can|does|did|will)/i) || keywordLower.includes('step')) {
    snippetType = 'list';
    hasSnippet = true;
    opportunity = 'high';
    reasoning = 'How-to or procedural keyword typically triggers list snippets. High opportunity with structured steps.';
  }
  // Best/top keywords trigger list snippets
  else if (keywordLower.match(/^(best|top|greatest|worst)\s/)) {
    snippetType = 'list';
    hasSnippet = true;
    opportunity = 'medium';
    reasoning = 'Comparison keyword typically triggers list snippets. Medium opportunity with comprehensive list.';
  }
  // Versus/comparison keywords trigger table snippets
  else if (keywordLower.includes('vs') || keywordLower.includes('versus') || keywordLower.includes('compare')) {
    snippetType = 'table';
    hasSnippet = true;
    opportunity = 'high';
    reasoning = 'Comparison keyword typically triggers table snippets. High opportunity with structured comparison.';
  }
  // Definition keywords trigger paragraph snippets
  else if (keywordLower.match(/^(define|meaning|definition)\s/)) {
    snippetType = 'paragraph';
    hasSnippet = true;
    opportunity = 'high';
    reasoning = 'Definition keyword typically triggers paragraph snippets. High opportunity with concise definition.';
  }
  // Tutorial or guide keywords
  else if (keywordLower.includes('tutorial') || keywordLower.includes('guide')) {
    snippetType = 'list';
    hasSnippet = true;
    opportunity = 'medium';
    reasoning = 'Tutorial/guide keyword may trigger list snippets. Medium opportunity with clear structure.';
  }
  // Generic informational keywords
  else {
    hasSnippet = false;
    opportunity = 'low';
    reasoning = 'Generic keyword less likely to have featured snippet. Low opportunity but worth optimizing.';
  }

  // If no snippet detected, return early
  if (!hasSnippet) {
    return {
      hasSnippet: false,
      opportunity,
      reasoning,
    };
  }

  // Create simulated snippet data
  const snippet: DetectedSnippet = {
    type: snippetType,
    content: generateSimulatedSnippetContent(keyword, snippetType),
    source: determineSnippetSource(keyword),
    url: `https://example.com/${keyword.replace(/\s+/g, '-')}`,
    position: 0,
  };

  // Check if article content already matches snippet patterns
  let competitorRank: number | undefined = undefined;
  if (articleContent) {
    const hasOptimizedFormat = checkIfContentHasSnippetFormat(articleContent, snippetType);
    if (hasOptimizedFormat) {
      competitorRank = 1; // Assume you're ranking if content is well-optimized
      opportunity = 'medium'; // Lower opportunity if you might already have it
      reasoning = `${reasoning} Your content appears snippet-optimized.`;
    } else {
      competitorRank = undefined;
      reasoning = `${reasoning} Your content needs snippet optimization.`;
    }
  }

  return {
    hasSnippet: true,
    snippet,
    competitorRank,
    opportunity,
    reasoning,
  };
}

/**
 * Analyzes the format and structure of a detected snippet
 *
 * Provides detailed breakdown of snippet characteristics to inform
 * optimization strategy.
 *
 * @param snippet - The detected snippet to analyze
 * @returns Object with format analysis details
 *
 * @example
 * ```typescript
 * const format = analyzeSnippetFormat(detectedSnippet);
 * console.log(`Word count: ${format.wordCount}`);
 * console.log(`Structure: ${format.structure}`);
 * ```
 */
export function analyzeSnippetFormat(snippet: DetectedSnippet): {
  wordCount: number;
  structure: string;
  characterCount: number;
  hasNumbers: boolean;
  hasBullets: boolean;
  hasTable: boolean;
} {
  const content = snippet.content;
  const words = content.split(/\s+/).filter(w => w.length > 0);

  return {
    wordCount: words.length,
    characterCount: content.length,
    structure: snippet.type,
    hasNumbers: /\d+\./.test(content),
    hasBullets: /•|\*|-/.test(content),
    hasTable: snippet.type === 'table',
  };
}

/**
 * Extracts the actual content from a snippet, removing formatting
 *
 * Cleans snippet content to get pure text for analysis.
 *
 * @param snippet - The snippet to extract content from
 * @returns Clean text content of the snippet
 *
 * @example
 * ```typescript
 * const cleanContent = extractSnippetContent(snippet);
 * console.log(cleanContent); // "SEO is the practice of..."
 * ```
 */
export function extractSnippetContent(snippet: DetectedSnippet): string {
  let content = snippet.content;

  // Remove HTML tags if present
  content = content.replace(/<[^>]+>/g, '');

  // Remove list markers
  content = content.replace(/^\d+\.\s*/gm, '');
  content = content.replace(/^[•\*-]\s*/gm, '');

  // Remove extra whitespace
  content = content.replace(/\s+/g, ' ').trim();

  return content;
}

/**
 * Determines the source domain of a snippet
 *
 * Extracts and analyzes the source to determine authority and competition level.
 *
 * @param url - The URL of the snippet source
 * @returns Object with source analysis
 *
 * @example
 * ```typescript
 * const source = analyzeSnippetSource("https://wikipedia.org/page");
 * console.log(source.authority); // "high"
 * ```
 */
export function analyzeSnippetSource(url: string): {
  domain: string;
  authority: 'high' | 'medium' | 'low';
  isCompetitor: boolean;
} {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');

    // High authority domains
    const highAuthority = ['wikipedia.org', 'gov', 'edu', 'mozilla.org', 'w3.org'];
    const authority = highAuthority.some(auth => domain.includes(auth))
      ? 'high'
      : domain.includes('.com')
        ? 'medium'
        : 'low';

    // This would check against your own domain in production
    const isCompetitor = !domain.includes('stepten.io');

    return { domain, authority, isCompetitor };
  } catch {
    return { domain: 'unknown', authority: 'low', isCompetitor: true };
  }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Generates simulated snippet content for testing
 */
function generateSimulatedSnippetContent(keyword: string, type: 'paragraph' | 'list' | 'table' | 'video'): string {
  switch (type) {
    case 'paragraph':
      return `${keyword} is a comprehensive topic that involves multiple aspects. It typically includes understanding the fundamentals, applying best practices, and measuring results effectively.`;

    case 'list':
      return `1. Understand the basics of ${keyword}\n2. Research and plan your approach\n3. Implement best practices\n4. Monitor and measure results\n5. Optimize based on data`;

    case 'table':
      return `Feature A | Feature B\nBenefit 1 | Benefit 2\nCost $X | Cost $Y\nUse Case 1 | Use Case 2`;

    case 'video':
      return `Video tutorial: ${keyword} explained in 5 minutes`;

    default:
      return keyword;
  }
}

/**
 * Determines likely snippet source based on keyword
 */
function determineSnippetSource(keyword: string): string {
  const keywordLower = keyword.toLowerCase();

  if (keywordLower.includes('wikipedia') || keywordLower.includes('define')) {
    return 'Wikipedia';
  } else if (keywordLower.includes('tutorial') || keywordLower.includes('how')) {
    return 'TutorialSite';
  } else if (keywordLower.includes('best') || keywordLower.includes('review')) {
    return 'ReviewSite';
  } else {
    return 'CompetitorBlog';
  }
}

/**
 * Checks if content already has snippet-optimized formatting
 */
function checkIfContentHasSnippetFormat(content: string, type: 'paragraph' | 'list' | 'table' | 'video'): boolean {
  const contentLower = content.toLowerCase();

  switch (type) {
    case 'paragraph':
      // Check for direct answer patterns in first 200 characters
      const first200 = content.substring(0, 200);
      return /^[A-Z][^.!?]{30,60}[.!?]/.test(first200);

    case 'list':
      // Check for ordered or unordered lists
      return /(<ol>|<ul>|^\d+\.|^[-•*])/.test(content);

    case 'table':
      // Check for table tags or markdown tables
      return /<table>|<th>|\|.*\|/.test(content);

    case 'video':
      // Check for video embeds
      return /<video>|<iframe.*youtube|<iframe.*vimeo/.test(contentLower);

    default:
      return false;
  }
}
