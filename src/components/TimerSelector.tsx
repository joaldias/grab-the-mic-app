"use client";

import React from "react";
import { Zap, Timer, Smile, Hourglass } from "lucide-react";

export interface TimerOption {
  duration: number;
  name: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  borderColor: string;
}

export const TIMER_PRESETS: TimerOption[] = [
  {
    duration: 15,
    name: "Blitz Mode",
    badge: "15s",
    description: "High intensity! Rapid song recall for experienced worship leaders.",
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    accentColor: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/50",
  },
  {
    duration: 30,
    name: "Standard Mode",
    badge: "30s",
    description: "Balanced timing for standard group party game nights.",
    icon: <Timer className="w-5 h-5 text-cyan-400" />,
    accentColor: "from-cyan-500/20 to-teal-500/20",
    borderColor: "border-cyan-500/50",
  },
  {
    duration: 45,
    name: "Relaxed Mode",
    badge: "45s",
    description: "Extra time for family groups, kids worship, or casual play.",
    icon: <Smile className="w-5 h-5 text-emerald-400" />,
    accentColor: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/50",
  },
  {
    duration: 60,
    name: "Marathon Mode",
    badge: "60s",
    description: "Maximum time to search memories, think, and sing full choruses.",
    icon: <Hourglass className="w-5 h-5 text-purple-400" />,
    accentColor: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/50",
  },
];

interface TimerSelectorProps {
  selectedDuration: number;
  onSelectDuration: (duration: number) => void;
  disabled?: boolean;
}

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  selectedDuration,
  onSelectDuration,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider flex items-center gap-1.5">
          <Timer className="w-4 h-4" />
          <span>Timer Preset</span>
        </label>
        <span className="text-xs text-slate-400 font-medium">
          Select round duration
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TIMER_PRESETS.map((preset) => {
          const isSelected = selectedDuration === preset.duration;
          return (
            <button
              key={preset.duration}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDuration(preset.duration)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? `bg-gradient-to-r ${preset.accentColor} ${preset.borderColor} shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-2 ring-cyan-400/50 scale-[1.02]`
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {preset.icon}
                  <span className="font-black text-sm text-white">
                    {preset.name}
                  </span>
                </div>
                <span
                  className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  {preset.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300/80 leading-relaxed font-medium">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
