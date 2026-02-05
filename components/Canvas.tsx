import React, { useEffect, useRef, useState } from 'react';
import { Creator, QueryNode, NikeCreator, EnrichedCreator, MatchEvidence, MatchType, SemanticFilter } from '../types';
import { MOCK_CREATORS, NIKE_CREATORS, COFFEE_CREATORS } from '../constants';
import { MapPin, Instagram, Youtube, User, Plus, Eye, Mic, Type, StickyNote, Clock, ChevronDown } from 'lucide-react';
import MatchTypeIndicators from './MatchTypeIndicators';
import AgenticSearchHeader from './AgenticSearchHeader';

// Sort options for Nike mode
type SortOption = 'relevance' | 'evidence' | 'engagement' | 'recency' | 'followers';

const SORT_OPTIONS: { value: SortOption; label: string; description: string }[] = [
  { value: 'relevance', label: 'Relevance', description: 'Best match for your search' },
  { value: 'evidence', label: 'Evidence Strength', description: 'Most match types found' },
  { value: 'engagement', label: 'Engagement Rate', description: 'Highest audience engagement' },
  { value: 'recency', label: 'Recency', description: 'Most recent content' },
  { value: 'followers', label: 'Followers', description: 'Largest audience' },
];

// Mock recency data (days ago) for demo
const MOCK_RECENCY: Record<string, number> = {
  'nike1': 2,
  'nike2': 5,
  'nike3': 1,
  'nike4': 8,
  'nike5': 3,
  'nike6': 12,
  'nike7': 4,
  'nike8': 7,
};

interface CanvasProps {
  nodes: QueryNode[];
  results: Map<string, Creator[]>;
  onAddToDock: (creator: Creator, sourceNodeId: string) => void;
  onSelectCreator: (creator: Creator, sourceNodeId: string) => void;
  searchMode?: 'nike' | 'coffee' | 'standard';
  nikeCreators?: NikeCreator[];
  coffeeCreators?: EnrichedCreator[];
  semanticFilters?: SemanticFilter[];
  currentSearchQuery?: string;
  isProcessing?: boolean;
}

interface MatchTickerProps {
  keyword: string;
  highlight: boolean;
  customExcerpt?: string;
  matchType?: MatchType;
}

const MatchTicker: React.FC<MatchTickerProps> = ({ keyword, highlight, customExcerpt, matchType }) => {
  // Icon mapping based on match type
  const getIcon = () => {
    switch (matchType) {
      case 'visual':
        return <Eye size={12} className="text-blue-400" />;
      case 'audio':
        return <Mic size={12} className="text-green-400" />;
      case 'caption':
        return <Type size={12} className="text-orange-400" />;
      case 'personalNote':
        return <StickyNote size={12} className="text-purple-400" />;
      default:
        return <span className="text-zinc-500">💬</span>;
    }
  };

  // Format text based on match type
  const formatExcerpt = (text: string) => {
    switch (matchType) {
      case 'visual':
        return `Detected: ${text}`;
      case 'audio':
        return `"${text}"`;
      case 'caption':
        return `Caption: ${text}`;
      case 'personalNote':
        return `Note: ${text}`;
      default:
        return text;
    }
  };

  // Use custom excerpt if provided (for Nike mode), otherwise generate one
  let snippet: string;

  if (customExcerpt) {
    snippet = formatExcerpt(customExcerpt);
  } else {
    // Mock transcript snippets that sound natural
    const snippets = [
      `I honestly think the ${keyword} scene here is totally underrated.`,
      `You won't believe what happened with the ${keyword} today!`,
      `This is the ultimate guide to ${keyword} in 2024.`,
      `Why ${keyword} is taking over my life right now.`,
      `The secret to perfect ${keyword} is actually simpler than you think.`,
      `Wait for the ${keyword} drop at the end!`,
      `My daily routine always starts with some ${keyword}.`
    ];

    // Stable random selection for the demo (using simple hash of keyword length + random)
    snippet = snippets[Math.floor(Math.random() * snippets.length)];
  }

  // Split to highlight
  const parts = snippet.split(new RegExp(`(${keyword})`, 'gi'));

  return (
    <div className="relative overflow-hidden h-8 w-full mb-1 mask-fade-sides select-none">
        <div className="absolute whitespace-nowrap animate-marquee-slow flex items-center h-full">
             {/* Render multiple times for seamless scrolling loop effect */}
             {[1, 2, 3, 4].map((iter) => (
               <span key={iter} className="flex items-center text-[11px] text-zinc-300 font-medium mr-8">
                  <span className="mr-2">{getIcon()}</span>
                  {parts.map((part, i) =>
                     highlight && part.toLowerCase() === keyword.toLowerCase()
                     ? <span key={i} className="text-blue-300 bg-blue-500/20 px-1.5 py-0.5 rounded font-bold mx-0.5 uppercase tracking-wider border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.3)]">{part}</span>
                     : <span key={i}>{part}</span>
                  )}
               </span>
             ))}
        </div>
        <style>{`
          .animate-marquee-slow {
             animation: marquee 20s linear infinite;
          }
          @keyframes marquee {
             0% { transform: translateX(0); }
             100% { transform: translateX(-50%); }
          }
          .mask-fade-sides {
             mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          }
        `}</style>
    </div>
  );
};

const CreatorCard: React.FC<{
  creator: Creator | NikeCreator | EnrichedCreator;
  sourceNodeId: string;
  keyword: string;
  highlight: boolean;
  isDimmed: boolean;
  onAdd: () => void;
  onClick: () => void;
  isBrandMode?: boolean;
}> = ({ creator, sourceNodeId, keyword, highlight, isDimmed, onAdd, onClick, isBrandMode = false }) => {
  // Type guard for enriched creator (has matches)
  const enrichedCreator = isBrandMode && 'matches' in creator ? (creator as NikeCreator | EnrichedCreator) : null;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      className={`
        group relative aspect-[9/16] rounded-xl overflow-hidden bg-zinc-900 cursor-pointer
        border border-zinc-800 hover:border-zinc-500 transition-all duration-500 ease-in-out
        ${isDimmed ? 'opacity-20 grayscale' : 'opacity-100'}
        ${isHovered ? 'scale-[1.02] shadow-2xl z-10' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ creatorId: creator.id, sourceNodeId }));
      }}
    >
      {/* Background Media (Mock Video) */}
      <img 
        src={creator.thumbnail} 
        alt={creator.name}
        className={`w-full h-full object-cover transition-transform duration-1000 ${isHovered ? 'scale-110' : 'scale-100'}`}
      />
      

      {/* Match Type Icons (Brand Mode) */}
      {isBrandMode && enrichedCreator && (
        <div className="absolute top-12 right-2 z-20">
          <MatchTypeIndicators matches={enrichedCreator.matches} size="sm" />
        </div>
      )}

      {/* Entity Header (Top) */}
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-20 pointer-events-none">
         <div className="relative">
             <div className="absolute -left-1 -top-1 w-10 h-10 rounded-full bg-black/50 blur-sm" />
             <img src={creator.avatar} alt="av" className="relative w-8 h-8 rounded-full border-2 border-zinc-900" />
         </div>
         <div className={`flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 ${isBrandMode ? 'mt-0' : ''}`}>
            <span className="text-[10px] font-bold text-white">{creator.handle}</span>
            <span className="text-[9px] text-zinc-400 border-l border-zinc-600 pl-1">{(creator.followers / 1000).toFixed(0)}k</span>
         </div>
      </div>

      {/* Vibe Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/40 opacity-90" />

      {/* Proof Body (Play Icon Mock) */}
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1" />
           </div>
        </div>
      )}

      {/* Context Footer (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-20 pointer-events-none">
        <div className="bg-zinc-900/80 backdrop-blur-md rounded-lg p-2 border border-white/5 shadow-lg">

           {/* Timestamp Badge */}
           {isBrandMode && enrichedCreator?.matches[0]?.timestamp && (
             <div className="flex items-center mb-2">
               <div className="flex items-center space-x-1.5 bg-blue-500/20 border border-blue-500/40 rounded px-2 py-1">
                 <Clock size={12} className="text-blue-400" />
                 <span className="text-xs font-mono font-bold text-blue-300">
                   {enrichedCreator.matches[0].timestamp}
                 </span>
               </div>
               <span className="ml-2 text-[10px] text-zinc-500">Brand appears</span>
             </div>
           )}

           {/* Animated Match Ticker */}
           <MatchTicker
             keyword={keyword}
             highlight={highlight}
             customExcerpt={isBrandMode && enrichedCreator ? enrichedCreator.matches[0]?.excerpt : undefined}
             matchType={isBrandMode && enrichedCreator ? enrichedCreator.matches[0]?.type : undefined}
           />
           
           {/* Meta */}
           <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono uppercase tracking-wider border-t border-white/5 pt-2">
              <div className="flex items-center">
                 <MapPin size={8} className="mr-1" /> {creator.location}
              </div>
              <div className="flex items-center">
                 {creator.platform === 'Instagram' ? <Instagram size={8} className="mr-1" /> : <Youtube size={8} className="mr-1" />}
                 {creator.engagementRate}% ER
              </div>
           </div>
        </div>
      </div>

      {/* Quick Add Button (Visible on Hover) */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // Prevent opening modal
          onAdd();
        }}
        className={`
          absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition-all transform shadow-lg z-30 cursor-pointer pointer-events-auto
          ${isHovered ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-75 translate-x-4'}
        `}
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = ({ nodes, results, onAddToDock, onSelectCreator, searchMode = 'standard', nikeCreators = [], coffeeCreators = [], semanticFilters = [], currentSearchQuery = '', isProcessing = false }) => {
  const isNikeMode = searchMode === 'nike';
  const isCoffeeMode = searchMode === 'coffee';
  const isBrandMode = isNikeMode || isCoffeeMode;
  const activeNodes = nodes.filter(n => n.isActive && results.has(n.id) && results.get(n.id)?.length! > 0);

  // Refs for auto-scrolling
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const prevNodeCount = useRef(nodes.length);

  // Sort state (must be at top level, not inside conditionals)
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    // Detect if a new node was added
    if (nodes.length > prevNodeCount.current) {
        const lastNode = nodes[nodes.length - 1];
        // Allow render to complete
        setTimeout(() => {
            const el = sectionRefs.current[lastNode.id];
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
    prevNodeCount.current = nodes.length;
  }, [nodes]);

  // Initial Load State: Show All Creators
  if (nodes.length === 0) {
     const creators = MOCK_CREATORS;
     
     return (
        <div className="h-full overflow-y-auto p-4 sm:p-8 pb-32 scroll-smooth">
          <div className="mb-12">
            <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur py-4 mb-4 border-b border-zinc-800 flex items-center border-l-4 border-l-blue-500 pl-4">
              <div>
                <h2 className="text-lg font-bold text-white capitalize flex items-center">
                  Discover
                </h2>
                <div className="text-xs text-zinc-500 font-mono mt-0.5">
                   Trending Now • {creators.length} Matches
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {creators.map(creator => (
                <CreatorCard 
                  key={creator.id} 
                  creator={creator} 
                  sourceNodeId="discover"
                  keyword="content"
                  highlight={false}
                  isDimmed={false} 
                  onAdd={() => onAddToDock(creator, 'discover')}
                  onClick={() => onSelectCreator(creator, 'discover')}
                />
              ))}
            </div>
          </div>
        </div>
    );
  }

  // Active Search but No Results (non-brand mode)
  if (activeNodes.length === 0 && !isBrandMode) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-600">
         <User size={64} className="mb-4 opacity-20" />
         <p className="text-xl font-light">No matches found.</p>
         <p className="text-sm opacity-50 mt-2">Try adjusting your filters or "Also" branches.</p>
      </div>
    );
  }

  // Brand Mode: Show brand-specific creators with sorting (Nike or Coffee)
  if (isBrandMode) {
    // Get the appropriate creators based on mode
    const brandCreators = isNikeMode ? nikeCreators : coffeeCreators;
    const brandKeyword = isNikeMode ? 'Nike' : 'Coffee';
    const sourceNodeId = isNikeMode ? 'nike-search' : 'coffee-search';

    if (brandCreators.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-zinc-600">
           <User size={64} className="mb-4 opacity-20" />
           <p className="text-xl font-light">No matches found.</p>
           <p className="text-sm opacity-50 mt-2">Try adjusting your filters or "Also" branches.</p>
        </div>
      );
    }

    // Sort creators based on selected option
    const sortedCreators = [...brandCreators].sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'evidence':
          // Count unique match types
          const aTypes = new Set(a.matches.map(m => m.type)).size;
          const bTypes = new Set(b.matches.map(m => m.type)).size;
          return bTypes - aTypes || b.matches.length - a.matches.length;
        case 'engagement':
          return b.engagementRate - a.engagementRate;
        case 'recency':
          const aRecency = MOCK_RECENCY[a.id] || 30;
          const bRecency = MOCK_RECENCY[b.id] || 30;
          return aRecency - bRecency; // Lower = more recent
        case 'followers':
          return b.followers - a.followers;
        default:
          return 0;
      }
    });

    const currentSortOption = SORT_OPTIONS.find(o => o.value === sortBy)!;

    return (
      <div className="h-full overflow-y-auto p-4 sm:p-8 pb-32 scroll-smooth">
        {/* Agentic Search Header - shows query breakdown */}
        <AgenticSearchHeader
          query={currentSearchQuery}
          subFilters={semanticFilters}
          isProcessing={isProcessing}
        />

        <div className="mb-12">
          {/* Results count and Sort dropdown */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-zinc-400">
                <span className="text-white font-bold">{sortedCreators.length}</span> creators found
              </span>
              <span className="text-[10px] text-zinc-600">|</span>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-zinc-300 transition-colors"
                >
                  <span className="text-zinc-500">Sort:</span>
                  <span className="font-medium text-white">{currentSortOption.label}</span>
                  <ChevronDown size={14} className={`text-zinc-500 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {sortDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setSortDropdownOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute top-full left-0 mt-1 w-56 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-40 overflow-hidden">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-b-0 ${
                            sortBy === option.value ? 'bg-zinc-800' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-medium ${sortBy === option.value ? 'text-blue-400' : 'text-white'}`}>
                              {option.label}
                            </span>
                            {sortBy === option.value && (
                              <div className="w-2 h-2 rounded-full bg-blue-400" />
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{option.description}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="hidden md:flex items-center space-x-4 text-[10px] text-zinc-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span>Visual</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Audio</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Context</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Note</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedCreators.map(creator => {
              return (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  sourceNodeId={sourceNodeId}
                  keyword={brandKeyword}
                  highlight={true}
                  isDimmed={false}
                  onAdd={() => onAddToDock(creator, sourceNodeId)}
                  onClick={() => onSelectCreator(creator, sourceNodeId)}
                  isBrandMode={true}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-8 pb-32 scroll-smooth">
      {/* Agentic Search Header for non-Nike mode too */}
      {currentSearchQuery && semanticFilters.length > 0 && (
        <AgenticSearchHeader
          query={currentSearchQuery}
          subFilters={semanticFilters}
          isProcessing={isProcessing}
        />
      )}

      {activeNodes.map(node => {
        const creators = results.get(node.id) || [];
        const isBranch = node.operator === 'OR';

        // Determine highlighting strategy:
        // Use the primary topic if available, otherwise default to generic 'content' without highlighting.
        const primaryTopic = node.filters.topics?.[0];
        const keyword = primaryTopic || 'content';
        const highlight = !!primaryTopic;

        return (
          <div
            key={node.id}
            ref={el => { sectionRefs.current[node.id] = el }}
            className="mb-12"
          >
            {/* Smart Section Header */}
            <div className={`sticky top-0 z-20 bg-zinc-950/90 backdrop-blur py-4 mb-4 border-b border-zinc-800 flex items-center ${isBranch ? 'border-l-4 border-l-orange-500 pl-4' : ''}`}>
              {!isBranch && <span className={`w-1.5 h-6 mr-3 rounded-full ${node.operator === 'ROOT' ? 'bg-blue-500' : 'bg-purple-500'}`} />}
              <div>
                <h2 className="text-lg font-bold text-white capitalize flex items-center">
                  {node.description}
                  {isBranch && <span className="ml-2 text-[10px] bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">BRANCH</span>}
                </h2>
                <div className="text-xs text-zinc-500 font-mono mt-0.5">
                   {node.operator === 'ROOT' ? 'Base Search' : `${node.operator} Logic Applied`} • {creators.length} Matches
                </div>
              </div>
            </div>

            {/* Hybrid Grid (Vertical Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {creators.map(creator => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  sourceNodeId={node.id}
                  keyword={keyword}
                  highlight={highlight}
                  isDimmed={false}
                  onAdd={() => onAddToDock(creator, node.id)}
                  onClick={() => onSelectCreator(creator, node.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Canvas;