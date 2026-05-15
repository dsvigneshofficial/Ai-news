'use client';

import React from 'react';
import { SearchX } from 'lucide-react';
import { useNews } from '@/context/NewsContext';

export function NoResults() {
  const { setSearchQuery, setActiveCategory } = useNews();

  const handleReset = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <SearchX className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No articles found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        Try adjusting your search terms or changing the category filter to find what you are looking for.
      </p>
      <button
        onClick={handleReset}
        className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
      >
        Reset filters
      </button>
    </div>
  );
}
