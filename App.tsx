import React, { useState, useEffect, useMemo } from 'react';
import { parseUserQuery, parsePostQuery } from './services/gemini';
import { scoreAndRankPosts, applyPostFilters } from './services/scoring';
import { Creator, DockItem, PostDockItem, QueryNode, Operator, NikeCreator, SemanticFilter, ParsedQueryResult, CreatorPost, PostFilterState, PostSortOption, DEFAULT_POST_FILTERS } from './types';
import { MOCK_CREATORS, NIKE_CREATORS, COFFEE_CREATORS } from './constants';
import { MARCUS_ACCOUNT } from './constants-creator-posts';
import Navbar from './components/Navbar';
import Canvas from './components/Canvas';
import Commander from './components/Commander';
import Dock from './components/Dock';
import PostDock from './components/PostDock';
import CreatorModal from './components/CreatorModal';
import PitchGenerator from './components/PitchGenerator';
import PostPitchGenerator from './components/PostPitchGenerator';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

type ViewMode = 'creators' | 'account-posts';

interface SelectionState {
  creator: Creator;
  nodeId: string;
}

const App: React.FC = () => {
  const [nodes, setNodes] = useState<QueryNode[]>([]);
  const [dockItems, setDockItems] = useState<DockItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPitching, setIsPitching] = useState(false); // State for pitch mode

  // Post dock state (account-posts mode)
  const [postDockItems, setPostDockItems] = useState<PostDockItem[]>([]);
  const [isPostPitching, setIsPostPitching] = useState(false);

  // Semantic search state
  const [semanticFilters, setSemanticFilters] = useState<SemanticFilter[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');

  // Selection state now tracks Context (which node was clicked)
  const [selection, setSelection] = useState<SelectionState | null>(null);

  // View mode: creator search vs account posts
  const [viewMode, setViewMode] = useState<ViewMode>('creators');

  // Account-posts filter + sort state (lifted from Canvas)
  const [postFilters, setPostFilters] = useState<PostFilterState>(DEFAULT_POST_FILTERS);
  const [postSortBy, setPostSortBy] = useState<PostSortOption>('recency');

  // Track whether user has searched in account-posts mode
  const [hasPostSearched, setHasPostSearched] = useState(false);
  const [isPostSearching, setIsPostSearching] = useState(false);

  // --- Scored & Ranked Posts for Account Mode ---
  const allRankedPosts = useMemo(() => {
    if (viewMode !== 'account-posts') return [];
    return scoreAndRankPosts(MARCUS_ACCOUNT.posts);
  }, [viewMode]);

  const filteredPosts = useMemo(() => {
    return applyPostFilters(allRankedPosts, postFilters);
  }, [allRankedPosts, postFilters]);

  // --- Logic Engine ---

  const nodeResults = useMemo(() => {
    const resultsMap = new Map<string, Creator[]>();
    let currentBaseSet: Creator[] = [];

    nodes.forEach((node, index) => {
      if (!node.isActive) {
        resultsMap.set(node.id, []);
        return;
      }

      // 1. Calculate Candidates for this Node (Filtering MOCK_CREATORS)
      const candidates = MOCK_CREATORS.filter(c => {
        // --- Explicit Metadata Filters ---
        if (node.filters.gender && c.gender.toLowerCase() !== node.filters.gender.toLowerCase()) return false;
        if (node.filters.location && !c.location.toLowerCase().includes(node.filters.location.toLowerCase())) return false;
        if (node.filters.platform && c.platform.toLowerCase() !== node.filters.platform.toLowerCase()) return false;
        if (node.filters.minFollowers && c.followers < node.filters.minFollowers) return false;
        if (node.filters.minEngagement && c.engagementRate < node.filters.minEngagement) return false;

        // --- Keyword / Heuristic Filters ---
        const topics = node.filters.topics || [];

        if (topics.length === 0 && !node.filters.gender && !node.filters.location && !node.filters.platform && !node.filters.minFollowers && !node.filters.minEngagement) {
            return true;
        }

        const joinedTopics = topics.join(' ').toLowerCase();

        // Heuristic: Gender (if not explicitly set)
        if (!node.filters.gender) {
            if (joinedTopics.includes('only male') || (joinedTopics.includes('male') && !joinedTopics.includes('female'))) {
                if (c.gender !== 'Male') return false;
            }
            if (joinedTopics.includes('female') || joinedTopics.includes('woman') || joinedTopics.includes('women')) {
                if (c.gender !== 'Female') return false;
            }
        }

        // Heuristic: Location (if not explicitly set)
        if (!node.filters.location) {
            if (joinedTopics.includes('ny') || joinedTopics.includes('new york') || joinedTopics.includes('nyc')) {
                if (!c.location.toLowerCase().includes('new york') && !c.location.toLowerCase().includes('ny')) return false;
            }
            if (joinedTopics.includes('la') || joinedTopics.includes('los angeles')) {
                if (!c.location.toLowerCase().includes('los angeles') && !c.location.toLowerCase().includes('la')) return false;
            }
        }

        // Heuristic: Platform
        if (!node.filters.platform) {
            if (joinedTopics.includes('tiktok') && c.platform !== 'TikTok') return false;
            if (joinedTopics.includes('youtube') && c.platform !== 'YouTube') return false;
            if (joinedTopics.includes('instagram') && c.platform !== 'Instagram') return false;
        }

        // --- Content Matching ---
        const controlWords = ['male', 'female', 'man', 'woman', 'men', 'women', 'only', 'also', 'except', 'in', 'on', 'from', 'who', 'show', 'me', 'ny', 'nyc', 'new york', 'la', 'creators', 'creator', 'users', 'influencers', 'people', 'limit', 'add', 'remove', 'more', 'than', 'over', 'under', 'less', 'engagement', 'followers', 'rate', 'min', 'max'];

        const contentKeywords = topics.filter(t => {
            const words = t.toLowerCase().split(/[\s,]+/);
            const significant = words.filter(w => !controlWords.includes(w) && w.length > 1 && !w.match(/^\d+$/) && !w.includes('%') && !w.includes('k'));
            return significant.length > 0;
        });

        if (contentKeywords.length > 0) {
             const hasMatch = contentKeywords.some(keyword => {
                 const k = keyword.toLowerCase();
                 // Implicit mappings for demo consistency (Broad match)
                 if (k.includes('coffee') && c.topics.some(t => t.toLowerCase().includes('coffee'))) return true;
                 if (k.includes('basket') && c.topics.some(t => t.toLowerCase().includes('basket'))) return true;
                 if (k.includes('fit') && c.topics.some(t => t.toLowerCase().includes('fit'))) return true;
                 if (k.includes('fash') && c.topics.some(t => t.toLowerCase().includes('fash'))) return true;

                 // Direct match
                 if (c.name.toLowerCase().includes(k)) return true;
                 if (c.handle.toLowerCase().includes(k)) return true;
                 if (c.topics.some(t => t.toLowerCase().includes(k))) return true;

                 return false;
             });

             if (!hasMatch) return false;
        }

        return true;
      });

      // 2. Apply Logic Stream Operators
      let finalMatches: Creator[] = [];

      if (node.operator === 'ROOT') {
        finalMatches = candidates;
        currentBaseSet = finalMatches;
      } else if (node.operator === 'AND') {
        // Narrow the current base set
        finalMatches = currentBaseSet.filter(c => candidates.some(cand => cand.id === c.id));
        currentBaseSet = finalMatches;
      } else if (node.operator === 'OR') {
        // Add a new branch (Candidates of this node).
        finalMatches = candidates;
      } else if (node.operator === 'NOT') {
        // Exclude candidates from the base set
        finalMatches = [];
        currentBaseSet = currentBaseSet.filter(c => !candidates.some(cand => cand.id === c.id));
      }

      resultsMap.set(node.id, finalMatches);
    });

    return resultsMap;
  }, [nodes]);

  // --- Handlers ---

  const handleCommanderSubmit = async (inputText: string) => {
    // In account-posts mode, use Commander → Gemini to set structured filters
    if (viewMode === 'account-posts') {
      setHasPostSearched(true);
      setIsPostSearching(true);

      // Immediate: apply as text search
      setPostFilters({ ...DEFAULT_POST_FILTERS, searchTerm: inputText });

      // Switch to scored view on first search
      if (postSortBy === 'recency') setPostSortBy('composite');

      // Simple queries (1-2 words, no filter keywords) skip Gemini entirely
      const isSimpleQuery = inputText.trim().split(/\s+/).length <= 2 &&
        !/\b(reels?|stories|carousel|video|views?|likes?|recent|popular|trending|before|after|from|since)\b/i.test(inputText);

      if (isSimpleQuery) {
        setTimeout(() => setIsPostSearching(false), 600);
        return;
      }

      // Keep skeletons until Gemini resolves, with a minimum 600ms shimmer
      const minShimmer = new Promise(r => setTimeout(r, 600));

      parsePostQuery(inputText)
        .then(async result => {
          await minShimmer;
          const hasStructuredFilters =
            (result.filters.contentTypes && result.filters.contentTypes.length > 0) ||
            (result.filters.signalTypes && result.filters.signalTypes.length > 0) ||
            result.filters.minViews != null ||
            result.filters.minLikes != null ||
            result.filters.dateFrom != null;

          if (hasStructuredFilters) {
            setPostFilters({
              ...DEFAULT_POST_FILTERS,
              ...result.filters,
              contentTypes: result.filters.contentTypes || [],
              signalTypes: result.filters.signalTypes || [],
            });
          }
          if (result.sortBy) setPostSortBy(result.sortBy);
          setIsPostSearching(false);
        })
        .catch(async () => {
          await minShimmer;
          setIsPostSearching(false);
        });

      return;
    }

    setIsProcessing(true);
    setCurrentSearchQuery(inputText);
    try {
      const isFirst = nodes.length === 0;

      const followerMatch = inputText.match(/Only creators with over (\d+) followers/i);
      if (followerMatch) {
          const minFollowers = parseInt(followerMatch[1], 10);
          const newNode: QueryNode = {
            id: generateId(),
            parentId: isFirst ? null : nodes[nodes.length - 1].id,
            operator: isFirst ? 'ROOT' : 'AND',
            description: `> ${(minFollowers >= 1000 ? (minFollowers/1000).toFixed(0) + 'k' : minFollowers)} Followers`,
            filters: { minFollowers: minFollowers }, // Explicitly set filter, no topics
            isActive: true,
            rawInput: inputText
          };
          setNodes(prev => [...prev, newNode]);
          setSemanticFilters([]);
          setIsProcessing(false);
          return;
      }

      const parsed = await parseUserQuery(inputText, isFirst);

      const filters = parsed.filters || {};
      if ((!filters.topics || filters.topics.length === 0) && !filters.gender && !filters.location && !filters.platform && !filters.minFollowers && !filters.minEngagement) {
          filters.topics = [inputText];
      }

      // Store semantic filters from the parsed response
      if (parsed.semanticFilters && Array.isArray(parsed.semanticFilters)) {
        setSemanticFilters(parsed.semanticFilters as SemanticFilter[]);
      } else {
        // Generate default semantic filters based on query
        const defaultFilters: SemanticFilter[] = [];
        if (filters.topics && filters.topics.length > 0) {
          defaultFilters.push({
            type: 'visual',
            label: filters.topics[0],
            description: `${filters.topics[0]} detected in content`
          });
        }
        setSemanticFilters(defaultFilters);
      }

      const newNode: QueryNode = {
        id: generateId(),
        parentId: isFirst ? null : nodes[nodes.length - 1].id,
        operator: (parsed.operator as Operator) || (isFirst ? 'ROOT' : 'AND'),
        description: parsed.description || inputText,
        filters: filters,
        isActive: true,
        rawInput: inputText
      };

      setNodes(prev => [...prev, newNode]);
    } catch (e) {
      console.error("Failed to process query", e);
      const newNode: QueryNode = {
        id: generateId(),
        parentId: nodes.length > 0 ? nodes[nodes.length - 1].id : null,
        operator: nodes.length === 0 ? 'ROOT' : 'AND',
        description: inputText,
        filters: { topics: [inputText] },
        isActive: true,
        rawInput: inputText
      };
      setNodes(prev => [...prev, newNode]);
      setSemanticFilters([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleNode = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, isActive: !n.isActive } : n));
  };

  const handleDeleteNode = (id: string) => {
    setNodes(prev => prev.filter(n => n.id !== id));
  };

  const handleAddToDock = (creator: Creator, sourceNodeId: string = 'manual') => {
    setDockItems(prev => {
      if (prev.find(i => i.creator.id === creator.id)) return prev;
      return [...prev, { creator, sourceNodeId, note: '' }];
    });
  };

  const handleRemoveFromDock = (creatorId: string) => {
    setDockItems(prev => prev.filter(i => i.creator.id !== creatorId));
  };

  const handleUpdateDockNote = (creatorId: string, note: string) => {
    setDockItems(prev => prev.map(item =>
      item.creator.id === creatorId ? { ...item, note } : item
    ));
  };

  const handleAddPostToDock = (post: CreatorPost) => {
    setPostDockItems(prev => {
      if (prev.find(i => i.post.id === post.id)) return prev;
      return [...prev, { post, note: '' }];
    });
  };

  const handleRemovePostFromDock = (postId: string) => {
    setPostDockItems(prev => prev.filter(i => i.post.id !== postId));
  };

  const handleUpdatePostDockNote = (postId: string, note: string) => {
    setPostDockItems(prev => prev.map(item =>
      item.post.id === postId ? { ...item, note } : item
    ));
  };

  const handleDockDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.creatorId && data.sourceNodeId) {
        const creator = MOCK_CREATORS.find(c => c.id === data.creatorId);
        if (creator) {
          handleAddToDock(creator, data.sourceNodeId);
        }
      }
    } catch (err) {
      console.error("Drop failed", err);
    }
  };

  const handleSelectCreator = (creator: Creator, nodeId: string) => {
    setSelection({ creator, nodeId });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'creators') {
      setPostFilters(DEFAULT_POST_FILTERS);
      setPostSortBy('recency');
    }
    if (mode === 'account-posts') {
      // Reset to fresh recency state
      setPostFilters(DEFAULT_POST_FILTERS);
      setPostSortBy('recency');
      setHasPostSearched(false);
      setIsPostSearching(false);
    }
    if (mode === 'creators') {
      // Clear post dock when switching away
      setPostDockItems([]);
      setIsPostPitching(false);
    }
  };

  const nodeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    nodeResults.forEach((v, k) => counts[k] = v.length);
    return counts;
  }, [nodeResults]);

  // Detect Nike search mode
  const isNikeSearch = useMemo(() => {
    return nodes.some(n =>
      n.rawInput.toLowerCase().includes('nike')
    );
  }, [nodes]);

  // Detect Coffee search mode
  const isCoffeeSearch = useMemo(() => {
    const coffeeTerms = ['coffee', 'espresso', 'latte', 'barista', 'cold brew', 'matcha', 'cafe', 'brew'];
    return nodes.some(n =>
      coffeeTerms.some(term => n.rawInput.toLowerCase().includes(term))
    );
  }, [nodes]);

  // Determine search mode
  const searchMode: 'nike' | 'coffee' | 'standard' | 'single-creator' = useMemo(() => {
    if (viewMode === 'account-posts') return 'single-creator';
    if (isNikeSearch) return 'nike';
    if (isCoffeeSearch) return 'coffee';
    return 'standard';
  }, [viewMode, isNikeSearch, isCoffeeSearch]);

  // Determine Visibility
  const hasNodes = nodes.length > 0;
  const hasDockItems = dockItems.length > 0;
  const hasPostDockItems = postDockItems.length > 0;

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-zinc-100 overflow-hidden font-sans">

      {/* Top Navbar */}
      <Navbar viewMode={viewMode} onViewModeChange={handleViewModeChange} />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* PITCH GENERATOR: Overlays workspace but stays under Navbar */}
        {isPitching && (
          <PitchGenerator
            items={dockItems}
            onClose={() => setIsPitching(false)}
            onOpenItem={(item) => setSelection({ creator: item.creator, nodeId: item.sourceNodeId })}
          />
        )}

        {/* POST PITCH GENERATOR: Overlays workspace in account-posts mode */}
        {isPostPitching && (
          <PostPitchGenerator
            items={postDockItems}
            onClose={() => setIsPostPitching(false)}
          />
        )}

        {/* Zone B: The Canvas (now full width, no sidebar) */}
        <main className="flex-1 relative bg-zinc-950 flex flex-col min-w-0">
          <Canvas
            nodes={nodes}
            results={nodeResults}
            onAddToDock={handleAddToDock}
            onSelectCreator={handleSelectCreator}
            searchMode={searchMode}
            nikeCreators={NIKE_CREATORS}
            coffeeCreators={COFFEE_CREATORS}
            semanticFilters={semanticFilters}
            currentSearchQuery={currentSearchQuery}
            isProcessing={isProcessing}
            singleCreatorAccount={viewMode === 'account-posts' ? MARCUS_ACCOUNT : undefined}
            rankedPosts={viewMode === 'account-posts' ? filteredPosts : undefined}
            totalPosts={viewMode === 'account-posts' ? allRankedPosts.length : undefined}
            postFilters={viewMode === 'account-posts' ? postFilters : undefined}
            onPostFiltersChange={setPostFilters}
            postSortBy={viewMode === 'account-posts' ? postSortBy : undefined}
            onPostSortByChange={setPostSortBy}
            hasPostSearched={viewMode === 'account-posts' ? hasPostSearched : undefined}
            isPostSearching={viewMode === 'account-posts' ? isPostSearching : undefined}
            onAddPostToDock={viewMode === 'account-posts' ? handleAddPostToDock : undefined}
            selectedPostIds={postDockItems.map(i => i.post.id)}
          />

          {/* Zone C: The Commander (Floating) - HIDDEN WHEN PITCHING */}
          {!isPitching && (
             <Commander onSubmit={handleCommanderSubmit} isProcessing={isProcessing} viewMode={viewMode} />
          )}
        </main>

        {/* Zone D: The Dock — creator mode */}
        {viewMode === 'creators' && (
          <aside
            className={`
              border-l border-zinc-800 bg-zinc-950 flex-shrink-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              ${hasDockItems ? 'w-96 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-4'}
            `}
            onDrop={handleDockDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-96 h-full">
              <Dock
                items={dockItems}
                onRemoveItem={handleRemoveFromDock}
                onUpdateNote={handleUpdateDockNote}
                onGenerate={() => setIsPitching(true)}
              />
            </div>
          </aside>
        )}

        {/* Zone D: Post Dock — account-posts mode */}
        {viewMode === 'account-posts' && (
          <aside
            className={`
              border-l border-zinc-800 bg-zinc-950 flex-shrink-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
              ${hasPostDockItems ? 'w-96 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-4'}
            `}
          >
            <div className="w-96 h-full">
              <PostDock
                items={postDockItems}
                onRemoveItem={handleRemovePostFromDock}
                onUpdateNote={handleUpdatePostDockNote}
                onGenerate={() => setIsPostPitching(true)}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Detail Modal — only for creator search mode */}
      {viewMode === 'creators' && (
        <CreatorModal
          creator={selection?.creator || null}
          triggeringNode={nodes.find(n => n.id === selection?.nodeId)}
          onClose={() => setSelection(null)}
          onAddToDock={(c) => {
              handleAddToDock(c);
              setSelection(null);
          }}
          searchMode={searchMode}
        />
      )}

    </div>
  );
};

export default App;
