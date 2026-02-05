import { create } from 'zustand';
import { SearchState, SemanticExpansion, SearchResult, EnrichedCreator } from './types';
import { mockResults, semanticExpansions, COFFEE_CREATORS, coffeeSemanticExpansions } from '@/data/mock-data';

// Coffee search terms for detection
const COFFEE_TERMS = ['coffee', 'espresso', 'latte', 'cappuccino', 'barista', 'cafe', 'matcha', 'cold brew', 'tea', 'pour over'];

// Helper to detect if query is coffee-related
function isCoffeeSearch(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return COFFEE_TERMS.some(term => lowerQuery.includes(term));
}

// Convert EnrichedCreator to SearchResult format for display
function enrichedCreatorToSearchResult(creator: EnrichedCreator, index: number): SearchResult {
  return {
    id: creator.id,
    creator: {
      id: creator.id,
      handle: creator.handle,
      name: creator.name,
      avatar: creator.avatar,
      platform: creator.platform,
      followerCount: creator.followerCount,
      isVerified: creator.isVerified,
      location: creator.location,
      engagementRate: creator.engagementRate,
    },
    videoTitle: `${creator.brandAffinity.brandAlignment[0] || 'Coffee'} content by @${creator.handle}`,
    videoUrl: `https://${creator.platform}.com/@${creator.handle}`,
    thumbnail: `/generated/coffee${index + 1}.jpeg`,
    freezeFrame: `/generated/coffee${index + 1}.jpeg`,
    freezeFrameTimestamp: creator.matches[0]?.timestamp,
    postedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    viewCount: Math.floor(creator.followerCount * (creator.engagementRate || 5) / 100 * (Math.random() * 5 + 1)),
    totalScore: creator.relevanceScore,
    matches: creator.matches.map(m => ({
      type: m.type,
      score: m.score,
      evidence: m.evidence,
      timestamp: m.timestamp,
      details: m.details,
    })),
    modifiers: [
      { label: 'Brand Affinity', value: 15, description: `${creator.brandAffinity.mentionFrequency} frequency ${creator.brandAffinity.brand} mentions` },
      ...(creator.brandAffinity.partnership ? [{ label: 'Partnership', value: 10, description: creator.brandAffinity.partnership }] : []),
    ],
    crossSellBrands: creator.brandAffinity.brandAlignment.slice(0, 4).map(term => ({
      name: term.charAt(0).toUpperCase() + term.slice(1),
      videoCount: Math.floor(Math.random() * 10) + 1,
      matchTypes: ['visual', 'audio'] as const,
    })),
    // Store brand affinity for display in modal
    brandAffinity: creator.brandAffinity,
  } as SearchResult & { brandAffinity: typeof creator.brandAffinity };
}

interface SearchStore extends SearchState {
  setQuery: (query: string) => void;
  setExpansions: (expansions: SemanticExpansion[]) => void;
  toggleExpansion: (term: string) => void;
  removeExpansion: (term: string) => void;
  setResults: (results: SearchResult[]) => void;
  toggleResultSelection: (id: string) => void;
  clearSelection: () => void;
  setLoading: (isLoading: boolean) => void;
  setSortBy: (sortBy: SearchState['sortBy']) => void;
  executeSearch: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',
  expansions: [],
  results: [],
  selectedResults: [],
  isLoading: false,
  sortBy: 'relevance',

  setQuery: (query) => set({ query }),

  setExpansions: (expansions) => set({ expansions }),

  toggleExpansion: (term) =>
    set((state) => ({
      expansions: state.expansions.map((e) =>
        e.term === term ? { ...e, isActive: !e.isActive } : e
      ),
    })),

  removeExpansion: (term) =>
    set((state) => ({
      expansions: state.expansions.filter((e) => e.term !== term || e.isPrimary),
    })),

  setResults: (results) => set({ results }),

  toggleResultSelection: (id) =>
    set((state) => ({
      selectedResults: state.selectedResults.includes(id)
        ? state.selectedResults.filter((r) => r !== id)
        : [...state.selectedResults, id],
    })),

  clearSelection: () => set({ selectedResults: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setSortBy: (sortBy) => {
    const { results } = get();
    const sortedResults = [...results];

    switch (sortBy) {
      case 'relevance':
        sortedResults.sort((a, b) => b.totalScore - a.totalScore);
        break;
      case 'recent':
        sortedResults.sort(
          (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
        break;
      case 'views':
        sortedResults.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'creator':
        sortedResults.sort((a, b) =>
          a.creator.handle.localeCompare(b.creator.handle)
        );
        break;
    }

    set({ sortBy, results: sortedResults });
  },

  executeSearch: (query) => {
    set({ isLoading: true, query });

    // Simulate search delay
    setTimeout(() => {
      if (query.toLowerCase().includes('crocs')) {
        set({
          expansions: semanticExpansions,
          results: mockResults,
          isLoading: false,
        });
      } else if (isCoffeeSearch(query)) {
        // Coffee search - convert enriched creators to search results
        const coffeeResults = COFFEE_CREATORS.map((creator, index) =>
          enrichedCreatorToSearchResult(creator, index)
        );
        set({
          expansions: coffeeSemanticExpansions,
          results: coffeeResults,
          isLoading: false,
        });
      } else {
        set({
          expansions: [{ term: query, isPrimary: true, isActive: true }],
          results: [],
          isLoading: false,
        });
      }
    }, 800);
  },
}));
