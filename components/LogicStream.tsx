import React, { useMemo } from 'react';
import { QueryNode } from '../types';
import { Eye, EyeOff, Trash2, GitPullRequest, CornerDownRight } from 'lucide-react';

interface LogicStreamProps {
  nodes: QueryNode[];
  onToggleNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  nodeCounts: Record<string, number>;
  onHoverNode: (id: string | null) => void;
}

const LogicStream: React.FC<LogicStreamProps> = ({ nodes, onToggleNode, onDeleteNode, nodeCounts, onHoverNode }) => {
  
  // Calculate depth levels dynamically
  const nodeLevels = useMemo(() => {
    const levels: number[] = [];
    
    nodes.forEach((node, index) => {
      if (index === 0) {
        levels.push(0);
        return;
      }
      
      const prevLevel = levels[index - 1];

      // Logic:
      // AND/NOT -> Child (Indent + 1)
      // OR -> Sibling (Same Level)
      
      if (node.operator === 'OR') {
        levels.push(prevLevel);
      } else {
        // AND / NOT / ROOT (shouldn't happen for non-first)
        levels.push(prevLevel + 1);
      }
    });
    return levels;
  }, [nodes]);

  // Determine if a node has a sibling below it (to extend vertical line)
  const hasSiblingBelow = (index: number, level: number) => {
      for (let i = index + 1; i < nodes.length; i++) {
          if (nodeLevels[i] === level) return true; // Found sibling
          if (nodeLevels[i] < level) return false; // Branch closed
      }
      return false;
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-1 overflow-y-auto custom-scrollbar pt-6">
      
      <div className="flex flex-col relative">
        {nodes.map((node, index) => {
          const level = nodeLevels[index];
          const isRoot = node.operator === 'ROOT';
          const isAnd = node.operator === 'AND';
          const isOr = node.operator === 'OR';
          const isNot = node.operator === 'NOT';
          
          const indentSize = 24;
          const paddingLeft = level * indentSize;
          
          // Should we draw a connector?
          const showConnector = level > 0;
          
          const hasSibling = hasSiblingBelow(index, level);

          return (
            <div 
              key={node.id} 
              className="relative group"
              style={{ paddingLeft: `${paddingLeft}px` }}
              onMouseEnter={() => onHoverNode(node.id)}
              onMouseLeave={() => onHoverNode(null)}
            >
              {/* The Connector (L Shape) */}
              {showConnector && (
                  <div 
                    className="absolute top-0 bottom-0 pointer-events-none"
                    style={{ 
                        left: `${(level - 1) * indentSize + 10}px`, // Align with parent column
                        width: `${indentSize}px`
                    }}
                  >
                      {/* Vertical Segment */}
                      {/* Starts from -10px (overlap prev row) to 50% (middle of current) */}
                      {/* If there is a sibling below, it goes to 100% */}
                      <div className={`absolute w-px bg-zinc-700 top-[-50%] ${hasSibling ? 'bottom-0' : 'bottom-[50%]'} left-0`} />
                      
                      {/* Horizontal Segment */}
                      <div className="absolute h-px bg-zinc-700 top-[50%] left-0 right-0" />
                  </div>
              )}

              {/* NODE CARD */}
              <div 
                className={`
                  relative flex flex-col p-3 rounded-lg border backdrop-blur-sm transition-all duration-300
                  mb-2
                  ${node.isActive ? 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-600' : 'border-zinc-800/50 bg-zinc-950/50 opacity-60'}
                `}
              >
                {/* Header: Operator & Toggle */}
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`
                      text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border flex items-center
                      ${isRoot ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                      ${isAnd ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                      ${isOr ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                      ${isNot ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                    `}>
                      {isOr && <GitPullRequest size={8} className="mr-1" />}
                      {isAnd && <CornerDownRight size={8} className="mr-1" />}
                      {node.operator}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onToggleNode(node.id)}
                      className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors hover:bg-zinc-800 rounded"
                    >
                      {node.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button 
                      onClick={() => onDeleteNode(node.id)}
                      className="p-1 text-zinc-600 hover:text-red-400 transition-colors hover:bg-zinc-800 rounded"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Content: Description */}
                <div className="text-xs font-medium text-zinc-300 font-sans leading-relaxed">
                  {node.description}
                </div>

                {/* Footer: Count & Filters */}
                <div className="mt-2 flex justify-between items-center border-t border-white/5 pt-2">
                   <div className="text-[9px] text-zinc-500 font-mono truncate max-w-[100px] flex items-center">
                    {Object.keys(node.filters).length > 0 ? (
                        <span className="opacity-70">{Object.keys(node.filters)[0]}...</span>
                    ) : <span>-</span>}
                   </div>
                   {/* Result Badge */}
                   <div className={`
                     text-[9px] font-bold px-1.5 py-0.5 rounded transition-all
                     ${nodeCounts[node.id] > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-600'}
                   `}>
                     {nodeCounts[node.id] || 0}
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogicStream;