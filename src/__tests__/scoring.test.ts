import { describe, it, expect } from 'vitest';
import {
  calculateScore,
  getStreakMultiplier,
  createInitialPlayerState,
  applyScoreToPlayer,
  BASE_POINTS_MAP,
  PENALTY_POINTS,
} from '../lib/scoring';

describe('Scoring Algorithm', () => {
  it('should return correct base points per difficulty level', () => {
    expect(BASE_POINTS_MAP.easy).toBe(10);
    expect(BASE_POINTS_MAP.medium).toBe(20);
    expect(BASE_POINTS_MAP.hard).toBe(30);
    expect(BASE_POINTS_MAP.challenge).toBe(50);
  });

  it('should scale streak multipliers correctly based on consecutive streak count', () => {
    expect(getStreakMultiplier(0)).toBe(1.0);
    expect(getStreakMultiplier(1)).toBe(1.0);
    expect(getStreakMultiplier(2)).toBe(1.25);
    expect(getStreakMultiplier(3)).toBe(1.5);
    expect(getStreakMultiplier(4)).toBe(2.0);
    expect(getStreakMultiplier(10)).toBe(2.0);
  });

  it('should calculate score with speed bonus for correct answer with remaining time', () => {
    const result = calculateScore({
      difficulty: 'medium', // base 20
      timeRemainingSeconds: 30,
      totalDurationSeconds: 30, // 100% time left -> max speed bonus 15
      currentStreak: 0,
      isCorrect: true,
    });

    expect(result.basePoints).toBe(20);
    expect(result.speedBonus).toBe(15);
    expect(result.streakMultiplier).toBe(1.0);
    expect(result.finalPoints).toBe(35); // (20 + 15) * 1.0 = 35
    expect(result.newStreak).toBe(1);
  });

  it('should apply streak multiplier when player is on a winning streak', () => {
    const result = calculateScore({
      difficulty: 'hard', // base 30
      timeRemainingSeconds: 15,
      totalDurationSeconds: 30, // 50% time left -> speed bonus Math.round(0.5 * 15) = 8
      currentStreak: 2, // next streak 3 -> multiplier 1.5x
      isCorrect: true,
    });

    expect(result.basePoints).toBe(30);
    expect(result.speedBonus).toBe(8);
    expect(result.streakMultiplier).toBe(1.5);
    // (30 + 8) * 1.5 = 57
    expect(result.finalPoints).toBe(57);
    expect(result.newStreak).toBe(3);
  });

  it('should apply penalty and reset streak on incorrect answer', () => {
    const result = calculateScore({
      difficulty: 'challenge',
      timeRemainingSeconds: 10,
      totalDurationSeconds: 30,
      currentStreak: 5,
      isCorrect: false,
    });

    expect(result.penalty).toBe(PENALTY_POINTS);
    expect(result.finalPoints).toBe(-PENALTY_POINTS);
    expect(result.newStreak).toBe(0);
  });

  it('should create initial player state and update score state cleanly', () => {
    const player = createInitialPlayerState('p1', 'Sarah');
    expect(player.totalScore).toBe(0);
    expect(player.streak).toBe(0);

    const winResult = calculateScore({
      difficulty: 'easy',
      timeRemainingSeconds: 30,
      totalDurationSeconds: 30,
      currentStreak: 0,
      isCorrect: true,
    });

    const updated = applyScoreToPlayer(player, winResult);
    expect(updated.totalScore).toBe(25);
    expect(updated.streak).toBe(1);
    expect(updated.roundsPlayed).toBe(1);
    expect(updated.correctAnswers).toBe(1);
  });
});
