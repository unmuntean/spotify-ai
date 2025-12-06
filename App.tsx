
import React, { useState, useEffect } from 'react';
import { fetchRecommendations, setAccessToken } from './services/api';
import { RecommendationResponse, Strategy, ApiError, Recommendation } from './types';
import { Button } from './components/Button';
import { TrackItem } from './components/TrackItem';
import { DiscoveryDeck } from './components/DiscoveryDeck';
import { SettingsPanel } from './components/SettingsPanel';
import { TokenGate } from './components/TokenGate';
import { APP_NAME } from './constants';
import { Search, AlertCircle, Music2, Disc, LayoutGrid, ListMusic, Heart, Activity, LogOut } from 'lucide-react';

type ViewMode = 'list' | 'discovery';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('spotify_access_token'));
  
  const [url, setUrl] = useState('');
  const [limit, setLimit] = useState(20);
  const [strategy, setStrategy] = useState<Strategy>('spotify');
  const [targetGenre, setTargetGenre] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<RecommendationResponse | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('discovery');
  const [savedTracks, setSavedTracks] = useState<Recommendation[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      setAccessToken(token);
    }
  }, [token]);

  const handleTokenSubmit = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('spotify_access_token', newToken);
    setAccessToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('spotify_access_token');
    setData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setSavedTracks([]); 

    try {
      const response = await fetchRecommendations({
        playlistUrl: url,
        limit,
        strategy,
        targetGenre: targetGenre || undefined
      });
      setData(response);
      setViewMode('discovery'); 
    } catch (err: any) {
      if (err.status === 401) {
        // Token expired
        setToken(null);
        localStorage.removeItem('spotify_access_token');
        setError({ status: 401, message: "Session expired. Please enter a new token." });
      } else {
        setError(err as ApiError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const handleSaveTrack = (track: Recommendation) => {
    if (!savedTracks.find(t => t.id === track.id)) {
      setSavedTracks(prev => [...prev, track]);
    }
  };

  const handleRemoveSaved = (id: string) => {
    setSavedTracks(prev => prev.filter(t => t.id !== id));
  };

  if (!token) {
    return <TokenGate onTokenSubmit={handleTokenSubmit} />;
  }

  return (
    <div className="min-h-screen bg-spotify-black text-white selection:bg-spotify-base selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-white/10 bg-spotify-black/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-bold text-xl tracking-tight cursor-pointer" onClick={() => window.location.reload()}>
             <div className="w-8 h-8 bg-gradient-to-br from-spotify-base to-blue-600 rounded-full flex items-center justify-center">
                <Music2 size={18} className="text-white" />
             </div>
             <span>{APP_NAME}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {data && (
              <div className="flex bg-spotify-light/50 rounded-full p-1 border border-white/10">
                  <button 
                    onClick={() => setViewMode('discovery')}
                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === 'discovery' ? 'bg-spotify-base text-black shadow-lg' : 'text-spotify-grey hover:text-white'}`}
                  >
                    <LayoutGrid size={16} />
                    <span className="hidden sm:inline">Discovery</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white text-black shadow-lg' : 'text-spotify-grey hover:text-white'}`}
                  >
                    <ListMusic size={16} />
                    <span className="hidden sm:inline">List View</span>
                  </button>
              </div>
            )}
            <button onClick={handleLogout} className="text-spotify-grey hover:text-white" title="Change Token">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Search & Hero */}
        {!data && (
          <section className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Your Real Data. <br/> Your Real Vibe.
            </h1>
            <p className="text-spotify-grey text-lg mb-8 max-w-xl mx-auto">
              We analyze the audio features (energy, valence, tempo) of your playlist and use Spotify's algorithm to find perfect matches.
            </p>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto relative z-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-spotify-base opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-spotify-grey">
                    <Search size={20} />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste a Spotify Playlist URL..."
                    className="w-full bg-spotify-light border border-transparent focus:border-spotify-base focus:ring-0 text-white pl-12 pr-4 py-4 rounded-full text-lg shadow-2xl transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              <SettingsPanel 
                limit={limit} 
                setLimit={setLimit}
                strategy={strategy} 
                setStrategy={setStrategy}
                targetGenre={targetGenre}
                setTargetGenre={setTargetGenre}
              />

              <div className="mt-8">
                <Button type="submit" isLoading={loading} disabled={!url} className="w-full md:w-auto min-w-[200px] shadow-lg shadow-spotify-base/20">
                  Analyze & Recommend
                </Button>
              </div>
            </form>
          </section>
        )}

        {/* Loading State */}
        {loading && (
           <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-spotify-base border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-spotify-grey">Fetching tracks from Spotify...</p>
           </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-start space-x-3 mb-8 animate-fade-in max-w-2xl mx-auto">
            <AlertCircle size={24} className="flex-shrink-0 text-red-500" />
            <div>
              <h4 className="font-bold text-red-500">Error {error.status}</h4>
              <p>{error.message}</p>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        {data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            
            {/* Left Sidebar: Playlist Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-b from-white/10 to-transparent p-6 rounded-3xl border border-white/5 sticky top-24">
                <div className="aspect-square w-full shadow-2xl rounded-2xl overflow-hidden mb-6">
                  {data.playlist.imageUrl ? (
                    <img src={data.playlist.imageUrl} alt={data.playlist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-spotify-light flex items-center justify-center">
                      <Disc size={48} className="text-spotify-grey" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white/50 mb-2 block">Source Playlist</span>
                  <h2 className="text-2xl font-black leading-tight mb-2">{data.playlist.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
                     <span>{data.playlist.owner}</span>
                     <span>•</span>
                     <span>{data.playlist.trackCount} tracks</span>
                  </div>
                  
                  {/* Audio Features Analysis Badge */}
                  {data.averageFeatures && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <h4 className="flex items-center text-xs font-bold uppercase tracking-wider text-white/50 mb-3">
                         <Activity size={12} className="mr-1" /> Playlist Vibe
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(data.averageFeatures).slice(0, 4).map(([key, val]) => (
                          <div key={key} className="bg-white/5 px-2 py-1.5 rounded text-xs flex justify-between items-center">
                             <span className="capitalize text-spotify-grey">{key}</span>
                             <span className="font-mono font-bold text-spotify-base">{Math.round((val as number) * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                     <button onClick={() => { setData(null); setUrl(''); }} className="text-sm text-spotify-grey hover:text-white underline decoration-spotify-grey">
                        Analyze Another Playlist
                     </button>
                  </div>
                </div>
              </div>

              {/* Saved Tracks Counter */}
              <div className="bg-spotify-dark p-6 rounded-3xl border border-white/5">
                <div className="flex items-center space-x-3 mb-4">
                  <Heart size={20} className="text-spotify-base" fill={savedTracks.length > 0 ? "currentColor" : "none"} />
                  <h3 className="font-bold text-lg">Saved Collection</h3>
                  <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {savedTracks.length}
                  </span>
                </div>
                
                {savedTracks.length === 0 ? (
                  <p className="text-sm text-spotify-grey">
                    Like tracks in Discovery Mode to save them here.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {savedTracks.map((track) => (
                      <div key={track.id} className="flex items-center justify-between group text-sm py-2 border-b border-white/5">
                        <div className="truncate mr-2">
                          <div className="text-white truncate">{track.name}</div>
                          <div className="text-spotify-grey text-xs truncate">{track.artists[0]}</div>
                        </div>
                        <button 
                          onClick={() => handleRemoveSaved(track.id)}
                          className="text-spotify-grey hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-8">
              {viewMode === 'discovery' ? (
                <DiscoveryDeck 
                  tracks={data.recommendations}
                  onSaveTrack={handleSaveTrack}
                  playingId={playingId}
                  onTogglePlay={handleTogglePlay}
                />
              ) : (
                <div className="bg-spotify-dark rounded-3xl p-4 md:p-8 min-h-[500px]">
                  <div className="flex items-center justify-between mb-6 px-2">
                     <h3 className="text-xl font-bold">Recommended List</h3>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <div className="flex px-3 py-2 text-xs font-medium text-spotify-grey uppercase tracking-wider border-b border-white/10 mb-2">
                      <div className="w-8 mr-4 text-right">#</div>
                      <div className="w-10 mr-4"></div>
                      <div className="flex-grow">Title</div>
                      <div className="hidden md:block w-32 text-right">Source</div>
                      <div className="w-12 ml-4 text-right">Time</div>
                    </div>
                    {data.recommendations.map((track, idx) => (
                      <TrackItem 
                        key={track.id} 
                        track={track} 
                        rank={idx + 1}
                        isPlaying={playingId === track.id}
                        onTogglePlay={() => handleTogglePlay(track.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default App;
