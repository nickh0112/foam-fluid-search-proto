'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Eye,
  Play,
  CheckCircle2,
  MapPin,
  Plus,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import { SearchResult } from '@/lib/types';
import { MatchBadge } from './MatchBadge';

interface CreatorCardProps {
  creator: SearchResult['creator'];
  results: SearchResult[];
  index: number;
  isSelected?: boolean;
  onSelect?: (creatorId: string, resultIds: string[]) => void;
  onCrossSell?: (result: SearchResult) => void;
  onResultClick?: (result: SearchResult) => void;
}

const platformColors: Record<string, string> = {
  tiktok: 'bg-black',
  instagram: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
  youtube: 'bg-red-600',
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

export function CreatorCard({
  creator,
  results,
  index,
  isSelected,
  onSelect,
  onCrossSell,
  onResultClick,
}: CreatorCardProps) {
  const [hoveredThumb, setHoveredThumb] = useState<string | null>(null);

  // Aggregate stats
  const totalViews = results.reduce((acc, r) => acc + r.viewCount, 0);

  // Get unique match types across all results
  const allMatchTypes = Array.from(new Set(results.flatMap(r => r.matches.map(m => m.type))));

  // Get result IDs for selection
  const resultIds = results.map(r => r.id);

  // Get cross-sell brands from first result (they're the same for all)
  const crossSellBrands = results[0]?.crossSellBrands || [];
  const brandNames = crossSellBrands.slice(0, 3).map(b => b.name);

  // Get top 6 results for grid
  const gridResults = results.slice(0, 6);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`
        group bg-white rounded-2xl overflow-hidden
        transition-all duration-200
        ${isSelected
          ? 'ring-2 ring-indigo-500 shadow-lg'
          : 'shadow-sm hover:shadow-md'
        }
      `}
    >
      <div className="flex">
        {/* Left Panel - Creator Info */}
        <div className="w-[280px] flex-shrink-0 p-5 border-r border-[#E5E5E0] flex flex-col">
          {/* Selection & Avatar Row */}
          <div className="flex items-start gap-3 mb-4">
            {/* Selection checkbox */}
            <button
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Select ${creator.handle}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(creator.id, resultIds);
              }}
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer
                transition-all duration-150 flex-shrink-0 mt-1
                ${isSelected
                  ? 'bg-indigo-500 border-indigo-500'
                  : 'bg-white border-[#D1D5DB] hover:border-indigo-400'
                }
              `}
            >
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Avatar */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0">
              {creator.avatar ? (
                <Image
                  src={creator.avatar}
                  alt={creator.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : null}
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg -z-10">
                {creator.name[0]}
              </span>
              {/* Platform badge */}
              <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full ${platformColors[creator.platform]} flex items-center justify-center border-2 border-white`}>
                <span className="text-white text-[8px] font-bold">
                  {creator.platform === 'tiktok' ? 'T' : creator.platform === 'instagram' ? 'IG' : 'YT'}
                </span>
              </div>
            </div>

            {/* Name & Handle */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-[#1A1A1A] truncate text-[15px]">
                  {creator.name}
                </h3>
                {creator.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" aria-hidden="true" />
                )}
              </div>
              <p className="text-sm text-[#6B6B6B]">@{creator.handle}</p>
            </div>
          </div>

          {/* Location */}
          {creator.location && (
            <div className="flex items-center gap-1.5 text-sm text-[#6B6B6B] mb-3">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{creator.location}</span>
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#1A1A1A]">{formatNumber(creator.followerCount)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#9CA3AF]" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#1A1A1A]">{formatNumber(totalViews)}</span>
            </div>
          </div>

          {/* Engagement Rate */}
          {creator.engagementRate && (
            <div className="text-sm text-[#6B6B6B] mb-4">
              Avg ER: <span className="font-semibold text-[#1A1A1A]">{creator.engagementRate}%</span>
            </div>
          )}

          {/* Match Types */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {allMatchTypes.map((type) => (
              <MatchBadge key={type} type={type} showLabel={true} size="sm" />
            ))}
          </div>

          {/* Add to List Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(creator.id, resultIds);
            }}
            className={`
              w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1.5
              transition-colors duration-150
              ${isSelected
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-[#F5F5F0] text-[#1A1A1A] hover:bg-[#E5E5E0]'
              }
            `}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            {isSelected ? 'Added to List' : 'Add to List'}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Posted For Section */}
          {brandNames.length > 0 && (
            <div className="pt-4 border-t border-[#E5E5E0] mt-4">
              <p className="text-xs text-[#9CA3AF] mb-1.5">Posted for:</p>
              <div className="flex flex-wrap gap-1">
                {brandNames.map((brand) => (
                  <span
                    key={brand}
                    className="px-2 py-0.5 bg-[#F5F5F0] rounded text-xs text-[#6B6B6B]"
                  >
                    {brand}
                  </span>
                ))}
                {crossSellBrands.length > 3 && (
                  <button
                    onClick={() => onCrossSell?.(results[0])}
                    className="px-2 py-0.5 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    +{crossSellBrands.length - 3} more
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Content Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-3 gap-2 h-full">
            {gridResults.map((result, idx) => (
              <motion.button
                key={result.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => onResultClick?.(result)}
                onMouseEnter={() => setHoveredThumb(result.id)}
                onMouseLeave={() => setHoveredThumb(null)}
                className="group/item relative aspect-video rounded-lg overflow-hidden bg-[#E5E5E0] hover:ring-2 hover:ring-indigo-500 transition-all"
              >
                {/* Thumbnail */}
                {result.thumbnail && (
                  <Image
                    src={result.freezeFrame || result.thumbnail}
                    alt={result.videoTitle}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                )}

                {/* Hover Overlay */}
                <AnimatePresence>
                  {hoveredThumb === result.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="w-5 h-5 text-[#1A1A1A] ml-0.5" aria-hidden="true" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Score Badge */}
                <div className={`
                  absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold font-data
                  ${result.totalScore >= 90
                    ? 'bg-emerald-500 text-white'
                    : result.totalScore >= 70
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/90 text-[#6B6B6B]'
                  }
                `}>
                  {result.totalScore}%
                </div>

                {/* Timestamp */}
                {result.freezeFrameTimestamp && (
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[10px] font-mono text-emerald-400">
                    @{result.freezeFrameTimestamp}
                  </div>
                )}

                {/* Match indicators */}
                <div className="absolute bottom-1.5 left-1.5 flex gap-0.5">
                  {result.matches.slice(0, 3).map((match) => (
                    <MatchBadge
                      key={match.type}
                      type={match.type}
                      showLabel={false}
                      size="sm"
                    />
                  ))}
                </div>
              </motion.button>
            ))}

            {/* View More Cell */}
            {results.length > 6 && (
              <button
                onClick={() => onCrossSell?.(results[0])}
                className="aspect-video rounded-lg bg-[#F5F5F0] hover:bg-[#E5E5E0] transition-colors flex flex-col items-center justify-center gap-1"
              >
                <span className="text-xl font-bold text-[#6B6B6B]">+{results.length - 6}</span>
                <span className="text-xs text-[#9CA3AF]">more</span>
              </button>
            )}

            {/* Empty cells to fill grid */}
            {gridResults.length < 6 && results.length <= 6 && Array.from({ length: 6 - gridResults.length }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-video rounded-lg bg-[#F5F5F0]" />
            ))}
          </div>

          {/* Cross-Sell Link */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => onCrossSell?.(results[0])}
              className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              View Cross-Sell Opportunities
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
