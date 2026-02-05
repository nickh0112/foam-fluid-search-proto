'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ExternalLink,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Clock,
  Eye as EyeIcon,
  CheckCircle2,
} from 'lucide-react';
import Image from 'next/image';
import { SearchResult } from '@/lib/types';
import { MatchBadge } from './MatchBadge';
import { ScoreBreakdown } from './ScoreBreakdown';

interface ResultCardProps {
  result: SearchResult;
  index: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onCrossSell?: (result: SearchResult) => void;
}

const platformIcons: Record<string, string> = {
  tiktok: '📱',
  instagram: '📷',
  youtube: '▶️',
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCardVariant(result: SearchResult): 'visual' | 'triple' | 'audio' | 'notes' | 'default' {
  const matchTypes = result.matches.map(m => m.type);

  if (matchTypes.length >= 3) return 'triple';
  if (matchTypes.length === 1) {
    if (matchTypes[0] === 'visual') return 'visual';
    if (matchTypes[0] === 'audio') return 'audio';
    if (matchTypes[0] === 'notes') return 'notes';
  }
  return 'default';
}

export function ResultCard({ result, index, isSelected, onSelect, onCrossSell }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const variant = getCardVariant(result);
  const primaryMatch = result.matches[0];
  const showFreezeFrame = variant === 'visual' || variant === 'triple';
  const showWaveform = variant === 'audio';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.02 }}
      className={`
        group relative bg-white border rounded-xl overflow-hidden shadow-sm
        transition-all duration-200
        ${isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
          : 'border-[#E5E5E0] hover:border-[#D1D5DB] hover:shadow-md'
        }
      `}
    >
      <div className="flex">
        {/* Thumbnail Section */}
        <div className="relative w-48 h-36 flex-shrink-0 bg-[#F5F5F0]">
          {/* Actual thumbnail image */}
          {result.thumbnail && (
            <Image
              src={showFreezeFrame && result.freezeFrame ? result.freezeFrame : result.thumbnail}
              alt={result.videoTitle}
              fill
              className="object-cover"
              sizes="192px"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          )}

          {/* Fallback gradient (shows if no image or image fails) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#E5E5E0] to-[#F5F5F0] -z-10" />

          {/* Freeze frame visual indicator overlay */}
          {showFreezeFrame && result.freezeFrameTimestamp && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent">
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg">
                  <EyeIcon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Waveform overlay for audio-only */}
          {showWaveform && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="flex items-end gap-1 h-12">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 4 }}
                    animate={{ height: 4 + Math.random() * 40 }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: i * 0.1,
                    }}
                    className="w-1.5 bg-amber-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Notes icon overlay for notes-only */}
          {variant === 'notes' && (
            <div className="absolute inset-0 bg-purple-900/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/30 flex items-center justify-center border border-purple-400/50 backdrop-blur-sm">
                <span className="text-3xl">📝</span>
              </div>
            </div>
          )}

          {/* Timestamp badge */}
          {showFreezeFrame && result.freezeFrameTimestamp && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded text-xs font-mono text-emerald-400 border border-emerald-500/30">
              @{result.freezeFrameTimestamp}
            </div>
          )}

          {/* Play button overlay */}
          <button
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
              <Play className="w-5 h-5 text-[#1A1A1A] ml-0.5" aria-hidden="true" />
            </div>
          </button>

          {/* Selection checkbox */}
          <div className="absolute top-2 left-2">
            <button
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Select ${result.creator.handle}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(result.id);
              }}
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer
                transition-all duration-150
                ${isSelected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'bg-white/80 border-[#D1D5DB] hover:border-[#9CA3AF]'
                }
              `}
            >
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 min-w-0">
          {/* Creator Info Row */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
              {result.creator.avatar ? (
                <Image
                  src={result.creator.avatar}
                  alt={result.creator.name}
                  fill
                  className="object-cover"
                  sizes="24px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : null}
              <span className="absolute inset-0 flex items-center justify-center -z-10">
                {result.creator.name[0]}
              </span>
            </div>
            <span className="font-medium text-sm text-[#1A1A1A]">
              @{result.creator.handle}
            </span>
            {result.creator.isVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
            )}
            <span className="text-[#9CA3AF] text-xs">
              {platformIcons[result.creator.platform]}
            </span>
            <span className="text-[#9CA3AF] text-xs">•</span>
            <span className="text-[#9CA3AF] text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(result.postedDate)}
            </span>
            <span className="text-[#9CA3AF] text-xs">•</span>
            <span className="text-[#9CA3AF] text-xs flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {formatNumber(result.viewCount)} views
            </span>
          </div>

          {/* Video Title */}
          <h3 className="text-sm font-medium text-[#1A1A1A] mb-2 line-clamp-1">
            {result.videoTitle}
          </h3>

          {/* Match Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {result.matches.map((match) => (
              <MatchBadge
                key={match.type}
                type={match.type}
                timestamp={match.timestamp}
                size="sm"
              />
            ))}
          </div>

          {/* Evidence Line */}
          <p className="text-xs text-[#6B6B6B] line-clamp-2 mb-3">
            {primaryMatch?.evidence}
          </p>

          {/* Actions Row */}
          <div className="flex items-center justify-between">
            {/* Score Pill */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={`Score ${result.totalScore}%, click to ${isExpanded ? 'collapse' : 'expand'} details`}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold
                transition-all duration-150
                ${result.totalScore >= 90
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : result.totalScore >= 70
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : 'bg-[#F5F5F0] text-[#6B6B6B] border border-[#E5E5E0]'
                }
              `}
            >
              <span className="font-data">{result.totalScore}%</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onCrossSell?.(result)}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Cross-Sell
              </button>
              <button aria-label="Save" className="p-1.5 text-[#9CA3AF] hover:text-[#6B6B6B] hover:bg-[#F5F5F0] rounded-lg transition-colors">
                <Bookmark className="w-4 h-4" aria-hidden="true" />
              </button>
              <button aria-label="Share" className="p-1.5 text-[#9CA3AF] hover:text-[#6B6B6B] hover:bg-[#F5F5F0] rounded-lg transition-colors">
                <Share2 className="w-4 h-4" aria-hidden="true" />
              </button>
              <button aria-label="Open in new tab" className="p-1.5 text-[#9CA3AF] hover:text-[#6B6B6B] hover:bg-[#F5F5F0] rounded-lg transition-colors">
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Score Breakdown (Expandable) */}
          <AnimatePresence>
            {isExpanded && (
              <ScoreBreakdown
                matches={result.matches}
                modifiers={result.modifiers}
                totalScore={result.totalScore}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
