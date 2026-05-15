'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Article } from '@/types/news';

interface BookmarkContextType {
  bookmarks: Article[];
  addBookmark: (article: Article) => void;
  removeBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  getBookmarks: () => Article[];
  clearBookmarks: () => void;
}

const BookmarkContext = createContext<BookmarkContextType>({
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
  getBookmarks: () => [],
  clearBookmarks: () => {},
});

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Article[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('bookmarks');
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks, mounted]);

  const addBookmark = (article: Article) => {
    setBookmarks((prev) => {
      if (prev.find((a) => a.id === article.id)) return prev;
      return [...prev, article];
    });
  };

  const removeBookmark = (articleId: string) => {
    setBookmarks((prev) => prev.filter((a) => a.id !== articleId));
  };

  const isBookmarked = (articleId: string) => {
    return bookmarks.some((a) => a.id === articleId);
  };

  const getBookmarks = () => bookmarks;

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, addBookmark, removeBookmark, isBookmarked, getBookmarks, clearBookmarks }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
