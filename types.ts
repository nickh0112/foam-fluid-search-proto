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

// Nike Demo Types
export type MatchType = 'visual' | 'audio' | 'caption' | 'personalNote';

export type ContentType = 'Reel' | 'Story' | 'Post' | 'Video' | 'Paid';

export interface MatchEvidence {
  type: MatchType;
  confidence: number; // 0-100
  timestamp?: string; // e.g., "0:23"
  excerpt: string;    // The actual evidence
  context?: string;   // Additional context
}

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