'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Article, Category } from '@/types/news';

interface NewsContextType {
  articles: Article[];
  filteredArticles: Article[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeCategory: Category;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: Category) => void;
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
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLastFetched(new Date());
    }
  }, []);

  useEffect(() => {
    fetchNews();

    intervalRef.current = setInterval(fetchNews, 300000); // 5 minutes

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchNews]);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === 'all' || article.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
