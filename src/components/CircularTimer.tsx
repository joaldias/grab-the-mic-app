"use client";

import React from "react";
import { motion } from "framer-motion";

interface CircularTimerProps {
  timeRemaining: number;
  totalTime: number;
  isPaused?: boolean;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  timeRemaining,
  totalTime,
  isPaused = false,
}) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, timeRemaining / totalTime));
  const strokeDashoffset = circumference - progress * circumference;

  // Determine timer color theme based on time remaining
  let gradientId = "cyanGradient";
  let textColor = "text-cyan-300";
  let shadowColor = "drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]";

  if (timeRemaining <= 5) {
    gradientId = "redGradient";
    textColor = "text-rose-500 animate-pulse";
    shadowColor = "drop-shadow-[0_0_20px_rgba(244,63,94,0.9)]";
  } else if (timeRemaining <= 10) {
    gradientId = "amberGradient";
    textColor = "text-amber-400";
    shadowColor = "drop-shadow-[0_0_15px_rgba(251,191,36,0.7)]";
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
        <defs>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#9d4edd" />
          </linearGradient>
          <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="12"
          fill="transparent"
        />

        {/* Progress Circle */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="14"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "linear" }}
          className={shadowColor}
        />
      </svg>

      {/* Digital Timer Overlay */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-6xl font-black tracking-tighter font-mono ${textColor}`}>
          {timeRemaining}
        </span>
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">
          {isPaused ? "PAUSED" : "SECONDS"}
        </span>
      </div>
    </div>
  );
};
