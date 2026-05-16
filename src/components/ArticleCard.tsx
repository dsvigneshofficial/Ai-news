'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { Article } from '@/types/news';
import { formatDate, cn } from '@/lib/utils';
import { getCategoryLabel } from '@/lib/categories';
import { BookmarkButton } from '@/components/BookmarkButton';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
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

const categoryGradients: Record<string, string> = {
  'machine-learning': 'from-blue-600 to-blue-400',
  'llms': 'from-purple-600 to-violet-400',
  'computer-vision': 'from-green-600 to-emerald-400',
  'robotics': 'from-orange-600 to-amber-400',
  'ai-ethics': 'from-yellow-600 to-yellow-400',
  'generative-ai': 'from-pink-600 to-rose-400',
  'neural-networks': 'from-indigo-600 to-indigo-400',
  'ai-research': 'from-teal-600 to-cyan-400',
  'ai-business': 'from-emerald-600 to-green-400',
  'ai-tools': 'from-cyan-600 to-sky-400',
  'all': 'from-gray-600 to-gray-400',
};

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const gradient = categoryGradients[article.category] || 'from-gray-600 to-gray-400';
  const badge = categoryColors[article.category] || 'bg-gray-500';

  return (
    <div
      className={cn(
        'group relative flex flex-col bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden',
        'border border-gray-100 dark:border-gray-700/60',
        'shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in',
        featured && 'md:flex-row md:h-64'
      )}
    >
      {/* Image */}
      <div className={cn('relative overflow-hidden shrink-0', featured ? 'md:w-80 h-48 md:h-full' : 'h-48')}>
        {article.imageUrl && !imgError ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', gradient)}>
            <span className="text-white/30 text-6xl font-black select-none">AI</span>
          </div>
        )}

        {/* Gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Category badge */}
        <span className={cn('absolute top-3 left-3 px-2.5 py-1 text-white text-xs font-semibold rounded-full shadow-sm', badge)}>
          {getCategoryLabel(article.category)}
        </span>

        {/* Trending badge */}
        {article.isTrending && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm">
            <TrendingUp className="w-3 h-3" />
            Hot
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Source */}
        <span className="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide mb-2">
          {article.source}
        </span>

        {/* Title — stretched link */}
        <h3 className={cn(
          'font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug',
          featured ? 'text-lg line-clamp-3' : 'text-base line-clamp-2'
        )}>
          <Link href={`/article/${article.id}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>

        {/* Description */}
        <p className={cn('text-sm text-gray-500 dark:text-gray-400 flex-1 leading-relaxed', featured ? 'line-clamp-3' : 'line-clamp-2')}>
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/60">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {article.readingTime} min
            </span>
          </div>
          <div className="flex items-center gap-1 relative z-10">
            <a
              href={article.url || article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              aria-label="Open original"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <BookmarkButton article={article} />
          </div>
        </div>
      </div>
    </div>
  );
}
