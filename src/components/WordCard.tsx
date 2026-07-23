"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldAlert, Zap, Flame, Award } from "lucide-react";
import { Difficulty, WordEntry } from "@/lib/musicData";

interface WordCardProps {
  wordEntry: WordEntry;
  onNextWord?: () => void;
  disabled?: boolean;
}

export const WordCard: React.FC<WordCardProps> = ({ wordEntry, onNextWord, disabled }) => {
  const getDifficultyBadge = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Easy":
        return {
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: <Sparkles className="w-4 h-4 mr-1 text-emerald-400" />,
        };
      case "Medium":
        return {
          bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
          icon: <Zap className="w-4 h-4 mr-1 text-cyan-400" />,
        };
      case "Hard":
        return {
          bg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          icon: <Flame className="w-4 h-4 mr-1 text-purple-400" />,
        };
      case "Challenge":
        return {
          bg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: <Award className="w-4 h-4 mr-1 text-rose-400 animate-pulse" />,
        };
      default:
        return {
          bg: "bg-slate-500/20 text-slate-300 border-slate-500/40",
          icon: <ShieldAlert className="w-4 h-4 mr-1" />,
        };
    }
  };

  const badge = getDifficultyBadge(wordEntry.difficulty);

  return (
    <motion.div
      key={wordEntry.id}
      initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
      animate={{ scale: 1, opacity: 1, rotateY: 0 }}
      exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative group p-8 md:p-10 rounded-3xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_35px_rgba(0,240,255,0.15)] flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Shimmer background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6 z-10">
          <span className={`flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.bg}`}>
            {badge.icon}
            {wordEntry.difficulty}
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800/90 text-cyan-200/80 border border-slate-700">
            {wordEntry.category}
          </span>
        </div>

        {/* Main Worship Word */}
        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 tracking-tight z-10 mb-4 py-2 drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]">
          {wordEntry.word}
        </h2>

        <p className="text-sm text-cyan-100/70 font-medium z-10">
          Sing or quote a worship song containing this exact word!
        </p>

        {onNextWord && (
          <button
            onClick={onNextWord}
            disabled={disabled}
            className="mt-6 z-10 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 text-sm font-semibold border border-cyan-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            Skip Word ➔
          </button>
        )}
      </div>
    </motion.div>
  );
};
