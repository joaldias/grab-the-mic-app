"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mic, Users, Tv, Smartphone, Target } from "lucide-react";

export default function Home() {
  const modes = [
    {
      id: "pass",
      name: "Pass The Phone",
      desc: "Single device mode for 2 teams",
      icon: <Smartphone className="w-8 h-8 mb-2 text-cyan-400" />,
      link: "/game?mode=pass",
    },
    {
      id: "host",
      name: "Host Room (TV / PC)",
      desc: "Launch room code on TV for players",
      icon: <Tv className="w-8 h-8 mb-2 text-purple-400" />,
      link: "/lobby/host",
    },
    {
      id: "player",
      name: "Join Game (Mobile)",
      desc: "Mobile buzzer for room players",
      icon: <Users className="w-8 h-8 mb-2 text-pink-400" />,
      link: "/lobby/player",
    },
    {
      id: "practice",
      name: "Practice Mode",
      desc: "Solo training with iTunes song hints",
      icon: <Target className="w-8 h-8 mb-2 text-emerald-400" />,
      link: "/game?mode=practice",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-slate-950 overflow-hidden relative text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-purple-950/20 to-slate-950 z-0"></div>

      <div className="z-10 text-center mt-8 mb-10 max-w-2xl">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
            <Mic className="w-16 h-16 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.6)]">
            GRAB THE MIC!
          </h1>
          <p className="mt-3 text-cyan-200/80 text-sm md:text-base font-extrabold tracking-widest uppercase">
            Christian Edition • The Ultimate Worship Music Party Game
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 z-10 w-full max-w-6xl my-auto">
        {modes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            <Link href={mode.link} className="block h-full">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-300 group cursor-pointer h-full min-h-[220px] active:scale-95 shadow-xl">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  {mode.icon}
                </motion.div>
                <h2 className="text-xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors text-center">
                  {mode.name}
                </h2>
                <p className="text-xs text-slate-400 text-center font-medium">
                  {mode.desc}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <footer className="z-10 py-6 text-center text-xs text-slate-500 font-medium">
        Built with Next.js 14, Socket.io, Web Audio API & iTunes Search API
      </footer>
    </main>
  );
}
