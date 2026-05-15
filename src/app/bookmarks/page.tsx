'use client';

import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { useBookmarks } from '@/context/BookmarkContext';

export default function BookmarksPage() {
  const { bookmarks, clearBookmarks } = useBookmarks();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Saved Articles
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>

          {bookmarks.length > 0 && (
            <button
              onClick={clearBookmarks}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No saved articles yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Start bookmarking articles to build your personal reading list. Click the bookmark icon on any article to save it.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
