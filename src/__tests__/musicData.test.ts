import { describe, it, expect } from 'vitest';
import {
  WORD_BANK,
  getAllWords,
  getWordsByDifficulty,
  getWordByText,
  getRandomWord,
  getRandomWords,
  getOfflineSongHints,
  searchWords,
  getDifficultyStats,
  Difficulty,
} from '../lib/musicData';

describe('musicData.ts - Christian Edition Word Bank & Offline Song Engine', () => {
  it('contains at least 300 curated worship words', () => {
    const allWords = getAllWords();
    expect(allWords.length).toBeGreaterThanOrEqual(300);
    expect(WORD_BANK.length).toBeGreaterThanOrEqual(300);
  });

  it('ensures every word is categorized with a valid difficulty level', () => {
    const validDifficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Challenge'];
    const allWords = getAllWords();

    allWords.forEach((entry) => {
      expect(validDifficulties).toContain(entry.difficulty);
      expect(entry.id).toBeTruthy();
      expect(entry.word).toBeTruthy();
      expect(entry.category).toBeTruthy();
    });
  });

  it('maps every single word to 3 or more verified songs', () => {
    const allWords = getAllWords();

    allWords.forEach((entry) => {
      expect(entry.songHints.length).toBeGreaterThanOrEqual(3);

      entry.songHints.forEach((song) => {
        expect(song.title).toBeTruthy();
        expect(song.artist).toBeTruthy();
        expect(typeof song.year).toBe('number');
        expect(song.year).toBeGreaterThan(0);
        expect(Array.isArray(song.genres)).toBe(true);
        expect(song.genres.length).toBeGreaterThan(0);
      });
    });
  });

  it('filters words correctly by difficulty', () => {
    const easyWords = getWordsByDifficulty('Easy');
    const mediumWords = getWordsByDifficulty('Medium');
    const hardWords = getWordsByDifficulty('Hard');
    const challengeWords = getWordsByDifficulty('Challenge');

    expect(easyWords.length).toBeGreaterThan(0);
    expect(mediumWords.length).toBeGreaterThan(0);
    expect(hardWords.length).toBeGreaterThan(0);
    expect(challengeWords.length).toBeGreaterThan(0);

    easyWords.forEach((w) => expect(w.difficulty).toBe('Easy'));
    mediumWords.forEach((w) => expect(w.difficulty).toBe('Medium'));
    hardWords.forEach((w) => expect(w.difficulty).toBe('Hard'));
    challengeWords.forEach((w) => expect(w.difficulty).toBe('Challenge'));
  });

  it('retrieves word entries by text case-insensitively', () => {
    const entry1 = getWordByText('grace');
    const entry2 = getWordByText('GRACE');
    const entry3 = getWordByText('Grace');

    expect(entry1).toBeDefined();
    expect(entry1?.word).toBe('Grace');
    expect(entry2).toEqual(entry1);
    expect(entry3).toEqual(entry1);
  });

  it('returns random words correctly', () => {
    const randomWord = getRandomWord();
    expect(randomWord).toBeDefined();
    expect(randomWord.word).toBeTruthy();

    const randomEasyWord = getRandomWord('Easy');
    expect(randomEasyWord.difficulty).toBe('Easy');

    const randomMultiple = getRandomWords(5, 'Medium');
    expect(randomMultiple.length).toBe(5);
    randomMultiple.forEach((w) => expect(w.difficulty).toBe('Medium'));
  });

  it('provides offline song hints for known and unknown words', () => {
    const knownHints = getOfflineSongHints('Grace');
    expect(knownHints.length).toBeGreaterThanOrEqual(3);
    expect(knownHints[0].artist).toBe('Chris Tomlin');

    const unknownHints = getOfflineSongHints('UnregisteredCustomWord123');
    expect(unknownHints.length).toBe(3);
    expect(unknownHints[0].title).toBeTruthy();
  });

  it('searches words matching query', () => {
    const results = searchWords('grace');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((w) => w.word.toLowerCase().includes('grace'))).toBe(true);
  });

  it('calculates difficulty stats correctly', () => {
    const stats = getDifficultyStats();
    expect(stats.Easy).toBeGreaterThan(0);
    expect(stats.Medium).toBeGreaterThan(0);
    expect(stats.Hard).toBeGreaterThan(0);
    expect(stats.Challenge).toBeGreaterThan(0);
    const totalFromStats = stats.Easy + stats.Medium + stats.Hard + stats.Challenge;
    expect(totalFromStats).toBe(getAllWords().length);
  });
});
