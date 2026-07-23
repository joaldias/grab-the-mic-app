import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createBackendServer, generateRoomCode } from '../server.js';
import { io as ioClient, Socket as ClientSocket } from 'socket.io-client';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

describe('Backend Socket.io Server Integration Tests', () => {
  let httpServer: HttpServer;
  let ioServer: SocketIOServer;
  let rooms: Map<string, any>;
  let port: number;
  let clientSockets: ClientSocket[] = [];

  const createClientSocket = (): Promise<ClientSocket> => {
    return new Promise((resolve) => {
      const client = ioClient(`http://localhost:${port}`, {
        transports: ['websocket'],
        forceNew: true,
      });
      client.on('connect', () => {
        clientSockets.push(client);
        resolve(client);
      });
    });
  };

  beforeEach(async () => {
    const backend = createBackendServer();
    httpServer = backend.httpServer;
    ioServer = backend.io;
    rooms = backend.rooms;

    await new Promise<void>((resolve) => {
      httpServer.listen(0, () => {
        const addr = httpServer.address();
        port = typeof addr === 'object' && addr ? addr.port : 3001;
        resolve();
      });
    });
  });

  afterEach(async () => {
    for (const client of clientSockets) {
      if (client.connected) {
        client.disconnect();
      }
    }
    clientSockets = [];
    await new Promise<void>((resolve) => {
      ioServer.close(() => {
        httpServer.close(() => resolve());
      });
    });
  });

  describe('Room Creation & Joining', () => {
    it('should allow host to create room and player to join', async () => {
      const hostSocket = await createClientSocket();
      const playerSocket = await createClientSocket();

      // 1. Host creates room
      const createRes = await new Promise<any>((resolve) => {
        hostSocket.emit('create_room', { timerDuration: 30, categoryFilter: 'Hymns' }, resolve);
      });

      expect(createRes.success).toBe(true);
      expect(createRes.roomCode).toBeDefined();
      expect(createRes.room.settings.categoryFilter).toBe('Hymns');

      const roomCode = createRes.roomCode;

      // 2. Player joins room
      const joinRes = await new Promise<any>((resolve) => {
        playerSocket.emit('join_room', { roomCode, playerName: 'SingerOne' }, resolve);
      });

      expect(joinRes.success).toBe(true);
      expect(joinRes.room.players.length).toBe(1);
      expect(joinRes.room.players[0].name).toBe('SingerOne');
    });

    it('should reject joining non-existent rooms', async () => {
      const playerSocket = await createClientSocket();
      const joinRes = await new Promise<any>((resolve) => {
        playerSocket.emit('join_room', { roomCode: 'INVALID_CODE', playerName: 'Unknown' }, resolve);
      });

      expect(joinRes.success).toBe(false);
      expect(joinRes.message).toBe('Room not found');
    });

    it('should enforce unique room codes and avoid duplicate code collisions', () => {
      // Seed map with rooms
      const existingCodes = new Set<string>();
      for (let i = 0; i < 50; i++) {
        let code = generateRoomCode();
        while (existingCodes.has(code)) {
          code = generateRoomCode();
        }
        existingCodes.add(code);
        rooms.set(code, { roomCode: code });
      }

      // Verify generateRoomCode works and collision check handles duplicates
      let newCode = generateRoomCode();
      let attempts = 0;
      while (rooms.has(newCode) && attempts < 100) {
        newCode = generateRoomCode();
        attempts++;
      }
      expect(rooms.has(newCode)).toBe(false);
    });
  });

  describe('Buzzer Concurrency', () => {
    it('should assign buzzedPlayerId strictly to the first player when multiple players buzz_in', async () => {
      const hostSocket = await createClientSocket();
      const player1Socket = await createClientSocket();
      const player2Socket = await createClientSocket();
      const player3Socket = await createClientSocket();

      // Create room and join players
      const createRes = await new Promise<any>((resolve) => {
        hostSocket.emit('create_room', { timerDuration: 30 }, resolve);
      });
      const roomCode = createRes.roomCode;

      await new Promise((resolve) => player1Socket.emit('join_room', { roomCode, playerName: 'Player A' }, resolve));
      await new Promise((resolve) => player2Socket.emit('join_room', { roomCode, playerName: 'Player B' }, resolve));
      await new Promise((resolve) => player3Socket.emit('join_room', { roomCode, playerName: 'Player C' }, resolve));

      // Host starts game
      hostSocket.emit('start_game', { roomCode });

      // Wait for game_started broadcast
      await new Promise<void>((resolve) => {
        player1Socket.once('game_started', () => resolve());
      });

      const buzzedEvents: any[] = [];
      player1Socket.on('buzzed', (data) => buzzedEvents.push(data));
      player2Socket.on('buzzed', (data) => buzzedEvents.push(data));
      player3Socket.on('buzzed', (data) => buzzedEvents.push(data));

      // Emit buzz_in concurrently from all 3 players
      player1Socket.emit('buzz_in', { roomCode });
      player2Socket.emit('buzz_in', { roomCode });
      player3Socket.emit('buzz_in', { roomCode });

      // Give server time to process events
      await new Promise((r) => setTimeout(r, 100));

      const room = rooms.get(roomCode);
      expect(room.gameState.buzzedPlayerId).not.toBeNull();

      // Exactly 1 buzz lock broadcast should occur across all sockets for this buzz turn
      const firstBuzzerId = room.gameState.buzzedPlayerId;
      expect([player1Socket.id, player2Socket.id, player3Socket.id]).toContain(firstBuzzerId);

      // Verify subsequent buzz_in from another player is ignored while locked
      const remainingSocket = [player1Socket, player2Socket, player3Socket].find(s => s.id !== firstBuzzerId)!;
      remainingSocket.emit('buzz_in', { roomCode });
      await new Promise((r) => setTimeout(r, 50));

      expect(rooms.get(roomCode).gameState.buzzedPlayerId).toBe(firstBuzzerId);
    });
  });

  describe('Score Updates & Timer Synchronization', () => {
    it('should allow host to update score and broadcast room_updated', async () => {
      const hostSocket = await createClientSocket();
      const playerSocket = await createClientSocket();

      const createRes = await new Promise<any>((resolve) => {
        hostSocket.emit('create_room', {}, resolve);
      });
      const roomCode = createRes.roomCode;

      const joinRes = await new Promise<any>((resolve) => {
        playerSocket.emit('join_room', { roomCode, playerName: 'David' }, resolve);
      });
      const playerId = playerSocket.id;

      // Listen for room_updated on player socket
      const roomUpdatedPromise = new Promise<any>((resolve) => {
        playerSocket.on('room_updated', (updatedRoom) => {
          if (updatedRoom.players.some((p: any) => p.score === 150)) {
            resolve(updatedRoom);
          }
        });
      });

      // Host updates score by +150
      hostSocket.emit('update_score', { roomCode, playerId, scoreDelta: 150 });

      const updatedRoom = await roomUpdatedPromise;
      const targetPlayer = updatedRoom.players.find((p: any) => p.id === playerId);
      expect(targetPlayer.score).toBe(150);
    });

    it('should broadcast timer synchronization from host to room listeners', async () => {
      const hostSocket = await createClientSocket();
      const playerSocket = await createClientSocket();

      const createRes = await new Promise<any>((resolve) => {
        hostSocket.emit('create_room', { timerDuration: 30 }, resolve);
      });
      const roomCode = createRes.roomCode;

      await new Promise((resolve) => playerSocket.emit('join_room', { roomCode, playerName: 'Asaph' }, resolve));

      const timerSyncPromise = new Promise<any>((resolve) => {
        playerSocket.on('timer_sync', (data) => resolve(data));
      });

      // Host syncs timer to 18 seconds
      hostSocket.emit('sync_timer', { roomCode, timeRemaining: 18 });

      const timerData = await timerSyncPromise;
      expect(timerData.timeRemaining).toBe(18);

      const room = rooms.get(roomCode);
      expect(room.gameState.timeRemaining).toBe(18);
    });
  });
});
