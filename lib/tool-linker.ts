/**
 * Tool Auto-Linker
 * 
 * Makes the StepTen ecosystem LIVING AND BREATHING.
 * 
 * When tool names appear in content, they auto-link to their hub pages.
 * This creates a web of interconnected content that builds authority.
 */

import { tools } from './tools';

// Build a map of tool names/variants to their slugs
const toolMap = new Map<string, string>();

tools.forEach(tool => {
  // Primary name
  toolMap.set(tool.name.toLowerCase(), tool.id);
  
  // ID as fallback
  toolMap.set(tool.id.toLowerCase(), tool.id);
  
  // Common variants (add more as needed)
  // e.g., "Claude" -> "anthropic-claude"
});

// Additional aliases for common tools
const aliases: Record<string, string> = {
  'claude': 'anthropic-claude',
  'claude 3': 'anthropic-claude',
  'claude 4': 'anthropic-claude',
  'gpt-4': 'chatgpt',
  'gpt-4o': 'chatgpt',
  'gpt4': 'chatgpt',
  'openai': 'chatgpt',
  'midjourney': 'midjourney',
  'mj': 'midjourney',
  'copilot': 'github-copilot',
  'github copilot': 'github-copilot',
  'v0': 'v0',
  'vercel v0': 'v0',
  'bolt': 'bolt',
  'bolt.new': 'bolt',
};

Object.entries(aliases).forEach(([alias, slug]) => {
  toolMap.set(alias.toLowerCase(), slug);
});

/**
 * Get all tool names that should be linked (sorted by length, longest first)
 * This ensures "GitHub Copilot" matches before "GitHub"
 */
export function getToolPatterns(): Array<{ pattern: string; slug: string }> {
  const patterns: Array<{ pattern: string; slug: string }> = [];
  
  tools.forEach(tool => {
    patterns.push({ pattern: tool.name, slug: tool.id });
  });
  
  Object.entries(aliases).forEach(([alias, slug]) => {
    patterns.push({ pattern: alias, slug });
  });
  
  // Sort by length descending so longer matches take priority
  return patterns.sort((a, b) => b.pattern.length - a.pattern.length);
}

/**
 * Check if a tool exists in our database
 */
export function toolExists(name: string): boolean {
  return toolMap.has(name.toLowerCase()) || tools.some(t => 
    t.name.toLowerCase() === name.toLowerCase() ||
    t.id.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get the tool slug for a given name
 */
export function getToolSlug(name: string): string | null {
  const lower = name.toLowerCase();
  
  // Check direct map
  if (toolMap.has(lower)) {
    return toolMap.get(lower)!;
  }
  
  // Check tools array
  const tool = tools.find(t => 
    t.name.toLowerCase() === lower ||
    t.id.toLowerCase() === lower
  );
  
  return tool?.id || null;
}

/**
 * Auto-link tool mentions in markdown content
 * Returns markdown with tool names wrapped in links
 * 
 * @param content - Markdown content
 * @param currentToolSlug - Optional: don't link if we're on that tool's page
 */
export function autoLinkTools(content: string, currentToolSlug?: string): string {
  let result = content;
  const patterns = getToolPatterns();
  
  // Track what we've already linked to avoid double-linking
  const linked = new Set<string>();
  
  patterns.forEach(({ pattern, slug }) => {
    // Skip if we're on this tool's page or already linked
    if (slug === currentToolSlug || linked.has(slug)) return;
    
    // Create case-insensitive regex that matches whole words
    // Avoid matching inside existing links or code blocks
    const regex = new RegExp(
      `(?<!\\[)(?<!\\/)(?<![\\w-])${escapeRegex(pattern)}(?![\\w-])(?!\\])(?!\\()`,
      'gi'
    );
    
    // Only link first occurrence to avoid over-linking
    const match = result.match(regex);
    if (match) {
      result = result.replace(regex, (m) => {
        linked.add(slug);
        return `[${m}](/tools/${slug})`;
      });
    }
  });
  
  return result;
}

/**
 * Get all tools mentioned in content
 */
export function getToolsMentioned(content: string): string[] {
  const mentioned: string[] = [];
  const contentLower = content.toLowerCase();
  
  tools.forEach(tool => {
    if (
      contentLower.includes(tool.name.toLowerCase()) ||
      contentLower.includes(tool.id.toLowerCase())
    ) {
      mentioned.push(tool.id);
    }
  });
  
  return [...new Set(mentioned)];
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * React component helper: render content with tool links
 * For use in JSX when you want to render linked content
 */
export function renderWithToolLinks(
  content: string, 
  currentToolSlug?: string
): { __html: string } {
  const linked = autoLinkTools(content, currentToolSlug);
  // Convert markdown links to HTML
  const html = linked.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" class="tool-link">$1</a>'
  );
  return { __html: html };
}
