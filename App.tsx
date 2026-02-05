import React, { useState, useEffect, useMemo } from 'react';
import { parseUserQuery } from './services/gemini';
import { Creator, DockItem, QueryNode, Operator, NikeCreator, SemanticFilter, ParsedQueryResult } from './types';
import { MOCK_CREATORS, NIKE_CREATORS, COFFEE_CREATORS } from './constants';
import Navbar from './components/Navbar';
import Canvas from './components/Canvas';
import Commander from './components/Commander';
import Dock from './components/Dock';
import CreatorModal from './components/CreatorModal';
import PitchGenerator from './components/PitchGenerator'; 

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

interface SelectionState {
  creator: Creator;
  nodeId: string;
}

const App: React.FC = () => {
  const [nodes, setNodes] = useState<QueryNode[]>([]);
  const [dockItems, setDockItems] = useState<DockItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPitching, setIsPitching] = useState(false); // State for pitch mode

  // Semantic search state
  const [semanticFilters, setSemanticFilters] = useState<SemanticFilter[]>([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');

  // Selection state now tracks Context (which node was clicked)
  const [selection, setSelection] = useState<SelectionState | null>(null);

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
  const searchMode: 'nike' | 'coffee' | 'standard' = useMemo(() => {
    if (isNikeSearch) return 'nike';
    if (isCoffeeSearch) return 'coffee';
    return 'standard';
  }, [isNikeSearch, isCoffeeSearch]);

  // Determine Visibility
  const hasNodes = nodes.length > 0;
  const hasDockItems = dockItems.length > 0;

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-zinc-100 overflow-hidden font-sans">

      {/* Top Navbar */}
      <Navbar />

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
          />

          {/* Zone C: The Commander (Floating) - HIDDEN WHEN PITCHING */}
          {!isPitching && (
             <Commander onSubmit={handleCommanderSubmit} isProcessing={isProcessing} />
          )}
        </main>

        {/* Zone D: The Dock */}
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
      </div>

      {/* Detail Modal */}
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

    </div>
  );
};

export default App;