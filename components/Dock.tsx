import React from 'react';
import { DockItem } from '../types';
import { X, Send, Save, FolderOpen, PenLine, Play } from 'lucide-react';

interface DockProps {
  items: DockItem[];
  onRemoveItem: (creatorId: string) => void;
  onUpdateNote: (creatorId: string, note: string) => void;
  onGenerate: () => void;
}

const Dock: React.FC<DockProps> = ({ items, onRemoveItem, onUpdateNote, onGenerate }) => {
  return (
    <div 
      className="h-full border-l border-zinc-800 bg-zinc-950 flex flex-col relative w-full"
      onDragOver={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 shrink-0">
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center">
            <FolderOpen size={14} className="mr-2 text-blue-500" />
            Deck Manifest ({items.length})
        </span>
      </div>

      {/* Content - Hierarchical Tree */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {items.map((item) => (
          <div key={item.creator.id} className="relative group">
            
            {/* Parent Node: Creator */}
            <div className="flex items-center justify-between mb-2 px-2 py-1 rounded hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center space-x-2.5">
                    <img src={item.creator.avatar} className="w-5 h-5 rounded-full border border-zinc-700" alt="av" />
                    <span className="text-sm font-bold text-zinc-300">{item.creator.name}</span>
                </div>
            </div>

            {/* Child Node: Content (Hanging) */}
            <div className="relative pl-6">
                {/* L-Shape Connector Logic */}
                <div className="absolute left-4 top-[-8px] bottom-[50%] w-4 border-l border-b border-zinc-800 rounded-bl-xl pointer-events-none" />
                
                <div className="relative flex items-start space-x-3 p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all group-hover:border-zinc-700">
                    
                    {/* Thumbnail */}
                    <div className="relative w-9 h-12 bg-black rounded overflow-hidden flex-shrink-0 border border-zinc-800 shadow-sm">
                        <img src={item.creator.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" alt="thumb" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Play size={10} fill="currentColor" className="text-white opacity-80" />
                        </div>
                    </div>

                    {/* Inputs & Details */}
                    <div className="min-w-0 flex-1 py-0.5">
                        <div className="flex justify-between items-start">
                             <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold mb-1 flex items-center">
                                Content Match
                             </div>
                             <button 
                                onClick={() => onRemoveItem(item.creator.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors"
                             >
                                <X size={12} />
                             </button>
                        </div>

                        {/* Note Input */}
                        <div className="relative group/input">
                           <PenLine size={10} className="absolute left-0 top-1.5 text-zinc-600" />
                           <input 
                              type="text" 
                              placeholder="Add note..."
                              className="w-full bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-blue-500 text-xs text-zinc-300 placeholder-zinc-700 py-1 pl-4 outline-none transition-colors"
                              value={item.note || ''}
                              onChange={(e) => onUpdateNote(item.creator.id, e.target.value)}
                           />
                        </div>
                        
                        <div className="mt-1 text-[9px] text-zinc-600 font-mono truncate">
                             Via node: {item.sourceNodeId.substring(0, 5)}
                        </div>
                    </div>
                </div>
            </div>

          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-zinc-800 space-y-2 bg-zinc-950 z-10 shrink-0">
        <button 
          onClick={onGenerate}
          className="w-full bg-white text-black font-medium py-2 rounded-lg text-sm flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
        >
          <Send size={14} className="mr-2" /> Save and Generate Pitch
        </button>
        <button className="w-full bg-zinc-900 text-zinc-400 font-medium py-2 rounded-lg text-sm flex items-center justify-center hover:bg-zinc-800 transition-colors border border-zinc-800">
          <Save size={14} className="mr-2" /> Save and Close
        </button>
      </div>
    </div>
  );
};

export default Dock;