
import { 
  RecommendRequest, 
  RecommendationResponse, 
  ApiError, 
  PlaylistData, 
  SpotifyTrack, 
  Track,
  AudioFeatures
} from '../types';
import { SPOTIFY_API_BASE, TARGETABLE_FEATURES, AudioFeatureKey } from '../constants';

let _accessToken = '';

export const setAccessToken = (token: string) => {
  _accessToken = token;
};

// --- Helpers ---

const headers = () => ({
  'Authorization': `Bearer ${_accessToken}`,
  'Content-Type': 'application/json'
});

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    if (res.status === 401) {
      throw { status: 401, message: "Access Token expired or invalid." } as ApiError;
    }
    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After');
      throw { status: 429, message: "Rate limited by Spotify.", retryAfter: retryAfter ? parseInt(retryAfter) : 5 } as ApiError;
    }
    const errorBody = await res.json().catch(() => ({}));
    throw { status: res.status, message: errorBody.error?.message || "Spotify API Error" } as ApiError;
  }
  return res.json();
};

const normalizeTrack = (t: SpotifyTrack): Track => ({
  id: t.id,
  name: t.name,
  artists: t.artists.map(a => a.name),
  albumName: t.album.name,
  imageUrl: t.album.images[0]?.url,
  popularity: t.popularity,
  preview_url: t.preview_url,
  duration_ms: t.duration_ms,
  spotifyUrl: t.external_urls.spotify
});

const parsePlaylistId = (input: string): string | null => {
  const cleanInput = input.trim();
  const base62 = /^[a-zA-Z0-9]{22}$/;
  if (base62.test(cleanInput)) return cleanInput;
  
  if (cleanInput.startsWith('spotify:playlist:')) {
    const parts = cleanInput.split(':');
    return parts.length === 3 ? parts[2] : null;
  }

  try {
    const url = new URL(cleanInput);
    const segments = url.pathname.split('/').filter(Boolean);
    const idx = segments.indexOf('playlist');
    return idx !== -1 && segments[idx + 1] ? segments[idx + 1] : null;
  } catch { return null; }
};

// --- Core Logic ---

export const fetchRecommendations = async (request: RecommendRequest): Promise<RecommendationResponse> => {
  if (!_accessToken) {
    throw { status: 401, message: "No access token provided." } as ApiError;
  }

  const playlistId = parsePlaylistId(request.playlistUrl);
  if (!playlistId) {
    throw { status: 400, message: "Invalid Playlist URL." } as ApiError;
  }

  // 1. Fetch Playlist Metadata
  const playlistRes = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}`, { headers: headers() });
  const playlistJson = await handleResponse(playlistRes);
  
  const playlistData: PlaylistData = {
    id: playlistJson.id,
    name: playlistJson.name,
    owner: playlistJson.owner.display_name,
    imageUrl: playlistJson.images?.[0]?.url,
    trackCount: playlistJson.tracks.total,
    externalUrl: playlistJson.external_urls.spotify
  };

  // 2. Fetch Playlist Tracks (Limit 50 for analysis)
  const tracksRes = await fetch(`${SPOTIFY_API_BASE}/playlists/${playlistId}/tracks?limit=50`, { headers: headers() });
  const tracksJson = await handleResponse(tracksRes);
  
  // Filter valid tracks (sometimes APIs return null items or local tracks)
  const validItems = tracksJson.items.filter((item: any) => item.track && item.track.id);
  const sourceTracks: SpotifyTrack[] = validItems.map((item: any) => item.track);
  
  if (sourceTracks.length === 0) {
    throw { status: 400, message: "Playlist appears to be empty or contains only local files." } as ApiError;
  }

  // 3. Fetch Audio Features for analysis
  const trackIds = sourceTracks.map(t => t.id).slice(0, 50).join(','); // Max 100 allowed, we take 50
  const featuresRes = await fetch(`${SPOTIFY_API_BASE}/audio-features?ids=${trackIds}`, { headers: headers() });
  const featuresJson = await handleResponse(featuresRes);
  const audioFeatures: AudioFeatures[] = featuresJson.audio_features.filter(Boolean);

  // 4. Calculate Average Features (The "Vibe" of the playlist)
  const averages: Record<string, number> = {};
  
  TARGETABLE_FEATURES.forEach(feature => {
    const sum = audioFeatures.reduce((acc, curr) => acc + (curr[feature] || 0), 0);
    averages[feature] = audioFeatures.length ? sum / audioFeatures.length : 0;
  });

  // 5. Select Seeds (Random 5 from the playlist)
  // Shuffling tracks to get random seeds
  const shuffled = [...sourceTracks].sort(() => 0.5 - Math.random());
  const seedTracks = shuffled.slice(0, 5);
  const seedIds = seedTracks.map(t => t.id).join(',');

  // 6. Build Recommendation Request
  // We use the calculated averages as 'target_' parameters to steer the recommendation
  const params = new URLSearchParams();
  params.append('limit', request.limit.toString());
  params.append('seed_tracks', seedIds);
  
  // Apply calculated targets to bias the recommendation engine
  // We only apply them if the feature is significant (not 0)
  Object.entries(averages).forEach(([key, value]) => {
     // Round to 2 decimal places
     params.append(`target_${key}`, value.toFixed(2));
  });

  // If user strategy is 'audio-features', we might enforce stricter ranges,
  // but for 'spotify' strategy, targets + seeds is the standard best practice.
  // In this implementation, we use Spotify's engine for both but could post-filter for 'audio-features' strategy.

  const recRes = await fetch(`${SPOTIFY_API_BASE}/recommendations?${params.toString()}`, { headers: headers() });
  const recJson = await handleResponse(recRes);

  const recommendations = recJson.tracks.map((t: SpotifyTrack) => {
    return {
      ...normalizeTrack(t),
      reason: "Matches playlist vibe" // Simplified reason as we don't have individual seed mapping returned
    };
  });

  return {
    playlist: playlistData,
    seeds: seedTracks.map(normalizeTrack),
    recommendations,
    averageFeatures: averages
  };
};
