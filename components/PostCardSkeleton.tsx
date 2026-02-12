import React from 'react';

const PostCardSkeleton: React.FC = () => (
  <div className="relative aspect-[9/16] rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
    {/* Shimmer overlay */}
    <div className="absolute inset-0 bg-zinc-800 skeleton-shimmer" />

    {/* Top row: rank badge + content type + signal icons */}
    <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-7 h-7 rounded-full bg-zinc-700/50 animate-pulse" />
        <div className="w-14 h-5 rounded-full bg-zinc-700/50 animate-pulse" />
      </div>
      <div className="flex items-center space-x-1.5">
        <div className="w-4 h-4 rounded-full bg-zinc-700/50 animate-pulse" />
        <div className="w-4 h-4 rounded-full bg-zinc-700/50 animate-pulse" />
        <div className="w-4 h-4 rounded-full bg-zinc-700/50 animate-pulse" />
      </div>
    </div>

    {/* Footer section */}
    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
      <div className="bg-zinc-900/80 rounded-lg p-2.5 border border-white/5 space-y-2.5">
        {/* Caption lines */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-zinc-700/50 animate-pulse" />
          <div className="h-3 w-3/4 rounded bg-zinc-700/50 animate-pulse" />
        </div>
        {/* Score bar */}
        <div className="h-1.5 w-full rounded-full bg-zinc-700/50 animate-pulse" />
        {/* Stats row */}
        <div className="flex justify-between items-center border-t border-white/5 pt-2">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-10 rounded bg-zinc-700/50 animate-pulse" />
            <div className="h-3 w-10 rounded bg-zinc-700/50 animate-pulse" />
          </div>
          <div className="h-3 w-12 rounded bg-zinc-700/50 animate-pulse" />
        </div>
      </div>
    </div>

    <style>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .skeleton-shimmer {
        background: linear-gradient(
          110deg,
          #27272a 0%,
          #27272a 40%,
          #3f3f46 50%,
          #27272a 60%,
          #27272a 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.8s ease-in-out infinite;
      }
    `}</style>
  </div>
);

export default PostCardSkeleton;
