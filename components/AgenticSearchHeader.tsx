import React from 'react';
import { SemanticFilter } from '../types';
import { Eye, Mic, MapPin, StickyNote, Search, Loader2 } from 'lucide-react';

interface AgenticSearchHeaderProps {
  query: string;
  subFilters: SemanticFilter[];
  isProcessing: boolean;
}

const getFilterIcon = (type: SemanticFilter['type']) => {
  switch (type) {
    case 'visual':
      return <Eye size={14} className="text-blue-400" />;
    case 'audio':
      return <Mic size={14} className="text-green-400" />;
    case 'context':
      return <MapPin size={14} className="text-orange-400" />;
    case 'notes':
      return <StickyNote size={14} className="text-purple-400" />;
  }
};

const getFilterColor = (type: SemanticFilter['type']) => {
  switch (type) {
    case 'visual':
      return {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-300',
        label: 'text-blue-400'
      };
    case 'audio':
      return {
        bg: 'bg-green-500/10',
        border: 'border-green-500/30',
        text: 'text-green-300',
        label: 'text-green-400'
      };
    case 'context':
      return {
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        text: 'text-orange-300',
        label: 'text-orange-400'
      };
    case 'notes':
      return {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-300',
        label: 'text-purple-400'
      };
  }
};

const AgenticSearchHeader: React.FC<AgenticSearchHeaderProps> = ({
  query,
  subFilters,
  isProcessing
}) => {
  if (!query) return null;

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 overflow-hidden mb-6">
      {/* Query Display */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center space-x-3">
        <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <Search size={16} className="text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium truncate">"{query}"</p>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            Semantic Query Analysis
          </p>
        </div>
        {isProcessing && (
          <Loader2 size={16} className="text-blue-400 animate-spin" />
        )}
      </div>

      {/* Semantic Filters Breakdown */}
      {subFilters.length > 0 && (
        <div className="p-4">
          <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-3">
            Searching for:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {subFilters.map((filter, index) => {
              const colors = getFilterColor(filter.type);
              return (
                <div
                  key={index}
                  className={`${colors.bg} ${colors.border} border rounded-lg p-3 transition-all hover:scale-[1.02]`}
                >
                  <div className="flex items-center space-x-2 mb-1.5">
                    {getFilterIcon(filter.type)}
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.label}`}>
                      {filter.type}
                    </span>
                  </div>
                  <div className={`text-sm font-semibold ${colors.text} mb-0.5`}>
                    {filter.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 leading-relaxed">
                    {filter.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Processing State */}
      {isProcessing && subFilters.length === 0 && (
        <div className="p-4">
          <div className="flex items-center space-x-3 text-zinc-500">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Analyzing query...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgenticSearchHeader;
