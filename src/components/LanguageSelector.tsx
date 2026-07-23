"use client";

import React from "react";
import { Globe } from "lucide-react";

export type Language = "en" | "pt";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  disabled = false,
}) => {
  return (
    <div className="flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
      <Globe className="w-4 h-4 text-cyan-400 ml-1.5" />
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectLanguage("en")}
        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
          selectedLanguage === "en"
            ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <span>🇺🇸</span>
        <span>English</span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onSelectLanguage("pt")}
        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
          selectedLanguage === "pt"
            ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <span>🇵🇹</span>
        <span>Português (Psaltério)</span>
      </button>
    </div>
  );
};
