import React from 'react';
import { User } from 'lucide-react';

interface NavbarProps {
  activeTab?: 'Builder';
}

const Navbar: React.FC<NavbarProps> = ({ activeTab = 'Builder' }) => {
  return (
    <nav className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 z-50 relative shrink-0">
      {/* Left: Brand */}
      <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-3 h-3 bg-blue-600 rounded-full mr-2 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
        <span className="text-lg font-bold tracking-tight text-white font-mono">Foam</span>
      </div>

      {/* Center: Brand Tagline */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Semantic Creator Search</span>
      </div>

      {/* Right: User */}
      <div className="flex items-center space-x-3 cursor-pointer hover:bg-zinc-900 py-1 px-2 rounded-lg transition-colors border border-transparent hover:border-zinc-800">
         <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-zinc-300">Brendan</div>
            <div className="text-[10px] text-zinc-500 font-mono">@ Sixteenth</div>
         </div>
         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-600 flex items-center justify-center text-zinc-400 shadow-inner">
            <User size={14} />
         </div>
      </div>
    </nav>
  );
};

export default Navbar;