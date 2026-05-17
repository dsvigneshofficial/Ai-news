'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { useNews } from '@/context/NewsContext';
import { formatDate, cn, cleanHtml } from '@/lib/utils';
import { getCategoryLabel } from '@/lib/categories';
import { Article } from '@/types/news';

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
  'machine-learning': 'from-blue-700 to-blue-500',
  'llms': 'from-purple-700 to-violet-500',
  'computer-vision': 'from-green-700 to-emerald-500',
  'robotics': 'from-orange-700 to-amber-500',
  'ai-ethics': 'from-yellow-700 to-yellow-500',
  'generative-ai': 'from-pink-700 to-rose-500',
  'neural-networks': 'from-indigo-700 to-indigo-500',
  'ai-research': 'from-teal-700 to-cyan-500',
  'ai-business': 'from-emerald-700 to-green-500',
  'ai-tools': 'from-cyan-700 to-sky-500',
  'all': 'from-gray-700 to-gray-500',
};

function HeroCard({ article }: { article: Article }) {
  const [imgError, setImgError] = useState(false);
  const gradient = categoryGradients[article.category] || 'from-gray-700 to-gray-500';
  const badge = categoryColors[article.category] || 'bg-gray-500';

  return (
    <Link
      href={`/article/${article.id}`}
      className="group relative rounded-2xl overflow-hidden block h-72 lg:h-full min-h-[20rem]"
    >
      {/* Background image or gradient */}
      {article.imageUrl && !imgError ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)}>
          <span className="absolute inset-0 flex items-center justify-center text-white/10 text-9xl font-black select-none">AI</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
            <TrendingUp className="w-3 h-3" />
            Trending
          </span>
          <span className={cn('px-2.5 py-1 text-white text-xs font-semibold rounded-full', badge)}>
            {getCategoryLabel(article.category)}
          </span>
        </div>

        <h3 className="text-xl lg:text-2xl font-bold text-white leading-snug mb-3 line-clamp-3 group-hover:text-primary-300 transition-colors">
          {cleanHtml(article.title)}
        </h3>

        <p className="text-sm text-gray-300 line-clamp-2 mb-4 hidden sm:block">
          {cleanHtml(article.description)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="font-medium text-primary-400">{article.source}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-white/70 group-hover:text-white transition-colors">
            Read more <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SideCard({ article, rank }: { article: Article; rank: number }) {
  const [imgError, setImgError] = useState(false);
  const gradient = categoryGradients[article.category] || 'from-gray-700 to-gray-500';

  return (
    <Link
      href={`/article/${article.id}`}
      className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      {/* Rank number */}
      <span className="text-3xl font-black text-gray-100 dark:text-gray-700 w-8 shrink-0 leading-none mt-1 select-none">
        {rank}
      </span>

      {/* Thumbnail */}
      <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
        {article.imageUrl && !imgError ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={cn('w-full h-full bg-gradient-to-br', gradient)} />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
          {cleanHtml(article.title)}
        </h4>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
          <span className="font-medium text-primary-500 truncate">{article.source}</span>
          <span className="flex items-center gap-0.5 shrink-0">
            <Clock className="w-3 h-3" />
            {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TrendingSection() {
  const { articles, loading } = useNews();

  if (loading || articles.length === 0) return null;

  const trending = articles.filter((a) => a.isTrending);
  const displayArticles: Article[] =
    trending.length >= 4 ? trending.slice(0, 4) : articles.slice(0, 4);

  if (displayArticles.length === 0) return null;

  const [hero, ...sideArticles] = displayArticles;

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-red-500 rounded-full" />
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
        </div>
        <Link
          href="/"
          className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Hero card — takes 3/5 columns */}
        <div className="lg:col-span-3">
          <HeroCard article={hero} />
        </div>

        {/* Side cards — takes 2/5 columns */}
        <div className="lg:col-span-2 flex flex-col justify-between gap-1 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm p-2">
          <div className="px-3 pt-2 pb-1">
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Also Trending
            </span>
          </div>
          {sideArticles.map((article, i) => (
            <SideCard key={article.id} article={article} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
