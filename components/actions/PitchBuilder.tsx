'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Download, Copy, Users, TrendingUp, Eye } from 'lucide-react';
import Image from 'next/image';
import { SearchResult } from '@/lib/types';
import { MatchBadge } from '../results/MatchBadge';

interface PitchBuilderProps {
  selectedResults: SearchResult[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

export function PitchBuilder({ selectedResults, isOpen, onClose, onRemove, onClearAll }: PitchBuilderProps) {
  const totalReach = selectedResults.reduce((acc, r) => acc + r.creator.followerCount, 0);
  const totalViews = selectedResults.reduce((acc, r) => acc + r.viewCount, 0);
  const avgScore = selectedResults.length > 0
    ? Math.round(selectedResults.reduce((acc, r) => acc + r.totalScore, 0) / selectedResults.length)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && selectedResults.length > 0 && (
        <motion.div
          role="dialog"
          aria-labelledby="pitchbuilder-title"
          aria-modal="true"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E0] z-30 shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E5E5E0]">
            <div className="flex items-center gap-4">
              <h2 id="pitchbuilder-title" className="text-base font-semibold text-[#1A1A1A]">
                Build Pitch
              </h2>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full border border-indigo-200">
                {selectedResults.length} creator{selectedResults.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                aria-label="Close pitch builder"
                className="p-2 text-[#9CA3AF] hover:text-[#6B6B6B] hover:bg-[#F5F5F0] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 px-4 py-3 bg-[#F5F5F0] border-b border-[#E5E5E0]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
              <span className="text-xs text-[#6B6B6B]">Combined Reach</span>
              <span className="text-sm font-semibold text-[#1A1A1A] font-data">
                {formatNumber(totalReach)}
              </span>
            </div>
            <div className="w-px h-4 bg-[#E5E5E0]" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
              <span className="text-xs text-[#6B6B6B]">Total Views</span>
              <span className="text-sm font-semibold text-[#1A1A1A] font-data">
                {formatNumber(totalViews)}
              </span>
            </div>
            <div className="w-px h-4 bg-[#E5E5E0]" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
              <span className="text-xs text-[#6B6B6B]">Avg. Match Score</span>
              <span className={`text-sm font-semibold font-data ${avgScore >= 80 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                {avgScore}%
              </span>
            </div>
          </div>

          {/* Selected Creators */}
          <div className="p-4 max-h-48 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {selectedResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 bg-white border border-[#E5E5E0] rounded-lg group shadow-sm"
                >
                  <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {result.creator.avatar ? (
                      <Image
                        src={result.creator.avatar}
                        alt={result.creator.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    ) : null}
                    <span className="absolute inset-0 flex items-center justify-center -z-10">
                      {result.creator.name[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-[#1A1A1A]">
                      @{result.creator.handle}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-[#6B6B6B]">
                        {formatNumber(result.creator.followerCount)} followers
                      </span>
                      <span className="text-[10px] text-emerald-600 font-data">
                        {result.totalScore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-0.5 ml-1">
                    {result.matches.slice(0, 2).map((match) => (
                      <MatchBadge
                        key={match.type}
                        type={match.type}
                        showLabel={false}
                        size="sm"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => onRemove(result.id)}
                    aria-label={`Remove ${result.creator.handle}`}
                    className="p-1 text-[#9CA3AF] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-3 h-3" aria-hidden="true" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-4 border-t border-[#E5E5E0] bg-[#F5F5F0]">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white rounded-lg transition-colors">
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy Links</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-xs text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-white rounded-lg transition-colors">
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Export PDF</span>
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors shadow-md">
              <Send className="w-4 h-4" aria-hidden="true" />
              <span>Generate Pitch</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
