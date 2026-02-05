'use client';

import { motion } from 'framer-motion';
import { Eye, Mic, FileText, StickyNote } from 'lucide-react';
import { MatchType } from '@/lib/types';

interface MatchBadgeProps {
  type: MatchType;
  score?: number;
  timestamp?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const matchConfig: Record<MatchType, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  visual: {
    icon: Eye,
    label: 'Visual',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  audio: {
    icon: Mic,
    label: 'Audio',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  caption: {
    icon: FileText,
    label: 'Caption',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  notes: {
    icon: StickyNote,
    label: 'Notes',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
};

export function MatchBadge({ type, score, timestamp, showLabel = true, size = 'md' }: MatchBadgeProps) {
  const config = matchConfig[type];
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center gap-1.5 border rounded-md
        ${config.bg} ${config.color}
        ${size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'}
      `}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {showLabel && <span className="font-medium">{config.label}</span>}
      {timestamp && (
        <span className="opacity-70 font-mono">@{timestamp}</span>
      )}
      {score !== undefined && (
        <span className="opacity-70 font-data">+{score}</span>
      )}
    </motion.span>
  );
}
