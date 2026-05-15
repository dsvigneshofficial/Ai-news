'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/context/BookmarkContext';
import { Article } from '@/types/news';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  article: Article;
  className?: string;
}

export function BookmarkButton({ article, className }: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95',
        bookmarked
          ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/30'
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
        className
      )}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <Bookmark
        className={cn('w-5 h-5', bookmarked && 'fill-current')}
      />
    </button>
  );
}
