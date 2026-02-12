import React, { useState } from 'react';
import { CreatorPost } from '../types';
import { Eye, Heart, Play, Film, Image, BookOpen, Clapperboard, Megaphone, Plus, Check } from 'lucide-react';
import MatchTypeIndicators from './MatchTypeIndicators';
import ScoreBreakdownBar from './ScoreBreakdownBar';

interface PostCardProps {
  post: CreatorPost;
  rank: number;
  onClick: () => void;
  showScoring?: boolean;
  onAdd?: () => void;
  isSelected?: boolean;
}

const CONTENT_TYPE_ICON: Record<string, typeof Film> = {
  Reel: Film,
  Story: BookOpen,
  Post: Image,
  Video: Clapperboard,
  Paid: Megaphone,
};

const PostCard: React.FC<PostCardProps> = ({ post, rank, onClick, showScoring = true, onAdd, isSelected = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Rank badge colors
  const rankColor = rank === 1 ? 'bg-yellow-500 text-black' :
                    rank === 2 ? 'bg-zinc-300 text-black' :
                    rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-zinc-700 text-zinc-300';

  // Convert signals to MatchEvidence format for MatchTypeIndicators
  const matchEvidence = post.signals.map(s => ({
    type: s.type,
    confidence: s.confidence,
    timestamp: s.timestamp,
    excerpt: s.excerpt,
    context: s.context,
  }));

  const ContentIcon = CONTENT_TYPE_ICON[post.contentType] || Film;
  const hasSignals = post.signals.length > 0;

  return (
    <div
      onClick={onClick}
      className={`
        group relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 cursor-pointer
        border border-zinc-800 hover:border-zinc-500 transition-all duration-500 ease-in-out
        ${isHovered ? 'scale-[1.02] shadow-2xl z-10' : ''}
        ${showScoring && !hasSignals ? 'opacity-60' : 'opacity-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Thumbnail */}
      <img
        src={post.thumbnail}
        alt={post.caption.slice(0, 50)}
        className={`w-full h-full object-cover transition-transform duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40 opacity-90" />

      {/* Rank Badge — Top Left (hidden pre-search) */}
      {showScoring && (
        <div className="absolute top-3 left-3 z-20">
          <div className={`${rankColor} w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg`}>
            {rank}
          </div>
        </div>
      )}

      {/* Signal Type Icons — Top Right */}
      {hasSignals && (
        <div className="absolute top-3 right-3 z-20">
          <MatchTypeIndicators matches={matchEvidence} size="sm" />
        </div>
      )}

      {/* Content Type Badge */}
      <div className={`absolute top-3 ${showScoring ? 'left-12' : 'left-3'} z-20`}>
        <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          <ContentIcon size={10} className="text-zinc-400" />
          <span className="text-[9px] font-bold text-zinc-300">{post.contentType}</span>
        </div>
      </div>

      {/* Play Icon on Hover */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1" />
          </div>
        </div>
      )}

      {/* Score + Composite — Floating pill (hidden pre-search) */}
      {showScoring && hasSignals && (
        <div className="absolute bottom-[120px] right-3 z-20">
          <div className="bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-center">
            <div className="text-lg font-bold text-white leading-none">{post.scoreBreakdown.normalizedScore}</div>
            <div className="text-[8px] text-zinc-500 uppercase tracking-wider">score</div>
          </div>
        </div>
      )}

      {/* Quick Add Button (Visible on Hover) */}
      {onAdd && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className={`
            absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full text-white transition-all transform shadow-lg z-30 cursor-pointer pointer-events-auto
            ${isSelected ? 'bg-green-600 opacity-100 scale-100 translate-x-0' : `bg-blue-600 hover:bg-blue-500 ${isHovered ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-4'}`}
          `}
        >
          {isSelected ? <Check size={16} /> : <Plus size={16} />}
        </button>
      )}

      {/* Context Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-20 pointer-events-none">
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-lg p-2.5 border border-white/5 shadow-lg">
          {/* Caption Preview */}
          <p className="text-[11px] text-zinc-300 font-medium leading-tight line-clamp-2 mb-2">
            {post.caption}
          </p>

          {/* Score Breakdown Bar (hidden pre-search) */}
          {showScoring && hasSignals && (
            <div className="mb-2">
              <ScoreBreakdownBar breakdown={post.scoreBreakdown} />
            </div>
          )}

          {/* Stats Row */}
          <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono uppercase tracking-wider border-t border-white/5 pt-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <Eye size={8} className="mr-1" />
                {post.stats.views >= 1000 ? `${(post.stats.views / 1000).toFixed(0)}k` : post.stats.views}
              </div>
              <div className="flex items-center">
                <Heart size={8} className="mr-1" />
                {post.stats.likes >= 1000 ? `${(post.stats.likes / 1000).toFixed(0)}k` : post.stats.likes}
              </div>
            </div>
            <span className="text-zinc-600">
              {new Date(post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
