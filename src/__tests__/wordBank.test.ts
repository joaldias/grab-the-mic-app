import { describe, it, expect } from 'vitest';
import { SessionWordBank, generateExpandedWordBank, INITIAL_WORD_BANK } from '../lib/wordBank';

describe('Word Bank & Randomization (Zero Duplicate Guarantee)', () => {
  it('should generate an expanded word bank with 300+ total curated words', () => {
    const fullBank = generateExpandedWordBank();
    expect(fullBank.length).toBeGreaterThanOrEqual(300);
  });

  it('should ensure every initial word item has at least 3 song hints with valid fields', () => {
    INITIAL_WORD_BANK.forEach((wordItem) => {
      expect(wordItem.hints.length).toBeGreaterThanOrEqual(3);
      wordItem.hints.forEach((hint) => {
        expect(hint.title).toBeTruthy();
        expect(hint.artist).toBeTruthy();
        expect(hint.year).toBeGreaterThan(1500);
        expect(hint.genre).toBeTruthy();
      });
    });
  });

  it('CRITICAL: should guarantee ZERO duplicate word repeats per session across consecutive draws', () => {
    const session = new SessionWordBank(undefined, 'test-zero-duplicate-session');
    const drawnIds = new Set<string>();

    // Draw 50 consecutive words from the session
    const drawCount = 50;
    for (let i = 0; i < drawCount; i++) {
      const word = session.getNextWord();
      expect(drawnIds.has(word.id)).toBe(false); // MUST NOT BE DUPLICATE
      drawnIds.add(word.id);
    }

    expect(drawnIds.size).toBe(drawCount);
    expect(session.getUsedWordCount()).toBe(drawCount);
  });

  it('should filter words correctly by difficulty level', () => {
    const session = new SessionWordBank(undefined, 'test-difficulty-session');

    for (let i = 0; i < 10; i++) {
      const easyWord = session.getNextWord('easy');
      expect(easyWord.difficulty).toBe('easy');

      const hardWord = session.getNextWord('hard');
      expect(hardWord.difficulty).toBe('hard');
    }
  });

  it('should reset session used history on explicit resetSession call', () => {
    const session = new SessionWordBank(undefined, 'test-reset-session');
    
    // Draw 10 words
    const drawnWords = [];
    for (let i = 0; i < 10; i++) {
      drawnWords.push(session.getNextWord());
    }

    expect(session.getUsedWordCount()).toBe(10);

    session.resetSession();
    expect(session.getUsedWordCount()).toBe(0);
  });

  it('should gracefully auto-reset category when all words in small pool are exhausted', () => {
    const smallBank = [
      { id: 'sb1', word: 'Joy', difficulty: 'easy' as const, hints: [] },
      { id: 'sb2', word: 'Peace', difficulty: 'easy' as const, hints: [] },
    ];
    const session = new SessionWordBank(smallBank, 'test-auto-reset');

    const word1 = session.getNextWord('easy');
    const word2 = session.getNextWord('easy');

    expect(word1.id).not.toBe(word2.id);

    // 3rd draw should trigger auto-reset of used pool for easy, returning a valid word
    const word3 = session.getNextWord('easy');
    expect(word3).toBeDefined();
    expect(['sb1', 'sb2']).toContain(word3.id);
  });
});
