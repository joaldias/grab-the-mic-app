const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const os = require('os');
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
let port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

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

// In-memory state for game lobbies
const rooms = new Map();

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Host creates a room (supports 'create_room' and 'host:create-room')
    const handleCreateRoom = (settings, callback) => {
      let roomCode = settings?.roomCode?.toUpperCase()?.trim();
      if (!roomCode || rooms.has(roomCode)) {
        do {
          roomCode = generateRoomCode();
        } while (rooms.has(roomCode));
      }

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
          timeRemaining: settings?.timerDuration || 30
        }
      };

      rooms.set(roomCode, newRoom);
      socket.join(roomCode);
      
      console.log(`Room created: ${roomCode} by host ${socket.id}`);
      
      if (typeof callback === 'function') {
        callback({ success: true, roomCode, room: newRoom });
      }
    };

    socket.on('create_room', handleCreateRoom);
    socket.on('host:create-room', handleCreateRoom);

    // Player joins a room (supports 'join_room' and 'player:join-room')
    const handleJoinRoom = ({ roomCode, playerName, name }, callback) => {
      const code = (roomCode || '').toUpperCase().trim();
      const room = rooms.get(code);

      if (!room) {
        if (typeof callback === 'function') callback({ success: false, message: 'Room not found' });
        return;
      }

      const playerNickname = (playerName || name || '').trim() || `Player ${room.players.length + 1}`;
      
      let player = room.players.find(p => p.id === socket.id);
      if (!player) {
        player = {
          id: socket.id,
          name: playerNickname,
          score: 0
        };
        room.players.push(player);
      } else {
        player.name = playerNickname;
      }

      socket.join(code);
      
      console.log(`[Player Joined] Room: ${code} | Player: ${player.name} (${socket.id})`);

      // Notify host and other players
      io.to(code).emit('room_updated', room);
      io.to(code).emit('player:joined', { player, room });
      
      if (typeof callback === 'function') {
        callback({ success: true, room, player });
      }
    };

    socket.on('join_room', handleJoinRoom);
    socket.on('player:join-room', handleJoinRoom);

    // Host updates settings
    socket.on('update_settings', ({ roomCode, settings }) => {
      const code = (roomCode || '').toUpperCase().trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        room.settings = { ...room.settings, ...settings };
        if (room.gameState.status === 'lobby' && settings.timerDuration) {
          room.gameState.timeRemaining = settings.timerDuration;
        }
        io.to(code).emit('room_updated', room);
      }
    });

    // Start game
    socket.on('start_game', ({ roomCode }) => {
      const code = (roomCode || '').toUpperCase().trim();
      const room = rooms.get(code);
      if (room && room.hostId === socket.id) {
        room.gameState.status = 'playing';
        io.to(code).emit('game_started', room);
      }
    });

    // Player buzzes in ("Grabbed the Mic!")
    const handleBuzzIn = ({ roomCode, playerName }) => {
      const code = (roomCode || '').toUpperCase().trim();
      const room = rooms.get(code);
      if (!room) return;

      if (!room.gameState.buzzedPlayerId) {
        const player = room.players.find(p => p.id === socket.id) || { id: socket.id, name: playerName || 'Player' };
        room.gameState.buzzedPlayerId = socket.id;
        
        io.to(code).emit('buzzed', { playerId: socket.id, playerName: player.name });
        io.to(code).emit('player:buzz', { playerId: socket.id, playerName: player.name });
      }
    };

    socket.on('buzz_in', handleBuzzIn);
    socket.on('player:buzz', handleBuzzIn);

    // Host clears buzz
    socket.on('clear_buzz', ({ roomCode }) => {
       const room = rooms.get(roomCode);
       if (room && room.hostId === socket.id) {
         room.gameState.buzzedPlayerId = null;
         io.to(roomCode).emit('buzz_cleared', room);
       }
    });

    // Host updates score
    socket.on('update_score', ({ roomCode, playerId, scoreDelta }) => {
      const room = rooms.get(roomCode);
      if (room && room.hostId === socket.id) {
        const player = room.players.find(p => p.id === playerId);
        if (player) {
          player.score += scoreDelta;
          io.to(roomCode).emit('room_updated', room);
        }
      }
    });
    
    // Timer sync from host
    socket.on('sync_timer', ({ roomCode, timeRemaining }) => {
      const room = rooms.get(roomCode);
      if (room && room.hostId === socket.id) {
        room.gameState.timeRemaining = timeRemaining;
        socket.to(roomCode).emit('timer_sync', { timeRemaining });
      }
    });

    // Next turn
    socket.on('next_turn', ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (room && room.hostId === socket.id) {
        room.gameState.currentTurnIndex = (room.gameState.currentTurnIndex + 1) % Math.max(1, room.players.length);
        room.gameState.buzzedPlayerId = null;
        room.gameState.timeRemaining = room.settings.timerDuration;
        io.to(roomCode).emit('turn_changed', room);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // Clean up rooms
      for (const [roomCode, room] of rooms.entries()) {
        if (room.hostId === socket.id) {
          // Host left, notify and destroy room
          io.to(roomCode).emit('room_destroyed', { message: 'Host disconnected' });
          rooms.delete(roomCode);
        } else {
          const playerIndex = room.players.findIndex(p => p.id === socket.id);
          if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);
            if (room.gameState.buzzedPlayerId === socket.id) {
               room.gameState.buzzedPlayerId = null;
               io.to(roomCode).emit('buzz_cleared', room);
            }
            io.to(roomCode).emit('room_updated', room);
          }
        }
      }
    });
  });

  httpServer.listen(port, '0.0.0.0', () => {
    const localIp = getLocalIpAddress();
    console.log(`> Ready on Local:   http://localhost:${port}`);
    console.log(`> Ready on Network: http://${localIp}:${port}`);
  });
});
