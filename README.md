# 🎤 Grab The Mic! (Christian Edition)

A full-stack, real-time party game web app for Christian music trivia.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101)](https://socket.io/)
[![Vitest](https://img.shields.io/badge/Vitest-42%2F42%20Passing-646cff)](https://vitest.dev/)

---

## ✨ Features

- **🎮 4 Distinct Game Modes**:
  - **Pass The Phone**: Single-device turn-based mode with live team scoring.
  - **Host Room (TV / PC)**: Big-screen view showing 4-letter room codes, countdown timer, and live player buzzes.
  - **Join Game (Mobile)**: Mobile browser interface with a giant tactile 3D glowing buzzer.
  - **Practice Mode**: Solo worship trivia with iTunes song hints.
- **🎵 300+ Worship Word Bank**:
  - 305 curated Christian worship words across 4 difficulties (Easy, Medium, Hard, Challenge).
  - Every word mapped to 3+ verified songs with artist, title, release year, and genre tags.
- **🎧 Dynamic iTunes Search API Engine**:
  - 30-second audio preview player.
  - 600x600 high-res album artwork.
  - Offline fallback algorithm so hints never fail.
- **🔊 Web Audio API Synthesizer**:
  - 3-2-1 countdown beeps, ticking clock intensity sound when <10s, buzzer sound on time-out, power-up chord on mic grab, and confetti victory fanfare.

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3005](http://localhost:3005) in your browser.

### 3. Run Unit Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
npm start
```
