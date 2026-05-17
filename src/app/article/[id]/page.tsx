'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  User,
  Calendar,
  TrendingUp,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { Article } from '@/types/news';
import { formatDate, cn, cleanHtml } from '@/lib/utils';
import { getCategoryLabel } from '@/lib/categories';
import { BookmarkButton } from '@/components/BookmarkButton';
import { ShareButton } from '@/components/ShareButton';
import { ArticleCard } from '@/components/ArticleCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// ─── category colour maps ───────────────────────────────────────────────────
const BADGE: Record<string, string> = {
  'machine-learning': 'bg-blue-500',
  llms: 'bg-purple-500',
  'computer-vision': 'bg-green-500',
  robotics: 'bg-orange-500',
  'ai-ethics': 'bg-yellow-500',
  'generative-ai': 'bg-pink-500',
  'neural-networks': 'bg-indigo-500',
  'ai-research': 'bg-teal-500',
  'ai-business': 'bg-emerald-500',
  'ai-tools': 'bg-cyan-500',
  all: 'bg-gray-500',
};
const GRADIENT: Record<string, string> = {
  'machine-learning': 'from-blue-700 to-blue-500',
  llms: 'from-purple-700 to-violet-500',
  'computer-vision': 'from-green-700 to-emerald-500',
  robotics: 'from-orange-700 to-amber-500',
  'ai-ethics': 'from-yellow-700 to-yellow-500',
  'generative-ai': 'from-pink-700 to-rose-500',
  'neural-networks': 'from-indigo-700 to-indigo-500',
  'ai-research': 'from-teal-700 to-cyan-500',
  'ai-business': 'from-emerald-700 to-green-500',
  'ai-tools': 'from-cyan-700 to-sky-500',
  all: 'from-gray-700 to-gray-500',
};

// ─── Strip HTML from content at render time ─────────────────────────────────
// This ensures that even if the server sends content with HTML tags/entities
// (e.g. Google News RSS wraps titles in <a> and <font> tags), we show clean text.
function cleanTextForDisplay(raw: string): string {
  return raw
    // Remove <style> / <script> blocks entirely
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    // Replace <br>, <p>, <div> endings with newlines so we get paragraph breaks
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    // Collapse whitespace within lines
    .replace(/[ \t]+/g, ' ')
    // Collapse more than 2 newlines into 2
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── ArticleContent ─────────────────────────────────────────────────────────
// Renders article body text with paragraph breaks and basic formatting.
function ArticleContent({ content, sourceUrl }: { content: string; sourceUrl: string }) {
  // First, ensure we're working with clean plain text (no HTML tags/entities)
  const cleanContent = cleanTextForDisplay(content);

  const isTruncated =
    cleanContent.endsWith('…') ||
    cleanContent.endsWith('...') ||
    cleanContent.length < 400;

  // Split into paragraphs on double newlines
  const paragraphs = cleanContent.split(/\n\n+/).filter((p) => p.trim().length > 0);

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();

        // Standalone **Heading**
        const headingMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
        if (headingMatch) {
          return (
            <h3
              key={i}
              className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-1 leading-snug"
            >
              {headingMatch[1]}
            </h3>
          );
        }

        // Regular paragraph with possible inline **bold**
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p
            key={i}
            className="text-gray-700 dark:text-gray-300 leading-relaxed text-base lg:text-[17px]"
          >
            {parts.map((part, j) => {
              const bold = part.match(/^\*\*(.+?)\*\*$/);
              return bold ? (
                <strong key={j} className="font-semibold text-gray-900 dark:text-white">
                  {bold[1]}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              );
            })}
          </p>
        );
      })}

      {/* When RSS only gives a snippet, guide the user to the original */}
      {isTruncated && sourceUrl && sourceUrl !== '/' && (
        <div className="mt-8 p-5 rounded-2xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-1">
                Full article available on the original source
              </p>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">
                RSS feeds often provide only a preview. Click below to read the complete article.
              </p>
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Read Full Article
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl">
      <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
      </div>
      <div className="flex gap-4">
        {[1, 2, 3].map((k) => (
          <div key={k} className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
      <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="space-y-3">
        {[100, 100, 100, 75, 100, 100, 60].map((w, i) => (
          <div
            key={i}
            className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ArticlePage() {
  const { id } = useParams() as { id: string };

  const [article, setArticle]           = useState<Article | null>(null);
  const [related, setRelated]           = useState<Article[]>([]);
  const [loading, setLoading]           = useState(true);
  const [notFound, setNotFound]         = useState(false);
  const [imgError, setImgError]         = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Efficient single-article lookup
        const ts  = Date.now();
        const res = await fetch(`/api/news?id=${encodeURIComponent(id)}&_t=${ts}`, {
          cache: 'no-store',
        });

        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.article) {
            setArticle(data.article);
            setRelated(data.related ?? []);
            return;
          }
        }

        // Fallback: scan full list (handles edge cases like stale IDs)
        const all = await fetch(`/api/news?_t=${ts}`, { cache: 'no-store' });
        if (!all.ok) throw new Error('Failed to fetch articles');
        const allData = await all.json();
        const found   = (allData.articles ?? []).find((a: Article) => a.id === id);

        if (!cancelled) {
          if (found) {
            setArticle(found);
            setRelated(
              (allData.articles ?? [])
                .filter((a: Article) => a.category === found.category && a.id !== found.id)
                .slice(0, 3)
            );
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton />
        </main>
        <Footer />
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Article not found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              This article may have been removed or the link is incorrect.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Article ────────────────────────────────────────────────────────────────
  const gradient  = GRADIENT[article.category] ?? GRADIENT['all'];
  const badge     = BADGE[article.category]    ?? BADGE['all'];
  const externalUrl = article.url || article.sourceUrl;

  // Choose the richest content available
  const bodyText =
    article.content && article.content.length > article.description.length
      ? article.content
      : article.description;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-1">
        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <div className="relative w-full h-64 sm:h-80 lg:h-[26rem] overflow-hidden">
          {article.imageUrl && !imgError ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={cn('w-full h-full bg-gradient-to-br', gradient)}>
              <span className="absolute inset-0 flex items-center justify-center text-white/10 text-[12rem] font-black select-none">
                AI
              </span>
            </div>
          )}
          {/* Fade into page background at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-transparent to-black/20" />
        </div>

        {/* ── Body ────────────────────────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">

          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400
                       hover:text-primary-500 transition-colors mb-6
                       bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
                       px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          {/* ── Article card ────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 dark:border-gray-700/60">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={cn('px-3 py-1 text-white text-xs font-bold rounded-full', badge)}>
                  {getCategoryLabel(article.category)}
                </span>
                {article.isTrending && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-5">
                {cleanHtml(article.title)}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-primary-500">{article.source}</span>
                {article.author && article.author !== article.source && (
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {article.author}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readingTime} min read
                </span>
              </div>
            </div>

            {/* Lead / description */}
            <div className="px-6 sm:px-8 pt-6 pb-2">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-medium border-l-4 border-primary-500 pl-4 italic">
                {cleanHtml(article.description)}
              </p>
            </div>

            {/* Main body */}
            <div className="px-6 sm:px-8 py-6">
              <ArticleContent content={bodyText} sourceUrl={externalUrl} />
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3 px-6 sm:px-8 py-4 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/60 dark:bg-gray-900/30">
              <BookmarkButton article={article} />
              <ShareButton url={externalUrl} title={article.title} />
              {externalUrl && externalUrl !== '/' && (
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors shadow-md shadow-primary-500/20"
                >
                  <ExternalLink className="w-4 h-4" />
                  Read Full Article
                </a>
              )}
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-primary-500 rounded-full" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Related Articles
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((r) => (
                  <ArticleCard key={r.id} article={r} />
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
