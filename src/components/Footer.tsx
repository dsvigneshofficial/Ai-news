import React from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-6 h-6 text-primary-500" />
              <span className="text-lg font-bold text-white">AI Pulse</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your curated source for AI news from around the web. Stay updated on the latest developments in artificial intelligence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/bookmarks" className="hover:text-white transition-colors">
                  Saved Articles
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-white font-semibold mb-3">Data Sources</h4>
            <ul className="space-y-2 text-sm">
              <li>Google News AI</li>
              <li>TechCrunch AI</li>
              <li>The Verge AI</li>
              <li>MIT Technology Review</li>
              <li>VentureBeat AI</li>
              <li>ArXiv AI</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} AI Pulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
