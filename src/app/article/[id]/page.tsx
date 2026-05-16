'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, ExternalLink, User, Calendar, TrendingUp } from 'lucide-react';
import { Article } from '@/types/news';
import { formatDate, cn } from '@/lib/utils';
import { getCategoryLabel } from '@/lib/categories';
import { BookmarkButton } from '@/components/BookmarkButton';
import { ShareButton } from '@/components/ShareButton';
import { ArticleCard } from '@/components/ArticleCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

/** Render article content — supports **bold** markdown and paragraph breaks */
function ArticleContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => {
        // Heading lines starting with **Text**
        const headingMatch = para.match(/^\*\*(.+?)\*\*$/);
        if (headingMatch) {
          return (
            <h3
              key={i}
              className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2"
            >
              {headingMatch[1]}
            </h3>
          );
        }

        // Regular paragraph — handle inline **bold**
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed text-base lg:text-lg">
            {parts.map((part, j) => {
              const boldMatch = part.match(/^\*\*(.+?)\*\*$/);
              return boldMatch ? (
                <strong key={j} className="font-semibold text-gray-900 dark:text-white">
                  {boldMatch[1]}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl">
      <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="space-y-3">
        <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="flex gap-4">
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={cn('h-4 bg-gray-200 dark:bg-gray-700 rounded', i % 3 === 2 ? 'w-2/3' : 'w-full')} />
        ))}
      </div>
    </div>
  );
}

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        // First try the efficient single-article endpoint
        const res = await fetch(`/api/news?id=${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.article) {
            setArticle(data.article);
            setRelatedArticles(data.related || []);
            return;
          }
        }
        // Fallback: scan all articles
        const allRes = await fetch('/api/news');
        if (!allRes.ok) throw new Error('Failed to fetch');
        const allData = await allRes.json();
        const articles: Article[] = allData.articles || [];
        const found = articles.find((a) => a.id === id);
        if (found) {
          setArticle(found);
          setRelatedArticles(
            articles.filter((a) => a.category === found.category && a.id !== found.id).slice(0, 3)
          );
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <LoadingSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-8xl font-black text-gray-100 dark:text-gray-800 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article not found</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              This article may have been removed or the link is incorrect.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const gradient = categoryGradients[article.category] || 'from-gray-700 to-gray-500';
  const badge = categoryColors[article.category] || 'bg-gray-500';
  const displayContent = article.content && article.content.length > 100
    ? article.content
    : article.description;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1">
        {/* Hero image banner */}
        <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden">
          {article.imageUrl && !imgError ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={cn('w-full h-full bg-gradient-to-br', gradient)}>
              <span className="absolute inset-0 flex items-center justify-center text-white/10 text-[12rem] font-black select-none">AI</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-transparent to-black/30" />
        </div>

        {/* Article body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-16">

          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          {/* Article card */}
          <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">

            {/* Header section */}
            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700/60">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn('px-3 py-1 text-white text-xs font-semibold rounded-full', badge)}>
                  {getCategoryLabel(article.category)}
                </span>
                {article.isTrending && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
                {article.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-primary-500">{article.source}</span>
                {article.author && article.author !== article.source && (
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readingTime} min read
                </span>
              </div>
            </div>

            {/* Description lead */}
            <div className="px-6 sm:px-8 pt-6">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium border-l-4 border-primary-500 pl-4 italic">
                {article.description}
              </p>
            </div>

            {/* Full content */}
            <div className="px-6 sm:px-8 py-6">
              <ArticleContent content={displayContent} />
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/30">
              <BookmarkButton article={article} />
              <ShareButton url={article.url || article.sourceUrl} title={article.title} />
              <a
                href={article.url || article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 px-5 py-2 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors text-sm shadow-md shadow-primary-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                Read Original Article
              </a>
            </div>
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-primary-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Related Articles</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedArticles.map((related) => (
                  <ArticleCard key={related.id} article={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
