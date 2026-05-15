'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Sun, Moon, Bookmark, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { SearchBar } from '@/components/SearchBar';
import { cn } from '@/lib/utils';

export function Header() {
  const { isDark, toggle } = useTheme();
  const { bookmarks } = useBookmarks();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Zap className="w-7 h-7 text-primary-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              AI Pulse
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <SearchBar />
          </div>

          {/* Desktop actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            <Link
              href="/bookmarks"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Bookmarks"
            >
              <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs flex items-center justify-center rounded-full font-medium">
                  {bookmarks.length > 9 ? '9+' : bookmarks.length}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-24 pb-4' : 'max-h-0'
          )}
        >
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
