import Parser from 'rss-parser';
import { Article, NewsSource, Category } from '@/types/news';
import { generateArticleId, estimateReadingTime, classifyCategory } from '@/lib/utils';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'AI-Pulse-News-Aggregator/1.0',
  },
});

/**
 * RSS feed sources for AI news
 */
export const rssSources: NewsSource[] = [
  {
    name: 'Google News - AI',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en',
    type: 'rss',
    category: 'all',
  },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    type: 'rss',
    category: 'ai-business',
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    type: 'rss',
    category: 'all',
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    type: 'rss',
    category: 'ai-research',
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    type: 'rss',
    category: 'ai-business',
  },
  {
    name: 'ArXiv AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    type: 'rss',
    category: 'ai-research',
  },
  {
    name: 'Wired AI',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    type: 'rss',
    category: 'all',
  },
  {
    name: 'Ars Technica AI',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    type: 'rss',
    category: 'all',
  },
];

/**
 * Fetch articles from a single RSS feed
 */
async function fetchSingleRSSFeed(source: NewsSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const articles: Article[] = (feed.items || []).slice(0, 20).map((item) => {
      const title = item.title || 'Untitled';
      const description = item.contentSnippet || item.content || '';
      const content = item.content || item.contentSnippet || '';

      return {
        id: generateArticleId(title, source.name, item.link || ''),
        title,
        description: description.slice(0, 300),
        content,
        source: source.name,
        sourceUrl: feed.link || source.url,
        author: item.creator || item.author || source.name,
        url: item.link || '',
        imageUrl: extractImageUrl(item) || '',
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        category: classifyCategory(title, description),
        readingTime: estimateReadingTime(content),
        isTrending: false,
      };
    });

    return articles;
  } catch (error) {
    console.error(`Failed to fetch RSS feed from ${source.name}:`, error);
    return [];
  }
}

/**
 * Extract image URL from RSS feed item
 */
function extractImageUrl(item: Record<string, unknown>): string {
  // Check for media content
  if (item['media:content'] && typeof item['media:content'] === 'object') {
    const media = item['media:content'] as Record<string, unknown>;
    if (media.$ && typeof media.$ === 'object') {
      const attrs = media.$ as Record<string, string>;
      if (attrs.url) return attrs.url;
    }
  }

  // Check for enclosure
  if (item.enclosure && typeof item.enclosure === 'object') {
    const enclosure = item.enclosure as Record<string, string>;
    if (enclosure.url) return enclosure.url;
  }

  // Try to extract from content HTML
  if (item.content && typeof item.content === 'string') {
    const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
  }

  return '';
}

/**
 * Fetch all RSS feeds concurrently
 */
export async function fetchRSSFeeds(): Promise<Article[]> {
  const feedPromises = rssSources.map((source) => fetchSingleRSSFeed(source));
  const results = await Promise.allSettled(feedPromises);

  const articles: Article[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    }
  }

  return articles;
}

/**
 * Fetch articles from NewsAPI
 */
export async function fetchNewsAPI(): Promise<Article[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn('NEWS_API_KEY not set, skipping NewsAPI fetch');
    return [];
  }

  try {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set('q', 'artificial intelligence OR machine learning OR deep learning');
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '30');
    url.searchParams.set('apiKey', apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`NewsAPI returned status ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (!data.articles || !Array.isArray(data.articles)) {
      return [];
    }

    const articles: Article[] = data.articles.map(
      (item: {
        title?: string;
        description?: string;
        content?: string;
        source?: { name?: string };
        author?: string;
        url?: string;
        urlToImage?: string;
        publishedAt?: string;
      }) => {
        const title = item.title || 'Untitled';
        const description = item.description || '';
        const content = item.content || description;

        return {
          id: generateArticleId(title, item.source?.name || 'NewsAPI', item.url || ''),
          title,
          description,
          content,
          source: item.source?.name || 'Unknown',
          sourceUrl: item.url || '',
          author: item.author || 'Unknown',
          url: item.url || '',
          imageUrl: item.urlToImage || '',
          publishedAt: item.publishedAt || new Date().toISOString(),
          category: classifyCategory(title, description),
          readingTime: estimateReadingTime(content),
          isTrending: false,
        };
      }
    );

    return articles;
  } catch (error) {
    console.error('Failed to fetch from NewsAPI:', error);
    return [];
  }
}

/**
 * Deduplicate articles by comparing title similarity
 */
function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Map<string, Article>();

  for (const article of articles) {
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();

    // Use first 50 chars of normalized title as dedup key
    const key = normalizedTitle.slice(0, 50);

    if (!seen.has(key)) {
      seen.set(key, article);
    }
  }

  return Array.from(seen.values());
}

/**
 * Mark trending articles based on recency and source diversity
 */
function markTrending(articles: Article[]): Article[] {
  const now = new Date();
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

  // Count title word appearances to find trending topics
  const wordCount = new Map<string, number>();
  for (const article of articles) {
    const words = article.title.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word.length > 4) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    }
  }

  return articles.map((article) => {
    const publishedDate = new Date(article.publishedAt);
    const isRecent = publishedDate > sixHoursAgo;

    // Check if article contains trending words
    const words = article.title.toLowerCase().split(/\s+/);
    const hasTrendingWords = words.some(
      (word) => word.length > 4 && (wordCount.get(word) || 0) >= 3
    );

    return {
      ...article,
      isTrending: isRecent && hasTrendingWords,
    };
  });
}

/**
 * Fetch all news from all sources, deduplicate, classify, and sort
 */
export async function fetchAllNews(): Promise<Article[]> {
  const [rssArticles, apiArticles] = await Promise.all([
    fetchRSSFeeds(),
    fetchNewsAPI(),
  ]);

  // Combine all articles
  let allArticles = [...rssArticles, ...apiArticles];

  // Deduplicate
  allArticles = deduplicateArticles(allArticles);

  // Mark trending
  allArticles = markTrending(allArticles);

  // Sort by published date (most recent first)
  allArticles.sort((a, b) => {
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return allArticles;
}

/**
 * Cached version of fetchAllNews with 5-minute revalidation
 * Uses Next.js fetch cache when called from server components
 */
let cachedArticles: Article[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function getCachedNews(): Promise<Article[]> {
  const now = Date.now();

  if (cachedArticles && now - cacheTimestamp < CACHE_DURATION) {
    return cachedArticles;
  }

  const articles = await fetchAllNews();
  cachedArticles = articles;
  cacheTimestamp = now;

  return articles;
}
