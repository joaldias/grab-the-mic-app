"use client";

import React from "react";
import { Sparkles, Shield, Flame, Trophy, Layers } from "lucide-react";
import { Difficulty } from "@/lib/musicData";

export interface LevelOption {
  key: string;
  name: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
}

export const LEVEL_OPTIONS: LevelOption[] = [
  {
    key: "All",
    name: "All Levels",
    badge: "ALL",
    description: "Full mix of all difficulty levels for a balanced party game.",
    icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
    accentColor: "from-cyan-500/20 to-purple-500/20",
    borderColor: "border-cyan-500/50",
  },
  {
    key: "Easy",
    name: "Easy Level",
    badge: "EASY",
    description: "Famous hymns and classic worship choruses known by all ages.",
    icon: <Shield className="w-5 h-5 text-emerald-400" />,
    accentColor: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/50",
  },
  {
    key: "Medium",
    name: "Medium Level",
    badge: "MED",
    description: "Popular contemporary worship hits and standard choir songs.",
    icon: <Layers className="w-5 h-5 text-amber-400" />,
    accentColor: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/50",
  },
  {
    key: "Hard",
    name: "Hard Level",
    badge: "HARD",
    description: "Deep lyric phrases and lesser-known worship lines.",
    icon: <Flame className="w-5 h-5 text-rose-400" />,
    accentColor: "from-rose-500/20 to-red-500/20",
    borderColor: "border-rose-500/50",
  },
  {
    key: "Challenge",
    name: "Challenge Level",
    badge: "EXPERT",
    description: "Theological terms, scripture references, and high-level recall!",
    icon: <Trophy className="w-5 h-5 text-purple-400" />,
    accentColor: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/50",
  },
];

interface LevelSelectorProps {
  selectedLevel: string;
  onSelectLevel: (level: string) => void;
  disabled?: boolean;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  selectedLevel,
  onSelectLevel,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>Difficulty Level</span>
        </label>
        <span className="text-xs text-slate-400 font-medium">
          Select word difficulty
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {LEVEL_OPTIONS.map((level) => {
          const isSelected = selectedLevel === level.key;
          return (
            <button
              key={level.key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectLevel(level.key)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? `bg-gradient-to-r ${level.accentColor} ${level.borderColor} shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-2 ring-cyan-400/50 scale-[1.02]`
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {level.icon}
                  <span className="font-black text-sm text-white">
                    {level.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {level.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
