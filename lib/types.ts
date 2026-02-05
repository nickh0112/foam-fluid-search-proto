export type MatchType = 'visual' | 'audio' | 'caption' | 'notes';

export type ContentType = 'video' | 'reel' | 'short' | 'post';

export interface MatchLayer {
  type: MatchType;
  score: number;
  evidence: string;
  timestamp?: string;
  details?: string;
}

export interface Creator {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  platform: 'tiktok' | 'instagram' | 'youtube';
  followerCount: number;
  isVerified?: boolean;
  location?: string;
  engagementRate?: number;
}

export interface ScoreModifier {
  label: string;
  value: number;
  description?: string;
}

export interface CrossSellBrand {
  name: string;
  videoCount: number;
  matchTypes: MatchType[];
}

export interface BrandAffinity {
  brand: string;  // 'Nike', 'Coffee', etc.
  partnership?: string;
  mentionFrequency: 'high' | 'medium' | 'low';
  brandAlignment: string[];
}

export interface SearchResult {
  id: string;
  creator: Creator;
  videoTitle: string;
  videoUrl: string;
  thumbnail: string;
  freezeFrame?: string;
  freezeFrameTimestamp?: string;
  postedDate: string;
  viewCount: number;
  matches: MatchLayer[];
  totalScore: number;
  modifiers?: ScoreModifier[];
  crossSellBrands?: CrossSellBrand[];
  brandAffinity?: BrandAffinity;
}

export interface SemanticExpansion {
  term: string;
  isPrimary?: boolean;
  isActive: boolean;
}

export interface SearchState {
  query: string;
  expansions: SemanticExpansion[];
  results: SearchResult[];
  selectedResults: string[];
  isLoading: boolean;
  sortBy: 'relevance' | 'recent' | 'views' | 'creator';
}

export interface MatchEvidence {
  type: MatchType;
  score: number;
  evidence: string;
  timestamp?: string;
  details?: string;
}

export interface EnrichedCreator extends Creator {
  relevanceScore: number;
  matches: MatchEvidence[];
  contentType?: ContentType;
  brandAffinity: BrandAffinity;
  isLoading?: boolean;
}

// Type alias for backward compatibility
export type NikeCreator = EnrichedCreator;
