import React, { useState, useEffect } from 'react';
import { Creator, QueryNode, NikeCreator, MatchType } from '../types';
import {
  X, MessageCircle, Heart, Plus, Play, Eye, Mic, Type, StickyNote, CheckCircle, Loader2
} from 'lucide-react';
import { generateCreatorRationale } from '../services/gemini';

interface CreatorModalProps {
  creator: Creator | NikeCreator | null;
  triggeringNode?: QueryNode;
  onClose: () => void;
  onAddToDock: (creator: Creator) => void;
  isNikeMode?: boolean;
}

// Match type configuration
const MATCH_TYPE_CONFIG: Record<MatchType, {
  icon: typeof Eye;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string
}> = {
  visual: {
    icon: Eye,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    label: 'Visual Match'
  },
  audio: {
    icon: Mic,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    label: 'Audio Match'
  },
  caption: {
    icon: Type,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    label: 'Caption Match'
  },
  personalNote: {
    icon: StickyNote,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    label: 'Personal Note'
  }
};

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, triggeringNode, onClose, onAddToDock, isNikeMode = false }) => {
  const [rationale, setRationale] = useState<string | null>(null);
  const [isLoadingRationale, setIsLoadingRationale] = useState(false);

  // Type guard for Nike creator
  const nikeCreator = isNikeMode && creator && 'matches' in creator ? (creator as NikeCreator) : null;

  // Get search query from triggering node
  const searchQuery = triggeringNode?.rawInput || 'Nike creators';

  // Generate rationale using Gemini when modal opens
  useEffect(() => {
    if (nikeCreator && nikeCreator.matches.length > 0) {
      setIsLoadingRationale(true);
      setRationale(null);

      generateCreatorRationale(
        searchQuery,
        nikeCreator.name,
        nikeCreator.matches.map(m => ({
          type: m.type,
          excerpt: m.excerpt,
          timestamp: m.timestamp
        })),
        nikeCreator.nikeAffinity
      )
        .then((result) => {
          setRationale(result);
        })
        .catch((error) => {
          console.error('Failed to generate rationale:', error);
          setRationale(`${nikeCreator.name} is a strong match for your "${searchQuery}" search based on authentic brand content.`);
        })
        .finally(() => {
          setIsLoadingRationale(false);
        });
    }
  }, [nikeCreator?.id, searchQuery]);

  if (!creator) return null;

  // Post stats derived from creator stats (realistic mock values)
  const postStats = {
    views: Math.round(creator.followers * 0.15),
    likes: Math.round(creator.followers * 0.08),
    comments: Math.round(creator.followers * 0.005),
  };

  // Always use content thumbnail
  const displayImage = creator.thumbnail;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-auto md:max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors border border-white/10"
        >
          <X size={20} />
        </button>

        {/* Left: Media Panel */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative group overflow-hidden">
          <img
            src={displayImage}
            alt={creator.name}
            className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/20 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="animate-fade-in-up">
                <div className="flex items-center space-x-3 mb-4">
                   <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-white/20">
                      <Play size={20} fill="currentColor" />
                   </button>
                   <span className="text-white font-bold text-lg drop-shadow-md">Watch Content</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2 leading-tight">{creator.name}</h2>
                <div className="flex items-center text-zinc-400 space-x-3 text-xs font-mono uppercase tracking-wider">
                    <span>{creator.handle}</span>
                    <span>•</span>
                    <span>{creator.platform}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Right: Details Panel */}
        <div className="w-full md:w-1/2 flex flex-col bg-zinc-900 border-l border-zinc-800">

           {/* Scrollable Content Area */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="space-y-6 animate-fade-in">

                {/* Why They Qualify - Always at top */}
                {nikeCreator && (
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
                              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Why They Qualify</h3>
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

                {/* Evidence Section */}
                {nikeCreator && nikeCreator.matches.length > 0 && (
                  <div>
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Evidence</h3>
                      <div className="space-y-2">
                          {nikeCreator.matches.map((match, index) => {
                              const config = MATCH_TYPE_CONFIG[match.type];
                              const Icon = config.icon;

                              return (
                                  <div
                                      key={index}
                                      className={`flex items-center space-x-3 p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}
                                  >
                                      <Icon size={16} className={config.color} />
                                      <div className="flex-1 min-w-0">
                                          <span className="text-sm text-zinc-200 block">
                                              {match.excerpt}
                                          </span>
                                      </div>
                                      {match.timestamp && (
                                          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded flex-shrink-0">
                                              {match.timestamp}
                                          </span>
                                      )}
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                )}

                {/* Brand Affinity */}
                {nikeCreator?.nikeAffinity && (
                  <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Brand Affinity</h3>
                    <div className="flex flex-wrap gap-2">
                      {nikeCreator.nikeAffinity.partnership && (
                        <span className="px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-lg text-xs font-medium border border-orange-500/20">
                          {nikeCreator.nikeAffinity.partnership}
                        </span>
                      )}
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        nikeCreator.nikeAffinity.mentionFrequency === 'high'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : nikeCreator.nikeAffinity.mentionFrequency === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {nikeCreator.nikeAffinity.mentionFrequency} mentions
                      </span>
                      {nikeCreator.nikeAffinity.brandAlignment.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs border border-zinc-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post Stats */}
                <div>
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Post Stats</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                           <div className="flex items-center justify-center mb-1">
                              <Eye size={14} className="text-zinc-500" />
                           </div>
                           <div className="text-lg font-bold text-white">{(postStats.views / 1000).toFixed(0)}k</div>
                           <div className="text-[10px] text-zinc-500 uppercase font-medium">Views</div>
                        </div>
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                           <div className="flex items-center justify-center mb-1">
                              <Heart size={14} className="text-zinc-500" />
                           </div>
                           <div className="text-lg font-bold text-white">{(postStats.likes / 1000).toFixed(0)}k</div>
                           <div className="text-[10px] text-zinc-500 uppercase font-medium">Likes</div>
                        </div>
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-center">
                           <div className="flex items-center justify-center mb-1">
                              <MessageCircle size={14} className="text-zinc-500" />
                           </div>
                           <div className="text-lg font-bold text-white">{(postStats.comments / 1000).toFixed(1)}k</div>
                           <div className="text-[10px] text-zinc-500 uppercase font-medium">Comments</div>
                        </div>
                    </div>
                </div>

              </div>
           </div>

           {/* Action Footer */}
           <div className="p-6 pt-4 border-t border-zinc-800 bg-zinc-900">
              <button
                onClick={() => onAddToDock(creator)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center transition-all transform active:scale-[0.98] shadow-lg shadow-blue-600/20"
              >
                 <Plus size={18} className="mr-2" />
                 Add to Pitch
              </button>
           </div>

        </div>
      </div>
    </div>
  );
};

export default CreatorModal;