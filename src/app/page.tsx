'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { TrendingSection } from '@/components/TrendingSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ArticleGrid } from '@/components/ArticleGrid';
import { AutoRefreshIndicator } from '@/components/AutoRefreshIndicator';
import { Footer } from '@/components/Footer';
import { useNews } from '@/context/NewsContext';

export default function HomePage() {
  const { searchQuery, filteredArticles, loading } = useNews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <TrendingSection />

        <CategoryFilter />

        {searchQuery && !loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Showing {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        <ArticleGrid />
      </main>

      <AutoRefreshIndicator />
      <Footer />
    </div>
  );
}
