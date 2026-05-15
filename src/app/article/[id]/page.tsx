'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, ExternalLink, User, Calendar } from 'lucide-react';
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

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        const articles: Article[] = data.articles || [];
        const found = articles.find((a) => a.id === id);

        if (found) {
          setArticle(found);
          const related = articles
            .filter((a) => a.category === found.category && a.id !== found.id)
            .slice(0, 3);
          setRelatedArticles(related);
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-3/4 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Article not found</p>
            <Link
              href="/"
              className="px-6 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News</span>
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <span
            className={cn(
              'inline-block px-3 py-1 text-white text-xs font-medium rounded-full mb-4',
              categoryColors[article.category] || 'bg-gray-500'
            )}
          >
            {getCategoryLabel(article.category)}
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-primary-500">{article.source}</span>
            {article.author && (
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
        </header>

        {/* Hero image */}
        {article.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 sm:h-96 object-cover"
            />
          </div>
        )}

        {/* Article content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base">
            {article.content || article.description}
          </p>
        </article>

        {/* Action bar */}
        <div className="flex items-center gap-3 py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
          <BookmarkButton article={article} />
          <ShareButton url={article.url || article.sourceUrl} title={article.title} />

          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Read Original Article
            </a>
          )}
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
