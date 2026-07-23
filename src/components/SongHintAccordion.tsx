"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Play, Pause, Music, ExternalLink, RefreshCw, Volume2 } from "lucide-react";
import { SongHint } from "@/lib/musicData";
import { fetchSongHintsWithFallback } from "@/lib/itunes";

interface SongHintAccordionProps {
  word: string;
  autoRevealDelaySeconds?: number;
  timeRemaining: number;
  totalTime: number;
}

export const SongHintAccordion: React.FC<SongHintAccordionProps> = ({
  word,
  autoRevealDelaySeconds = 10,
  timeRemaining,
  totalTime,
}) => {
  const [hints, setHints] = useState<SongHint[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-reveal hints when elapsed time exceeds autoRevealDelaySeconds
  const elapsedTime = totalTime - timeRemaining;
  const isAutoUnlocked = elapsedTime >= autoRevealDelaySeconds;

  useEffect(() => {
    let isMounted = true;
    async function loadHints() {
      setLoading(true);
      const songHints = await fetchSongHintsWithFallback(word, { maxResults: 3, enableItunes: true });
      if (isMounted) {
        setHints(songHints);
        setLoading(false);
      }
    }
    loadHints();

    return () => {
      isMounted = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [word]);

  const toggleAudio = (song: SongHint) => {
    if (!song.previewUrl) return;

    if (playingSongId === song.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingSongId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(song.previewUrl);
      audioRef.current.play().catch((e) => console.warn("Audio playback failed:", e));
      audioRef.current.onended = () => setPlayingSongId(null);
      setPlayingSongId(song.id);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-lg overflow-hidden">
        {/* Accordion Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 px-6 text-left hover:bg-slate-800/50 transition-colors focus:outline-none"
        >
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white text-base">
              Need a Song Hint?
            </span>
            {isAutoUnlocked && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                Unlocked
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-cyan-400">
            {isOpen ? "Hide Hints ▲" : "Show Hints ▼"}
          </span>
        </button>

        {/* Accordion Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 border-t border-slate-800 bg-slate-950/60"
            >
              {!isAutoUnlocked && !isOpen ? (
                <p className="text-sm text-slate-400 italic text-center">
                  Hint unlocks in {Math.max(0, autoRevealDelaySeconds - elapsedTime)} seconds...
                </p>
              ) : loading ? (
                <div className="flex items-center justify-center py-4 text-cyan-400 text-sm font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  Fetching song recommendations...
                </div>
              ) : (
                <div className="space-y-3">
                  {hints.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        {song.artworkUrl ? (
                          <img
                            src={song.artworkUrl}
                            alt={song.title}
                            className="w-12 h-12 rounded-lg object-cover border border-slate-600 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <Music className="w-6 h-6 text-cyan-400" />
                          </div>
                        )}
                        <div className="truncate">
                          <h4 className="font-bold text-white text-sm truncate">
                            {song.title}
                          </h4>
                          <p className="text-xs text-cyan-200/70 truncate">
                            {song.artist} ({song.year})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                        {song.previewUrl && (
                          <button
                            onClick={() => toggleAudio(song)}
                            className="p-2 rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 border border-cyan-500/40 transition-transform active:scale-95"
                            title={playingSongId === song.id ? "Pause Preview" : "Play 30s Audio Preview"}
                          >
                            {playingSongId === song.id ? (
                              <Pause className="w-4 h-4 text-rose-400 animate-pulse" />
                            ) : (
                              <Play className="w-4 h-4 text-cyan-300" />
                            )}
                          </button>
                        )}
                        {song.trackViewUrl && (
                          <a
                            href={song.trackViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            title="View on Apple Music"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
