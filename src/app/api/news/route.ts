import { NextRequest, NextResponse } from 'next/server';
import { getCachedNews } from '@/lib/news-fetcher';
import { Category } from '@/types/news';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as Category | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let articles = await getCachedNews();

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
    articles = articles.slice(offset, offset + limit);

    return NextResponse.json(
      {
        articles,
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching news:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch news articles',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
