"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, CheckCircle, XCircle, RotateCcw, Award, Play, Pause, FastForward } from "lucide-react";

import { getRandomWord, WordEntry, Difficulty } from "@/lib/musicData";
import { audioEngine } from "@/lib/audio";
import { CircularTimer } from "@/components/CircularTimer";
import { WordCard } from "@/components/WordCard";
import { SongHintAccordion } from "@/components/SongHintAccordion";
import { Scoreboard, PlayerScore } from "@/components/Scoreboard";
import { CountdownOverlay } from "@/components/CountdownOverlay";
import { PartyNavbar } from "@/components/PartyNavbar";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get("mode") || "pass";

  // Game Settings & State
  const [timerDuration, setTimerDuration] = useState<number>(30);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [showCountdown, setShowCountdown] = useState<boolean>(true);
  const [gameState, setGameState] = useState<"ready" | "playing" | "buzz" | "timeout" | "ended">("ready");
  
  const [timeRemaining, setTimeRemaining] = useState<number>(30);
  const [usedWordIds, setUsedWordIds] = useState<Set<string>>(new Set());
  const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);

  // Scoreboard / Turn state
  const [players, setPlayers] = useState<PlayerScore[]>([
    { id: "team-1", name: "Team Red", score: 0 },
    { id: "team-2", name: "Team Blue", score: 0 },
  ]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);

  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize first word
  useEffect(() => {
    const word = getRandomWord(Array.from(usedWordIds), selectedDifficulty as Difficulty | "All");
    if (word) {
      setCurrentWord(word);
      setUsedWordIds((prev) => new Set(prev).add(word.id));
    }
  }, [selectedDifficulty]);

  // Main Timer Loop
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            audioEngine.playBuzzer();
            setGameState("timeout");
            return 0;
          }
          const nextTime = prev - 1;
          audioEngine.playTickingClock(nextTime);
          return nextTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Handle countdown complete
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameState("playing");
  };

  // Skip or load next word
  const nextTurnWord = (changeTurn: boolean = true) => {
    const nextWord = getRandomWord(Array.from(usedWordIds), selectedDifficulty as Difficulty | "All");
    if (nextWord) {
      setCurrentWord(nextWord);
      setUsedWordIds((prev) => new Set(prev).add(nextWord.id));
    }

    setTimeRemaining(timerDuration);
    if (changeTurn && mode === "pass") {
      setCurrentTurnIndex((prev) => (prev + 1) % players.length);
    }
    setShowCountdown(true);
    setGameState("ready");
  };

  // Award Point
  const handleAwardPoint = (scoreDelta: number) => {
    if (mode === "pass") {
      const activePlayer = players[currentTurnIndex];
      handleUpdateScore(activePlayer.id, scoreDelta);
    }
    if (scoreDelta > 0) {
      audioEngine.playVictory();
    } else {
      audioEngine.playBuzzer();
    }
    nextTurnWord(true);
  };

  // Update specific player score
  const handleUpdateScore = (playerId: string, delta: number) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, score: Math.max(0, p.score + delta) } : p))
    );
  };

  // Reset Game
  const handleResetGame = () => {
    setPlayers([
      { id: "team-1", name: "Team Red", score: 0 },
      { id: "team-2", name: "Team Blue", score: 0 },
    ]);
    setUsedWordIds(new Set());
    setCurrentTurnIndex(0);
    setTimeRemaining(timerDuration);
    setShowCountdown(true);
    setGameState("ready");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden relative">
      {/* Background Gradient Ambient Light */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-slate-950 to-slate-950 pointer-events-none"></div>

      <PartyNavbar
        modeName={mode === "pass" ? "Pass The Phone" : "Practice Mode"}
        onResetGame={handleResetGame}
      />

      {/* 3s Countdown Overlay */}
      {showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} countFrom={3} />}

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col items-center justify-between z-10 space-y-6">
        {/* Scoreboard (Only in Pass-the-Phone mode) */}
        {mode === "pass" && (
          <Scoreboard
            players={players}
            currentTurnIndex={currentTurnIndex}
            onUpdateScore={handleUpdateScore}
          />
        )}

        {/* Circular Countdown Timer */}
        <div className="my-2">
          <CircularTimer
            timeRemaining={timeRemaining}
            totalTime={timerDuration}
            isPaused={gameState !== "playing"}
          />
        </div>

        {/* Worship Word Display Card */}
        {currentWord ? (
          <WordCard
            wordEntry={currentWord}
            onNextWord={() => nextTurnWord(false)}
            disabled={gameState !== "playing"}
          />
        ) : (
          <div className="p-8 text-center text-slate-400">Loading Word...</div>
        )}

        {/* Action Controls (Grabbed Mic / Correct / Passed / Time-out) */}
        <div className="w-full max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 my-2">
          {gameState === "playing" && (
            <>
              <button
                onClick={() => handleAwardPoint(1)}
                className="w-full sm:w-1/2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-lg shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-6 h-6" />
                <span>Sung It Correctly (+1)</span>
              </button>

              <button
                onClick={() => nextTurnWord(true)}
                className="w-full sm:w-1/2 py-4 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-lg border border-cyan-500/30 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <FastForward className="w-6 h-6" />
                <span>Pass Turn ➔</span>
              </button>
            </>
          )}

          {gameState === "timeout" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full p-6 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-center space-y-4 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
            >
              <h3 className="text-3xl font-black text-rose-400 uppercase tracking-tight">
                TIME'S UP! 🔔
              </h3>
              <p className="text-sm text-rose-200/80">
                Nobody grabbed the mic in time. Ready for the next word?
              </p>
              <button
                onClick={() => nextTurnWord(true)}
                className="px-8 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-extrabold text-base shadow-lg transition-all active:scale-95"
              >
                Next Turn ➔
              </button>
            </motion.div>
          )}
        </div>

        {/* Song Hint Accordion */}
        {currentWord && (
          <SongHintAccordion
            word={currentWord.word}
            autoRevealDelaySeconds={10}
            timeRemaining={timeRemaining}
            totalTime={timerDuration}
          />
        )}
      </main>

      <footer className="w-full py-4 text-center text-xs text-slate-500 font-medium z-10 border-t border-slate-900">
        Grab The Mic! (Christian Edition) • Powered by iTunes & Web Audio API
      </footer>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400">Loading Game...</div>}>
      <GameContent />
    </Suspense>
  );
}
