import React, { useState, useEffect } from 'react';
import { Recommendation } from '../types';
import { TrackCard } from './TrackCard';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface DiscoveryDeckProps {
  tracks: Recommendation[];
  onSaveTrack: (track: Recommendation) => void;
  playingId: string | null;
  onTogglePlay: (id: string) => void;
}

export const DiscoveryDeck: React.FC<DiscoveryDeckProps> = ({ 
  tracks, 
  onSaveTrack,
  playingId,
  onTogglePlay
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  // Reset when tracks change completely
  useEffect(() => {
    setCurrentIndex(0);
    setComplete(false);
  }, [tracks]);

  const handleLike = () => {
    if (currentIndex < tracks.length) {
      onSaveTrack(tracks[currentIndex]);
      advance();
    }
  };

  const handlePass = () => {
    advance();
  };

  const advance = () => {
    if (currentIndex + 1 >= tracks.length) {
      setComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setComplete(false);
  };

  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 bg-spotify-base/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={48} className="text-spotify-base" />
        </div>
        <h3 className="text-3xl font-bold">All Caught Up!</h3>
        <p className="text-spotify-grey max-w-md">
          You've reviewed all recommendations. Check your "Saved Tracks" list below to listen to your curated selection.
        </p>
        <Button onClick={handleReset} variant="outline" className="mt-4">
          <RotateCcw size={18} className="mr-2" />
          Review Again
        </Button>
      </div>
    );
  }

  const currentTrack = tracks[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto min-h-[500px] flex flex-col items-center justify-center">
      
      {/* Progress Indicator */}
      <div className="w-full max-w-sm flex justify-between text-xs font-mono text-spotify-grey mb-4 uppercase tracking-wider">
        <span>Track {currentIndex + 1} of {tracks.length}</span>
        <span>Discovery Mode</span>
      </div>

      {/* The Stack Effect (Fake card behind) */}
      {currentIndex + 1 < tracks.length && (
        <div className="absolute top-8 scale-95 opacity-40 blur-[1px] translate-y-4 pointer-events-none z-0">
          <TrackCard 
            track={tracks[currentIndex + 1]} 
            onLike={() => {}} 
            onPass={() => {}}
            isPlaying={false}
            onTogglePlay={() => {}}
          />
        </div>
      )}

      {/* Active Card */}
      <div className="relative z-10 w-full animate-fade-in">
        <TrackCard 
          key={currentTrack.id}
          track={currentTrack}
          onLike={handleLike}
          onPass={handlePass}
          isPlaying={playingId === currentTrack.id}
          onTogglePlay={() => onTogglePlay(currentTrack.id)}
        />
      </div>

      <p className="mt-8 text-sm text-spotify-grey opacity-50">
        Keyboard Shortcuts: [←] Pass / [→] Save
      </p>
    </div>
  );
};