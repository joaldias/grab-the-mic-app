import { createInitialPlayerState, applyScoreToPlayer, calculateScore, PlayerScoreState, DifficultyLevel } from './scoring';
import { SessionWordBank, WordItem } from './wordBank';
import { TimerStateMachine, TimerState } from './timerStateMachine';

export interface RoomState {
  code: string;
  hostId: string;
  players: Record<string, PlayerScoreState>;
  status: 'lobby' | 'playing' | 'ended';
  currentTurnPlayerId: string | null;
  activeWord: WordItem | null;
  timerState: TimerState;
  remainingSeconds: number;
  wordBank: SessionWordBank;
  timerMachine: TimerStateMachine;
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export class RoomManager {
  private rooms: Map<string, RoomState> = new Map();

  public createRoom(hostId: string, customCode?: string): RoomState {
    const code = customCode ?? generateRoomCode();
    const wordBank = new SessionWordBank(undefined, `room-${code}`);
    const timerMachine = new TimerStateMachine({ durationSeconds: 30 });

    const room: RoomState = {
      code,
      hostId,
      players: {},
      status: 'lobby',
      currentTurnPlayerId: null,
      activeWord: null,
      timerState: timerMachine.getState(),
      remainingSeconds: timerMachine.getRemainingTime(),
      wordBank,
      timerMachine,
    };

    this.rooms.set(code, room);
    return room;
  }

  public getRoom(code: string): RoomState | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  public joinRoom(code: string, playerId: string, playerName: string): RoomState {
    const room = this.getRoom(code);
    if (!room) {
      throw new Error(`Room with code ${code} not found`);
    }

    if (!room.players[playerId]) {
      room.players[playerId] = createInitialPlayerState(playerId, playerName);
    }

    return room;
  }

  public leaveRoom(code: string, playerId: string): RoomState | undefined {
    const room = this.getRoom(code);
    if (!room) return undefined;

    delete room.players[playerId];

    if (room.currentTurnPlayerId === playerId) {
      const playerIds = Object.keys(room.players);
      room.currentTurnPlayerId = playerIds.length > 0 ? playerIds[0] : null;
    }

    return room;
  }

  public startRound(code: string, difficulty: DifficultyLevel = 'medium'): WordItem {
    const room = this.getRoom(code);
    if (!room) throw new Error(`Room ${code} not found`);

    room.status = 'playing';
    const nextWord = room.wordBank.getNextWord(difficulty);
    room.activeWord = nextWord;

    room.timerMachine.reset(30);
    room.timerMachine.start();
    room.timerState = room.timerMachine.getState();
    room.remainingSeconds = room.timerMachine.getRemainingTime();

    return nextWord;
  }

  public buzzIn(code: string, playerId: string): boolean {
    const room = this.getRoom(code);
    if (!room || room.status !== 'playing') return false;

    const buzzed = room.timerMachine.buzz(playerId);
    if (buzzed) {
      room.currentTurnPlayerId = playerId;
      room.timerState = room.timerMachine.getState();
    }
    return buzzed;
  }

  public submitAnswer(code: string, playerId: string, isCorrect: boolean): { room: RoomState; pointsAwarded: number } {
    const room = this.getRoom(code);
    if (!room) throw new Error(`Room ${code} not found`);

    const player = room.players[playerId];
    if (!player) throw new Error(`Player ${playerId} not in room ${code}`);

    const difficulty = room.activeWord?.difficulty ?? 'medium';
    const scoreResult = calculateScore({
      difficulty,
      timeRemainingSeconds: room.timerMachine.getRemainingTime(),
      totalDurationSeconds: room.timerMachine.getDuration(),
      currentStreak: player.streak,
      isCorrect,
    });

    room.players[playerId] = applyScoreToPlayer(player, scoreResult);

    if (isCorrect) {
      room.timerMachine.finish();
    } else {
      room.timerMachine.resumeFromBuzz();
    }

    room.timerState = room.timerMachine.getState();
    return { room, pointsAwarded: scoreResult.finalPoints };
  }

  public removeRoom(code: string): boolean {
    return this.rooms.delete(code.toUpperCase());
  }
}

export const globalRoomManager = new RoomManager();
