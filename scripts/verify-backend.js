const http = require('http');
const { io: ioClient } = require('socket.io-client');
const { createBackendServer } = require('../backend/server.js');

async function runBackendVerification() {
  console.log('--------------------------------------------------');
  console.log('🎤 Grab The Mic - Backend & Socket.io Verification');
  console.log('--------------------------------------------------');

  // 1. Spin up backend test server on dynamic port
  const { httpServer, io: ioServer, rooms } = createBackendServer();
  
  const port = await new Promise((resolve) => {
    httpServer.listen(0, '127.0.0.1', () => {
      const addr = httpServer.address();
      resolve(addr.port);
    });
  });

  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`[1/4] Server listening on ${baseUrl}`);

  try {
    // 2. Verify REST HTTP /health endpoint
    console.log('[2/4] Verifying HTTP /health REST endpoint...');
    const healthData = await new Promise((resolve, reject) => {
      http.get(`${baseUrl}/health`, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP health returned status ${res.statusCode}`));
        }
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    if (healthData.status !== 'ok') {
      throw new Error(`Unexpected health payload status: ${healthData.status}`);
    }
    console.log('  ✅ HTTP /health verified successfully:', healthData);

    // 3. Verify REST HTTP /api/rooms endpoint
    const roomsData = await new Promise((resolve, reject) => {
      http.get(`${baseUrl}/api/rooms`, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    if (!roomsData.success) {
      throw new Error('Failed to retrieve /api/rooms');
    }
    console.log('  ✅ HTTP /api/rooms verified successfully:', roomsData);

    // 4. Verify Socket.io Client Handshake & Room Creation / Join Flow
    console.log('[3/4] Testing Socket.io connection handshake & room operations...');
    const clientSocket = ioClient(baseUrl, {
      transports: ['websocket'],
      forceNew: true
    });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Socket.io connection timeout')), 5000);
      clientSocket.on('connect', () => {
        clearTimeout(timeout);
        resolve();
      });
      clientSocket.on('connect_error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    console.log(`  ✅ Socket.io connected. Socket ID: ${clientSocket.id}`);

    // Create Room over Socket.io
    const createRoomRes = await new Promise((resolve) => {
      clientSocket.emit('create_room', { categoryFilter: 'Gospel' }, resolve);
    });

    if (!createRoomRes.success || !createRoomRes.roomCode) {
      throw new Error('Failed to create room via Socket.io');
    }
    console.log(`  ✅ Socket.io create_room verified. Code: ${createRoomRes.roomCode}`);

    // Join Room over Socket.io
    const playerSocket = ioClient(baseUrl, {
      transports: ['websocket'],
      forceNew: true
    });

    await new Promise((resolve) => playerSocket.on('connect', resolve));
    const joinRoomRes = await new Promise((resolve) => {
      playerSocket.emit('join_room', { roomCode: createRoomRes.roomCode, playerName: 'WorshipLeader' }, resolve);
    });

    if (!joinRoomRes.success) {
      throw new Error('Failed to join room via Socket.io');
    }
    console.log(`  ✅ Socket.io join_room verified. Player: ${joinRoomRes.player.name}`);

    // Cleanup
    clientSocket.disconnect();
    playerSocket.disconnect();
    await new Promise((resolve) => ioServer.close(() => httpServer.close(resolve)));

    console.log('[4/4] Cleaned up server & sockets.');
    console.log('--------------------------------------------------');
    console.log('🎉 100% Backend & Socket.io Verification SUCCESS!');
    console.log('--------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('❌ Backend Verification FAILED:', error.message);
    ioServer.close();
    httpServer.close();
    process.exit(1);
  }
}

runBackendVerification();
