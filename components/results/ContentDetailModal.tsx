'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Plus, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { SearchResult, MatchType } from '@/lib/types';
import { MatchBadge } from './MatchBadge';

interface ContentDetailModalProps {
  result: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToPitch: (result: SearchResult) => void;
  onViewCrossSell: (result: SearchResult) => void;
}

const matchTypeLabels: Record<MatchType, string> = {
  visual: 'Visual Match',
  audio: 'Audio Match',
  caption: 'Caption Match',
  notes: 'Notes Match',
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ContentDetailModal({
  result,
  isOpen,
  onClose,
  onAddToPitch,
  onViewCrossSell,
}: ContentDetailModalProps) {
  if (!result) return null;

  const modifierPoints = result.modifiers?.reduce((acc, m) => acc + m.value, 0) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[900px] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E0]">
              <h2 className="font-semibold text-[#1A1A1A] text-lg">Content Details</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#F5F5F0] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-[#6B6B6B]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Video Preview */}
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#E5E5E0] mb-4">
                    {result.thumbnail && (
                      <Image
                        src={result.freezeFrame || result.thumbnail}
                        alt={result.videoTitle}
                        fill
                        className="object-cover"
                        sizes="400px"
                      />
                    )}
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 text-[#1A1A1A] ml-1" />
                      </div>
                    </div>
                    {/* Timestamp badge */}
                    {result.freezeFrameTimestamp && (
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 rounded-lg text-sm font-mono text-emerald-400">
                        @{result.freezeFrameTimestamp}
                      </div>
                    )}
                  </div>

                  {/* Video Title & Metadata */}
                  <h3 className="font-semibold text-[#1A1A1A] text-lg mb-2">
                    {result.videoTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-4">
                    <span className="font-medium text-indigo-600">@{result.creator.handle}</span>
                    <span>•</span>
                    <span>{formatDate(result.postedDate)}</span>
                    <span>•</span>
                    <span>{formatNumber(result.viewCount)} views</span>
                  </div>

                  {/* Score Section */}
                  <div className="bg-[#F5F5F0] rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#6B6B6B]">Match Score</span>
                      <span className={`text-2xl font-bold ${
                        result.totalScore >= 90
                          ? 'text-emerald-600'
                          : result.totalScore >= 70
                            ? 'text-indigo-600'
                            : 'text-[#6B6B6B]'
                      }`}>
                        {result.totalScore}%
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2.5 bg-[#E5E5E0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.totalScore}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          result.totalScore >= 90
                            ? 'bg-emerald-500'
                            : result.totalScore >= 70
                              ? 'bg-indigo-500'
                              : 'bg-[#9CA3AF]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[#6B6B6B] mb-2">Score Breakdown</h4>
                    {result.matches.map((match) => (
                      <div key={match.type} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <MatchBadge type={match.type} size="sm" showLabel={false} />
                          <span className="text-[#1A1A1A]">{matchTypeLabels[match.type]}</span>
                        </div>
                        <span className="font-mono font-medium text-[#1A1A1A]">{match.score} pts</span>
                      </div>
                    ))}
                    {result.modifiers && result.modifiers.length > 0 && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t border-[#E5E5E0]">
                        <span className="text-[#6B6B6B]">Modifiers</span>
                        <span className="font-mono font-medium text-emerald-600">+{modifierPoints} pts</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Why Flagged */}
                <div>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100">
                    <h4 className="font-semibold text-[#1A1A1A] mb-4 flex items-center gap-2">
                      <span className="text-lg">Why this was flagged</span>
                    </h4>

                    <div className="space-y-4">
                      {result.matches.map((match) => (
                        <div key={match.type} className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <MatchBadge type={match.type} size="md" showLabel={false} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-[#1A1A1A]">
                                  {matchTypeLabels[match.type]}
                                </span>
                                {match.timestamp && (
                                  <span className="px-2 py-0.5 bg-[#F5F5F0] rounded text-xs font-mono text-[#6B6B6B]">
                                    @{match.timestamp}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                                {match.evidence}
                              </p>
                              {match.details && (
                                <p className="text-xs text-[#9CA3AF] mt-1 italic">
                                  {match.details}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Modifiers */}
                    {result.modifiers && result.modifiers.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-indigo-100">
                        <h5 className="text-sm font-medium text-[#6B6B6B] mb-2">Score Modifiers</h5>
                        <div className="space-y-1">
                          {result.modifiers.map((modifier, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-[#1A1A1A]">{modifier.label}</span>
                              <span className="font-mono text-emerald-600">+{modifier.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Brand Affinity Section */}
                  {result.brandAffinity && (
                    <div className="mt-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                      <h4 className="font-semibold text-[#1A1A1A] mb-3 flex items-center gap-2">
                        <span className="text-lg">{result.brandAffinity.brand} Affinity</span>
                      </h4>

                      <div className="space-y-3">
                        {/* Partnership */}
                        {result.brandAffinity.partnership && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-[#6B6B6B] uppercase">Partnership:</span>
                            <span className="text-sm text-[#1A1A1A] font-medium">{result.brandAffinity.partnership}</span>
                          </div>
                        )}

                        {/* Mention Frequency */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#6B6B6B] uppercase">Mention Frequency:</span>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                            result.brandAffinity.mentionFrequency === 'high'
                              ? 'bg-emerald-100 text-emerald-700'
                              : result.brandAffinity.mentionFrequency === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-700'
                          }`}>
                            {result.brandAffinity.mentionFrequency.charAt(0).toUpperCase() + result.brandAffinity.mentionFrequency.slice(1)}
                          </span>
                        </div>

                        {/* Brand Alignment Tags */}
                        <div>
                          <span className="text-xs font-medium text-[#6B6B6B] uppercase block mb-2">Brand Alignment:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {result.brandAffinity.brandAlignment.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-white rounded-md text-xs text-[#6B6B6B] border border-amber-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-[#E5E5E0] bg-[#F5F5F0]/50 flex items-center justify-between">
              <button
                onClick={() => window.open(result.videoUrl, '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Original
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onViewCrossSell(result)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Cross-Sell
                </button>
                <button
                  onClick={() => onAddToPitch(result)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to Pitch
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
