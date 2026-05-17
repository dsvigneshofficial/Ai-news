import Parser from 'rss-parser';
import { Article, NewsSource } from '@/types/news';
import { generateArticleId, estimateReadingTime, classifyCategory } from '@/lib/utils';

// Configure rss-parser to capture all useful fields including media
type CustomItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  author?: string;
  creator?: string;
  content?: string;
  contentSnippet?: string;
  'content:encoded'?: string;
  'content:encodedSnippet'?: string;
  summary?: string;
  description?: string;
  enclosure?: { url?: string; type?: string };
  'media:content'?: { $?: { url?: string; medium?: string } } | Array<{ $?: { url?: string } }>;
  'media:thumbnail'?: { $?: { url?: string } };
  'media:group'?: { 'media:thumbnail'?: Array<{ $?: { url?: string } }> };
  image?: { url?: string } | string;
};

const parser = new Parser<Record<string, unknown>, CustomItem>({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; AIPulseBot/1.0; +https://aipulse.news)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['content:encoded', 'content:encoded'],
      ['content:encodedSnippet', 'content:encodedSnippet'],
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
      ['media:group', 'media:group'],
      ['description', 'description'],
      ['summary', 'summary'],
    ],
  },
});

// ─────────────────────────────────────────────
// 15 RSS sources covering all AI categories
// ─────────────────────────────────────────────
export const rssSources: NewsSource[] = [
  // General AI news
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
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    type: 'rss',
    category: 'ai-business',
  },
  {
    name: 'Wired AI',
    url: 'https://www.wired.com/feed/tag/ai/latest/rss',
    type: 'rss',
    category: 'all',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    type: 'rss',
    category: 'all',
  },
  // Research & academic
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',
    type: 'rss',
    category: 'ai-research',
  },
  {
    name: 'ArXiv CS.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    type: 'rss',
    category: 'ai-research',
  },
  {
    name: 'ArXiv CS.LG',
    url: 'https://rss.arxiv.org/rss/cs.LG',
    type: 'rss',
    category: 'machine-learning',
  },
  {
    name: 'DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
    type: 'rss',
    category: 'ai-research',
  },
  // Business & tools
  {
    name: 'ZDNET AI',
    url: 'https://www.zdnet.com/topic/artificial-intelligence/rss.xml',
    type: 'rss',
    category: 'ai-tools',
  },
  {
    name: 'InfoWorld AI',
    url: 'https://www.infoworld.com/category/artificial-intelligence/index.rss',
    type: 'rss',
    category: 'ai-tools',
  },
  {
    name: 'IEEE Spectrum AI',
    url: 'https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss',
    type: 'rss',
    category: 'ai-research',
  },
  // Generative AI & LLMs
  {
    name: 'The AI Blog (OpenAI)',
    url: 'https://openai.com/blog/rss.xml',
    type: 'rss',
    category: 'llms',
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    type: 'rss',
    category: 'machine-learning',
  },
  {
    name: 'Analytics Vidhya',
    url: 'https://www.analyticsvidhya.com/feed/',
    type: 'rss',
    category: 'machine-learning',
  },
  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    type: 'rss',
    category: 'machine-learning',
  },
  {
    name: 'AI News (artificialintelligence-news.com)',
    url: 'https://www.artificialintelligence-news.com/feed/',
    type: 'rss',
    category: 'all',
  },
  {
    name: 'The Batch (deeplearning.ai)',
    url: 'https://www.deeplearning.ai/the-batch/feed/',
    type: 'rss',
    category: 'machine-learning',
  },
];

// ─────────────────────────────────────────────
// Image extraction — tries every known RSS field
// ─────────────────────────────────────────────
function extractImageUrl(item: CustomItem): string {
  // media:group > media:thumbnail (YouTube-style)
  const group = item['media:group'];
  if (group?.['media:thumbnail']?.[0]?.['$']?.url) {
    return group['media:thumbnail'][0]['$']!.url!;
  }

  // media:thumbnail
  if (item['media:thumbnail']?.['$']?.url) {
    return item['media:thumbnail']['$']!.url!;
  }

  // media:content (single or array)
  const mc = item['media:content'];
  if (mc) {
    if (Array.isArray(mc)) {
      const first = mc.find((m) => m?.['$']?.url);
      if (first?.['$']?.url) return first['$']!.url!;
    } else if ((mc as { $?: { url?: string } })?.['$']?.url) {
      return (mc as { $: { url: string } })['$'].url;
    }
  }

  // enclosure (podcasts / media-rich feeds)
  if (item.enclosure?.url && item.enclosure?.type?.startsWith('image')) {
    return item.enclosure.url;
  }

  // Scrape first <img> from content:encoded or content
  const html = item['content:encoded'] || item.content || '';
  if (html) {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m?.[1] && m[1].startsWith('http')) return m[1];
  }

  return '';
}

// ─────────────────────────────────────────────
// Strip HTML tags and decode basic entities
// ─────────────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─────────────────────────────────────────────
// Extract the best available content from item
// Priority: content:encoded > content > description > summary > contentSnippet
// ─────────────────────────────────────────────
function extractContent(item: CustomItem): { description: string; content: string } {
  const encoded = item['content:encoded'] || '';
  const rawContent = item.content || '';
  const description = item.description || item.summary || item.contentSnippet || '';

  // Full article body — prefer content:encoded (most RSS feeds put full HTML there)
  let fullHtml = encoded || rawContent || description;
  let fullText = stripHtml(fullHtml).trim();

  // Short snippet fallback
  let snippetText = stripHtml(description).trim() || stripHtml(rawContent).trim() || item.contentSnippet || '';
  snippetText = snippetText.slice(0, 400).trim();
  if (snippetText.length === 400) snippetText += '…';

  // If fullText is basically the same as snippet (feed only gives summary), use snippet
  if (fullText.length < 200) {
    fullText = snippetText;
  }

  return {
    description: snippetText || fullText.slice(0, 300),
    content: fullText,
  };
}

// ─────────────────────────────────────────────
// Fetch a single RSS feed with per-feed timeout
// ─────────────────────────────────────────────
async function fetchSingleFeed(source: NewsSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const items = (feed.items || []).slice(0, 25);

    return items.map((item) => {
      const title = stripHtml(item.title || 'Untitled').trim();
      const { description, content } = extractContent(item);
      const imageUrl = extractImageUrl(item);

      return {
        id: generateArticleId(title, source.name, item.link || ''),
        title,
        description,
        content,
        source: source.name,
        sourceUrl: item.link || feed.link || source.url,
        author: item.creator || item.author || source.name,
        url: item.link || '',
        imageUrl,
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        category: classifyCategory(title, description),
        readingTime: estimateReadingTime(content),
        isTrending: false,
      };
    });
  } catch (err) {
    console.error(`[RSS] Failed ${source.name}:`, (err as Error).message);
    return [];
  }
}

// ─────────────────────────────────────────────
// NewsAPI — full content (100-char truncated by free plan but better than nothing)
// ─────────────────────────────────────────────
export async function fetchNewsAPI(): Promise<Article[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  try {
    const url = new URL('https://newsapi.org/v2/everything');
    url.searchParams.set(
      'q',
      'artificial intelligence OR machine learning OR deep learning OR ChatGPT OR LLM OR generative AI'
    );
    url.searchParams.set('language', 'en');
    url.searchParams.set('sortBy', 'publishedAt');
    url.searchParams.set('pageSize', '50');
    url.searchParams.set('apiKey', apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error(`[NewsAPI] HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!Array.isArray(data.articles)) return [];

    return data.articles
      .filter((item: { title?: string }) => item.title && item.title !== '[Removed]')
      .map(
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
          // NewsAPI free tier truncates content at ~200 chars with "[+N chars]"
          // Use the full description as the visible text instead
          const description = item.description || '';
          const rawContent = item.content || '';
          // Strip the NewsAPI truncation marker
          const cleanContent = rawContent.replace(/\s*\[\+\d+ chars\]$/, '').trim();
          const content = cleanContent.length > description.length ? cleanContent : description;

          return {
            id: generateArticleId(title, item.source?.name || 'NewsAPI', item.url || ''),
            title,
            description: description.slice(0, 400),
            content: content || description,
            source: item.source?.name || 'NewsAPI',
            sourceUrl: item.url || '',
            author: item.author || item.source?.name || '',
            url: item.url || '',
            imageUrl: item.urlToImage || '',
            publishedAt: item.publishedAt || new Date().toISOString(),
            category: classifyCategory(title, description),
            readingTime: estimateReadingTime(content || description),
            isTrending: false,
          };
        }
      );
  } catch (err) {
    console.error('[NewsAPI] Error:', (err as Error).message);
    return [];
  }
}

// ─────────────────────────────────────────────
// Fetch all RSS feeds with concurrency limit
// ─────────────────────────────────────────────
export async function fetchAllRSS(): Promise<Article[]> {
  // Fetch in batches of 6 to avoid overwhelming the server
  const BATCH = 6;
  const articles: Article[] = [];

  for (let i = 0; i < rssSources.length; i += BATCH) {
    const batch = rssSources.slice(i, i + BATCH);
    const results = await Promise.allSettled(batch.map(fetchSingleFeed));
    for (const r of results) {
      if (r.status === 'fulfilled') articles.push(...r.value);
    }
  }

  return articles;
}

// ─────────────────────────────────────────────
// Assign a category-appropriate Unsplash image
// to articles that have no image from their feed
// ─────────────────────────────────────────────
const CATEGORY_IMAGES: Record<string, string[]> = {
  'machine-learning': [
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=800&q=80',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&q=80',
  ],
  llms: [
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&q=80',
    'https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=800&q=80',
    'https://images.unsplash.com/photo-1686191128892-3b37add4c844?w=800&q=80',
  ],
  'computer-vision': [
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
  ],
  robotics: [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    'https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?w=800&q=80',
    'https://images.unsplash.com/photo-1518314916381-77a37c2a49ae?w=800&q=80',
  ],
  'ai-ethics': [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',
  ],
  'generative-ai': [
    'https://images.unsplash.com/photo-1536240478700-b869ad10e2ab?w=800&q=80',
    'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
  ],
  'neural-networks': [
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  ],
  'ai-research': [
    'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80',
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80',
  ],
  'ai-business': [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80',
  ],
  'ai-tools': [
    'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  ],
  all: [
    'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
  ],
};

function withFallbackImage(article: Article): Article {
  if (article.imageUrl && article.imageUrl.startsWith('http')) return article;
  const pool = CATEGORY_IMAGES[article.category] ?? CATEGORY_IMAGES['all'];
  const idx = Math.abs(
    article.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % pool.length;
  return { ...article, imageUrl: pool[idx] };
}

// ─────────────────────────────────────────────
// Deduplication by normalised title prefix
// ─────────────────────────────────────────────
function deduplicate(articles: Article[]): Article[] {
  const seen = new Map<string, Article>();
  for (const a of articles) {
    const key = a.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .slice(0, 60);
    if (!seen.has(key)) seen.set(key, a);
  }
  return Array.from(seen.values());
}

// ─────────────────────────────────────────────
// Mark trending: recent + topic appears in 3+
// ─────────────────────────────────────────────
function markTrending(articles: Article[]): Article[] {
  const cutoff = Date.now() - 6 * 60 * 60 * 1000;
  const wordFreq = new Map<string, number>();
  for (const a of articles) {
    for (const w of a.title.toLowerCase().split(/\s+/)) {
      if (w.length > 4) wordFreq.set(w, (wordFreq.get(w) ?? 0) + 1);
    }
  }
  return articles.map((a) => {
    const isRecent = new Date(a.publishedAt).getTime() > cutoff;
    const hot = a.title
      .toLowerCase()
      .split(/\s+/)
      .some((w) => w.length > 4 && (wordFreq.get(w) ?? 0) >= 3);
    return { ...a, isTrending: isRecent && hot };
  });
}

// ─────────────────────────────────────────────
// Master fetch — NO in-memory cache
// (Vercel serverless resets memory every request;
//  caching is handled by the API route's revalidate tag)
// ─────────────────────────────────────────────
export async function fetchAllNews(): Promise<Article[]> {
  const [rssArticles, apiArticles] = await Promise.all([
    fetchAllRSS(),
    fetchNewsAPI(),
  ]);

  let all = deduplicate([...rssArticles, ...apiArticles]);
  all = all.map(withFallbackImage);
  all = markTrending(all);
  all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return all;
}

// Kept for backwards-compat — just calls fetchAllNews directly
export async function getCachedNews(): Promise<Article[]> {
  return fetchAllNews();
}
