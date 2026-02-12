export type Operator = 'ROOT' | 'AND' | 'OR' | 'NOT';

export interface FilterCriteria {
  gender?: string;
  location?: string;
  platform?: string;
  minFollowers?: number;
  minEngagement?: number;
  topics?: string[];
}

export interface QueryNode {
  id: string;
  parentId: string | null;
  operator: Operator;
  description: string;
  filters: FilterCriteria;
  isActive: boolean;
  rawInput: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  thumbnail: string; // Placeholder for video
  gender: 'Male' | 'Female' | 'Non-binary';
  location: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  followers: number;
  engagementRate: number;
  topics: string[];
}

export interface DockItem {
  creator: Creator;
  sourceNodeId: string; // Which query node found this creator
  note?: string; // "Why I picked this"
}

export interface PostDockItem {
  post: CreatorPost;
  note?: string;
}

// Brand Demo Types
export type MatchType = 'visual' | 'audio' | 'caption' | 'personalNote';

export type ContentType = 'Reel' | 'Story' | 'Post' | 'Video' | 'Paid';

export interface MatchEvidence {
  type: MatchType;
  confidence: number; // 0-100
  timestamp?: string; // e.g., "0:23"
  excerpt: string;    // The actual evidence
  context?: string;   // Additional context
}

// Generic brand affinity interface
export interface BrandAffinity {
  brand: string;
  partnership?: string;
  mentionFrequency: 'high' | 'medium' | 'low';
  brandAlignment: string[];
}

// Generic enriched creator with brand affinity
export interface EnrichedCreator extends Creator {
  relevanceScore: number; // 0-100
  matches: MatchEvidence[];
  contentType?: ContentType;
  brandAffinity: BrandAffinity;
}

// Nike-specific type (extends EnrichedCreator for backward compatibility)
export interface NikeCreator extends Creator {
  relevanceScore: number; // 0-100
  matches: MatchEvidence[];
  contentType?: ContentType;
  nikeAffinity: {
    partnership?: string;
    mentionFrequency: 'high' | 'medium' | 'low';
    brandAlignment: string[];
  };
}

// Semantic filter for agentic search breakdown
export interface SemanticFilter {
  type: 'visual' | 'audio' | 'context' | 'notes';
  label: string;
  description: string;
}

// Parsed query result from Gemini including semantic filters
export interface ParsedQueryResult extends Partial<QueryNode> {
  semanticFilters?: SemanticFilter[];
}

// --- Single-Creator Post Flow Types ---

export interface PostSignal {
  type: MatchType;
  confidence: number;
  timestamp?: string;
  excerpt: string;
  context?: string;
  frequency: number;
  density: 'prominent' | 'moderate' | 'passing';
}

export interface SignalScoreDetail {
  type: MatchType;
  basePoints: number;
  frequencyMultiplier: number;
  densityMultiplier: number;
  totalPoints: number;
}

export interface ScoreBreakdown {
  captionPoints: number;
  audioPoints: number;
  visualPoints: number;
  reinforcementBonus: number;
  baseTotal: number;
  normalizedScore: number;
  signalCount: number;
  dominantSignal: MatchType | null;
  signalDetails: SignalScoreDetail[];
}

export interface CreatorPost {
  id: string;
  thumbnail: string;
  contentType: ContentType;
  caption: string;
  postedAt: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  signals: PostSignal[];
  compositeScore: number;
  scoreBreakdown: ScoreBreakdown;
}

export interface CreatorAccount {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  followers: number;
  engagementRate: number;
  bio: string;
  posts: CreatorPost[];
}

// --- Post Filter Types ---

export type PostSortOption = 'composite' | 'signals' | 'engagement' | 'recency';

export interface PostFilterState {
  contentTypes: ContentType[];   // empty = show all
  signalTypes: MatchType[];      // empty = show all
  minViews?: number;
  minLikes?: number;
  dateFrom?: string;             // ISO 8601
  dateTo?: string;
  platform?: 'TikTok' | 'Instagram' | 'YouTube';
  searchTerm?: string;
}

export const DEFAULT_POST_FILTERS: PostFilterState = {
  contentTypes: [],
  signalTypes: [],
};

export interface ParsedPostFilterResult {
  filters: Partial<PostFilterState>;
  sortBy?: PostSortOption;
}