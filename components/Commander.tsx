import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Filter, ArrowLeft, Check, X, SlidersHorizontal, MapPin, Hash, Users, Activity, Play } from 'lucide-react';

interface CommanderProps {
  onSubmit: (input: string) => void;
  isProcessing: boolean;
}

const GHOST_PROMPTS = [
  "Try: 'Nike' - Find brand-aligned creators",
  "Try: 'Nike basketball' - Sports-focused search",
  "Try: 'Nike running' - Endurance creators",
  "Try: 'Also add fitness creators in LA'"
];

type FilterMode = 'search' | 'select' | 'input';
type FilterType = 'followers' | null;

const Commander: React.FC<CommanderProps> = ({ onSubmit, isProcessing }) => {
  const [input, setInput] = useState('');
  const [ghostText, setGhostText] = useState(GHOST_PROMPTS[0]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [internalGhost, setInternalGhost] = useState('');

  // Filter States
  const [mode, setMode] = useState<FilterMode>('search');
  const [filterType, setFilterType] = useState<FilterType>(null);
  
  // Input Temp States
  const [sliderValue, setSliderValue] = useState(0);

  // Rotation logic for empty state
  useEffect(() => {
    if (input || mode !== 'search') return;
    const interval = setInterval(() => {
      setPromptIndex(prev => (prev + 1) % GHOST_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [input, mode]);

  useEffect(() => {
    if (!input && mode === 'search') {
      setGhostText(GHOST_PROMPTS[promptIndex]);
      setInternalGhost('');
    }
  }, [promptIndex, input, mode]);

  // Intent detection logic
  useEffect(() => {
    if (mode !== 'search') return;
    const lower = input.toLowerCase();
    if (lower.startsWith('only')) {
      setInternalGhost('Narrowing logic detected...');
    } else if (lower.startsWith('also')) {
      setInternalGhost('Expanding logic detected...');
    } else if (lower.startsWith('except')) {
      setInternalGhost('Exclusion logic detected...');
    } else {
      setInternalGhost('');
    }
  }, [input, mode]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mode === 'search') {
      if (input.trim() && !isProcessing) {
        onSubmit(input);
        setInput('');
        setInternalGhost('');
      }
    } else if (mode === 'input') {
      // Construct logic string from filter
      let logicString = '';
      if (filterType === 'followers') {
        logicString = `Only creators with over ${sliderValue} followers`;
      }

      if (logicString) {
        onSubmit(logicString);
        resetFilter();
      }
    }
  };

  const resetFilter = () => {
    setMode('search');
    setFilterType(null);
    setSliderValue(0);
  };

  const handleFilterSelect = (type: FilterType) => {
    setFilterType(type);
    setMode('input');
    // Init defaults
    if (type === 'followers') setSliderValue(10000); // 10k default
  };

  // Render different contents based on mode
  const renderContent = () => {
    if (mode === 'search') {
      return (
        <form onSubmit={handleSubmit} className="relative flex items-center px-4 h-14 w-full">
          <div className="flex-shrink-0 mr-3 text-zinc-400">
            {isProcessing ? (
              <Sparkles className="animate-spin text-purple-400" size={18} />
            ) : (
              <Search size={18} />
            )}
          </div>
          
          <div className="flex-1 relative h-full flex items-center">
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none text-base text-white placeholder-zinc-600 font-sans z-10"
              placeholder={ghostText}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
            />
            
            {internalGhost && input && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none z-20">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-900/20 px-2 py-1 rounded border border-purple-500/30 shadow-sm">
                  {internalGhost}
                </span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 ml-3 flex items-center space-x-2">
            <button 
                type="button"
                onClick={() => setMode('select')}
                className="text-zinc-500 hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-800"
                title="Open Filters"
            >
                <Filter size={18} />
            </button>
            <span className="hidden sm:inline-block text-[10px] text-zinc-600 bg-zinc-800 px-1.5 py-0.5 rounded font-mono border border-zinc-700">
              ⏎
            </span>
          </div>
        </form>
      );
    }

    if (mode === 'select') {
      return (
        <div className="flex items-center px-2 h-14 w-full overflow-x-auto no-scrollbar space-x-2">
           <button onClick={resetFilter} className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full flex-shrink-0">
             <ArrowLeft size={18} />
           </button>
           
           <div className="flex items-center space-x-2 pr-2">
              <FilterBtn icon={<Users size={14} />} label="Followers" onClick={() => handleFilterSelect('followers')} />
           </div>
        </div>
      );
    }

    if (mode === 'input') {
      return (
        <div className="flex items-center px-4 h-14 w-full">
            <button onClick={() => setMode('select')} className="mr-4 text-zinc-500 hover:text-white">
                <ArrowLeft size={18} />
            </button>

            <div className="flex-1 flex items-center">
                {/* Dynamic Input based on Type */}
                {filterType === 'followers' && (
                    <div className="w-full flex items-center space-x-4 animate-fade-in">
                        <span className="text-sm font-bold text-blue-400 min-w-[80px]">Min {sliderValue >= 1000 ? `${(sliderValue/1000).toFixed(0)}k` : sliderValue}</span>
                        <input 
                            type="range" 
                            min="1000" max="1000000" step="10000"
                            value={sliderValue}
                            onChange={(e) => setSliderValue(Number(e.target.value))}
                            className="flex-1 h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                )}
            </div>

            <button 
                onClick={() => handleSubmit()}
                className="ml-4 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/50 transition-transform active:scale-95"
            >
                <Check size={16} />
            </button>
        </div>
      );
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      
      {/* Suggestions Breadcrumbs (Above) - Only show in search mode */}
      {!input && !isProcessing && mode === 'search' && (
         <div className="flex justify-center mb-3 space-x-2 animate-fade-in-up">
            <button onClick={() => setInput('Nike')} className="text-[10px] font-mono text-orange-400 bg-orange-500/10 backdrop-blur px-3 py-1.5 rounded border border-orange-500/30 hover:border-orange-500/60 hover:bg-orange-500/20 transition-colors font-bold">
               Nike
            </button>
            <button onClick={() => setInput('Nike basketball')} className="text-[10px] font-mono text-zinc-500 bg-black/40 backdrop-blur px-2 py-1 rounded border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300 transition-colors">
               Nike Basketball
            </button>
            <button onClick={() => setInput('Nike running')} className="text-[10px] font-mono text-zinc-500 bg-black/40 backdrop-blur px-2 py-1 rounded border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300 transition-colors">
               Nike Running
            </button>
         </div>
      )}

      <div className={`
        relative rounded-xl shadow-2xl transition-all duration-300 overflow-hidden
        ${isProcessing ? 'shadow-[0_0_40px_-5px_rgba(168,85,247,0.3)]' : 'shadow-black/80'}
        ${mode !== 'search' ? 'bg-zinc-900 ring-1 ring-zinc-700' : ''}
      `}>
        {/* Glassmorphic Background */}
        <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-xl rounded-xl border border-zinc-700/50" />
        
        {/* Render Logic */}
        <div className="relative z-10">
            {renderContent()}
        </div>

        {/* Semantic highlighting bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent rounded-b-xl overflow-hidden relative z-20">
             {isProcessing && (
                <div className="h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-progress origin-left" />
             )}
        </div>
      </div>
    </div>
  );
};

const FilterBtn: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs text-zinc-300 whitespace-nowrap transition-colors"
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default Commander;