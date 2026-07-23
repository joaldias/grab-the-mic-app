"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Plus, Minus, Flame, UserCheck } from "lucide-react";

export interface PlayerScore {
  id: string;
  name: string;
  score: number;
}

interface ScoreboardProps {
  players: PlayerScore[];
  currentTurnIndex?: number;
  onUpdateScore?: (playerId: string, delta: number) => void;
  interactive?: boolean;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  players,
  currentTurnIndex = 0,
  onUpdateScore,
  interactive = true,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto my-4">
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Scoreboard
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {players.length} Teams / Players
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {players.map((player, idx) => {
            const isActive = idx === currentTurnIndex;
            return (
              <motion.div
                key={player.id}
                whileHover={{ scale: 1.02 }}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border-cyan-500/80 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    : "bg-slate-800/50 border-slate-700/60 opacity-90"
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 animate-pulse"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {isActive ? <UserCheck className="w-4 h-4" /> : `#${idx + 1}`}
                  </div>
                  <div className="truncate">
                    <h4 className={`text-sm font-bold truncate ${isActive ? "text-cyan-300" : "text-white"}`}>
                      {player.name}
                    </h4>
                    {isActive && (
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-cyan-400">
                        Current Turn
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black font-mono text-amber-300 px-2">
                    {player.score}
                  </span>

                  {interactive && onUpdateScore && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onUpdateScore(player.id, 1)}
                        className="p-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/40 transition-all active:scale-90"
                        title="Add Point (+1)"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onUpdateScore(player.id, -1)}
                        className="p-1 rounded-md bg-rose-500/20 hover:bg-rose-500/40 text-rose-400 border border-rose-500/40 transition-all active:scale-90"
                        title="Subtract Point (-1)"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
