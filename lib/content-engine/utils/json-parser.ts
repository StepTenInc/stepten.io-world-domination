/**
 * Robust JSON Parser for LLM Outputs
 * 
 * Handles common issues with LLM-generated JSON:
 * - Unescaped quotes in strings
 * - Trailing commas
 * - Comments
 * - Newlines in strings
 */

/**
 * Extract and parse JSON from LLM response text
 */
export function parseJsonFromLlm<T>(text: string, context: string = 'unknown'): T {
  // Try to find JSON object or array
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  
  if (!jsonMatch) {
    console.error(`[${context}] No JSON found in response:`, text.substring(0, 500));
    throw new Error(`No JSON found in ${context} output`);
  }

  let jsonStr = jsonMatch[0];

  // Attempt 1: Direct parse
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e1) {
    console.log(`[${context}] Direct parse failed, attempting cleanup...`);
  }

  // Attempt 2: Clean up common issues
  try {
    jsonStr = cleanJsonString(jsonStr);
    return JSON.parse(jsonStr) as T;
  } catch (e2) {
    console.log(`[${context}] Cleanup parse failed, attempting aggressive fix...`);
  }

  // Attempt 3: Aggressive fixing
  try {
    jsonStr = aggressiveJsonFix(jsonMatch[0]);
    return JSON.parse(jsonStr) as T;
  } catch (e3) {
    console.error(`[${context}] All parse attempts failed`);
    console.error(`[${context}] Original text:`, text.substring(0, 1000));
    console.error(`[${context}] Final error:`, e3);
    throw new Error(`Failed to parse ${context} JSON: ${(e3 as Error).message}`);
  }
}

/**
 * Clean common JSON issues
 */
function cleanJsonString(str: string): string {
  // Remove trailing commas before } or ]
  str = str.replace(/,(\s*[}\]])/g, '$1');
  
  // Remove JavaScript-style comments
  str = str.replace(/\/\/[^\n]*/g, '');
  str = str.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Fix common escape issues in strings
  // This is tricky because we need to only fix unescaped quotes inside strings
  
  return str;
}

/**
 * Aggressive JSON fixing - handles more edge cases
 */
function aggressiveJsonFix(str: string): string {
  // Remove all control characters except newlines and tabs
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  // Try to fix unescaped quotes inside strings
  // Strategy: Find string values and escape any unescaped quotes
  str = fixUnescapedQuotesInStrings(str);
  
  // Remove trailing commas
  str = str.replace(/,(\s*[}\]])/g, '$1');
  
  // Fix double-escaped quotes
  str = str.replace(/\\\\"/g, '\\"');
  
  return str;
}

/**
 * Fix unescaped quotes inside JSON string values
 */
function fixUnescapedQuotesInStrings(str: string): string {
  // This is a heuristic approach - we look for patterns like:
  // "key": "value with "unescaped" quotes"
  // And try to escape the inner quotes
  
  const result: string[] = [];
  let inString = false;
  let escaped = false;
  let stringStart = -1;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const prevChar = i > 0 ? str[i - 1] : '';
    
    if (escaped) {
      escaped = false;
      result.push(char);
      continue;
    }
    
    if (char === '\\') {
      escaped = true;
      result.push(char);
      continue;
    }
    
    if (char === '"') {
      if (!inString) {
        // Starting a string
        inString = true;
        stringStart = i;
        result.push(char);
      } else {
        // Could be end of string or unescaped quote
        // Look ahead to determine
        const nextNonWhitespace = str.substring(i + 1).match(/^\s*(.)/)?.[1];
        
        if (nextNonWhitespace === ':' || nextNonWhitespace === ',' || 
            nextNonWhitespace === '}' || nextNonWhitespace === ']' ||
            nextNonWhitespace === undefined) {
          // This is the end of the string
          inString = false;
          result.push(char);
        } else {
          // This is an unescaped quote inside the string - escape it
          result.push('\\');
          result.push(char);
        }
      }
    } else {
      result.push(char);
    }
  }
  
  return result.join('');
}

/**
 * Extract multiple JSON objects from text (for array outputs)
 */
export function parseJsonArrayFromLlm<T>(text: string, context: string = 'unknown'): T[] {
  // First try to find an array
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return parseJsonFromLlm<T[]>(arrayMatch[0], context);
  }
  
  // Otherwise try to find individual objects and combine
  const objects: T[] = [];
  const objectRegex = /\{[^{}]*\}/g;
  let match;
  
  while ((match = objectRegex.exec(text)) !== null) {
    try {
      objects.push(parseJsonFromLlm<T>(match[0], context));
    } catch {
      // Skip invalid objects
    }
  }
  
  if (objects.length === 0) {
    throw new Error(`No valid JSON objects found in ${context} output`);
  }
  
  return objects;
}
