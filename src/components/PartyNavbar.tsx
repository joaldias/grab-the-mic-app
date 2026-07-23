"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mic, Volume2, VolumeX, Home, Settings, RotateCcw } from "lucide-react";
import { audioEngine } from "@/lib/audio";

interface PartyNavbarProps {
  modeName: string;
  onResetGame?: () => void;
}

export const PartyNavbar: React.FC<PartyNavbarProps> = ({ modeName, onResetGame }) => {
  const [soundOn, setSoundOn] = useState(audioEngine.isSoundEnabled());

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    audioEngine.setSoundEnabled(nextState);
  };

  return (
    <header className="w-full bg-slate-900/60 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2 group">
        <Mic className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
        <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
          GRAB THE MIC
        </span>
        <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
          {modeName}
        </span>
      </Link>

      <div className="flex items-center space-x-3">
        {onResetGame && (
          <button
            onClick={onResetGame}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 border border-slate-700"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl border transition-all active:scale-95 ${
            soundOn
              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
              : "bg-slate-800 border-slate-700 text-slate-500"
          }`}
          title={soundOn ? "Mute Sound Effects" : "Enable Sound Effects"}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <Link
          href="/"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 border border-slate-700"
          title="Return to Home"
        >
          <Home className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
