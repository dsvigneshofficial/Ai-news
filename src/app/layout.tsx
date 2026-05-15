import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { BookmarkProvider } from '@/context/BookmarkContext';
import { NewsProvider } from '@/context/NewsContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI Pulse - AI News Aggregator',
  description:
    'Your curated source for the latest AI news. Stay updated on machine learning, LLMs, computer vision, robotics, and more.',
  keywords: [
    'AI news',
    'artificial intelligence',
    'machine learning',
    'deep learning',
    'LLM',
    'GPT',
    'neural networks',
    'computer vision',
    'robotics',
  ],
  openGraph: {
    title: 'AI Pulse - AI News Aggregator',
    description:
      'Your curated source for the latest AI news from around the web.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <BookmarkProvider>
            <NewsProvider>{children}</NewsProvider>
          </BookmarkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
