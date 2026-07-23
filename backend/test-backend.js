const { io: ioClient } = require('socket.io-client');
const assert = require('assert');

const SERVER_URL = 'http://localhost:3001';

async function runTests() {
  console.log('🧪 Starting Backend & Socket.io Automated Test Suite...\n');

  // Test 1: REST API /health
  console.log('1. Testing GET /health...');
  const healthRes = await fetch(`${SERVER_URL}/health`);
  const healthData = await healthRes.json();
  assert.strictEqual(healthRes.status, 200);
  assert.strictEqual(healthData.status, 'ok');
  assert.strictEqual(typeof healthData.activeRooms, 'number');
  assert.strictEqual(typeof healthData.playersCount, 'number');
  console.log('   ✅ GET /health passed:', healthData);

  // Test 2: REST API /api/rooms
  console.log('2. Testing GET /api/rooms...');
  const roomsRes = await fetch(`${SERVER_URL}/api/rooms`);
  const roomsData = await roomsRes.json();
  assert.strictEqual(roomsRes.status, 200);
  assert.strictEqual(roomsData.success, true);
  assert(Array.isArray(roomsData.rooms));
  console.log('   ✅ GET /api/rooms passed. Count:', roomsData.count);

  // Test 3: Socket.io Room Creation (Host)
  console.log('3. Testing Socket.io create_room...');
  const hostSocket = ioClient(SERVER_URL);
  
  await new Promise((resolve) => hostSocket.on('connect', resolve));
  console.log('   Host connected with ID:', hostSocket.id);

  const createRoomRes = await new Promise((resolve) => {
    hostSocket.emit('create_room', { timerDuration: 30, categoryFilter: 'Gospel' }, resolve);
  });

  assert.strictEqual(createRoomRes.success, true);
  assert.strictEqual(createRoomRes.roomCode.length, 4);
  assert.strictEqual(createRoomRes.roomCode, createRoomRes.roomCode.toUpperCase());
  const roomCode = createRoomRes.roomCode;
  console.log('   ✅ create_room passed. Created Room Code:', roomCode);

  // Test 4: Player 1 Joining
  console.log('4. Testing Player 1 join_room...');
  const p1Socket = ioClient(SERVER_URL);
  await new Promise((resolve) => p1Socket.on('connect', resolve));

  const p1JoinRes = await new Promise((resolve) => {
    p1Socket.emit('join_room', { roomCode, playerName: 'Miriam' }, resolve);
  });

  assert.strictEqual(p1JoinRes.success, true);
  assert.strictEqual(p1JoinRes.player.name, 'Miriam');
  console.log('   ✅ Player 1 joined as Miriam');

  // Test 5: Duplicate Nickname Handling
  console.log('5. Testing duplicate nickname handling...');
  const p2Socket = ioClient(SERVER_URL);
  await new Promise((resolve) => p2Socket.on('connect', resolve));

  const p2JoinRes = await new Promise((resolve) => {
    p2Socket.emit('join_room', { roomCode, playerName: 'Miriam' }, resolve);
  });

  assert.strictEqual(p2JoinRes.success, true);
  assert.strictEqual(p2JoinRes.player.name, 'Miriam (2)');
  console.log('   ✅ Duplicate nickname handled correctly as:', p2JoinRes.player.name);

  // Test 6: Start Game
  console.log('6. Testing start_game...');
  const gameStartedPromise = new Promise((resolve) => {
    p1Socket.on('game_started', resolve);
  });
  hostSocket.emit('start_game', { roomCode });
  const startedRoomState = await gameStartedPromise;
  assert.strictEqual(startedRoomState.gameState.status, 'playing');
  console.log('   ✅ Game started state verified');

  // Test 7: Microsecond Buzz-in Race Condition Lock
  console.log('7. Testing microsecond buzz_in locking...');
  const buzzPromise = new Promise((resolve) => {
    hostSocket.on('buzzed', resolve);
  });

  // Emit buzz from both player sockets simultaneously
  p1Socket.emit('buzz_in', { roomCode });
  p2Socket.emit('buzz_in', { roomCode });

  const buzzedData = await buzzPromise;
  assert(buzzedData.playerId === p1Socket.id || buzzedData.playerId === p2Socket.id);
  assert(typeof buzzedData.timestamp === 'number');
  console.log(`   ✅ Buzz locked by ${buzzedData.playerName} (${buzzedData.playerId}) at microsecond timestamp ${buzzedData.timestamp}`);

  // Test 8: Host Clear Buzz
  console.log('8. Testing clear_buzz...');
  const clearBuzzPromise = new Promise((resolve) => {
    p1Socket.on('buzz_cleared', resolve);
  });
  hostSocket.emit('clear_buzz', { roomCode });
  const clearedState = await clearBuzzPromise;
  assert.strictEqual(clearedState.gameState.buzzedPlayerId, null);
  console.log('   ✅ Buzz cleared successfully');

  // Test 9: Host Score Update
  console.log('9. Testing update_score...');
  const scoreUpdatePromise = new Promise((resolve) => {
    p1Socket.on('room_updated', resolve);
  });
  hostSocket.emit('update_score', { roomCode, playerId: p1Socket.id, scoreDelta: 10 });
  const updatedRoom = await scoreUpdatePromise;
  const p1 = updatedRoom.players.find(p => p.id === p1Socket.id);
  assert.strictEqual(p1.score, 10);
  console.log('   ✅ Score updated: Miriam now has', p1.score, 'points');

  // Test 10: Timer Sync
  console.log('10. Testing sync_timer...');
  const timerPromise = new Promise((resolve) => {
    p1Socket.on('timer_sync', resolve);
  });
  hostSocket.emit('sync_timer', { roomCode, timeRemaining: 18 });
  const timerData = await timerPromise;
  assert.strictEqual(timerData.timeRemaining, 18);
  console.log('   ✅ Timer synced: 18 seconds remaining');

  // Test 11: Host Disconnect & Automatic Room Cleanup
  console.log('11. Testing automatic room cleanup on host disconnect...');
  const destroyedPromise = new Promise((resolve) => {
    p1Socket.on('room_destroyed', resolve);
  });
  hostSocket.disconnect();
  const destroyEvent = await destroyedPromise;
  assert.strictEqual(destroyEvent.message, 'Host disconnected');
  console.log('   ✅ Room destroyed notification received by player');

  // Check health endpoint again
  const postHealthRes = await fetch(`${SERVER_URL}/health`);
  const postHealthData = await postHealthRes.json();
  assert.strictEqual(postHealthData.activeRooms, 0);
  console.log('   ✅ REST /health confirms 0 active rooms remaining after cleanup');

  p1Socket.disconnect();
  p2Socket.disconnect();

  console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! Standalone Backend is fully operational.\n');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
