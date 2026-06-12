const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

// IDs dos artistas no Spotify
const ARTIST_IDS = {
  aespa: '6qqNVTkFNib3oR8R8nFzkZ',
  bts: '3Nrfpe0tUJi4K4DXYWgMUX',
  blackpink: '41MozSoPIsD1dJM0CLPjZF',
  enhypen: '0oz5fHIGly5RzKHLXFCPZU',
  redvelvet: '1z4g3DjTBBZKhvAroFlhOM',
};

// IDs das trilhas sonoras no Spotify
const SOUNDTRACK_IDS = {
  starwars: '6uotU0gRQKKzRBf1hGBGKM',
  marvel: '0KFZE5t4TdFYqFqoSyoGg3',
};

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  return data.access_token;
}

export async function getLatestTrack(universe: string): Promise<{ name: string; previewUrl: string | null; albumArt: string } | null> {
  try {
    const token = await getAccessToken();
    
    const artistId = ARTIST_IDS[universe as keyof typeof ARTIST_IDS] || 
                     SOUNDTRACK_IDS[universe as keyof typeof SOUNDTRACK_IDS];
    
    if (!artistId) return null;

    // Para artistas K-pop: pega o último lançamento
    if (ARTIST_IDS[universe as keyof typeof ARTIST_IDS]) {
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=BR`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const track = data.tracks?.[0];
      if (!track) return null;
      return {
        name: track.name,
        previewUrl: track.preview_url,
        albumArt: track.album.images[0]?.url,
      };
    }

    // Para trilhas sonoras: pega a playlist
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${artistId}/tracks?limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const track = data.items?.[0]?.track;
    if (!track) return null;
    return {
      name: track.name,
      previewUrl: track.preview_url,
      albumArt: track.album.images[0]?.url,
    };
  } catch {
    return null;
  }
}