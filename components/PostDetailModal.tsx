import React, { useState, useEffect } from 'react';
import { CreatorPost, MatchType } from '../types';
import { X, Eye, Mic, Type, StickyNote, Heart, MessageCircle, Share2, Play, TrendingUp, Loader2, CheckCircle, ChevronDown, Plus, Check } from 'lucide-react';
import ScoreBreakdownBar from './ScoreBreakdownBar';
import { generatePostRationale } from '../services/gemini';

interface PostDetailModalProps {
  post: CreatorPost | null;
  rank: number;
  onClose: () => void;
  searchTerm?: string;
  creatorName?: string;
  onAdd?: () => void;
  isSelected?: boolean;
}

const MATCH_TYPE_CONFIG: Record<MatchType, {
  icon: typeof Eye;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}> = {
  visual: { icon: Eye, color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', label: 'Visual' },
  audio: { icon: Mic, color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', label: 'Audio' },
  caption: { icon: Type, color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', label: 'Caption' },
  personalNote: { icon: StickyNote, color: 'text-purple-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30', label: 'Note' },
};

const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, rank, onClose, searchTerm, creatorName, onAdd, isSelected = false }) => {
  const [rationale, setRationale] = useState<string | null>(null);
  const [isLoadingRationale, setIsLoadingRationale] = useState(false);
  const [showScoreDetails, setShowScoreDetails] = useState(false);

  useEffect(() => {
    if (post && searchTerm) {
      setIsLoadingRationale(true);
      setRationale(null);

      generatePostRationale(searchTerm, creatorName || 'this creator', post)
        .then((result) => {
          setRationale(result);
        })
        .catch((error) => {
          console.error('Failed to generate rationale:', error);
          setRationale(`This post matches your search for "${searchTerm}".`);
        })
        .finally(() => {
          setIsLoadingRationale(false);
        });
    } else {
      setRationale(null);
    }
  }, [post?.id, searchTerm]);

  if (!post) return null;

  const { scoreBreakdown } = post;
  const rankColor = rank === 1 ? 'from-yellow-500 to-amber-600' :
                    rank === 2 ? 'from-zinc-300 to-zinc-400' :
                    rank === 3 ? 'from-amber-600 to-amber-800' :
                    'from-zinc-600 to-zinc-700';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto md:max-h-[90vh]">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors border border-white/10">
          <X size={20} />
        </button>

        {/* Left: Thumbnail */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative group overflow-hidden">
          <img src={post.thumbnail} alt="" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-4">
              <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-white/20">
                <Play size={20} fill="currentColor" />
              </button>
              <span className="text-white font-bold text-lg drop-shadow-md">Watch Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">{post.contentType}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[10px] font-mono text-zinc-400">
                {new Date(post.postedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 flex flex-col bg-zinc-900 border-l border-zinc-800">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="space-y-6">

              {/* Score Header */}
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rankColor} flex items-center justify-center text-xl font-black shadow-lg`}>
                  #{rank}
                </div>
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-white">{scoreBreakdown.normalizedScore}</span>
                    <span className="text-sm text-zinc-500">/100</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
                    Composite Score • {scoreBreakdown.baseTotal.toFixed(0)} raw pts
                  </div>
                </div>
              </div>

              {/* Why This Matches — conditional on searchTerm */}
              {searchTerm && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 p-4 rounded-xl border border-emerald-500/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                      {isLoadingRationale ? (
                        <Loader2 size={20} className="text-emerald-400 animate-spin" />
                      ) : (
                        <CheckCircle size={20} className="text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Why This Matches</h3>
                      {isLoadingRationale ? (
                        <div className="space-y-2">
                          <div className="h-4 bg-emerald-500/10 rounded animate-pulse w-full"></div>
                          <div className="h-4 bg-emerald-500/10 rounded animate-pulse w-3/4"></div>
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-300 leading-relaxed">
                          {rationale}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Evidence (simplified signals) */}
              {post.signals.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Evidence</h3>
                  <div className="space-y-2">
                    {post.signals.map((signal, i) => {
                      const config = MATCH_TYPE_CONFIG[signal.type];
                      const Icon = config.icon;
                      return (
                        <div key={i} className={`flex items-center space-x-3 p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                          <Icon size={16} className={config.color} />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-zinc-200 block">{signal.excerpt}</span>
                          </div>
                          {signal.timestamp && (
                            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded flex-shrink-0">
                              {signal.timestamp}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Full Caption */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Caption</h3>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  {post.caption}
                </p>
              </div>

              {/* Post Stats */}
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Post Stats</h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                    <Eye size={14} className="text-zinc-500 mx-auto mb-1" />
                    <div className="text-base font-bold text-white">{(post.stats.views / 1000).toFixed(0)}k</div>
                    <div className="text-[9px] text-zinc-500 uppercase">Views</div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                    <Heart size={14} className="text-zinc-500 mx-auto mb-1" />
                    <div className="text-base font-bold text-white">{(post.stats.likes / 1000).toFixed(1)}k</div>
                    <div className="text-[9px] text-zinc-500 uppercase">Likes</div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                    <MessageCircle size={14} className="text-zinc-500 mx-auto mb-1" />
                    <div className="text-base font-bold text-white">{post.stats.comments}</div>
                    <div className="text-[9px] text-zinc-500 uppercase">Comments</div>
                  </div>
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                    <Share2 size={14} className="text-zinc-500 mx-auto mb-1" />
                    <div className="text-base font-bold text-white">{(post.stats.shares / 1000).toFixed(1)}k</div>
                    <div className="text-[9px] text-zinc-500 uppercase">Shares</div>
                  </div>
                </div>
              </div>

              {/* Score Details — collapsible, demoted to bottom */}
              {scoreBreakdown.baseTotal > 0 && (
                <div>
                  <button
                    onClick={() => setShowScoreDetails(!showScoreDetails)}
                    className="flex items-center space-x-2 text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-300 transition-colors"
                  >
                    <span>Score Details</span>
                    <ChevronDown size={14} className={`transition-transform ${showScoreDetails ? 'rotate-180' : ''}`} />
                  </button>

                  {showScoreDetails && (
                    <div className="mt-3">
                      <ScoreBreakdownBar breakdown={scoreBreakdown} showLabels height="h-3" />

                      <div className="mt-3 space-y-2">
                        {scoreBreakdown.signalDetails.map((detail, i) => {
                          const config = MATCH_TYPE_CONFIG[detail.type];
                          const Icon = config.icon;
                          return (
                            <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
                              <div className="flex items-center space-x-2">
                                <Icon size={14} className={config.color} />
                                <span className="text-xs font-medium text-zinc-300">{config.label}</span>
                              </div>
                              <div className="text-[11px] font-mono text-zinc-400">
                                {detail.basePoints} <span className="text-zinc-600">x</span> {detail.frequencyMultiplier.toFixed(2)} <span className="text-zinc-600">freq</span> <span className="text-zinc-600">x</span> {detail.densityMultiplier.toFixed(1)} <span className="text-zinc-600">dens</span> <span className="text-zinc-600">=</span> <span className="text-white font-bold">{detail.totalPoints.toFixed(0)}</span>
                              </div>
                            </div>
                          );
                        })}

                        {scoreBreakdown.reinforcementBonus > 0 && (
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <div className="flex items-center space-x-2">
                              <TrendingUp size={14} className="text-emerald-400" />
                              <span className="text-xs font-medium text-zinc-300">Reinforcement Bonus</span>
                            </div>
                            <div className="text-[11px] font-mono text-zinc-400">
                              {scoreBreakdown.signalCount} signal types <span className="text-zinc-600">=</span> <span className="text-emerald-400 font-bold">+{scoreBreakdown.reinforcementBonus}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Add to Pitch Action */}
            {onAdd && (
              <div className="pt-4 border-t border-zinc-800">
                <button
                  onClick={onAdd}
                  disabled={isSelected}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {isSelected ? <Check size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                  {isSelected ? 'Added to Pitch' : 'Add to Pitch'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
