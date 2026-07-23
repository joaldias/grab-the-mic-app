import { getOfflineSongHints, getWordByText, SongHint } from './musicData';

// Raw response format from iTunes Search API
export interface ItunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  artworkUrl600?: string;
  previewUrl?: string;
  trackViewUrl?: string;
  primaryGenreName?: string;
  releaseDate?: string;
}

export interface ItunesSearchResponse {
  resultCount: number;
  results: ItunesTrack[];
}

export interface FetchHintOptions {
  maxResults?: number;
  timeoutMs?: number;
  enableItunes?: boolean;
}

/**
 * Transforms an 100x100 iTunes artwork URL to a higher-resolution 600x600 artwork URL.
 */
export function getHighResArtworkUrl(artworkUrl?: string): string | undefined {
  if (!artworkUrl) return undefined;
  return artworkUrl.replace('100x100bb', '600x600bb');
}

/**
 * Converts a raw iTunes Track item to a normalized SongHint object.
 */
export function formatItunesTrackToSongHint(track: ItunesTrack, wordIdPrefix: string = 'itunes'): SongHint {
  const releaseYear = track.releaseDate 
    ? new Date(track.releaseDate).getFullYear() 
    : new Date().getFullYear();

  return {
    id: `${wordIdPrefix}-${track.trackId}`,
    title: track.trackName,
    artist: track.artistName,
    year: isNaN(releaseYear) ? 2020 : releaseYear,
    genres: track.primaryGenreName ? [track.primaryGenreName, "Christian"] : ["Worship"],
    previewUrl: track.previewUrl,
    artworkUrl: getHighResArtworkUrl(track.artworkUrl100),
    trackViewUrl: track.trackViewUrl,
    source: 'itunes',
  };
}

/**
 * Fetches song hints dynamically from the iTunes Search API.
 * Includes timeout protection via AbortController.
 */
export async function searchItunesSongs(
  searchTerm: string,
  limit: number = 5,
  timeoutMs: number = 4000
): Promise<SongHint[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const encodedTerm = encodeURIComponent(`${searchTerm} worship`);
    const url = `https://itunes.apple.com/search?term=${encodedTerm}&media=music&entity=song&limit=${limit}`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`iTunes API request failed with status: ${response.status}`);
      return [];
    }

    const data = (await response.json()) as ItunesSearchResponse;

    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((track) => formatItunesTrackToSongHint(track, 'itunes'));
  } catch (error) {
    clearTimeout(timeoutId);
    // Silent catch for network errors, timeouts, or rate limits
    return [];
  }
}

/**
 * Tries to enrich a specific offline SongHint with audio preview & artwork from iTunes.
 */
export async function enrichSongHintWithItunes(
  song: SongHint,
  timeoutMs: number = 3000
): Promise<SongHint> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    const url = `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) return song;

    const data = (await response.json()) as ItunesSearchResponse;
    if (data.results && data.results.length > 0) {
      const track = data.results[0];
      return {
        ...song,
        previewUrl: track.previewUrl || song.previewUrl,
        artworkUrl: getHighResArtworkUrl(track.artworkUrl100) || song.artworkUrl,
        trackViewUrl: track.trackViewUrl || song.trackViewUrl,
        source: 'itunes',
      };
    }
    return song;
  } catch (error) {
    clearTimeout(timeoutId);
    return song;
  }
}

/**
 * Intelligent Hint Retrieval Engine
 * Primary API to fetch song hints for a word.
 * 
 * Strategy:
 * 1. Retrieve curated offline song hints for the word from musicData.ts.
 * 2. If iTunes is enabled, attempt to enrich offline hints with audio previews/artwork from iTunes API.
 * 3. Also query iTunes for live worship song results matching the word.
 * 4. Fall back seamlessly to offline hints if offline, rate-limited, or API fails.
 */
export async function fetchSongHintsWithFallback(
  wordText: string,
  options: FetchHintOptions = {}
): Promise<SongHint[]> {
  const { maxResults = 3, timeoutMs = 4000, enableItunes = true } = options;

  // 1. Get verified offline hints (guaranteed baseline)
  const offlineHints = getOfflineSongHints(wordText);

  if (!enableItunes) {
    return offlineHints.slice(0, maxResults);
  }

  try {
    // 2. Concurrently attempt iTunes live search and song enrichment
    const [liveSearchHints, enrichedOfflineHints] = await Promise.all([
      searchItunesSongs(wordText, maxResults, timeoutMs),
      Promise.all(
        offlineHints.slice(0, maxResults).map((s) => enrichSongHintWithItunes(s, Math.min(timeoutMs, 2500)))
      ),
    ]);

    // Combine results prioritizing enriched offline songs, then live iTunes search results
    const combined: SongHint[] = [];
    const seenIds = new Set<string>();

    for (const song of enrichedOfflineHints) {
      if (!seenIds.has(song.id)) {
        seenIds.add(song.id);
        combined.push(song);
      }
    }

    for (const song of liveSearchHints) {
      if (!seenIds.has(song.id) && combined.length < maxResults * 2) {
        seenIds.add(song.id);
        combined.push(song);
      }
    }

    if (combined.length > 0) {
      return combined.slice(0, Math.max(maxResults, 3));
    }

    return offlineHints.slice(0, maxResults);
  } catch (err) {
    // Ultimate fallback to offline song hints
    return offlineHints.slice(0, maxResults);
  }
}
