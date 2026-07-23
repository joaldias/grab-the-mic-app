"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, Users, Tv, Smartphone, Target, Globe } from "lucide-react";
import { Language } from "@/components/LanguageSelector";

const LANG_KEY = "gtm_language";

export default function Home() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState<Language>("en");
  const [langReady, setLangReady] = useState(false);

  // Load persisted language on mount
  useEffect(() => {
    const stored = (typeof window !== "undefined" ? localStorage.getItem(LANG_KEY) : null) as Language | null;
    if (stored === "pt" || stored === "en") setSelectedLang(stored);
    setLangReady(true);
  }, []);

  const handleLangSelect = (lang: Language) => {
    setSelectedLang(lang);
    if (typeof window !== "undefined") localStorage.setItem(LANG_KEY, lang);
  };

  const withLang = (href: string) =>
    href.includes("?") ? `${href}&lang=${selectedLang}` : `${href}?lang=${selectedLang}`;

  const isEN = selectedLang === "en";

  const modes = [
    {
      id: "pass",
      name: isEN ? "Pass The Phone" : "Passa o Telemóvel",
      desc: isEN ? "Single device mode for 2 teams" : "Um só dispositivo para 2 equipas",
      icon: <Smartphone className="w-8 h-8 mb-2 text-cyan-400" />,
      link: "/game?mode=pass",
    },
    {
      id: "host",
      name: isEN ? "Host Room (TV / PC)" : "Anfitrião (TV / PC)",
      desc: isEN ? "Launch room code on TV for players" : "Lança código de sala na TV para jogadores",
      icon: <Tv className="w-8 h-8 mb-2 text-purple-400" />,
      link: "/lobby/host",
    },
    {
      id: "player",
      name: isEN ? "Join Game (Mobile)" : "Entrar no Jogo",
      desc: isEN ? "Mobile buzzer for room players" : "Buzzer móvel para jogadores na sala",
      icon: <Users className="w-8 h-8 mb-2 text-pink-400" />,
      link: "/lobby/player",
    },
    {
      id: "practice",
      name: isEN ? "Practice Mode" : "Modo Treino",
      desc: isEN ? "Solo training with song hints" : "Treino individual com dicas de hinos",
      icon: <Target className="w-8 h-8 mb-2 text-emerald-400" />,
      link: "/game?mode=practice",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-slate-950 overflow-hidden relative text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-purple-950/20 to-slate-950 z-0" />

      {/* Header */}
      <div className="z-10 text-center mt-8 mb-8 max-w-2xl w-full">
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
            {isEN
              ? "Christian Edition • The Ultimate Worship Music Party Game"
              : "Edição Cristã • O Jogo de Festa Musical de Adoração Definitivo"}
          </p>

          {/* ─── Language Selector ─── */}
          {langReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-6 flex items-center gap-2 bg-slate-900/80 border border-slate-700 rounded-2xl p-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)]"
            >
              <Globe className="w-4 h-4 text-slate-400 ml-1.5" />
              {([
                { key: "en", flag: "🇺🇸", label: "English" },
                { key: "pt", flag: "🇵🇹", label: "Português" },
              ] as { key: Language; flag: string; label: string; }[]).map((opt) => {
                const active = selectedLang === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleLangSelect(opt.key)}
                    className={`relative px-5 py-2 rounded-xl text-sm font-extrabold transition-all duration-300 flex items-center gap-2 ${
                      active
                        ? "text-slate-950"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="lang-pill"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{opt.flag}</span>
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Game Mode Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 z-10 w-full max-w-6xl my-auto">
        <AnimatePresence mode="wait">
          {modes.map((mode, index) => (
            <motion.div
              key={`${mode.id}-${selectedLang}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                onClick={() => router.push(withLang(mode.link))}
                className="block h-full w-full text-left"
              >
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
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="z-10 py-6 text-center text-xs text-slate-500 font-medium">
        {isEN
          ? "Built with Next.js 14, Socket.io, Web Audio API & iTunes Search API"
          : "Construído com Next.js 14, Socket.io, Web Audio API e Psaltério.net"}
      </footer>
    </main>
  );
}
