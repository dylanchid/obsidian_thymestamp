import { TOKEN_DEFINITIONS } from './tokens';
import { parsePattern } from './tokens';

/**
 * Natural language parser that converts user-friendly text into token patterns
 * Example: "Monday, January 3rd" -> "{day}, {month} {date-ord}"
 */

interface ParseResult {
  pattern: string;
  confidence: number;
  detectedTokens: string[];
}

export class NaturalFormatParser {
  private static tokenPatterns = new Map<string, RegExp>();

  static {
    // Build detection patterns for each token
    this.tokenPatterns.set('day', /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i);
    this.tokenPatterns.set('day-abb', /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/i);
    this.tokenPatterns.set('month', /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/i);
    this.tokenPatterns.set('month-abb', /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);
    this.tokenPatterns.set('year', /\b(20\d{2}|19\d{2})\b/);
    this.tokenPatterns.set('year-short', /\b('\d{2}|\d{2})\b/);
    this.tokenPatterns.set('date-ord', /\b(\d{1,2})(st|nd|rd|th)\b/i);
    this.tokenPatterns.set('date-pad', /\b(0[1-9]|[12]\d|3[01])\b/);
    this.tokenPatterns.set('date', /\b([1-9]|[12]\d|3[01])\b/);
    this.tokenPatterns.set('month-pad', /\b(0[1-9]|1[0-2])\b/);
    this.tokenPatterns.set('month-num', /\b([1-9]|1[0-2])\b/);
    this.tokenPatterns.set('hours24-pad', /\b([01]\d|2[0-3])\b/);
    this.tokenPatterns.set('hours24', /\b([0-9]|1\d|2[0-3])\b/);
    this.tokenPatterns.set('hours-pad', /\b(0[1-9]|1[0-2])\b/);
    this.tokenPatterns.set('hours', /\b([1-9]|1[0-2])\b/);
    this.tokenPatterns.set('minutes', /\b[0-5]\d\b/);
    this.tokenPatterns.set('seconds', /\b[0-5]\d\b/);
    this.tokenPatterns.set('period', /\b(AM|PM)\b/);
    this.tokenPatterns.set('period-lower', /\b(am|pm)\b/);
    this.tokenPatterns.set('time', /\b\d{1,2}:\d{2}\s*(AM|PM)\b/i);
    this.tokenPatterns.set('time24', /\b\d{1,2}:\d{2}\b/);
    this.tokenPatterns.set('iso', /\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    this.tokenPatterns.set('unix', /\b\d{10,}\b/);
    this.tokenPatterns.set('relative', /\b(today|tomorrow|yesterday)\b/i);
    this.tokenPatterns.set('timezone', /\b[A-Z]{3,5}\b/);
    this.tokenPatterns.set('utc-offset', /[+-]\d{2}:\d{2}/);
    this.tokenPatterns.set('quarter', /\bQ[1-4]\b/);
    this.tokenPatterns.set('iso-week', /\bW\d{2}\b/);
    this.tokenPatterns.set('week', /\bweek\s+\d{1,2}\b/i);
    this.tokenPatterns.set('season', /\b(Spring|Summer|Autumn|Fall|Winter)\b/i);
  }

  /**
   * Parse natural language input and suggest a token pattern
   */
  static parseNaturalFormat(input: string): ParseResult {
    const detectedTokens: Array<{ token: string; position: number; length: number }> = [];
    
    // Detect tokens in the input
    for (const [tokenName, pattern] of this.tokenPatterns) {
      const matches = input.matchAll(new RegExp(pattern, 'g'));
      for (const match of matches) {
        if (match.index !== undefined) {
          detectedTokens.push({
            token: tokenName,
            position: match.index,
            length: match[0].length,
          });
        }
      }
    }

    // Sort by position
    detectedTokens.sort((a, b) => a.position - b.position);

    // Build pattern by replacing detected tokens with token syntax
    let pattern = input;
    let offset = 0;

    for (const detected of detectedTokens) {
      const adjustedPos = detected.position + offset;
      const before = pattern.substring(0, adjustedPos);
      const after = pattern.substring(adjustedPos + detected.length);
      const replacement = `{${detected.token}}`;
      
      pattern = before + replacement + after;
      offset += replacement.length - detected.length;
    }

    const confidence = detectedTokens.length > 0 ? 
      Math.min(detectedTokens.length * 0.2, 1.0) : 0;

    return {
      pattern,
      confidence,
      detectedTokens: detectedTokens.map(d => d.token),
    };
  }

  /**
   * Get suggestions based on partial input
   */
  static getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    const lowerInput = input.toLowerCase();

    // Common patterns
    if (lowerInput.includes('date')) {
      suggestions.push('{year}-{month-pad}-{date-pad}', '{month} {date}, {year}');
    }
    if (lowerInput.includes('time')) {
      suggestions.push('{hours}:{minutes} {period}', '{hours24-pad}:{minutes}');
    }
    if (lowerInput.includes('full') || lowerInput.includes('complete')) {
      suggestions.push('{day}, {month} {date-ord}, {year} at {time}');
    }
    if (lowerInput.includes('log')) {
      suggestions.push('[{hours24-pad}:{minutes}:{seconds}]');
    }
    if (lowerInput.includes('zettel')) {
      suggestions.push('{year}{month-pad}{date-pad}{hours24-pad}{minutes}{seconds}');
    }

    return suggestions;
  }

  /**
   * Validate if a pattern is valid
   */
  static validatePattern(pattern: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const tokenRegex = /\{([^}]+)\}/g;
    const matches = pattern.matchAll(tokenRegex);

    for (const match of matches) {
      const tokenName = match[1];
      const tokenExists = TOKEN_DEFINITIONS.some(def => def.token === tokenName);
      
      if (!tokenExists) {
        errors.push(`Unknown token: {${tokenName}}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get a preview of what a pattern will look like
   */
  static getPreview(pattern: string, locale?: string): string {
    try {
      return parsePattern(pattern, new Date(), locale || navigator.language || 'en-US');
    } catch (error) {
      return '[Invalid pattern]';
    }
  }
}
