
export const APP_NAME = "Groove Graph";
export const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Audio Features we want to analyze and target
export const TARGETABLE_FEATURES = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  'valence',
  'speechiness'
] as const;

export type AudioFeatureKey = typeof TARGETABLE_FEATURES[number];

export const GENRE_KEYS = [
  "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", 
  "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", 
  "british", "cantopop", "chicago-house", "children", "chill", "classical", 
  "club", "comedy", "country", "dance", "dancehall", "death-metal", 
  "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", 
  "dubstep", "edm", "electro", "electronic", "emo", "folk", "funk", "garage", 
  "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", 
  "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", 
  "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", 
  "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", 
  "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", 
  "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", 
  "new-release", "opera", "pagode", "party", "philippines-opm", "piano", 
  "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", 
  "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", 
  "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", 
  "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", 
  "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", 
  "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", 
  "turkish", "work-out", "world-music"
];