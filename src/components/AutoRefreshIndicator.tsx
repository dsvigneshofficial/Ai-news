'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNews } from '@/context/NewsContext';
import { cn } from '@/lib/utils';

export function AutoRefreshIndicator() {
  const { fetchNews, lastFetched, loading } = useNews();
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(300);

  useEffect(() => {
    if (!lastFetched) return;

    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - lastFetched.getTime()) / 1000);
      const remaining = Math.max(0, 300 - elapsed);
      setSecondsUntilRefresh(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [lastFetched]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleManualRefresh = () => {
    fetchNews();
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <span>{formatTime(secondsUntilRefresh)}</span>
        <button
          onClick={handleManualRefresh}
          disabled={loading}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          aria-label="Refresh now"
        >
          <RefreshCw
            className={cn('w-3.5 h-3.5', loading && 'animate-spin')}
          />
        </button>
      </div>
    </div>
  );
}
