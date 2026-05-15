export type Category =
  | 'all'
  | 'machine-learning'
  | 'llms'
  | 'computer-vision'
  | 'robotics'
  | 'ai-ethics'
  | 'generative-ai'
  | 'neural-networks'
  | 'ai-research'
  | 'ai-business'
  | 'ai-tools';

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  sourceUrl: string;
  author: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  category: Category;
  readingTime: number;
  isTrending: boolean;
}

export interface NewsSource {
  name: string;
  url: string;
  type: 'rss' | 'api';
  category: Category;
}

export interface NewsResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
}
