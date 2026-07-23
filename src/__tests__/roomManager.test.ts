import { describe, it, expect } from 'vitest';
import { RoomManager, generateRoomCode } from '../lib/roomManager';

describe('RoomManager', () => {
  it('should generate a 4-letter uppercase alphanumeric room code', () => {
    const code = generateRoomCode();
    expect(code).toMatch(/^[A-Z0-9]{4}$/);
  });

  it('should create a room with host ID and initial lobby state', () => {
    const rm = new RoomManager();
    const room = rm.createRoom('host_1', 'TEST');

    expect(room.code).toBe('TEST');
    expect(room.hostId).toBe('host_1');
    expect(room.status).toBe('lobby');
    expect(Object.keys(room.players).length).toBe(0);
    expect(room.activeWord).toBeNull();
  });

  it('should allow players to join room and maintain player states', () => {
    const rm = new RoomManager();
    rm.createRoom('host_1', 'JOIN');

    const updatedRoom = rm.joinRoom('JOIN', 'p1', 'Alex');
    expect(updatedRoom.players['p1']).toBeDefined();
    expect(updatedRoom.players['p1'].playerName).toBe('Alex');
    expect(updatedRoom.players['p1'].totalScore).toBe(0);
  });

  it('should handle round start, word assignment, and timer initialization', () => {
    const rm = new RoomManager();
    rm.createRoom('host_1', 'GAME');
    rm.joinRoom('GAME', 'p1', 'Alex');

    const word = rm.startRound('GAME', 'medium');
    const room = rm.getRoom('GAME')!;

    expect(room.status).toBe('playing');
    expect(room.activeWord).toEqual(word);
    expect(room.timerState).toBe('running');
  });

  it('should handle player buzz-in and turn registration', () => {
    const rm = new RoomManager();
    rm.createRoom('host_1', 'BUZZ');
    rm.joinRoom('BUZZ', 'p1', 'Alex');
    rm.startRound('BUZZ', 'easy');

    const buzzed = rm.buzzIn('BUZZ', 'p1');
    expect(buzzed).toBe(true);

    const room = rm.getRoom('BUZZ')!;
    expect(room.currentTurnPlayerId).toBe('p1');
    expect(room.timerState).toBe('buzzed');
  });

  it('should calculate and apply score when answer is submitted', () => {
    const rm = new RoomManager();
    rm.createRoom('host_1', 'SCORE');
    rm.joinRoom('SCORE', 'p1', 'Alex');
    rm.startRound('SCORE', 'easy');
    rm.buzzIn('SCORE', 'p1');

    const { room, pointsAwarded } = rm.submitAnswer('SCORE', 'p1', true);
    expect(pointsAwarded).toBeGreaterThan(0);
    expect(room.players['p1'].totalScore).toBe(pointsAwarded);
    expect(room.players['p1'].streak).toBe(1);
    expect(room.timerState).toBe('finished');
  });

  it('should handle player departure from room', () => {
    const rm = new RoomManager();
    rm.createRoom('host_1', 'EXIT');
    rm.joinRoom('EXIT', 'p1', 'Alex');
    rm.joinRoom('EXIT', 'p2', 'Jordan');

    const roomBefore = rm.getRoom('EXIT')!;
    expect(Object.keys(roomBefore.players).length).toBe(2);

    rm.leaveRoom('EXIT', 'p1');
    const roomAfter = rm.getRoom('EXIT')!;
    expect(Object.keys(roomAfter.players).length).toBe(1);
    expect(roomAfter.players['p1']).toBeUndefined();
    expect(roomAfter.players['p2']).toBeDefined();
  });
});
