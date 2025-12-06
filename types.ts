
export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  popularity: number;
  preview_url: string | null;
  duration_ms: number;
  external_urls: { spotify: string };
  uri: string;
}

export interface PlaylistData {
  id: string;
  name: string;
  owner: string;
  imageUrl?: string;
  trackCount: number;
  externalUrl: string;
}

// Internal app representation of a track (normalized)
export interface Track {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  imageUrl?: string;
  popularity?: number;
  preview_url?: string | null;
  duration_ms?: number;
  spotifyUrl?: string;
}

export interface Recommendation extends Track {
  reason: string;
  score?: number; 
}

export interface AudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
}

export interface RecommendationResponse {
  playlist: PlaylistData;
  seeds: Track[];
  recommendations: Recommendation[];
  averageFeatures?: Partial<Record<keyof AudioFeatures, number>>; // Stats for UI
}

export type Strategy = 'spotify' | 'audio-features';

export interface RecommendRequest {
  playlistUrl: string;
  limit: number;
  strategy: Strategy;
  targetGenre?: string; // Kept for UI compatibility, though less used in pure-API mode unless as seed
}

export interface ApiError {
  status: number;
  message: string;
  retryAfter?: number;
}
