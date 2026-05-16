import { NextRequest, NextResponse } from 'next/server';
import { getCachedNews } from '@/lib/news-fetcher';
import { fallbackArticles } from '@/lib/fallback-articles';
import { Category } from '@/types/news';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as Category | null;
    const search = searchParams.get('search');
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let articles = await getCachedNews();

    // Ensure we always have content — merge fallbacks if live fetch returned nothing
    if (!articles || articles.length === 0) {
      articles = fallbackArticles;
    }

    // Single article lookup by id
    if (id) {
      const article = articles.find((a) => a.id === id);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      const related = articles
        .filter((a) => a.category === article.category && a.id !== article.id)
        .slice(0, 3);
      return NextResponse.json({ article, related }, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
      });
    }

    // Filter by category
    if (category && category !== 'all') {
      articles = articles.filter((article) => article.category === category);
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.source.toLowerCase().includes(query)
      );
    }

    const total = articles.length;

    // Apply pagination
    const paginated = articles.slice(offset, offset + limit);

    return NextResponse.json(
      {
        articles: paginated,
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: offset + limit < total,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching news:', error);

    // Even on error, return fallback articles so the UI always has content
    return NextResponse.json(
      {
        articles: fallbackArticles,
        total: fallbackArticles.length,
        page: 1,
        limit: fallbackArticles.length,
        hasMore: false,
        _fromFallback: true,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }
}
