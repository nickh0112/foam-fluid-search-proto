import { MatchType, PostSignal, ScoreBreakdown, SignalScoreDetail, CreatorPost, PostFilterState } from '../types';

// Base points per signal type (Hilary's framework, Nick's values)
const BASE_POINTS: Record<MatchType, number> = {
  caption: 100,
  audio: 75,
  visual: 50,
  personalNote: 0,
};

// Frequency multiplier with diminishing returns
function getFrequencyMultiplier(frequency: number): number {
  let multiplier = 1.0;
  // 2nd and 3rd mentions: +0.15 each
  if (frequency >= 2) multiplier += 0.15;
  if (frequency >= 3) multiplier += 0.15;
  // 4th and 5th mentions: +0.10 each
  if (frequency >= 4) multiplier += 0.10;
  if (frequency >= 5) multiplier += 0.10;
  // 6+ mentions: +0.05 each
  for (let i = 6; i <= frequency; i++) {
    multiplier += 0.05;
  }
  return multiplier;
}

// Density multipliers
const DENSITY_MULTIPLIER: Record<string, number> = {
  prominent: 1.2,
  moderate: 1.0,
  passing: 0.7,
};

// Reinforcement bonus for multi-signal posts
function getReinforcementBonus(signalTypes: Set<MatchType>): number {
  // Only count signal types that contribute points
  const scoringTypes = [...signalTypes].filter(t => BASE_POINTS[t] > 0);
  if (scoringTypes.length >= 3) return 50;
  if (scoringTypes.length >= 2) return 25;
  return 0;
}

export function calculatePostScore(signals: PostSignal[]): ScoreBreakdown {
  let captionPoints = 0;
  let audioPoints = 0;
  let visualPoints = 0;
  const signalDetails: SignalScoreDetail[] = [];
  const signalTypes = new Set<MatchType>();

  for (const signal of signals) {
    signalTypes.add(signal.type);
    const base = BASE_POINTS[signal.type];
    const freqMult = getFrequencyMultiplier(signal.frequency);
    const densMult = DENSITY_MULTIPLIER[signal.density];
    const total = base * freqMult * densMult;

    signalDetails.push({
      type: signal.type,
      basePoints: base,
      frequencyMultiplier: Math.round(freqMult * 100) / 100,
      densityMultiplier: densMult,
      totalPoints: Math.round(total * 100) / 100,
    });

    switch (signal.type) {
      case 'caption': captionPoints += total; break;
      case 'audio': audioPoints += total; break;
      case 'visual': visualPoints += total; break;
    }
  }

  const reinforcementBonus = getReinforcementBonus(signalTypes);
  const baseTotal = captionPoints + audioPoints + visualPoints + reinforcementBonus;

  // Determine dominant signal
  const signalPointMap: Record<string, number> = { caption: captionPoints, audio: audioPoints, visual: visualPoints };
  let dominantSignal: MatchType | null = null;
  let maxPoints = 0;
  for (const [type, pts] of Object.entries(signalPointMap)) {
    if (pts > maxPoints) {
      maxPoints = pts;
      dominantSignal = type as MatchType;
    }
  }

  return {
    captionPoints: Math.round(captionPoints * 100) / 100,
    audioPoints: Math.round(audioPoints * 100) / 100,
    visualPoints: Math.round(visualPoints * 100) / 100,
    reinforcementBonus,
    baseTotal: Math.round(baseTotal * 100) / 100,
    normalizedScore: 0, // Normalized in scoreAndRankPosts
    signalCount: signalTypes.size,
    dominantSignal: maxPoints > 0 ? dominantSignal : null,
    signalDetails,
  };
}

export function scoreAndRankPosts(posts: CreatorPost[]): CreatorPost[] {
  // First pass: calculate raw scores
  const scored = posts.map(post => {
    const breakdown = calculatePostScore(post.signals);
    return { ...post, scoreBreakdown: breakdown, compositeScore: breakdown.baseTotal };
  });

  // Find max score for normalization
  const maxScore = Math.max(...scored.map(p => p.compositeScore), 1);

  // Second pass: normalize to 0-100
  const normalized = scored.map(post => ({
    ...post,
    scoreBreakdown: {
      ...post.scoreBreakdown,
      normalizedScore: Math.round((post.compositeScore / maxScore) * 100),
    },
  }));

  // Sort by composite score descending
  return normalized.sort((a, b) => b.compositeScore - a.compositeScore);
}

/**
 * Pure filter function — chains all filter predicates against a list of posts.
 */
export function applyPostFilters(posts: CreatorPost[], filters: PostFilterState): CreatorPost[] {
  return posts.filter(post => {
    // Content type filter
    if (filters.contentTypes.length > 0 && !filters.contentTypes.includes(post.contentType)) {
      return false;
    }

    // Signal type filter
    if (filters.signalTypes.length > 0) {
      const postSignalTypes = post.signals.map(s => s.type);
      if (!filters.signalTypes.some(st => postSignalTypes.includes(st))) {
        return false;
      }
    }

    // Engagement: views
    if (filters.minViews != null && post.stats.views < filters.minViews) {
      return false;
    }

    // Engagement: likes
    if (filters.minLikes != null && post.stats.likes < filters.minLikes) {
      return false;
    }

    // Date range
    if (filters.dateFrom || filters.dateTo) {
      const postDate = new Date(post.postedAt).getTime();
      if (filters.dateFrom && postDate < new Date(filters.dateFrom).getTime()) return false;
      if (filters.dateTo && postDate > new Date(filters.dateTo).getTime()) return false;
    }

    // Text search (caption + signal excerpts)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const inCaption = post.caption.toLowerCase().includes(term);
      const inSignals = post.signals.some(s => s.excerpt.toLowerCase().includes(term));
      if (!inCaption && !inSignals) return false;
    }

    return true;
  });
}
