import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

// In a real app, you would have actual audio files in /public/sounds
// For this demo, we can generate basic oscillator sounds or use base64 data URIs.
// We'll use Howler to set up the architecture as requested.

export function useSoundEffects() {
  const beeps = useRef<Howl | null>(null);
  const ticking = useRef<Howl | null>(null);
  const buzzer = useRef<Howl | null>(null);
  const confettiSound = useRef<Howl | null>(null);

  useEffect(() => {
    // Ideally these load from public/sounds/...
    // Using simple placeholders or real files if they exist.
    beeps.current = new Howl({
      src: ['/sounds/beep.mp3'], // Assuming we have or will have this
      volume: 0.5,
      // Fallback for demonstration since we can't magically create real mp3s easily here without data URIs
    });

    ticking.current = new Howl({
      src: ['/sounds/tick.mp3'],
      volume: 0.4,
      loop: true,
    });

    buzzer.current = new Howl({
      src: ['/sounds/buzzer.mp3'],
      volume: 0.6,
    });

    confettiSound.current = new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.7,
    });

    return () => {
      beeps.current?.unload();
      ticking.current?.unload();
      buzzer.current?.unload();
      confettiSound.current?.unload();
    };
  }, []);

  const playBeep = () => beeps.current?.play();
  const playTicking = () => {
    if (!ticking.current?.playing()) {
      ticking.current?.play();
    }
  };
  const stopTicking = () => ticking.current?.stop();
  const playBuzzer = () => buzzer.current?.play();
  const playSuccess = () => confettiSound.current?.play();

  return { playBeep, playTicking, stopTicking, playBuzzer, playSuccess };
}
