import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getHighResArtworkUrl,
  formatItunesTrackToSongHint,
  searchItunesSongs,
  enrichSongHintWithItunes,
  fetchSongHintsWithFallback,
  ItunesTrack,
} from '../lib/itunes';
import { getOfflineSongHints } from '../lib/musicData';

describe('itunes.ts - iTunes Search API & Intelligent Fallback Engine', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('converts 100x100 artwork URL to 600x600 high-res URL', () => {
    const lowRes = 'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/100x100bb.jpg';
    const highRes = getHighResArtworkUrl(lowRes);
    expect(highRes).toBe('https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/600x600bb.jpg');

    expect(getHighResArtworkUrl(undefined)).toBeUndefined();
  });

  it('formats raw iTunes track object into a SongHint', () => {
    const rawTrack: ItunesTrack = {
      trackId: 987654,
      trackName: 'Oceans (Where Feet May Fail)',
      artistName: 'Hillsong UNITED',
      releaseDate: '2013-02-26T08:00:00Z',
      artworkUrl100: 'https://mzstatic.com/100x100bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/preview.m4a',
      trackViewUrl: 'https://music.apple.com/us/album/oceans',
      primaryGenreName: 'Christian & Gospel',
    };

    const hint = formatItunesTrackToSongHint(rawTrack, 'test');
    expect(hint.id).toBe('test-987654');
    expect(hint.title).toBe('Oceans (Where Feet May Fail)');
    expect(hint.artist).toBe('Hillsong UNITED');
    expect(hint.year).toBe(2013);
    expect(hint.previewUrl).toBe('https://audio-ssl.itunes.apple.com/preview.m4a');
    expect(hint.artworkUrl).toBe('https://mzstatic.com/600x600bb.jpg');
    expect(hint.trackViewUrl).toBe('https://music.apple.com/us/album/oceans');
    expect(hint.source).toBe('itunes');
  });

  it('fetches song hints from iTunes API successfully when online', async () => {
    const mockTrack: ItunesTrack = {
      trackId: 1001,
      trackName: 'Gracefully Broken',
      artistName: 'Tasha Cobbs Leonard',
      releaseDate: '2017-08-25T00:00:00Z',
      artworkUrl100: 'https://mzstatic.com/100x100bb.jpg',
      previewUrl: 'https://audio-ssl.itunes.apple.com/preview1001.m4a',
      trackViewUrl: 'https://music.apple.com/us/album/1001',
      primaryGenreName: 'Gospel',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        resultCount: 1,
        results: [mockTrack],
      }),
    } as Response);

    const hints = await searchItunesSongs('Grace', 3);
    expect(hints.length).toBe(1);
    expect(hints[0].title).toBe('Gracefully Broken');
    expect(hints[0].artist).toBe('Tasha Cobbs Leonard');
    expect(hints[0].source).toBe('itunes');
  });

  it('handles API errors/failures gracefully without throwing', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error / offline'));

    const hints = await searchItunesSongs('Grace', 3);
    expect(hints).toEqual([]);
  });

  it('enriches an offline SongHint with audio preview & artwork from iTunes', async () => {
    const offlineSong = getOfflineSongHints('Grace')[0]; // Amazing Grace

    const mockTrack: ItunesTrack = {
      trackId: 555,
      trackName: offlineSong.title,
      artistName: offlineSong.artist,
      artworkUrl100: 'https://mzstatic.com/100x100bb.jpg',
      previewUrl: 'https://audio.itunes.apple.com/preview555.m4a',
      trackViewUrl: 'https://music.apple.com/track/555',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        resultCount: 1,
        results: [mockTrack],
      }),
    } as Response);

    const enriched = await enrichSongHintWithItunes(offlineSong);
    expect(enriched.previewUrl).toBe('https://audio.itunes.apple.com/preview555.m4a');
    expect(enriched.artworkUrl).toBe('https://mzstatic.com/600x600bb.jpg');
    expect(enriched.source).toBe('itunes');
  });

  it('falls back to offline hints if fetchSongHintsWithFallback encounters API error or offline status', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('API Rate Limited / Offline'));

    const hints = await fetchSongHintsWithFallback('Grace');
    expect(hints.length).toBeGreaterThanOrEqual(3);
    expect(hints[0].artist).toBe('Chris Tomlin');
    expect(hints[0].source).toBe('offline');
  });

  it('returns offline song hints directly when enableItunes is set to false', async () => {
    const hints = await fetchSongHintsWithFallback('Grace', { enableItunes: false });
    expect(hints.length).toBe(3);
    expect(hints[0].artist).toBe('Chris Tomlin');
    expect(hints[0].source).toBe('offline');
  });
});
