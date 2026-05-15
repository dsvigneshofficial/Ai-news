'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useNews } from '@/context/NewsContext';
import { ArticleCard } from '@/components/ArticleCard';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { NoResults } from '@/components/NoResults';

const ITEMS_PER_PAGE = 12;

export function ArticleGrid() {
  const { filteredArticles, loading, error, fetchNews } = useNews();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Unable to load articles
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          {error}
        </p>
        <button
          onClick={() => fetchNews()}
          className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
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
