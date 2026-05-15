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

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/article/${article.id}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-500" />
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

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {article.author && (
              <span className="truncate max-w-[100px]">{article.author}</span>
            )}
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readingTime} min
            </span>
          </div>
          <BookmarkButton article={article} />
        </div>
      </div>
    </Link>
  );
}
