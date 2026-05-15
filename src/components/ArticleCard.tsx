'use client';

import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Article } from '@/types/news';
import { formatDate, cn } from '@/lib/utils';
import { getCategoryLabel } from '@/lib/categories';
import { BookmarkButton } from '@/components/BookmarkButton';

interface ArticleCardProps {
  article: Article;
}

const categoryColors: Record<string, string> = {
  'machine-learning': 'bg-blue-500',
  'llms': 'bg-purple-500',
  'computer-vision': 'bg-green-500',
  'robotics': 'bg-orange-500',
  'ai-ethics': 'bg-yellow-500',
  'generative-ai': 'bg-pink-500',
  'neural-networks': 'bg-indigo-500',
  'ai-research': 'bg-teal-500',
  'ai-business': 'bg-emerald-500',
  'ai-tools': 'bg-cyan-500',
  'all': 'bg-gray-500',
};

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'machine-learning': '\uD83E\uDDE0',
    'llms': '\uD83D\uDCAC',
    'computer-vision': '\uD83D\uDC41\uFE0F',
    'robotics': '\uD83E\uDD16',
    'ai-ethics': '\u2696\uFE0F',
    'generative-ai': '\uD83C\uDFA8',
    'neural-networks': '\uD83D\uDD17',
    'ai-research': '\uD83D\uDD2C',
    'ai-business': '\uD83D\uDCBC',
    'ai-tools': '\uD83D\uDEE0\uFE0F',
    'all': '\uD83E\uDD16',
  };
  return emojis[category] || '\uD83E\uDD16';
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl block mb-2">
                {getCategoryEmoji(article.category)}
              </span>
              <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                {getCategoryLabel(article.category)}
              </span>
            </div>
          </div>
        )}
        {/* Category badge */}
        <span
          className={cn(
            'absolute top-3 left-3 px-2.5 py-1 text-white text-xs font-medium rounded-full',
            categoryColors[article.category] || 'bg-gray-500'
          )}
        >
          {getCategoryLabel(article.category)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Source */}
        <span className="text-xs font-medium text-primary-500 mb-1.5">
          {article.source}
        </span>

        {/* Title - stretched link */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">
          <Link
            href={`/article/${article.id}`}
            className="after:absolute after:inset-0"
          >
            {article.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTime} min
            </span>
          </div>
          <BookmarkButton article={article} className="relative z-10" />
        </div>
      </div>
    </div>
  );
}
