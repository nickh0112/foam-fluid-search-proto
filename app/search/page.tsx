'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchStore } from '@/lib/store';
import { SearchBar } from '@/components/search/SearchBar';
import { QueryInterpretationBar } from '@/components/search/QueryInterpretationBar';
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { CreatorCard } from '@/components/results/CreatorCard';
import { ContentDetailModal } from '@/components/results/ContentDetailModal';
import { CrossSellPanel } from '@/components/actions/CrossSellPanel';
import { PitchBuilder } from '@/components/actions/PitchBuilder';
import { SearchResult } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface CreatorGroup {
  creator: SearchResult['creator'];
  results: SearchResult[];
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const {
    expansions,
    results,
    selectedResults,
    isLoading,
    sortBy,
    executeSearch,
    removeExpansion,
    toggleExpansion,
    toggleResultSelection,
    clearSelection,
    setSortBy,
  } = useSearchStore();

  const [crossSellResult, setCrossSellResult] = useState<SearchResult | null>(null);
  const [showPitchBuilder, setShowPitchBuilder] = useState(false);
  const [selectedContentResult, setSelectedContentResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (query) {
      executeSearch(query);
    }
  }, [query, executeSearch]);

  useEffect(() => {
    if (selectedResults.length > 0) {
      setShowPitchBuilder(true);
    }
  }, [selectedResults]);

  const handleSearch = (newQuery: string) => {
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(newQuery)}`);
    executeSearch(newQuery);
  };

  const uniqueCreatorCount = new Set(results.map((r) => r.creator.id)).size;

  const selectedResultObjects = results.filter((r) => selectedResults.includes(r.id));

  // Group results by creator
  const creatorGroups = useMemo(() => {
    const groups: Map<string, CreatorGroup> = new Map();

    results.forEach((result) => {
      const existing = groups.get(result.creator.id);
      if (existing) {
        existing.results.push(result);
      } else {
        groups.set(result.creator.id, {
          creator: result.creator,
          results: [result],
        });
      }
    });

    // Sort groups by best score
    return Array.from(groups.values()).sort((a, b) => {
      const bestA = Math.max(...a.results.map(r => r.totalScore));
      const bestB = Math.max(...b.results.map(r => r.totalScore));
      return bestB - bestA;
    });
  }, [results]);

  // Handle selecting all results for a creator
  const handleCreatorSelect = (creatorId: string, resultIds: string[]) => {
    const allSelected = resultIds.every(id => selectedResults.includes(id));
    resultIds.forEach(id => {
      if (allSelected) {
        // Deselect all if all are selected
        if (selectedResults.includes(id)) {
          toggleResultSelection(id);
        }
      } else {
        // Select all if not all are selected
        if (!selectedResults.includes(id)) {
          toggleResultSelection(id);
        }
      }
    });
  };

  // Check if all results for a creator are selected
  const isCreatorSelected = (resultIds: string[]) => {
    return resultIds.length > 0 && resultIds.every(id => selectedResults.includes(id));
  };

  // Handle adding result to pitch from modal
  const handleAddToPitchFromModal = (result: SearchResult) => {
    if (!selectedResults.includes(result.id)) {
      toggleResultSelection(result.id);
    }
    setSelectedContentResult(null);
  };

  // Handle viewing cross-sell from modal
  const handleViewCrossSellFromModal = (result: SearchResult) => {
    setSelectedContentResult(null);
    setCrossSellResult(result);
  };


  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#F5F5F0]/95 backdrop-blur-sm border-b border-[#E5E5E0]">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">f</span>
            </div>
          </Link>
          <div className="flex-1 max-w-2xl">
            <SearchBar initialValue={query} onSearch={handleSearch} compact />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-6 w-full">
        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" aria-hidden="true" />
              <p className="text-sm text-[#6B6B6B]">Searching across all content layers...</p>
            </motion.div>
          )}

          {!isLoading && expansions.length > 0 && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Query Interpretation Bar */}
              <QueryInterpretationBar
                expansions={expansions}
                onRemove={removeExpansion}
                onToggle={toggleExpansion}
              />

              {/* Results Header */}
              <ResultsHeader
                resultCount={results.length}
                creatorCount={uniqueCreatorCount}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Results Feed - Always show bundled creator cards */}
              <div className="space-y-3 pb-32">
                <AnimatePresence mode="popLayout">
                  {creatorGroups.map((group, index) => (
                    <CreatorCard
                      key={group.creator.id}
                      creator={group.creator}
                      results={group.results}
                      index={index}
                      isSelected={isCreatorSelected(group.results.map(r => r.id))}
                      onSelect={handleCreatorSelect}
                      onCrossSell={(r) => setCrossSellResult(r)}
                      onResultClick={(r) => setSelectedContentResult(r)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {!isLoading && expansions.length === 0 && query && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-[#6B6B6B] mb-2">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-[#9CA3AF]">
                Try searching for &quot;Crocs&quot; to see the demo
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Content Detail Modal */}
      <ContentDetailModal
        result={selectedContentResult}
        isOpen={!!selectedContentResult}
        onClose={() => setSelectedContentResult(null)}
        onAddToPitch={handleAddToPitchFromModal}
        onViewCrossSell={handleViewCrossSellFromModal}
      />

      {/* Cross-Sell Panel */}
      <CrossSellPanel
        result={crossSellResult}
        isOpen={!!crossSellResult}
        onClose={() => setCrossSellResult(null)}
      />

      {/* Pitch Builder */}
      <PitchBuilder
        selectedResults={selectedResultObjects}
        isOpen={showPitchBuilder}
        onClose={() => setShowPitchBuilder(false)}
        onRemove={toggleResultSelection}
        onClearAll={clearSelection}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" aria-hidden="true" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
