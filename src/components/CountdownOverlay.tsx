"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "@/lib/audio";

interface CountdownOverlayProps {
  onComplete: () => void;
  countFrom?: number;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  onComplete,
  countFrom = 3,
}) => {
  const [count, setCount] = useState<number | string>(countFrom);

  useEffect(() => {
    let current = countFrom;
    audioEngine.playCountdownBeep(false);

    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCount(current);
        audioEngine.playCountdownBeep(false);
      } else if (current === 0) {
        setCount("GRAB THE MIC!");
        audioEngine.playCountdownBeep(true);
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countFrom, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
          animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          className="text-center p-8"
        >
          <span className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 drop-shadow-[0_0_35px_rgba(0,240,255,0.8)]">
            {count}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
