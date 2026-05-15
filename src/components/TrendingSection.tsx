'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Clock } from 'lucide-react';
import { useNews } from '@/context/NewsContext';
import { formatDate } from '@/lib/utils';
import { Article } from '@/types/news';

export function TrendingSection() {
  const { articles, loading } = useNews();

  if (loading || articles.length === 0) return null;

  const trending = articles.filter((a) => a.isTrending);
  const displayArticles: Article[] =
    trending.length >= 3
      ? trending.slice(0, 3)
      : articles.slice(0, 3);

  if (displayArticles.length === 0) return null;

  const featured = displayArticles[0];
  const secondary = displayArticles.slice(1, 3);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Featured large card */}
        <Link
          href={`/article/${featured.id}`}
          className="group relative rounded-xl overflow-hidden h-64 lg:h-80"
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600"
          >
            {featured.imageUrl && (
              <img
                src={featured.imageUrl}
                alt={featured.title}
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-2.5 py-1 bg-red-500 text-white text-xs font-medium rounded-full mb-3">
              Trending
            </span>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:underline">
              {featured.title}
            </h3>
            <div className="flex items-center gap-3 text-gray-300 text-sm">
              <span>{featured.source}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(featured.publishedAt)}
              </span>
            </div>
          </div>
        </Link>

        {/* Secondary cards */}
        <div className="grid grid-cols-1 gap-4">
          {secondary.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="group flex rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow h-[9.5rem]"
            >
              <div className="relative w-40 shrink-0 bg-gradient-to-br from-primary-400 to-accent-400">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center p-4 flex-1 min-w-0">
                <span className="text-xs font-medium text-red-500 mb-1">Trending</span>
                <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-500 transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{article.source}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
