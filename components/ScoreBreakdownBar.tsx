import React from 'react';
import { ScoreBreakdown } from '../types';

interface ScoreBreakdownBarProps {
  breakdown: ScoreBreakdown;
  showLabels?: boolean;
  height?: string;
}

const ScoreBreakdownBar: React.FC<ScoreBreakdownBarProps> = ({
  breakdown,
  showLabels = false,
  height = 'h-2',
}) => {
  const { captionPoints, audioPoints, visualPoints } = breakdown;
  const total = captionPoints + audioPoints + visualPoints;

  if (total === 0) return null;

  const captionPct = (captionPoints / total) * 100;
  const audioPct = (audioPoints / total) * 100;
  const visualPct = (visualPoints / total) * 100;

  return (
    <div>
      <div className={`${height} w-full rounded-full overflow-hidden flex bg-zinc-800`}>
        {captionPct > 0 && (
          <div
            className="bg-orange-400 transition-all duration-500"
            style={{ width: `${captionPct}%` }}
            title={`Caption: ${captionPoints.toFixed(0)}pts`}
          />
        )}
        {audioPct > 0 && (
          <div
            className="bg-green-400 transition-all duration-500"
            style={{ width: `${audioPct}%` }}
            title={`Audio: ${audioPoints.toFixed(0)}pts`}
          />
        )}
        {visualPct > 0 && (
          <div
            className="bg-blue-400 transition-all duration-500"
            style={{ width: `${visualPct}%` }}
            title={`Visual: ${visualPoints.toFixed(0)}pts`}
          />
        )}
      </div>
      {showLabels && total > 0 && (
        <div className="flex items-center justify-between mt-1.5 text-[10px] text-zinc-500">
          {captionPct > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Caption {captionPoints.toFixed(0)}</span>
            </div>
          )}
          {audioPct > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span>Audio {audioPoints.toFixed(0)}</span>
            </div>
          )}
          {visualPct > 0 && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Visual {visualPoints.toFixed(0)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScoreBreakdownBar;
