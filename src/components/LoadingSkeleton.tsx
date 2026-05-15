import React from 'react';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
        <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
