"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface GameSettings {
  timerDuration: number;
  hintDelay: number;
  categoryFilter: string;
  roomCode?: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface RoomState {
  roomCode: string;
  hostId: string;
  settings: GameSettings;
  players: Player[];
  gameState: {
    status: 'lobby' | 'playing' | 'paused' | 'ended';
    currentTurnIndex: number;
    buzzedPlayerId: string | null;
    timeRemaining: number;
  };
}

export function useSocket() {
  const [connected, setConnected] = useState<boolean>(false);
  const [room, setRoom] = useState<RoomState | null>(null);
  const [buzzedInfo, setBuzzedInfo] = useState<{ playerId: string; playerName: string } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to same origin
    const socket = io({
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("room_updated", (updatedRoom: RoomState) => {
      setRoom(updatedRoom);
    });

    socket.on("game_started", (updatedRoom: RoomState) => {
      setRoom(updatedRoom);
    });

    socket.on("buzzed", (info: { playerId: string; playerName: string }) => {
      setBuzzedInfo(info);
    });

    socket.on("buzz_cleared", (updatedRoom: RoomState) => {
      setBuzzedInfo(null);
      setRoom(updatedRoom);
    });

    socket.on("turn_changed", (updatedRoom: RoomState) => {
      setBuzzedInfo(null);
      setRoom(updatedRoom);
    });

    socket.on("timer_sync", ({ timeRemaining }: { timeRemaining: number }) => {
      setRoom((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          gameState: {
            ...prev.gameState,
            timeRemaining,
          },
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = (settings: Partial<GameSettings>): Promise<{ success: boolean; roomCode?: string; room?: RoomState }> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve({ success: false });
      socketRef.current.emit("create_room", settings, (res: { success: boolean; roomCode?: string; room?: RoomState }) => {
        if (res.success && res.room) {
          setRoom(res.room);
        }
        resolve(res);
      });
    });
  };

  const joinRoom = (roomCode: string, playerName: string): Promise<{ success: boolean; message?: string; room?: RoomState }> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve({ success: false, message: "Socket not connected" });
      socketRef.current.emit("join_room", { roomCode, playerName }, (res: { success: boolean; message?: string; room?: RoomState }) => {
        if (res.success && res.room) {
          setRoom(res.room);
        }
        resolve(res);
      });
    });
  };

  const startGame = (roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("start_game", { roomCode });
    }
  };

  const buzzIn = (roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("buzz_in", { roomCode });
    }
  };

  const clearBuzz = (roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("clear_buzz", { roomCode });
    }
  };

  const updateScore = (roomCode: string, playerId: string, scoreDelta: number) => {
    if (socketRef.current) {
      socketRef.current.emit("update_score", { roomCode, playerId, scoreDelta });
    }
  };

  const syncTimer = (roomCode: string, timeRemaining: number) => {
    if (socketRef.current) {
      socketRef.current.emit("sync_timer", { roomCode, timeRemaining });
    }
  };

  const nextTurn = (roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("next_turn", { roomCode });
    }
  };

  const updateSettings = (roomCode: string, settings: Partial<GameSettings>) => {
    if (socketRef.current) {
      socketRef.current.emit("update_settings", { roomCode, settings });
    }
  };

  return {
    socket: socketRef.current,
    connected,
    room,
    buzzedInfo,
    createRoom,
    joinRoom,
    startGame,
    buzzIn,
    clearBuzz,
    updateScore,
    syncTimer,
    nextTurn,
    updateSettings,
  };
}
