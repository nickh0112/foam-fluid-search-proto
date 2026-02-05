'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SearchState } from '@/lib/types';

interface ResultsHeaderProps {
  resultCount: number;
  creatorCount: number;
  sortBy: SearchState['sortBy'];
  onSortChange: (sort: SearchState['sortBy']) => void;
}

const sortOptions: { value: SearchState['sortBy']; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'recent', label: 'Recent' },
  { value: 'views', label: 'Views' },
  { value: 'creator', label: 'Creator Name' },
];

export function ResultsHeader({
  resultCount,
  creatorCount,
  sortBy,
  onSortChange,
}: ResultsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between py-4"
    >
      <div className="flex items-center gap-2">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm font-medium text-[#1A1A1A]"
        >
          {resultCount} results
        </motion.span>
        <span className="text-[#6B6B6B]">across</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sm font-medium text-[#1A1A1A]"
        >
          {creatorCount} creators
        </motion.span>
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger aria-haspopup="listbox" aria-label="Sort by" className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#6B6B6B] bg-white border border-[#E5E5E0] rounded-lg hover:border-[#D1D5DB] transition-colors">
          <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
          <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border-[#E5E5E0]">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`text-sm cursor-pointer ${sortBy === option.value ? 'text-indigo-600' : 'text-[#1A1A1A]'}`}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
