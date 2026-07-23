export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'challenge';

export interface ScoreInput {
  difficulty: DifficultyLevel;
  timeRemainingSeconds: number;
  totalDurationSeconds: number;
  currentStreak: number;
  isCorrect: boolean;
}

export interface ScoreResult {
  basePoints: number;
  speedBonus: number;
  streakMultiplier: number;
  penalty: number;
  finalPoints: number;
  newStreak: number;
}

export interface PlayerScoreState {
  playerId: string;
  playerName: string;
  totalScore: number;
  streak: number;
  roundsPlayed: number;
  correctAnswers: number;
}

export const BASE_POINTS_MAP: Record<DifficultyLevel, number> = {
  easy: 10,
  medium: 20,
  hard: 30,
  challenge: 50,
};

export const PENALTY_POINTS = 10;
export const MAX_SPEED_BONUS = 15;

export function getStreakMultiplier(streak: number): number {
  if (streak <= 1) return 1.0;
  if (streak === 2) return 1.25;
  if (streak === 3) return 1.5;
  return 2.0;
}

export function calculateScore(input: ScoreInput): ScoreResult {
  if (!input.isCorrect) {
    return {
      basePoints: 0,
      speedBonus: 0,
      streakMultiplier: 1.0,
      penalty: PENALTY_POINTS,
      finalPoints: -PENALTY_POINTS,
      newStreak: 0,
    };
  }

  const basePoints = BASE_POINTS_MAP[input.difficulty] ?? 10;

  const totalTime = Math.max(1, input.totalDurationSeconds);
  const remainingTime = Math.max(0, Math.min(input.timeRemainingSeconds, totalTime));
  const timeRatio = remainingTime / totalTime;
  const speedBonus = Math.round(timeRatio * MAX_SPEED_BONUS);

  const streak = Math.max(0, input.currentStreak);
  const streakMultiplier = getStreakMultiplier(streak + 1);

  const rawPoints = (basePoints + speedBonus) * streakMultiplier;
  const finalPoints = Math.round(rawPoints);

  return {
    basePoints,
    speedBonus,
    streakMultiplier,
    penalty: 0,
    finalPoints,
    newStreak: streak + 1,
  };
}

export function createInitialPlayerState(playerId: string, playerName: string): PlayerScoreState {
  return {
    playerId,
    playerName,
    totalScore: 0,
    streak: 0,
    roundsPlayed: 0,
    correctAnswers: 0,
  };
}

export function applyScoreToPlayer(
  player: PlayerScoreState,
  scoreResult: ScoreResult
): PlayerScoreState {
  return {
    ...player,
    totalScore: Math.max(0, player.totalScore + scoreResult.finalPoints),
    streak: scoreResult.newStreak,
    roundsPlayed: player.roundsPlayed + 1,
    correctAnswers: scoreResult.finalPoints > 0 ? player.correctAnswers + 1 : player.correctAnswers,
  };
}
