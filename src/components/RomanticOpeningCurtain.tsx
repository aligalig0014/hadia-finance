import React, { useState } from 'react';
import { Heart, Sparkles, Gift, Lock, KeyRound } from 'lucide-react';
import { romanticAudio } from '../utils/romanticAudio';
import confetti from 'canvas-confetti';

interface RomanticOpeningCurtainProps {
  onOpen: () => void;
}

export const RomanticOpeningCurtain: React.FC<RomanticOpeningCurtainProps> = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    romanticAudio.playWaxSealOpen();
    romanticAudio.startBgm();

    // Opening confetti petal burst
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#fef08a', '#fb7185', '#ffffff'],
    });

    setTimeout(() => {
      setHasStarted(true);
      onOpen();
    }, 1200);
  };

  if (hasStarted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${
        isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      } bg-gradient-to-b from-[#130318] via-[#0b020e] to-[#1e0424]`}
    >
      {/* Floating Starlight Background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-rose-200 rounded-full animate-ping"
            style={{
              top: `${(i * 17) % 92}%`,
              left: `${(i * 29) % 95}%`,
              animationDuration: `${2.5 + (i % 4)}s`,
              animationDelay: `${(i % 3) * 0.5}s`,
              opacity: 0.4 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>

      {/* The Royal Royal Velvet Love Letter Box / Envelope */}
      <div className="relative max-w-lg w-full flex flex-col items-center text-center">
        {/* Glow Halo */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-rose-600/25 blur-3xl -z-10 animate-pulse" />

        {/* Small greeting tag */}
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>A Royal Secret For Hadia</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        {/* Envelope Presentation */}
        <div
          onClick={handleOpen}
          className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-rose-900 via-rose-950 to-black border-2 border-amber-400/80 shadow-[0_25px_60px_rgba(244,63,94,0.45)] p-8 flex flex-col items-center justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.98] transition-all overflow-hidden"
        >
          {/* Gold Ribbon Cross */}
          <div className="absolute inset-y-0 w-8 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 shadow-md" />
          <div className="absolute inset-x-0 h-8 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 shadow-md" />

          {/* Golden Filigree Corners */}
          <div className="absolute top-3 left-3 text-amber-400/60 text-lg">✦</div>
          <div className="absolute top-3 right-3 text-amber-400/60 text-lg">✦</div>
          <div className="absolute bottom-3 left-3 text-amber-400/60 text-lg">✦</div>
          <div className="absolute bottom-3 right-3 text-amber-400/60 text-lg">✦</div>

          {/* Top Inscription */}
          <div className="z-10 text-center">
            <span className="font-serif-luxury text-xs tracking-widest text-amber-200 uppercase font-semibold">
              From The Depths Of Ali's Heart
            </span>
          </div>

          {/* Center Royal Wax Seal */}
          <div className="relative z-10 my-auto">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-rose-600 via-rose-800 to-rose-950 border-4 border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.6)] flex flex-col items-center justify-center group-hover:rotate-6 transition-transform">
              <span className="font-cursive text-3xl sm:text-4xl text-amber-100 font-bold">
                A &amp; H
              </span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-amber-300">
                SEAL OF LOVE
              </span>
            </div>
            {/* Glowing Ring around seal */}
            <div className="absolute -inset-2 rounded-full border border-amber-300/40 animate-ping" />
          </div>

          {/* Bottom Inscription */}
          <div className="z-10 text-center">
            <div className="font-cursive text-3xl sm:text-4xl text-rose-100">
              For My Dearest Hadia
            </div>
          </div>
        </div>

        {/* Tap to Unlock Invitation Button */}
        <button
          onClick={handleOpen}
          className="mt-6 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base tracking-wide shadow-[0_0_30px_rgba(244,63,94,0.6)] border border-rose-300 flex items-center gap-2.5 transition active:scale-95 animate-bounce"
        >
          <Heart className="w-5 h-5 fill-white" />
          <span>Open My Love Proposal 💖 (Tap Here)</span>
        </button>

        <p className="mt-3 text-xs text-rose-300/70 font-serif-luxury italic">
          "Turn up your volume for romantic music 🎶"
        </p>
      </div>
    </div>
  );
};
