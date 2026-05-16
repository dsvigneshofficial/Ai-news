'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { TrendingSection } from '@/components/TrendingSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ArticleGrid } from '@/components/ArticleGrid';
import { AutoRefreshIndicator } from '@/components/AutoRefreshIndicator';
import { Footer } from '@/components/Footer';
import { useNews } from '@/context/NewsContext';
import { Zap, Newspaper, RefreshCw } from 'lucide-react';

function HeroBanner() {
  const { articles, lastFetched } = useNews();
  const totalSources = 8;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 text-white mb-8 px-6 py-8 sm:px-10 sm:py-10">
      {/* Background decorative blobs */}
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-semibold text-white/80 uppercase tracking-wide">Live AI News Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2">
            Stay ahead of the <span className="text-yellow-300">AI revolution</span>
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-lg">
            Curated news from the world&apos;s top AI sources — updated every 5 minutes so you never miss a breakthrough.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6 shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Newspaper className="w-4 h-4 text-yellow-300" />
              <span className="text-2xl font-black">{articles.length || '12+'}</span>
            </div>
            <span className="text-xs text-white/70">Articles</span>
          </div>
          <div className="w-px bg-white/20 self-stretch" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <RefreshCw className="w-4 h-4 text-yellow-300" />
              <span className="text-2xl font-black">{totalSources}</span>
            </div>
            <span className="text-xs text-white/70">Sources</span>
          </div>
          {lastFetched && (
            <>
              <div className="w-px bg-white/20 self-stretch" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-bold">Live</span>
                </div>
                <span className="text-xs text-white/70">Real-time</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { searchQuery, filteredArticles, loading } = useNews();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <HeroBanner />

        <TrendingSection />

        <CategoryFilter />

        {searchQuery && !loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 mt-1">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{filteredArticles.length}</span>{' '}
            result{filteredArticles.length !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-primary-500">&ldquo;{searchQuery}&rdquo;</span>
          </p>
        )}

        <ArticleGrid />
      </main>

      <AutoRefreshIndicator />
      <Footer />
    </div>
  );
}
