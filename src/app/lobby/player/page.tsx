"use client";

import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Mic, Zap, CheckCircle2, User, KeyRound } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { audioEngine } from "@/lib/audio";

function PlayerContent() {
  const { connected, room, buzzedInfo, joinRoom, buzzIn } = useSocket();
  const [roomCodeInput, setRoomCodeInput] = useState<string>("");
  const [playerNameInput, setPlayerNameInput] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!roomCodeInput.trim()) {
      setErrorMsg("Please enter a 4-letter room code.");
      return;
    }

    const res = await joinRoom(roomCodeInput.trim().toUpperCase(), playerNameInput.trim());
    if (res.success) {
      setJoined(true);
    } else {
      setErrorMsg(res.message || "Could not join room. Check code.");
    }
  };

  const handleBuzz = () => {
    if (room?.roomCode) {
      audioEngine.playMicGrab();
      buzzIn(room.roomCode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 overflow-hidden relative select-none">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-950/30 via-slate-950 to-slate-950 pointer-events-none"></div>

      <header className="w-full text-center py-4 z-10 border-b border-slate-900 flex items-center justify-center space-x-2">
        <Mic className="w-6 h-6 text-pink-500 animate-pulse" />
        <span className="font-extrabold text-xl tracking-tight text-white">
          GRAB THE MIC
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-md mx-auto py-6">
        {!joined ? (
          /* Join Room Form */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full p-8 rounded-3xl bg-slate-900/90 border border-pink-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(255,0,127,0.2)] text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center mx-auto">
              <KeyRound className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              Join Party Room
            </h2>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-extrabold text-pink-400 tracking-wider text-left mb-1.5">
                  4-Letter Room Code
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="ABCD"
                  className="w-full text-center py-3 text-3xl font-black font-mono uppercase bg-slate-950 border border-slate-700 rounded-xl focus:border-pink-500 focus:outline-none tracking-widest text-pink-300 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold text-cyan-400 tracking-wider text-left mb-1.5">
                  Your Name / Team
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  placeholder="e.g. Worship Squad"
                  className="w-full text-center py-3 text-lg font-bold bg-slate-950 border border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none text-cyan-200 placeholder-slate-600"
                />
              </div>

              {errorMsg && (
                <p className="text-xs font-semibold text-rose-400 bg-rose-950/60 p-2.5 rounded-lg border border-rose-500/40">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-slate-950 font-black text-lg shadow-[0_0_25px_rgba(255,0,127,0.5)] transition-all active:scale-95 min-h-[48px]"
              >
                ENTER GAME LOBBY ➔
              </button>
            </form>
          </motion.div>
        ) : (
          /* Live Mobile Buzzer Controller */
          <div className="w-full flex flex-col items-center justify-center space-y-6 my-auto text-center">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md w-full">
              <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-widest block">
                CONNECTED TO ROOM
              </span>
              <span className="text-2xl font-mono font-black text-white">
                {room?.roomCode}
              </span>
            </div>

            {/* Giant Mobile Buzzer Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleBuzz}
              disabled={room?.gameState.status !== 'playing'}
              className={`w-64 h-64 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center p-6 border-4 shadow-2xl transition-all ${
                room?.gameState.status === 'playing'
                  ? "bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500 border-pink-300 shadow-[0_0_60px_rgba(255,0,127,0.8)] cursor-pointer animate-pulse-glow"
                  : "bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed"
              }`}
            >
              <Mic className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-2" />
              <span className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase drop-shadow-md">
                GRAB THE MIC!
              </span>
              <span className="text-xs font-semibold text-pink-200 mt-1 uppercase tracking-wider">
                {room?.gameState.status === 'playing' ? "TAP TO BUZZ IN" : "WAITING FOR TURN"}
              </span>
            </motion.button>

            {buzzedInfo && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 rounded-2xl bg-pink-950/80 border border-pink-500/50 text-pink-300 font-extrabold text-base w-full shadow-lg"
              >
                🎤 {buzzedInfo.playerName} Buzz In Recorded!
              </motion.div>
            )}
          </div>
        )}
      </main>

      <footer className="w-full text-center py-3 text-xs text-slate-500 font-medium z-10 border-t border-slate-900">
        Mobile Buzzer Client • Tap as soon as you know the worship song!
      </footer>
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-pink-400">Loading Buzzer...</div>}>
      <PlayerContent />
    </Suspense>
  );
}
