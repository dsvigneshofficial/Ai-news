'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNews } from '@/context/NewsContext';

export function SearchBar() {
  const { searchQuery, setSearchQuery, filteredArticles } = useNews();
  const [inputValue, setInputValue] = useState(searchQuery);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, setSearchQuery]);

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search AI news..."
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 outline-none text-sm transition-all"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="absolute top-full left-0 mt-1 text-xs text-gray-500 dark:text-gray-400">
          {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  );
}
