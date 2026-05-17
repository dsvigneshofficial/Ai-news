import { NextRequest, NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/news-fetcher';
import { Category } from '@/types/news';

// Tell Next.js: never statically cache this route, always run it fresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category') as Category | null;
    const search   = searchParams.get('search');
    const id       = searchParams.get('id');
    const limit    = Math.min(parseInt(searchParams.get('limit')  || '60', 10), 200);
    const offset   = parseInt(searchParams.get('offset') || '0', 10);

    // Always fetch fresh from RSS/NewsAPI — no server-side memory cache
    let articles = await fetchAllNews();

    // Single-article lookup
    if (id) {
      const article = articles.find((a) => a.id === id);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      const related = articles
        .filter((a) => a.category === article.category && a.id !== article.id)
        .slice(0, 3);
      return NextResponse.json(
        { article, related },
        { headers: noStoreHeaders() }
      );
    }

    // Category filter
    if (category && category !== 'all') {
      articles = articles.filter((a) => a.category === category);
    }

    // Full-text search across title + description + source
    if (search) {
      const q = search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
      );
    }

    const total    = articles.length;
    const paginated = articles.slice(offset, offset + limit);

    return NextResponse.json(
      {
        articles: paginated,
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: offset + limit < total,
        fetchedAt: new Date().toISOString(),
      },
      { headers: noStoreHeaders() }
    );
  } catch (err) {
    console.error('[/api/news] Error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch news', articles: [], total: 0 },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}

/** Headers that prevent CDN / browser caching so every poll gets fresh data */
function noStoreHeaders(): HeadersInit {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
  };
}
