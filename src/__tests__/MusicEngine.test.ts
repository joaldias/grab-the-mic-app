import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  musicEngine,
  MusicEngine,
  generateAcousticChordToneDataUri,
  uint8ArrayToBase64,
  getHighResArtworkUrl,
  formatItunesTrack,
} from '../../mobile/src/engine/MusicEngine';
import { soundEffects, generateBeepWav, generateBuzzerWav, generatePowerUpWav, generateVictoryWav } from '../../mobile/src/engine/SoundEffects';

describe('MusicEngine & SoundEffects Engine Unit Tests (src)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('1. Word Bank Dataset & Filtering', () => {
    it('should export the complete Christian Worship Word Bank (300+ words)', () => {
      const bank = musicEngine.getWordBank();
      expect(bank.length).toBeGreaterThanOrEqual(300);
    });

    it('should filter words by difficulty category', () => {
      const easyWords = musicEngine.getWordsByDifficulty('Easy');
      const mediumWords = musicEngine.getWordsByDifficulty('Medium');
      const hardWords = musicEngine.getWordsByDifficulty('Hard');

      expect(easyWords.length).toBeGreaterThan(0);
      expect(mediumWords.length).toBeGreaterThan(0);
      expect(hardWords.length).toBeGreaterThan(0);

      expect(easyWords.every((w) => w.difficulty === 'Easy')).toBe(true);
      expect(mediumWords.every((w) => w.difficulty === 'Medium')).toBe(true);
      expect(hardWords.every((w) => w.difficulty === 'Hard')).toBe(true);
    });

    it('should filter words by category', () => {
      const theologyWords = musicEngine.getWordsByCategory('Theology');
      expect(theologyWords.length).toBeGreaterThan(0);
      expect(theologyWords.every((w) => w.category === 'Theology')).toBe(true);
    });

    it('should search word entries by text query', () => {
      const results = musicEngine.searchWords('Grace');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((w) => w.word.toLowerCase().includes('grace'))).toBe(true);
    });

    it('should retrieve a specific word by exact text', () => {
      const entry = musicEngine.getWordByText('Grace');
      expect(entry).toBeDefined();
      expect(entry?.word).toBe('Grace');
      expect(entry?.songHints.length).toBeGreaterThan(0);
    });

    it('should return a random word filtered by difficulty', () => {
      const word = musicEngine.getRandomWord('Easy');
      expect(word).toBeDefined();
      expect(word.difficulty).toBe('Easy');
    });

    it('should return all available categories', () => {
      const categories = musicEngine.getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('Theology');
    });
  });

  describe('2. iTunes Search API Integration', () => {
    it('should upgrade 100x100 artwork URL to 600x600 high res artwork', () => {
      const rawUrl = 'https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/100x100bb.jpg';
      const highResUrl = getHighResArtworkUrl(rawUrl);
      expect(highResUrl).toBe('https://is1-ssl.mzstatic.com/image/thumb/Music123/v4/600x600bb.jpg');
    });

    it('should format raw iTunes track results correctly', () => {
      const mockTrack = {
        trackId: 998877,
        trackName: 'Amazing Grace',
        artistName: 'Chris Tomlin',
        artworkUrl100: 'http://example.com/100x100bb.jpg',
        previewUrl: 'http://example.com/preview.m4a',
        primaryGenreName: 'Christian & Gospel',
        releaseDate: '2006-09-26T07:00:00Z',
      };

      const formatted = formatItunesTrack(mockTrack);
      expect(formatted.id).toBe('itunes-998877');
      expect(formatted.title).toBe('Amazing Grace');
      expect(formatted.artist).toBe('Chris Tomlin');
      expect(formatted.year).toBe(2006);
      expect(formatted.previewUrl).toBe('http://example.com/preview.m4a');
      expect(formatted.artworkUrl).toBe('http://example.com/600x600bb.jpg');
      expect(formatted.source).toBe('itunes');
    });

    it('should fetch tracks from iTunes API successfully when online', async () => {
      const mockResponse = {
        resultCount: 1,
        results: [
          {
            trackId: 12345,
            trackName: 'Reckless Love',
            artistName: 'Cory Asbury',
            artworkUrl100: 'https://example.com/100x100bb.jpg',
            previewUrl: 'https://example.com/reckless_preview.mp3',
            primaryGenreName: 'Worship',
            releaseDate: '2018-01-26T00:00:00Z',
          },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const results = await musicEngine.searchItunes('Reckless Love');
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Reckless Love');
      expect(results[0].artist).toBe('Cory Asbury');
      expect(results[0].previewUrl).toBe('https://example.com/reckless_preview.mp3');
    });

    it('should handle iTunes network errors or timeouts gracefully without throwing', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const results = await musicEngine.searchItunes('NonExistentSong');
      expect(results).toEqual([]);
    });
  });

  describe('3. Offline Fallback Generator & Synthesis', () => {
    it('should encode Uint8Array bytes to base64 string', () => {
      const bytes = new Uint8Array([72, 101, 108, 108, 111]);
      const base64 = uint8ArrayToBase64(bytes);
      expect(base64).toBe('SGVsbG8=');
    });

    it('should generate synthetic acoustic chord tone WAV Data URI', () => {
      const dataUri = generateAcousticChordToneDataUri([261.63, 329.63, 392.0], 1.0);
      expect(dataUri).toMatch(/^data:audio\/wav;base64,/);
      expect(dataUri.length).toBeGreaterThan(100);
    });

    it('should return live previewUrl if song already has iTunes preview URL', async () => {
      const songHint = {
        id: 'test-song-1',
        title: 'Goodness of God',
        artist: 'Bethel Music',
        year: 2019,
        genres: ['Worship'],
        previewUrl: 'http://example.com/goodness_preview.mp3',
        source: 'itunes',
      };

      const result = await musicEngine.getAudioPreview(songHint, { enableItunes: false });
      expect(result.previewUrl).toBe('http://example.com/goodness_preview.mp3');
      expect(result.isOfflineFallback).toBe(false);
      expect(result.source).toBe('itunes');
    });

    it('should generate offline synthetic acoustic audio preview when network is offline', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Offline'));

      const songHint = {
        id: 'offline-song-1',
        title: 'Way Maker',
        artist: 'Sinach',
        year: 2015,
        genres: ['Gospel'],
        source: 'offline' as const,
      };

      const result = await musicEngine.getAudioPreview(songHint, { enableItunes: true });
      expect(result.isOfflineFallback).toBe(true);
      expect(result.source).toBe('offline');
      expect(result.previewUrl).toMatch(/^data:audio\/wav;base64,/);
    });
  });

  describe('4. SoundEffects System', () => {
    it('should allow muting and unmuting sound effects', () => {
      soundEffects.setMuted(true);
      expect(soundEffects.isMuted()).toBe(true);
      soundEffects.setMuted(false);
      expect(soundEffects.isMuted()).toBe(false);
    });

    it('should set and retrieve volume within [0, 1] range', () => {
      soundEffects.setVolume(0.75);
      expect(soundEffects.getVolume()).toBe(0.75);

      soundEffects.setVolume(1.5);
      expect(soundEffects.getVolume()).toBe(1.0);

      soundEffects.setVolume(-0.5);
      expect(soundEffects.getVolume()).toBe(0);
    });

    it('should generate valid procedural WAV buffers for all sound effects', () => {
      expect(generateBeepWav(440, 0.1)).toMatch(/^data:audio\/wav;base64,/);
      expect(generateBuzzerWav()).toMatch(/^data:audio\/wav;base64,/);
      expect(generatePowerUpWav()).toMatch(/^data:audio\/wav;base64,/);
      expect(generateVictoryWav()).toMatch(/^data:audio\/wav;base64,/);
    });

    it('should trigger sound effect playback methods without throwing', async () => {
      soundEffects.setMuted(true);
      await expect(soundEffects.playCountdown(false)).resolves.not.toThrow();
      await expect(soundEffects.playCountdown(true)).resolves.not.toThrow();
      await expect(soundEffects.playTickingClock(10)).resolves.not.toThrow();
      await expect(soundEffects.playTickingClock(3)).resolves.not.toThrow();
      await expect(soundEffects.playBuzzer()).resolves.not.toThrow();
      await expect(soundEffects.playPowerUp()).resolves.not.toThrow();
      await expect(soundEffects.playVictory()).resolves.not.toThrow();
    });
  });
});
