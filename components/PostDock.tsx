import React from 'react';
import { PostDockItem } from '../types';
import { X, Send, Save, FolderOpen, PenLine, Film, Image, BookOpen, Clapperboard, Megaphone } from 'lucide-react';

interface PostDockProps {
  items: PostDockItem[];
  onRemoveItem: (postId: string) => void;
  onUpdateNote: (postId: string, note: string) => void;
  onGenerate: () => void;
}

const CONTENT_TYPE_ICON: Record<string, typeof Film> = {
  Reel: Film,
  Story: BookOpen,
  Post: Image,
  Video: Clapperboard,
  Paid: Megaphone,
};

const PostDock: React.FC<PostDockProps> = ({ items, onRemoveItem, onUpdateNote, onGenerate }) => {
  return (
    <div
      className="h-full border-l border-zinc-800 bg-zinc-950 flex flex-col relative w-full"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800 shrink-0">
        <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest flex items-center">
            <FolderOpen size={14} className="mr-2 text-blue-500" />
            Selected Posts ({items.length})
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {items.map((item) => {
          const ContentIcon = CONTENT_TYPE_ICON[item.post.contentType] || Film;
          return (
            <div key={item.post.id} className="relative group">
              <div className="relative flex items-start space-x-3 p-2.5 bg-zinc-900/40 rounded-lg border border-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-900 transition-all group-hover:border-zinc-700">

                  {/* Thumbnail */}
                  <div className="relative w-9 h-12 bg-black rounded overflow-hidden flex-shrink-0 border border-zinc-800 shadow-sm">
                      <img src={item.post.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" alt="thumb" />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 py-0.5">
                      <div className="flex justify-between items-start">
                           <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-bold mb-1 flex items-center">
                              <ContentIcon size={9} className="mr-1" />
                              {item.post.contentType}
                           </div>
                           <button
                              onClick={() => onRemoveItem(item.post.id)}
                              className="text-zinc-600 hover:text-red-400 transition-colors"
                           >
                              <X size={12} />
                           </button>
                      </div>

                      {/* Caption snippet */}
                      <p className="text-[11px] text-zinc-400 leading-tight line-clamp-2 mb-1">
                        {item.post.caption}
                      </p>

                      {/* Note Input */}
                      <div className="relative group/input">
                         <PenLine size={10} className="absolute left-0 top-1.5 text-zinc-600" />
                         <input
                            type="text"
                            placeholder="Add note..."
                            className="w-full bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-blue-500 text-xs text-zinc-300 placeholder-zinc-700 py-1 pl-4 outline-none transition-colors"
                            value={item.note || ''}
                            onChange={(e) => onUpdateNote(item.post.id, e.target.value)}
                         />
                      </div>

                      <div className="mt-1 text-[9px] text-zinc-600 font-mono">
                           {new Date(item.post.postedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                  </div>
              </div>
            </div>
          );
        })}
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

export default PostDock;
