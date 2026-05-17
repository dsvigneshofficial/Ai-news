'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Article, Category } from '@/types/news';

const REFRESH_MS = 5 * 60 * 1000; // 5 minutes

interface NewsContextType {
  articles: Article[];
  filteredArticles: Article[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeCategory: Category;
  setSearchQuery: (q: string) => void;
  setActiveCategory: (c: Category) => void;
  fetchNews: () => Promise<void>;
  lastFetched: Date | null;
}

const NewsContext = createContext<NewsContextType>({
  articles: [],
  filteredArticles: [],
  loading: false,
  error: null,
  searchQuery: '',
  activeCategory: 'all',
  setSearchQuery: () => {},
  setActiveCategory: () => {},
  fetchNews: async () => {},
  lastFetched: null,
});

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles]           = useState<Article[]>([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lastFetched, setLastFetched]     = useState<Date | null>(null);
  const intervalRef                       = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Append a timestamp so neither the browser nor Vercel's CDN
      // can serve a cached response — every call hits the origin fresh.
      const ts  = Date.now();
      const res = await fetch(`/api/news?_t=${ts}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const incoming: Article[] = data.articles ?? [];

      if (incoming.length > 0) {
        setArticles(incoming);
        setError(null);
      } else if (articles.length === 0) {
        // Only show an error when we have nothing at all to display
        setError('No articles found — check back shortly.');
      }
    } catch (err) {
      console.error('[NewsContext] fetch error:', err);
      // Keep existing articles if we already loaded some; don't wipe the UI
      if (articles.length === 0) {
        setError(err instanceof Error ? err.message : 'Failed to load news');
      }
    } finally {
      setLoading(false);
      setLastFetched(new Date());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial load + auto-refresh every 5 minutes
  useEffect(() => {
    fetchNews();
    intervalRef.current = setInterval(fetchNews, REFRESH_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchNews]);

  // Client-side filter (category + search)
  const filteredArticles = articles.filter((a) => {
    const catOk    = activeCategory === 'all' || a.category === activeCategory;
    const searchOk =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.source.toLowerCase().includes(searchQuery.toLowerCase());
    return catOk && searchOk;
  });

  return (
    <NewsContext.Provider
      value={{
        articles,
        filteredArticles,
        loading,
        error,
        searchQuery,
        activeCategory,
        setSearchQuery,
        setActiveCategory,
        fetchNews,
        lastFetched,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  return useContext(NewsContext);
}
