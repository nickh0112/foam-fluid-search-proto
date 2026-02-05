import React from 'react';
import { Eye, Mic, Type, StickyNote } from 'lucide-react';
import { MatchEvidence, MatchType } from '../types';

interface MatchTypeIndicatorsProps {
  matches: MatchEvidence[];
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

const MATCH_TYPE_CONFIG: Record<MatchType, {
  icon: typeof Eye;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string
}> = {
  visual: {
    icon: Eye,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    label: 'Visual Match'
  },
  audio: {
    icon: Mic,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    label: 'Audio Match'
  },
  caption: {
    icon: Type,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    label: 'Caption Match'
  },
  personalNote: {
    icon: StickyNote,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    label: 'Personal Note'
  }
};

const MatchTypeIndicators: React.FC<MatchTypeIndicatorsProps> = ({
  matches,
  size = 'sm',
  showTooltip = true
}) => {
  // Get unique match types
  const matchTypes = Array.from(new Set(matches.map(m => m.type))) as MatchType[];

  const iconSize = size === 'sm' ? 12 : 16;
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <div className="flex flex-col space-y-1">
      {matchTypes.map(type => {
        const config = MATCH_TYPE_CONFIG[type];
        const Icon = config.icon;
        const match = matches.find(m => m.type === type);

        // Build tooltip text
        const tooltipText = showTooltip && match
          ? `${config.label}${match.timestamp ? ` @ ${match.timestamp}` : ''}: ${match.excerpt}`
          : undefined;

        return (
          <div
            key={type}
            className={`
              ${padding} rounded-md ${config.bgColor} ${config.color}
              border ${config.borderColor} backdrop-blur-sm
              transition-all duration-200 hover:scale-110 cursor-help
            `}
            title={tooltipText}
          >
            <Icon size={iconSize} />
          </div>
        );
      })}
    </div>
  );
};

export default MatchTypeIndicators;
