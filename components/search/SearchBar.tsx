'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const placeholderExamples = [
  'coffee morning routine',
  'Nike sneakers',
  'Crocs',
  'fitness transformation',
  'Stanley cup',
  'skincare routine',
];

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  compact?: boolean;
}

export function SearchBar({ initialValue = '', onSearch, autoFocus = false, compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isFocused && !query) {
      const interval = setInterval(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isFocused, query]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      setShowSuggestions(false);
    }
  };

  const suggestions = query.length > 0 ? [
    `${query} in cooking videos`,
    `${query} unboxing`,
    `${query} review`,
    `creators wearing ${query}`,
  ] : [];

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`
            relative flex items-center gap-3
            ${compact ? 'px-4 py-2.5' : 'px-5 py-4'}
            bg-white border border-[#E5E5E0] rounded-xl shadow-sm
            transition-all duration-200
            ${isFocused ? 'border-indigo-500/50 ring-2 ring-indigo-500/20 shadow-md' : 'hover:border-[#D1D5DB]'}
          `}
        >
          <Search className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-[#9CA3AF] flex-shrink-0`} aria-hidden="true" />

          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="search"
              name="search"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => {
                setIsFocused(true);
                if (query.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className={`
                w-full bg-transparent outline-none
                ${compact ? 'text-sm' : 'text-base'}
                text-[#1A1A1A] placeholder-transparent
                font-medium tracking-tight
              `}
              placeholder="Search for Crocs, Nike..."
            />

            <AnimatePresence mode="wait">
              {!query && !isFocused && (
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`
                    absolute left-0 top-1/2 -translate-y-1/2
                    ${compact ? 'text-sm' : 'text-base'}
                    text-[#9CA3AF] pointer-events-none
                  `}
                >
                  Search for &ldquo;{placeholderExamples[placeholderIndex]}&rdquo;...
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {!compact && (
            <div className="flex items-center gap-2">
              <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[#6B6B6B] bg-[#F5F5F0] border border-[#E5E5E0] rounded-md font-mono">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            </div>
          )}
        </div>
      </form>

      {/* Predictive Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 py-2 bg-white border border-[#E5E5E0] rounded-xl shadow-lg overflow-hidden z-50"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  if (onSearch) {
                    onSearch(suggestion);
                  } else {
                    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                  }
                  setShowSuggestions(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#F5F5F0] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <span className="text-sm text-[#1A1A1A]">{suggestion}</span>
                {index === 0 && (
                  <span className="ml-auto text-xs text-[#6B6B6B] bg-[#F5F5F0] border border-[#E5E5E0] px-2 py-0.5 rounded">
                    Suggested
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
