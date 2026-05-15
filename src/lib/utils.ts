import { formatDistanceToNow, parseISO } from 'date-fns';
import { Category } from '@/types/news';
import { categories } from '@/lib/categories';

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
 * Generate a deterministic ID from title and source using a simple hash
 */
export function generateArticleId(title: string, source: string): string {
  const input = `${title}-${source}`.toLowerCase().trim();
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
