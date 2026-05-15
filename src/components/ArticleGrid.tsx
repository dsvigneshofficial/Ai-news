'use client';

import React, { useState } from 'react';
import { useNews } from '@/context/NewsContext';
import { ArticleCard } from '@/components/ArticleCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { NoResults } from '@/components/NoResults';

const ITEMS_PER_PAGE = 12;

export function ArticleGrid() {
  const { filteredArticles, loading } = useNews();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (filteredArticles.length === 0) {
    return <NoResults />;
  }

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleArticles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="px-8 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
          >
            Load More Articles
          </button>
        </div>
      )}
    </div>
  );
}
