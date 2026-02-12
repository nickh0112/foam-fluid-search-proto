import React, { useState } from 'react';
import { PostFilterState, ContentType, MatchType } from '../types';
import { Film, BookOpen, Image, Clapperboard, Megaphone, X, Eye, Heart, Calendar, ChevronDown } from 'lucide-react';

interface PostFilterBarProps {
  filters: PostFilterState;
  onFiltersChange: (filters: PostFilterState) => void;
  totalPosts: number;
  filteredCount: number;
}

const CONTENT_TYPES: { value: ContentType; label: string; Icon: typeof Film }[] = [
  { value: 'Reel', label: 'Reel', Icon: Film },
  { value: 'Video', label: 'Video', Icon: Clapperboard },
  { value: 'Post', label: 'Post', Icon: Image },
  { value: 'Story', label: 'Story', Icon: BookOpen },
  { value: 'Paid', label: 'Paid', Icon: Megaphone },
];

const SIGNAL_TYPES: { value: MatchType; label: string; color: string; dotColor: string }[] = [
  { value: 'caption', label: 'Caption', color: 'orange', dotColor: 'bg-orange-400' },
  { value: 'audio', label: 'Audio', color: 'green', dotColor: 'bg-green-400' },
  { value: 'visual', label: 'Visual', color: 'blue', dotColor: 'bg-blue-400' },
];

const VIEW_PRESETS = [
  { label: '10k+', value: 10_000 },
  { label: '50k+', value: 50_000 },
  { label: '100k+', value: 100_000 },
];

const LIKE_PRESETS = [
  { label: '1k+', value: 1_000 },
  { label: '5k+', value: 5_000 },
  { label: '10k+', value: 10_000 },
];

const DATE_PRESETS = [
  { label: 'Last 30d', days: 30 },
  { label: 'Last 60d', days: 60 },
  { label: 'Last 90d', days: 90 },
  { label: 'All time', days: 0 },
];

function getDateFromDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const PostFilterBar: React.FC<PostFilterBarProps> = ({ filters, onFiltersChange, totalPosts, filteredCount }) => {
  const [engagementOpen, setEngagementOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const activeFilterCount = [
    filters.contentTypes.length > 0,
    filters.signalTypes.length > 0,
    filters.minViews != null,
    filters.minLikes != null,
    filters.dateFrom != null,
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;

  const toggleContentType = (ct: ContentType) => {
    const next = filters.contentTypes.includes(ct)
      ? filters.contentTypes.filter(c => c !== ct)
      : [...filters.contentTypes, ct];
    onFiltersChange({ ...filters, contentTypes: next });
  };

  const toggleSignalType = (st: MatchType) => {
    const next = filters.signalTypes.includes(st)
      ? filters.signalTypes.filter(s => s !== st)
      : [...filters.signalTypes, st];
    onFiltersChange({ ...filters, signalTypes: next });
  };

  const setMinViews = (val: number | undefined) => {
    onFiltersChange({ ...filters, minViews: filters.minViews === val ? undefined : val });
  };

  const setMinLikes = (val: number | undefined) => {
    onFiltersChange({ ...filters, minLikes: filters.minLikes === val ? undefined : val });
  };

  const setDateRange = (days: number) => {
    if (days === 0) {
      onFiltersChange({ ...filters, dateFrom: undefined, dateTo: undefined });
    } else {
      onFiltersChange({ ...filters, dateFrom: getDateFromDaysAgo(days), dateTo: undefined });
    }
  };

  const clearAll = () => {
    onFiltersChange({ contentTypes: [], signalTypes: [] });
  };

  // Determine active date label
  const getActiveDateLabel = (): string | null => {
    if (!filters.dateFrom) return null;
    const fromDate = new Date(filters.dateFrom);
    const diffDays = Math.round((Date.now() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 31) return '30d';
    if (diffDays <= 61) return '60d';
    if (diffDays <= 91) return '90d';
    return null;
  };

  const chipBase = "flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all cursor-pointer select-none";
  const chipInactive = "bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-600 hover:text-zinc-300";
  const chipActive = "border-white/20 text-white shadow-sm";

  return (
    <div className="mb-4">
      <div className="flex items-center flex-wrap gap-2 pb-1">
        {/* Content Type Chips */}
        {CONTENT_TYPES.map(({ value, label, Icon }) => {
          const isActive = filters.contentTypes.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleContentType(value)}
              className={`${chipBase} ${isActive ? `${chipActive} bg-zinc-700` : chipInactive}`}
            >
              <Icon size={12} />
              <span>{label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-700/50 flex-shrink-0 mx-1" />

        {/* Signal Type Chips */}
        {SIGNAL_TYPES.map(({ value, label, dotColor }) => {
          const isActive = filters.signalTypes.includes(value);
          return (
            <button
              key={value}
              onClick={() => toggleSignalType(value)}
              className={`${chipBase} ${isActive ? `${chipActive} bg-zinc-700` : chipInactive}`}
            >
              <div className={`w-2 h-2 rounded-full ${dotColor}`} />
              <span>{label}</span>
            </button>
          );
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-zinc-700/50 flex-shrink-0 mx-1" />

        {/* Engagement Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => { setEngagementOpen(!engagementOpen); setDateOpen(false); }}
            className={`${chipBase} ${(filters.minViews != null || filters.minLikes != null) ? `${chipActive} bg-zinc-700` : chipInactive}`}
          >
            <Eye size={12} />
            <span>
              {filters.minViews != null
                ? `${filters.minViews >= 1000 ? `${(filters.minViews / 1000).toFixed(0)}k` : filters.minViews}+ views`
                : filters.minLikes != null
                  ? `${filters.minLikes >= 1000 ? `${(filters.minLikes / 1000).toFixed(0)}k` : filters.minLikes}+ likes`
                  : 'Engagement'}
            </span>
            <ChevronDown size={12} className={`transition-transform ${engagementOpen ? 'rotate-180' : ''}`} />
          </button>

          {engagementOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setEngagementOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-40 overflow-hidden p-2">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider px-2 py-1">Views</div>
                {VIEW_PRESETS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => { setMinViews(p.value); setEngagementOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${filters.minViews === p.value ? 'bg-zinc-800 text-blue-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                  >
                    <Eye size={10} className="inline mr-1.5" />{p.label} views
                  </button>
                ))}
                <div className="border-t border-zinc-800 my-1" />
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider px-2 py-1">Likes</div>
                {LIKE_PRESETS.map(p => (
                  <button
                    key={p.value}
                    onClick={() => { setMinLikes(p.value); setEngagementOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${filters.minLikes === p.value ? 'bg-zinc-800 text-blue-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                  >
                    <Heart size={10} className="inline mr-1.5" />{p.label} likes
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Date Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => { setDateOpen(!dateOpen); setEngagementOpen(false); }}
            className={`${chipBase} ${filters.dateFrom ? `${chipActive} bg-zinc-700` : chipInactive}`}
          >
            <Calendar size={12} />
            <span>{getActiveDateLabel() ? `Last ${getActiveDateLabel()}` : 'Date'}</span>
            <ChevronDown size={12} className={`transition-transform ${dateOpen ? 'rotate-180' : ''}`} />
          </button>

          {dateOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setDateOpen(false)} />
              <div className="absolute top-full left-0 mt-1 w-40 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-40 overflow-hidden">
                {DATE_PRESETS.map(p => {
                  const isActive = p.days === 0 ? !filters.dateFrom : getActiveDateLabel() === `${p.days}d`;
                  return (
                    <button
                      key={p.days}
                      onClick={() => { setDateRange(p.days); setDateOpen(false); }}
                      className={`w-full px-4 py-2.5 text-left text-xs transition-colors border-b border-zinc-800 last:border-b-0 ${isActive ? 'bg-zinc-800 text-blue-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Clear All */}
        {hasActiveFilters && (
          <>
            <div className="w-px h-6 bg-zinc-700/50 flex-shrink-0 mx-1" />
            <button
              onClick={clearAll}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer select-none flex-shrink-0"
            >
              <X size={12} />
              <span>Clear ({activeFilterCount})</span>
            </button>
          </>
        )}
      </div>

      {/* Filtered count indicator */}
      {hasActiveFilters && (
        <div className="mt-2 text-[11px] text-zinc-500">
          Showing <span className="text-white font-medium">{filteredCount}</span> of {totalPosts} posts
        </div>
      )}
    </div>
  );
};

export default PostFilterBar;
