"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Tv, Play, CheckCircle, RotateCcw, Volume2, ShieldAlert, Sparkles, Mic } from "lucide-react";

import { useSocket } from "@/hooks/useSocket";
import { getRandomWord, WordEntry } from "@/lib/musicData";
import { audioEngine } from "@/lib/audio";
import { CircularTimer } from "@/components/CircularTimer";
import { WordCard } from "@/components/WordCard";
import { SongHintAccordion } from "@/components/SongHintAccordion";
import { Scoreboard } from "@/components/Scoreboard";
import { PartyNavbar } from "@/components/PartyNavbar";

function HostContent() {
  const router = useRouter();
  const {
    connected,
    room,
    buzzedInfo,
    createRoom,
    startGame,
    clearBuzz,
    updateScore,
    syncTimer,
    nextTurn,
    updateSettings,
  } = useSocket();

  const [roomCode, setRoomCode] = useState<string>("");
  const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [usedWordIds, setUsedWordIds] = useState<Set<string>>(new Set());
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  // Initialize Host Room
  useEffect(() => {
    if (connected && !roomCode) {
      createRoom({ timerDuration: 30, categoryFilter: "All" }).then((res) => {
        if (res.success && res.roomCode) {
          setRoomCode(res.roomCode);
        }
      });
    }
  }, [connected]);

  // Load new word when game starts or turns change
  useEffect(() => {
    if ((isGameStarted || room?.gameState.status === 'playing') && !currentWord) {
      const word = getRandomWord(Array.from(usedWordIds), categoryFilter as any);
      if (word) {
        setCurrentWord(word);
        setUsedWordIds((prev) => new Set(prev).add(word.id));
      }
    }
  }, [room?.gameState.status, isGameStarted]);

  // Handle buzzer SFX
  useEffect(() => {
    if (buzzedInfo) {
      audioEngine.playMicGrab();
    }
  }, [buzzedInfo]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    const word = getRandomWord(Array.from(usedWordIds), categoryFilter as any);
    if (word) {
      setCurrentWord(word);
      setUsedWordIds((prev) => new Set(prev).add(word.id));
    }
    if (roomCode) {
      startGame(roomCode);
    }
  };

  const handleNextTurn = () => {
    if (!roomCode) return;
    const nextWord = getRandomWord(Array.from(usedWordIds), categoryFilter as any);
    if (nextWord) {
      setCurrentWord(nextWord);
      setUsedWordIds((prev) => new Set(prev).add(nextWord.id));
    }
    nextTurn(roomCode);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950 to-slate-950 pointer-events-none"></div>

      <PartyNavbar modeName="Host TV Screen" />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 flex flex-col items-center justify-between z-10 space-y-6">
        {!isGameStarted && (!room || room.gameState.status === 'lobby') ? (
          /* Host Lobby Screen */
          <div className="w-full flex flex-col items-center justify-center text-center space-y-8 my-auto py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 md:p-12 rounded-3xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,240,255,0.2)] max-w-xl w-full"
            >
              <Tv className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-pulse" />
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                JOIN ON MOBILE
              </h1>

              <div className="my-6 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30">
                <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-widest block mb-2">
                  ROOM CODE
                </span>
                <span className="text-6xl md:text-7xl font-black tracking-widest text-cyan-300 font-mono drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">
                  {roomCode || "----"}
                </span>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-sm text-cyan-100/80">
                  Players visit <span className="font-mono text-cyan-300 font-bold">/lobby/player</span> on their mobile browser or Expo Go to enter this code.
                </p>
                <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs font-semibold">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>{room?.players.length || 0} Player(s) Joined</span>
                </div>
              </div>

              {/* Connected Players Grid */}
              <div className="grid grid-cols-2 gap-2 mb-8 max-h-36 overflow-y-auto">
                {room?.players.map((player) => (
                  <div
                    key={player.id}
                    className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-cyan-200 text-sm font-bold truncate flex items-center justify-center space-x-2"
                  >
                    <Mic className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">{player.name}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 font-black text-xl shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all active:scale-95 flex items-center justify-center space-x-3 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>START PARTY GAME</span>
              </button>
            </motion.div>
          </div>
        ) : (
          /* Host Playing Game View */
          <div className="w-full flex flex-col items-center space-y-6">
            {/* Buzzer Alert Banner */}
            <AnimatePresence>
              {buzzedInfo && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="w-full p-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white text-center shadow-[0_0_40px_rgba(255,0,127,0.8)] border border-pink-400 z-30"
                >
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase animate-bounce">
                    🎤 {buzzedInfo.playerName} GRABBED THE MIC!
                  </h2>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <button
                      onClick={() => {
                        updateScore(roomCode, buzzedInfo.playerId, 1);
                        clearBuzz(roomCode);
                        handleNextTurn();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-extrabold text-base hover:bg-emerald-300 transition-all"
                    >
                      Correct (+1 Pt)
                    </button>
                    <button
                      onClick={() => clearBuzz(roomCode)}
                      className="px-6 py-2.5 rounded-xl bg-slate-900/80 text-rose-300 font-extrabold text-base hover:bg-slate-900 transition-all border border-rose-500/50"
                    >
                      Clear Buzz ✖
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Scoreboard
              players={room?.players || []}
              currentTurnIndex={room?.gameState?.currentTurnIndex || 0}
              onUpdateScore={(id, delta) => updateScore(roomCode, id, delta)}
            />

            <CircularTimer
              timeRemaining={room?.gameState?.timeRemaining ?? 30}
              totalTime={room?.settings?.timerDuration ?? 30}
            />

            {currentWord && <WordCard wordEntry={currentWord} />}

            <button
              onClick={handleNextTurn}
              className="px-8 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-cyan-500/40 transition-all active:scale-95"
            >
              Next Word / Turn ➔
            </button>

            {currentWord && (
              <SongHintAccordion
                word={currentWord.word}
                timeRemaining={room?.gameState?.timeRemaining ?? 30}
                totalTime={room?.settings?.timerDuration ?? 30}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function HostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">Loading Host Screen...</div>}>
      <HostContent />
    </Suspense>
  );
}
