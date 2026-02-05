'use client';

import { motion } from 'framer-motion';
import { Eye, Mic, FileText, StickyNote, ChevronRight } from 'lucide-react';
import { MatchLayer, ScoreModifier, MatchType } from '@/lib/types';

interface ScoreBreakdownProps {
  matches: MatchLayer[];
  modifiers?: ScoreModifier[];
  totalScore: number;
  onViewEvidence?: () => void;
}

const layerConfig: Record<MatchType, { icon: React.ElementType; label: string; color: string; barColor: string }> = {
  visual: {
    icon: Eye,
    label: 'Visual Match',
    color: 'text-emerald-400',
    barColor: 'bg-emerald-500',
  },
  audio: {
    icon: Mic,
    label: 'Audio Match',
    color: 'text-amber-400',
    barColor: 'bg-amber-500',
  },
  caption: {
    icon: FileText,
    label: 'Caption Match',
    color: 'text-blue-400',
    barColor: 'bg-blue-500',
  },
  notes: {
    icon: StickyNote,
    label: 'Notes Match',
    color: 'text-purple-400',
    barColor: 'bg-purple-500',
  },
};

export function ScoreBreakdown({ matches, modifiers, onViewEvidence }: ScoreBreakdownProps) {
  const maxScore = 40; // Max score per layer for progress bar scaling

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="mt-3 pt-3 border-t border-[#E5E5E0]"
    >
      {/* Match Layers */}
      <div className="space-y-3 mb-4">
        {matches.map((match, index) => {
          const config = layerConfig[match.type];
          const Icon = config.icon;
          const percentage = Math.min((match.score / maxScore) * 100, 100);

          return (
            <motion.div
              key={match.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className={`flex items-center gap-2 ${config.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{config.label}</span>
                  {match.timestamp && (
                    <span className="text-[10px] opacity-60 font-mono">@{match.timestamp}</span>
                  )}
                </div>
                <span className="text-xs font-data font-semibold text-[#1A1A1A]">
                  {match.score} pts
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-[#E5E5E0] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.3, ease: 'easeOut' }}
                  className={`h-full ${config.barColor} rounded-full`}
                />
              </div>

              {/* Evidence */}
              <p className="mt-1.5 text-xs text-[#6B6B6B] leading-relaxed">
                {match.evidence}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Modifiers */}
      {modifiers && modifiers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: matches.length * 0.1 + 0.2 }}
          className="pt-3 border-t border-[#E5E5E0]"
        >
          <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-2">Score Modifiers</p>
          <div className="space-y-1.5">
            {modifiers.map((modifier) => (
              <div key={modifier.label} className="flex items-center justify-between">
                <span className="text-xs text-[#6B6B6B]">{modifier.label}</span>
                <span className="text-xs font-data font-medium text-indigo-600">
                  +{modifier.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* View Evidence Link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: matches.length * 0.1 + 0.3 }}
        onClick={onViewEvidence}
        className="mt-4 flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        <span>View Full Evidence</span>
        <ChevronRight className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
}
