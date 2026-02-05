'use client';

import { motion } from 'framer-motion';
import { SearchBar } from '@/components/search/SearchBar';
import { Clock, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { recentSearches, trendingOnRoster } from '@/data/mock-data';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#E5E5E0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">f</span>
            </div>
            <span className="font-display font-semibold text-lg text-[#1A1A1A] tracking-tight">
              foam.io
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
              Roster
            </a>
            <a href="#" className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
              Campaigns
            </a>
            <a href="#" className="text-sm text-indigo-600 font-medium">
              Search
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 -mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          {/* Hero */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl font-semibold text-[#1A1A1A] mb-3 tracking-tight text-balance"
            >
              Unified Search
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[#6B6B6B] text-base"
            >
              Find authentic brand mentions across visual, audio, captions, and notes
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SearchBar autoFocus />
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid grid-cols-2 gap-4"
          >
            {/* Recent Searches */}
            <div className="p-4 bg-white border border-[#E5E5E0] rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
                <span className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Recent Searches
                </span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <Link
                    key={search}
                    href={`/search?q=${encodeURIComponent(search)}`}
                    className="block px-3 py-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-lg transition-colors"
                  >
                    {search}
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending on Roster */}
            <div className="p-4 bg-white border border-[#E5E5E0] rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <span className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Trending on Your Roster
                </span>
              </div>
              <div className="space-y-1">
                {trendingOnRoster.map((item) => (
                  <Link
                    key={item.term}
                    href={`/search?q=${encodeURIComponent(item.term)}`}
                    className="flex items-center justify-between px-3 py-2 hover:bg-[#F5F5F0] rounded-lg transition-colors group"
                  >
                    <span className="text-sm text-[#6B6B6B] group-hover:text-[#1A1A1A] transition-colors">
                      {item.term}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#9CA3AF] font-data">
                        {item.count} mentions
                      </span>
                      {item.trend === 'up' && (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center justify-center gap-6 text-xs text-[#6B6B6B]"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Visual Detection
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Audio Transcription
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Caption Analysis
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              Manager Notes
            </span>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E0] py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-[#9CA3AF]">
          <span>foam.io Unified Search — High-Fidelity Prototype</span>
          <span>Demo: &quot;Crocs Just Called&quot; Journey</span>
        </div>
      </footer>
    </div>
  );
}
