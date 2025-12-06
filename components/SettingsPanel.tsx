import React from 'react';
import { Strategy } from '../types';
import { Settings, Info, Music } from 'lucide-react';
import { GENRE_KEYS } from '../constants';

interface SettingsPanelProps {
  limit: number;
  setLimit: (val: number) => void;
  strategy: Strategy;
  setStrategy: (val: Strategy) => void;
  targetGenre: string;
  setTargetGenre: (val: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  limit, setLimit, strategy, setStrategy, targetGenre, setTargetGenre
}) => {
  return (
    <div className="bg-spotify-light/50 rounded-xl p-6 border border-white/5 mt-6 backdrop-blur-sm">
      <div className="flex items-center mb-4 text-white">
        <Settings size={18} className="mr-2" />
        <h3 className="font-semibold">Engine Configuration</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Limit Slider */}
        <div>
          <label className="block text-sm font-medium text-spotify-grey mb-2 flex justify-between">
            <span>Recommendation Count</span>
            <span className="text-white">{limit} Tracks</span>
          </label>
          <input
            type="range"
            min="5"
            max="50"
            step="1"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full h-2 bg-spotify-dark rounded-lg appearance-none cursor-pointer accent-spotify-base"
          />
        </div>

        {/* Target Vibe (Mock Control) */}
        <div>
          <label className="block text-sm font-medium text-spotify-grey mb-2 flex items-center">
            <Music size={14} className="mr-1" />
            Target Vibe
          </label>
          <div className="relative">
            <select 
              value={targetGenre}
              onChange={(e) => setTargetGenre(e.target.value)}
              className="w-full bg-spotify-dark text-white text-sm border-transparent focus:border-spotify-base focus:ring-spotify-base rounded-md py-2 px-3 appearance-none cursor-pointer"
            >
              <option value="">Auto-Detect (Based on Playlist)</option>
              {GENRE_KEYS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-spotify-grey">
            Helps the engine when playlist content analysis is ambiguous.
          </div>
        </div>

        {/* Strategy Selection */}
        <div>
          <label className="block text-sm font-medium text-spotify-grey mb-2">
            Algorithm Strategy
          </label>
          <div className="flex space-x-2 bg-spotify-dark p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setStrategy('spotify')}
              className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${
                strategy === 'spotify' 
                  ? 'bg-spotify-light text-white shadow-sm' 
                  : 'text-spotify-grey hover:text-white'
              }`}
            >
              Spotify API
            </button>
            <button
              type="button"
              onClick={() => setStrategy('audio-features')}
              className={`flex-1 py-2 px-3 text-sm rounded-md transition-all ${
                strategy === 'audio-features' 
                  ? 'bg-spotify-light text-white shadow-sm' 
                  : 'text-spotify-grey hover:text-white'
              }`}
            >
              Audio Features
            </button>
          </div>
          <div className="mt-2 text-xs text-spotify-grey flex items-start">
            <Info size={12} className="mr-1 mt-0.5 flex-shrink-0" />
            {strategy === 'spotify' 
              ? 'Seed-based filtering.'
              : 'Feature vector nearest neighbors.'}
          </div>
        </div>
      </div>
    </div>
  );
};