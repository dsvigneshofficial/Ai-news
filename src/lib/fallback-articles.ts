/**
 * fallback-articles.ts
 *
 * These articles are shown ONLY when every live RSS source and the NewsAPI
 * call have all failed (e.g. network is completely unavailable).
 * They are clearly labelled "Demo" so users know they are not real live news.
 *
 * In normal operation the site fetches 18+ live RSS feeds and the NewsAPI,
 * so this file should never be used in production.
 */
import { Article } from '@/types/news';

const now = Date.now();

export const fallbackArticles: Article[] = [
  {
    id: 'demo-001',
    title: '[Demo] Welcome to AI Pulse — Live News Loading…',
    description:
      'You are seeing demo content because the live news feeds could not be reached right now. Please refresh in a moment. AI Pulse normally pulls from 18+ real-time sources including TechCrunch, The Verge, VentureBeat, MIT Technology Review, ArXiv, DeepMind Blog, and more.',
    content:
      'You are seeing demo content because the live news feeds could not be reached right now. Please refresh the page in a moment and real articles will load automatically.\n\nAI Pulse normally pulls from 18+ real-time sources including TechCrunch, The Verge, VentureBeat, MIT Technology Review, ArXiv, DeepMind Blog, Hugging Face, OpenAI Blog, and more — refreshed every 5 minutes.',
    source: 'AI Pulse',
    sourceUrl: '/',
    author: 'AI Pulse',
    url: '/',
    imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    publishedAt: new Date(now).toISOString(),
    category: 'all',
    readingTime: 1,
    isTrending: false,
  },
  {
    id: 'demo-002',
    title: '[Demo] What is AI Pulse?',
    description:
      'AI Pulse is a real-time AI news aggregator that curates articles from the best technology and AI publications around the web, refreshing every 5 minutes.',
    content:
      'AI Pulse is a real-time AI news aggregator that curates articles from the best technology and AI publications around the web.\n\nSources include TechCrunch, The Verge, VentureBeat, Wired, MIT Technology Review, ArXiv CS.AI, ArXiv CS.LG, DeepMind Blog, OpenAI Blog, Hugging Face Blog, IEEE Spectrum, ZDNET, InfoWorld, Analytics Vidhya, Towards Data Science, Ars Technica, The Batch by deeplearning.ai, and AI News.\n\nArticles are refreshed every 5 minutes automatically. Use the category bar to filter by topic — Machine Learning, LLMs, Generative AI, Robotics, Computer Vision, AI Ethics, Neural Networks, AI Research, AI Business, and AI Tools.',
    source: 'AI Pulse',
    sourceUrl: '/',
    author: 'AI Pulse',
    url: '/',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    publishedAt: new Date(now - 60_000).toISOString(),
    category: 'all',
    readingTime: 1,
    isTrending: false,
  },
];
