'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { SemanticExpansion } from '@/lib/types';

interface SemanticChipProps {
  expansion: SemanticExpansion;
  index: number;
  onRemove?: (term: string) => void;
  onToggle?: (term: string) => void;
}

export function SemanticChip({ expansion, index, onRemove, onToggle }: SemanticChipProps) {
  const { term, isPrimary, isActive } = expansion;

  return (
    <motion.button
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{
        opacity: isActive ? 1 : 0.5,
        y: 0,
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        duration: 0.2,
        delay: index * 0.05,
        ease: 'easeOut'
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle?.(term)}
      className={`
        group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
        text-sm font-medium transition-all duration-150
        ${isPrimary
          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
          : isActive
            ? 'bg-[#F5F5F0] text-[#1A1A1A] border border-[#D1D5DB] hover:border-indigo-500/50'
            : 'bg-white text-[#9CA3AF] border border-[#E5E5E0]'
        }
      `}
    >
      <span>{term}</span>
      {!isPrimary && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(term);
          }}
          aria-label={`Remove ${term}`}
          className={`
            w-4 h-4 flex items-center justify-center rounded
            opacity-0 group-hover:opacity-100 transition-opacity
            hover:bg-black/10
          `}
        >
          <X className="w-3 h-3" aria-hidden="true" />
        </button>
      )}
    </motion.button>
  );
}
