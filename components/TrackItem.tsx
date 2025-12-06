import React from 'react';
import { Recommendation } from '../types';
import { Play, Pause, Music, BarChart2 } from 'lucide-react';

interface TrackItemProps {
  track: Recommendation;
  rank: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TrackItem: React.FC<TrackItemProps> = ({ track, rank, isPlaying, onTogglePlay }) => {
  return (
    <div className="group flex items-center p-3 rounded-md hover:bg-white/10 transition-colors duration-200">
      {/* Rank / Play Icon */}
      <div className="w-8 flex-shrink-0 text-right mr-4 text-spotify-grey font-mono text-sm">
        <span className="group-hover:hidden">{rank}</span>
        <button 
          onClick={onTogglePlay}
          className="hidden group-hover:flex items-center justify-center w-full text-white"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
        </button>
      </div>

      {/* Album Art */}
      <div className="relative w-10 h-10 mr-4 flex-shrink-0 shadow-lg bg-spotify-light">
        {track.imageUrl ? (
          <img src={track.imageUrl} alt={track.albumName} className="w-full h-full object-cover rounded" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-spotify-grey">
            <Music size={20} />
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-grow min-w-0 pr-4">
        <div className={`font-medium truncate ${isPlaying ? 'text-spotify-base' : 'text-white'}`}>
          {track.name}
        </div>
        <div className="text-sm text-spotify-grey truncate group-hover:text-white transition-colors">
          {track.artists.join(', ')} • {track.albumName}
        </div>
      </div>

      {/* Reason Badge */}
      <div className="hidden md:flex flex-col items-end flex-shrink-0 space-y-1">
        <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/5 text-spotify-grey border border-white/10">
           {track.score ? <BarChart2 size={10} className="mr-1" /> : null}
           {track.reason}
        </div>
        {track.score && (
          <span className="text-[10px] text-spotify-grey font-mono">
            Sim: {(track.score * 100).toFixed(1)}%
          </span>
        )}
      </div>
      
      {/* Duration (Mock) */}
      <div className="w-12 text-right ml-4 text-sm text-spotify-grey">
        {track.duration_ms ? new Date(track.duration_ms).toISOString().slice(14, 19) : '--:--'}
      </div>
    </div>
  );
};