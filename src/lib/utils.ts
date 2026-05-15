import { formatDistanceToNow, parseISO } from 'date-fns';
import { Category } from '@/types/news';
import { categories } from '@/lib/categories';

/**
 * Decode common HTML entities to their text equivalents
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&#038;': '&',
    '&nbsp;': ' ',
    '&#8217;': '\u2019',
    '&#8216;': '\u2018',
    '&#8220;': '\u201C',
    '&#8221;': '\u201D',
    '&#8211;': '\u2013',
    '&#8212;': '\u2014',
    '&#8230;': '\u2026',
  };

  let result = text;
  for (const [entity, char] of Object.entries(entities)) {
    result = result.split(entity).join(char);
  }
  // Handle numeric entities like &#123;
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
  // Handle hex entities like &#x1F4A1;
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  return result;
}

/**
 * Strip all HTML tags from a string and decode entities, returning clean plain text
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  let text = html;
  // Remove script and style elements entirely
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove all HTML tags
  text = text.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  text = decodeHtmlEntities(text);
  // Collapse multiple whitespace into single space
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * Strip HTML but preserve paragraph breaks (replace block-level closing tags with newlines)
 */
export function extractCleanContent(html: string): string {
  if (!html) return '';
  let text = html;
  // Remove script and style elements entirely
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Replace block-level closing tags and <br> with double newlines
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<\/div>/gi, '\n\n');
  text = text.replace(/<\/h[1-6]>/gi, '\n\n');
  text = text.replace(/<\/li>/gi, '\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  // Remove all remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');
  // Decode HTML entities
  text = decodeHtmlEntities(text);
  // Collapse multiple blank lines into double newline
  text = text.replace(/\n{3,}/g, '\n\n');
  // Trim whitespace from each line
  text = text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
  // Trim overall
  text = text.trim();
  return text;
}

/**
 * Format a date string to relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatDate(date: string): string {
  try {
    const parsed = parseISO(date);
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return 'Unknown date';
  }
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Generate a deterministic ID from title, source, and optionally URL using a simple hash
 */
export function generateArticleId(title: string, source: string, url?: string): string {
  const input = `${title}-${source}${url ? `-${url}` : ''}`.toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Estimate reading time based on word count (average 200 words per minute)
 */
export function estimateReadingTime(text: string): number {
  if (!text) return 1;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

/**
 * Classify an article into a category based on keyword matching in title and description
 */
export function classifyCategory(title: string, description: string): Category {
  const text = `${title} ${description}`.toLowerCase();

  let bestMatch: Category = 'all';
  let bestScore = 0;

  for (const category of categories) {
    if (category.slug === 'all') continue;

    let score = 0;
    for (const keyword of category.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score += keyword.split(' ').length; // Multi-word matches score higher
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = category.slug;
    }
  }

  return bestMatch;
}

/**
 * Merge class names utility (similar to clsx/cn)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
