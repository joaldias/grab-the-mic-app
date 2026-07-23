const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const os = require('os');

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';

/**
 * Generate a random 4-letter uppercase room code
 */
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Get microsecond precision timestamp to prevent race conditions
 */
function getMicroseconds() {
  return Number(process.hrtime.bigint() / 1000n);
}

/**
 * Helper to retrieve local LAN IP address
 */
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function createBackendServer() {
  const app = express();

  // Enable CORS for Express REST API endpoints
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  const httpServer = createServer(app);

  // Enable full CORS for Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // In-memory state for active game lobbies
  const rooms = new Map();

  // REST API Endpoints

  /**
   * GET /health - Service health check
   */
  app.get('/health', (req, res) => {
    let totalPlayers = 0;
    for (const room of rooms.values()) {
      totalPlayers += room.players.length;
    }

    res.json({
      status: 'ok',
      activeRooms: rooms.size,
      playersCount: totalPlayers,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  /**
   * GET /api/rooms - Active rooms metadata
   */
  app.get('/api/rooms', (req, res) => {
    const activeRooms = Array.from(rooms.values()).map(room => ({
      roomCode: room.roomCode,
      hostId: room.hostId,
      playerCount: room.players.length,
      status: room.gameState.status,
      category: room.settings?.categoryFilter || 'All',
      settings: room.settings,
      players: room.players.map(p => ({
        id: p.id,
        name: p.name,
        score: p.score
      }))
    }));

    res.json({
      success: true,
      count: activeRooms.length,
      rooms: activeRooms
    });
  });

  // Socket.io Connection & Event Handling
  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Host creates a room
    socket.on('create_room', (settings, callback) => {
      let roomCode;
      do {
        roomCode = generateRoomCode();
      } while (rooms.has(roomCode));

      const newRoom = {
        roomCode,
        hostId: socket.id,
        settings: {
          timerDuration: settings?.timerDuration || 30, // 15, 30, 45
          hintDelay: settings?.hintDelay || 5,
          categoryFilter: settings?.categoryFilter || 'All' // Hymns, Modern Worship, Gospel, Kids Worship
        },
        players: [],
        gameState: {
          status: 'lobby', // lobby, playing, paused, ended
          currentTurnIndex: 0,
          buzzedPlayerId: null,
          buzzedAt: null,
          timeRemaining: settings?.timerDuration || 30
        }
      };

      rooms.set(roomCode, newRoom);
      socket.join(roomCode);

      console.log(`[Room Created] Code: ${roomCode} | Host: ${socket.id}`);

      if (typeof callback === 'function') {
        callback({ success: true, roomCode, room: newRoom });
      }
    });

    // Player joins a room with unique nickname
    socket.on('join_room', ({ roomCode, playerName, nickname }, callback) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);

      if (!room) {
        if (typeof callback === 'function') {
          callback({ success: false, message: 'Room not found' });
        }
        return;
      }

      const requestedName = (playerName || nickname || '').trim() || `Player ${room.players.length + 1}`;
      
      // Ensure unique nickname in room
      let uniqueName = requestedName;
      let counter = 1;
      while (room.players.some(p => p.name.toLowerCase() === uniqueName.toLowerCase())) {
        counter++;
        uniqueName = `${requestedName} (${counter})`;
      }

      const player = {
        id: socket.id,
        name: uniqueName,
        score: 0
      };

      room.players.push(player);
      socket.join(code);

      console.log(`[Player Joined] Room: ${code} | Player: ${uniqueName} (${socket.id})`);

      // Notify host and all players in the room
      io.to(code).emit('room_updated', room);

      if (typeof callback === 'function') {
        callback({ success: true, room, player });
      }
    });

    // Host updates room settings
    socket.on('update_settings', ({ roomCode, settings }) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        room.settings = { ...room.settings, ...settings };
        if (room.gameState.status === 'lobby' && settings?.timerDuration) {
          room.gameState.timeRemaining = settings.timerDuration;
        }
        io.to(code).emit('room_updated', room);
      }
    });

    // Host starts the game
    socket.on('start_game', ({ roomCode }) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        room.gameState.status = 'playing';
        io.to(code).emit('game_started', room);
      }
    });

    // Instant Buzz-In with Microsecond Timestamping to lock out race conditions
    socket.on('buzz_in', ({ roomCode }) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);
      if (!room) return;

      // Microsecond atomic locking
      if (room.gameState.status === 'playing' && !room.gameState.buzzedPlayerId) {
        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          const timestampUs = getMicroseconds();
          room.gameState.buzzedPlayerId = socket.id;
          room.gameState.buzzedAt = timestampUs;

          console.log(`[Buzz Locked] Room: ${code} | Player: ${player.name} | Us: ${timestampUs}`);

          io.to(code).emit('buzzed', {
            playerId: socket.id,
            playerName: player.name,
            timestamp: timestampUs,
            buzzedAt: timestampUs
          });
        }
      }
    });

    // Host clears buzz state
    socket.on('clear_buzz', ({ roomCode }) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        room.gameState.buzzedPlayerId = null;
        room.gameState.buzzedAt = null;
        io.to(code).emit('buzz_cleared', room);
      }
    });

    // Host updates score
    socket.on('update_score', ({ roomCode, playerId, scoreDelta }) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        const player = room.players.find(p => p.id === playerId);
        if (player) {
          player.score += scoreDelta;
          io.to(code).emit('room_updated', room);
        }
      }
    });

    // Timer sync broadcast from host
    socket.on('sync_timer', ({ roomCode, timeRemaining }) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        room.gameState.timeRemaining = timeRemaining;
        socket.to(code).emit('timer_sync', { timeRemaining });
      }
    });

    // Host triggers next turn
    socket.on('next_turn', ({ roomCode }) => {
      const code = roomCode?.toUpperCase()?.trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        const numPlayers = Math.max(1, room.players.length);
        room.gameState.currentTurnIndex = (room.gameState.currentTurnIndex + 1) % numPlayers;
        room.gameState.buzzedPlayerId = null;
        room.gameState.buzzedAt = null;
        room.gameState.timeRemaining = room.settings.timerDuration;
        io.to(code).emit('turn_changed', room);
      }
    });

    // Handle client disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      
      for (const [roomCode, room] of rooms.entries()) {
        if (room.hostId === socket.id) {
          // Automatic room cleanup when host disconnects
          console.log(`[Room Cleaned] Host disconnected from room: ${roomCode}`);
          io.to(roomCode).emit('room_destroyed', { message: 'Host disconnected' });
          rooms.delete(roomCode);
        } else {
          const playerIndex = room.players.findIndex(p => p.id === socket.id);
          if (playerIndex !== -1) {
            const removedPlayer = room.players.splice(playerIndex, 1)[0];
            console.log(`[Player Left] Room: ${roomCode} | Player: ${removedPlayer?.name}`);
            
            if (room.gameState.buzzedPlayerId === socket.id) {
              room.gameState.buzzedPlayerId = null;
              room.gameState.buzzedAt = null;
              io.to(roomCode).emit('buzz_cleared', room);
            }
            io.to(roomCode).emit('room_updated', room);
          }
        }
      }
    });
  });

  return { app, httpServer, io, rooms };
}

const { app: defaultApp, httpServer: defaultHttpServer, io: defaultIo, rooms: defaultRooms } = createBackendServer();

if (require.main === module) {
  defaultHttpServer.listen(PORT, HOST, () => {
    const localIp = getLocalIpAddress();
    console.log(`\n==================================================`);
    console.log(`🎤 Grab The Mic - Standalone Socket.io Backend`);
    console.log(`==================================================`);
    console.log(`> Ready on Local:   http://localhost:${PORT}`);
    console.log(`> Ready on Network: http://${localIp}:${PORT}`);
    console.log(`> Health Endpoint: http://localhost:${PORT}/health`);
    console.log(`> Rooms Endpoint:  http://localhost:${PORT}/api/rooms`);
    console.log(`==================================================\n`);
  });
}

module.exports = {
  createBackendServer,
  generateRoomCode,
  getMicroseconds,
  app: defaultApp,
  httpServer: defaultHttpServer,
  io: defaultIo,
  rooms: defaultRooms
};
