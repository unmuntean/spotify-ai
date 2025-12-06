import React from 'react';
import { Recommendation } from '../types';
import { Play, Pause, Heart, X, Music, BarChart2 } from 'lucide-react';

interface TrackCardProps {
  track: Recommendation;
  onLike: () => void;
  onPass: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ 
  track, 
  onLike, 
  onPass, 
  isPlaying, 
  onTogglePlay 
}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-spotify-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-[1.02] hover:shadow-spotify-base/20 relative group">
      {/* Image Container */}
      <div className="relative aspect-square w-full">
        {track.imageUrl ? (
          <img 
            src={track.imageUrl} 
            alt={track.albumName} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-spotify-light flex items-center justify-center">
            <Music size={64} className="text-spotify-grey opacity-50" />
          </div>
        )}
        
        {/* Play Overlay */}
        <button 
          onClick={onTogglePlay}
          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
        >
          <div className="w-16 h-16 bg-spotify-base rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            {isPlaying ? (
              <Pause size={32} className="text-black ml-0.5" />
            ) : (
              <Play size={32} className="text-black ml-1" />
            )}
          </div>
        </button>

        {/* Reason Badge (Floating) */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/10 flex items-center shadow-lg">
          <BarChart2 size={12} className="mr-1.5 text-spotify-base" />
          {track.reason}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 text-center space-y-4 bg-gradient-to-b from-spotify-dark to-[#000]">
        <div>
          <h3 className="text-2xl font-bold text-white truncate px-2 mb-1">{track.name}</h3>
          <p className="text-spotify-grey font-medium text-lg truncate">{track.artists.join(', ')}</p>
          <p className="text-sm text-white/40 mt-1">{track.albumName}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button 
            onClick={onPass}
            className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center text-white/50 hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-all duration-200"
            aria-label="Pass"
          >
            <X size={28} />
          </button>
          
          <button 
            onClick={onLike}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 hover:bg-spotify-base transition-all duration-200 shadow-xl shadow-white/10"
            aria-label="Save to Library"
          >
            <Heart size={32} fill="currentColor" className="text-inherit" />
          </button>
        </div>
      </div>
    </div>
  );
};