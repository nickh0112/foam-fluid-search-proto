'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Brain } from 'lucide-react';
import { SemanticChip } from './SemanticChip';
import { SemanticExpansion } from '@/lib/types';

interface QueryInterpretationBarProps {
  expansions: SemanticExpansion[];
  onRemove: (term: string) => void;
  onToggle: (term: string) => void;
  onAddTerm?: () => void;
  onEdit?: () => void;
}

export function QueryInterpretationBar({
  expansions,
  onRemove,
  onToggle,
  onAddTerm,
  onEdit,
}: QueryInterpretationBarProps) {
  const activeCount = expansions.filter((e) => e.isActive).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full p-4 bg-white border border-[#E5E5E0] rounded-xl shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">
          <Brain className="w-3.5 h-3.5 text-indigo-500" aria-hidden="true" />
          <span>Semantic Expansion</span>
        </div>
        <div className="flex-1 h-px bg-[#E5E5E0]" />
        <span className="text-xs text-[#6B6B6B]">
          {activeCount} of {expansions.length} active
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <AnimatePresence mode="popLayout">
          {expansions.map((expansion, index) => (
            <SemanticChip
              key={expansion.term}
              expansion={expansion}
              index={index}
              onRemove={onRemove}
              onToggle={onToggle}
            />
          ))}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: expansions.length * 0.05 + 0.1 }}
          onClick={onAddTerm}
          aria-label="Add search term"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
            text-sm text-[#6B6B6B] border border-dashed border-[#D1D5DB]
            hover:border-indigo-500/50 hover:text-indigo-600 transition-all duration-150"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Add</span>
        </motion.button>

        <div className="flex-1" />

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: expansions.length * 0.05 + 0.15 }}
          onClick={onEdit}
          aria-label="Edit search terms"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Edit</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
