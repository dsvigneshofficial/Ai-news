'use client';

import React from 'react';
import {
  Newspaper,
  Brain,
  MessageSquare,
  Eye,
  Bot,
  Scale,
  Sparkles,
  Network,
  FlaskConical,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { useNews } from '@/context/NewsContext';
import { categories } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { Category } from '@/types/news';

const iconMap: Record<string, React.ReactNode> = {
  Newspaper: <Newspaper className="w-4 h-4" />,
  Brain: <Brain className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Eye: <Eye className="w-4 h-4" />,
  Bot: <Bot className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Network: <Network className="w-4 h-4" />,
  FlaskConical: <FlaskConical className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
};

export function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useNews();

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-4">
      <div className="flex gap-2 min-w-max px-4 sm:px-0">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug as Category)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {iconMap[cat.icon]}
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
